#!/usr/bin/env node

import path from "path";
import * as z from "zod";
import minimist from "minimist";
import * as _fs from "fs";
import isArray from 'lodash/isArray'
import compact from 'lodash/compact'
import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'
import transform from 'lodash/transform';
import { GeneratorSpec, NamingStrategySpec, TransformConfig, transformFiles } from "./transform";

const fs = _fs.promises;

const run = async () => {
    let args: minimist.ParsedArgs;
    let normalizedArgs: TransformConfig;
    try {
        args = minimist(process.argv.slice(2), {
            alias: {
                input: ['i'],
                output: ['o'],
                generator: ['g'],
                template: ['t']
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
    const output = await transformFiles(normalizedArgs)
    writeOutputs(output, normalizedArgs.outputPath);
};

const NameMappingSpec = z.array(z.string())
    .refine((names: string[]) => {
        return names.find(mapping =>
            mapping.split(':').length !== 2
        ) == null
    })
    .transform((mapping: string[]) => {
        return transform(mapping, (result, item) => {
            const [source, target] = item.split(':');
            result[source] = target;
        }, {});
    });

const CLIArgsSpec = z.object({
    help: z.boolean().optional(),
    verbose: z.boolean().optional(),
    input: z.array(z.string()).or(z.string()).optional(),
    output: z.string().optional(),
    generator: GeneratorSpec.optional(),
    'field-names': NameMappingSpec.optional(),
    'type-names': NameMappingSpec.optional(),
    'field-types': NameMappingSpec.optional(),
    'naming-strategy': NamingStrategySpec.optional(),
    'template-root': z.string().optional(),
    template: z.string().optional()
});

const printHelp = () => {
    console.log([
        'atlas2ts: Generate typescript interfaces and zod typespecs from atlas HCL files',
        '',
        'Parameters:',
        '-h, --help Print help message',
        '-i, --input Path of one or more input files to process',
        '-o, --output Path of output file for generated types (defaults to db-types.ts)',
        '-g, --generator Generator to be used, can be ts (default) or zod',
        '-t, --template path of liquid template file to feed generated content into',
        '--template-root Root relative to which templates will be resolved',
        '--naming-strategy Strategy used to derive field & type names from column names and tables. Can be unmodified or camel-case (default)',
        '--type-names Name & type mapping (Can be repeated) eg. -n users.name:Person.handle',
        '--field-names Field name mapping',
        '--field-types Field type mapping',
        '--verbose Enable verbose output'
    ].join('\n'));
}

const parseArgs = (args: minimist.ParsedArgs): TransformConfig => {
    const parsed = CLIArgsSpec.parse(args);
    return {
        verbose: !!parsed.verbose,
        generator: parsed.generator ?? "ts",
        inputPaths: compact(
            isArray(parsed.input)
                ? parsed.input
                : [parsed.input]
        ),
        outputPath: isString(parsed.output)
            ? parsed.output
            : path.resolve('db-types.ts'),
        fieldNames: parsed['field-names'] ?? {},
        typeNames: parsed['type-names'] ?? {},
        fieldTypes: parsed['field-types'] ?? {},
        namingStrategy: parsed['naming-strategy'] ?? 'camel-case',
        template: parsed.template,
        templateRoot: parsed['template-root']
    };
}

const writeOutputs = (output: string, outputPath: string) => {
    return fs.writeFile(outputPath, output, { encoding: 'utf8' });
}

run();

