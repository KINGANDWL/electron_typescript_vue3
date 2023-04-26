import { BrowserWindow } from "electron";
import { AutowireMethod, AutowireProperty, ComponentCreatedType, TemplateHandler } from "objbox";
import { Logger, LoggerManager } from "objbox/libs";
import { AppWindow } from "./annotations/Window.annotation";
import { MainWindowSetting } from "./MainWindow.setting";
import { StartBrowserWindow } from "./StartWindow.window";

@AppWindow("MainBrowserWindow", ComponentCreatedType.Singleton, { winConfig: "MainWindowSetting" })
export class MainBrowserWindow extends BrowserWindow implements TemplateHandler {
	logger: Logger
	//注入日志
	@AutowireMethod("LoggerManager")
	setLogger(loggerManager: LoggerManager) {
		this.logger = loggerManager.getLogger(MainBrowserWindow)
	}


	@AutowireProperty("StartBrowserWindow")
	startBrowserWindow:StartBrowserWindow


	constructor(config: MainWindowSetting) {
		super(config);

		//开启控制台
		if (config.webPreferences.devTools) {
			this.webContents.openDevTools();
		}

		//加载与渲染页面
		this.loadFile(config.winPage);
		// this.mainWindow.loadURL("http://127.0.0.1:5173/");
		// 灵感：是不是可以利用vue的开发工具进行页面编译，而不是通过vuejs

		//主窗体被创建之后每10秒检查一次异常隐藏(这个是electron的bug)
		setTimeout(() => {
			if (!this.isVisible()) {
				this.show();
			}
		}, 10 * 1000)
	}

	// created?: () => void;
	// completed?: () => void;
	ready() {
		this.startBrowserWindow.show()
		setTimeout(()=>{
			this.startBrowserWindow.close()
			this.startBrowserWindow.destroy()
			this.show();
		},3000)
	}
}


