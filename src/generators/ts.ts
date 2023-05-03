import * as _fs from "fs";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import lowerFirst from "lodash/lowerFirst";
import { DBSchema } from "../DBSchema";
import { TransformConfig } from "../transform";
import { removeInterpolation } from "./utils";
import {
  EntityTypes,
  getBareType,
  isFieldOptional,
  TypePatterns,
} from "./shared";
import { Generator } from "./Generator";
import { applyNamingStrategy } from "./utils";

export const tsGenerator: Generator = {
  generate(dbSchema: DBSchema, config: TransformConfig, outputs: string[]) {
    const tableNames = Object.keys(dbSchema.table);
    for (const tableName of tableNames) {
      for (const etype of EntityTypes) {
        const typeName =
          config.typeNames?.[tableName] ??
          upperFirst(
            config.namingStrategy === "camel-case"
              ? camelCase(tableName)
              : tableName.replace(/\s/g, "")
          );
        const prefix = etype.prefix ?? "";
        const suffix = etype.suffix ?? "";
        outputs.push(`export interface ${prefix}${typeName}${suffix} {`);
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
            `    ${fieldName}${isOptional ? "?" : ""}: ${fieldType};`
          );
        }
        outputs.push(`}`, "");
      }
    }
  },
  getFieldType(columnType: string, config: TransformConfig) {
    return (
      TypePatterns.find((it) => it.pattern.test(columnType))?.fieldType ?? "any"
    );
  },
};
