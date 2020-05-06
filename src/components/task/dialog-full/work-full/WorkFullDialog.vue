<template>
    <DialogWrapper
            title="创建事务"
            width="1000px"
            :visible.sync="visible"
            :confirm-handler="confirmHandler"
            ref="wrapper"
            @close="$emit('rejected')"
    >
        <WorkBaseInfo :meta="meta"/>
        <WorkDescription :meta="meta" />
        <WorkResources :meta="meta" />
    </DialogWrapper>
</template>

<script>
    import DialogWrapper from '@/components/task/DialogWrapper';
    import api from '../../../../api';
    import WorkBaseInfo from '@/components/task/dialog-full/work-full/WorkBaseInfo';
    import WorkDescription from '@/components/task/dialog-full/work-full/WorkDescription';
    import WorkResources from '@/components/task/dialog-full/work-full/WorkResources';
    export default {
        name: "WorkFullDialog",
        components: {
            WorkResources,
            WorkDescription,
            WorkBaseInfo,
            DialogWrapper
        },
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
