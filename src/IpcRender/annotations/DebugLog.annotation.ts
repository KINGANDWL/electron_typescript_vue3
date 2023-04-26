import { ComponentHandler, ComponentHandlerInterface, ObjBoxHelper, ObjBoxInterface, ScannedTemplate, getFunName, registerMethod } from "objbox"
import { Logger } from "objbox/libs"

//用于外部获取注解参数【非必要】
export interface DebugLogArg {}
/**
 * 默认方法注解模板
 * @param yourArg1 
 * @param yourArg2 
 */
export function DebugLog(): MethodDecorator {
    //获取当前函数名称，等效于let _annotationName = "DebugLog"
    let _annotationName = getFunName(2)

    //@ts-ignore
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        registerMethod<DebugLogArg>(_annotationName, { }, target, key, descriptor)
    }
}


@ComponentHandler()
export class DebugLogHandler implements ComponentHandlerInterface{
    private logger:Logger
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate){
        if(this.logger == null){
            this.logger = objbox.getLoggerManager().getLogger(DebugLogHandler)
        }
    }
    created(objbox: ObjBoxInterface, template: ScannedTemplate, component: any){
        let that = this
        let methodAnnos = ObjBoxHelper.getMethodsAnnotationFromComponent(DebugLog.name,component)
        for(let methodAnno of methodAnnos){
            ObjBoxHelper.insertFunctionBeforeMethod(component,methodAnno.methodName,(...args)=>{
                that.logger.debugArgs(template.componentName+"."+methodAnno.methodName+"(",...args,")");
                return args
            })
            ObjBoxHelper.insertFunctionAfterMethod(component,methodAnno.methodName,(result:any)=>{
                that.logger.debugArgs(template.componentName+"."+methodAnno.methodName+"(...args): ",result);
                return result
            })
        }
    }
    completed?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void;
    ready?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void;
}