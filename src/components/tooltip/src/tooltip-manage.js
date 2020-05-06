import Vue from 'vue';
import Tooltip from './Tooltip';
import Popper from 'popper.js';

let menu, popper;

const handleClickOutside = (e) => {
    if (!menu.$el.contains(e.target)) {
        close();
    }
};

function open(ref, inner, modifiers) {
    if (menu) {
        menu.$destroy();
        menu.$el.remove();
    }
    if (popper && popper.destroy) {
        popper.popper.remove();
        popper.destroy();
    }
    menu = new Vue(Tooltip).$mount();
    if (typeof inner === 'string') {
        menu.$el.innerHTML = inner;
    } else {
        menu.$el.appendChild(inner);
    }
    menu.visible = false;
    // menu.$on('updateTransform', (val) => {
    //     setTransform(val);
    // });

    document.body.appendChild(menu.$el);

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
    menu.$nextTick(() => {
        menu.visible = true;
        popper = new Popper(ref, menu.$el, {
            placement: 'bottom',
            modifiers: {
                arrow: {
                    enabled: true,
                    element: menu.$el.querySelector('.arrow')
                }
            }
        });

        popper.scheduleUpdate();
        if (modifiers) {
            for(const key in modifiers) {
                menu[key] = modifiers[key];
            }
        }
    });
}

function close() {
    if (menu) {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('mousedown', handleClickOutside);
        menu.visible = false;
        menu.$destroy();
        menu.$el.remove();
        if (popper) {
            popper.popper.remove();
            popper.destroy();
        }
    }
}


function update() {
    popper && popper.scheduleUpdate();
}

function setTransform(transform) {
    // todo 画布变化时校准tooltip位置
    transform;
    // popper && popper.scheduleUpdate();
    // setTimeout(() => {
    //     if (menu) {
    //         let trans = menu.$el.style.transform;
    //         const transXYZ = trans.match(/translate3d\(([^)]*)\)/)[1].split(',');
    //         let scale = trans.match(/scale\(([^)]*)\)/);
    //         scale = scale && +scale[1] || 1;
    //         const index = trans.indexOf('scale');
    //         if (index > 0) {
    //             trans = trans.substring(0, index);
    //         }
    //         let oldTransY = parseInt(transXYZ[1]) / +scale;
    //         const newTransY = oldTransY * transform.k;
    //         menu.$el.style.transform = `translate3d(${transXYZ[0]},${newTransY}px, 0) scale(${transform.k})`;
    //     }
    // }, 100);
    close();
}

export default {
    open,
    close,
    update,
    setTransform
};
