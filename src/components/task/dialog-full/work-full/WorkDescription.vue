<template>
    <FormPanel class="work-description" title="事务描述">
        <wysiwyg v-model="meta.description" />
    </FormPanel>
</template>

<script>
    import FormPanel from '@/components/task/dialog-full/FormPanel';
    export default {
        name: "WorkDescription",
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
