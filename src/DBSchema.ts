import * as z from "zod";

export const ColumnSpec = z.object({
    type: z.string(),
    null: z.boolean().optional()
});

export const TableSpec = z.object({
    column: z.record(z.array(ColumnSpec))
});

export const DBSchemaSpec = z.object({
    table: z.record(z.array(TableSpec))
});

export type DBSchema = z.TypeOf<typeof DBSchemaSpec>;