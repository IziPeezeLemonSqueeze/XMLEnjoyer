<template>
  <div>
    <q-card
      class="lateralCard text-white"
      style="
        width: 110px;
        place-content: center flex-start;
        display: flex;
        align-items: center;
        height: 97.5%;
        margin: 10%;
        flex-flow: column;
        flex-wrap: wrap;
        flex-direction: column;
      "
    >
      <q-card-section style="top: 0%; position: fixed">
        <q-btn dense flat icon="minimize" @click="minimizeApp" />
        <q-btn dense flat icon="crop_square" @click="maximizeApp" />
        <q-btn dense flat icon="close" @click="quitApp" />
        <q-separator dark spaced />
      </q-card-section>

      <q-card-section style="margin-top: 40%">
        <q-btn
          :disable="!appStore.GET_OPTION_MENU_DISABLED"
          dense
          flat
          round
          icon="fa-solid fa-gear"
        >
          <q-menu
            persistent
            v-model="appStore.showingMenu"
            style="width: max-content; border-radius: 20px"
            transition-show="jump-down"
            transition-hide="jump-up"
          >
            <div class="row no-wrap q-pa-md" style="background-color: #3988d7">
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
                <br />
                <q-toggle
                  v-model="autoCopyJsonTest"
                  @click="updateAutoCopyJsonOnCreate"
                  dark
                  dense
                  color="white"
                  style="color: white"
                  label="Abilita il copia automatico del JSON Test creato"
                />
                <br />
                <q-separator dark spaced />
                <br />
                <q-input
                  dense
                  dark
                  readonly
                  v-model="appStore.excelDocumentLink"
                  label="Link EXCEL - Tracciamento Attività"
                />
                <q-btn
                  dense
                  dark
                  flat
                  class="text-white"
                  label="SET LINK EXCEL DOC"
                  style="padding: 1%; margin: 5%"
                  @click="setExcelDocumentLink"
                />
              </div>

              <q-separator vertical dark inset class="q-mx-lg" />

              <div class="column items-center">
                <div class="text-h6 text-white q-mb-md">AVAILABLE ORGS</div>
                <q-list dark bordered separator style="max-width: 318px">
                  <q-item v-for="(el, ind) in appStore.orgsSetting" :id="ind">
                    <q-item-section>
                      <q-item-label overline>
                        <b>{{ el.alias }}</b>
                      </q-item-label>
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
      </q-card-section>

      <q-card-section>
        <!--         <q-select
          :disable="!appStore.GET_OPTION_MENU_DISABLED"
          dense
          dark
          standout="bg-blue-3 text-white"
          v-model="setOrgSelection"
          :options="appStore.orgs"
          label="ORG"
          bg-color="blue"
          style="width: 125px"
        /> -->

        <q-btn flat dark>
          <q-icon size="2.5em" name="img:salesforce.svg" />
          <q-menu
            style="width: max-content; border-radius: 20px"
            transition-show="jump-down"
            transition-hide="jump-up"
          >
            <q-list
              class="text-white"
              style="min-width: 100px; background-color: #3988d7"
            >
              <q-item
                :active="appStore.selectedOrg === org"
                v-ripple
                clickable
                v-close-popup
                v-for="(org, idx) in appStore.orgs"
                :key="idx"
                @click="setOrgSelection(org)"
              >
                <q-item-section>{{ org }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <q-tooltip
            class="text-body2"
            style="background-color: #132d47"
            :offset="[10, 10]"
          >
            Select ORG
          </q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section
        class="col"
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
        "
      >
        <q-btn
          flat
          dark
          size="md"
          icon="fa-solid fa-file-export"
          :disabled="XMLViewerStore.GET_SELECTED_XML.length != 1"
          @click="savePackage"
          ><q-tooltip
            class="text-body2"
            style="background-color: #132d47"
            :offset="[10, 10]"
          >
            Export XML
          </q-tooltip></q-btn
        >
        <q-btn
          style="margin-top: 5%"
          flat
          dark
          size="md"
          icon="fa-solid fa-object-group"
          @click="dialogMerge = !dialogMerge"
          :disabled="XMLViewerStore.GET_SELECTED_XML.length < 2"
          ><q-tooltip
            class="text-body2"
            style="background-color: #132d47"
            :offset="[10, 10]"
          >
            Merge XML
          </q-tooltip></q-btn
        >
      </q-card-section>
      <q-card-section>
        <q-btn
          dense
          push
          href="https://www.buymeacoffee.com/IziPeezeLemonSqueeze"
          target="_blank"
          ><img
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
            alt="Buy Me A Coffee"
            style="height: 30px !important; width: 110px !important"
        /></q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import { useQuasar, Notify } from "quasar";
import { useAppStore } from "src/stores/app";
import { useHistoryStore } from "src/stores/history";
import { useXMLViewerStore } from "src/stores/xml_viewer";
import { useMergeToolStore } from "src/stores/mergeTool";
import { useTestJson } from "src/stores/testJson";

export default defineComponent({
  name: "LateralMenu",
  setup() {
    const $q = useQuasar();
    const appStore = useAppStore();
    const historyStore = useHistoryStore();
    const XMLViewerStore = useXMLViewerStore();
    const MergeToolStore = useMergeToolStore();
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
        if (data && !data.includes(".0")) {
          data += ".0";
        }
        localStorage.setItem("API_VERSION", data);
        appStore.apiVersion = data;
      });
    }

    function setExcelDocumentLink() {
      //console.log($q);
      $q.dialog({
        title: "EXCEL DOC - Tracciamento Attività",
        message: "SET LINK EXCEL DOC",
        dark: true,
        cancel: true,
        persistent: true,
        prompt: {
          model: "",
        },
      }).onOk((data) => {
        if (data && (data.includes(".com") || data.includes(".it"))) {
          localStorage.setItem("EXCEL_DOC_LINK", data);
          appStore.excelDocumentLink = data;
        }
      });
    }

    return {
      appStore,
      historyStore,
      XMLViewerStore,
      MergeToolStore,
      jsonTestStore,
      setApi,
      setExcelDocumentLink,
      setNameOperator,
    };
  },
  computed: {
    autoCopyJsonTest: {
      get() {
        return this.jsonTestStore.autoCopyJsonOnCreate;
      },
      set(data) {
        this.jsonTestStore.autoCopyJsonOnCreate = data;
      },
    },
    dialogMerge: {
      get() {
        return this.XMLViewerStore.dialogMerge;
      },
      set(data) {
        this.XMLViewerStore.dialogMerge = data;
      },
    },
  },
  async mounted() {},
  components: {},
  methods: {
    setOrgSelection(org) {
      this.appStore.selectedOrg = org;
      this.appStore.lastActiveOrg == null
        ? (this.appStore.lastActiveOrg = org)
        : null;
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

    savePackage() {
      let xml = this.MergeToolStore.EXPORT_XML();
      window.myAPI.savePackage(xml);
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
<style lang="sass" scoped>
.lateralCard
  width: 150%
  border-radius: 15px
  box-shadow: 3px 3px 10px #0C1E2F
  background: #3988D7
</style>
