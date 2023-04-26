import { Component } from "objbox";
import { DIR } from "../DIR";

@Component("MainWindowSetting")
export class MainWindowSetting implements Electron.BrowserWindowConstructorOptions{
    height = 600;
	width = 1200;
	// minWidth = 800;
	// minHeight = 600;
	//窗口是否可调整大小
	resizable = true;
	show = false;
	//取消electron原生边框，用vue自定义
	frame = false;
	//win左上角logo（由于取消了原生边框，因此看不见，前往vue进行自定义） 
	icon = DIR.web_src_staticHtml_resource+"/winicon.jpg";
    //窗口页面
    winPage = DIR.web_src_Vue3_buildVue+"/index.html";
	//win左上角title（由于取消了原生边框，因此看不见，前往vue进行自定义）
	title = "Electron应用";
	webPreferences = {
		// 允许加载不安全的网页
		webSecurity: false,
		//启用预加载node支持
		nodeIntegration: true,
		//预加载js
		// preload: DIR.MainWin + "MainWin_Preload.js",
		preload: DIR.src + "/IpcRender/MainWindow.preload.js",
		//是否允许使用开发者控制台
		devTools: true,
	}
}

