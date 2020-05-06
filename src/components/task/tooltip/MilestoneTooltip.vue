<template>
    <el-form label-width="100" style="width:300px">
        <el-form-item label="里程碑名称">
            京东旗舰上线
        </el-form-item>
        <el-form-item label="里程碑日期">
            2018-03-22
        </el-form-item>
    </el-form>
</template>

<script>
    export default {
        name: "Tooltip",
        components: {

        },
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            dialogVisible: {
                get() {
                    return this.visible;
                },
                set(val) {
                    this.visible = val;
                }
            }
        },
        methods: {
            open() {
                this.dialogVisible = true;
            },
            close() {
                this.dialogVisible = false;
            }
        }
    }
</script>

<style scoped>

</style>
