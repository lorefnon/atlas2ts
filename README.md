# Atlas2TS

Generates typescript interfaces or [zod](https://github.com/colinhacks/zod) typespecs from [atlas](https://atlasgo.io/) DDL specification.

## Usage

```
Parameters:

-h, --help Print help message
-i, --input Path of one or more input files to process
-o, --output Path of output file for generated types (defaults to db-types.ts)
-g, --generator Generator to be used, can be ts (default) or zod
--naming-strategy Strategy used to derive field & type names from column names and tables. Can be unmodified or camel-case (default)
--type-names Name & type mapping (Can be repeated) eg. --type-names user:Person
--field-names Field name mapping (Can be repeated) eg. --type-names user.email:emailAddress
--field-types Field type mapping (Can be repeated) eg. --field-types User.emailAddress:Email
--verbose Enable verbose output (Useful for error reports)
```

## Example

1. Given an [input hcl](./fixtures/dvdrental.hcl) file, generate [typescript interfaces](./fixtures/dvdrental.ts):

```
atlas2ts -i fixtures/dvdrental.hcl --verbose -o fixtures/dvdrental.ts
```

2. Given an [input hcl](./fixtures/dvdrental.hcl) file, generate [zod typespecs](./fixtures/dvdrental.zod.ts):

```
atlas2ts -i fixtures/dvdrental.hcl -o fixtures/dvdrental.zod.ts -g zod
```

## License

MIT
