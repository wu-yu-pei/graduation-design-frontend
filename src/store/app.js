import { defineStore } from 'pinia';

const useAppStore = defineStore('app', {
  state: () => {
    return {
      AMap: '',
      map: '',
      loca: '',
    };
  },
});

export default useAppStore;
