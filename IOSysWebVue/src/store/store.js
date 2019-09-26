import Vue from 'vue';
import Vuex from 'vuex';
import Acc from './modules/accountStore';
import Bas from './modules/basicStore';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    Acc,
    Bas
  }
});

export default store;
