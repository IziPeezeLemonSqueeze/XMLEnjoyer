<template>
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
          class="col q-pa-md text-white"
          style="max-width: 250px; min-width: auto; border-color: green"
        >
          HISTORY XML
          <q-separator spaced dark />
          <q-scroll-area style="height: 880px">
            <q-list dark bordered style="border-radius: 10px">
              <q-item
                style="overflow-wrap: anywhere"
                v-for="(item, index) in historyStore.history"
                :key="index"
                @mouseenter="xmlStore.SET_HOVER({ b: true, i: item.uuid })"
                @mouseleave="xmlStore.SET_HOVER({ b: false, i: item.uuid })"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-icon
                    color="white"
                    :name="item.action === 'add' ? 'fa-solid fa-plus' : null"
                  />
                </q-item-section>

                <q-item-section>
                  <strong>{{ item.name }}</strong>
                  <q-tooltip class="bg-grey-9 text-body2" :offset="[10, 10]">
                    Percorso:
                    <strong>{{ item.path }}</strong>
                  </q-tooltip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <q-separator vertical dark />

        <XMLViewer />
        <MergeVue />
        <EditType />
        <LoginDialog />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { useQuasar, Notify } from "quasar";
import { useAppStore } from "src/stores/app";
import { useHistoryStore } from "./stores/history";
import { useXMLViewerStore } from "./stores/xml_viewer";
import { useMergeToolStore } from "./stores/mergeTool";

import XMLViewer from "./pages/XMLViewer.vue";
import MergeVue from "./pages/Merge.vue";
import EditType from "./pages/EditType.vue";
import LoginDialog from "./pages/LoginDialog.vue";

export default defineComponent({
  name: "App",
  setup() {
    const $q = useQuasar();
    const appStore = useAppStore();
    const historyStore = useHistoryStore();
    const xmlStore = useXMLViewerStore();
    const mergeToolStore = useMergeToolStore();

    function setNameOperator() {
      //console.log($q);
      $q.dialog({
        title: "Nome e Cognome dell'utilizzatore",
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
  },
  async mounted() {
    this.xmlStore.$q = useQuasar();
    this.xmlStore.Notify = Notify;
    this.mergeToolStore.$q = useQuasar();
    this.mergeToolStore.Notify = Notify;

    this.appStore.UPDATE_AUTHORIZED_ORGS(await window.myAPI.getAuthList());

    this.appStore.apiVersion = localStorage.getItem("API_VERSION");
    this.appStore.nameOperator = localStorage.getItem("NAME_OPERATOR");

    if (!this.appStore.selectedOrg) {
      Notify.create({
        message: "NO ORG SELECTED - NO AUTOCOMPLETE TYPES AVAILABLE ",
        color: "orange",
        timeout: 20000,
        position: "bottom",
        textColor: "black",
        actions: [
          {
            label: "CLOSE",
            handler: () => {},
          },
        ],
      });
    }
  },
  components: {
    XMLViewer,
    MergeVue,
    EditType,
    LoginDialog,
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
  },
});
</script>
