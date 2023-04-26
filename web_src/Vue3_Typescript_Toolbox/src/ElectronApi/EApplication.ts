declare module window {
    class AppWindow {
        //用于来给页面识别是否是electron模式
        static ElectronMode: boolean
        static maxSize: () => Promise<void>
        static minSize: () => Promise<void>
        static defaultSize: () => Promise<void>
        static closeWindow: () => Promise<void>
        static setSize: (width: number, height: number) => Promise<void>
        static moveWindow: (x: number, y: number) => Promise<void>
        static messageBoxType: {
            none: "none",
            info: "info",
            error: "error",
            question: "question",
            warning: "warning"
        }
        static windowStatus: () => Promise<string>
        static messageBox: (type: string, title: string, detail: string, message: string, buttons: string[]) => Promise<{ response: number, checkboxChecked: boolean }>
    }

    class KVMemory {
        static set: (key: string, value: any, seconds?: number) => Promise<boolean>
        static get: (key: string) => Promise<any>
        static delete: (key: string) => Promise<boolean>
        static keys: () => Promise<string[]>
        static values: () => Promise<any[]>
    }
    class KVStorage {
        static set: (key: string, value: any, seconds?: number) => Promise<boolean>
        static get: (key: string) => Promise<any>
        static delete: (key: string) => Promise<boolean>
        static keys: () => Promise<string[]>
        static values: () => Promise<any[]>
    }
    class KVMemoryGlobal {
        static set: (key: string, value: any, seconds?: number) => Promise<boolean>
        static get: (key: string) => Promise<any>
        static delete: (key: string) => Promise<boolean>
        static keys: () => Promise<string[]>
        static values: () => Promise<any[]>
    }
    class KVStorageGlobal {
        static set: (key: string, value: any, seconds?: number) => Promise<boolean>
        static get: (key: string) => Promise<any>
        static delete: (key: string) => Promise<boolean>
        static keys: () => Promise<string[]>
        static values: () => Promise<any[]>
    }
}


export class AppWindow {
    //用于来给页面识别是否是electron模式
    static ElectronMode = (window.AppWindow == null) ? false : window.AppWindow.ElectronMode;
    static async maxSize(): Promise<void> {
        if (window.AppWindow != null) {
            return await window.AppWindow.maxSize()
        }
    }
    static async minSize(): Promise<void> {
        if (window.AppWindow != null) {
            return await window.AppWindow.minSize()
        }
    }
    static async defaultSize(): Promise<void> {
        if (window.AppWindow != null) {
            return await window.AppWindow.defaultSize()
        }
    }
    static async closeWindow(): Promise<void> {
        if (window.AppWindow != null) {
            return await window.AppWindow.closeWindow()
        }
    }
    static async setSize(width: number, height: number): Promise<void> {
        if (window.AppWindow != null) {
            return await window.AppWindow.setSize(width, height)
        }
    }
    static async moveWindow(x: number, y: number): Promise<void> {
        if (window.AppWindow != null) {
            return await window.AppWindow.moveWindow(x, y)
        }
    }
    static messageBoxType = (window.AppWindow == null) ? {
        none: "none",
        info: "info",
        error: "error",
        question: "question",
        warning: "warning"
    } : window.AppWindow.messageBoxType;
    
    static async windowStatus(): Promise<string> {
        if (window.AppWindow != null) {
            return await window.AppWindow.windowStatus();
        }
        return new Promise<any>((res, rej) => { res("No Electron Mode") });
    }
    static async messageBox(type: string, title: string, detail: string, message: string, buttons: string[])
        : Promise<{ response: number, checkboxChecked: boolean }> {
        if (window.AppWindow != null) {
            return await window.AppWindow.messageBox(type, title, detail, message, buttons);
        }
        return new Promise<any>((res, rej) => { res(null) });
    }
}

export class KVMemory {
    static async set(key: string, value: any, seconds?: number): Promise<boolean> {
        if (window.KVMemory != null) {
            return await window.KVMemory.set(key, value, seconds);
        }
        return new Promise<any>((res, rej) => { res(false) });
    }
    static async get(key: string): Promise<any> {
        if (window.KVMemory != null) {
            return await window.KVMemory.get(key);
        }
    }
    static async delete(key: string): Promise<boolean> {
        if (window.KVMemory != null) {
            return await window.KVMemory.delete(key);
        }
        return new Promise<any>((res, rej) => { res(false) });
    }
    static async keys(): Promise<string[]> {
        if (window.KVMemory != null) {
            return await window.KVMemory.keys();
        }
        return new Promise<any>((res, rej) => { res([]) });
    }
    static async values(): Promise<any[]> {
        if (window.KVMemory != null) {
            return await window.KVMemory.values();
        }
        return new Promise<any>((res, rej) => { rej([res]) })
    }
}
export class KVStorage {
    static async set(key: string, value: any, seconds?: number): Promise<boolean> {
        if (window.KVStorage != null) {
            return await window.KVStorage.set(key, value, seconds);
        }
        return new Promise<any>((res, rej) => { res(false) });
    }
    static async get(key: string): Promise<any> {
        if (window.KVStorage != null) {
            return await window.KVStorage.get(key);
        }
    }
    static async delete(key: string): Promise<boolean> {
        if (window.KVStorage != null) {
            return await window.KVStorage.delete(key);
        }
        return new Promise<any>((res, rej) => { res(false) });
    }
    static async keys(): Promise<string[]> {
        if (window.KVStorage != null) {
            return await window.KVStorage.keys();
        }
        return new Promise<any>((res, rej) => { res([]) });
    }
    static async values(): Promise<any[]> {
        if (window.KVStorage != null) {
            return await window.KVStorage.values();
        }
        return new Promise<any>((res, rej) => { res([]) });
    }
}
export class KVMemoryGlobal {
    static async set(key: string, value: any, seconds?: number): Promise<boolean> {
        if (window.KVMemoryGlobal != null) {
            return await window.KVMemoryGlobal.set(key, value, seconds);
        }
        return new Promise<any>((res, rej) => { res(false) });
    }
    static async get(key: string): Promise<any> {
        if (window.KVMemoryGlobal != null) {
            return await window.KVMemoryGlobal.get(key);
        }
    }
    static async delete(key: string): Promise<boolean> {
        if (window.KVMemoryGlobal != null) {
            return await window.KVMemoryGlobal.delete(key);
        }
        return new Promise<any>((res, rej) => { res(false) });
    }
    static async keys(): Promise<string[]> {
        if (window.KVMemoryGlobal != null) {
            return await window.KVMemoryGlobal.keys();
        }
        return new Promise<any>((res, rej) => { res([]) });
    }
    static async values(): Promise<any[]> {
        if (window.KVMemoryGlobal != null) {
            return await window.KVMemoryGlobal.values();
        }
        return new Promise<any>((res, rej) => { res([]) });
    }
}
export class KVStorageGlobal {
    static async set(key: string, value: any, seconds?: number): Promise<boolean> {
        if (window.KVStorageGlobal != null) {
            return await window.KVStorageGlobal.set(key, value, seconds);
        }
        return new Promise<any>((res, rej) => { res(false) });
    }
    static async get(key: string): Promise<any> {
        if (window.KVStorageGlobal != null) {
            return await window.KVStorageGlobal.get(key);
        }
    }
    static async delete(key: string): Promise<boolean> {
        if (window.KVStorageGlobal != null) {
            return await window.KVStorageGlobal.delete(key);
        }
        return new Promise<any>((res, rej) => { res(false) });
    }
    static async keys(): Promise<string[]> {
        if (window.KVStorageGlobal != null) {
            return await window.KVStorageGlobal.keys();
        }
        return new Promise<any>((res, rej) => { res([]) });
    }
    static async values(): Promise<any[]> {
        if (window.KVStorageGlobal != null) {
            return await window.KVStorageGlobal.values();
        }
        return new Promise<any>((res, rej) => { res([]) });
    }
}