import { defineStore } from 'pinia';

const useAppStore = defineStore('app', {
  state: () => {
    return {
      map: '',
      isLoadComputer: false,
    };
  },
});

export default useAppStore;
