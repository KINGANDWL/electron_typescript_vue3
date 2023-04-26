const path = require('path')

const rootDir = path.join(__dirname, "../")

export class DIR{
    static ROOT:string = rootDir;
    static src:string = path.join(rootDir, '/buildElectron/');
    static src_addons:string = path.join(rootDir, '/buildElectron/addons/');
    static src_IpcMain:string = path.join(rootDir, '/buildElectron/IpcMain/');
    static src_IpcRender:string = path.join(rootDir, '/buildElectron/IpcRender/');
    static src_lib:string = path.join(rootDir, '/buildElectron/lib/');
    static src_tools:string = path.join(rootDir, '/buildElectron/tools/');

    static web_src:string = path.join(rootDir, '/buildElectron/web_src/');
    static web_src_ElectronApi:string = path.join(rootDir, '/buildElectron/web_src/ElectronApi');
    static web_src_staticHtml:string = path.join(rootDir, '/buildElectron/web_src/staticHtml');
    static web_src_Vue3:string = path.join(rootDir, '/buildElectron/web_src/Vue3_Typescript_Toolbox');
    static web_src_staticHtml_JavaScript:string = path.join(rootDir, '/web_src/staticHtml/JavaScript/');
    static web_src_staticHtml_page:string = path.join(rootDir, '/web_src/staticHtml/page/');
    static web_src_staticHtml_resource:string = path.join(rootDir, '/web_src/staticHtml/resource/');

    static web_src_Vue3_buildVue:string = path.join(rootDir, '/web_src/Vue3_Typescript_Toolbox/buildVue/');
    static RuntimeData:string = path.join(rootDir, '/buildElectron/runtimeData/');
}