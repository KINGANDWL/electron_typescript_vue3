<!-- 
    使用规则
    当一个vue组件被右击时，root根组件会自动检测该组件是否有 rightclick(el:any) 函数
    如果有，则会触发右键事件
    这个时候子组件会通过 rightclick(el:any) 拿到当前被右击的对象
    同时，这个函数应该返回 Array<RightClickListUnit> 来表示展示的右击菜单
 -->


<template>
    <div id="ListBody" :style="{ 'left': position.x + 'px', 'top': position.y + 'px' }" v-if="rightClickShow">
        <div v-for="(each, index) in clickUnits" :class="{ 'ListUnitLine': each.title == '', 'ListUnit': each.title != '' }"
            @click="setClick(each.click)" @mouseleave="setChildList(-1)" @mouseover="setChildList(index)">
            <div class="unitSelected">
                <!-- {{each.checked?"√":""}} -->
                <span class="fas fa-check rightClickChecked" v-show="each.checked"></span>
            </div><!--
         -->
            <div class="unitTitle">{{ each.title }}</div><!-- 
         -->
            <div class="hasSubUnit" v-if="each.subUnit != null && each.subUnit.length > 0">
                <span class="fas fa-angle-right"></span>
            </div>

            <div class="ListChild" :style="{
                    'display': (each.subUnit != null && each.subUnit.length > 0 && showChildLList == index) ? 'inline-block' : 'none',
                    left: childPosition.x + 'px',
                    top: childPosition.y + 'px'
                }">
                <div v-for="(eachchild, eachchildIndex) in each.subUnit"
                    :class="{ 'ListUnitLine': eachchild.title == '', 'ListUnit': eachchild.title != '' }"
                    @click="setClick(eachchild.click)">
                    <div class="unitSelected">
                        <!-- {{eachchild.checked?"√":""}} -->
                        <span class="fas fa-check rightClickChecked" v-show="eachchild.checked"></span>
                    </div><!--
                  -->
                    <div class="unitTitle">{{ eachchild.title }}</div>
                </div>
            </div>
        </div>
        <!-- 子菜单 -->
        <!-- 需要支持在菜单前加上特定字符，例如 √ -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import type { RightClickListUnit } from "./RightClickUnit"
import { VueComponent,Method,Data } from "@/VueObjBox/annotations"

@VueComponent("RightClickList")
class RightClickList{
    props = {
        units: new Array<RightClickListUnit>()
    }

    @Data()
    rightClickShow = false  //展示菜单序号
    @Data()
    showChildLList = -1  //展示值列表序号
    @Data()
    childPosition = {
        x: 201,
        y: 0
    } 
    @Data()
    position = {
        x: 0,
        y: 0
    } 
    @Data()
    clickUnits = new Array<RightClickListUnit>() 
    @Data()
    bindObject = null

    @Method()
    setClick(click: Function) {
        if (click != null) {
            let bindObj = this.bindObject == null ? null : this.bindObject
            if (click(bindObj) !== false) {
                this.hide();
            }
        }
    }
    @Method()
    _setRightClickPosition(position, unitsNum) {
        // console.log(window.innerHeight)
        //整体偏移
        position.y -= 1
        position.x += 1

        //超界偏移
        let eachHeight = 29;
        let allHeight = eachHeight * unitsNum + 20;
        let allWidth = 202;
        //+20 是因为window.innerWidth与真实值有一个小偏差
        if (position.x + allWidth + 45 >= window.innerWidth) {
            position.x = position.x - allWidth - 1;
        }
        if (position.y + allHeight >= (window.innerHeight - 30)) {
            position.y = (window.innerHeight - 30) - allHeight;
        }
        return position
    }
    @Method()
    show(position, clickUnits, bindObject = null) {
        position = this._setRightClickPosition(position, clickUnits.length)
        this.position = position
        this.clickUnits = clickUnits

        this.rightClickShow = true

        this.bindObject = bindObject
    }
    @Method()
    hide() {
        this.rightClickShow = false
        this.showChildLList = -1
    }
    @Method()
    setChildList(index) {
        this.showChildLList = index
        if (index >= 0) {

            //超界偏移
            if (document.body.offsetWidth >= this.position.x + 390) {
                this.childPosition.x = 201
            } else {
                this.childPosition.x = -183
            }
            let subUnit = this.clickUnits[index].subUnit
            if (subUnit != null && subUnit.length > 0) {
                let eachHeight = 30;
                let allHeight = eachHeight * subUnit.length;
                if (document.body.offsetHeight >= this.position.y + 20 + index * eachHeight + allHeight) {
                    this.childPosition.y = -eachHeight - 5
                } else {
                    // this.childPosition.y=-allHeight -16
                    this.childPosition.y = -allHeight - 18
                }
            }
        }
    }
}
export default defineComponent(new RightClickList() as any)

</script>

<style>
.rightClickChecked {
    font-size: 10px;
}

#ListBody {
    user-select: none;
    /*不允许选中文字*/
    opacity: 0.9;
    width: 200px;
    height: auto;
    border: 1px solid black;
    box-shadow: 1px 2px 9px 0px #281912;
    border-radius: 3px;
    background-color: #281912;
    color: #dfdfdf;
    position: absolute;
    /* left: 10px;
        top: 63px; */
    z-index: 1000;
}

.ListUnitLine {
    height: 1px;
    background-color: #a8a8a8;
    overflow: hidden;
    margin-bottom: 5px;
    margin-top: 5px;
}

.ListUnit {
    width: 100%;
    margin-bottom: 5px;
    cursor: pointer;
    line-height: 19px;
    height: 23px;
    padding-top: 4px;
    transition: background-color 0.2s;

}

.ListUnit:first-child {
    margin-top: 8px;
}

.ListUnit:hover {
    background-color: #b19629;
}

.unitTitle {
    height: 100%;
    width: 80%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    display: inline-block;
    letter-spacing: 1px;

    /* display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis; */
}

.hasSubUnit {
    height: 100%;
    float: right;
    width: 10%;
    text-align: center;
    display: inline-block;
}

.unitSelected {
    height: 100%;
    float: left;
    display: inline-block;
    text-align: center;
    width: 10%;
}

.ListChild {
    /* left: 100%; */
    top: -32px;
    position: relative;

    width: 180px;
    height: auto;
    border: 1px solid black;
    box-shadow: 1px 2px 9px 0px #281912;
    border-radius: 3px;
    background-color: #281912;
    color: #dfdfdf;
    /* left: 10px;
        top: 63px; */
    z-index: 1001;
}

.ListChild div .unitSelected {
    width: 14%;
}

.ListChild div .unitTitle {
    width: 85%;
}</style>