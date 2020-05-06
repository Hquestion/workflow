<script>
const isFunction = (fn) => typeof fn === 'function';

export default {
    name: 'SdxuContextMenu',
    data() {
        return {};
    },
    props: {
        menuGroups: {
            type: Array,
            default: () => []
        },
        visible: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        close() {
            this.visble = false;
        }
    },
    render() {
        let { groups = [] } = this.menuGroups;
        let visible = this.visible;
        const self = this;
        const menuItem = (menu) => {
            let icon = menu.active ? '' : menu.icon;
            let disabled = menu.disabled;

            if (typeof disabled === 'function') {
                disabled = disabled();
            }
            const event = {
                on: {
                    click() {
                        self.close();
                        self.$emit('menu-clicked', menu);
                        if (menu.callback && isFunction(menu.callback)) {
                            menu.callback(menu);
                        }
                    }
                }
            };
            return (
                <div class={{'sdxu-context-menu__item': true, 'is-disabled' : disabled}} {...event}>
                    <div class="sdxu-context-menu__item-name">
                        <i class={['sdx-icon', icon]} />
                        <span>{menu.label}</span>
                    </div>
                    <div class="sdxu-context-menu__item-shortcut">{menu.shortcut}</div>
                </div>
            );
        };
        const separator = <div class="sdxu-context-menu__separator" />;
        return (
            <div class="sdxu-context-menu" style={{display: visible ? 'block' : 'none'}} on={{contextmenu: e => {e.preventDefault();}}}>
                {
                    groups.map((group, index) => {
                        return (
                            <div class="sdxu-context-menu__group">
                                {
                                    index > 0 && (separator)
                                }
                                {
                                    group.menus.map(menu => {
                                        return menuItem(menu);
                                    })
                                }
                            </div>
                        );
                    })
                }
            </div>
        );
    }
};
</script>

<style lang="scss" scoped>
    .sdxu-context-menu {
        width: 150px;
        height: auto;
        background: #fff;
        z-index: 9999;
        box-shadow: 0 2px 8px 0 #999;
        border-radius: 4px;
        .sdxu-context-menu__group:first-child {
            .sdxu-context-menu__item:first-child {
                border-top-left-radius: 2px;
                border-top-right-radius: 2px;
            }
        }
        .sdxu-context-menu__group:last-child {
            .sdxu-context-menu__item:last-child {
                border-bottom-left-radius: 2px;
                border-bottom-right-radius: 2px;
            }
        }
        .sdxu-context-menu__item{
            width: 100%;
            height: 32px;
            line-height: 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #171c2a;
            padding: 0 8px;
            font-size: 12px;
            & + .sdxu-context-menu__item {
                border-top: 1px solid #dedede;
            }
            &:hover {
                color: #fff;
                background: #4880f8;
            }
            &.is-disabled {
                opacity: 0.5;
                pointer-events: none;
            }
        }

        .sdxu-context-menu__item-name {
            font-size: 0;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            height: 100%;
            cursor: default;
            i {
                font-size: 12px;
                display: inline-block;
                width: 12px;
                height: 12px;
                text-align: center;
                line-height: 16px;
            }
            span {
                margin-left: 8px;
                display: inline-block;
                font-size: 12px;
                cursor: default;
            }
        }

        .sdxu-context-menu__separator {
            width: 100%;
            height: 1px;
            background: #415380;
        }
    }

</style>
