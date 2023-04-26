import { IpcMainEvent } from "electron";
import { IpcMainHandle, Handle } from '../annotations/IPCMain.annotation';
import { AutowireMethod } from "objbox";
import { Logger, LoggerManager } from "objbox/libs";
import { AppKVStorage } from '../../lib/KVStorage/AppKVStorage/AppKVStorage';


/**
 * 主进程对渲染进程暴露处理接口
 */
@IpcMainHandle("KVMemory")
export class KVMemory {
    logger: Logger
    @AutowireMethod("LoggerManager")
    setLogger(loggerManager: LoggerManager) {
        this.logger = loggerManager.getLogger(KVMemory)
    }
    private appKVStorage: AppKVStorage = new AppKVStorage()

    private static isPositiveInteger(num: number): boolean {
        return Number.isInteger(num) && num >= 0
    }

    /**
     * app级存储、sqlite级存储；全局存储、域级存储
     */

    @Handle()
    set(event: IpcMainEvent, domain: string, key: string, value: any, seconds?: number) : boolean {
        let data = this.appKVStorage.query(domain, key);
        if (value == null) {
            throw new Error("Cannot set value as null or undefined")
        } else if (seconds != null && !KVMemory.isPositiveInteger(seconds)) {
            throw new Error("Cannot set seconds to a non numeric type")
        }

        if (data != null) {
            this.appKVStorage.update(domain, key, value, seconds)
        } else {
            this.appKVStorage.insert(domain, key, value, seconds)
        }

        return true
    }

    @Handle()
    get(event: IpcMainEvent, domain: string, key: string): any {
        return this.appKVStorage.query(domain, key);
    }

    @Handle()
    delete(event: IpcMainEvent, domain: string, key: string) {
        return this.appKVStorage.delete(domain, key);
    }

    @Handle()
    keys(event: IpcMainEvent, domain: string) {
        return this.appKVStorage.keys(domain)
    }
    
    @Handle()
    values(event: IpcMainEvent, domain: string) {
        return this.appKVStorage.values(domain)
    }

    @Handle()
    test() {
        throw new Error("asdasdasdas")
    }
}