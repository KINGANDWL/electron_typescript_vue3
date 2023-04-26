import { ObjBoxHelper, ObjBoxInterface, ScanDir } from "objbox";
import { DefaultManagerConfig } from "objbox/libs";
import * as fs_extra from 'fs-extra';

async function main() {
    let ElectronApplication: ObjBoxInterface = ObjBoxHelper.newObjBox(DefaultManagerConfig,fs_extra);
    
    // 注册统一日志
    ElectronApplication.registerByObject(ElectronApplication.getLoggerManager(),"LoggerManager");

    //扫描目录
    await ElectronApplication.registerFromFiles([
        new ScanDir(__dirname+"/",[/^(MainWindow.preload)/])
    ])
    await ElectronApplication.load()
    ElectronApplication.run()
}
main()
