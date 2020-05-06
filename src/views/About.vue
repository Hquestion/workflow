<template>
    <div class="task-actions">
        <WorkFlow
                ref="workflow"
                style="width:100vw;height:100vh"
                item-key="icon"
                :item-size="getItemSize"
                item-type="custom"
                :item-custom="customForeignEle"
                v-model="data"
                :gap-y="50"
                :node-click="handleNodeClick"
                :level-scene="true"
                :support-context-menu="false"
                :grid="false"
        ></WorkFlow>
    </div>
</template>

<script>
    import WorkFlow from '@/components/workflow/WorkFlow';
    import PeopleTooltip from '@/components/actions/PeopleTooltip';
    import Vue from 'vue';
    import api from '../api';
    import dayjs from 'dayjs';
    import * as d3 from 'd3';

    export default {
        name: 'TaskActions',
        components: {WorkFlow},
        data() {
            return {
                currentDate: dayjs().format('YYYY-MM-DD'),
                data: []
            };
        },
        methods: {
            getItemSize(d) {
                // 获取项目大小
                const metadata = d.meta || d;
                if (metadata.type === 'date') {
                    return [100, 50];
                } else if (metadata.type === 3) {
                    // 计算子任务size
                    const nameSize = this.calcTextWidth(metadata.name, {
                        'max-width': '250px',
                        'padding': '5px 10px',
                        'font-size': '14px',
                        'display': 'inline-block'
                    });
                    return [nameSize[0] + 30, nameSize[1] + 6];
                } else if (metadata.type === 4) {
                    let dHeight = 100;
                    let workHeight = 0;
                    if (metadata.workList) {
                        workHeight = metadata.workList.length * 32;
                    }
                    return [Math.max(dHeight, workHeight),550]
                }
            },
            handleNodeClick(d) {
                // todo 点击处理,在这里展示弹框即可
                alert(d.data.meta.name);
            },
            customForeignEle(div, data) {
                const {
                    makeNodeWithData
                } = this;
                // 自定义节点
                if (data) {
                    div.append(() => makeNodeWithData(div, data));
                } else {
                    div.append((d) => {
                        return makeNodeWithData(div, d);
                    });
                }
            },
            makeNodeWithData(div, data) {
                const {
                    isUpArrowEnable,
                    isDownArrowEnable,
                    changeDate,
                    showTooltip
                } = this;
                const metadata = data.data.meta;
                if (metadata.type === 'date') {
                    // 处理date
                    const container = d3.select(document.createElement('div'));
                    container.text(metadata.name).attr('class', 'action-root');
                    container.append('i')
                        .attr('class', 'iconfont icon-arrow-up')
                        .classed('is-disabled', !isUpArrowEnable(metadata.date))
                        .style('position', 'absolute')
                        .style('top', '-30px')
                        .style('left', '10px')
                        .style('font-size', '30px')
                        .on('click', () => {changeDate(-1)})
                    ;
                    container.append('i')
                        .attr('class', 'iconfont icon-arrow-down')
                        .classed('is-disabled', !isDownArrowEnable(metadata.date))
                        .style('position', 'absolute')
                        .style('bottom', '-30px')
                        .style('left', '10px')
                        .style('font-size', '30px')
                        .on('click', () => {changeDate(1)})
                    ;
                    return container.node();
                } else if (metadata.type === 3) {
                    // 处理子任务
                    const container = d3.select(document.createElement('div'));
                    container.attr('class', 'subtask-wrapper')
                        .style('width', '100%')
                        .style('height', '100%');
                    container.append('img')
                        .attr('src', metadata.dutyman.avatar)
                        .style('width', '20px')
                        .style('height', '20px')
                    ;
                    // todo 根据状态展示不同背景颜色
                    container.append('div')
                        .attr('class', 'subtask-name')
                        .text(metadata.name)
                        .style('background', '#f80')
                    ;
                    return container.node();
                } else {
                    const container = d3.select(document.createElement('div'));
                    container.attr('class', 'work-wrapper')
                        .style('width', '100%')
                        .style('height', '100%');
                    const avatarWrapper = container.append('div')
                        .attr('class', 'avatar-wrapper')
                        .style('width', '80px')
                        .style('text-align', 'center')
                        .on('mouseover', (d, i, n) => showTooltip(metadata, d, i, n))
                    ;
                    avatarWrapper.append('img')
                        .attr('src', metadata.dutyman.avatar)
                        .style('width', '50px')
                        .style('height', '50px')
                    ;
                    avatarWrapper.append('div')
                        .style('width', '100%')
                        .text(metadata.dutyman.name);
                    avatarWrapper.append('div')
                        .style('width', '100%')
                        .text(metadata.dutyman.selectedRole && metadata.dutyman.selectedRole.name);
                    container.append('div')
                        .style('width', '20px')
                        .style('height', '100%')
                        .append('svg')
                        .append('path')
                        .attr('stroke', '#999')
                        .style('stroke-width', '1')
                        .attr('d', `M18,0,A 5,5 0 0,0 13, 5 L13,${data.size[0]/2 - 5},A8,8 0 0,1 5,${data.size[0]/2}
                         A8,8 0 0,1 13,${data.size[0]/2 + 5} L13,${data.size[0] - 5} A5,5,0 0,0 18,${data.size[0]}`)
                    container.append('div')
                        .attr('class', 'work-item-wrapper')
                        .selectAll('.work-item')
                        .data(metadata.workList)
                        .enter()
                        .append('div')
                        .attr('class', 'work-item')
                        // 也可以继续创建自定义节点，自定义点击事件
                        .html((d) => {
                            return `${d.time} ${d.name} <a href="http://www.baidu.com" target="_blank">${d.workId}</a>`;
                        })
                    ;
                    return container.node();
                }
            },
            getDateName(date) {
                const today = dayjs().format('YYYY-MM-DD');
                const ms = dayjs(date) - dayjs(today);
                const day = Math.ceil(ms / 1000 / 60 / 60 / 24);
                if (day === 0) {
                    return '今日';
                } else if (day === -1) {
                    return '昨日';
                } else {
                    return date.slice(5);
                }
            },
            isUpArrowEnable(date) {
                const today = dayjs(dayjs().format('YYYY-MM-DD'));
                const min = today.add(-7, 'day');
                return !dayjs(date).isBefore(min);
            },
            isDownArrowEnable(date) {
                const today = dayjs(dayjs().format('YYYY-MM-DD'));
                return dayjs(date).isBefore(today);
            },
            changeDate(count) {
                d3.event.stopPropagation();
                this.currentDate = dayjs(this.currentDate).add(count, 'day').format('YYYY-MM-DD');
                this.switchDate(this.currentDate);
            },
            switchDate(date) {
                const root = {
                    type: 'date',
                    date: date,
                    name: this.getDateName(date) + '动态',
                    children: []
                };
                api.getTaskActionsByDate(this.currentDate).then(res => {
                    root.children = res;
                    this.data = [root];
                });
            },
            calcTextWidth(text, styles) {
                const dummy = d3.select('#dummy');
                let textWidth = 0;
                let textHeight = 0;
                const div = dummy.selectAll('.dummyText')
                    .data([text])
                    .enter()
                    .append("div")
                    .text((d) => d);
                for(let key in styles) {
                    div.style(key, styles[key]);
                }
                div.each((d, i, n) => {
                    textWidth = n[i].offsetWidth;
                    textHeight = n[i].offsetHeight;
                    n[i].remove() // remove them just after displaying them
                });
                return [textHeight, textWidth]
            },
            showTooltip(meta, d, i, n) {
                const Cons = Vue.extend(PeopleTooltip);
                const ins = new Cons();
                ins.meta = meta.dutyman;
                ins.$mount();
                this.$tooltip.open(n[i], ins.$el);
            }
        },
        mounted() {
            // todo 根据日期获取动态数据
            this.switchDate(this.currentDate);
        }
    }
</script>

<style lang="scss" scoped>
    .task-actions {
        & /deep/ {
            .action-root {
                position: relative;
                width: 48px;
                height: 48px;
                border-radius: 5px;
                background: #fff;
                border: 1px solid #999;
                padding: 5px;
                text-align: center;
                margin-top: 25px;
                .iconfont {
                    cursor: pointer;
                    &.is-disabled {
                        opacity: 0.2;
                        pointer-events: none;
                    }
                }
            }
            .subtask-wrapper {
                text-align: left;
                .subtask-name {
                    padding: 5px 10px;
                    border: 1px solid #dedede;
                    border-radius: 8px;
                    width: 100%;
                    color: #fff;
                }
            }
            .work-wrapper {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: flex-start;
                .work-item-wrapper {
                    margin-left: 15px;
                    .work-item {
                        line-height: 32px;
                        font-size: 16px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        a {
                            color: #f00;
                        }
                    }
                }
            }
        }
    }
</style>
