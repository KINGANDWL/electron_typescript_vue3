<template>
    <div>

    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { VueComponent,Method,Data } from "@/VueObjBox/annotations"

@VueComponent("ComponentGlobalSaver")
class ComponentGlobalSaver{
    
    mounted() {
        this._setIntervalComponentGlobalClean()
    }
    
    @Data()
    componentGlobal = {}

    @Method()
    _newData(value: any, time: number) {
        return {
            value: value,
            time: time,
        };
    }
    //定时清理
    @Method()
    _setIntervalComponentGlobalClean() {
        let t = 100, count = 0;
        setInterval(() => {
            count += t;
            if (count >= 1000) {
                let keys = Object.keys(this.componentGlobal);
                for (let keyIndex in keys) {
                    let key = keys[keyIndex]
                    if (this.componentGlobal[key] != null) {
                        if (this.componentGlobal[key].time > 0) {
                            this.componentGlobal[key].time -= count;
                            if (this.componentGlobal[key].time <= 0) {
                                delete this.componentGlobal[key]
                            }
                        }
                    }
                }

                count = 0;
            }
        }, t)
    }

    @Method()
    setComponentGlobal(key: string, value: any, time: number) {
        if (this.componentGlobal[key] == null) {
            if (time == null) {
                time = -1
            }
            this.componentGlobal[key] = this._newData(value, time);
            return true;
        }
        return false
    }

    @Method()
    updateComponentGlobal(key: string, value: any, time: number) {
        if (this.componentGlobal[key] != null) {
            if (time == null) {
                time = -1
            }
            this.componentGlobal[key] = this._newData(value, time);
            return true;
        }
        return false
    }

    @Method()
    getComponentGlobal(key: string): any {
        if (this.componentGlobal[key] != null) {
            return this.componentGlobal[key].value
        }
        return null
    }

    @Method()
    removeComponentGlobal(key: string): boolean {
        if (this.componentGlobal[key] != null) {
            delete this.componentGlobal[key];
            return true;
        }
        return false
    }

    @Method()
    containComponentGlobal(key: string): boolean {
        return this.componentGlobal[key] != null;
    }

    @Method()
    allComponentGlobal() {
        let keys = Object.keys(this.componentGlobal);
        let result: Array<object> = []
        for (let keyIndex in keys) {
            let key = keys[keyIndex]
            result.push({
                key: key,
                value: this.componentGlobal[key].value
            })
        }
        return result;
    }
}



export default defineComponent(new ComponentGlobalSaver() as any)
</script>

<style>

</style>