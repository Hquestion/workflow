<template>
    <div class="tooltip">
        <slot></slot>
        <div class="arrow-shadow"></div>
        <div class="arrow"></div>
    </div>
</template>

<script>
    export default {
        name: "Tooltip",
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            outerTransform: {
                type: Object,
                default: () => {}
            }
        },
        watch: {
            outerTransform: {
                immediate: true,
                deep: true,
                handler(val) {
                    if (val && val.k) {
                        this.$nextTick(() => {
                            this.$emit('updateTransform', val);
                        })
                    }
                }
            }
        }
    }
</script>

<style lang="scss">
    .tooltip {
        max-width: 300px;
        height: auto;
        background: #fff;
        padding: 10px;
        border: 1px solid #dedede;
        box-shadow: 1px 1px 4px 0 #ccc;
    }
    .tooltip {
        background: #fff;
        padding: 10px;
        text-align: center;
        .arrow {
            width: 0;
            height: 0;
            border-style: solid;
            position: absolute;
            margin: 5px;
        }
        .arrow-shadow {
            width: 0;
            height: 0;
            border-style: solid;
            position: absolute;
            margin: 0;
        }
    }
    .tooltip[x-placement^="bottom"] {
        margin-top: 5px;
        .arrow {
            border-width: 0 5px 5px 5px;
            border-color: transparent transparent #fff transparent;
            top: -5px;
            left: calc(50% - 5px);
            margin-top: 0;
            margin-bottom: 0;
        }
        .arrow-shadow {
            border-width: 0 7px 7px 7px;
            border-color: transparent transparent #dedede transparent;
            top: -7px;
            left: calc(50% - 6px);
            margin-top: 0;
            margin-bottom: 0;
        }
    }
    .tooltip[x-placement^="top"] {
        margin-bottom: 5px;
        .arrow {
            border-width: 5px 5px 0px 5px;
            border-color: #fff transparent transparent transparent;
            bottom: -5px;
            left: calc(50% - 5px);
            margin-top: 0;
            margin-bottom: 0;
        }
        .arrow-shadow {
            border-width: 7px 7px 0px 7px;
            border-color: #dedede transparent transparent transparent;
            bottom: -7px;
            left: calc(50% - 6px);
            margin-top: 0;
            margin-bottom: 0;
        }
    }

</style>
