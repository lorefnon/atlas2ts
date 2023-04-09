import * as z from "zod";

export const Actor = z.object({
    actorId: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    lastUpdate: z.instanceof(Date),
});

export type IActor = z.infer<typeof Actor>;

export const Address = z.object({
    address: z.string(),
    address2: z.string().optional(),
    addressId: z.number(),
    cityId: z.number(),
    district: z.string(),
    lastUpdate: z.instanceof(Date),
    phone: z.string(),
    postalCode: z.string().optional(),
});

export type IAddress = z.infer<typeof Address>;

export const Category = z.object({
    categoryId: z.number(),
    lastUpdate: z.instanceof(Date),
    name: z.string(),
});

export type ICategory = z.infer<typeof Category>;

export const City = z.object({
    city: z.string(),
    cityId: z.number(),
    countryId: z.number(),
    lastUpdate: z.instanceof(Date),
});

export type ICity = z.infer<typeof City>;

export const Country = z.object({
    country: z.string(),
    countryId: z.number(),
    lastUpdate: z.instanceof(Date),
});

export type ICountry = z.infer<typeof Country>;

export const Customer = z.object({
    active: z.number().optional(),
    activebool: z.boolean(),
    addressId: z.number(),
    createDate: z.instanceof(Date),
    customerId: z.number(),
    email: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    lastUpdate: z.instanceof(Date).optional(),
    storeId: z.number(),
});

export type ICustomer = z.infer<typeof Customer>;

export const Film = z.object({
    description: z.string().optional(),
    filmId: z.number(),
    fulltext: z.any(),
    languageId: z.number(),
    lastUpdate: z.instanceof(Date),
    length: z.number().optional(),
    rating: z.any().optional(),
    releaseYear: z.number().optional(),
    rentalDuration: z.number(),
    rentalRate: z.number(),
    replacementCost: z.number(),
    specialFeatures: z.string().optional(),
    title: z.string(),
});

export type IFilm = z.infer<typeof Film>;

export const FilmActor = z.object({
    actorId: z.number(),
    filmId: z.number(),
    lastUpdate: z.instanceof(Date),
});

export type IFilmActor = z.infer<typeof FilmActor>;

export const FilmCategory = z.object({
    categoryId: z.number(),
    filmId: z.number(),
    lastUpdate: z.instanceof(Date),
});

export type IFilmCategory = z.infer<typeof FilmCategory>;

export const Inventory = z.object({
    filmId: z.number(),
    inventoryId: z.number(),
    lastUpdate: z.instanceof(Date),
    storeId: z.number(),
});

export type IInventory = z.infer<typeof Inventory>;

export const Language = z.object({
    languageId: z.number(),
    lastUpdate: z.instanceof(Date),
    name: z.string(),
});

export type ILanguage = z.infer<typeof Language>;

export const Payment = z.object({
    amount: z.number(),
    customerId: z.number(),
    paymentDate: z.instanceof(Date),
    paymentId: z.number(),
    rentalId: z.number(),
    staffId: z.number(),
});

export type IPayment = z.infer<typeof Payment>;

export const Rental = z.object({
    customerId: z.number(),
    inventoryId: z.number(),
    lastUpdate: z.instanceof(Date),
    rentalDate: z.instanceof(Date),
    rentalId: z.number(),
    returnDate: z.instanceof(Date).optional(),
    staffId: z.number(),
});

export type IRental = z.infer<typeof Rental>;

export const Staff = z.object({
    active: z.boolean(),
    addressId: z.number(),
    email: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
    lastUpdate: z.instanceof(Date),
    password: z.string().optional(),
    picture: z.any().optional(),
    staffId: z.number(),
    storeId: z.number(),
    username: z.string(),
});

export type IStaff = z.infer<typeof Staff>;

export const Store = z.object({
    addressId: z.number(),
    lastUpdate: z.instanceof(Date),
    managerStaffId: z.number(),
    storeId: z.number(),
});

export type IStore = z.infer<typeof Store>;
