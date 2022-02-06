import type { DBSchema } from "../DBSchema";
import type { TransformConfig } from "../transform";

export interface Generator {
  generate(
    dbSchema: DBSchema,
    config: TransformConfig,
    outputs: string[]
  ): void;
  getFieldType(columnType: string, config: TransformConfig): string;
}
