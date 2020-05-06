<template>
    <el-dialog
            class="task-brief-dialog"
            :visible.sync="dialogVisible"
            :width="width"
            :title="title"
            @close="$emit('close')"
            :show-close="showClose"
    >
        <slot></slot>
        <div slot="footer" class="footer">
            <el-button type="default" @click="cancel">{{ cancelText }}</el-button>
            <el-button type="primary" @click="confirm">{{ confirmText }}</el-button>
        </div>
    </el-dialog>
</template>

<script>
    const noop = () => {};
    export default {
        name: "DialogWrapper",
        props: {
            title: {
                type: String,
                default: '系统提示'
            },
            visible: {
                type: Boolean,
                default: false
            },
            width: {
                type: String,
                default: '500px'
            },
            showClose: {
                type: Boolean,
                default: true
            },
            confirmHandler: {
                type: Function,
                default: noop
            },
            cancelHandler: {
                type: Function,
                default: noop
            },
            confirmText: {
                type: String,
                default: '确认'
            },
            cancelText: {
                type: String,
                default: '取消'
            }
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.visible;
                },
                set(val) {
                    this.$emit('update:visible', val);
                }
            },
        },
        methods: {
            cancel() {
                if (this.cancelHandler) {
                    this.dialogVisible = false;
                    return this.cancelHandler();
                } else {
                    this.dialogVisible = false;
                    this.$emit('close');
                }
            },
            confirm(model) {
                if (this.confirmHandler) {
                    return this.confirmHandler(model).then(() => {
                        this.dialogVisible = false;
                    });
                } else {
                    this.$emit('confirm', model);
                    this.dialogVisible = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>
