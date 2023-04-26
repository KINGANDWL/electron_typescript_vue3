import { contextBridge, ipcMain } from 'electron';
import { ComponentCreatedType, ComponentHandler, getFunName, registerClass, registerMethod, ComponentHandlerInterface, ObjBoxInterface, ScannedTemplate, ObjBoxHelper, registerProperty, MethodAnnotationType } from 'objbox';
import { Logger } from 'objbox/libs';

//用于外部获取注解参数【非必要】
export interface IpcMainHandleArg {
    handleName: string
}
/**
 * 默认class注解模板
 * @param handleName 
 */
export function IpcMainHandle(handleName: string): ClassDecorator {
    //获取当前函数名称，等效于let _annotationName = "IpcMainHandle"
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        // 如果你希望这个注解能够直接成为组件注解，就手动给当前注解手动添加注册
        registerClass("Component", { name: target.name, scope: ComponentCreatedType.Singleton }, target)
        registerClass<IpcMainHandleArg>(_annotationName, { handleName }, target)
    }
}

export interface HandleArg {
    caller: string
}
/**
 * 默认方法注解模板
 */
export function Handle(caller: string = null): MethodDecorator {
    //获取当前函数名称，等效于let _annotationName = "Handle"
    let _annotationName = getFunName(2)

    //@ts-ignore
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        if (caller == null) caller = key;
        registerMethod<HandleArg>(_annotationName, { caller }, target, key, descriptor)
    }
}


/**
 * 自动将 @IpcMainHandle 的 handle 挂到 ipcMain
 */
@ComponentHandler()
export class IpcMainComponentHander implements ComponentHandlerInterface {
    logger: Logger
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate) {
        if (this.logger == null) {
            this.logger = objbox.getLoggerManager().getLogger(IpcMainComponentHander)
        }
    }
    // created?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void;
    completed(objbox: ObjBoxInterface, template: ScannedTemplate, component: any) {
        if (ObjBoxHelper.doesComponentHaveClassAnnotation(IpcMainHandle.name, component)) {
            let ipcMainAnno = ObjBoxHelper.getClassAnnotationFromComponent<IpcMainHandleArg>(IpcMainHandle.name, component);
            let handles = ObjBoxHelper.getMethodsAnnotationFromComponent<HandleArg>(Handle.name, component);
            let mapper = {}
            for (let handle of handles) {
                mapper[handle.annotationArgs.caller] = handle
            }
            let that = this;
            ipcMain.handle(ipcMainAnno.handleName, function (event, caller: string, ...args: any[]) {
                if (mapper[caller] != null) {
                    return component[(mapper[caller] as MethodAnnotationType<HandleArg>).methodName](event, ...args);
                } else {
                    that.logger.error(`Cannot find method "${caller}" in ${ipcMainAnno.handleName}`)
                    return null
                }
            })
        }
    }
    // ready?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void;
}
