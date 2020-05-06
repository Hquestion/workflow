<template>
    <DialogWrapper
            title="创建子任务"
            width="1000px"
            :visible.sync="visible"
            :confirm-handler="confirmHandler"
            ref="wrapper"
            @close="$emit('rejected')"
    >
        <SubTaskBaseInfo :meta="meta"/>
        <SubTaskDescription :meta="meta" />
        <SubTaskResources :meta="meta" />
    </DialogWrapper>
</template>

<script>
    import DialogWrapper from '@/components/task/DialogWrapper';
    import SubTaskBaseInfo from '@/components/task/dialog-full/subtask-full/SubTaskBaseInfo';
    import SubTaskDescription from '@/components/task/dialog-full/subtask-full/SubTaskDescription';
    import SubTaskResources from '@/components/task/dialog-full/subtask-full/SubTaskResources';
    import api from '../../../../api';
    export default {
        name: "SubTaskFullDialog",
        components: {SubTaskResources, SubTaskDescription, SubTaskBaseInfo, DialogWrapper},
        data() {
            return {
                visible: false
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
                return api.createMilestone(this.meta).then(data => {
                    this.$emit('resolved', data)
                }, () => {
                    this.$emit('rejected');
                });
            }
        }
    }
</script>

<style scoped>

</style>
