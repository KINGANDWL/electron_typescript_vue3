"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Obfuscator_1 = require("./lib/JS_Obfuscator/Obfuscator");
const ObfuscatorConfig_1 = require("./lib/JS_Obfuscator/ObfuscatorConfig");
const fs_extra = require("fs-extra");
function listAllFile(dir) {
    let result = [];
    if (fs_extra.exists(dir) && fs_extra.statSync(dir).isDirectory()) {
        let fileNames = fs_extra.readdirSync(dir);
        for (let filename of fileNames) {
            if (fs_extra.statSync(dir + "/" + filename).isDirectory()) {
                result = result.concat(listAllFile(dir + "/" + filename));
            }
            else {
                result.push(dir + "/" + filename);
            }
        }
    }
    return result;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let root = __dirname + "/../";
        let dir = root + "/web_src/Vue3_Typescript_Toolbox/buildVue";
        let allFiles = listAllFile(dir);
        for (let eachFilepath of allFiles) {
            eachFilepath = eachFilepath.replace(/\\/g, "/");
            if (eachFilepath.lastIndexOf(".js") == eachFilepath.length - 3) {
                console.log("ugly: " + eachFilepath.slice(eachFilepath.lastIndexOf("/"), eachFilepath.length));
                yield Obfuscator_1.Obfuscator.encodeJsFile(eachFilepath, eachFilepath, ObfuscatorConfig_1.ObfuscatorDefaultConfig);
            }
            else if (eachFilepath.lastIndexOf(".js.map") == eachFilepath.length - 7) {
                console.log("remove: " + eachFilepath.slice(eachFilepath.lastIndexOf("/"), eachFilepath.length));
                fs_extra.removeSync(eachFilepath);
            }
        }
    });
}
main();
