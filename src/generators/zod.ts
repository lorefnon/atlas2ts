import * as _fs from "fs";
import upperFirst from "lodash/upperFirst";
import lowerFirst from "lodash/lowerFirst";
import { DBSchema } from "../DBSchema";
import { TransformConfig } from "../transform";
import { removeInterpolation, applyNamingStrategy } from "./utils";
import { TypePatterns } from "./shared";
import { Generator } from "./Generator";

export const zodGenerator: Generator = {
  generate(dbSchema: DBSchema, config: TransformConfig, outputs: string[]) {
    outputs.push(`import * as z from "zod";`, "");
    const tableNames = Object.keys(dbSchema.table);
    for (const tableName of tableNames) {
      const typeName =
        config.typeNames[tableName] ??
        upperFirst(applyNamingStrategy(tableName, config.namingStrategy));
      outputs.push(`export const ${typeName} = z.object({`);
      const [{ column }] = dbSchema.table[tableName];
      const columnNames = Object.keys(column);
      for (const columnName of columnNames) {
        const [col] = column[columnName];
        const fieldName =
          config.fieldNames[`${tableName}.${columnName}`] ??
          config.fieldNames[columnName] ??
          lowerFirst(applyNamingStrategy(columnName, config.namingStrategy));
        const fieldType =
          config.fieldTypes[`${typeName}.${fieldName}`] ??
          config.fieldTypes[fieldName] ??
          this.getFieldType(removeInterpolation(col.type), config);
        const isOptional = col.null;
        outputs.push(
          `    ${fieldName}: ${fieldType}${isOptional ? ".optional()" : ""},`
        );
      }
      outputs.push(`});`, "");
      outputs.push(`export type I${typeName} = z.infer<typeof ${typeName}>;`, '')
    }
  },
  getFieldType(columnType: string, config: TransformConfig) {
    const fieldType =
      TypePatterns.find((it) => it.pattern.test(columnType))?.fieldType ??
      "any";
    const firstChar = fieldType.charAt(0);
    if (firstChar.toUpperCase() === firstChar) {
      return `z.instanceof(${fieldType})`;
    } else {
      return `z.${fieldType}()`;
    }
  },
};
