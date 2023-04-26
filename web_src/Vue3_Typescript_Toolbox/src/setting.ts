import {DIR} from "@/DIR"
import {AppWindow} from '@/ElectronApi/EApplication';


export class WebSetting {
    static ElectronMode:boolean = AppWindow.ElectronMode
    static appName:string =  "electron_vue3"
	static appiconPath:string = DIR.public_resources_dir.images+"/appicon.ico"
}
