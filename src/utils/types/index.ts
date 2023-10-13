export type Nullable<T> = T | null;

export type RawFile = {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer: Buffer;
};

export type Uuid = string;
