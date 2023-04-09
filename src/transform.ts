import path from "path";
import * as z from "zod";
import * as _fs from "fs";
import { parseToObject as parseHCL } from "hcl2-parser";
import compact from "lodash/compact";
import flatten from "lodash/flatten";
import { Liquid } from "liquidjs";
import { DBSchema, DBSchemaSpec } from "./DBSchema";
import { tsGenerator } from "./generators/ts";
import { zodGenerator } from "./generators/zod";

const fs = _fs.promises;

export const transformFiles = async (config: TransformConfig) => {
    const parsedInputs: DBSchema[] = await parseInputs(config);
    return transformAtlasConfig(parsedInputs, config);
};

export const transformAtlasConfig = async (
    inputs: DBSchema[],
    config: TransformConfig
) => {
    let output = generateOutput(inputs, config).join("\n");
    if (config.template) {
        const engine = new Liquid({
            root: config.templateRoot
                ? path.resolve(config.templateRoot)
                : process.cwd(),
            extname: ".liquid",
        });
        output = await engine.renderFile(config.template, { output });
    }
    return output;
};

export const NamingStrategySpec = z.enum(["unmodified", "camel-case"]);

export type NamingStrategy = z.TypeOf<typeof NamingStrategySpec>;

export const GeneratorSpec = z.enum(["ts", "zod"]);

type Generator = z.TypeOf<typeof GeneratorSpec>;

export interface TransformConfig {
    inputPaths: string[];
    outputPath: string;
    generator: Generator;
    fieldNames?: Record<string, string>;
    typeMapping?: Record<string, string>;
    typeNames?: Record<string, string>;
    fieldTypes?: Record<string, string>;
    namingStrategy?: NamingStrategy;
    template?: string;
    templateRoot?: string;
    verbose: boolean;
}

const parseInputs = async (config: TransformConfig) =>
    flatten(
        await Promise.all(
            config.inputPaths.map(async (inputPath) => {
                const rawConfig = await fs.readFile(inputPath, "utf8");
                const structuredConfig = parseHCL(rawConfig);
                if (config.verbose) {
                    console.log(
                        "Parsed database schema: ",
                        JSON.stringify(structuredConfig, null, 2)
                    );
                }
                return z.array(DBSchemaSpec).parse(compact(structuredConfig));
            })
        )
    );

const generateOutput = (inputs: DBSchema[], config: TransformConfig) => {
    const outputs: string[] = [];
    for (const dbSchema of inputs) {
        generators[config.generator].generate(dbSchema, config, outputs);
    }
    return outputs;
};

const generators = {
    ts: tsGenerator,
    zod: zodGenerator,
};
