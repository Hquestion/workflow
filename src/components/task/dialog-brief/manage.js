import Vue from 'vue';
import TaskBriefDialog from './TaskBriefDialog';
import { TASK_TYPES } from '@/components/task/config';
import BriefImproveDialog from '@/components/task/dialog-brief/BriefImproveDialog';
import MilestoneBriefDialog from '@/components/task/dialog-brief/MilestoneBriefDialog';
import SubTaskBriefDialog from '@/components/task/dialog-brief/SubTaskBriefDialog';
import WorkBriefDialog from '@/components/task/dialog-brief/WorkBriefDialog';

const constructorMap = {
    [TASK_TYPES.TASK]: TaskBriefDialog,
    [TASK_TYPES.MILESTONE]: MilestoneBriefDialog,
    [TASK_TYPES.SUBTASKS]: SubTaskBriefDialog,
    [TASK_TYPES.WORK]: WorkBriefDialog,
    improve: BriefImproveDialog
};

const open = (type = TASK_TYPES.TASK, props) => {
    let _resolve, _reject;
    const Constructor = Vue.extend(constructorMap[type]);
    const ins = new Constructor();
    ins.visible = false;
    for (const key in props) {
        ins[key] = props[key];
    }
    ins.$on('resolved', res => {
        _resolve(res);
    });
    ins.$on('rejected', () => {
        _reject();
    });
    ins.$mount();
    document.body.appendChild(ins.$el);
    Vue.nextTick(() => {
        ins.visible = true;
    });
    return new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
    });
};

export default {
    open
}
