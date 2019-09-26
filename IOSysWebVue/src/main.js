import Vue from 'vue';
import App from './App';
import router from './router';
import store from '@/store/store';
import ElementUI, { Alert } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/fonts/iconfont.css'
import '@/assets/styles/main.scss'

Vue.use(ElementUI);
Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
    store.commit(CST.Store.Acc.SetLoginInfo, null); //移除登录信息
    next();
  } else {
    //判断是否已登录
    let user = store.getters.loginInfo;
    if (!user) {
      next({ path: '/login' });
    } else {
      next();
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
