<template>
    <!-- 最外层滑动栏(背景) -->
    <el-scrollbar ref="graphScroll" class="graphScroll" :class="backgroundBodyClass" @scroll="graphHandleScroll" :style="{
        'width': winWidth + 'px',
        'height': winHeight + 'px'
    }">
        <!-- 画布区，用于塞满背景 -->
        <div class="canvasArea" :class="canvasAreaClass" :style="{
            'width': canvasSizeWidth + 'px',
            'height': canvasSizeHeight + 'px'
        }">
            <!-- 绘制区，粘贴在画布上，是存放组件的容器 -->
            <div class="graphArea" :class="graphAreaClass" :style="{
                'transform': 'scale(' + Math.pow(2, canvasSetting.scale) + ',' + Math.pow(2, canvasSetting.scale) + ') rotate(' + canvasSetting.rotateXYZ.Z + 'deg) rotateX('+canvasSetting.rotateXYZ.X+'deg) rotateY('+canvasSetting.rotateXYZ.Y+'deg)'
            }">

                <slot name="graphContain"></slot>
            </div>
        </div>

        <div class="graphScrollOperation" :class="{ 'graphScrollOperation-hide': hideLeft }">
            <i class="fas hideLeft" :class="{
                'fa-angle-double-right': hideLeft,
                'fa-angle-double-left': !hideLeft
            }" @click="hideOperation"></i>
            {{ graphShow() }}
            <el-button class="graphArea-operationBtn" @click="resetStatus">状态重置</el-button>
            <el-button class="graphArea-operationBtn" @click="resetVision">坐标复位</el-button>
            <el-button class="graphArea-operationBtn" @click="resetRotateXYZ">旋转复位</el-button>
            <!-- rotateY(180deg) -->
            <!-- <el-button class="graphArea-operationBtn" @click="resetVision">镜像</el-button> -->
        </div>

        <div class="graphArea-slider rotate" :class="{ 'graphArea-slider-hide': hideLeft }">
            <span class="graphArea-sliderText">缩放</span>
            <el-input-number :step="0.05" v-model="canvasSetting.scale" :min="-10" :max="10" />
        </div>
        <div class="graphArea-slider rotateX" :class="{ 'graphArea-slider-hide': hideLeft }">
            <span class="graphArea-sliderText">X-旋转</span>
            <el-input-number :step="0.5" v-model="canvasSetting.rotateXYZ.X" :min="-180" :max="180" />
        </div>
        <div class="graphArea-slider rotateY" :class="{ 'graphArea-slider-hide': hideLeft }">
            <span class="graphArea-sliderText">Y-旋转</span>
            <el-input-number :step="0.5" v-model="canvasSetting.rotateXYZ.Y" :min="-180" :max="180" />
        </div>
        <div class="graphArea-slider rotateZ" :class="{ 'graphArea-slider-hide': hideLeft }">
            <span class="graphArea-sliderText">Z-旋转</span>
            <el-input-number :step="0.5" v-model="canvasSetting.rotateXYZ.Z" :min="-180" :max="180" />
        </div>

    </el-scrollbar>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { VueComponent,Method,Data } from "@/VueObjBox/annotations"

@VueComponent("GraphArea")
class GraphArea{
    $refs:any
    $root:any
    canvasSizeWidth:number
    canvasSizeHeight:number


    name = "GraphArea"
    props = {
        // 窗口class（基础窗口）
        backgroundBodyClass: "",
        // 窗口尺寸
        winHeight: 300,
        winWidth: 300,

        // 画布class
        canvasAreaClass: "",
        // 画布大小
        canvasSizeWidth: 300,
        canvasSizeHeight: 3000,

        // 绘制区class
        graphAreaClass: "",
    }

    mounted() {
        this.initData()
        this.slideToCenter()
        this.listenkeyboard()
        this.listenMouseWheel()
    }

    @Data()
    defaultConfig = {
        scaleLimit: {
            minSize: -10,
            maxSize: 10,
        },
        startPosition: {
            top: 0,
            left: 0
        }
    }

    // 滚动轴数据
    @Data()
    graphScrollData = {
        width: 0,
        height: 0
    }
    
    // 画布设置
    @Data()
    canvasSetting = {
        // 0为原始大小  
        scale: 0.0,
        // 旋转角度
        rotate: 0,
        // 默认视野中心
        centerOfVision: {
            top: 0.5,
            left: 0.5
        },
        // 轴旋转
        rotateXYZ: {
            X: 0,
            Y: 0,
            Z: 0,
        },
        currentPosition: {
            top: 0,
            left: 0
        }
    }
    @Data()
    ctrlGraph = false
    @Data()
    shiftGraph = false
    @Data()
    hideLeft = false

    @Method()
    graphHandleScroll({ scrollLeft, scrollTop }) {
        this.canvasSetting.currentPosition.left = scrollLeft
        this.canvasSetting.currentPosition.top = scrollTop
    }
    @Method()
    initData() {
        this.graphScrollData.width = this.$refs.graphScroll.wrap$.clientWidth
        this.graphScrollData.height = this.$refs.graphScroll.wrap$.clientHeight
    }
    @Method()
    slideToCenter() {
        let left = this.canvasSetting.centerOfVision.left * (this.canvasSizeWidth - this.graphScrollData.width)
        let top = this.canvasSetting.centerOfVision.top * (this.canvasSizeHeight - this.graphScrollData.height)

        this.$refs.graphScroll.scrollTo(
            left, top
        )
        this.defaultConfig.startPosition.left = left
        this.defaultConfig.startPosition.top = top
    }
    @Method()
    resetScale() {
        this.canvasSetting.scale = 0
    }
    @Method()
    listenkeyboard() {
        // 当按下ctrl时，不滑动画布，变成缩放大小
        this.$root.addKeyBoardDownListener("GraphAreaKeyListener", (key) => {
            console.log(key)
            if (key == "Control") {
                this.ctrlGraph = true
            }
            if (key == "Shift") {
                this.shiftGraph = true
            }
        })
        this.$root.addKeyBoardUpListener("GraphAreaKeyListener", (key) => {
            if (key == "Control") {
                this.ctrlGraph = false
            }
            if (key == "Shift") {
                this.shiftGraph = false
            }
        })
    }
    @Method()
    listenMouseWheel() {
        this.$refs.graphScroll.wrap$.addEventListener('mousewheel', (event: WheelEvent) => {
            // 当按下ctrl时，不滑动画布，变成缩放大小
            if (this.ctrlGraph) {
                let finallyScale = 0
                if (event.deltaY != 0) {
                    finallyScale = this.canvasSetting.scale + (event.deltaY / 100)
                } else if (event.deltaX != 0) {
                    finallyScale = this.canvasSetting.scale + (event.deltaX / 100)
                }

                if (finallyScale != 0) {
                    if (finallyScale > this.defaultConfig.scaleLimit.maxSize) {
                        finallyScale = this.defaultConfig.scaleLimit.maxSize
                    } else if (finallyScale < this.defaultConfig.scaleLimit.minSize) {
                        finallyScale = this.defaultConfig.scaleLimit.minSize
                    }

                    if (this.canvasSetting.scale != finallyScale) {
                        this.canvasSetting.scale = finallyScale
                    }
                }
                event.preventDefault();
            } else if (this.shiftGraph) {
                if (event.deltaY != 0) {
                    this.canvasSetting.rotateXYZ.Z = this.canvasSetting.rotateXYZ.Z + (event.deltaY / 100)
                } else if (event.deltaX != 0) {
                    this.canvasSetting.rotateXYZ.Z = this.canvasSetting.rotateXYZ.Z + (event.deltaX / 100)
                }
                event.preventDefault();
            }
        });
    }
    @Method()
    graphShow() {
        // console.log(this.canvasSetting.currentPosition.left,this.canvasSetting.currentPosition.top)
        return "缩放:" + this.canvasSetting.scale.toFixed(2) +
            "  视野(" + (this.canvasSetting.currentPosition.left - this.defaultConfig.startPosition.left + 0.4).toFixed(0) +
            "," + (this.canvasSetting.currentPosition.top - this.defaultConfig.startPosition.top).toFixed(0) + ")" +
            "  旋转:" + this.canvasSetting.rotateXYZ.Z.toFixed(2) + "度"
    }
    @Method()
    hideOperation() {
        this.hideLeft = !this.hideLeft
    }
    @Method()
    resetVision() {
        this.$refs.graphScroll.scrollTo(
            this.defaultConfig.startPosition.left, this.defaultConfig.startPosition.top
        )
    }
    @Method()
    resetRotateXYZ() {
        this.canvasSetting.rotateXYZ.X = 0
        this.canvasSetting.rotateXYZ.Y = 0
        this.canvasSetting.rotateXYZ.Z = 0
    }
    // 状态复位
    @Method()
    resetStatus() {
        this.canvasSetting.scale = 0
        this.resetRotateXYZ()
        this.resetVision()
    }
}




export default defineComponent(new GraphArea() as any)
</script>

<style>
.mainRow {
    height: 780px;
}

.fullCol {
    height: 100%;
}

.graphScroll {
    /* height: 100%;
    width: 100%; */
}

.canvasArea {
    /* position: relative; */
    overflow: hidden;
    background-color: #898989;
}

.graphArea {
    height: 100%;
    width: 100%;
    background-color: #e5e5e5;
    box-shadow: 0px 0px 50px 20px black;
}

/* 滚动条背景 */
.graphScroll .el-scrollbar__bar {
    /* background-color: red; */
}

/* 滚动条 */
.graphScroll .el-scrollbar__bar .el-scrollbar__thumb {
    background-color: rgb(70, 65, 126);
}

.graphScrollOperation:hover {
    opacity: 0.9;
}

.graphScrollOperation {
    position: absolute;
    height: 20px;
    width: 99%;
    margin: 0.5%;
    z-index: 100;
    top: 0;
    text-align: center;
    background: white;
    opacity: 0.4;
    font-size: 12px;
    line-height: 20px;
    overflow: hidden;
    border-radius: 4px;
    transition: width 0.3s;
}

.graphScrollOperation-hide {
    width: 19px;
}

.operationRow {
    padding: 2px;
}

.hideLeft {
    float: left;
    font-size: 12px !important;
    line-height: 20px !important;
    cursor: pointer;
    margin-left: 4px;
}

.graphArea-operationBtn {
    width: 5em !important;
    height: 100% !important;
    font-size: 12px !important;
    float: right;
    line-height: 100%;
    margin-right: 4px;
    margin-left: 0 !important;
}


.graphArea-slider-hide {
    width: 0px !important;
    overflow: hidden;
}
.graphArea-slider {
    display: flex;
    align-items: center;
    position: absolute;
    left: -15px;
    height: 20px;
    width: 180px;
    transition: width 0.3s;
    transform: scale(0.8);
    opacity: 0.4;
    overflow: hidden;
}
.graphArea-slider .el-input-number{
    width: 130px !important;
}
.graphArea-slider:hover{
    opacity: 1;
}
.graphArea-slider.rotate{
    top: 30px;
}
.graphArea-slider.rotateX{
    top: 55px;
}
.graphArea-slider.rotateY{
    top: 80px;
}
.graphArea-slider.rotateZ{
    top: 105px;
}

.graphArea-slider .el-slider {
    margin-top: 0;
    margin-left: 12px;
}

.graphArea-slider .graphArea-sliderText {
    font-size: 14px;
    color:black;
    line-height: 44px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
}

.graphArea-slider .graphArea-sliderText+.el-slider {
    flex: 0 0 70%;
}
</style>