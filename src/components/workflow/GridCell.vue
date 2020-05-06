<template>
    <pattern
            :id="id"
            x="0"
            y="0"
            patternUnits="userSpaceOnUse"
            :width="width"
            :height="height"
    >
        <path
                :d="d1"
                :stroke="color"
                stroke-width="1"></path>
        <path
                :d="d2"
                :stroke="color"
                stroke-width="1"></path>
    </pattern>
</template>

<script>
    export default {
        name: 'GridCell',
        props: {
            id: {
                type: String,
                required: true
            },
            width: {
                type: Number,
                default: 10
            },
            height: {
                type: Number,
                default: 10
            },
            color: {
                type: String,
                default: '#E3EBF2'
            }
        },
        data() {
            return {
                d1: `M0,0 L${this.width},0`,
                d2: `M0,0 L0,${this.height}`
            };
        }
    };
</script>

<style>
</style>
