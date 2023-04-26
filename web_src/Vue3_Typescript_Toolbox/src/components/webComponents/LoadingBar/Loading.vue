<template>
    <div class="demo-progress">
        <el-progress :percentage="progress" :indeterminate="true" :color="_setColor()" :duration="2" v-show="isLoading">
            <span text class="fas fa-spin fa-hourglass-half loadingHourGlass" v-show="loadingText == null"></span>
            <span v-show="loadingText != null">{{ loadingText }}</span>
        </el-progress>
        <el-progress :percentage="successLoadingProgress" status="success" v-show="successLoading" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { VueComponent, Method, Data } from "@/VueObjBox/annotations"

@VueComponent("Loading")
class Loading {
    mounted() {
        // 强制修改logo的区域最小值
        let dom = document.getElementsByClassName("el-progress__text") as unknown as NodeListOf<HTMLElement>;
        if (dom.length >= 2) {
            dom[0].style.minWidth = "20px"
            dom[1].style.minWidth = "20px"
        }
    }

    @Data()
    isLoading = false
    @Data()
    loadingText = null
    @Data()
    colorWithProgress = false
    @Data()
    progress = 0
    @Data()
    colorList = [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#5cb87a', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#6f7ad3', percentage: 100 },
    ]
    @Data()
    successLoading = false
    @Data()
    successLoadingProgress = 0

    @Method()
    _setColor() {
        if (this.colorWithProgress) {
            return this.colorList
        }
        return "#409eff"
    }
    @Method()
    showLoading(progress, text, colorWithProgress) {
        /**
         * progress:进度 0-100
         * text:后面文本，null会使用默认旋转logo
         * colorWithProgress：true会让进度条颜色随进度变化，false使用默认蓝色
         */
        this.isLoading = true;
        this.progress = progress
        this.loadingText = text
        this.colorWithProgress = colorWithProgress
    }
    @Method()
    hideLoading(endWithSuccess) {
        this.isLoading = false
        this.loadingText = null
        this.progress = 0
        this.colorWithProgress = false
        if (endWithSuccess === true) {
            this.successLoading = true
            this.successLoadingProgress = 0;
            let t = setInterval(() => {
                this.successLoadingProgress++;
                if (this.successLoadingProgress >= 100) {
                    clearInterval(t)
                }
            }, 1)
            setTimeout(() => {
                this.successLoading = false
            }, 1200)
        }
    }
}


export default defineComponent(new Loading() as any)
</script>



<style scoped>
.demo-progress {
    position: absolute;
    top: 0;
    left: 1%;
    width: 98%;
    margin: 0;
    /* height: 15px; */
    height: 0px;
    z-index: 2000;
    margin-left: 2px;
    margin-right: 2px;
}

.loadingHourGlass {
    /* color: white; */
}
</style>
