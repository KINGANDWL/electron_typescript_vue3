import * as Handlers from "./handlers"
import { VueComponentArg, VueComponent } from "./annotations"
import { ComponentCreatedType, ObjBoxHelper, ObjBoxInterface, Component, ComponentAnnotationArgs } from "objbox"
import { DefaultManagerConfig } from "objbox/libs"


export interface VueProxy {
    components: { [key: string]: VueProxy }
    name: string,
    _VueObjBoxChecked?: boolean
}

export class VueObjBox {
    private objbox: ObjBoxInterface
    constructor() {
        this.objbox = ObjBoxHelper.newObjBox(DefaultManagerConfig)
        for (let i in Handlers) {
            this.objbox.registerFromClass(Handlers[i])
        }
    }

    injectVueApp(component: any) {
        let _component = component as VueProxy
        if (_component != null) {
            if (_component._VueObjBoxChecked == null || _component._VueObjBoxChecked == false) {

                let anno = ObjBoxHelper.getClassAnnotationFromComponent<VueComponentArg>(VueComponent.name, _component)
                if (anno != null) {
                    let componentAnno = ObjBoxHelper.getClassAnnotationFromComponent<ComponentAnnotationArgs>(Component.name, _component)
                    // console.log("registerName: ",anno.componentName,component)
                    this.objbox.registerByObject(_component, anno.componentName, componentAnno.scope);
                }
                _component._VueObjBoxChecked = true

                if (_component.components != null) {
                    let componentNames: string[] = Object.keys(_component.components);
                    for (let eachName of componentNames) {
                        this.injectVueApp(_component.components[eachName])
                    }
                }
            }
        }
    }

    async start() {
        this.objbox.registerByObject({ a: 123 }, "testObj")

        await this.objbox.load()
        this.objbox.run()
    }
}