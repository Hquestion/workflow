<template>
    <DialogWrapper
            title="创建任务"
            width="1000px"
            :visible.sync="visible"
            :confirm-handler="confirmHandler"
            :cancel-handler="cancelHandler"
            ref="wrapper"
            @close="$emit('rejected')"
    >
        <TaskBaseInfo :meta="formData"/>
        <TaskDescription :meta="formData" />
        <TaskBudget :meta="formData" />
        <TaskResources :meta="formData" />
    </DialogWrapper>
</template>

<script>
    import DialogWrapper from '@/components/task/DialogWrapper';
    import TaskBaseInfo from '@/components/task/dialog-full/task-full/TaskBaseInfo';
    import TaskDescription from '@/components/task/dialog-full/task-full/TaskDescription';
    import TaskBudget from '@/components/task/dialog-full/task-full/TaskBudget';
    import TaskResources from '@/components/task/dialog-full/task-full/TaskResources';
    import api from '../../../../api';
    export default {
        name: "TaskFullDialog",
        components: {
            TaskResources,
            TaskBudget,
            TaskDescription,
            TaskBaseInfo,
            DialogWrapper
        },
        data() {
            return {
                visible: false,
                formData: {}
            }
        },
        props: {
            meta: {
                type: Object,
                default: () => {}
            }
        },
        methods: {
            confirmHandler() {
                return api.createTask(this.formData).then(data => {
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
        },
        watch: {
            immediate: true,
            deep: true,
            handler(val) {
                if (val) {
                    this.formData = val;
                }
            }
        }
    }
</script>

<style scoped>

</style>
