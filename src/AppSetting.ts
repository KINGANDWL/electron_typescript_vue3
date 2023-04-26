import { LoggerManagerConfig,Level, TimeFlag, DefaultManagerConfig } from "objbox/libs";
import { DIR } from "./DIR";

export class AppSetting {
    // 暂时废弃
    static loggerSetting: LoggerManagerConfig = DefaultManagerConfig;

    static App = {
        //是否允许程序多开（也就是运行程序被运行多次）
        multiApp: false
    }
}