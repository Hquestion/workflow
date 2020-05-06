import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import wysiwyg from "vue-wysiwyg";
import ContextMenu from '@/components/context-menu';
import Tooltip from '@/components/tooltip';
require('./assets/icon/iconfont.css');

Vue.use(ElementUI);
Vue.use(wysiwyg, {});
Vue.use(ContextMenu);
Vue.use(Tooltip);
import 'element-ui/lib/theme-chalk/index.css';
import 'vue-wysiwyg/dist/vueWysiwyg.css';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
