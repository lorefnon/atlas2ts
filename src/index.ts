#!/usr/bin/env node

import path from "path";
import * as z from "zod";
import minimist from "minimist";
import * as _fs from "fs";
import {parseToObject as parseHCL} from "hcl2-parser";
import isArray from 'lodash/isArray'
import compact from 'lodash/compact'
import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import transform from 'lodash/transform';
import lowerFirst from 'lodash/lowerFirst';

const fs = _fs.promises;

const run = async () => {
    let args: minimist.ParsedArgs;
    let normalizedArgs: NormalizedConfig;
    try {
        args = minimist(process.argv.slice(2), {
            alias: {
                input: ['i'],
                output: ['o'],
                generator: ['g']
            }
        });
        normalizedArgs = parseArgs(args);
        if (isEmpty(normalizedArgs.inputPaths)) {
            printHelp();
            return;
        }
    } catch (e) {
        if (args.verbose) {
            console.error(e);
        }
        console.error('Invalid args provided');
        printHelp();
        process.exit(1);
    }
    const parsedInputs = await parseInputs(normalizedArgs);
    const outputs = generateOutput(parsedInputs, normalizedArgs);
    writeOutputs(outputs, normalizedArgs.outputPath);
};

const refineMapping = (names: string[]) => {
    return names.find(mapping =>
        mapping.split(':').length !== 2
    ) == null
}

const transformMapping = (mapping: string[]) => {
    return transform(mapping, (result, item) => {
        const [source, target] = item.split(':');
        result[source] = target;
    }, {});
}

const NameMappingSpec = z.array(z.string())
    .refine(refineMapping)
    .transform(transformMapping);

const NamingStrategySpec = z.literal('unmodified').or(z.literal('camel-case'));

type NamingStrategy = z.TypeOf<typeof NamingStrategySpec>

const GeneratorSpec = z.union([
    z.literal("ts"),
    z.literal("zod")
]);

type Generator = z.TypeOf<typeof GeneratorSpec>;

const CLIArgsSpec = z.object({
    help: z.boolean().optional(),
    input: z.array(z.string()).or(z.string()).optional(),
    output: z.string().optional(),
    generator: GeneratorSpec.optional(),
    'field-names': NameMappingSpec.optional(),
    'type-names': NameMappingSpec.optional(),
    'field-types': NameMappingSpec.optional(),
    'naming-strategy': NamingStrategySpec.optional(),
    template: z.string().optional()
});

const ColumnSpec = z.object({
    type: z.string(),
    null: z.boolean().optional()
});

const TableSpec = z.object({
    column: z.record(z.array(ColumnSpec))
});

const DBSchemaSpec = z.object({
    table: z.record(z.array(TableSpec))
});

type DBSchema = z.TypeOf<typeof DBSchemaSpec>;

interface NormalizedConfig {
    inputPaths: string[];
    outputPath: string;
    generator: Generator;
    templatePath?: string;
    fieldNames: Record<string, string>,
    typeNames: Record<string, string>,
    fieldTypes: Record<string, string>,
    namingStrategy: z.TypeOf<typeof NamingStrategySpec>,
    verbose: boolean
}

const printHelp = () => {
    console.log([
        'atlas2ts: Generate typescript interfaces and zod typespecs from atlas HCL files',
        '',
        'Parameters:',
        '-h, --help Print help message',
        '-i, --input Path of one or more input files to process',
        '-o, --output Path of output file for generated types (defaults to db-types.ts)',
        '-g, --generator Generator to be used, can be ts (default) or zod',
        '--naming-strategy Strategy used to derive field & type names from column names and tables. Can be unmodified or camel-case (default)',
        // '-t, --template Path to template file, useful for prepending or appending additional code into the generated file',
        '--type-names Name & type mapping (Can be repeated) eg. -n users.name:Person.handle',
        '--field-names Field name mapping',
        '--field-types Field type mapping',
        '--verbose Enable verbose output'
    ].join('\n'));
}

const parseArgs = (args: minimist.ParsedArgs): NormalizedConfig => {
    const parsed = CLIArgsSpec.parse(args);
    return {
        verbose: !!args.verbose,
        generator: args.generator ?? "ts",
        inputPaths: compact(
            isArray(parsed.input)
                ? parsed.input
                : [parsed.input]
        ),
        outputPath: isString(args.output)
            ? args.output
            : path.resolve('db-types.ts'),
        fieldNames: args['field-names'] ?? {},
        typeNames: args['type-names'] ?? {},
        fieldTypes: args['field-types'] ?? {},
        namingStrategy: args['naming-strategy'] ?? 'camel-case'
    };
}

const parseInputs = async (args: NormalizedConfig) =>
    Promise.all(args.inputPaths.map(async (inputPath) => {
        const rawConfig = await fs.readFile(inputPath, 'utf8');
        const structuredConfig = parseHCL(rawConfig);
        if (args.verbose) {
            console.log('Parsed database schema: ', JSON.stringify(structuredConfig, null, 2));
        }
        return z.array(DBSchemaSpec).parse(compact(structuredConfig));
    }))

const generateOutput = (dbSchemaNList: DBSchema[][], config: NormalizedConfig) => {
    const outputs: string[] = [];
    for (const dbSchemaList of dbSchemaNList) {
        for (const dbSchema of dbSchemaList) {
            generators[config.generator].generate(dbSchema, config, outputs);
        }
    }
    return outputs;
}

const removeInterpolation = (str: string) => {
    const interpolationMatch = str.match(/^\$\{(.*)\}$/);
    if (!interpolationMatch) return str;
    return interpolationMatch[1];
}

const TypePatterns = [{
    pattern: /(date|timestamp)/,
    fieldType: 'Date'
}, {
    pattern: /(int|double|decimal|float|numeric|real)/,
    fieldType: 'number'
}, {
    pattern: /(char|character|text|uuid)/,
    fieldType: 'string'
}, {
    pattern: /(bit|bool)/,
    fieldType: 'boolean'
}]

const generators = {
    ts: {
        generate(dbSchema: DBSchema, config: NormalizedConfig, outputs: string[]) {
            const tableNames = Object.keys(dbSchema.table);
            for (const tableName of tableNames) {
                const typeName = config.typeNames[tableName] ??
                    upperFirst(config.namingStrategy === 'camel-case' ? camelCase(tableName) : tableName.replace(/\s/g, ''));
                outputs.push(`export interface ${typeName} {`);
                const [{column}] = dbSchema.table[tableName];
                const columnNames = Object.keys(column);
                for (const columnName of columnNames) {
                    const [col] = column[columnName];
                    const fieldName = config.fieldNames[`${tableName}.${columnName}`] ??
                        config.fieldNames[columnName] ??
                        lowerFirst(
                            config.namingStrategy === 'camel-case'
                                ? camelCase(columnName)
                                : columnName.replace(/\s/g, '')
                        );
                    const fieldType = config.fieldTypes[`${typeName}.${fieldName}`] ??
                        config.fieldTypes[fieldName] ??
                        this.getFieldType(col.type);
                    const isOptional = col.null;
                    outputs.push(`    ${fieldName}${isOptional ? '?' : ''}: ${fieldType};`);
                }
                outputs.push(`}`, '');
            }
        },
        getFieldType(columnType: string, config: NormalizedConfig) {
            return TypePatterns.find(it => it.pattern.test(columnType))?.fieldType ?? 'any';
        },
    },
    zod: {
        generate(dbSchema: DBSchema, config: NormalizedConfig, outputs: string[]) {
            outputs.push(`import * as z from "zod"`, '');
            const tableNames = Object.keys(dbSchema.table);
            for (const tableName of tableNames) {
                const typeName = config.typeNames[tableName] ??
                    upperFirst(applyNamingStrategy(tableName, config.namingStrategy));
                outputs.push(`export const ${typeName} = z.object({`);
                const [{column}] = dbSchema.table[tableName];
                const columnNames = Object.keys(column);
                for (const columnName of columnNames) {
                    const [col] = column[columnName];
                    const fieldName = config.fieldNames[`${tableName}.${columnName}`] ??
                        config.fieldNames[columnName] ??
                        lowerFirst(applyNamingStrategy(columnName, config.namingStrategy));
                    const fieldType = config.fieldTypes[`${typeName}.${fieldName}`] ??
                        config.fieldTypes[fieldName] ??
                        this.getFieldType(col.type);
                    const isOptional = col.null;
                    outputs.push(`    ${fieldName}: ${fieldType}${isOptional ? '.optional()' : ''},`);
                }
                outputs.push(`});`, '');
            }
        },
        getFieldType(columnType: string, config: NormalizedConfig) {
            const fieldType = TypePatterns.find(it => it.pattern.test(columnType))?.fieldType ?? 'any';
            const firstChar = fieldType.charAt(0);
            if (firstChar.toUpperCase() === firstChar) {
                return `z.instanceof(${fieldType})`;
            } else {
                return `z.${fieldType}()`
            }
        }
    }
}

const applyNamingStrategy = (name: string, namingStrategy: NamingStrategy) => {
    return namingStrategy === 'camel-case'
        ? camelCase(name)
        : name.replace(/\s/g, '')
}

const writeOutputs = (outputs: string[], outputPath: string) => {
    const consolidated = outputs.join('\n');
    fs.writeFile(outputPath, consolidated, {encoding: 'utf8'})
}


run();

