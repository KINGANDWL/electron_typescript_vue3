import { Component } from "objbox";
import { DIR } from "../DIR";

@Component("StartWindowSetting")
export class StartWindowSetting implements Electron.BrowserWindowConstructorOptions{
    height = 400;
	width = 600;
	//窗口是否可调整大小
	resizable = false;
	show = true;
	//取消electron原生边框，用vue自定义
	frame = false;
    //窗口页面
    winPage = DIR.web_src_staticHtml_page+"/start.html";
	icon = DIR.web_src_staticHtml_resource+"/winicon.jpg";
	webPreferences = {
		// 允许加载不安全的网页
		webSecurity: false,
		//启用预加载node支持
		nodeIntegration: false,
		//是否允许使用开发者控制台
		devTools: false,
	}
}

