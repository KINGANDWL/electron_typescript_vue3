import { Component } from 'objbox';
import {
    getFunName,
    registerClass,
    registerMethod,
    registerProperty,
    ComponentCreatedType
} from "objbox"

//用于外部获取注解参数【非必要】
export interface VueComponentArg {
    componentName: string
}
/**
 * 默认class注解模板
 * @param yourArg1 
 * @param yourArg2 
 */
export function VueComponent(componentName: string): ClassDecorator {
    //获取当前函数名称，等效于let _annotationName = "VueComponent"
    let _annotationName = getFunName(2)
    return function (target: Function): any {
        if(componentName == null){
            throw new Error("Component name cannot be undefined or null")
        }
        // 如果你希望这个注解能够直接成为组件注解，就手动给当前注解手动添加注册
        registerClass(Component.name, { name: target.name, scope: ComponentCreatedType.Factory }, target)
        registerClass<VueComponentArg>(_annotationName, { componentName }, target)
    }
}


//用于外部获取注解参数【非必要】
export interface MethodArg {
    methodName:string
}
/**
 * 默认方法注解模板
 * @param yourArg1 
 * @param yourArg2 
 */
export function Method(methodName:string=null): MethodDecorator {
    //获取当前函数名称，等效于let _annotationName = "Method"
    let _annotationName = getFunName(2)

    //@ts-ignore
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        if(methodName == null){
            methodName = key
        }
        registerMethod<MethodArg>(_annotationName, { methodName }, target, key, descriptor)
    }
}


//用于外部获取注解参数【非必要】
export interface WatchArg {
    valueName:string
}
/**
 * 默认方法注解模板
 * @param yourArg1 
 * @param yourArg2 
 */
export function Watch(valueName: string): MethodDecorator {
    //获取当前函数名称，等效于let _annotationName = "Watch"
    let _annotationName = getFunName(2)

    //@ts-ignore
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        registerMethod<WatchArg>(_annotationName, { valueName }, target, key, descriptor)
    }
}


/**
 * 默认属性注解模板
 * @param yourArg1 
 * @param yourArg2 
 */
export function Data(): PropertyDecorator {
    //获取当前函数名称，等效于let _annotationName = "Data"
    let _annotationName = getFunName(2)
    //@ts-ignore
    return function (target: any, key: string) {
        registerProperty<any>(_annotationName, { }, target, key)
    }
}

/**
 * 默认属性注解模板
 * @param yourArg1 
 * @param yourArg2 
 */
export function Components (): PropertyDecorator {
    //获取当前函数名称，等效于let _annotationName = "Components"
    let _annotationName = getFunName(2)
    //@ts-ignore
    return function (target: any, key: string) {
        registerProperty<any>(_annotationName, { }, target, key)
    }
}


//用于外部获取注解参数【非必要】
export interface InjectPropertyWhenMountedArg{
    name: string
}
/**
 * 默认属性注解模板
 * @param yourArg1 
 * @param yourArg2 
 */
export function InjectPropertyWhenMounted (name: string): PropertyDecorator {
    //获取当前函数名称，等效于let _annotationName = "InjectPropertyWhenMounted"
    let _annotationName = getFunName(2)
    //@ts-ignore
    return function (target: any, key: string) {
        registerProperty<InjectPropertyWhenMountedArg>(_annotationName, { name }, target, key)
    }
}




//用于外部获取注解参数【非必要】
export interface InjectMethodWhenMountedArg {
    name: string
}
/**
 * 默认方法注解模板
 * @param yourArg1 
 * @param yourArg2 
 */
export function InjectMethodWhenMounted(name: string): MethodDecorator {
    //获取当前函数名称，等效于let _annotationName = "InjectMethodWhenMounted"
    let _annotationName = getFunName(2)

    //@ts-ignore
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        registerMethod<InjectMethodWhenMountedArg>(_annotationName, { name }, target, key, descriptor)
    }
}