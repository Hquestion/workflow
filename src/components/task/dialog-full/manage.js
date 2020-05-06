import Vue from 'vue';
import TaskFullDialog from './task-full/TaskFullDialog';
import { TASK_TYPES } from '@/components/task/config';
import BriefImproveDialog from '@/components/task/dialog-brief/BriefImproveDialog';
import MilestoneFullDialog from '@/components/task/dialog-full/milestone-full/MilestoneFullDialog';
import SubTaskFullDialog from '@/components/task/dialog-full/subtask-full/SubTaskFullDialog';
import WorkFullDialog from '@/components/task/dialog-full/work-full/WorkFullDialog';

const constructorMap = {
    [TASK_TYPES.TASK]: TaskFullDialog,
    [TASK_TYPES.MILESTONE]: MilestoneFullDialog,
    [TASK_TYPES.SUBTASKS]: SubTaskFullDialog,
    [TASK_TYPES.WORK]: WorkFullDialog,
    improve: BriefImproveDialog
};

const open = (type = TASK_TYPES.TASK, props = {}) => {
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
