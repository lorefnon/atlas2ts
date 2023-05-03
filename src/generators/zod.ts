import * as _fs from "fs";
import upperFirst from "lodash/upperFirst";
import lowerFirst from "lodash/lowerFirst";
import { DBSchema } from "../DBSchema";
import { TransformConfig } from "../transform";
import { removeInterpolation, applyNamingStrategy } from "./utils";
import { EntityTypes, getBareType, isFieldOptional, TypePatterns } from "./shared";
import { Generator } from "./Generator";

export const zodGenerator: Generator = {
  generate(dbSchema: DBSchema, config: TransformConfig, outputs: string[]) {
    outputs.push(`import * as z from "zod";`, "");
    const tableNames = Object.keys(dbSchema.table);
    for (const tableName of tableNames) {
      for (const etype of EntityTypes) {
        const typeName =
          config.typeNames?.[tableName] ??
          upperFirst(applyNamingStrategy(tableName, config.namingStrategy));
        const prefix = etype.prefix ?? "";
        const suffix = etype.suffix ?? "";

        outputs.push(`export const ${prefix}${typeName}${suffix} = z.object({`);
        const [{ column }] = dbSchema.table[tableName];
        const columnNames = Object.keys(column);
        for (const columnName of columnNames) {
          const [col] = column[columnName];
          const fieldName =
            config.fieldNames?.[`${tableName}.${columnName}`] ??
            config.fieldNames?.[columnName] ??
            lowerFirst(applyNamingStrategy(columnName, config.namingStrategy));
          const colType = removeInterpolation(col.type);
          const bareColType = getBareType(colType);
          const fieldType =
            config.fieldTypes?.[`${typeName}.${fieldName}`] ??
            config.fieldTypes?.[fieldName] ??
            config.typeMapping?.[colType] ??
            config.typeMapping?.[bareColType] ??
            this.getFieldType(colType, config);
          const isOptional = isFieldOptional(col, etype.type);
          outputs.push(
            `    ${fieldName}: ${fieldType}${isOptional ? ".optional()" : ""},`
          );
        }
        outputs.push(`});`, "");
        outputs.push(
          `export type I${prefix}${typeName}${suffix} = z.infer<typeof ${typeName}>;`,
          ""
        );
      }
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
