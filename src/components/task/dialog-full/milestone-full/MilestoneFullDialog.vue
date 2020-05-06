<template>
    <DialogWrapper
            title="里程碑概况"
            width="1000px"
            :visible.sync="visible"
            :confirm-handler="confirmHandler"
            :cancel-handler="cancelHandler"
            ref="wrapper"
            @close="$emit('rejected')"
    >
        <FormPanel class="milestone-full-dialog" title="基本信息">
            <table>
                <tr>
                    <td>里程碑名称</td>
                    <td>
                        <el-input type="text" v-model="meta.name"/>
                    </td>
                    <td>
                        结束标志
                    </td>
                    <td>
                        <el-select v-model="meta.endTask">
                            <el-option label="子任务已" :value="1"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label">里程碑简述</td>
                    <td colspan="3">
                        <el-input type="text" v-model="meta.description"/>
                    </td>
                </tr>
                <tr>
                    <td class="label">
                        截止日期
                    </td>
                    <td colspan="3">
                        <el-date-picker
                                v-model="meta.endTime"
                                type="date"
                                placeholder="选择截止日期">
                        </el-date-picker>
                    </td>
                </tr>
            </table>
        </FormPanel>
    </DialogWrapper>
</template>

<script>
    import DialogWrapper from '@/components/task/DialogWrapper';
    import FormPanel from '@/components/task/dialog-full/FormPanel';
    import api from '../../../../api';
    export default {
        name: "MilestoneFullDialog",
        components: {
            DialogWrapper,
            FormPanel
        },
        data() {
            return {
                visible: false
            }
        },
        props: {
            meta: {
                type: Object,
                default: () => ({})
            }
        },
        methods: {
            confirmHandler() {
                return api.createMilestone(this.meta).then(data => {
                    this.$emit('resolved', data)
                }, () => {
                    this.$emit('rejected');
                });
            },
            cancelHandler() {
                return Promise.reject().then(()=> {}, () => {
                    this.$emit('rejected');
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .milestone-full-dialog {
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
