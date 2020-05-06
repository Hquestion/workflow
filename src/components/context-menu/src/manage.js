import Vue from 'vue';
import ContextMenu from './ContextMenu';
import Popper from 'popper.js';

let menu, popper;

const handleClickOutside = (e) => {
    if (!menu.$el.contains(e.target)) {
        close();
    }
};

function open(x, y, menus, callback) {
    if (menu) {
        menu.$destroy();
        menu.$el.remove();
    }
    if (popper && popper.destroy) {
        popper.reference.remove();
        popper.popper.remove();
        popper.destroy();
    }
    menu = new Vue(ContextMenu).$mount();
    menu.menuGroups = menus;
    menu.visible = false;

    menu.$on('menu-clicked', menu => {
        close();
        if (callback) {
            callback(menu);
        }
    });
    let ref = document.createElement('div');
    ref.style.position = 'absolute';
    ref.style.left = x + 'px';
    ref.style.top = y + 'px';
    document.body.appendChild(ref);
    document.body.appendChild(menu.$el);

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside, true);
    menu.$nextTick(() => {
        menu.visible = true;
        popper = new Popper(ref, menu.$el, {
            placement: 'bottom-start'
        });

        popper.scheduleUpdate();
    });
}

function close() {
    if (menu) {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('mousedown', handleClickOutside, true);
        menu.close();
        menu.$destroy();
        menu.$el.remove();
        if (popper) {
            popper.reference.remove();
            popper.popper.remove();
            popper.destroy();
        }
    }
}


function update() {
    popper && popper.scheduleUpdate();
}

export default {
    open,
    close,
    update
};
