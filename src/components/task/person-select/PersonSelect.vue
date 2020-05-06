<template>
    <VueDraggableResizable
            class-name="person-select"
            :w="width"
            :h="height"
            :x="x"
            :y="y"
            :min-height="200"
            :min-width="200"
            drag-handle=".title"
            drag-cancel=".main-panel"
            :enable-native-drag="true"
            v-show="isVisible"
    >
        <div class="title">
            人员
            <i class="iconfont icon-del2" @click="close"></i>
        </div>
        <Splitpanes class="main-panel" horizontal>
            <Pane min-size="30">
                <Drop @drop="handleDrop"
                      @dragover="handleDragOver"
                      class="container"
                >
                    <template v-if="selectedDraggable">
                        <Drag v-for="(p, index) in selectedPersons"
                              :key="index"
                              :transfer-data="p"
                        >
                            <PersonCard
                                    :person="p"
                                    :removable="true"
                                    @delete="handlePersonRemove(index)"
                            ></PersonCard>
                        </Drag>
                    </template>
                    <template v-else>
                        <PersonCard
                                :person="p"
                                :removable="true"
                                @delete="handlePersonRemove(index)"
                                @contextmenu.native="(e) => handleContextMenu(e, p)"
                        ></PersonCard>
                    </template>
                </Drop>
            </Pane>
            <Pane min-size="30">
                <div class="search-input">
                    <el-input size="mini" type="search" v-model="key" placeholder="查找" @input="handleChange"></el-input>
                </div>
                <div class="container">
                    <Drag v-for="(p, index) in shownPersonList"
                          :key="index"
                          :transfer-data="p"
                          @dragstart="dragging = p"
                          @dragend="dragging = null"
                    >
                        <PersonCard :person="p" />
                    </Drag>
                </div>
            </Pane>
        </Splitpanes>
    </VueDraggableResizable>
</template>

<script>
    import { Splitpanes, Pane } from 'splitpanes'
    import VueDraggableResizable from 'vue-draggable-resizable'
    import { Drop, Drag } from 'vue-drag-drop';

    import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
    import 'splitpanes/dist/splitpanes.css'
    import PersonCard from '@/components/task/person-select/PersonCard';
    import RoleSelectDialog from './RoleSelectDialog';
    import Vue from 'vue';
    import api from '../../../api';
    export default {
        name: "PersonSelect",
        components: {
            PersonCard,
            Splitpanes,
            Pane,
            VueDraggableResizable,
            Drop,
            Drag
        },
        data() {
            return {
                x: 0,
                y: 0,
                width: 260,
                height: 360,
                key: '',
                personList: [],
                selectedPersons: [],
                shownPersonList: []
            };
        },
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            // v-model，设置或获取当前节点选中的人员列表
            value: {
                type: Array,
                default: () => ([])
            },
            // 初始化下半部分的人员列表，用户非根节点
            persons: {
                type: Array,
                default: null
            },
            // 是否为过滤模式，即非根节点
            isFilter: {
                type: Boolean,
                default: false
            },
            // 选择区域的人员是否可以拖拽，支持在画布页面拖拽到画布中，同时也是判断是否支持右键菜单的依据
            selectedDraggable: {
                type: Boolean,
                default: true
            },
            contextMenuHandler: {
                type: Function
            }
        },
        computed: {
            isVisible: {
                get() {
                    return this.visible;
                },
                set(val) {
                    this.$emit('update:visible', val);
                }
            }
        },
        methods: {
            close() {
                this.isVisible = false;
            },
            handleDrop(data) {
                console.log(data);
                if (data.roles.length > 1) {
                    // 展示角色选择框，选择完成后添加到列表中
                    const constructor = Vue.extend(RoleSelectDialog);
                    const ins = new constructor();
                    ins.person = data;
                    ins.visible = true;
                    ins.$mount();
                    ins.$on('resolved', (selected) => {
                        const newPerson = Object.assign({}, data, {selectedRole: selected});
                        newPerson.__remark__ = 'person';
                        this.selectedPersons.push(newPerson);
                    });
                    document.body.appendChild(ins.$el);
                } else {
                    const newPerson = Object.assign({}, data, {selectedRole: data.roles[0]});
                    newPerson.__remark__ = 'person';
                    this.selectedPersons.push(newPerson);
                }
            },
            handleDragOver(data, e) {
                if (data.__remark__ !== 'person_template') {
                    e.dataTransfer.dropEffect = 'none';
                }
            },
            handleChange() {
                const key = this.key.trim();
                if (this.isFilter) {
                    // 过滤模式，从已有列表中筛选
                    this.shownPersonList = this.personList.filter(item => item.name.indexOf(key) >= 0);
                    this.addRemarkToPerson();
                } else {
                    // 从服务器获取
                    api.searchUsers(key).then(res => {
                        this.personList = res;
                        this.shownPersonList = res;
                        this.addRemarkToPerson();
                    });
                }
            },
            handlePersonRemove(index) {
                this.selectedPersons.splice(index, 1);
            },
            addRemarkToPerson() {
                this.shownPersonList.forEach(item => item.__remark__ = 'person_template');
            },
            handleContextMenu(e, person) {
                const { clientX, clientY } = e;
                const menus = {
                    groups: [
                        {
                            menus: [
                                {label: '设为负责人', name: 'set-duty', icon: '', disabled: false}
                            ]
                        }
                    ]
                };
                // 调用传入的函数或者抛出事件，在外部处理菜单点击事件
                this.$contextMenu.open(clientX, clientY, menus, menu => {
                    if (this.contextMenuHandler) {
                        this.contextMenuHandler(menu, person);
                    } else {
                        this.$emit(menu.name, person);
                    }
                });
            }
        },
        watch: {
            persons: {
                immediate: true,
                handler(val) {
                    this.personList = val || [];
                    this.shownPersonList = val || [];
                    this.addRemarkToPerson();
                }
            },
            value: {
                immediate: true,
                deep: true,
                handler(val) {
                    if (this.needUpdate) {
                        this.selectedPersons = val || [];
                    } else {
                        this.needUpdate = true;
                    }
                }
            },
            selectedPersons: {
                deep: true,
                handler(val) {
                    this.needUpdate = false;
                    this.$emit('input', val);
                }
            }
        },
        mounted() {
            this.x = window.innerWidth - this.width - 50;
            if (this.isFilter) {
                this.personList = this.persons || [];
                this.shownPersonList = this.persons || [];
                this.addRemarkToPerson();
            } else {
                this.personList = [];
                this.shownPersonList = [];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .person-select {
        border: 1px solid #dedede;
        position:absolute;
        background: #fff;
        z-index: 200 !important;
        .title {
            position: relative;
            background: #dedede;
            height: 32px;
            line-height: 32px;
            text-align: center;
            border-bottom: 1px solid #dedede;
            .drag-handler {
                position: absolute;
                left: 10px;
                font-size: 14px;
                cursor: pointer;
            }
            .icon-del2 {
                position: absolute;
                right: 10px;
                font-size: 24px;
                cursor: pointer;
            }
        }
        & /deep/ {
            .splitpanes--horizontal>.splitpanes__splitter {
                height: 3px;
                background: #dedede;
            }
        }
        .main-panel {
            height: calc(100% - 32px);
            .search-input {
                padding: 5px 15px;
            }
            & /deep/ {
                .splitpanes__pane {
                    overflow: auto;
                }
            }
            .container {
                display: flex;
                justify-content: flex-start;
                flex-wrap: wrap;
                padding: 0 10px;
                width: 100%;
                height: 100%;
                overflow: auto;
            }
        }
    }
</style>
