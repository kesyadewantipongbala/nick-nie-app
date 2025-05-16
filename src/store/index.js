import { createStore } from 'vuex';

const store = createStore({
  state: {
    baseURL:
      process.env.VUE_APP_BASE_URL ||
      'https://robert-praise-calculate-singer.trycloudflare.com//api/v1', // Atau variabel global lainnya
  },
  mutations: {},
  actions: {},
  getters: {
    getBaseURL: (state) => state.baseURL,
  },
});

export default store;

import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api/v1',
  }),
});
