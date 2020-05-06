<template>
    <DialogWrapper
            :visible.sync="visible"
            class="brief-improve-dialog"
            ref="wrapper"
            :show-close="false"
            @close="$emit('rejected')"
            :cancelHandler="cancelHandler"
            :confirmHandler="confirmHandler"
            cancel-text="立即完善"
            confirm-text="稍后完善"
    >
        <span >
            您已创建名为“{{ name }}”的{{ showType }}，信息尚未完善。为了便于其他成员协同工作，请尽快完善任务的详细信息。
        </span>
    </DialogWrapper>
</template>

<script>
    import DialogWrapper from '@/components/task/DialogWrapper';
    import { TASK_NAME_MAP } from '@/components/task/config';

    export default {
        name: "BriefImproveDialog",
        components: {DialogWrapper},
        data() {
            return {
                visible: false
            }
        },
        props: {
            name: String,
            type: {
                type: [String, Number],
                default: 1
            },
            id: String
        },
        computed: {
            showType() {
                return TASK_NAME_MAP[this.type];
            }
        },
        methods: {
            confirmHandler() {
                // 稍后完善，则直接resolve,外部接受后将创建项添加到画布
                return Promise.resolve().then(() => {
                    this.$emit('resolved', {
                        name: this.name,
                        type: this.type,
                        id: this.id
                    });
                });
            },
            cancelHandler() {
                // 立即完善,则展示详细信息弹框，外部在详细信息完成之后，继续将创建项目添加到画布
                return Promise.reject().then(() => {}, () => {
                    this.$emit('rejected', {
                        name: this.name,
                        type: this.type,
                        id: this.id
                    });
                });
            }
        }
    }
</script>

<style scoped>

</style>
