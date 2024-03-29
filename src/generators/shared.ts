import { Column } from "../DBSchema";

export const TypePatterns = [
  {
    pattern: /(date|timestamp)/,
    fieldType: "Date",
  },
  {
    pattern: /(int|double|decimal|float|numeric|real|serial)/,
    fieldType: "number",
  },
  {
    pattern: /(char|character|text|uuid)/,
    fieldType: "string",
  },
  {
    pattern: /(bit|bool)/,
    fieldType: "boolean",
  },
];

export const getBareType = (colType: string) => {
  const m = colType.match(/^\s*(\S+)\s*\(.*\)$/);
  if (!m) return colType;
  return m[1];
};

export interface GeneratedEntityType {
  type: string;
  prefix?: string;
  suffix?: string;
}

export const EntityTypes = [
  {
    type: "base",
  },
  {
    type: "new",
    prefix: "New",
  },
  {
    type: "patch",
    suffix: "Patch",
  },
];

export const isFieldOptional = (col: Column, type: string) => {
  if (type === "base") return col.null;
  if (type === "patch") return true;
  if (type === "new") return col.null || !!col.default;
  return false;
};
