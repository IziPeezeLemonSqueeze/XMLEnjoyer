import { defineStore } from "pinia";
import { useXMLViewerStore } from "./xml_viewer";

export const useAppStore = defineStore("app", {
  state: () => ({
    folderStructure: [],
    xmlStore: useXMLViewerStore(),

    orgs: [],
    orgsSetting: [],
    selectedOrg: null,

    apiVersion: "",


  }),
  actions: {},
  getters: {
    GET_SELECTED_ORG: (state) => state.selectedOrg
  }
});
