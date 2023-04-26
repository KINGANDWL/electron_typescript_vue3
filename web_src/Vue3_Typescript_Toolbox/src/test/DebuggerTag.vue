<template>
    <div @contextmenu.prevent="rightClick" style="width:100%;height:1000px;">
        <demo></demo>
    </div>
</template>

<script lang="ts">
import { NotificationType } from "@/components/webComponents/BottomNotification/Notification"
import { defineComponent } from "vue"
import demo from "@/lib/annotation/demo.vue"
import { VueComponent,Method,Data } from "@/VueObjBox/annotations"


@VueComponent("DebuggerTag")
class DebuggerTag{
    $root:any
    
    props = {
        msg: {
            type: String
        }
    }

    @Data()
    key = ""  
    @Data()
    value = ""  
    @Data()
    testChecked = false
    @Data()
    testChecked2 = false
    @Data()
    loadingShow = false



    @Method()
    rightClick(event: any) {
        let that = this
        this.$root.showRightClickList(event, [
            {
                checked: false, title: "刷新", click: () => {
                    location.reload()
                }
            },
            {
                checked: false, title: "顶部加载条", subUnit: [
                    {
                        checked: that.loadingShow, title: "打开", click: () => {
                            this.$root.showLoading(70, null, false)
                            that.loadingShow = true
                        }
                    },
                    {
                        checked: !that.loadingShow, title: "关闭", click: () => {
                            this.$root.hideLoading(true)
                            that.loadingShow = false
                        }
                    }
                ]
            },
            {
                checked: false, title: "顶部弹出信息", subUnit: [
                    {
                        checked: null, title: "成功", click: () => {
                            this.$root.LightMessage("success", "message:string1")
                        }
                    },
                    {
                        checked: null, title: "错误", click: () => {
                            this.$root.LightMessage("error", "message:string2")
                        }
                    },
                    {
                        checked: null, title: "警告", click: () => {
                            this.$root.LightMessage("warning", "message:string3")
                        }
                    },
                    {
                        checked: null, title: "默认", click: () => {
                            this.$root.LightMessage("info", "message:string4")
                        }
                    }
                ]
            },
            {
                checked: false, title: "右下角信息栏", subUnit: [
                    {
                        checked: null, title: "成功", click: () => {
                            this.$root.pushNotification(
                                "key001", "title",
                                "messagemessage message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message  message message message message message message message message message message message message message message message ",
                                NotificationType.success, 300000,
                                () => {
                                    console.log("yes")
                                }, () => {
                                    console.log("no")
                                }, "hide"
                            )
                        }
                    },
                    {
                        checked: null, title: "错误", click: () => {
                            this.$root.pushNotification(
                                "key002", "title",
                                "messagemessage message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message  message message message message message message message message message message message message message message message ",
                                NotificationType.error, 300000,
                                () => {
                                    console.log("yes")
                                }, () => {
                                    console.log("no")
                                }, "hide"
                            )
                        }
                    },
                    {
                        checked: null, title: "警告", click: () => {
                            this.$root.pushNotification(
                                "key003", "title",
                                "messagemessage message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message  message message message message message message message message message message message message message message message ",
                                NotificationType.warning, 300000,
                                () => {
                                    console.log("yes")
                                }, () => {
                                    console.log("no")
                                }, "hide"
                            )
                        }
                    },
                    {
                        checked: null, title: "默认", click: () => {
                            this.$root.pushNotification(
                                "key004", "title",
                                "messagemessage message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message message  message message message message message message message message message message message message message message message ",
                                NotificationType.info, 300000,
                                () => {
                                    console.log("yes")
                                }, () => {
                                    console.log("no")
                                }, "hide"
                            )
                        }
                    },
                ]
            },
    
            {
                checked: false, title: "警告框", subUnit: [
                    {
                        checked: null, title: "成功", click: () => {
                            this.$root.alert("title", "text", "success", () => {
                                console.log("yes")
                            }, () => {
                                console.log("no")
                            })
                        }
                    },
                    {
                        checked: null, title: "错误", click: () => {
                            this.$root.alert("title", "text", "error", () => {
                                console.log("yes")
                            }, () => {
                                console.log("no")
                            })
                        }
                    },
                    {
                        checked: null, title: "警告", click: () => {
                            this.$root.alert("title", "text", "warning", () => {
                                console.log("yes")
                            }, () => {
                                console.log("no")
                            })
                        }
                    },
                    {
                        checked: null, title: "默认", click: () => {
                            this.$root.alert("title", "text", "info", () => {
                                console.log("yes")
                            }, () => {
                                console.log("no")
                            })
                        }
                    }
                ]
            },
    
            { checked: null, title: "title5", click: () => { console.log("title5 clicked") } },
            {
                checked: null, title: "title6", subUnit: [
                    { checked: null, title: "title6-sub-title1", click: () => { console.log("title6-sub-title1 clicked") } },
                    { checked: null, title: "title6-sub-title2", click: () => { console.log("title6-sub-title2 clicked") } },
                    { checked: null, title: "title6-sub-title2", click: () => { console.log("title6-sub-title2 clicked") } },
                    { checked: null, title: "title6-sub-title2", click: () => { console.log("title6-sub-title2 clicked") } },
                    { checked: null, title: "title6-sub-title2", click: () => { console.log("title6-sub-title2 clicked") } },
                    { checked: null, title: "title6-sub-title2", click: () => { console.log("title6-sub-title2 clicked") } },
                ], click: null
            },
        ], { x: 0, y: 0 }, null)
    }


}


export default defineComponent(new DebuggerTag() as any)



</script>

 