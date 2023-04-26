<template>
	<!-- electron控制栏 -->
	<TopBar ref="TopBar" :appName="appName" :appiconPath="appiconPath"></TopBar>

	<!-- 顶部加载条 -->
	<div style="position:relative;">
		<Loading ref="Loading"></Loading>
	</div>
	<div style="position: absolute;left: 0;right: 0;top: 40%;z-index:2000;">
		<Loading2 ref="Loading2"></Loading2>
	</div>
	<!-- 顶部弹出信息 -->
	<LightMessage ref="LightMessage"></LightMessage>


	<!-- element-plus方式 -->
	<el-scrollbar @mousedown="_whileMouseDown($event)">
		<!-- 其他内容往这里面添加 -->
		<DebuggerTag></DebuggerTag>
		<!-- 其他内容往这里面添加 -->
	</el-scrollbar>


	<!-- 旧版本 -->
	<!-- <div class="MainArea myscroll" @mousedown="_whileMouseDown($event)">
		
	</div> -->



	<div style="position:relative;">
		<!-- 右下角消息气泡 -->
		<NotificationDialog ref="NotificationDialog"></NotificationDialog>
	</div>

	<!-- 右击鼠标菜单 -->
	<RightClick ref="RightClick"></RightClick>
	<Alert ref="Alert"></Alert>





	<!-- 函数组件 -->
	<!-- 键盘按压事件 -->
	<KeyboardEvent ref="KeyboardEvent"></KeyboardEvent>
	<!-- vue数据存储 -->
	<ComponentGlobalSaver ref="ComponentGlobalSaver"></ComponentGlobalSaver>
</template>

<script lang="ts">
//公共组件
import { WebSetting } from './setting'


// web组件
import DebuggerTag from './test/DebuggerTag.vue'
import { defineComponent } from "vue"
import RightClick from "@/components/webComponents/RightClickMenu/RightClickList.vue"
import type { RightClickListUnit } from '@/components/webComponents/RightClickMenu/RightClickUnit'
import NotificationDialog from "@/components/webComponents/BottomNotification/NotificationDialog.vue"
import type { NotificationType } from '@/components/webComponents/BottomNotification/Notification'
import Loading from "@/components/webComponents/LoadingBar/Loading.vue"
import Loading2 from "@/components/webComponents/LoadingBar/Loading2.vue"
import LightMessage from '@/components/webComponents/LightMessage/LightMessage.vue'
import Alert from "@/components/webComponents/Alert/Alert.vue"
import KeyboardEvent from '@/components/webComponents/KeyboardEvent/KeyboardEvent.vue'
import ComponentGlobalSaver from '@/components/webComponents/ComponentGlobalSaver/ComponentGlobalSaver.vue'

// electron组件
import TopBar from "@/components/electronComponents/TopControllerBar/TopBar.vue"



export default defineComponent({
	name: "App",
	components: {
		//挂载组件
		DebuggerTag: DebuggerTag,
		RightClick: RightClick,
		NotificationDialog: NotificationDialog,
		Loading: Loading,
		Loading2: Loading2,
		LightMessage: LightMessage,
		Alert: Alert,
		KeyboardEvent: KeyboardEvent,
		ComponentGlobalSaver: ComponentGlobalSaver,
		TopBar: TopBar,
	},
	setup(props, context) {
		//入口组件的入口	
	},
	data() {
		return {
			ElectronMode: WebSetting.ElectronMode,
			appName: WebSetting.appName,
			appiconPath: WebSetting.appiconPath,
			//右击菜单属性
			rightClickPosition: { x: 0, y: 0 },
			lastTarget: null
		}
	},
	mounted() {
		//暴露到控制台
		window["VueApp"] = this

		this._onChildIframeMessage()

		// this.addKeyBoardDownListener("wow", (key: string) => {
		// 	console.log(key)
		// })

		// NotificationType.info

		this.setAppTitle("Electron-Vue3测试")


		// 在非electron模式下自动将非electron元素删除
		if (this.ElectronMode != true) {
			let allElectronElements: NodeListOf<HTMLElement> = document.getElementsByClassName("ElectronElement") as unknown as NodeListOf<HTMLElement>
			for (let i = 0; i < allElectronElements.length; i++) {
				allElectronElements[i].style.display = "none"
			}
		}
		this.KeyBoardpreventDefault([/Ctrl_[a-zA-Z]/], [])

		// let i=0
		// let end = setInterval(()=>{
		// 	i++
		// 	this.showLoading2(i,null)
		// 	if(i >= 100){
		// 		clearInterval(end)
		// 	}
		// },100)
	},
	methods: {
		//==============键盘事件
		// 添加键盘按压监听
		addKeyBoardDownListener(listenerName: String, method: Function) {
			this.$refs.KeyboardEvent.addKeyBoardDownListener(listenerName, method)
		},
		removeKeyBoardDownListener(listenerName: String) {
			this.$refs.KeyboardEvent.removeKeyBoardDownListener(listenerName)
		},
		// 添加键盘抬起监听
		addKeyBoardUpListener(listenerName: String, method: Function) {
			this.$refs.KeyboardEvent.addKeyBoardUpListener(listenerName, method)
		},
		removeKeyBoardUpListener(listenerName: String) {
			this.$refs.KeyboardEvent.removeKeyBoardUpListener(listenerName)
		},
		KeyBoardpreventDefault(keydownRegxDenyArray: Array<RegExp>, keyupRegxDenyArray: Array<RegExp>) {
			this.$refs.KeyboardEvent.preventDefaultSetting(keydownRegxDenyArray, keyupRegxDenyArray);
		},




		//==============顶部信息
		setAppTitle(title: string) {
			this.$refs.TopBar.setTitle(title)
		},
		getAppTitle() {
			return this.$refs.TopBar.getTitle()
		},



		//==============iframe消息监听
		_onChildIframeMessage() {
			var that = this;
			//监听iframe传递过来的信息
			window.addEventListener("message", function (e) {
				// e.origin 来源
				// e.data 数据

				// console.log(e)

				// if (e.origin == 'https://127.0.0.1') {
				// 	//从iframe 接收的信息进行处理
				// 	that.handleHideStatus(e.data);
				// }
			});

			// 子iframe传递方式： window.parent.postMessage({"key":"value"}, "http://127.0.0.1:5173");
		},



		//==============打开鼠标右击菜单
		/**
		 * 
		 * @param event 右击事件
		 * @param rightClickListUnits 展示的菜单列表
		 * @param offset {x:xx,y:xx} 偏移量
		 */
		showRightClickList(event: any, rightClickListUnits: Array<RightClickListUnit>, offset: any, bindObject: Object) {
			if (rightClickListUnits != null && rightClickListUnits.length > 0) {
				if (offset == null) {
					offset = {
						x: 0, y: 0
					}
				}
				//按百分比偏移
				if (offset.x > -1 && offset.x < 1) {
					offset.x *= document.body.clientWidth
				}
				if (offset.y > -1 && offset.y < 1) {
					offset.y *= document.body.clientHeight
				}

				//显示右击菜单
				this.$refs.RightClick.show({
					x: event.pageX + offset.x,
					y: event.pageY + offset.y,
				}, rightClickListUnits, bindObject)
			}
		},
		_whileMouseDown(event: MouseEvent) {
			this.lastTarget = event.target
			this.$refs.RightClick.hide()
		},
		// 获取上一次操作对象
		getLastTarget() {
			return this.lastTarget
		},



		//==============全局缓存接口
		setComponentGlobal(key: string, value: any, time: number) {
			return this.$refs.ComponentGlobalSaver.setComponentGlobal(key, value, time)
		},
		updateComponentGlobal(key: string, value: any, time: number) {
			return this.$refs.ComponentGlobalSaver.updateComponentGlobal(key, value, time)
		},
		getComponentGlobal(key: string): any {
			return this.$refs.ComponentGlobalSaver.getComponentGlobal(key)
		},
		removeComponentGlobal(key: string): boolean {
			return this.$refs.ComponentGlobalSaver.removeComponentGlobal(key)
		},
		containComponentGlobal(key: string): boolean {
			return this.$refs.ComponentGlobalSaver.containComponentGlobal(key)
		},
		allComponentGlobal() {
			return this.$refs.ComponentGlobalSaver.allComponentGlobal()
		},



		//==============右下角消息气泡
		pushNotification(key: string, title: string, message: string, type: NotificationType, duration: number, onConfirm: () => void, onCancel: () => void, whenTimeOver: string) {
			return this.$refs.NotificationDialog.pushNotification(key, title, message, type, duration, onConfirm, onCancel, whenTimeOver);
		},
		//获取所有存在key
		getAllNotificationKeys() {
			return this.$refs.NotificationDialog.getAllKeys()
		},
		//通过key重新弹出窗口
		rePopNotificationByKey(key: string) {
			return this.$refs.NotificationDialog.rePopNotificationByKey(key)
		},
		//获取所有消息列表
		getAllNotificationInfo() {
			return this.$refs.NotificationDialog.getAllNotificationInfo()
		},



		//==============顶部加载条
		showLoading(progress: number, text: string, colorWithProgress: boolean) {
			/**
			 * progress:进度 0-100
			 * text:后面文本，null会使用默认旋转logo
			 * colorWithProgress：true会让进度条颜色随进度变化，false使用默认蓝色
			 */
			this.$refs.Loading.showLoading(progress, text, colorWithProgress)
		},
		hideLoading(endWithSuccess: boolean) {
			this.$refs.Loading.hideLoading(endWithSuccess)
		},
		showLoading2(progress: number, text: string) {
			/**
			 * progress:进度 0-100
			 * text:后面文本，null会使用默认Loading文本
			 */
			this.$refs.Loading2.showLoading(progress, text)
		},
		hideLoading2() {
			this.$refs.Loading2.hideLoading()
		},


		//==============顶部轻消息
		LightMessage(type: string, message: string) {
			switch (type) {
				case "warning": {
					this.$refs.LightMessage.WarningMessage(message)
				} break;
				case "success": {
					this.$refs.LightMessage.SuccessMessage(message)
				} break;
				case "error": {
					this.$refs.LightMessage.ErrorMessage(message)
				} break;
				default: {
					this.$refs.LightMessage.InfoMessage(message)
				}
			}
		},


		//==============警告框
		alert(title: String, text: String, type: String, confirm: Function, cancel: Function) {
			this.$refs.Alert.alert(title, text, type, confirm, cancel)
		},
	}
})

</script>

<style scoped>
.MainArea {
	height: 100%;
	overflow-y: auto;
}
</style>