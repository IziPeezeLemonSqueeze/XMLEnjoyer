import { defineStore } from "pinia";
import { useXMLViewerStore } from "./xml_viewer";

export const useAppStore = defineStore("app", {
  state: () => ({
    folderStructure: [],
    xmlStore: useXMLViewerStore(),
  }),
  actions: {},
});
