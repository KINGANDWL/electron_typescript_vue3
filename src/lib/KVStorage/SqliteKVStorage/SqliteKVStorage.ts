import { KVStorage, KVStorage_Key, KVStorage_Value } from "../interface/KVStorage.interface";
import { SqliteDatabase } from '../../SqliteDatabase';
import { RunResult } from 'sqlite3';

interface KVSqlData {
    domain: string
    key: KVStorage_Key
    value: string
    savedTime: number
    deadline: number
}
interface KVMapData {
    domain: string
    key: KVStorage_Key
    value: KVStorage_Value
    savedTime: number
    deadline: number
}
enum DateType {
    object = "@object  ",
    string = "@string  ",
    boolean = "@boolean ",
    array = "@array   ",
    number = "@number  "
}
enum SqlOperation {
    selectAll = "selectAll",
    selectByDomain = "selectByDomain",
    selectByPrimaryKey = "selectByPrimaryKey",
    insertOne = "insertOne",
    deleteOutOfDate = "deleteOutOfDate",
    deleteByPrimaryKey = "deleteByPrimaryKey",
    deleteByDomain = "deleteByDomain",
    updateValue = "updateValue",
    updateValueAndDeadline = "updateValueAndDeadline",
    updateByPrimaryKey = "updateByPrimaryKey",
}
var SqlMap = {}
SqlMap[SqlOperation.selectAll + ""] = `SELECT * FROM SqliteKVStorage`;
SqlMap[SqlOperation.selectByDomain + ""] = `SELECT * FROM SqliteKVStorage WHERE domain = ?`;
SqlMap[SqlOperation.selectByPrimaryKey + ""] = `SELECT * FROM SqliteKVStorage WHERE domain = ? AND key = ?`;

SqlMap[SqlOperation.insertOne + ""] = `INSERT INTO SqliteKVStorage (domain, key, value, savedTime, deadline) VALUES (?, ?, ?, ?, ?)`;

SqlMap[SqlOperation.deleteOutOfDate + ""] = `DELETE FROM SqliteKVStorage WHERE deadline <= ?`;
SqlMap[SqlOperation.deleteByDomain + ""] = `DELETE FROM SqliteKVStorage WHERE domain = ?`;
SqlMap[SqlOperation.deleteByPrimaryKey + ""] = `DELETE FROM SqliteKVStorage WHERE domain = ? AND key = ?`;

SqlMap[SqlOperation.updateValue + ""] = `UPDATE SqliteKVStorage SET value = ? WHERE domain = ? AND key = ?`;
SqlMap[SqlOperation.updateValueAndDeadline + ""] = `UPDATE SqliteKVStorage SET value = ?, deadline = ? WHERE domain = ? AND key = ?`;
SqlMap[SqlOperation.updateByPrimaryKey + ""] = `UPDATE SqliteKVStorage SET value = ?, savedTime = ?, deadline = ? WHERE domain = ? AND key = ?`;



export class SqliteKVStorage implements KVStorage {
    private sqliteDatabase: SqliteDatabase = null
    private dbpath: string = null
    private mapTable: Map<string, Map<KVStorage_Key, KVMapData>> = new Map();
    constructor(dbpath: string) {
        this.dbpath = dbpath;
    }
    private static prepareSql(sd: SqliteDatabase, operation: SqlOperation) {
        sd.prepareSql(operation, SqlMap[operation]);
    }
    async init() {
        try {
            this.sqliteDatabase = await SqliteDatabase.createDatabase(this.dbpath);
            await this.sqliteDatabase.execSql(`
            
            CREATE TABLE IF NOT EXISTS SqliteKVStorage (
                domain TEXT NOT NULL ,
                key TEXT NOT NULL ,
                value TEXT NOT NULL,
                savedTime INTEGER NOT NULL ,
                deadline INTEGER ,
                PRIMARY KEY (domain, key)
            )

            `.trim())

            // 查询所有数据
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.selectAll);
            // 通过domain查询所有数据
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.selectByDomain);
            // 通过主键查询
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.selectByPrimaryKey);
            // 插入一条数据
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.insertOne);
            // 通过domain和key进行删除
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.deleteByPrimaryKey);
            // 清理过期数据
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.deleteOutOfDate);
            // 通过domain清空记录
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.deleteByDomain);
            // 通过domain和key进行更新value
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.updateValue);
            // 通过主键进行更新value与deadline
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.updateValueAndDeadline);
            // 通过主键更新所有
            SqliteKVStorage.prepareSql(this.sqliteDatabase, SqlOperation.updateByPrimaryKey);

            //每次连接前清理过期数据
            await this.tryCleanOutOfDate()
        } catch (err) {
            throw new Error("SqliteKVStorage Error: " + (err as Error).stack);
        }
    }

    private async tryCleanOutOfDate(): Promise<void> {
        await this.sqliteDatabase.runByPrepareSql(SqlOperation.deleteOutOfDate, [new Date().valueOf()])
    }
    private static isOutOfDate(data: KVMapData): boolean {
        return data != null && data.deadline != null && (new Date().valueOf() - data.deadline) > 0;
    }

    /**
     * 将序列化值转数据对象
     * @param value 
     */
    private static parseData(value: string): KVStorage_Value {
        if (value.length >= DateType.array.length) {
            let startWith = value.slice(0, DateType.array.length)

            if (startWith == DateType.array || startWith == DateType.number || startWith == DateType.boolean || startWith == DateType.string || startWith == DateType.object) {
                return JSON.parse(value.slice(DateType.array.length, value.length));
            }
        }
        throw new Error(`SqliteKVStorage Error: unknown type of "${value}"`)
    }

    /**
     * 将数据对象序列化
     * @param value 
     */
    private static stringifyData(value: KVStorage_Value): string {
        if (value != null) {
            if (typeof (value) == "boolean") {
                return DateType.boolean + JSON.stringify(value)
            } else if (typeof (value) == "number") {
                return DateType.number + JSON.stringify(value)
            } else if (typeof (value) == "string") {
                return DateType.string + JSON.stringify(value)
            } else if (Array.isArray(value)) {
                return DateType.array + JSON.stringify(value)
            } else {
                try {
                    return DateType.object + JSON.stringify(value)
                } catch (err) {
                    throw new Error(`SqliteKVStorage Error: "${err}"`)
                }
            }
        }
        throw new Error(`SqliteKVStorage Error: wrong type of "${value}"`)
    }

    async tryReadAllDomainToMap(domain: string) {
        if (!this.mapTable.has(domain)) {
            let domainMap: Map<KVStorage_Key, KVMapData> = new Map()
            let result = await this.sqliteDatabase.queryByPrepareSql(SqlOperation.selectByDomain, [domain]) as KVSqlData[]
            for (let eachData of result) {
                domainMap.set(eachData.key, {
                    key: eachData.key,
                    value: SqliteKVStorage.parseData(eachData.value),
                    savedTime: eachData.savedTime,
                    deadline: eachData.deadline,
                    domain: eachData.domain,
                })
            }
            this.mapTable.set(domain, domainMap)
        }
    }

    async query(domain: string, key: KVStorage_Key): Promise<KVStorage_Value> {
        try {
            await this.tryReadAllDomainToMap(domain)
            let domainMap = this.mapTable.get(domain)
            if (domainMap != null) {
                let data = domainMap.get(key);
                if(data != null){
                    if (!SqliteKVStorage.isOutOfDate(data)) {
                        return data.value
                    } else {
                        await this._delete(domain, key)
                    }
                }
            }
            return null
        } catch (err) {
            throw new Error("SqliteKVStorage Error: " + (err as Error).message)
        }
    }

    private async _delete(domain: string, key: KVStorage_Key): Promise<KVMapData> {
        let domainMap = this.mapTable.get(domain)
        if (domainMap != null) {
            let data = domainMap.get(key);
            if (data != null) {
                let result = await this.sqliteDatabase.runByPrepareSql(SqlOperation.deleteByPrimaryKey, [domain, key]);
                if (result.changes == 1) {
                    domainMap.delete(key)
                    return data
                } else {
                    throw new Error("Inconsistent storage data when delete")
                }
            }
        }
        return null
    }

    async delete(domain: string, key: KVStorage_Key): Promise<boolean> {
        try {
            await this.tryReadAllDomainToMap(domain)
            let data = await this._delete(domain, key)
            if (data != null) {
                if (!SqliteKVStorage.isOutOfDate(data)) {
                    return true
                }
            }
            return false
        } catch (err) {
            throw new Error("SqliteKVStorage Error: " + (err as Error).message)
        }
    }

    async update(domain: string, key: KVStorage_Key, value: KVStorage_Value, seconds?: number): Promise<boolean> {
        try {
            await this.tryReadAllDomainToMap(domain)
            let domainMap = this.mapTable.get(domain)
            if (domainMap != null) {
                let data = domainMap.get(key);
                if (data != null) {
                    if (!SqliteKVStorage.isOutOfDate(data)) {
                        let _value = value;
                        let _deadline = (seconds == null) ? data.deadline : new Date().valueOf() + seconds * 1000;

                        let result = await this.sqliteDatabase.runByPrepareSql(SqlOperation.updateValueAndDeadline, [SqliteKVStorage.stringifyData(_value), _deadline, domain, key]);
                        if (result.changes == 1) {
                            data.value = _value; data.deadline = _deadline;
                            return true
                        } else {
                            throw new Error("Inconsistent storage data when update")
                        }
                    } else {
                        await this._delete(domain, key)
                    }
                }
            }
            return false
        } catch (err) {
            throw new Error("SqliteKVStorage Error: " + (err as Error).message)
        }
    }

    async insert(domain: string, key: KVStorage_Key, value: KVStorage_Value, seconds?: number): Promise<boolean> {
        try {
            await this.tryReadAllDomainToMap(domain)
            let domainMap = this.mapTable.get(domain)
            if (domainMap != null) {
                let data = domainMap.get(key);
                let nowDate = new Date().valueOf();
                if (data == null || SqliteKVStorage.isOutOfDate(data)) {
                    data = {
                        domain: domain,
                        key: key,
                        value: value,
                        savedTime: nowDate,
                        deadline: seconds == null ? null : nowDate + seconds * 1000
                    }
                    let result: RunResult
                    if (SqliteKVStorage.isOutOfDate(data)) {
                        result = await this.sqliteDatabase.runByPrepareSql(SqlOperation.updateByPrimaryKey, [SqliteKVStorage.stringifyData(data.value), data.savedTime, data.deadline, domain, key])
                    } else {
                        result = await this.sqliteDatabase.runByPrepareSql(SqlOperation.insertOne, [data.domain, data.key, SqliteKVStorage.stringifyData(data.value), data.savedTime, data.deadline])
                    }
                    if (result.changes == 1) {
                        domainMap.set(key, data)
                        return true
                    } else {
                        throw new Error("Inconsistent storage data when insert")
                    }
                }
            }
            return false
        } catch (err) {
            throw new Error("SqliteKVStorage Error: " + (err as Error).message)
        }
    }
    values(domain: string): KVStorage_Value[] {
        let result:KVStorage_Value[] = []
        let domainMap = this.mapTable.get(domain);
        if (domainMap != null) {
            domainMap.forEach((value,key,map)=>{
                if(!SqliteKVStorage.isOutOfDate(value)){
                    result.push(value.value)
                }
            })
        }
        return result;
    }
    keys(domain: string): KVStorage_Key[] {
        let result:KVStorage_Key[] = []
        let domainMap = this.mapTable.get(domain);
        if (domainMap != null) {
            domainMap.forEach((value,key,map)=>{
                if(!SqliteKVStorage.isOutOfDate(value)){
                    result.push(key)
                }
            })
        }
        return result;
    }

}



// async function main(){
//     let domain = "domain"
//     let s: SqliteKVStorage = new SqliteKVStorage("./test.db")
//     await s.init()
//     console.log(await s.insert(domain,"key1", "value1"))
//     console.log(await s.query(domain,"key1"))
//     console.log(await s.insert(domain,"key1", "value1"))

//     console.log(await s.insert(domain,"key2", "value2", 5))
//     console.log(await s.query(domain,"key3"))

//     console.log(await s.delete(domain,"key1"))
//     console.log(await s.query(domain,"key1"))

//     console.log(await s.query(domain,"key2"))
//     setTimeout(() => {
//         console.log(s.query(domain,"key2"))
//     }, 5000)
// }
// main()