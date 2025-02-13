export interface WaterSupply {
    id: number;
    cityId: number;
    provider: string;
    level: string;
    consumption: number;
    quality: string;
    dateRecorded: Date;
    source: string;
}

export interface Waste {
    id: number;
    cityId: number;
    type: string;
    weight: number;
    dateRecorded: Date;
    source: string;
}

export interface Electricity {
    id: number;
    cityId: number;
    provider: string;
    consumption: number;
    outages: number;
    renewablePercentage: number;
    dateRecorded: Date;
    source: string;
}

export interface Country {
    id: number;
    name: string;
    code: string;
}

export interface City {
    id: number;
    name: string;
    code: string;
    countryId: number;
}
