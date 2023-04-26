import { KVStorage, KVStorage_Key, KVStorage_Value } from '../interface/KVStorage.interface';

export interface KVStorage_Saver {
    value: KVStorage_Value;
    savedTime: number; // 保存时间，使用 new Date().valueOf() 获取
    deadline?: number; // 过期时间，使用 new Date().valueOf() 获取
}

export class AppKVStorage implements KVStorage {
    protected mapTable: Map<string, Map<KVStorage_Key, KVStorage_Saver>> = new Map();

    private static isOutOfDate(saver: KVStorage_Saver): boolean {
        return saver != null && saver.deadline != null && (new Date().valueOf() - saver.deadline) > 0;
    }

    private static tryCleanOutOfDate(map: Map<KVStorage_Key, KVStorage_Saver>): void {
        if (map != null) {
            map.forEach((value, key, map) => {
                if (AppKVStorage.isOutOfDate(value)) {
                    map.delete(key);
                }
            });
        }
    }

    insert(domain: string, key: KVStorage_Key, value: KVStorage_Value, seconds?: number): boolean {
        let kvMap = this.mapTable.get(domain) || new Map();
        this.mapTable.set(domain, kvMap);

        if (!kvMap.has(key) || AppKVStorage.isOutOfDate(kvMap.get(key))) {
            kvMap.set(key, {
                value,
                savedTime: new Date().valueOf(),
                deadline: seconds == null ? null : (new Date().valueOf()) + 1000 * seconds
            });
            return true;
        }

        return false;
    }

    delete(domain: string, key: KVStorage_Key): boolean {
        let kvMap = this.mapTable.get(domain);
        if (kvMap != null && kvMap.has(key)) {
            let old = kvMap.get(key);
            kvMap.delete(key);
            return !AppKVStorage.isOutOfDate(old);
        }
        return false;
    }

    update(domain: string, key: KVStorage_Key, value: KVStorage_Value, seconds?: number): boolean {
        let kvMap = this.mapTable.get(domain);
        if (kvMap != null && kvMap.has(key)) {
            let old = kvMap.get(key);
            if (!AppKVStorage.isOutOfDate(old)) {
                kvMap.set(key, {
                    value,
                    savedTime: old.savedTime,
                    deadline: seconds == null ? old.deadline : (new Date().valueOf()) + 1000 * seconds
                });
                return true;
            } else {
                kvMap.delete(key);
            }
        }
        return false;
    }

    query(domain: string, key: KVStorage_Key): KVStorage_Value | null {
        let kvMap = this.mapTable.get(domain);
        if (kvMap != null) {
            let saver = kvMap.get(key);
            if (saver != null) {
                if (!AppKVStorage.isOutOfDate(saver)) {
                    return saver.value;
                } else {
                    kvMap.delete(key);
                }
            }
        }
        return null;
    }

    values(domain: string): KVStorage_Value[] {
        let kvMap = this.mapTable.get(domain);
        if (kvMap != null) {
            AppKVStorage.tryCleanOutOfDate(kvMap);
            return Array.from(kvMap.values(), saver => saver.value);
        }
        return [];
    }
    keys(domain: string): KVStorage_Key[] {
        let kvMap = this.mapTable.get(domain);
        if (kvMap != null) {
            AppKVStorage.tryCleanOutOfDate(kvMap);
            return Array.from(kvMap.keys());
        }
        return [];
    }

    clear(domain: string): boolean {
        let kvMap = this.mapTable.get(domain);
        if (kvMap != null) {
            kvMap.clear();
            return true;
        }
        return false;
    }
}



// function main(){
//     let domain = "domain"
//     let s: KVStorage = new AppKVStorage()
//     console.log(s.insert(domain,"key1", "value1"))
//     console.log(s.qeury(domain,"key1"))
//     console.log(s.insert(domain,"key1", "value1"))

//     console.log(s.insert(domain,"key2", "value2", 5))
//     console.log(s.qeury(domain,"key3"))

//     console.log(s.delete(domain,"key1"))
//     console.log(s.qeury(domain,"key1"))

//     console.log(s.qeury(domain,"key2"))
//     setTimeout(() => {
//         console.log(s.qeury(domain,"key2"))
//     }, 5000)
// }
// main()