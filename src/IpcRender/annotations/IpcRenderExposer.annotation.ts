import { contextBridge } from "electron"
import { getFunName, registerClass, ComponentCreatedType, registerMethod, registerProperty, ComponentHandler, ComponentHandlerInterface, ObjBoxInterface, ScannedTemplate, ObjBoxHelper } from "objbox"

//用于外部获取注解参数【非必要】
export interface IpcRenderExposerArg {
    exposerName: string
}
/**
 * 默认class注解模板 
 * @param exposerName
 */
export function IpcRenderExposer(exposerName: string): ClassDecorator {
    //获取当前函数名称，等效于let _annotationName = "IpcRenderExposer"
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        // 如果你希望这个注解能够直接成为组件注解，就手动给当前注解手动添加注册
        registerClass("Component", { name: target.name, scope: ComponentCreatedType.Singleton }, target)
        registerClass<IpcRenderExposerArg>(_annotationName, { exposerName }, target)
    }
}

/**
 * 默认方法注解模板
 */
export function ExposedMethod(): MethodDecorator {
    //获取当前函数名称，等效于let _annotationName = "Exposed"
    let _annotationName = getFunName(2)

    //@ts-ignore
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        registerMethod<{}>(_annotationName, { }, target, key, descriptor)
    }
}
export function ExposedProperty (): PropertyDecorator {
    //获取当前函数名称，等效于let _annotationName = "ExposedProperty"
    let _annotationName = getFunName(2)
    //@ts-ignore
    return function (target: any, key: string) {
        registerProperty<{}>(_annotationName, { }, target, key)
    }
}

/**
 * 自动将渲染进程的接口暴露
 */
@ComponentHandler()
export class IpcRenderExposerComponentHander implements ComponentHandlerInterface {
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate) { }
    // created?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void;
    completed(objbox: ObjBoxInterface, template: ScannedTemplate, component: any) {
        if (ObjBoxHelper.doesComponentHaveClassAnnotation(IpcRenderExposer.name, component)) {
            let IpcRenderExposerAnno = ObjBoxHelper.getClassAnnotationFromComponent<IpcRenderExposerArg>(IpcRenderExposer.name, component);
            let exposedMethods = ObjBoxHelper.getMethodsAnnotationFromComponent(ExposedMethod.name, component);
            let exposedProperties = ObjBoxHelper.getPropertyAnnotationFromComponent(ExposedProperty.name, component);
            let exposedObj={}
            for (let exposedMethod of exposedMethods) {
                exposedObj[exposedMethod.methodName] = component[exposedMethod.methodName].bind(component)
            }
            for (let exposedProperty of exposedProperties) {
                exposedObj[exposedProperty.propertyKey] = component[exposedProperty.propertyKey]
            }
            contextBridge.exposeInMainWorld(IpcRenderExposerAnno.exposerName, exposedObj)
        }
    }
    // ready?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void; 
}

