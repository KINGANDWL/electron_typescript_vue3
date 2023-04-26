<template>
    <!-- -webkit-app-region: drag 表示当前区域是win控制栏 -->
    <!-- -webkit-app-region: no-drag 用来排除内部组件-->
    <div class="ElectronElement TopBar" style="-webkit-app-region: drag">
        <!-- appIcon、appName、appTitle、minWin、maxWin、closeWin -->
        <div class="topUnit appicon"><img :src="appiconPath"/><span>{{appName}}</span></div><!--
     --><div class="topUnit appTitle">{{appTitle}}</div><!--
     --><div class="topUnit appController">
            <i class="winLogo minWindow far fa-window-minimize" style="webkit-app-region: no-drag;"
                @click="minWindow"
            ></i>
            <i class="winLogo restoreWindow far fa-window-restore" v-show="isMax" style="webkit-app-region: no-drag;"
                @click="restoreWindow"
            ></i>
            <i class="winLogo maxWindow far fa-window-maximize" v-show="!isMax" style="webkit-app-region: no-drag;"
                @click="maxWindow"
            ></i>
            <i class="winLogo closeWindow far fa-window-close" style="webkit-app-region: no-drag;"
                @click="closeWindow"
            ></i>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
// import { EApplication,EDialog } from "@/ElectronApi/EApplication";
import { AppWindow} from "@/ElectronApi/EApplication";
import { VueComponent,Method,Data } from "@/VueObjBox/annotations"

@VueComponent("TopBar")
class TopBar{
    props = {
        appName : String,
        appiconPath : String,
    }

    mounted() {
        setInterval(async ()=>{
            this.isMax = await AppWindow.windowStatus() == "max"
        },200)
    }
    @Data()
    appTitle = "This is title"
    @Data()
    isMax = false
    @Method()
    minWindow(){
        AppWindow.minSize()
        this.isMax = false
    }
    @Method()
    maxWindow(){
        AppWindow.maxSize()
        this.isMax = true
    }
    @Method()
    restoreWindow(){
        this.isMax = false
        AppWindow.defaultSize()
    }
    @Method()
    closeWindow(){
        AppWindow.messageBox(AppWindow.messageBoxType.warning,"程序退出","","确认退出?",["取消","确认"]).then((res)=>{
            if(res.response == 1){
                AppWindow.closeWindow();
            }
    
        })
    }
    //设置app顶部标题
    @Method()
    setTitle(title:string){
        this.appTitle = title
    }
    //获取app顶部标题
    @Method()
    getTitle(){
        return this.appTitle
    }
}


export default defineComponent(new TopBar() as any)

</script> 

<style>
    .TopBar{
        width: 100%;
        height: 30px;
        border-bottom: 1px solid #e9e9e9;
        -webkit-user-select: none;
        margin: 5px;
        margin-bottom: 0;
    }
    .topUnit{
        display: inline-block;
        height: 100%;
        line-height: 30px;
        font-size: 13px;

        float: left;
    }
    .appicon{
        width: 30%;
        float: left;
        overflow: hidden;
    }
    .appicon span{
        font-weight: bold;
    }
    .appicon *{
        float: left;
    }
    .appName{
        width: 7%;
        font-weight: bold;
    }
    .appTitle{
        width: 40%;
        text-align: center;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .appController{
        width: 30%;
        text-align: right;
    }
    .winLogo{
        width: 23px;
        display: inline-block;
        padding: 4px;
        cursor: pointer;
        text-align: center;
        border-radius: 3px;
    }
    .closeWindow{
        margin-right: 12px;
    }
    .minWindow:hover{
        background-color: #dddddd;
    }
    .maxWindow:hover{
        background-color: #dddddd;
    }
    .restoreWindow:hover{
        background-color: #dddddd;
    }
    .closeWindow:hover{
        background-color: #ff5c5c;
    }
</style>