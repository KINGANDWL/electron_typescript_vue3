import { createApp } from 'vue'
import App from './App.vue'
import { VueObjBox } from './VueObjBox/VueObjBox'

//element-plus UI组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//font-awesome 字体库
import "@/components/webComponents/fontawesome-free-5.15.4-web/css/all.min.css"

async function main(){
    //@ts-ignore
    // console.log(App.components.MyComponents == App.components.HelloWorld.components.MyComponents)
    // 同一个对象不同data
    console.log("??????????")
    let vueObjBox = new VueObjBox()
    vueObjBox.injectVueApp(App)
    await vueObjBox.start()

    let app = createApp(App)
    // 挂载element-plus
    app.use(ElementPlus)
    app.mount('#app')
}
main()