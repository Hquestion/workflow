<template>
    <FormPanel class="task-budget" title="费用预算">
        <table>
            <tr>
                <td>预算来源</td>
                <td>
                    <el-select placeholder="请选择" v-model="meta.budgetSource">
                        <el-option label="预算来源1" value="1" />
                    </el-select>
                </td>
                <td>预算余额</td>
                <td>
                    <el-input type="text" readonly v-model="meta.budget" />
                </td>
                <td>任务预算总额</td>
                <td>
                    <el-input type="text" readonly v-model="meta.taskTotalBudget" />
                </td>
            </tr>
        </table>
        <table>
            <tr>
                <th>序号</th>
                <th>费用类别</th>
                <th>预算金额</th>
                <th>操作</th>
            </tr>
            <tr v-for="(item, index) in budgetList" :key="index">
                <td class="label">{{index +1}}</td>
                <td class="label">{{ item.costType }}</td>
                <td class="label">¥ {{ item.budgetAmount || 0 }}</td>
                <td>
                    <el-button size="mini" type="primary" @click="add(index)">添加</el-button>
                    <el-button size="mini" type="danger" @click="del(index)" v-show="index !== 0">删除</el-button>
                </td>
            </tr>
            <tr>
                <td>{{budgetList.length + 1}}</td>
                <td>合计</td>
                <td>¥ {{totalBudget}}</td>
                <td></td>
            </tr>
        </table>
    </FormPanel>
</template>

<script>
    import FormPanel from '@/components/task/dialog-full/FormPanel';
    export default {
        name: "TaskBudget",
        components: {FormPanel},
        props: {
            meta: {
                type: Object,
                default: () => ({})
            }
        },
        data() {
            return {};
        },
        computed: {
            budgetList: {
                get() {
                    if (this.meta.budgetList && this.meta.budgetList.length > 0) {
                        return this.meta.budgetList;
                    } else {
                        return ([
                            {
                                costType: '1',
                                budgetAmount: 100,
                                id: '1'
                            }
                        ]);
                    }
                },
                set(val) {
                    console.log(val);
                    this.meta.budgetList = val;
                }
            },
            totalBudget() {
                return this.budgetList.reduce((sum, item) => sum += item.budgetAmount, 0);
            }
        },
        methods: {
            add(index) {
                this.budgetList.splice(index, 0, {
                    costType: '1',
                    budgetAmount: 100,
                    id: (Math.random() * 10000).toFixed(2)
                });
            },
            del(index) {
                this.budgetList.splice(index, 1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .task-budget {
        table {
            width: 100%;
            border: 1px solid #dedede;
            border-collapse: collapse;
            tr {
                border: 1px solid #dedede;
                th {
                    border: 1px solid #dedede;
                    padding: 0 5px;
                    text-align: center;
                    height: 40px;
                    background: #f2f2f2;
                    font-weight: bold;
                    &:nth-last-child(1) {
                        width: 200px;
                    }
                }
                td {
                    border: 1px solid #dedede;
                    padding: 0 5px;
                    text-align: center;
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
