import ContextMenu from './src/manage';

ContextMenu.install = Vue => {
    Vue.prototype.$contextMenu = ContextMenu;
    Vue.contextMenu = ContextMenu;
};

export default ContextMenu;
