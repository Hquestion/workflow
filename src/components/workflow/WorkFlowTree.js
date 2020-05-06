import { v4 as uuid } from 'uuid';

const defaultKeys = {
    childrenKey: 'children',
    idKey: 'id'
};

export class WorkFlowTree {
    constructor(data, config = {}) {
        this.data = null;
        this.config = Object.assign({}, defaultKeys, config);
        this.makeTree(data);
    }

    makeTree(data) {
        let root;
        const { childrenKey, idKey } = this.config;
        if (Array.isArray(data)) {
            root = data[0];
        } else if (typeof data === 'object') {
            root = data;
        }
        function trans(d, p) {
            const children = d[childrenKey];
            const obj = new WorkFlowItem(d, p, {childrenKey, idKey});
            if (children && children.length > 0) {
                children.forEach(child => {
                    obj.add(trans(child, {__mark__: obj.__mark__}));
                });
            }
            return obj;
        }
        if (!root) {
            this.data = [];
        } else {
            this.data = [trans(root)];
        }
    }

    getParent(node) {
        const marks = node.__mark__.split('@');
        marks.pop();
        if (marks.length === 0) {
            return null;
        } else {
            marks.shift();
            let parent = this.data[0];
            while (marks.length > 0) {
                let id = marks.shift();
                parent = parent.children.find(item => (item.id + '') === ('' + id));
            }
            return parent || null;
        }
    }

    addChild(node, child) {
        const marks = node.__mark__.split('@');
        let target;
        if (marks.length === 0) {
            target = null;
        } else {
            marks.shift();
            let parent = this.data[0];
            while (marks.length > 0) {
                let id = marks.shift();
                parent = parent.children.find(item => (item.id + '') === ('' + id));
            }
            target = parent || null;
        }
        if (!(child instanceof WorkFlowItem)) {
            const item = new WorkFlowItem(child, node, this.config);
            target && target.add(item);
        } else {
            target && target.add(child);
        }
    }

    delItem(node) {
        const parent = this.getParent(node);
        const index = parent.children.findIndex(item => item.id === node.id);
        if (index >= 0) {
            parent.children.splice(index, 1);
        }
        return index;
    }

    getPureData(d = this.data) {
        const { childrenKey } = this.config;
        return d.map(item => {
            const keys = Object.keys(item.meta);
            const result = {};
            result.expand = item.expand;
            keys.forEach(key => {
                result[key] = item.meta[key];
            });
            if (item.children) {
                result[childrenKey] = this.getPureData(item.children);
            }
            return result;
        })
    }
}

export class WorkFlowItem {
    constructor(meta, parent, config = {}) {
        this.config = Object.assign({}, defaultKeys, config);
        this.type = meta.type || '';
        this.meta = meta;
        this.parent = parent || null;
        this.id = meta[this.config.idKey] || uuid();
        this.expand = meta.expand === undefined ? true : meta.expand;
        this.children = [];
        this._mark();
    }

    _mark() {
        this.__mark__ = `${this.parent && (this.parent.__mark__ + '@') || ''}${this.id}`;
    }

    add(workflowItem) {
        this.children.push(workflowItem);
        // workflowItem.parent = this.id;
    }

    del() {
        if (this.parent) {
            const index = this.parent.children.findIndex(item => item.id === this.id);
            this.parent.children.splice(index, 1);
        } else {
            delete this;
        }
    }

    toggleExpand() {
        this.expand = !this.expand;
    }

    findParent() {

    }


}
