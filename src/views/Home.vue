<template>
    <div class="home" @selectstart="() => false">
        <div class="main">
            <div class="header">
                <el-tabs v-model="viewType" @tab-click="handleTabSwitch">
                    <el-tab-pane label="目标视图" name="target"></el-tab-pane>
                    <el-tab-pane label="分工视图" name="dutyman"></el-tab-pane>
                </el-tabs>
                <TemplateWrapper @select-person="handleSelectPerson" />
            </div>
            <Drop @drop="handleDrop">
                <WorkFlow
                        ref="workflow"
                        style="width:100vw;height:100vh"
                        item-key="icon"
                        :item-size="getItemSize"
                        item-type="custom"
                        :item-custom="customForeignEle"
                        v-model="data"
                        :gap-y="50"
                        :node-context-menu="getContextMenu"
                        :node-tooltip="getNodeTooltip"
                        :node-click="handleNodeClick"
                ></WorkFlow>
            </Drop>
        </div>
        <div class="home-right">

        </div>
        <PersonSelect
                :visible.sync="personSelectVisible"
                :node="data[0]"
        ></PersonSelect>
    </div>
</template>

<script>
    // @ is an alias to /src
    import WorkFlow from '@/components/workflow/WorkFlow';
    import * as d3 from 'd3';
    import TemplateWrapper from '@/components/task/TemplateWrapper';
    import { Drop } from 'vue-drag-drop';
    import {TASK_ICON_MAP, TASK_TYPES} from '@/components/task/config';
    import briefDialogManage from '@/components/task/dialog-brief/manage';
    import fullDialogManage from '@/components/task/dialog-full/manage';
    import PersonSelect from '@/components/task/person-select/PersonSelect';

    import MilestoneTooltip from '@/components/task/tooltip/MilestoneTooltip';
    import Vue from 'vue';

    export default {
        name: "Home",
        components: {
            PersonSelect,
            TemplateWrapper,
            WorkFlow,
            Drop
        },
        data() {
            return {
                viewType: 'target',
                data: [
                    {
                        id: 1,
                        name: '1',
                        type: 1,
                        dutyman: null,
                        children: [
                            {
                                id: 2,
                                name: '2',
                                type: 2,
                                dutyman: null,
                                children: [
                                    {
                                        id: 3,
                                        name: '4',
                                        type: 4,
                                        dutyman: null,
                                    },
                                    {
                                        id: 4,
                                        name: '5',
                                        type: 4,
                                        dutyman: null,
                                    },
                                    {
                                        id: 5,
                                        name: '7',
                                        type: 2,
                                        dutyman: null,
                                    }
                                ]
                            },
                            {
                                id: 6,
                                name: '3',
                                type: 3,
                                dutyman: null,
                                children: [
                                    {
                                        id: 7,
                                        name: '8',
                                        type: 4,
                                    },
                                    {
                                        id: 8,
                                        name: '9',
                                        type: 4,
                                    },
                                    {
                                        id: 9,
                                        name: '10',
                                        type: 2,
                                    }
                                ]
                            }
                        ]
                    }
                ],
                personSelectVisible: false
            };
        },
        methods: {
            getItemSize(d) {
                if ([TASK_TYPES.TASK, TASK_TYPES.SUBTASKS, TASK_TYPES.MILESTONE].includes(d.type)) {
                    return this.viewType === 'target' ? [50,50] : [120, 70];
                } else {
                    return [90,250];
                }
            },
            isIcon(d) {
                return [TASK_TYPES.TASK, TASK_TYPES.SUBTASKS, TASK_TYPES.MILESTONE].includes(d.data.meta.type);
            },
            customForeignEle(div, data) {
                if (data) {
                    const d = data;
                    if (this.isIcon(d)) {
                        const metadata = d.data.meta;
                        const src = this.viewType === 'target' ? TASK_ICON_MAP[metadata.type] : metadata.dutyman && metadata.dutyman.avatar;
                        div.append('img')
                            .attr('src', src)
                            .style('width', '50px')
                            .style('height', '50px');
                        if (this.viewType === 'dutyman') {
                            const { dutyman = {} } = metadata;
                            div.append('div')
                                .attr('class', 'person-name')
                                .style('text-align', 'center')
                                .style('width', '100%')
                                .text(dutyman && dutyman.name || '');
                            div.append('div')
                                .attr('class', 'person-role')
                                .style('text-align', 'center')
                                .style('width', '100%')
                                .text(dutyman && dutyman.selectedRole && dutyman.selectedRole.name || '')
                        }
                    } else {
                        const container = div.append('div');
                        container.classed('work-container', true)
                            .style('width', '240px')
                            .style('height', '80px')
                            .style('border', '1px solid #3bf')
                            .style('border-radius', '5px')
                            .style('padding', '10px')
                            .style('background', '#fff')
                            .style('display', 'flex')
                            .style('align-items', 'center');
                        const left = container.append('div')
                            .style('width', '60px')
                            .style('display', 'flex')
                            .style('flex-wrap', 'wrap')
                            .style('align-items', 'center')
                            .style('justify-content', 'center');
                        const right = container.append('div')
                            .style('margin-left', '10px');
                        left.append('img')
                            .attr('src', require('../assets/images/avatar.png'))
                            .style('width', '40px')
                            .style('height', '40px');
                        left.append('div')
                            .style('width', '60px')
                            .style('text-align', 'center')
                            .text(d.data.meta.name);

                        right.append('div')
                            .text('work1');
                        right.append('div')
                            .text('description');
                    }
                } else {
                    div.append((d) => {
                        if (this.isIcon(d)) {
                            const metadata = d.data.meta;
                            const src = this.viewType === 'target' ? TASK_ICON_MAP[metadata.type] : metadata.dutyman && metadata.dutyman.avatar;
                            const selection = d3.select(document.createElement('img'))
                                .attr('src', src)
                                .style('width', '50px')
                                .style('height', '50px');
                            if (this.viewType === 'dutyman') {
                                const { dutyman = {} } = metadata;
                                div.append('div')
                                    .attr('class', 'person-name')
                                    .style('text-align', 'center')
                                    .style('width', '100%')
                                    .text(dutyman && dutyman.name || '');
                                div.append('div')
                                    .attr('class', 'person-role')
                                    .style('text-align', 'center')
                                    .style('width', '100%')
                                    .text(dutyman && dutyman.selectedRole && dutyman.selectedRole.name || '')
                            }
                            return selection.node();
                        } else {
                            const container = d3.select(document.createElement('div'))
                                .classed('work-container', true)
                                .style('width', '240px')
                                .style('height', '80px')
                                .style('border', '1px solid #3bf')
                                .style('border-radius', '5px')
                                .style('padding', '10px')
                                .style('background', '#fff')
                                .style('display', 'flex')
                                .style('align-items', 'center');
                            const left = container.append('div')
                                .style('width', '60px')
                                .style('display', 'flex')
                                .style('flex-wrap', 'wrap')
                                .style('align-items', 'center')
                                .style('justify-content', 'center')
                            const right = container.append('div')
                                .style('margin-left', '10px');
                            left.append('img')
                                .attr('src', require('../assets/images/avatar.png'))
                                .style('width', '40px')
                                .style('height', '40px');
                            left.append('div')
                                .style('width', '60px')
                                .style('text-align', 'center')
                                .text(d.data.meta.name);

                            // todo 替换真实数据,根据事务类型不同展示不同内容
                            right.append('div')
                                .text('work1');
                            right.append('div')
                                .text('description');

                            return container.node();
                        }
                    })
                }

            },
            handleTabSwitch(tab) {
                this.viewType = tab.name;
                this.$refs.workflow.updateWorkflow();
            },
            handleDrop(d, event) {
                let target = event.target;
                let parentG;
                while(target.tagName.toLowerCase() !== 'svg') {
                    if (target.tagName.toLowerCase() === 'g' && target.classList.contains('node')) {
                        parentG = target;
                        break;
                    }else {
                        target = target.parentNode;
                    }
                }
                if (d && d.__remark__ === 'person') {
                    // todo 添加负责人
                    if (!parentG) return;
                    const targetNode = d3.select(parentG);
                    const parent = targetNode.datum();
                    let parentList = [];
                    var p = parent;
                    while(p && !parentList.includes(p.data.id)) {
                        parentList.push(p.data.id);
                        p = p.parent;
                    }
                    let nodes = this.findNodeByParentIds(parentList);
                    const node = nodes.pop();
                    // todo 调用接口，成功后弹出提示，并改变界面
                    this.$set(node, 'dutyman', d);
                    this.$message('成功添加负责人');
                    return;
                }
                if (d.type === 1 && this.data.length > 0) {
                    this.$message.warning('任务已存在！');
                    return;
                }
                if (parentG) {
                    // 添加到父节点，需判断能不能添加，若能则弹出相应弹框
                    const targetNode = d3.select(parentG);
                    const parent = targetNode.datum();
                    if (!this.isChildAllow(d, parent)) {
                        this.$message.warning('不允许新增此节点');
                        return false;
                    }
                    briefDialogManage.open(d.type, {
                        parent
                    }).then(data => {
                        briefDialogManage.open('improve', data).then((res) => {
                            // 完成创建，稍后用户自行完善详细信息
                            let parentList = [];
                            var p = parent;
                            while(p && !parentList.includes(p.data.id)) {
                                parentList.push(p.data.id);
                                p = p.parent;
                            }
                            let nodes = this.findNodeByParentIds(parentList);
                            const node = nodes.pop();
                            this.$refs.workflow.addChild(parent.data, {...res});
                            node.children.push({...res, children: []});
                        }, () => {
                            // 继续完善详细信息，展示详细信息弹框
                            fullDialogManage.open(d.type).then(data => {
                                data;
                                // todo 创建详细信息
                            }, () => {
                                // 完成创建，稍后用户自行完善详细信息
                                let parentList = [];
                                var p = parent;
                                while(p && !parentList.includes(p.data.id)) {
                                    parentList.push(p.data.id);
                                    p = p.parent;
                                }
                                let nodes = this.findNodeByParentIds(parentList);
                                const node = nodes.pop();
                                this.$refs.workflow.addChild(parent.data, {...data});
                                node.children.push({...data, children: []});
                            });
                        });
                    })
                } else {
                    // 添加到画布，判断是不是任务，否则无响应
                    if (d.type === 1) {
                        // 创建任务
                        briefDialogManage.open(d.type).then((data) => {
                            // 创建简单任务成功后，继续提示用户是否继续完善详细信息
                            briefDialogManage.open('improve', data).then((res) => {
                                // 完成创建，稍后用户自行完善详细信息
                                this.data.push({...res, children: []})
                            }, () => {
                                // 继续完善详细信息，展示详细信息弹框
                                fullDialogManage.open(d.type).then(data => {
                                    data;
                                    // todo 创建详细信息
                                }, () => {
                                    this.data.push({...data, children: []})
                                });
                            });
                        });
                    } else {
                        this.$message.warning('请选择父节点！');
                    }
                }
            },
            findNodeByParentIds(ids) {
                const nodes = [];
                let list = this.data;
                while(ids.length > 0) {
                    let id = ids.pop();
                    const node = list.find(item => item.id === id);
                    nodes.push(node);
                    list = node.children;
                }
                return nodes;
            },
            isChildAllow(child, parent) {
                if (!parent) {
                    return false;
                }
                const pType = parent.data.type;
                if (pType === TASK_TYPES.TASK) {
                    return true;
                }
                if (pType === TASK_TYPES.MILESTONE) {
                    if ([TASK_TYPES.SUBTASKS, TASK_TYPES.WORK].includes(child.type)) {
                        return true;
                    }
                }
                if (pType === TASK_TYPES.SUBTASKS) {
                    if ([TASK_TYPES.SUBTASKS, TASK_TYPES.WORK].includes(child.type)) {
                        return true;
                    }
                }
                if (pType === TASK_TYPES.WORK) {
                    return false;
                }
                return false;
            },
            handleSelectPerson() {
                this.personSelectVisible = true;
            },
            getContextMenu(data) {
                // todo 权限判断及回调函数
                const menus = [
                    {
                        label: '修改',
                        name: 'modify',
                        disabled: () => {
                            // 判断当前用户是节点负责人或上层节点
                            return false;
                        },
                        callback: () => {
                            console.log(data);
                        }
                    },
                    {
                        label: '申请完成',
                        name: 'finish',
                        disabled: () => {
                            // 判断当前用户是不是节点的上层节点负责人
                            return true
                        },
                        callback: () => {
                            console.log(data);
                        }
                    },
                    {
                        label: '关闭',
                        name: 'close',
                        disabled: () => {
                            // 判断当前用户是不是上级节点
                            return false
                        },
                        callback: () => {
                            console.log(data);
                        }
                    },
                ];
                return menus;
            },
            getNodeTooltip(d, i, n) {
                d;i;n;
                // todo 获取数据并展示相应的提示
                const Constructor = Vue.extend(MilestoneTooltip);
                const ins = new Constructor();
                ins.open();
                ins.$mount();
                return ins.$el;
            },
            handleNodeClick(d) {
                fullDialogManage.open(d.data.type, {meta: d.data.meta});
            }
        },
        mounted() {
        }
    };
</script>

<style lang="scss" scoped>
    .home {
        overflow: hidden;
        .main {
            width: calc(100% - 300px);
            overflow: hidden;
            height: 100vh;
            float:left;
        }
        .home-right {
            float: right;
            width: 300px;
            height: 100vh;
            border-left: 1px solid #dedede;
        }
        .header {
            & /deep/ {
                .el-tabs__header {
                    margin: 0;
                }
            }
        }
    }
</style>
