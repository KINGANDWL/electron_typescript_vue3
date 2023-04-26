"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra = require("fs-extra");
function showUsage() {
    console.error("usage1: filecmd|dircmd  mk|delete  path");
    console.error("usage2: filecmd|dircmd  copy|move  origin  target");
}
if (process.argv.length < 5) {
    showUsage();
    process.exit(0);
}
let filecmd = "filecmd", dircmd = "dircmd";
let cmd = process.argv[2].toLowerCase();
if ((cmd == filecmd || cmd == dircmd) && process.argv.length == 5) {
    let op = process.argv[3].toLowerCase();
    let path = process.argv[4];
    if (op == "mk") {
        if (cmd == filecmd) {
            fs_extra.createFileSync(path);
        }
        else if (cmd == dircmd) {
            fs_extra.mkdirSync(path, { recursive: true });
        }
    }
    else if (op == "delete") {
        if (fs_extra.existsSync(path)) {
            fs_extra.removeSync(path);
        }
    }
    else {
        showUsage();
    }
}
else if ((cmd == filecmd || cmd == dircmd) && process.argv.length == 6) {
    let op = process.argv[3].toLowerCase();
    let origin = process.argv[4];
    let target = process.argv[5];
    if (cmd == filecmd || cmd == dircmd) {
        if (op == "copy") {
            fs_extra.copySync(origin, target);
        }
        else if (op == "move") {
            fs_extra.moveSync(origin, target);
        }
        else {
            showUsage();
        }
    }
    else {
        showUsage();
    }
}
else {
    showUsage();
}
/**
 
    yarn compile & node ./_scripts/fileCmd.js dircmd delete ../obfuscateProject & node ./_scripts/fileCmd.js dircmd mk ../obfuscateProject & node ./_scripts/fileCmd.js dircmd copy ./ ../obfuscateProject & node ./_scripts/fileCmd.js dircmd delete ../obfuscateProject/ObjBox/ObjBox.ts & node ./_scripts/obfuscatorFile.js ./out/ObjBox/ObjBox.js ../obfuscateProject/ObjBox/ObjBox.js & start ../obfuscateProject
*/ 
