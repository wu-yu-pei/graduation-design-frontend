import { defineStore } from 'pinia';

const useAppStore = defineStore('app', {
  state: () => {
    return {
      userInfo: '',
      token: '',
      map: '',
    };
  },

  persist: {
    key: 'app',
    storage: window.localStorage,
  },
});

export default useAppStore;
