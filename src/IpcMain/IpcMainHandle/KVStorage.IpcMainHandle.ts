import { IpcMainEvent } from "electron";
import { IpcMainHandle, Handle } from '../annotations/IPCMain.annotation';
import { AutowireMethod } from "objbox";
import { Logger, LoggerManager } from "objbox/libs";
import { DIR } from '../../DIR';
import { SqliteKVStorage } from '../../lib/KVStorage/SqliteKVStorage/SqliteKVStorage';
import { DebugLog } from "../annotations/DebugLog.annotation";


/**
 * 主进程对渲染进程暴露处理接口
 */
@IpcMainHandle("KVStorage")
export class KVStorage {
    logger: Logger
    @AutowireMethod("LoggerManager")
    setLogger(loggerManager: LoggerManager) {
        this.logger = loggerManager.getLogger(KVStorage)
    }
    private sqliteKVStorage: SqliteKVStorage = new SqliteKVStorage(DIR.RuntimeData + "/KVStorage.db")

    private static isPositiveInteger(num: number): boolean {
        return Number.isInteger(num) && num >= 0
    }

    constructor() {
        this.sqliteKVStorage.init()
    }

    /**
     * app级存储、sqlite级存储；全局存储、域级存储
     */

    // @DebugLog()
    @Handle()
    async set(event: IpcMainEvent, domain: string, key: string, value: any, seconds?: number): Promise<boolean> {
        let data = await this.sqliteKVStorage.query(domain, key);
        if (value == null) {
            throw new Error("Cannot set value as null or undefined")
        } else if (seconds != null && !KVStorage.isPositiveInteger(seconds)) {
            throw new Error("Cannot set seconds to a non numeric type")
        }

        if (data != null) {
            await this.sqliteKVStorage.update(domain, key, value, seconds)
        } else {
            await this.sqliteKVStorage.insert(domain, key, value, seconds)
        }

        return true
    }

    // @DebugLog()
    @Handle()
    async get(event: IpcMainEvent, domain: string, key: string): Promise<any> {
        return await this.sqliteKVStorage.query(domain, key);
    }

    // @DebugLog()
    @Handle()
    async delete(event: IpcMainEvent, domain: string, key: string) {
        return await this.sqliteKVStorage.delete(domain, key);
    }

    // @DebugLog()
    @Handle()
    keys(event: IpcMainEvent, domain: string) {
        return this.sqliteKVStorage.keys(domain)
    }

    // @DebugLog()
    @Handle()
    values(event: IpcMainEvent, domain: string) {
        return this.sqliteKVStorage.values(domain)
    }

    @Handle()
    test() {
        throw new Error("asdasdasdas")
    }
}