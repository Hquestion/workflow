<template>
    <FormPanel class="task-base-info" title="基本信息">
        <table>
            <tr>
                <td>任务名称</td>
                <td>
                    <el-input type="text" v-model="task.name"/>
                </td>
                <td>
                    任务目标
                </td>
                <td colspan="3">
                    <el-input type="text" v-model="task.target" />
                </td>
            </tr>
            <tr>
                <td class="label">所属项目</td>
                <td>
                    <el-input type="text" v-model="task.project"/>
                </td>
                <td class="label">
                    开始日期
                </td>
                <td>
                    <el-date-picker
                            v-model="task.startTime"
                            type="date"
                            placeholder="选择开始日期">
                    </el-date-picker>
                </td>
                <td class="label">
                    截止日期
                </td>
                <td>
                    <el-date-picker
                            v-model="task.endTime"
                            type="date"
                            placeholder="选择截止日期">
                    </el-date-picker>
                    <el-checkbox v-model="task.noEnd">无</el-checkbox>
                </td>
            </tr>
            <tr>
                <td class="label">负责人</td>
                <td>
                    <el-input type="text" v-model="task.dutyman"/>
                </td>
                <td class="label">标签</td>
                <td colspan="3">
                    <el-input type="text" v-model="task.tags"></el-input>
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
    import FormPanel from '../FormPanel';
    export default {
        name: "TaskBaseInfo",
        props: {
            meta: {
                type: Object,
                default: () => ({})
            }
        },
        components: {
            FormPanel
        },
        computed: {
            task() {
                return this.meta || {};
            }
        }
    }
</script>

<style lang="scss" scoped>
    .task-base-info {
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
