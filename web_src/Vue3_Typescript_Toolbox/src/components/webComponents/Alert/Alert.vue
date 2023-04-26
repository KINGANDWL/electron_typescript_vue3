<template></template>

<script lang="ts">
import { ElMessageBox } from 'element-plus'
import { defineComponent } from "vue"
import { VueComponent,Method,Data } from "@/VueObjBox/annotations"

@VueComponent("Alert")
class Alert{
    
    @Data()
    types = ["success","error","info","warning"]
    

    @Method()
    alert(title,text,type:any,confirm,cancel) {
        if(this.types.indexOf(type)<0){
            type = "info"
        }
        ElMessageBox.confirm(
            text,title,
            {
                autofocus:false,
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: type,
                draggable: true,
                closeOnClickModal:false
            }
        ).then(() => {
            // console.log("确认")
            if(confirm){
                confirm()
            }
        }).catch(() => {
            // console.log("取消")
            if(cancel){
                cancel()
            }
        })
        //给背景罩添加点击事件
        document.getElementsByClassName("el-overlay-message-box")[0].addEventListener("click",()=>{
            document.getElementsByClassName("el-message-box")[0].classList.add("el-message-box_lighting")
            setTimeout(()=>{
                document.getElementsByClassName("el-message-box")[0].classList.remove("el-message-box_lighting")
                // setTimeout(()=>{
                //     document.getElementsByClassName("el-message-box")[0].classList.add("el-message-box_lighting")
                //     setTimeout(()=>{
                //         document.getElementsByClassName("el-message-box")[0].classList.remove("el-message-box_lighting")
                //     })
                // },200)
            },1000)
        })
    }


}

export default defineComponent(new Alert() as any)

</script>
  
<style>
    .el-message-box_lighting {
        animation: lightning 0.6s ease-in-out;
    }
</style>