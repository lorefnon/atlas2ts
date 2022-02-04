table "actor" {
  schema = schema.public
  column "actor_id" {
    null    = false
    type    = integer
    default = sql("nextval('actor_actor_id_seq'::regclass)")
  }
  column "first_name" {
    null = false
    type = character_varying(45)
  }
  column "last_name" {
    null = false
    type = character_varying(45)
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.actor.column.actor_id]
  }
  index "idx_actor_last_name" {
    columns = [table.actor.column.last_name]
  }
}
table "address" {
  schema = schema.public
  column "address_id" {
    null    = false
    type    = integer
    default = sql("nextval('address_address_id_seq'::regclass)")
  }
  column "address" {
    null = false
    type = character_varying(50)
  }
  column "address2" {
    null = true
    type = character_varying(50)
  }
  column "district" {
    null = false
    type = character_varying(20)
  }
  column "city_id" {
    null = false
    type = smallint
  }
  column "postal_code" {
    null = true
    type = character_varying(10)
  }
  column "phone" {
    null = false
    type = character_varying(20)
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.address.column.address_id]
  }
  foreign_key "fk_address_city" {
    columns     = [table.address.column.city_id]
    ref_columns = [table.city.column.city_id]
    on_update   = "NO ACTION"
    on_delete   = "NO ACTION"
  }
  index "idx_fk_city_id" {
    columns = [table.address.column.city_id]
  }
}
table "category" {
  schema = schema.public
  column "category_id" {
    null    = false
    type    = integer
    default = sql("nextval('category_category_id_seq'::regclass)")
  }
  column "name" {
    null = false
    type = character_varying(25)
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.category.column.category_id]
  }
}
table "city" {
  schema = schema.public
  column "city_id" {
    null    = false
    type    = integer
    default = sql("nextval('city_city_id_seq'::regclass)")
  }
  column "city" {
    null = false
    type = character_varying(50)
  }
  column "country_id" {
    null = false
    type = smallint
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.city.column.city_id]
  }
  foreign_key "fk_city" {
    columns     = [table.city.column.country_id]
    ref_columns = [table.country.column.country_id]
    on_update   = "NO ACTION"
    on_delete   = "NO ACTION"
  }
  index "idx_fk_country_id" {
    columns = [table.city.column.country_id]
  }
}
table "country" {
  schema = schema.public
  column "country_id" {
    null    = false
    type    = integer
    default = sql("nextval('country_country_id_seq'::regclass)")
  }
  column "country" {
    null = false
    type = character_varying(50)
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.country.column.country_id]
  }
}
table "customer" {
  schema = schema.public
  column "customer_id" {
    null    = false
    type    = integer
    default = sql("nextval('customer_customer_id_seq'::regclass)")
  }
  column "store_id" {
    null = false
    type = smallint
  }
  column "first_name" {
    null = false
    type = character_varying(45)
  }
  column "last_name" {
    null = false
    type = character_varying(45)
  }
  column "email" {
    null = true
    type = character_varying(50)
  }
  column "address_id" {
    null = false
    type = smallint
  }
  column "activebool" {
    null    = false
    type    = boolean
    default = true
  }
  column "create_date" {
    null    = false
    type    = date
    default = sql("('now'::text)::date")
  }
  column "last_update" {
    null    = true
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  column "active" {
    null = true
    type = integer
  }
  primary_key {
    columns = [table.customer.column.customer_id]
  }
  foreign_key "customer_address_id_fkey" {
    columns     = [table.customer.column.address_id]
    ref_columns = [table.address.column.address_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  index "idx_fk_address_id" {
    columns = [table.customer.column.address_id]
  }
  index "idx_fk_store_id" {
    columns = [table.customer.column.store_id]
  }
  index "idx_last_name" {
    columns = [table.customer.column.last_name]
  }
}
table "film" {
  schema = schema.public
  column "film_id" {
    null    = false
    type    = integer
    default = sql("nextval('film_film_id_seq'::regclass)")
  }
  column "title" {
    null = false
    type = character_varying(255)
  }
  column "description" {
    null = true
    type = text
  }
  column "release_year" {
    null = true
    type = integer
  }
  column "language_id" {
    null = false
    type = smallint
  }
  column "rental_duration" {
    null    = false
    type    = smallint
    default = 3
  }
  column "rental_rate" {
    null    = false
    type    = numeric
    default = 4.99
  }
  column "length" {
    null = true
    type = smallint
  }
  column "replacement_cost" {
    null    = false
    type    = numeric
    default = 19.99
  }
  column "rating" {
    null    = true
    type    = enum.mpaa_rating
    default = sql("'G'::mpaa_rating")
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  column "special_features" {
    null = true
    type = sql("text[]")
  }
  column "fulltext" {
    null = false
    type = sql("tsvector")
  }
  primary_key {
    columns = [table.film.column.film_id]
  }
  foreign_key "film_language_id_fkey" {
    columns     = [table.film.column.language_id]
    ref_columns = [table.language.column.language_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  index "film_fulltext_idx" {
    columns = [table.film.column.fulltext]
  }
  index "idx_fk_language_id" {
    columns = [table.film.column.language_id]
  }
  index "idx_title" {
    columns = [table.film.column.title]
  }
}
table "film_actor" {
  schema = schema.public
  column "actor_id" {
    null = false
    type = smallint
  }
  column "film_id" {
    null = false
    type = smallint
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.film_actor.column.actor_id, table.film_actor.column.film_id]
  }
  foreign_key "film_actor_actor_id_fkey" {
    columns     = [table.film_actor.column.actor_id]
    ref_columns = [table.actor.column.actor_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  foreign_key "film_actor_film_id_fkey" {
    columns     = [table.film_actor.column.film_id]
    ref_columns = [table.film.column.film_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  index "idx_fk_film_id" {
    columns = [table.film_actor.column.film_id]
  }
}
table "film_category" {
  schema = schema.public
  column "film_id" {
    null = false
    type = smallint
  }
  column "category_id" {
    null = false
    type = smallint
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.film_category.column.film_id, table.film_category.column.category_id]
  }
  foreign_key "film_category_category_id_fkey" {
    columns     = [table.film_category.column.category_id]
    ref_columns = [table.category.column.category_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  foreign_key "film_category_film_id_fkey" {
    columns     = [table.film_category.column.film_id]
    ref_columns = [table.film.column.film_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
}
table "inventory" {
  schema = schema.public
  column "inventory_id" {
    null    = false
    type    = integer
    default = sql("nextval('inventory_inventory_id_seq'::regclass)")
  }
  column "film_id" {
    null = false
    type = smallint
  }
  column "store_id" {
    null = false
    type = smallint
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.inventory.column.inventory_id]
  }
  foreign_key "inventory_film_id_fkey" {
    columns     = [table.inventory.column.film_id]
    ref_columns = [table.film.column.film_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  index "idx_store_id_film_id" {
    columns = [table.inventory.column.store_id, table.inventory.column.film_id]
  }
}
table "language" {
  schema = schema.public
  column "language_id" {
    null    = false
    type    = integer
    default = sql("nextval('language_language_id_seq'::regclass)")
  }
  column "name" {
    null = false
    type = character(20)
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.language.column.language_id]
  }
}
table "payment" {
  schema = schema.public
  column "payment_id" {
    null    = false
    type    = integer
    default = sql("nextval('payment_payment_id_seq'::regclass)")
  }
  column "customer_id" {
    null = false
    type = smallint
  }
  column "staff_id" {
    null = false
    type = smallint
  }
  column "rental_id" {
    null = false
    type = integer
  }
  column "amount" {
    null = false
    type = numeric
  }
  column "payment_date" {
    null = false
    type = timestamp_without_time_zone(6)
  }
  primary_key {
    columns = [table.payment.column.payment_id]
  }
  foreign_key "payment_customer_id_fkey" {
    columns     = [table.payment.column.customer_id]
    ref_columns = [table.customer.column.customer_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  foreign_key "payment_rental_id_fkey" {
    columns     = [table.payment.column.rental_id]
    ref_columns = [table.rental.column.rental_id]
    on_update   = "CASCADE"
    on_delete   = "SET NULL"
  }
  foreign_key "payment_staff_id_fkey" {
    columns     = [table.payment.column.staff_id]
    ref_columns = [table.staff.column.staff_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  index "idx_fk_customer_id" {
    columns = [table.payment.column.customer_id]
  }
  index "idx_fk_rental_id" {
    columns = [table.payment.column.rental_id]
  }
  index "idx_fk_staff_id" {
    columns = [table.payment.column.staff_id]
  }
}
table "rental" {
  schema = schema.public
  column "rental_id" {
    null    = false
    type    = integer
    default = sql("nextval('rental_rental_id_seq'::regclass)")
  }
  column "rental_date" {
    null = false
    type = timestamp_without_time_zone(6)
  }
  column "inventory_id" {
    null = false
    type = integer
  }
  column "customer_id" {
    null = false
    type = smallint
  }
  column "return_date" {
    null = true
    type = timestamp_without_time_zone(6)
  }
  column "staff_id" {
    null = false
    type = smallint
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.rental.column.rental_id]
  }
  foreign_key "rental_customer_id_fkey" {
    columns     = [table.rental.column.customer_id]
    ref_columns = [table.customer.column.customer_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  foreign_key "rental_inventory_id_fkey" {
    columns     = [table.rental.column.inventory_id]
    ref_columns = [table.inventory.column.inventory_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  foreign_key "rental_staff_id_key" {
    columns     = [table.rental.column.staff_id]
    ref_columns = [table.staff.column.staff_id]
    on_update   = "NO ACTION"
    on_delete   = "NO ACTION"
  }
  index "idx_fk_inventory_id" {
    columns = [table.rental.column.inventory_id]
  }
  index "idx_unq_rental_rental_date_inventory_id_customer_id" {
    unique  = true
    columns = [table.rental.column.rental_date, table.rental.column.inventory_id, table.rental.column.customer_id]
  }
}
table "staff" {
  schema = schema.public
  column "staff_id" {
    null    = false
    type    = integer
    default = sql("nextval('staff_staff_id_seq'::regclass)")
  }
  column "first_name" {
    null = false
    type = character_varying(45)
  }
  column "last_name" {
    null = false
    type = character_varying(45)
  }
  column "address_id" {
    null = false
    type = smallint
  }
  column "email" {
    null = true
    type = character_varying(50)
  }
  column "store_id" {
    null = false
    type = smallint
  }
  column "active" {
    null    = false
    type    = boolean
    default = true
  }
  column "username" {
    null = false
    type = character_varying(16)
  }
  column "password" {
    null = true
    type = character_varying(40)
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  column "picture" {
    null = true
    type = bytea
  }
  primary_key {
    columns = [table.staff.column.staff_id]
  }
  foreign_key "staff_address_id_fkey" {
    columns     = [table.staff.column.address_id]
    ref_columns = [table.address.column.address_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
}
table "store" {
  schema = schema.public
  column "store_id" {
    null    = false
    type    = integer
    default = sql("nextval('store_store_id_seq'::regclass)")
  }
  column "manager_staff_id" {
    null = false
    type = smallint
  }
  column "address_id" {
    null = false
    type = smallint
  }
  column "last_update" {
    null    = false
    type    = timestamp_without_time_zone(6)
    default = sql("now()")
  }
  primary_key {
    columns = [table.store.column.store_id]
  }
  foreign_key "store_address_id_fkey" {
    columns     = [table.store.column.address_id]
    ref_columns = [table.address.column.address_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  foreign_key "store_manager_staff_id_fkey" {
    columns     = [table.store.column.manager_staff_id]
    ref_columns = [table.staff.column.staff_id]
    on_update   = "CASCADE"
    on_delete   = "RESTRICT"
  }
  index "idx_unq_manager_staff_id" {
    unique  = true
    columns = [table.store.column.manager_staff_id]
  }
}
schema "public" {
}
enum "mpaa_rating" {
  schema = schema.public
  values = ["G", "PG", "PG-13", "R", "NC-17"]
}
