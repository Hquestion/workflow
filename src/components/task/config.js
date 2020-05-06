export const TASK_TYPES = {
    TASK: 1,
    MILESTONE: 2,
    SUBTASKS: 3,
    WORK: 4,
    PEOPLE: 5
};

export const TASK_ICON_MAP = {
    [TASK_TYPES.TASK]: require('../../assets/images/task.svg'),
    [TASK_TYPES.MILESTONE]: require('../../assets/images/milestone.svg'),
    [TASK_TYPES.SUBTASKS]: require('../../assets/images/subtask.svg'),
    [TASK_TYPES.WORK]: require('../../assets/images/work.svg'),
    [TASK_TYPES.PEOPLE]: require('../../assets/images/person.svg')
};

export const TASK_NAME_MAP = {
    [TASK_TYPES.TASK]: '任务',
    [TASK_TYPES.MILESTONE]: '里程碑',
    [TASK_TYPES.SUBTASKS]: '子任务',
    [TASK_TYPES.WORK]: '事务',
    [TASK_TYPES.PEOPLE]: '人员'
};

export const FILE_TYPES = [
    { label: 'office文档', value: 1 },
    { label: 'pdf文档', value: 2 },
    { label: '图片', value: 3 },
    { label: '视频', value: 4 },
    { label: '其他', value: 5 }
];

export const FILE_CATEGORIES = [
    { label: '商务', value: 1 },
    { label: '行政', value: 2 },
    { label: '人事', value: 3 },
    { label: '财务', value: 4 },
    { label: '对外发布', value: 5 },
    { label: '其他', value: 6 }
];
