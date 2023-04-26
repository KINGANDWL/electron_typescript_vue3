import { Obfuscator } from './Obfuscator';
import { ObfuscatorDefaultConfig } from './ObfuscatorConfig';


if(process.argv.length < 4){
    console.error("usage:obfuscatorFile inputDir outputDir")
    process.exit(0)
}

let inputDir = process.argv[2],outputDir = process.argv[3];

async function main(){
    await Obfuscator.encodeJsFile(inputDir,outputDir,ObfuscatorDefaultConfig)
}

main()