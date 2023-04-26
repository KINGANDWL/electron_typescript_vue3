import { BrowserWindow } from "electron";
import { AutowireMethod, ComponentCreatedType, TemplateHandler } from "objbox";
import { Logger, LoggerManager } from "objbox/libs";
import { AppWindow } from "./annotations/Window.annotation";
import { StartWindowSetting } from "./StartWindow.setting";


@AppWindow("StartBrowserWindow", ComponentCreatedType.Singleton, { winConfig: "StartWindowSetting" })
export class StartBrowserWindow extends BrowserWindow implements TemplateHandler {
	constructor(config: StartWindowSetting) {
		super(config);

		//加载与渲染页面
		this.loadFile(config.winPage);

		// this.webContents.openDevTools()
	}

	// created?: () => void;
	// completed?: () => void;
	ready() {}
}


