import { defineStore } from "pinia";
import { useXMLViewerStore } from "./xml_viewer";

export const useAppStore = defineStore("app", {
  state: () => ({

    CLIInstalled: true,
    CLIVersion: '',
    CLIObsolete: true,

    appChoiced: false,
    appConfigured: [
      'XMLMERGE',
      'XMLPACKAGE'
    ],
    appActive: '',
    autoLaunchApp: '',
    firstLaunch: true,

    showingMenu: false,
    optionsMenuOk: false,

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

    IS_CLI_INSTALLED(data)
    {
      this.CLIInstalled = data;
    },

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
    },

    SET_MAIN_MENU()
    {
      this.appChoiced = false;
      this.appActive = '';
      //localStorage.setItem("AUTO_LAUNCH", '');
    }

  },
  getters: {
    GET_SELECTED_ORG: (state) => state.selectedOrg,
    GET_DIALOG_LOGIN: (state) => state.dialogLogin,
    GET_API_VERSION: (state) => state.apiVersion,
    GET_APP_CHOICED: (state) => state.appChoiced,
    GET_APP_ACTIVE: (state) => state.appActive,
    GET_DIALOG_ACTIVE_BY_CLI_INSTALLED: (state) => !state.CLIInstalled,
    GET_OPTION_MENU_DISABLED: (state) =>
    {
      if (!state.apiVersion || !state.nameOperator)
      {
        return false;
      }
      return true;
    }
  }
});
