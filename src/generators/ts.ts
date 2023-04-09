import * as _fs from "fs";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import lowerFirst from "lodash/lowerFirst";
import { DBSchema } from "../DBSchema";
import { TransformConfig } from "../transform";
import { removeInterpolation } from "./utils";
import { getBareType, TypePatterns } from "./shared";
import { Generator } from "./Generator";

export const tsGenerator: Generator = {
  generate(dbSchema: DBSchema, config: TransformConfig, outputs: string[]) {
    const tableNames = Object.keys(dbSchema.table);
    for (const tableName of tableNames) {
      const typeName =
        config.typeNames?.[tableName] ??
        upperFirst(
          config.namingStrategy === "camel-case"
            ? camelCase(tableName)
            : tableName.replace(/\s/g, "")
        );
      outputs.push(`export interface ${typeName} {`);
      const [{ column }] = dbSchema.table[tableName];
      const columnNames = Object.keys(column);
      for (const columnName of columnNames) {
        const [col] = column[columnName];
        const fieldName =
          config.fieldNames?.[`${tableName}.${columnName}`] ??
          config.fieldNames?.[columnName] ??
          lowerFirst(
            config.namingStrategy === "camel-case"
              ? camelCase(columnName)
              : columnName.replace(/\s/g, "")
          );
        const colType = removeInterpolation(col.type);
        const bareColType = getBareType(colType);

        const fieldType =
          config.fieldTypes?.[`${typeName}.${fieldName}`] ??
          config.fieldTypes?.[fieldName] ??
          config.typeMapping?.[colType] ??
          config.typeMapping?.[bareColType] ??
          this.getFieldType(colType, config);
        const isOptional = col.null;
        outputs.push(`    ${fieldName}${isOptional ? "?" : ""}: ${fieldType};`);
      }
      outputs.push(`}`, "");
    }
  },
  getFieldType(columnType: string, config: TransformConfig) {
    return (
      TypePatterns.find((it) => it.pattern.test(columnType))?.fieldType ?? "any"
    );
  },
};
