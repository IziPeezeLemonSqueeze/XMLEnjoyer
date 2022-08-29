import { defineStore } from "pinia";

export const useHistoryStore = defineStore("history", {
  state: () => ({
    history: [],
  }),
  actions: {
    ADD_TO_HISTORY(data) {
      this.history.push(data);
    },

    GET_FROM_HISTORY(data) {
      return this.history[data];
    },
  },
  getters: {
    GET_HISTORY: (state) => state.history,
  },
});
