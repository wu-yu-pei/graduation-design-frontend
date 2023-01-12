import { defineStore } from 'pinia';
import { isDaylight } from '../utils/index';

const useAppStore = defineStore('app', {
  state: () => {
    return {
      userInfo: '',
      token: '',
      mapRef: '',
      isDaylight: isDaylight(),
    };
  },

  persist: {
    key: 'app',
    storage: window.localStorage,
  },
});

export default useAppStore;
