<template>
    <div ref="workflow" class="workflow" :style="wfStyle">
        <svg ref="svg" tabindex="0">
            <defs>
                <grid-cell id="grid-cell" />
            </defs>
            <g ref="bg" v-if="grid">
                <grid
                        :gridInfo="gridInfo"
                        fill="url(#grid-cell)"
                />
            </g>
            <g ref="content" id="content">

            </g>
        </svg>
        <div ref="dummy" id="dummy"></div>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    import config from './config';
    import GridCell from './GridCell';
    import Grid from './Grid';
    import { flextree } from 'd3-flextree';
    import { WorkFlowTree } from './WorkFlowTree';
    export default {
        name: "WorkFlow",
        components: {
            GridCell,
            Grid
        },
        props: {
            // x轴节点间间距，默认100
            gapX: {
                type: Number,
                default: 100
            },
            // y轴节点间间距，默认100
            gapY: {
                type: Number,
                default: 100
            },
            /**
             * 节点类型，支持三种类型：text | image | custom
             * text: 文本类型，通过itemKey确定需要展示的字段，将直接展示为文本
             * image: 图标类型，通过itemKey确定需要展示的字段，将直接展示为图标
             * custom：自定义类型，通过itemCustom接受函数，该函数接受两个参数：container和data，
             *         container为节点的容器（d3选择器）,data为节点上绑定的数据（需要注意，data可能不传）
             */
            itemType: {
                type: String,
                default: 'image' // 'text' ,'image', 'custom'
            },
            /**
             * 节点内容展示的字段的key，仅在itemType = 'text'或itemType='image'时生效
             */
            itemKey: {
                type: String,
                default: 'icon'
            },
            // 函数同步返回节点宽高，默认[50，50]
            itemSize: {
                type: Function,
                default: () => ([50, 50])
            },
            // 自定义节点函数，参考itemType说明
            itemCustom: {
                type: Function,
                default: () => null
            },
            // 节点之间连线的颜色，默认#3af
            lineColor: {
                type: String,
                default: '#3bf'
            },
            // v-model，实现数据的双向绑定
            value: {
                type: Array,
                default: () => []
            },
            // 是否支持右键菜单，默认支持，默认只有一个删除按钮
            supportContextMenu: {
                type: Boolean,
                default: true
            },
            // 函数同步返回节点的右键菜单列表，菜单定义如下：
            // {label: 'xx', name: 'xx', disabled: () => Boolean, callback => {}}
            nodeContextMenu: {
                type: Function,
                default: null
            },
            // 节点的tooltip函数，需返回tooltip内容的节点
            nodeTooltip: {
                type: Function,
                default: null
            },
            // 节点点击事件的回调
            nodeClick: {
                type: Function,
                default: null
            },
            // '层次感'，为true时偶数行会错位展示
            levelScene: {
                type: Boolean,
                default: false
            },
            // 树结构子节点的key
            childrenKey: {
                type: String,
                default: 'children'
            },
            // 每项数据的id的key，全局唯一
            idKey: {
                type: String,
                default: 'id'
            },
            // 右键菜单的删除回调，需返回promise
            delCallback: {
                type: Function,
                default: null
            },
            // 是否展示背景网格
            grid: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                zoom: d3.zoom(),
                svgWidth: 0,
                svgHeight: 0,
                zoomTransform: { x:0, y:0, k:1 },
                dTop: null,
                root: null,
                link: d3.linkHorizontal().x((d) => d[0]).y((d) => d[1]),
                wfData: [],
                updateValue: true,
                isInitial: true
            };
        },
        computed: {
            wfStyle() {
                return {};
            },
            gridWidth() {
                return Math.max(this.svgWidth, config.defaultGridWidth);
            },
            gridHeight() {
                return Math.max(this.svgHeight, config.defaultGridHeight);
            },
            gridInfo() {
                let { x, y, k } = this.zoomTransform;
                let gw = this.gridWidth;
                let gh = this.gridHeight;
                let gcw = config.cellWidth;
                let gch = config.cellHeight;
                return {
                    x: (-Math.ceil(x / gcw) * gcw) / k,
                    y: (-Math.ceil(y / gch) * gch) / k,
                    width: Math.max(gw / k, gw),
                    height: Math.max(gh / k, gh)
                };
            }
        },
        methods: {
            foreignY() { return 0},
            async makeCenter() { // 居中
                await d3.transition().end().then(() => {
                    const div = this.$refs.workflow;
                    const content = this.$refs.content.getBBox();
                    const { k } = this.zoomTransform;

                    // const x = (
                    //     -(div.offsetWidth - k*content.width)/(2*k)
                    //     - 5
                    // );
                    const x = -50;
                    const y = this.dTop ? (
                        -(div.offsetHeight - k*content.height)/(2*k)
                        - (-this.dTop.x - this.foreignY(this.dTop))
                    ) : -(div.offsetHeight - k*content.height)/(2*k);

                    this.workflow_svg.call(this.zoom.translateTo, x, y, [0, 0])
                })
            },
            async updateWorkflow() {
                if (this.wfData.data.length === 0) {
                    this.isInitial = true;
                }
                if (this.isInitial && this.wfData.data.length > 0) {
                    await this.makeCenter();
                }
                if (!this.wfData.data[0]) {
                    this.workflow_g.selectAll('g > *').remove();
                    return;
                }
                this.depthTraverse(this.wfData.data[0], 0, this.getSize);
                this.tree();
                this.getDTop();
                this.draw();
                if (this.isInitial && this.wfData.data.length > 0) {
                    await this.makeCenter();
                    this.isInitial = false;
                }
            },
            depthTraverse(d, i, func) { // 深度遍历，func每个元素
                func(d, i);
                if (d.children) {
                    for (let index = 0; index < d.children.length; index += 1) {
                        const dChild = d.children[index];
                        this.depthTraverse(dChild, index, func);
                    }
                }
            },

            getSize(d, i) {
                const size = [50, 50];
                let itemSize;
                if (this.itemSize && typeof this.itemSize === 'function') {
                    itemSize = this.itemSize(d);
                }
                let x = itemSize[1] + this.gapX;
                if (this.levelScene) {
                    x = itemSize[1] + (i % 2 === 0 ? this.gapX : (this.gapX + 100));
                }
                size[0] = itemSize[0];
                size[1] = x;
                d.size = size;
            },

            tree() {
                const layout = flextree({
                    spacing: this.gapY,
                    nodeSize: d => d.data.size,
                    children: d => {
                        return !d.expand ? [] : d.children
                    }
                });
                const tree = layout.hierarchy(this.wfData.data[0]);
                layout(tree);
                this.root = tree;
                this.root.each((a) => {
                    // 相对偏移
                    a.dx = a.x - (a.parent ? a.parent.x : 0);
                    a.dy = a.y - (a.parent ? a.parent.y : 0);

                    if (!a.children) { a.children = [] }
                })
            },
            getDTop() {
                let t = this.root;
                while (t.children[0]) { t = t.children[0] }
                this.dTop = t
            },
            gClass(d) { return `depth_${d.depth} node` },
            gTransform(d) { return `translate(${d.dy},${d.dx})` },
            gBtnTransform(d) { return `translate(${d.data.size[1] - this.gapX},${d.data.size[0]/2 - 24})` },
            pathId(d) { return `path_${d.data.id}` },
            pathClass(d) { return `depth_${d.depth}` },
            pathColor() { return this.lineColor },
            path(d, i) {
                const startX = (d.parent ? d.parent.y + d.parent.data.size[1] : 0) - d.y - this.gapX;
                const startY = (d.parent ? d.parent.x + d.parent.data.size[0]/2: 0) - d.x - this.foreignY(d);
                return `M${startX},${startY} L${startX + 20},${startY} ${
                    this.link({
                        source: [
                            startX + 20,
                            startY,
                        ],
                        target: [-(this.gapX - 60), d.data.size[0]/2],
                    })
                    }L${(this.levelScene && i % 2 !== 0) ? 95 : -5},${d.data.size[0]/2}`
            },
            nest(d, i, n) {
                const dd = d.children;
                if (dd) {
                    d3.select(n[i]).selectAll(`g${dd[0] ? `.depth_${dd[0].depth}.node` : ''}`)
                        .data(dd)
                        .join(
                            (enter) => this.appendNode(enter),
                            (update) => this.updateNode(update),
                            (exit) => this.exitNode(exit)
                        )
                }
            },
            // 悬浮
            rectTriggerOut(d, i, n) {
                let gBtn = null;
                this.$tooltip.close();
                if (n[i].className.baseVal.includes('gButton')) {
                    gBtn = d3.select(n[i]);
                    gBtn.style('opacity', 0)
                } else {
                    d3.selectAll('g.gButton')
                        .filter((a, b, c) => c[b].parentNode === n[i].parentNode)
                        .style('opacity', 0)
                }
            },
            rectTriggerOver(d, i, n) {
                let gBtn = null;
                const g = d3.select(n[i].parentNode);
                const data = g.datum();
                // tooltip提示
                if (this.nodeTooltip && n[i].tagName === 'foreignObject') {
                    const el = this.nodeTooltip(d, i, n);
                    this.$tooltip.open(n[i], el, {
                        outerTransform: this.zoomTransform
                    });
                }


                if (data.data.children.length === 0) {
                    return;
                }
                if (n[i].className.baseVal.includes('gButton')) {
                    gBtn = d3.select(n[i])
                    gBtn.style('opacity', 1)
                } else {
                    d3.selectAll('g.gButton')
                        .filter((a, b, c) => c[b].parentNode === n[i].parentNode)
                        .style('opacity', 0.5)
                }
            },
            gClick(d, i ,n) {
                d3.event.stopPropagation();
                this.nodeClick && this.nodeClick(d3.select(n[i].parentNode).datum(), i, n);
            },
            gRightClick(d, i, n) {
                if (!this.supportContextMenu) {
                    return;
                }
                const { clientX, clientY } = d3.event;
                const data = d3.select(n[i].parentNode).datum();
                let menus = [
                    {label: '删除', name: 'del', icon: '', disabled: false},
                ];
                if (this.nodeContextMenu) {
                    menus = this.nodeContextMenu(data, i, n).concat(menus);
                }
                const groups = {
                    groups: [
                        {
                            menus: menus
                        }
                    ]
                };
                const self = this;
                this.$contextMenu.open(clientX, clientY, groups, function(menu) {
                    if (menu.name === 'del') {
                        if (self.delCallback) {
                            self.delCallback(data).then(() => {
                                self.handleDeleteItem(data.data);
                            });
                        } else {
                            self.handleDeleteItem(data.data);
                        }
                    }
                })
            },
            gBtnClick(d, i, n) {
                const data = d3.select(n[i].parentNode).datum();
                data.data.toggleExpand();
                this.updateWorkflow();
            },
            appendNode(enter) {
                const {
                    gClass,
                    gTransform,
                    rectTriggerOut,
                    rectTriggerOver,
                    gClick,
                    gRightClick,
                    gBtnClick,
                    foreignY,
                    gBtnTransform,
                    pathId,
                    pathClass,
                    pathColor,
                    path,
                    nest,
                    levelScene
                } = this;

                const gNode = enter.append('g');
                gNode.attr('class', gClass)
                    .attr('transform', gTransform);
                const foreign = gNode.append('foreignObject')
                    .attr('x', (d, i) => (levelScene && i % 2 !== 0) ? 95 : -5)
                    .attr('y', foreignY)
                    .style('width', (d) => this.itemSize(d.data)[1] + 'px')
                    .style('height', (d) => this.itemSize(d.data)[0] + 'px')
                    .on('mouseover', rectTriggerOver)
                    .on('mouseout', rectTriggerOut)
                    .on('click', gClick)
                    .on('contextmenu', gRightClick);
                const foreignDiv = foreign.append('xhtml:div')
                        .attr('class', 'content-wrapper')
                        .style('width', (d) => this.itemSize(d.data)[1] + 'px')
                        .style('height', (d) => this.itemSize(d.data)[0] + 'px')
                        .style('text-align', 'center')
                    ;
                if (this.itemType === 'text') {
                    foreignDiv.text(d => d.data.meta[this.itemKey]);
                } else if (this.itemType === 'image') {
                    foreignDiv.append('xhtml:img')
                        .attr('src', d => d.data.meta[this.itemKey])
                        .style('width', (d) => this.itemSize(d.data)[1] + 'px')
                        .style('height', (d) => this.itemSize(d.data)[0] + 'px')
                } else if (this.itemType === 'custom') {
                    this.itemCustom(foreignDiv);
                }

                const gBtn = gNode.append('g')
                    .attr('class', 'gButton')
                    .attr('transform', gBtnTransform)
                    .style('cursor', 'pointer')
                    .style('width', 20)
                    .style('height', 20)
                    .on('mouseover', rectTriggerOver)
                    .on('mouseout', rectTriggerOut)
                    .on('click', gBtnClick)
                gBtn.append('rect')
                    .attr('width', 20)
                    .attr('height', 20)
                    .attr('rx', 3)
                    .attr('ry', 3);
                gBtn.append('path')
                    .attr('d', d => {
                        return !d.data.expand ? 'M3,9H9V3H11V9H17V11H11V17H9V11H3V9Z' : 'M3,9H17V11H3V9z'
                    });

                const enterData = enter.data();
                if (enterData.length) {
                    if (enterData[0].data.parent) {
                        gNode.append('path')
                            .attr('id', pathId)
                            .attr('class', pathClass)
                            .lower()
                            .attr('stroke', pathColor)
                            .attr('d', path)
                    } else if (!enterData[0].data.parent) { // 根节点
                        foreign.attr('y', (d) => foreignY(d))
                    }

                    gNode.each(nest)
                }

                gBtn.raise();
                foreign.raise();
                return gNode
            },
            updateNode(update) {
                const {
                    gClass,
                    gTransform,
                    easePolyInOut,
                    foreignY,
                    gBtnTransform,
                    pathId,
                    pathClass,
                    pathColor,
                    path,
                    nest
                } = this;

                update.interrupt().selectAll('*').interrupt();
                update.attr('class', gClass)
                    .transition(easePolyInOut)
                    .attr('transform', gTransform);

                update.each((d, i, n) => {

                    const node = d3.select(n[i]);
                    const foreign = node.selectAll('foreignObject')
                        .filter((d, i, n) => (d.data.id !== '0') && (n[i].parentNode === node.node()))
                        .attr('y', foreignY)
                        .style('width', this.itemSize(d.data)[1] + 'px')
                        .style('height', this.itemSize(d.data)[0] + 'px');

                    foreign.select('.content-wrapper')
                        .filter((d, i, n) => n[i].parentNode.parentNode === node.node())
                        .remove();
                    // eslint-disable-next-line
                    const foreignDiv = foreign.append('xhtml:div')
                        .attr('class', 'content-wrapper new')
                        .style('width', this.itemSize(d.data)[1] + 'px')
                        .style('height', this.itemSize(d.data)[0] + 'px')
                        .style('text-align', 'center')
                    ;
                    if (this.itemType === 'text') {
                        foreignDiv.text(d.data.meta[this.itemKey]);
                    } else if (this.itemType === 'image') {
                        foreignDiv.append('xhtml:img')
                            .attr('src', d.data.meta[this.itemKey])
                            .style('width', this.itemSize(d.data)[1] + 'px')
                            .style('height', this.itemSize(d.data)[0] + 'px')
                    } else if (this.itemType === 'custom') {
                        this.itemCustom(foreignDiv, d);
                    }

                    node.select('path')
                        .filter((d, i, n) => n[i].parentNode === node.node())
                        .attr('id', pathId(d))
                        .attr('class', pathClass(d))
                        .attr('stroke', pathColor(d))
                        .transition(easePolyInOut)
                        .attr('d', path(d, i))

                    node.each(nest)

                    const gBtns = node.selectAll('g.gButton')
                        .filter((d, i, n) => n[i].parentNode === node.node())
                        .attr('transform', gBtnTransform(d));
                    gBtns.selectAll('path')
                        .attr('d', d => {
                            return !d.data.expand ? 'M3,9H9V3H11V9H17V11H11V17H9V11H3V9Z' : 'M3,9H17V11H3V9z'
                        });

                    gBtns.raise();
                    foreign.raise();
                });
                return update
            },
            exitNode(exit) {
                exit.filter((d, i, n) => {
                    return n[i].classList[0] !== 'gButton';
                }).remove();
            },
            draw() { // 生成svg
                const { workflow_g, appendNode, updateNode, exitNode} = this;
                const d = [ this.root ];

                workflow_g.selectAll(`g${d[0] ? `.depth_${d[0].depth}.node` : ''}`)
                    .data(d)
                    .join(
                        (enter) => appendNode(enter),
                        (update) => updateNode(update),
                        (exit) => exitNode(exit)
                    )
            },
            handleDeleteItem(data) {
                if (data.parent) {
                    this.deleted = this.wfData.delItem(data);
                } else {
                    this.wfData.data.splice(0, 1);
                }
            },
            addChild(node, child) {
                this.wfData.addChild(node, child);
            },
            calcTextWidth(text, styles) {
                const dummy = d3.select('#dummy');
                let textWidth = 0;
                let textHeight = 0;
                const div = dummy.selectAll('.dummyText')
                    .data([text])
                    .enter()
                    .append("div")
                    .style('display', 'inline-block')
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
        },
        watch: {
            wfData: {
                deep: true,
                handler() {
                    this.updateWorkflow();
                    this.updateValue = false;
                    this.$emit('input', this.wfData.getPureData())
                }
            },
            value: {
                deep: true,
                immediate: true,
                handler(val) {
                    if (this.updateValue) {
                        this.wfData = new WorkFlowTree(val, {
                            childrenKey: this.childrenKey,
                            idKey: this.idKey
                        });
                    } else {
                        this.updateValue = true
                    }
                }
            }
        },
        mounted() {
            // 初始化元素宽高
            this.svgWidth = this.$el.clientWidth;
            this.svgHeight = this.$el.clientHeight;
            // 绑定元素
            this.workflow_svg = d3.select(this.$refs.svg);
            this.workflow_bg = d3.select(this.$refs.bg);
            this.workflow_g = d3.select(this.$refs.content).style('opacity', 0);
            this.dummy = d3.select(this.$refs.dummy);
            // 绑定事件
            this.workflow_svg.on('contextmenu', () => { d3.event.preventDefault() });
            this.workflowSvgZoom = this.zoom.scaleExtent([0.4, 6]).on('zoom', () => {
                this.zoomTransform = d3.event.transform;
                this.$tooltip.setTransform(d3.event.transform);
                this.workflow_bg.attr('transform', d3.event.transform);
                this.workflow_g.attr('transform', d3.event.transform);
            });
            this.workflow_svg.call(this.workflowSvgZoom).on('dblclick.zoom', null);
            this.workflow_g.transition().style('opacity', 1);

            this.updateWorkflow();
        }
    };
</script>

<style lang="scss" scoped>
    .workflow {
        font-size: 14px;
        position: relative;
        display: flex;
        overflow: hidden;
        & /deep/ {
            svg {
                width: 100%;
                height: 100%;
                outline: none;
                foreignObject {
                    cursor: default;
                    border: none;
                    div {
                        border: none;
                        width: max-content;
                        white-space:pre-wrap;
                        color: #333;

                        &:focus {
                            border-color: rgb(154, 154, 154);
                            outline: none;
                        }
                    }
                }

                g.depth_0.node > foreignObject {

                    div {
                        color: #333;
                    }
                }

                g.gButton {
                    opacity: 0;
                    > {
                        path {
                            fill: blue;
                        }
                        rect {
                            fill: white;
                            stroke: grey;
                            stroke-width: 0.5;
                        }
                    }
                }

                path {
                    fill: none;
                    stroke-linecap: round;
                    stroke-width: 2;
                }
            }
        }
        #dummy {
            position: absolute;
            left: -9999px;
            opacity: 0;
            width: 100vw;
        }
    }
</style>
