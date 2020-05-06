<template>
    <DialogWrapper
            class="role-select-dialog"
            :visible.sync="visible"
            ref="wrapper"
            @close="$emit('rejected')"
            :confirmHandler="confirmHandler"
            title="岗位选择"
    >
        <div class="container">
            正在把“{{person.name}}”添加至参与人，请为该参与人选择一个岗位：
            <div class="role-wrapper">
                <div
                        class="role-item"
                        v-for="(role, index) in person.roles"
                        :key="index"
                        :class="{active: isSelected(role)}"
                        @click="selectedRole = role"
                >
                    {{role.name}}
                </div>
            </div>
        </div>
    </DialogWrapper>
</template>

<script>
    import DialogWrapper from '@/components/task/DialogWrapper';
    export default {
        name: "RoleSelectDialog",
        components: {
            DialogWrapper
        },
        data() {
            return {
                visible: false,
                selectedRole: null
            };
        },
        props: {
            person: {
                type: Array,
                default: () => ([])
            }
        },
        methods: {
            confirmHandler() {
                // 稍后完善，则直接resolve,外部接受后将创建项添加到画布
                if (this.selectedRole) {
                    return Promise.resolve().then(() => {
                        this.$emit('resolved', this.selectedRole);
                    });
                } else {
                    return Promise.reject();
                }
            },
            isSelected(role) {
                if (!this.selectedRole) return false;
                return this.selectedRole.id === role.id;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .role-select-dialog {
        .container {
            .role-wrapper {
                padding: 10px;
                text-align: center;
                .role-item {
                    display: inline-block;
                    padding: 5px 10px;
                    border: 1px solid #dedede;
                    cursor: pointer;
                    &.active {
                        border: 1px solid #2af;
                    }
                    & + .role-item {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
</style>
