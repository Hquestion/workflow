<template>
    <div class="person-card">
        <div class="avatar" :style="borderColor">
            <img :src="person.avatar">
            <i class="iconfont icon-del2" @click="$emit('delete')" v-show="removable"></i>
        </div>
        <div class="name">{{person.name}}</div>
        <div class="role" :title="person.selectedRole" v-show="person.selectedRole">
            {{person.selectedRole && person.selectedRole.name}}
        </div>
    </div>
</template>

<script>
    import {PERSON_COLOR_MAP} from '@/components/task/person-select/config';

    export default {
        name: "PersonCard",
        components: {
        },
        props: {
            person: {
                type: Object,
                default: () => ({})
            },
            type: {
                type: [String, Number],
                default: 4
            },
            removable: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            borderColor() {
                return {
                    borderColor: PERSON_COLOR_MAP[this.type]
                };
            }
        }
    }
</script>

<style lang="scss" scoped>
    .person-card {
        display: inline-block;
        text-align: center;
        padding: 10px;
        font-size: 12px;
        .avatar {
            position: relative;
            width: 50px;
            height: 50px;
            border-radius: 50px;
            border-width: 1px;
            border-style: solid;
            border-color: #ccc;
            img {
                width: 100%;
                height: 100%;
                border-radius: 50px;
            }
            .icon-del2 {
                font-size: 24px;
                position: absolute;
                right: -5px;
                top: -5px;
                cursor: pointer;
            }
        }
        .name {
            margin-top: 2px;
        }
        .role {
            margin-top: 2px;
            max-width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
    }
</style>
