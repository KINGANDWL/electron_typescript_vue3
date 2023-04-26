import { ObjBoxHelper, ObjBoxInterface, ScanDir } from "objbox"
import { AppSetting } from './AppSetting';
import { app, Event, BrowserWindow } from 'electron';
import * as fs_extra from 'fs-extra';

//app单例检查
const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock && !AppSetting.App.multiApp) {
	app.quit()
} else {
	//容器日志配置
	let ElectronApplication: ObjBoxInterface = ObjBoxHelper.newObjBox(AppSetting.loggerSetting, fs_extra);

	//app应用准备就绪阶段
	app.on("ready", async () => {
		// 注册统一日志
		ElectronApplication.registerByObject(ElectronApplication.getLoggerManager(), "LoggerManager");
		// 注册App
		ElectronApplication.registerByObject(app, "ElectronApp");

		//扫描目录
		await ElectronApplication.registerFromFiles([
			new ScanDir(__dirname + "/IpcMain/")
		])
		await ElectronApplication.load()
		ElectronApplication.run()
	});



	//app应用所有窗口被关闭
	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") {
			app.quit();
		}
	});



	// app应用多开
	app.on("second-instance", (event: Event, commandLine: string[], workingDirectory: string, additionalData: any) => {
		if (!AppSetting.App.multiApp) {
			ElectronApplication.getComponent<BrowserWindow>("MainBrowserWindow").focus()
		}
	})

	process.on('uncaughtException', (error) => {
		console.error('Uncaught exception:', error)
	})
}