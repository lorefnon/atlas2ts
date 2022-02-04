export interface Actor {
    actorId: number;
    firstName: string;
    lastName: string;
    lastUpdate: Date;
}

export interface Address {
    address: string;
    address2?: string;
    addressId: number;
    cityId: number;
    district: string;
    lastUpdate: Date;
    phone: string;
    postalCode?: string;
}

export interface Category {
    categoryId: number;
    lastUpdate: Date;
    name: string;
}

export interface City {
    city: string;
    cityId: number;
    countryId: number;
    lastUpdate: Date;
}

export interface Country {
    country: string;
    countryId: number;
    lastUpdate: Date;
}

export interface Customer {
    active?: number;
    activebool: boolean;
    addressId: number;
    createDate: Date;
    customerId: number;
    email?: string;
    firstName: string;
    lastName: string;
    lastUpdate?: Date;
    storeId: number;
}

export interface Film {
    description?: string;
    filmId: number;
    fulltext: any;
    languageId: number;
    lastUpdate: Date;
    length?: number;
    rating?: any;
    releaseYear?: number;
    rentalDuration: number;
    rentalRate: number;
    replacementCost: number;
    specialFeatures?: string;
    title: string;
}

export interface FilmActor {
    actorId: number;
    filmId: number;
    lastUpdate: Date;
}

export interface FilmCategory {
    categoryId: number;
    filmId: number;
    lastUpdate: Date;
}

export interface Inventory {
    filmId: number;
    inventoryId: number;
    lastUpdate: Date;
    storeId: number;
}

export interface Language {
    languageId: number;
    lastUpdate: Date;
    name: string;
}

export interface Payment {
    amount: number;
    customerId: number;
    paymentDate: Date;
    paymentId: number;
    rentalId: number;
    staffId: number;
}

export interface Rental {
    customerId: number;
    inventoryId: number;
    lastUpdate: Date;
    rentalDate: Date;
    rentalId: number;
    returnDate?: Date;
    staffId: number;
}

export interface Staff {
    active: boolean;
    addressId: number;
    email?: string;
    firstName: string;
    lastName: string;
    lastUpdate: Date;
    password?: string;
    picture?: any;
    staffId: number;
    storeId: number;
    username: string;
}

export interface Store {
    addressId: number;
    lastUpdate: Date;
    managerStaffId: number;
    storeId: number;
}
