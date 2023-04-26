import { AutowireProperty, ComponentCreatedType, ComponentHandler, ComponentHandlerInterface, ObjBoxHelper, ObjBoxInterface, ScannedTemplate, getFunName, registerClass } from "objbox"
import { Constructor } from "objbox"

interface AppWindowAnnotationArg{
    componentName:string
    scope:ComponentCreatedType
    config:{winConfig:string}
}

/**
 * @param componentName 
 * @param scope 
 * @param config 
 */
export function AppWindow(componentName: string, scope: ComponentCreatedType, config: { winConfig: string }): ClassDecorator {
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        if (componentName == null) {
            componentName = target.name
        }
        if (scope == null) {
            scope = ComponentCreatedType.Singleton
        }
        registerClass("Component", { name: componentName, scope: scope }, target)
        registerClass(_annotationName, config, target)
    }
}


/**
 * 实现通过注解 @AppWindow(winConfig) 将组件当做配置注入到appwindows
 */
@ComponentHandler()
export class MainWindowAnnotationHandler implements ComponentHandlerInterface {
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate) {
        if (ObjBoxHelper.doesTemplateHaveClassAnnotation(AppWindow.name, template)) {
            let config = ObjBoxHelper.getClassAnnotationFromTemplate(AppWindow.name, template) as AppWindowAnnotationArg;
            if (config != null) {
                //@ts-ignore
                class _temp extends (template.newInstance as Constructor) {
                    constructor() {
                        //@ts-ignore
                        super(objbox.getComponent(config.winConfig))
                    }
                }
                template.newInstance = _temp as Constructor
            }
        }
    }
    // created?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void
    // completed?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void
    // ready?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void
}