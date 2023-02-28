import { defineStore } from 'pinia';

const useAppStore = defineStore('app', {
  state: () => {
    return {
      userInfo: '',
      token: '',
    };
  },

  persist: {
    key: 'app',
    storage: window.localStorage,
  },
});

export default useAppStore;
