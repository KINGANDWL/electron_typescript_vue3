<template>
    <div @contextmenu.prevent="rightClick">
        <h1>右击我弹出菜单</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    name:"RightClickMenuDemo",
    props: {
        
    },
    setup(props, context) {
        
    },
    mounted() {
        
    },
    data() {
        return {
            testChecked:false,
            testChecked2:false,
        }
    },
    methods: {
        rightClick(event:any){
            this.$root.showRightClickList(event, [
                {checked:this.testChecked,title:"title1",subUnit:[],click:()=>{this.testChecked = !this.testChecked}},
                {checked:true,title:"title2",subUnit:[],click:()=>{console.log("title2 clicked")}},
                {checked:null,title:"title3",subUnit:[
                    {checked:this.testChecked2,title:"title3-sub-title1",click:()=>{console.log("title3-sub-title1 clicked");this.testChecked2 = !this.testChecked2}},
                    {checked:null,title:"title3-sub-title2",click:()=>{console.log("title3-sub-title2 clicked")}},
                ],click:null},
                
                {checked:null,title:"",subUnit:null,click:null},

                {checked:true,title:"title4",subUnit:[],click:()=>{console.log("title4 clicked")}},
                {checked:null,title:"title5",subUnit:[],click:()=>{console.log("title5 clicked")}},
                {checked:null,title:"title6",subUnit:[
                        {checked:null,title:"title6-sub-title1",click:()=>{console.log("title6-sub-title1 clicked")}},
                        {checked:null,title:"title6-sub-title2",click:()=>{console.log("title6-sub-title2 clicked")}},
                    ],click:null
                },
            ],null,null)
        },
    }
})



</script>

 