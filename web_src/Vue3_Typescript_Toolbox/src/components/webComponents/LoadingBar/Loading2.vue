<template>
    <div class="circleLoading" v-show="show">
        <el-progress type="circle" :percentage="percentage" :color="colors">
            <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}%</span>
                <span class="percentage-label" v-show="loadingText != null">{{ loadingText }}</span>
                <span class="percentage-label" v-show="loadingText == null">Loading{{ ifNullloadingText }}</span>
            </template>
        </el-progress>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { VueComponent,Method,Data } from "@/VueObjBox/annotations"

@VueComponent("WaitingBar")
class WaitingBar{
    @Data()
    show = false
    @Data()
    percentage = 0
    @Data()
    colors = [
        { color: '#ff0000', percentage: 10 },
        { color: '#ff6e00', percentage: 30 },
        { color: '#ff9e00', percentage: 40 },
        { color: '#ffc300', percentage: 60 },
        { color: '#a4ff00', percentage: 80 },
        { color: '#33ff00', percentage: 90 },
        { color: '#0f9c2c', percentage: 100 },
        
        // { color: '#f56c6c', percentage: 20 },
        // { color: '#e6a23c', percentage: 40 },
        // { color: '#5cb87a', percentage: 60 },
        // { color: '#1989fa', percentage: 80 },
        // { color: '#6f7ad3', percentage: 100 },
    ]
    @Data()
    loadingText = null
    @Data()
    ifNullloadingText = ""
    
    mounted() {
        this.loadingTextIfNull()
    }

    @Method()
    showLoading(progress: number, loadingText: string) {
        this.show = true
        this.percentage = progress
        this.loadingText = loadingText
    }
    @Method()
    hideLoading() {
        this.show = false
    }
    @Method()
    loadingTextIfNull(){
        let text = ["",".","..","..."]
        let arr = [1,2,3,0]
        let i=0;
        setInterval(()=>{
            this.ifNullloadingText = text[i];
            i=arr[i]
        },1000)
    }
}
export default defineComponent(new WaitingBar() as any)

</script>

<style>
.percentage-value {
    display: block;
    margin-top: 10px;
    font-size: 28px;
}

.percentage-label {
    display: block;
    margin-top: 10px;
    font-size: 12px;
}

.circleLoading {
    width: 126px;
    margin: 0 auto;
}
</style>