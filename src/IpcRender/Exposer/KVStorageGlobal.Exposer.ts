import { ipcRenderer } from "electron";
import { ExposedMethod, IpcRenderExposer } from "../annotations/IpcRenderExposer.annotation";
import { DebugLog } from "../annotations/DebugLog.annotation";


export async function ipcRendererInvoke(handleName: string, methodName: string, ...args: any[]) {
    return await ipcRenderer.invoke(handleName, methodName, ...args);
}


/**
 * 对渲染进程（页面）暴露可调用接口
 */
@IpcRenderExposer("KVStorageGlobal")
export class KVStorageGlobal {

    // @DebugLog()
    @ExposedMethod()
    async set(key: string, value: any, seconds?: number): Promise<boolean> {
        return await ipcRendererInvoke("KVStorage", "set", "Global", key, value, seconds)
    }

    // @DebugLog()
    @ExposedMethod()
    async get(key: string): Promise<any> {
        return await ipcRendererInvoke("KVStorage", "get", "Global", key)
    }

    // @DebugLog()
    @ExposedMethod()
    async delete(key: string) {
        return await ipcRendererInvoke("KVStorage", "delete", "Global", key)
    }

    // @DebugLog()
    @ExposedMethod()
    async keys() {
        return await ipcRendererInvoke("KVStorage", "keys", "Global")
    }

    // @DebugLog()
    @ExposedMethod()
    async values() {
        return await ipcRendererInvoke("KVStorage", "values", "Global")
    }
}

