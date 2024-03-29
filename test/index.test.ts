import { DBSchema } from "../src/DBSchema";
import { transformAtlasConfig, TransformConfig } from "../src/transform";
import path from "path";

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

    export interface NewUser {
    }

    export interface UserPatch {
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

const schemaWithDefaultsAndOptionals: DBSchema = {
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
          created_at: [
            {
              type: "${timestamp}",
              default: "now()"
            }
          ]
        },
      },
    ],
  },
}

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

    export interface NewUser {
        id: number;
        name?: string;
    }

    export interface UserPatch {
        id?: number;
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
    "import * as z from "zod";

    export const User = z.object({
        id: z.number(),
        name: z.string().optional(),
    });

    export type IUser = z.infer<typeof User>;

    export const NewUser = z.object({
        id: z.number(),
        name: z.string().optional(),
    });

    export type INewUser = z.infer<typeof User>;

    export const UserPatch = z.object({
        id: z.number().optional(),
        name: z.string().optional(),
    });

    export type IUserPatch = z.infer<typeof User>;
    "
  `);
});

test("Supports injection into external templates", async () => {
  expect(
    await transformAtlasConfig([minimalSchema], {
      ...baseTransformConfig,
      generator: "ts",
      templateRoot: path.join(__dirname, "../fixtures/templates"),
      template: "base.ts.liquid",
    })
  ).toMatchInlineSnapshot(`
    "interface BaseModel {
    }

    export interface User {
        id: number;
        name?: string;
    }

    export interface NewUser {
        id: number;
        name?: string;
    }

    export interface UserPatch {
        id?: number;
        name?: string;
    }

    "
  `);
});

test("Supports overriding types", async () => {
  expect(
    await transformAtlasConfig([minimalSchema], {
      ...baseTransformConfig,
      generator: "ts",
      typeMapping: { bigint: "string" },
    })
  ).toMatchInlineSnapshot(`
    "export interface User {
        id: string;
        name?: string;
    }

    export interface NewUser {
        id: string;
        name?: string;
    }

    export interface UserPatch {
        id?: string;
        name?: string;
    }
    "
  `);
});

test("Supports overriding types by field of specific type", async () => {
  expect(
    await transformAtlasConfig([minimalSchema], {
      ...baseTransformConfig,
      generator: "ts",
      fieldTypes: { "User.id": "string" },
    })
  ).toMatchInlineSnapshot(`
    "export interface User {
        id: string;
        name?: string;
    }

    export interface NewUser {
        id: string;
        name?: string;
    }

    export interface UserPatch {
        id?: string;
        name?: string;
    }
    "
  `);
});
