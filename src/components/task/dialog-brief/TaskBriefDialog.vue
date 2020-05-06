<template>
    <DialogWrapper
            title="创建任务"
            :visible.sync="visible"
            :confirm-handler="confirmHandler"
            ref="wrapper"
            @close="$emit('rejected')"
    >
        <el-form label-width="100px" :rules="rules" :model="taskBrief" ref="form">
            <el-form-item label="任务名称" prop="name">
                <el-input
                        type="text"
                        v-model="taskBrief.name"
                        placeholder="请输入任务名称"
                        @keyup.native.enter="confirm"
                />
            </el-form-item>
        </el-form>
    </DialogWrapper>
</template>

<script>
    import DialogWrapper from '@/components/task/DialogWrapper';
    import api from '../../../api';
    export default {
        name: "TaskBriefDialog",
        components: {DialogWrapper},
        data() {
            return {
                taskBrief: {
                    name: ''
                }
            };
        },
        props: {
            visible: {
                type: Boolean,
                default:false
            }
        },
        computed: {
            rules() {
                return {
                    name: [
                        { required: true, message: '请输入任务名称', trigger: 'blur' }
                    ]
                };
            }
        },
        methods: {
            confirmHandler() {
                return this.$refs.form.validate().then(() => {
                    return api.createTask(this.taskBrief).then(result => {
                        this.$emit('resolved', result);
                    }, () => {
                        this.$emit('rejected');
                    });
                }, () => {
                    this.$emit('rejected');
                });
            },
            confirm() {
                return this.$refs.wrapper.confirm(this.taskBrief);
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
