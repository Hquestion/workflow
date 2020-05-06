<template>
    <div class="people-tooltip">
        <el-form label-width="50px" size="mini">
            <el-form-item label="姓名">
                {{meta.name}}
            </el-form-item>
            <el-form-item label="电话">
                {{meta.telephone}}
            </el-form-item>
            <el-form-item label="邮箱">
                {{meta.email}}
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "PeopleTooltip",
        props: {
            meta: {
                type: Object,
                default: () => {}
            }
        }
    }
</script>

<style lang="scss" scoped>
    .people-tooltip {
        min-width: 160px;
    }
</style>
