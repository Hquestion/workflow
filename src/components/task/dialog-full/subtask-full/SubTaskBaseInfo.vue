<template>
    <FormPanel class="subtask-base-info" title="任务概况">
        <table>
            <tr>
                <td>任务名称</td>
                <td>
                    <el-input type="text" v-model="meta.name"/>
                </td>
                <td>
                    任务目标
                </td>
                <td colspan="3">
                    <el-input type="text" v-model="meta.target" />
                </td>
            </tr>
            <tr>
                <td class="label">
                    开始日期
                </td>
                <td>
                    <el-date-picker
                            v-model="meta.startTime"
                            type="date"
                            placeholder="选择开始日期">
                    </el-date-picker>
                </td>
                <td class="label">
                    截止日期
                </td>
                <td>
                    <el-date-picker
                            v-model="meta.endTime"
                            type="date"
                            placeholder="选择截止日期">
                    </el-date-picker>
                    <el-checkbox v-model="meta.noEnd">无</el-checkbox>
                </td>
                <td class="label">负责人</td>
                <td>
                    <el-input type="text" v-model="meta.dutyman"/>
                </td>
            </tr>
            <tr>
                <td class="label">参与人</td>
                <td colspan="5">
                    <div class="participants">
                        <ul></ul>

                    </div>
                </td>
            </tr>
        </table>
    </FormPanel>
</template>

<script>
    import FormPanel from '@/components/task/dialog-full/FormPanel';
    export default {
        name: "SubTaskBaseInfo",
        components: {FormPanel},
        props: {
            meta: {
                type: Object,
                default: () => ({})
            }
        }
    }
</script>

<style lang="scss" scoped>
    .subtask-base-info {
        table {
            width: 100%;
            border: 1px solid #dedede;
            border-collapse: collapse;
            tr {
                border: 1px solid #dedede;
                td {
                    border: 1px solid #dedede;
                    padding: 0 5px;
                    text-align: left;
                    height: 40px;
                    &.label {
                        text-align: center;
                    }
                    & /deep/ {
                        input {
                            border: none;
                        }
                    }
                }
            }
        }
    }
</style>
