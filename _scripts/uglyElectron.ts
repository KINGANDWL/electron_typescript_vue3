import { Obfuscator } from './lib/JS_Obfuscator/Obfuscator';
import { ObfuscatorDefaultConfig } from './lib/JS_Obfuscator/ObfuscatorConfig';
import * as fs_extra from "fs-extra"

function listAllFile(dir:string):string[]{
    let result:string[] = []
    if(fs_extra.exists(dir) && fs_extra.statSync(dir).isDirectory()){
        let fileNames:string[] = fs_extra.readdirSync(dir)
        for(let filename of fileNames){
            if(fs_extra.statSync(dir+"/"+filename).isDirectory()){
                result = result.concat(listAllFile(dir+"/"+filename))
            }else{
                result.push(dir+"/"+filename)
            }
        }
    }

    return result
}

async function main(){
    let root = __dirname + "/../"

    let dir = root+"/buildElectron"
    let allFiles = listAllFile(dir)
    for(let eachFilepath of allFiles){
        if(eachFilepath.lastIndexOf(".js") == eachFilepath.length - 3){
            eachFilepath = eachFilepath.replace(/\\/g,"/")
            console.log("ugly: "+eachFilepath.slice(eachFilepath.lastIndexOf("/"),eachFilepath.length))
            await Obfuscator.encodeJsFile(eachFilepath,eachFilepath,ObfuscatorDefaultConfig)
        }else if(eachFilepath.lastIndexOf(".js.map") == eachFilepath.length - 7){
            fs_extra.removeSync(eachFilepath)
            console.log("remove: "+eachFilepath.slice(eachFilepath.lastIndexOf("/"),eachFilepath.length))
        }
    }
}
main()
