<template>
    <div class="template-card">
        <img :src="icon">
        <span>{{data.name}}</span>
    </div>
</template>

<script>
    import { TASK_ICON_MAP } from '@/components/task/config';

    export default {
        name: "TemplateCard",
        props: {
            data: {
                type: Object,
                default: () => {}
            }
        },
        computed: {
            icon() {
                return TASK_ICON_MAP[this.data.type];
            }
        }
    }
</script>

<style lang="scss" scoped>
    .template-card {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 0 20px;
        height: 32px;
        line-height: 32px;
        cursor: pointer;
        img {
            width: 24px;
            height: 24px;
        }
        span {
            margin-left: 5px;
            cursor: pointer;
        }
    }
</style>
