<template class="unselectable">
  <q-layout>
    <q-header reveal elevated class="bg-blue-3 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title style="-webkit-app-region: drag">
          <q-avatar>
            <img src="https://i.postimg.cc/XqdmjGqf/logo3.png" />
          </q-avatar>
          {{ "< XML Enjoyer @Salesforce >" }}
        </q-toolbar-title>

        <q-select
          dense
          dark
          standout="bg-blue-3 text-white"
          v-model="setOrgSelection"
          :options="appStore.orgs"
          label="ORG"
          style="margin-right: 1%"
        />
        <q-btn dense flat round icon="fa-solid fa-gear">
          <q-menu
            style="width: max-content"
            transition-show="jump-down"
            transition-hide="jump-up"
          >
            <div class="bg-blue-3 row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 text-white q-mb-md">Settings</div>
                <q-input
                  dense
                  dark
                  readonly
                  v-model="appStore.nameOperator"
                  label="Nome Cognome"
                />
                <q-btn
                  dense
                  dark
                  flat
                  class="text-white"
                  label="SET NOME E COGNOME"
                  style="padding: 1%; margin: 5%"
                  @click="setNameOperator"
                />
                <q-separator dark spaced />
                <q-input
                  dense
                  dark
                  readonly
                  v-model="appStore.apiVersion"
                  label="API Version"
                />
                <q-btn
                  dense
                  dark
                  flat
                  class="text-white"
                  label="SET API VERSION"
                  style="padding: 1%; margin: 5%"
                  @click="setApi"
                />
                <q-separator dark spaced />
                <q-toggle
                  v-model="autoCopyJsonTest"
                  @click="updateAutoCopyJsonOnCreate"
                  dark
                  dense
                  color="white"
                  style="color: white"
                  label="Abilita il copia automatico del JSON Test creato"
                />
              </div>

              <q-separator vertical dark inset class="q-mx-lg" />

              <div class="column items-center">
                <div class="text-h6 text-white q-mb-md">ORG AVAILABLE</div>
                <q-list dark bordered separator style="max-width: 318px">
                  <q-item v-for="(el, ind) in appStore.orgsSetting" :id="ind">
                    <q-item-section>
                      <q-item-label overline>{{ el.alias }}</q-item-label>
                      <q-item-label style="overflow-wrap: break-word">{{
                        el.username
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section avatar>
                      <q-btn
                        dense
                        flat
                        color="red-4"
                        icon="fa-solid fa-right-from-bracket"
                        @click="
                          logout({ username: el.username, alias: el.alias })
                        "
                      />
                    </q-item-section>
                  </q-item>
                  <q-item
                    dense
                    clickable
                    v-ripple
                    @click="appStore.dialogLogin = true"
                  >
                    <q-item-section class="text-bold">
                      AUTHORIZE NEW ORG
                    </q-item-section>
                    <q-item-section avatar>
                      <q-icon dense color="green" name="fa-solid fa-plus" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </q-menu>
        </q-btn>
        <q-separator dark spaced vertical />
        <q-btn dense flat icon="minimize" @click="minimizeApp" />
        <q-btn dense flat icon="crop_square" @click="maximizeApp" />
        <q-btn dense flat icon="close" @click="quitApp" />
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-grey-10 full-width">
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
            <History />
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
import History from "./pages/XMLPACKAGE/History.vue";
import Desk from "./pages/XMLMERGE/Desk.vue";

export default defineComponent({
  name: "App",
  setup() {
    const $q = useQuasar();
    const appStore = useAppStore();
    const historyStore = useHistoryStore();
    const xmlStore = useXMLViewerStore();
    const mergeToolStore = useMergeToolStore();
    const jsonTestStore = useTestJson();

    function setNameOperator() {
      //console.log($q);
      $q.dialog({
        title: "Nome e Cognome",
        message: "",
        dark: true,
        cancel: true,
        persistent: true,
        prompt: {
          model: "",
        },
      }).onOk((data) => {
        localStorage.setItem("NAME_OPERATOR", data);
        appStore.nameOperator = data;
      });
    }
    function setApi() {
      //console.log($q);
      $q.dialog({
        title: "API VERSION",
        message: "SET API VERSION",
        dark: true,
        cancel: true,
        persistent: true,
        prompt: {
          model: "",
          type: "number", // optional
        },
      }).onOk((data) => {
        localStorage.setItem("API_VERSION", data);
        appStore.apiVersion = data;
      });
    }

    return {
      appStore,
      historyStore,
      xmlStore,
      mergeToolStore,
      jsonTestStore,
      setApi,
      setNameOperator,
    };
  },
  computed: {
    setOrgSelection: {
      get() {
        return this.appStore.selectedOrg;
      },
      set(org) {
        this.appStore.selectedOrg = org;
        this.appStore.lastActiveOrg == null
          ? (this.appStore.lastActiveOrg = org)
          : null;
      },
    },
    autoCopyJsonTest: {
      get() {
        return this.jsonTestStore.autoCopyJsonOnCreate;
      },
      set(data) {
        this.jsonTestStore.autoCopyJsonOnCreate = data;
      },
    },
  },
  async mounted() {
    this.xmlStore.$q = useQuasar();
    this.xmlStore.Notify = Notify;
    this.mergeToolStore.$q = useQuasar();
    this.mergeToolStore.Notify = Notify;

    this.appStore.UPDATE_AUTHORIZED_ORGS(await window.myAPI.getAuthList());

    this.appStore.apiVersion = localStorage.getItem("API_VERSION");
    this.appStore.nameOperator = localStorage.getItem("NAME_OPERATOR");
    this.jsonTestStore.autoCopyJsonOnCreate =
      localStorage.getItem("AUTO_COPY_JSON_ON_CREATE") == "true" ? true : false;
  },
  components: {
    XMLViewer,
    MergeVue,
    EditType,
    LoginDialog,
    TestJson,
    AppChoser,
    History,
    Desk,
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

    minimizeApp() {
      window.myAPI.minimizeApp();
    },

    maximizeApp() {
      window.myAPI.maximizeApp();
    },

    quitApp() {
      window.myAPI.quitApp();
    },

    updateAutoCopyJsonOnCreate() {
      localStorage.setItem(
        "AUTO_COPY_JSON_ON_CREATE",
        this.jsonTestStore.autoCopyJsonOnCreate
      );
    },
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
