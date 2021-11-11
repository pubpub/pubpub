export type OmitSequelizeProvidedFields<T, key extends string | number | symbol> = Omit<T, key>;
