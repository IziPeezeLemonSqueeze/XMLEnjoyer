<template class="unselectable">
  <q-layout>
    <q-header reveal elevated class="bg-blue-3 text-white" height-hint="98">
      <NoCLIDialog />
    </q-header>
    <q-page-container
      class="full-width"
      style="background-color: #132d47; border-radius: 20px"
    >
      <q-page class="row full-width">
        <div
          v-if="!appStore.GET_APP_CHOICED"
          style="width: inherit; align-self: center"
          full-width
        >
          <AppChoser />
        </div>
        <div
          class="row full-width"
          v-else-if="appStore.GET_APP_ACTIVE == 'XMLPACKAGE'"
        >
          <div class="row full-width">
            <!-- <History /> -->
            <LateralMenu />
            <XMLViewer />
          </div>
          <MergeVue />
          <EditType />
          <LoginDialog />
          <TestJson />
        </div>
        <div
          v-else-if="appStore.GET_APP_ACTIVE == 'XMLMERGE'"
          class="row full-width"
        >
          <Desk />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
  <q-btn
    v-if="appStore.GET_APP_CHOICED"
    size="sm"
    style="position: fixed; top: 98%; left: 48%; /* z-index: 10000; */"
    push
    color="primary"
    label="Menù principale"
    @click="appStore.SET_MAIN_MENU"
  />
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar, Notify } from "quasar";
import { useAppStore } from "src/stores/app";
import { useHistoryStore } from "./stores/history";
import { useXMLViewerStore } from "./stores/xml_viewer";
import { useMergeToolStore } from "./stores/mergeTool";
import { useTestJson } from "./stores/testJson";

import AppChoser from "./pages/AppChoser.vue";

import XMLViewer from "./pages/XMLPACKAGE/XMLViewer.vue";
import MergeVue from "./pages/XMLPACKAGE/Merge.vue";
import EditType from "./pages/XMLPACKAGE/EditType.vue";
import LoginDialog from "./pages/XMLPACKAGE/LoginDialog.vue";
import TestJson from "./pages/XMLPACKAGE/TestJson.vue";
import NoCLIDialog from "./pages/XMLPACKAGE/NoCLIDialog.vue";
import Desk from "./pages/XMLMERGE/Desk.vue";
/* import History from "./pages/XMLPACKAGE/History.vue"; */
import LateralMenu from "./pages/XMLPACKAGE/LateralMenu.vue";

export default defineComponent({
  name: "App",
  setup() {
    const $q = useQuasar();
    const appStore = useAppStore();
    const historyStore = useHistoryStore();
    const xmlStore = useXMLViewerStore();
    const mergeToolStore = useMergeToolStore();
    const jsonTestStore = useTestJson();

    return {
      appStore,
      historyStore,
      xmlStore,
      mergeToolStore,
      jsonTestStore,
    };
  },
  computed: {},
  async mounted() {
    this.xmlStore.$q = useQuasar();
    this.xmlStore.Notify = Notify;
    this.mergeToolStore.$q = useQuasar();
    this.mergeToolStore.Notify = Notify;

    this.appStore.IS_CLI_INSTALLED(await window.myAPI.checkCliSFIstalled());
    console.log("SF CLI INSTALLED ", this.appStore.CLIInstalled);

    if (this.appStore.CLIInstalled) {
      this.appStore.UPDATE_AUTHORIZED_ORGS(await window.myAPI.getAuthList());
    }

    this.appStore.excelDocumentLink = localStorage.getItem("EXCEL_DOC_LINK");
    this.appStore.apiVersion = localStorage.getItem("API_VERSION");
    this.appStore.nameOperator = localStorage.getItem("NAME_OPERATOR");
    this.jsonTestStore.autoCopyJsonOnCreate =
      localStorage.getItem("AUTO_COPY_JSON_ON_CREATE") == "true" ? true : false;

    if (!this.appStore.apiVersion || !this.appStore.nameOperator) {
      Notify.create({
        message:
          "ATTENZIONE !! Imposta il tuo Nome e Cognome e la versione API di SFDC",
        color: "red",
        timeout: 300000,
        position: "top-right",
        closeBtn: true,
        multiLine: true,
        onDismiss: (this.appStore.showingMenu = true),
      });
    }
  },
  components: {
    XMLViewer,
    MergeVue,
    EditType,
    LoginDialog,
    TestJson,
    AppChoser,
    /*   History, */
    LateralMenu,
    Desk,
    NoCLIDialog,
  },
  methods: {
    logout(data) {
      //console.log(data);
      window.myAPI.logoutOrg(data.username);

      this.appStore.orgs = this.appStore.orgs.filter(
        (org) => !org.includes(data.alias)
      );
      this.appStore.orgsSetting = this.appStore.orgsSetting.filter(
        (org) => org.alias != data.alias
      );
    },

    /*
    minimizeApp() {
      window.myAPI.minimizeApp();
    },

    maximizeApp() {
      window.myAPI.maximizeApp();
    },

    quitApp() {
      window.myAPI.quitApp();
    },
    */
  },
});
</script>
<style>
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
