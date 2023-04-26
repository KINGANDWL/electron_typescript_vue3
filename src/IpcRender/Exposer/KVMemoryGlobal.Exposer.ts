import { ipcRenderer } from "electron";
import { ExposedMethod, IpcRenderExposer } from "../annotations/IpcRenderExposer.annotation";


export async function ipcRendererInvoke(handleName: string, methodName: string, ...args: any[]) {
    return await ipcRenderer.invoke(handleName, methodName, ...args);
}


/**
 * 对渲染进程（页面）暴露可调用接口
 */
@IpcRenderExposer("KVMemoryGlobal")
export class KVMemoryGlobal {

    @ExposedMethod()
    async set(key: string, value: any, seconds?: number): Promise<boolean> {
        return await ipcRendererInvoke("KVMemory", "set", "Global", key, value, seconds)
    }

    @ExposedMethod()
    async get(key: string): Promise<any> {
        return await ipcRendererInvoke("KVMemory", "get", "Global", key)
    }

    @ExposedMethod()
    async delete(key: string) {
        return await ipcRendererInvoke("KVMemory", "delete", "Global", key)
    }

    @ExposedMethod()
    async keys() {
        return await ipcRendererInvoke("KVMemory", "keys", "Global")
    }

    @ExposedMethod()
    async values() {
        return await ipcRendererInvoke("KVMemory", "values", "Global")
    }
}

