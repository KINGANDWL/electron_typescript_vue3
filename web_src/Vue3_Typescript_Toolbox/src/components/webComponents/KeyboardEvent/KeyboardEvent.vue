<template>
    <div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { VueComponent,Method,Data } from "@/VueObjBox/annotations"

@VueComponent("KeyboardEvent")
class ComponentKeyboardEvent{
    mounted() {
        this._setGlobalKeyBoardDown()
    }
    
    //键盘按压事件记录
    @Data()
    keyboardDownListener =  {}
    @Data()
    keyboardUpListener =  {}
    @Data()
    controlKey =  {
        Shift: false,
        Alt: false,
        Control: false,
    }
    @Data()
    setting = {
        // 按压阻止默认事件正则列表
        keydownDenyArrayRegx: [] as Array<RegExp>,
        keyupDenyArrayRegx: [] as Array<RegExp>,
    }


    @Method()
    preventDefaultSetting(keydownDenyRegxArray: Array<RegExp>,keyupDenyRegxArray: Array<RegExp>) {
        if(keydownDenyRegxArray != null){
            this.setting.keydownDenyArrayRegx = keydownDenyRegxArray
        }
        if(keyupDenyRegxArray != null){
            this.setting.keyupDenyArrayRegx = keyupDenyRegxArray
        }
    }

    //==============全局键盘按压事件
    @Method()
    _setGlobalKeyBoardDown() {
        const that = this;
        document.addEventListener('keydown', that._onKeyBoardDown);
        document.addEventListener('keyup', that._onKeyBoardUp);
    }
    @Method()
    _onKeyBoardDown(event: KeyboardEvent) {
        var key = event.key;

        if (this.controlKey.Shift === true) {
            key = "Shift_" + key
        }
        if (this.controlKey.Alt === true) {
            key = "Alt_" + key
        }
        if (this.controlKey.Control === true) {
            key = "Ctrl_" + key
        }

        // console.log("down: "+key)
        let listenerNames = Object.keys(this.keyboardDownListener);
        for (let i in listenerNames) {
            let listenerName = listenerNames[i];
            if (this.keyboardDownListener[listenerName] != null) {
                let listener = this.keyboardDownListener[listenerName]
                listener(key)
            }
        }

        if (event.key == "Shift") {
            this.controlKey.Shift = true
        } else if (event.key == "Alt") {
            this.controlKey.Alt = true
        } else if (event.key == "Control") {
            this.controlKey.Control = true
        }

        for(let i in this.setting.keydownDenyArrayRegx){
            if(key.search(this.setting.keydownDenyArrayRegx[i]) == 0){
                event.preventDefault();
                return
            }
        }
    }
    @Method()
    _onKeyBoardUp(event: KeyboardEvent) {
        var key = event.key;

        if (key != "Shift" && key != "Alt" && key != "Control") {
            if (this.controlKey.Shift === true) {
                key = "Shift_" + key
            }
            if (this.controlKey.Alt === true) {
                key = "Alt_" + key
            }
            if (this.controlKey.Control === true) {
                key = "Ctrl_" + key
            }
        }

        if (event.key == "Shift") {
            this.controlKey.Shift = false
        } else if (event.key == "Alt") {
            this.controlKey.Alt = false
        } else if (event.key == "Control") {
            this.controlKey.Control = false
        }

        // console.log("up: "+key)
        let listenerNames = Object.keys(this.keyboardUpListener);
        for (let i in listenerNames) {
            let listenerName = listenerNames[i];
            if (this.keyboardUpListener[listenerName] != null) {
                let listener = this.keyboardUpListener[listenerName]
                listener(key)
            }
        }
        for(let i in this.setting.keyupDenyArrayRegx){
            if(key.search(this.setting.keyupDenyArrayRegx[i]) == 0){
                event.preventDefault();
                return
            }
        }
    }
    // 添加键盘按压监听
    @Method()
    addKeyBoardDownListener(listenerName: any, method: Function) {
        this.keyboardDownListener[listenerName] = method
    }
    @Method()
    removeKeyBoardDownListener(listenerName: any) {
        delete this.keyboardDownListener[listenerName]
    }
    // 添加键盘抬起监听
    @Method()
    addKeyBoardUpListener(listenerName: any, method: Function) {
        this.keyboardUpListener[listenerName] = method
    }
    @Method()
    removeKeyBoardUpListener(listenerName: any) {
        delete this.keyboardUpListener[listenerName]
    }
}


export default defineComponent(new ComponentKeyboardEvent() as any)
</script>

<style>

</style>