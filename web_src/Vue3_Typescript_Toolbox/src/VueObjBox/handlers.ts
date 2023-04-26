import { ComponentHandler, ComponentHandlerInterface, ObjBoxInterface, ScannedTemplate, ObjBoxHelper } from 'objbox';
import { VueComponent, Watch, WatchArg, Data, MethodArg, Method, Components, InjectPropertyWhenMounted, InjectMethodWhenMountedArg, InjectPropertyWhenMountedArg, InjectMethodWhenMounted, VueComponentArg } from './annotations';

@ComponentHandler()
export class WatchHandler implements ComponentHandlerInterface {
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate) { }
    created?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void
    completed?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void

    ready(objbox: ObjBoxInterface, template: ScannedTemplate, component: any) {
        if (ObjBoxHelper.doesComponentHaveClassAnnotation(VueComponent.name, component)) {
            let methodsAnno = ObjBoxHelper.getMethodsAnnotationFromComponent<WatchArg>(Watch.name, component);
            if (component.watch == null) {
                component.watch = {}
            }
            for (let each of methodsAnno) {
                component.watch[each.annotationArgs.valueName] = component[each.methodName]
            }
        }
    }

}



@ComponentHandler()
export class DataHandler implements ComponentHandlerInterface {
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate) { }
    created?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void
    completed?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void

    ready(objbox: ObjBoxInterface, template: ScannedTemplate, component: any) {
        if (ObjBoxHelper.doesComponentHaveClassAnnotation(VueComponent.name, component)) {
            let propertiesAnno = ObjBoxHelper.getPropertyAnnotationFromComponent<any>(Data.name, component);
            let injectAnno = ObjBoxHelper.getPropertyAnnotationFromComponent<InjectPropertyWhenMountedArg>(InjectPropertyWhenMounted.name, component);

            component.data = function () {
                let dataObj = {}
                let keyMap = {}
                if (propertiesAnno != null) {
                    let newC = objbox.getComponent(template.componentName);
                    for (let each of propertiesAnno) {
                        dataObj[each.propertyKey] = newC[each.propertyKey]
                        keyMap[each.propertyKey] = true
                    }
                }

                for (let each of injectAnno) {
                    //必须拥有@Data才能使用注入
                    if (keyMap[each.propertyKey]) {
                        dataObj[each.propertyKey] = objbox.getComponent(each.annotationArgs.name)
                    }
                }
                return dataObj
            }

        }
    }
}



@ComponentHandler()
export class MethodHandler implements ComponentHandlerInterface {
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate) { }
    created?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void
    completed?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void

    ready(objbox: ObjBoxInterface, template: ScannedTemplate, component: any) {
        if (ObjBoxHelper.doesComponentHaveClassAnnotation(VueComponent.name, component)) {
            let methodsAnno = ObjBoxHelper.getMethodsAnnotationFromComponent<MethodArg>(Method.name, component);

            if (component.methods == null) {
                component.methods = {}
            }
            for (let each of methodsAnno) {
                let mName = each.annotationArgs.methodName == null ? each.methodName : each.annotationArgs.methodName
                // component.methods[mName] = component[each.methodName]

                //调试时对vue组件方法进行跟踪，正式发布需要换成上面的
                component.methods["log_" + mName] = component[each.methodName]
                component.methods[mName] = function (...args: any) {
                    let result = this["log_" + mName](...args)
                    console.log(mName + "(", ...args, ") => ", result)
                    return result;
                }
            }
        }
    }
}


@ComponentHandler()
export class ComponentsHandler implements ComponentHandlerInterface {
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate) { }
    created?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void
    completed?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void

    ready(objbox: ObjBoxInterface, template: ScannedTemplate, component: any) {
        if (ObjBoxHelper.doesComponentHaveClassAnnotation(VueComponent.name, component)) {
            let componentsAnno = ObjBoxHelper.getPropertyAnnotationFromComponent<any>(Components.name, component);
            let vAnno = ObjBoxHelper.getClassAnnotationFromComponent<VueComponentArg>(VueComponent.name, component);

            if (component["name"] == null)
                component["name"] = vAnno.componentName

            let componentsObj = {}

            if (componentsAnno != null) {
                for (let each of componentsAnno) {
                    componentsObj[each.propertyKey] = component[each.propertyKey]
                }
            }
            component.components = componentsObj
        }
    }
}


@ComponentHandler()
export class MethodInjectHandler implements ComponentHandlerInterface {
    scanned(objbox: ObjBoxInterface, template: ScannedTemplate) { }
    created?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void
    completed?: (objbox: ObjBoxInterface, template: ScannedTemplate, component: any) => void

    ready(objbox: ObjBoxInterface, template: ScannedTemplate, component: any) {
        if (ObjBoxHelper.doesComponentHaveClassAnnotation(VueComponent.name, component)) {
            let injectAnno = ObjBoxHelper.getMethodsAnnotationFromComponent<InjectMethodWhenMountedArg>(InjectMethodWhenMounted.name, component);

            if (injectAnno != null && injectAnno.length > 0) {
                if (component.created == null) {
                    component.created = function () {
                        for (let each of injectAnno) {
                            this[each.methodName](objbox.getComponent(each.annotationArgs.name))
                        }
                    }
                } else {
                    let created = component.created;
                    component.created = function () {
                        created = created.bind(this)
                        for (let each of injectAnno) {
                            this[each.methodName](objbox.getComponent(each.annotationArgs.name))
                        }
                        created()
                    }
                }
            }
        }
    }
}