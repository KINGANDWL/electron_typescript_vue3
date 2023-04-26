import { BrowserWindow, IpcMainEvent, dialog } from "electron";
import { IpcMainHandle, Handle } from '../annotations/IPCMain.annotation';
import { AutowireMethod, AutowireProperty } from "objbox";
import { Logger, LoggerManager } from "objbox/libs";

export enum DialogType {
    none = "none",
    info = "info",
    error = "error",
    question = "question",
    warning = "warning",
}


/**
 * 主进程对渲染进程暴露处理接口
 */
@IpcMainHandle("AppWindow")
export class AppWindow {
    logger: Logger
    @AutowireMethod("LoggerManager")
    setLogger(loggerManager: LoggerManager) {
        this.logger = loggerManager.getLogger(AppWindow)
    }

    @AutowireProperty("MainBrowserWindow")
    mainWindow: BrowserWindow

    @Handle()
    maxSize(event: IpcMainEvent): boolean {
        if (this.mainWindow.isMaximizable()) {
            this.mainWindow.maximize()
            return true
        }
        return false
    }

    @Handle()
    minSize(event: IpcMainEvent) {
        if (this.mainWindow.isMaximizable()) {
            this.mainWindow.minimize()
            return true
        }
        return false
    }

    @Handle()
    defaultSize(event: IpcMainEvent) {
        this.mainWindow.restore()
        return true
    }

    @Handle()
    closeWindow(event: IpcMainEvent) {
        this.mainWindow.close()
        return true
    }

    @Handle()
    setSize(event: IpcMainEvent, width: number, height: number) {
        try {
            if (width != null && height != null) {
                this.mainWindow.setSize(width, height)
                return true
            } else {
                this.logger.error(`Cannot set window size as (${width},${height})`)
            }
        } catch (err) {
            this.logger.errorArgs((err as Error).stack)
        }
        return false
    }

    @Handle()
    moveWindow(event: IpcMainEvent, x: number, y: number) {
        try {
            if (x != null && y != null) {
                this.mainWindow.setPosition(x, y)
                return true
            } else {
                this.logger.error(`Cannot set window size as (${x},${y})`)
            }
        } catch (err) {
            this.logger.errorArgs((err as Error).stack)
        }
        return false
    }

    @Handle()
    windowStatus() {
        if(this.mainWindow.isMaximized()){
            return "max"
        }else if(this.mainWindow.isMinimized()){
            return "min"
        }else return "default"
    }


    @Handle()
    async messageBox(event: IpcMainEvent, type: DialogType, title: string, detail: string, message: string, buttons: string[]) 
    : Promise<{ response: number; checkboxChecked: boolean; }> {
        return await dialog.showMessageBox(this.mainWindow, {
            // type string (可选) - 可以为 "none", "info", "error", "question" 或者 "warning"
            type: type + "",//"none",
            title: title,// "title",
            detail: detail,// "details",
            message: message,//"message",
            buttons: buttons,//["按钮0","按钮1","按钮2","按钮3"]
        });
    }

    /**
     * 文件选择框
     * @param event  
     * @param title 顶部标题 
     * @param btnText 确认按钮文字 
     * @param selectType 选择类型file/folder
     * @param multiSelect 多选模式
     * @param fileFilters 文件名称过滤
     * fileFilters: [
            { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
            { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
            { name: 'Custom File Type', extensions: ['as'] },
            { name: 'All Files', extensions: ['*'] }
        ]
     */
    @Handle()
    async fileDialog(event: IpcMainEvent,
        title: string,
        btnText: string,
        defaultPath: string,
        selectType: string,
        multiSelect: boolean,
        fileFilters: { name: string, extensions: string[] }[]
    ) {
        if (title == null) title = "选择"
        if (btnText == null) btnText = "确认"
        if (selectType == null) selectType = "file";
        if (multiSelect == null) multiSelect = false;
        if (fileFilters == null) fileFilters = [{ name: "any file", extensions: ["*"] }];

        let properties = []
        if (selectType == "file") {
            properties.push("openFile")
        } else {
            properties.push("openDirectory")
        }
        if (multiSelect === true) {
            properties.push("multiSelections")
        }
        return await dialog.showOpenDialog(this.mainWindow, {
            title: title,
            buttonLabel: btnText,
            defaultPath: defaultPath,
            filters: fileFilters,
            properties: properties
        });
    }
}