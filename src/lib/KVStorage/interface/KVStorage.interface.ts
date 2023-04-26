//kv存储值格式
export type KVStorage_Value = Object | string | String | number | Array<any> | boolean;
//kv存储键格式
export type KVStorage_Key = string | String;

export interface KVStorage {
    insert: (domain: string, key: string | String, value: KVStorage_Value, seconds?: number) => Promise<boolean> | boolean
    delete: (domain: string, key: string | String) => Promise<boolean> | boolean
    update: (domain: string, key: string | String, value: KVStorage_Value, seconds?: number) => Promise<boolean> | boolean
    query: (domain: string, key: string | String) => Promise<KVStorage_Value> | KVStorage_Value
    keys: (domain: string) => Promise<KVStorage_Key[]> | KVStorage_Key[]
    values: (domain: string) => Promise<KVStorage_Value[]> | KVStorage_Value[]
}
