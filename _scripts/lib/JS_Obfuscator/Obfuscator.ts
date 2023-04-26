import { ObfuscatorConfig } from "./ObfuscatorConfig";

const fs = require('fs');
const JavaScriptObfuscator = require("javascript-obfuscator");

export class Obfuscator{

    /**
     * 对js文本进行混淆
     * @param jsCode 
     * @param config 
     */
    public static encodeJsCode(jsCode:string,config?:ObfuscatorConfig){
        const obfuscationResult = JavaScriptObfuscator.obfuscate(jsCode,config);
        return obfuscationResult.getObfuscatedCode();
    }
    
    /**
     * 对js文本进行混淆且输出到文件
     * @param jsCode 
     * @param config 
     */
    public static encodeJsCodeToFile(jsCode:string,outputDir:string,config?:ObfuscatorConfig):Promise<void>{
        return new Promise((res,rej)=>{
            let data = Obfuscator.encodeJsCode(jsCode,config)
            fs.writeFile(outputDir, Obfuscator.encodeJsCode(data,config) , function(err:Error) {
                if (!err) {
                    res()
                }else{
                    rej(err)
                }
            })
        })
    }


    /**
     * 对文件进行混淆
     * @param inputDir 被混淆js文件
     * @param outputDir 输出文件
     * @param config 
     */
    public static encodeJsFile(inputDir:string,outputDir:string,config?:ObfuscatorConfig):Promise<void>{
        return new Promise((res,rej)=>{
            fs.readFile(inputDir, 'utf-8', function(err0:Error, data:string) {
                if(err0){
                    rej(err0)
                }
                fs.writeFile(outputDir, Obfuscator.encodeJsCode(data,config) , function(err1:Error) {
                    if (!err1) {
                        res()
                    }else{
                        rej(err1)
                    }
                })
            })
        })
    }
}