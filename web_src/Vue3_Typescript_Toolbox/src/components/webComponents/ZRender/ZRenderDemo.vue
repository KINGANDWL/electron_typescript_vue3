<template>
    <div id="zrenderDom" ref="zrenderDom">

    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import * as zrender from "zrender";

export default defineComponent({
    name: "ZRenderDemo",
    // props: {

    // },
    setup(props, context) {

    },
    mounted() {
        this.zrenderOperation = zrender.init(this.$refs.zrenderDom);


        let circle = new zrender.Circle({
            shape: {
                cx: 150,
                cy: 50,
                r: 40
            },
            style: {
                fill: 'none',
                stroke: '#F00'
            }
        });
        this.zrenderOperation.add(circle)
    },
    data() {
        return {
            zrenderOperation: null,
        }
    },
    methods: {

    }
})
</script>

<style>
#zrenderDom {
    height: 300px;
    width: 100%;
}
</style>