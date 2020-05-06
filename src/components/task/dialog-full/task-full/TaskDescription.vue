<template>
    <FormPanel class="task-description" title="任务描述">
        <wysiwyg v-model="meta.description" />
    </FormPanel>
</template>

<script>
    import FormPanel from '@/components/task/dialog-full/FormPanel';
    export default {
        name: "TaskDescription",
        components: {FormPanel},
        props: {
            meta: {
                type: Object,
                default: () => ({})
            }
        }
    }
</script>

<style scoped>

</style>
