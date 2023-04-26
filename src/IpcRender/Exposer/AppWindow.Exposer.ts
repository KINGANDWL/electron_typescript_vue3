import { ipcRenderer } from "electron";
import { ExposedMethod,ExposedProperty, IpcRenderExposer } from "../annotations/IpcRenderExposer.annotation";


export async function ipcRendererInvoke(handleName:string,methodName:string,...args:any[]){
    return await ipcRenderer.invoke(handleName,methodName,...args);
}


/**
 * 对渲染进程（页面）暴露可调用接口
 */
@IpcRenderExposer("AppWindow")
export class AppWindow{
    //用于来给页面识别是否是electron模式
    @ExposedProperty()
    ElectronMode=true

    @ExposedMethod()
    async maxSize(){
        return await ipcRendererInvoke("AppWindow","maxSize")
    }

    @ExposedMethod()
    async minSize(){
        return await ipcRendererInvoke("AppWindow","minSize")
    }

    @ExposedMethod()
    async defaultSize(){
        return await ipcRendererInvoke("AppWindow","defaultSize")
    }

    @ExposedMethod()
    async closeWindow(){
        return await ipcRendererInvoke("AppWindow","closeWindow")
    }

    @ExposedMethod()
    async setSize(width:number,height:number){
        return await ipcRendererInvoke("AppWindow","setSize",width,height);
    }
    
    
    @ExposedMethod()
    async moveWindow(x:number,y:number){
        return await ipcRendererInvoke("AppWindow","moveWindow",x,y);
    }
    @ExposedMethod()
    async windowStatus(){
        return await ipcRendererInvoke("AppWindow","windowStatus");
    }
    
    
    @ExposedProperty()
    messageBoxType={
        none:"none",
        info:"info",
        error:"error",
        question:"question",
        warning:"warning"
    }

    /**
     * 弹出框
     * @param type none info error question warning 
     * @param title 
     * @param detail 
     * @param message 
     * @param buttons 
     */
    @ExposedMethod()
    async messageBox(type: string, title:string, detail:string, message:string, buttons:string[]=["确认","取消"])
    : Promise<{ response: number; checkboxChecked: boolean; }> {
        type = type.toLowerCase();
        if(this.messageBoxType[type] == null){
            throw new Error(`unknown messagebox type "${type}"`)
        }else{
            return await ipcRendererInvoke("AppWindow","messageBox",type,title,detail,message,buttons)
        }
    }

    // @ExposedMethod()
    // async fileDialog(
    //     title:string,
    //     btnText:string,
    //     defaultPath:string,
    //     selectType:string,
    //     multiSelect:boolean,
    //     fileFilters:{name:string,extensions:string[]}[]){
    //     return await ipcRendererInvoke("AppWindow","fileDialog",title,btnText,defaultPath,selectType,multiSelect,fileFilters)
    // }
}

