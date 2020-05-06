import TooltipManage from './src/tooltip-manage';

TooltipManage.install = Vue => {
    Vue.prototype.$tooltip = TooltipManage;
    Vue.tooltip = TooltipManage;
};

export default TooltipManage;
