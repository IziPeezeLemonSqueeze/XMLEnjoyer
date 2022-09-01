import { defineStore } from "pinia";
import { useXMLViewerStore } from "./xml_viewer";

export const useMergeToolStore = defineStore("merge_tool", {
  state: () => ({

    XMLViewerStore: useXMLViewerStore(),

  }),
  actions: {

  },
  getters: {

  }
});
