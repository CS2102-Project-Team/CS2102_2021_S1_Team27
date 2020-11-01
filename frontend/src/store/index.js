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
    isPartTime: true,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_ISPT: (state, isPartTime) => {
      state.isPartTime = isPartTime;
    },
  },
  getters: {
    token: (state) => state.token,
    isPartTime: (state) => state.isPartTime,
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
        // reset isPartTime to true(default value) after logout
        commit('SET_ISPT', true);
        removeToken();
        resetRouter();
        resolve();
      });
    },
    signup() {
      return new Promise((resolve) => {
        resetRouter();
        resolve();
      });
    },
  },
});

export default store;
