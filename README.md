# Atlas2TS

Generates typescript interfaces or [zod](https://github.com/colinhacks/zod) typespecs from [atlas](https://atlasgo.io/) DDL specification.

## Usage

```
atlas2ts: Generate typescript interfaces and zod typespecs from atlas HCL files

Parameters:
-h, --help Print help message
-i, --input Path of one or more input files to process
-o, --output Path of output file for generated types (defaults to db-types.ts)
-g, --generator Generator to be used, can be ts (default) or zod
-t, --template name of liquid template file (resolved relative to template root) to feed the generated content into
--template-root Root relative to which templates will be resolved
--naming-strategy Strategy used to derive field & type names from column names and tables. Can be unmodified or camel-case (default)
--type-names Name & type mapping (Can be repeated) eg. -n users.name:Person.handle
--field-names Field name mapping
--field-types Field type mapping
--verbose Enable verbose output (Useful for bug reports)
```

## Example

1. Given an [input hcl](./fixtures/dvdrental.hcl) file, generate [typescript interfaces](./fixtures/dvdrental.ts):

```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.ts
```

2. Given an [input hcl](./fixtures/dvdrental.hcl) file, generate [zod typespecs](./fixtures/dvdrental.zod.ts):

```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.zod.ts -g zod
```

## Customizing the generated code:

### Casing of generated type/field names:

By default atlas2ts will camel-case the names of types and fields as per common convention in js ecosystem. You can also pass `--naming-strategy=unmodified` to prevent this conversion. The type names will always have first character capitalized.

In addition, atlas2ts enables you to selectively override the names of types or fields in generated code.

### Customizing the type names

```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.ts --type-names user:Person
```

In above example the interface generated for `user` table will be `Person` (rather than `User`).

### Customizing field names

Similarly, we can configure the name of fields for specific columns:

```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.ts --field-names user.name:handle
```

Here the field for `name` column of user table will be named as `handle` (rather than `name`).

Please note that atlas2ts does not know how you will use these mapped fields in your code. It is your responsibility to ensure that at runtime the generated SQL uses the correct table/column names.

### Customizing types

Atlas2TS usually makes a sane guess around what db types should be mapped to what TS types.

However, it may need help when custom types or json fields are used.

For these scenarios, you can specify the types to be used in generated through type-mapping or field-types argument.

`--type-mapping` allows you to specify what type should be used for a specific db level type.


```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.ts --type-mapping decimal:string
```

`--field-types` allows you to specify what type should be used for a specific field:

```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.ts --field-types User.email:string
```

Note that the key here is typename.fieldname combination which can be different from tablename.columnname:

```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.ts --field-names user.name:handle --field-types User.handle:string
```

The typename in the key is optional, so we can use just the fieldname to override the type of a field in all tables:

```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.ts --field-types createdAt:Date
```

If these types need to be imported from elsewhere you can also define a [liquid](https://liquidjs.com/) template containing relevant imports into which the output will be injected.

```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.ts --field-names user.name:handle --field-types User.handle:Str --template-root fixtures/templates --template base.ts.liquid
```

`--template-root` should point to a directory where template(s) will be found, and template is the specific template to be used. If this template uses [Partials or layouts](https://liquidjs.com/tutorials/partials-and-layouts.html) those files will also be found from the template-root.

This template must contain a `{{output}}` block where the output will be injected.

For multiple mappings, `--type-names`, `--field-names` or `--field-types` parameter can be passed multiple times.

## License

MIT
