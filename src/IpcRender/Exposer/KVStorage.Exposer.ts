import { ipcRenderer } from "electron";
import { ExposedMethod, IpcRenderExposer } from "../annotations/IpcRenderExposer.annotation";
import { DebugLog } from "../annotations/DebugLog.annotation";


export async function ipcRendererInvoke(handleName: string, methodName: string, ...args: any[]) {
    return await ipcRenderer.invoke(handleName, methodName, ...args);
}


/**
 * 对渲染进程（页面）暴露可调用接口
 */
@IpcRenderExposer("KVStorage")
export class KVStorage {

    // @DebugLog()
    @ExposedMethod()
    async set(key: string, value: any, seconds?: number): Promise<boolean> {
        return await ipcRendererInvoke("KVStorage", "set", location.origin, key, value, seconds)
    }

    // @DebugLog()
    @ExposedMethod()
    async get(key: string): Promise<any> {
        return await ipcRendererInvoke("KVStorage", "get", location.origin, key)
    }

    // @DebugLog()
    @ExposedMethod()
    async delete(key: string) {
        return await ipcRendererInvoke("KVStorage", "delete", location.origin, key)
    }

    // @DebugLog()
    @ExposedMethod()
    async keys() {
        return await ipcRendererInvoke("KVStorage", "keys", location.origin)
    }

    // @DebugLog()
    @ExposedMethod()
    async values() {
        return await ipcRendererInvoke("KVStorage", "values", location.origin)
    }
}

