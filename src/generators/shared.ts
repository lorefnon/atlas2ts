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
  const m = colType.match(/^\s*(\S+)\s*\(.*\)$/)
  if (!m) return colType
  return m[1]
}
