待完成：

electron 提供的接口列表

vue框架提供的组件列表

软件更新模块



# 设计信息

## 1、框架结构：

### vue

* 数据可视化：echart
* 组件库：elementplus
* 图标库：Font-Awesome5
* 自定义注解扩展:VAnnotation
* 常用的自定义注解库
  * 警告框、底部通知栏、键盘事件、顶部提示消息、加载条、右击菜单模板】electron自定义接口ts、
* 自动编译静态html
* 自动规避web状态下的electron元素

### electron

* 日志系统
* 存储系统
* addon VS工程
* js混淆工具：js-obfuscator
* 机器码生成工具
* 自动打包：electron-packager



## 2、script说明：





## 3、设计思路：

1、electron负责底层接口支持与底层调用

2、vue负责前端页面显示

3、vue通过script编译为静态html由electron进行加载

4、vue可以通过直接在浏览器运行进行调试

5、通过electron的preload进行vue所需的接口暴露



## 4、基本文件结构

```ini
|-- electron_typescript_vue3
    |-- frameReadme.md （框架描述）
    |-- package.json （包依赖与脚本配置）
    |-- README.md
    |-- tsconfig.json （typescript编译配置）
    |-- appResource （打包为应用所需资源）
    |-- build （打包应用目录）
    |-- dist （编译调试临时代码目录）
    |-- src （electron的typescript源码位置）
	|   |-- lib （electron复用组件）
	|
    |-- tools （其他附加自定义工具）
    |   |-- JS_Obfuscator （JavaScript混淆脚本）
    |
    |-- web_src （web前端源码位置）
        |-- staticHtml （静态web源码）
        |-- vue3 （vue3框架源码）
            |-- index.html （vue挂载主页）
            |-- package.json
            |-- README.md
            |-- tsconfig.json
            |-- vite.config.ts
            |-- dist （vue编译为静态html的临时位置）
            |-- public （vue所需静态资源位置）
            |-- src （vue源码）
                |-- App.vue （vue主组件）
                |-- main.ts （app挂载入口）
                |-- components (复用组件)
                |-- lib （扩展库）
```



# Electron 组件







# Web Api说明





# Vue组件

## 

