import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

  namespace: true,
  state: {
    drawer: true,
    isAuth: false,
  },
  mutations: {
    toggleDrawer(state) {
      state.drawer = !state.drawer;
    },
    toggleAuth(state){
      state.isAuth = !state.isAuth;
    }
  },
  actions: {
    TOGGLE_DRAWER({ commit }) {
      commit('toggleDrawer');
    }
  },
  getters: {
    DRAWER_STATE(state) {
      return state.drawer;
    },
    getAuth(state){
      return state.isAuth;
    }
  }
});
