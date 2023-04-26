<template>

    <el-dialog 
        class="globalDialog" 
        v-model="dialogVisible" 
        width="50%" 
        :class="dialogStyle.border" 
        draggable 
        :close-on-click-modal="false">
        <template #header="{ close, titleId, titleClass }">

            <!-- <h4 :id="titleId" :class="titleClass">This is a custom header!</h4> -->
            <div class="dialogTitle" :class="dialogStyle.title">{{ currentNotification.title }}</div>
        </template>

        <span>{{ currentNotification.message }}</span>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="danger" @click="deleteNotification" v-show="currentNotification.onDelete != null" plain>
                    删除</el-button>
                <el-button type="success" @click="confirmNotification" plain>确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { NotificationType, NotificationUnit } from "./Notification";
import { VueComponent,Method,Data } from "@/VueObjBox/annotations"

@VueComponent("NotificationDialog")
class NotificationDialog{
    mounted() {
        this.cleanClosedNotification()
    }

    @Data()
    dialogVisible =  false
    @Data()
    notification_key_Map =  {} //no-key
    @Data()
    notificationMap =  {} //key-noti
    @Data()
    notificationNo =  1
    @Data()
    currentNotification =  new NotificationUnit("null", "", "", NotificationType.info, 0, () => { }, null)
    @Data()
    dialogStyle = {
        border: {
            "infoDialogBorder": false,
            "successDialogBorder": false,
            "warningDialogBorder": false,
            "errorDialogBorder": false,
        },
        title: {
            "infoDialogTitle": false,
            "successDialogTitle": false,
            "warningDialogTitle": false,
            "errorDialogTitle": false,
        }
    }
    @Data()
    id = "null"
    @Data()
    type = "hide"
    @Data()
    message = "message"
    
    @Method()
    setStyle() {
        this.dialogStyle = {
            border: {
                "infoDialogBorder": this.currentNotification.type == NotificationType.info,
                "successDialogBorder": this.currentNotification.type == NotificationType.success,
                "warningDialogBorder": this.currentNotification.type == NotificationType.warning,
                "errorDialogBorder": this.currentNotification.type == NotificationType.error,
            },
            title: {
                "infoDialogTitle": this.currentNotification.type == NotificationType.info,
                "successDialogTitle": this.currentNotification.type == NotificationType.success,
                "warningDialogTitle": this.currentNotification.type == NotificationType.warning,
                "errorDialogTitle": this.currentNotification.type == NotificationType.error,
            }
        }
    }

    @Method()
    showDialog() {
        // console.log("show")
        this.dialogVisible = true;
        this.setStyle()
    
    
        document.getElementsByClassName("el-overlay-dialog")[0].addEventListener("click",()=>{
            document.getElementsByClassName("el-dialog ")[0].classList.add("dialog_lighting")
            setTimeout(()=>{
                document.getElementsByClassName("el-dialog ")[0].classList.remove("dialog_lighting")
            },1000)
        })
    }

    @Method()
    hideDialog() {
        // console.log("hide")
        this.dialogVisible = false;
    }

    @Method()
    _addNotification(key, noti) {
    
        //删除旧对应关系
        let oldNotification = this.notificationMap[key]
        if (oldNotification != null && this.notification_key_Map[oldNotification.no] != null) {
            delete this.notification_key_Map[oldNotification.no];
        }
    
        let no = "notification_" + this.notificationNo
        this.notificationNo++
        this.notificationMap[key] = {
            notification: noti,
            time: noti.duration,
            no: no
        }
    
        //建立新对应关系
        this.notification_key_Map[no] = key
    }
    @Method()
    _addClickEventToNotificatiuonNode() {
        //每新增一个节点，就添加删除逻辑，用于消息弹窗弹出之后删掉消息小窗口
        let allNotificationPopWin = document.getElementsByClassName('el-notification__content')
        let that = this;
        allNotificationPopWin[allNotificationPopWin.length - 1].addEventListener('click', function (ev) {
            let notificationElement = this.parentElement.parentElement
            if(that.notificationMap[that.notification_key_Map[notificationElement.id]] != null){
                that.currentNotification = that.notificationMap[that.notification_key_Map[notificationElement.id]].notification
                that.showDialog()
                // 有点问题
                notificationElement.children[1].children[2].click()
            }
        });
    }
    //通过key重新弹出消息
    @Method()
    rePopNotificationByKey(key: string) {
        if (this.notificationMap[key] != null) {
            //弹出消息框
            this.currentNotification = this.notificationMap[key].notification
            this.showDialog()
            // 再次弹出气泡
            // this.notificationMap[key].showNotification()
            // this._addClickEventToNotificatiuonNode()
            // this._addNotification(key,this.notificationMap[key])
            return true
        }
        return false
    }
    //新增消息
    @Method()
    pushNotification(key: string, title: string, message: string, type: NotificationType, duration: number, onConfirm: () => void, onDelete: () => void, whenTimeOver: string) {
        if (this.notificationMap[key] != null) return false;
    
        let notification: NotificationUnit
        if (whenTimeOver != "close") {
            notification = new NotificationUnit(key, title, message, type, duration, onConfirm, onDelete)
        } else {
            notification = new NotificationUnit(key, title, message, type, duration, onConfirm, null)
        }
        //添加消息
        this._addNotification(key, notification)
        //弹出右下角消息泡泡
        notification.showNotification()
        //添加点击事件
        this._addClickEventToNotificatiuonNode()
    
        return true
    }
    
    @Method()
    deleteNotificationByKey(key: string) {
        if (this.notificationMap[key] != null) {
            //删除对应关系
            delete this.notification_key_Map[this.notificationMap[key].no];
            //删除消息存储
            delete this.notificationMap[key]
        }
    }
    //删除当前消息
    @Method()
    deleteNotification() {
        if (this.currentNotification != null) {
            this.currentNotification.onDelete()
            this.deleteNotificationByKey(this.currentNotification.key)
        }
        this.hideDialog()
    }
    //确认当前消息
    @Method()
    confirmNotification() {
        if (this.currentNotification != null) {
            this.currentNotification.onConfirm()
            this.deleteNotificationByKey(this.currentNotification.key)
        }
        this.hideDialog()
    }

    @Method()
    getAllKeys() {
        return Object.keys(this.notificationMap)
    }

    @Method()
    getAllNotificationInfo(){
        let info={}
        for(let i in this.notificationMap){
            info[i] = {
                title:this.notificationMap[i].notification.title,
                message:this.notificationMap[i].notification.message,
                type:this.notificationMap[i].notification.type,
            }
        }
        return info
    }

    @Method()
    cleanClosedNotification() {
        let t = 200;
        setInterval(() => {
            //删除whentimeover close的消息
            //为了防止一边遍历一遍删除出现bug
            let keys = Object.keys(this.notificationMap)
            for (let i in keys) {
                let key = keys[i]
                if (this.notificationMap[key].notification.onDelete == null) {
                    this.notificationMap[key].time -= t
                    if (this.notificationMap[key].time <= 0) {
                        this.deleteNotificationByKey(key)
                    }
                }
            }
        }, t)
    }
}


export default defineComponent(new NotificationDialog() as any)
</script>


<style>
.globalDialog{
    position: relative;
}
.el-dialog {
    border-radius: 5px !important;
    /* box-shadow: 1px 1px 1px 1px #a7a7a7 !important; */
    box-shadow: 1px 2px 5px 1px #a7a7a7 !important;
}

.el-overlay {
    background-color: rgb(255 255 255 / 0%) !important;
}

.dialogTitle {
    font-weight: bold;
}

.el-notification__content {
    cursor: pointer !important;
}

.el-notification {
    cursor: default;
}


/* .infoDialogBorder {} */

.successDialogBorder {
    border: 1px solid #aadd90;
}

.warningDialogBorder {
    border: 1px solid orange;
}

.errorDialogBorder {
    border: 1px solid red;
}

.infoDialogTitle {
    color:white
}

.successDialogTitle {
    color: #aadd90;
}

.warningDialogTitle {
    color: orange;
}

.errorDialogTitle {
    color: red;
}


.dialog_lighting {
    animation: lightning 0.6s ease-in-out;
}
/* 透明化窗口
-webkit-linear-gradient(left,rgba(0,0,0,0.4)0%,rgba(0,0,0,0.6)50%,rgba(0,0,0,0.8)100%) */
</style>