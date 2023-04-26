import { ipcRenderer } from "electron";
import { ExposedMethod, IpcRenderExposer } from "../annotations/IpcRenderExposer.annotation";


export async function ipcRendererInvoke(handleName: string, methodName: string, ...args: any[]) {
    return await ipcRenderer.invoke(handleName, methodName, ...args);
}


/**
 * 对渲染进程（页面）暴露可调用接口
 */
@IpcRenderExposer("KVMemory")
export class KVMemory {

    @ExposedMethod()
    async set(key: string, value: any, seconds?: number): Promise<boolean> {
        return await ipcRendererInvoke("KVMemory", "set", location.origin, key, value, seconds)
    }

    @ExposedMethod()
    async get(key: string): Promise<any> {
        return await ipcRendererInvoke("KVMemory", "get", location.origin, key)
    }

    @ExposedMethod()
    async delete(key: string) {
        return await ipcRendererInvoke("KVMemory", "delete", location.origin, key)
    }

    @ExposedMethod()
    async keys() {
        return await ipcRendererInvoke("KVMemory", "keys", location.origin)
    }

    @ExposedMethod()
    async values() {
        return await ipcRendererInvoke("KVMemory", "values", location.origin)
    }
}

