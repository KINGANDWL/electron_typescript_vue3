"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Obfuscator = void 0;
const fs = require('fs');
const JavaScriptObfuscator = require("javascript-obfuscator");
class Obfuscator {
    /**
     * 对js文本进行混淆
     * @param jsCode
     * @param config
     */
    static encodeJsCode(jsCode, config) {
        const obfuscationResult = JavaScriptObfuscator.obfuscate(jsCode, config);
        return obfuscationResult.getObfuscatedCode();
    }
    /**
     * 对js文本进行混淆且输出到文件
     * @param jsCode
     * @param config
     */
    static encodeJsCodeToFile(jsCode, outputDir, config) {
        return new Promise((res, rej) => {
            let data = Obfuscator.encodeJsCode(jsCode, config);
            fs.writeFile(outputDir, Obfuscator.encodeJsCode(data, config), function (err) {
                if (!err) {
                    res();
                }
                else {
                    rej(err);
                }
            });
        });
    }
    /**
     * 对文件进行混淆
     * @param inputDir 被混淆js文件
     * @param outputDir 输出文件
     * @param config
     */
    static encodeJsFile(inputDir, outputDir, config) {
        return new Promise((res, rej) => {
            fs.readFile(inputDir, 'utf-8', function (err0, data) {
                if (err0) {
                    rej(err0);
                }
                fs.writeFile(outputDir, Obfuscator.encodeJsCode(data, config), function (err1) {
                    if (!err1) {
                        res();
                    }
                    else {
                        rej(err1);
                    }
                });
            });
        });
    }
}
exports.Obfuscator = Obfuscator;
