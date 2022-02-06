export const TypePatterns = [
  {
    pattern: /(date|timestamp)/,
    fieldType: "Date",
  },
  {
    pattern: /(int|double|decimal|float|numeric|real)/,
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
