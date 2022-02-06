import { DBSchema } from "../src/DBSchema";
import { transformAtlasConfig, TransformConfig } from "../src/transform";

const baseTransformConfig: TransformConfig = {
  inputPaths: [],
  outputPath: "test.ts",
  generator: "ts",
  fieldNames: {},
  typeNames: {},
  fieldTypes: {},
  namingStrategy: "camel-case",
  verbose: false,
};

test("Does not choke on empty input", async () => {
  expect(
    await transformAtlasConfig([], baseTransformConfig)
  ).toMatchInlineSnapshot(`""`);

  expect(
    await transformAtlasConfig(
      [
        {
          table: {},
        },
      ],

      baseTransformConfig
    )
  ).toMatchInlineSnapshot(`""`);

  expect(
    await transformAtlasConfig(
      [
        {
          table: {
            user: [
              {
                column: {},
              },
            ],
          },
        },
      ],

      baseTransformConfig
    )
  ).toMatchInlineSnapshot(`
    "export interface User {
    }
    "
  `);
});

const minimalSchema: DBSchema = {
  table: {
    user: [
      {
        column: {
          id: [
            {
              type: "${bigint}",
              null: false,
            },
          ],
          name: [
            {
              type: "${varchar(255)}",
              null: true,
            },
          ],
        },
      },
    ],
  },
};

test("Generates typescript with default config", async () => {
  expect(
    await transformAtlasConfig([minimalSchema], {
      ...baseTransformConfig,
      generator: "ts",
    })
  ).toMatchInlineSnapshot(`
    "export interface User {
        id: number;
        name?: string;
    }
    "
  `);
});

test("Generates zod typespec with default config", async () => {
  expect(
    await transformAtlasConfig([minimalSchema], {
      ...baseTransformConfig,
      generator: "zod",
    })
  ).toMatchInlineSnapshot(`
    "import * as z from \\"zod\\"

    export const User = z.object({
        id: z.number(),
        name: z.string().optional(),
    });
    "
  `);
});
