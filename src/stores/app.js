import { defineStore } from "pinia";
import { useXMLViewerStore } from "./xml_viewer";

export const useAppStore = defineStore("app", {
  state: () => ({
    folderStructure: [],
    xmlStore: useXMLViewerStore(),

    orgs: [],
    orgsSetting: [],
    lastActiveOrg: null,
    selectedOrg: null,

    apiVersion: "",
    nameOperator: "",

    dialogLogin: false,
    dialogLoginFirstStep: true,

    alias: '',
    selectedLoginUrl: '',
    optionLoginUrl: [
      { label: 'SANDBOX', value: 'https://test.salesforce.com/', },
      { label: 'PRODUCTION', value: 'https://login.salesforce.com/' }
    ]

  }),
  actions: {

    UPDATE_AUTHORIZED_ORGS(data)
    {
      //console.log('data-org', data);
      if (data.result.length > 0)
      {

        this.orgsSetting = data.result;
        data.result.forEach(org =>
        {
          if (!this.orgs.includes(org.alias))
          {
            this.orgs.push(org.alias);
          }
        });
      }
    },

    SET_PAIR_ORG()
    {
      this.lastActiveOrg = this.selectedOrg;
    }

  },
  getters: {
    GET_SELECTED_ORG: (state) => state.selectedOrg,
    GET_DIALOG_LOGIN: (state) => state.dialogLogin,

  }
});
