<template>
    <rect
            :x="gridInfo.x"
            :y="gridInfo.y"
            :width="gridInfo.width"
            :height="gridInfo.height"
            :fill="fill"
    ></rect>
</template>

<script>
    export default {
        name: 'Grid',
        props: {
            gridInfo: {
                type: Object,
                default: null
            },
            fill: {
                type: String,
                default: 'black'
            }
        }
    };
</script>

<style scoped>
</style>
