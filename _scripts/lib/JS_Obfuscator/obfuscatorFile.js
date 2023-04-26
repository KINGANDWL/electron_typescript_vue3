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
const Obfuscator_1 = require("./Obfuscator");
const ObfuscatorConfig_1 = require("./ObfuscatorConfig");
if (process.argv.length < 4) {
    console.error("usage:obfuscatorFile inputDir outputDir");
    process.exit(0);
}
let inputDir = process.argv[2], outputDir = process.argv[3];
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Obfuscator_1.Obfuscator.encodeJsFile(inputDir, outputDir, ObfuscatorConfig_1.ObfuscatorDefaultConfig);
    });
}
main();
