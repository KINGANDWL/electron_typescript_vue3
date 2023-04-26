<template>
    <div>
        <button @click="pushNotification">消息气泡</button>
        <button @click="rePopNotification">重新消息气泡</button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { NotificationType } from "@/components/webComponents/BottomNotification/Notification"

// import type { RightClickListUnit } from "./components/RightClickMenu/RightClickUnit"

export default defineComponent({
    name:"NotificationDemo",
    props: {

    },
    data() {
        return {
            
        }
    },
    methods: {
        pushNotification(){
            this.$root.pushNotification("key","title","message",NotificationType.success,4000,()=>{
                console.log("confirm:"+this.key)
            },()=>{
                console.log("delete:"+this.key)
            },"hide")
        },
        rePopNotification(){
            console.log(this.$root.rePopNotificationByKey("key"))
        }
    }
})



</script>

 