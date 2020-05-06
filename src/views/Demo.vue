<template>
    <div class="demo">
        <WorkFlow
                ref="workflow"
                style="width:100vw;height:100vh"
                item-key="deptName"
                :item-size="getItemSize"
                item-type="text"
                v-model="data"
                :node-click="handleNodeClick"
                :level-scene="false"
                :support-context-menu="true"
                children-key="subDeptList"
                id-key="deptId"
                :gap-x="150"
                :gap-y="10"
                :grid="false"
        ></WorkFlow>
    </div>
</template>

<script>
    import WorkFlow from '@/components/workflow/WorkFlow';
    import api from '../api';
    export default {
        name: "Demo",
        components: {WorkFlow},
        data() {
            return {
                data: [],
            };
        },
        methods: {
            getItemSize(d) {
                return this.$refs.workflow.calcTextWidth(d.meta.deptName, {
                    padding: "5px 10px"
                });
            },
            handleNodeClick(data) {
                const meta = data.data.meta;
                alert(`部门职责：${meta.deptDuty} `);
            },
            init() {
                api.getDemoData().then(res => {
                    this.data = res;
                });
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>

</style>
