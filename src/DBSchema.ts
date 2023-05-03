import * as z from "zod";

export const ColumnSpec = z.object({
    type: z.string(),
    default: z.any().optional(),
    null: z.boolean().optional()
});

export type Column = z.TypeOf<typeof ColumnSpec>;

export const TableSpec = z.object({
    column: z.record(z.array(ColumnSpec))
});

export type Table = z.TypeOf<typeof TableSpec>;

export const DBSchemaSpec = z.object({
    table: z.record(z.array(TableSpec))
});

export type DBSchema = z.TypeOf<typeof DBSchemaSpec>;
