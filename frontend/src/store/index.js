/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { login } from '@/api/user';
import { resetRouter } from '@/router';

// this page serves as temporary local storage

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    token: getToken(),
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
  },
  getters: {
    token: (state) => state.token,
  },
  actions: {
    login({ commit }, userinfo) {
      const { username, password } = userinfo;
      return new Promise(
        (resolve, reject) => {
          login({ username: username.trim(), password }).then((response) => {
            const { data } = response;
            // eslint-disable-next-line no-console
            console.log(`data: ${data}`);
            commit('SET_TOKEN', data.access_token);
            setToken(data.access_token);
            resolve();
          }).catch((error) => {
            reject(error);
          });
        },
      );
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '');
        removeToken();
        resetRouter();
        resolve();
      });
    },
  },
});

export default store;