<template>
    <FormPanel class="work-base-info" title="事务概况">
        <table>
            <tr>
                <td>事务主题</td>
                <td>
                    <el-input type="text" v-model="meta.name"/>
                </td>
                <td>
                    事务类别
                </td>
                <td colspan="3">
                    <el-select v-model="meta.type">
                        <el-option label="系统事务" :value="1"></el-option>
                        <el-option label="其他事务" :value="2"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td class="label">
                    截止日期
                </td>
                <td>
                    <el-date-picker
                            v-model="meta.endTime"
                            type="date"
                            placeholder="选择截止日期">
                    </el-date-picker>
                </td>
                <td class="label">负责人</td>
                <td>
                    <el-input type="text" v-model="meta.dutyman"/>
                </td>
                <template v-if="meta.type === 1">
                    <td>系统流程</td>
                    <td>
                        <el-select v-model="meta.type">
                            <el-option label="采购订单" :value="1"></el-option>
                            <el-option label="其他事务" :value="2"></el-option>
                        </el-select>
                    </td>
                </template>
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
        name: "WorkBaseInfo",
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
    .work-base-info {
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
