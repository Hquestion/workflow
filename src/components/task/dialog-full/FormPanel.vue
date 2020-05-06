<template>
    <div class="form-panel">
        <div class="header">
            <div class="title">{{title}}</div>
            <div class="info">
                <slot name="right"></slot>
            </div>
        </div>
        <div class="main">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FormPanel",
        data() {
            return {
                model: {}
            };
        },
        props: {
            title: String
        }
    }
</script>

<style lang="scss" scoped>
    .form-panel {
        border: 1px solid #ccc;
        & + .form-panel {
            margin-top: 16px;
        }
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 20px;
            background: #dedede;
            border-bottom: 1px solid #ccc;
            .title {
                font-size: 16px;
            }
        }
        .main {
            min-height: 50px;
            background: #fff;
        }
    }
</style>
