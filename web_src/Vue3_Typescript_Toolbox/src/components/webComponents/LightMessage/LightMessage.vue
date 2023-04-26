<template></template>

<script lang="ts">
import { defineComponent } from "vue"
import { ElMessage } from 'element-plus'
import { VueComponent,Method } from "@/VueObjBox/annotations"

@VueComponent("LightMessage")
class LightMessage{
    
    @Method()
    InfoMessage(message){
        ElMessage({
            duration:5000,
            showClose: true,
            grouping: true,
            message: message,
            type: 'info',
        })
    }
    @Method()
    WarningMessage(message){
        ElMessage({
            duration:5000,
            showClose: true,
            grouping: true,
            message: message,
            type: 'warning',
        })
    }
    @Method()
    SuccessMessage(message){
        ElMessage({
            duration:5000,
            showClose: true,
            grouping: true,
            message: message,
            type: 'success',
        })
    }
    @Method()
    ErrorMessage(message){
        ElMessage({
            duration:5000,
            showClose: true,
            grouping: true,
            message: message,
            type: 'error',
        })
    }
}

export default defineComponent(new LightMessage() as any)

</script>
  