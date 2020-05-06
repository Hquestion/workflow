<template>
    <div class="template-wrapper">
        <Drag  v-for="item in templates" :key="item.type" :transfer-data="item">
            <TemplateCard :data="item" />
        </Drag>

        <TemplateCard :data="people" class="drag-disabled" @click.native="selectPerson"></TemplateCard>
    </div>
</template>

<script>
    import * as d3 from 'd3';
    import TemplateCard from '@/components/task/Template';
    import { Drag } from 'vue-drag-drop'
    export default {
        name: "TemplateWrapper",
        components: {TemplateCard, Drag},
        data() {
            return {
                templates: [
                    { name: '任务', type: 1 },
                    { name: '里程碑', type: 2 },
                    { name: '子任务', type: 3 },
                    { name: '事务', type: 4 }
                ],
                people: {
                    name: '人员',
                    type: 5
                }
            };
        },
        methods: {
            selectPerson() {
                this.$emit('select-person');
            }
        },
        mounted() {
            const { templates } = this;
            d3.select('template-wrapper .template-card')
                .filter((d, i, n) => !n[i].classList.contains('drag-disabled'))
                .datum((d, i) => templates[i]);
        }
    }
</script>

<style lang="scss" scoped>
    .template-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid #dedede;
    }
</style>
