<template>
    <FormPanel class="task-resources" title="背景资料">
        <el-button type="text" slot="right" @click="addResource">添加</el-button>
        <div class="resource-item" v-for="(item, index) in meta.resourceList" :key="index">
            <div class="resource-title">
                <template v-if="item.id">
                    <div>
                        {{index + 1}}.{{item.filename}}
                        <el-button type="text">重新上传</el-button>
                    </div>
                    <div>
                        <el-button type="text">删除</el-button>
                    </div>
                </template>
                <template v-else>
                    <el-upload type="text" action="/" v-model="file">上传</el-upload>
                </template>
            </div>
            <table>
                <tr>
                    <td>文件名称</td>
                    <td>{{item.filename}}</td>
                    <td>文件概要</td>
                    <td>{{item.brief}}</td>
                    <td>上传人</td>
                    <td>{{item.uploader}}</td>
                </tr>
                <tr>
                    <td>文件类型</td>
                    <td>
                        <el-select v-model="item.fileType">
                            <el-option
                                    v-for="type in FILE_TYPES"
                                    :value="type.value"
                                    :key="type.value"
                                    :label="type.label"
                            />
                        </el-select>
                    </td>
                    <td>文件分类</td>
                    <td>
                        <el-select v-model="item.fileCategory">
                            <el-option
                                    v-for="type in FILE_CATEGORIES"
                                    :value="type.value"
                                    :key="type.value"
                                    :label="type.label"
                            />
                        </el-select>
                    </td>
                    <td>标签</td>
                    <td>
                        <el-tag v-for="(tag, index) in item.tags" :key="index" closable>{{tag.name}}</el-tag>
                        <el-button type="primary" icon="el-icon-plus"></el-button>
                    </td>
                </tr>
            </table>
        </div>
    </FormPanel>
</template>

<script>
    import FormPanel from '@/components/task/dialog-full/FormPanel';
    import { FILE_CATEGORIES, FILE_TYPES } from '@/components/task/config';

    export default {
        name: "TaskResources",
        components: {FormPanel},
        data() {
            return {
                FILE_CATEGORIES,
                FILE_TYPES,
                file: ''
            };
        },
        props: {
            meta: {
                type: Object,
                default: () =>({})
            }
        },
        methods: {
            addResource() {
                if (!this.meta.resourceList) {
                    this.$set(this.meta, 'resourceList', []);
                }
                this.meta.resourceList = this.meta.resourceList || [];
                this.meta.resourceList.push({
                    filename: '',
                    brief: '',
                    uploader: '',
                    fileType: 1,
                    fileCategory: 1,
                    tags: []
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .task-resources {
        .resource-item {
            .resource-title {
                height: 32px;
                line-height: 32px;
                background: #f2f2f2;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 10px;
            }
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
    }
</style>
