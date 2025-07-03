<template>
  <div class="col full-width">
    <!--     <div class="row q-ma-md">

      <q-file
        dark
        color="white"
        style="width: 300px"
        v-model="file"
        outlined
        label="Carica/Trascina File XML"
        accept=".xml"
        :disable="XMLViewerStore.parsedFile.length >= 10"
      />
      <q-space />
      <q-btn
        dark
        class="text-white"
        size="md"
        color="grey-6"
        icon="fa-solid fa-file-export"
        :disabled="XMLViewerStore.GET_SELECTED_XML.length != 1"
        @click="savePackage"
        ><q-tooltip class="bg-grey-9 text-body2" :offset="[10, 10]">
          Esporta XML
        </q-tooltip></q-btn
      >
      <q-separator vertical dark spaced />
      <q-btn
        dark
        class="text-white"
        size="md"
        color="grey-6"
        icon="fa-solid fa-object-group"
        @click="dialogMerge = !dialogMerge"
        :disabled="XMLViewerStore.GET_SELECTED_XML.length < 2"
        ><q-tooltip class="bg-grey-9 text-body2" :offset="[10, 10]">
          Unisci XML
        </q-tooltip></q-btn
      >
    </div>
    <q-separator dark /> -->
    <div
      style="
        margin-bottom: -35px;
        height: 60px;
        position: static;
        app-region: drag;
        user-select: none;
      "
    >
      <div
        style="
          position: absolute;
          left: 10%;
          font-family: 'Font Awesome 5 Brands';
          top: 2%;
          font-size: x-large;
        "
        class="text-white"
      >
        X M L - E N J O Y E R
      </div>
      <div
        style="
          position: absolute;
          left: 28%;
          font-family: 'Font Awesome 5 Brands';
          top: 3%;
          font-size: medium;
        "
        class="text-white"
      >
        v 1.0.6
      </div>
      <div
        v-if="AppStore.selectedOrg ? true : false"
        style="
          position: absolute;
          left: 35%;
          font-family: 'Font Awesome 5 Brands';
          top: 2%;
          font-size: x-large;
        "
        class="text-white"
      >
        <q-icon name="img:salesforce.svg" size="1.8em" /> :
        {{ AppStore.selectedOrg }}
      </div>
      <div
        v-if="!AppStore.selectedOrg ? true : false"
        style="
          position: absolute;
          left: 35%;
          font-family: 'Font Awesome 5 Brands';
          top: 2%;
          font-size: x-large;
        "
        class="text-orange"
      >
        <q-icon name="img:salesforce.svg" size="1.8em" /> : N O - O R G
      </div>
    </div>
    <q-scroll-area
      horizontal
      style="height: 850px; margin: 5% 0% 0% 1%"
      class=""
    >
      <div class="row no-wrap q-pa-sm text-pre-wrap" style="margin-right: 3%">
        <q-card
          v-bind="getRootProps()"
          class="text-white"
          :style="
            isDragActive
              ? 'background: #3988D7;text-align: center;display: flex;border-width: 3px;border-style: dashed;margin-left: 0.5%;position: sticky;min-width: 350px;border-radius: 10px;max-width: 350px;max-height: 658px;min-height: 658px;top: 1.9%;flex-flow: column;align-items: center;justify-content: center; user-select: none;'
              : 'background: transparent; text-align: center; display: flex; border-width: 3px; border-style: dashed; margin-left: 0.5%; position: sticky; min-width: 350px; border-radius: 10px; max-width: 350px; max-height: 658px; min-height: 658px; top: 1.9%; flex-flow: column; align-items: center; justify-content: center; user-select: none;'
          "
        >
          <q-card-section>
            <div class="text-h7">CLICK + TO CREATE NEW EMPTY PACKAGE</div>
            <q-btn
              style="margin: 5%"
              rounded
              dense
              dark
              @click="XMLViewerStore.GENERATE_NEW_EMPTY_XML"
            >
              <q-icon name="fa-solid fa-plus" size="3em" />
            </q-btn>
            <div class="text-h7">OR DROP HERE PACKAGE.XML</div>
          </q-card-section>
        </q-card>
        <draggable
          class="row no-wrap dropArea"
          :list="XMLViewerStore.parsedFile"
          animation="300"
          easing="cubic-bezier(1, 0, 0, 1)"
        >
          <div
            style="font-family: 'Roboto Flex'"
            v-for="(item, index) in XMLViewerStore.parsedFile"
            :key="index"
          >
            <q-list
              bordered
              padding
              style="
                min-width: 350px;
                border-radius: 10px;
                max-width: 350px;
                background-color: #3988d7;
                text-shadow: -1px -1px 0 #0c1e2f, 1px -1px 0 #0c1e2f,
                  -1px 1px 0 #0c1e2f, 1px 1px 0 #0c1e2f;
              "
              :class="
                item.hover
                  ? item.parsed['Package']['@_xmlns']
                    ? item.parsed['Package']['@_xmlns'].includes('sforce')
                      ? 'q-pa-sm text-white q-ma-sm shadow-20 card-hover '
                      : 'bg-grey-5 q-pa-sm q-ma-sm card-hover shadow-20'
                    : 'bg-grey-5 q-pa-sm q-ma-sm card-hover shadow-20'
                  : item.parsed['Package']['@_xmlns']
                  ? item.parsed['Package']['@_xmlns'].includes('sforce')
                    ? 'q-pa-sm text-white q-ma-sm shadow-20'
                    : 'bg-grey-5 q-pa-sm q-ma-sm shadow-20'
                  : 'bg-grey-5 q-pa-sm q-ma-sm shadow-20'
              "
            >
              <q-item-section>
                <q-bar style="border-radius: 10px 10px 0 0">
                  <div class="cursor-pointer">
                    <q-checkbox
                      v-model="item.checked"
                      @click="XMLViewerStore.GET_CHECKED_XML()"
                    />
                  </div>
                  <q-separator dark vertical spaced />
                  <div>
                    <q-popup-edit v-model="item.index" auto-save v-slot="scope">
                      <q-input
                        v-model="scope.value"
                        dense
                        autofocus
                        counter
                        @keyup.enter="scope.set"
                      />
                    </q-popup-edit>
                    {{ item.index }}
                  </div>
                  <q-space />
                  <q-separator dark vertical spaced />
                  <q-btn dense flat icon="close" @click="item.closing = true" />
                </q-bar>

                <q-banner
                  v-if="item.closing"
                  dense
                  inline-actions
                  class="text-white bg-red"
                >
                  Eliminare ?
                  <template v-slot:action>
                    <q-btn
                      flat
                      color="white"
                      label="Si"
                      @click="XMLViewerStore.DELETE_XML(item.uuid)"
                    />
                    <q-btn
                      outline
                      color="white"
                      label="No"
                      @click="item.closing = false"
                    />
                  </template>
                </q-banner>
                <q-expansion-item
                  v-model="item.openInfo"
                  class="text-center"
                  expand-separator
                  :style="
                    item.parsed
                      ? item.parsed['Package']['@_xmlns'].includes('sforce')
                        ? 'background-color: #9dcdf4; text-align-last: center'
                        : 'background-color: #C7C7C7; text-align-last: center'
                      : 'background-color: #C7C7C7; text-align-last: center'
                  "
                  :icon="
                    item.parsed
                      ? item.parsed['Package']['@_xmlns'].includes('sforce')
                        ? 'fa-brands fa-salesforce'
                        : 'fa-solid fa-file'
                      : null
                  "
                  label="XML INFO"
                >
                  <div
                    class="text-wrap q-pa-xs"
                    style="
                      overflow-wrap: break-word;
                      text-align-last: left;
                      text-align: -webkit-left;
                      line-break: anywhere;
                    "
                  >
                    Nome File:
                    <strong> {{ item.nameFile ? item.nameFile : null }}</strong>
                    <br />
                    Path:
                    <strong> {{ item.pathFile ? item.pathFile : null }}</strong>
                    <br />
                    Version:
                    <strong>{{
                      item.parsed
                        ? item.parsed["Package"]["version"]["#text"]
                        : null
                    }}</strong>
                    <br />
                    Package:
                    <strong>
                      {{
                        item.parsed ? item.parsed["Package"]["@_xmlns"] : null
                      }}</strong
                    >
                  </div>
                </q-expansion-item>
              </q-item-section>
              <q-bar
                dense
                dark
                style="
                  border-radius: 0px 0px 10px 10px;
                  justify-content: center;
                  justify-content: space-around;
                "
              >
                <q-btn
                  dense
                  flat
                  rounded
                  label="Aggiungi <Types/>"
                  icon="fa-solid fa-circle-plus"
                  @click="
                    XMLViewerStore.ADD_TYPE_ON_XML({
                      index: index,
                      name: 'CHANGE_ME',
                    })
                  "
                />
                <q-btn
                  dense
                  flat
                  rounded
                  label="Ordina"
                  icon="fa-solid fa-arrow-down-a-z"
                  @click="
                    XMLViewerStore.SORT_TYPES_AND_MEMBERS({
                      indexParsedFile: index,
                    })
                  "
                />
                <q-btn
                  dense
                  flat
                  rounded
                  label="JSON Test"
                  icon="fa-solid fa-flask-vial"
                  :disable="
                    XMLViewerStore.downloadingMDT || !AppStore.selectedOrg
                  "
                  @click="initJsonTest(index)"
                />
              </q-bar>
              <q-scroll-area style="height: 500px">
                <draggable
                  class="dragArea list-group w-full"
                  :list="item.parsed.Package.types"
                  animation="300"
                  easing="cubic-bezier(1, 0, 0, 1)"
                >
                  <q-item
                    tag="div"
                    v-for="(el, idxEl) in item.parsed.Package.types"
                    :key="idxEl"
                    :clickable="false"
                    :focused="false"
                    :manual-focus="true"
                  >
                    <div class="col-1">
                      <q-btn icon="fa-solid fa-trash-can" dense flat size="xs">
                        <q-popup-edit
                          position="cover"
                          v-slot="scope"
                          class="q-pa-md bg-grey-5"
                        >
                          <div
                            class="col q-ma-sx text-center text-black"
                            style="max-height: 50px; min-height: 50px"
                          >
                            <div class="row q-pa-sx">
                              <strong> Eliminare ? </strong><br />
                            </div>

                            <div
                              class="q-ma-sm row absolute-bottom"
                              style="justify-content: center"
                            >
                              <q-space />
                              <q-btn
                                flat
                                dense
                                class="q-pa-sx"
                                label="si"
                                :disable="XMLViewerStore.downloadingMDT"
                                @click="
                                  XMLViewerStore.REMOVE_NODE(index, idxEl);
                                  scope.cancel();
                                "
                              />
                              <q-space />
                              <q-btn
                                dense
                                color="red"
                                class="q-pa-sx"
                                label="no"
                                @click="scope.cancel"
                              />
                              <q-space />
                            </div>
                          </div>
                        </q-popup-edit>
                      </q-btn>
                      <q-btn
                        icon="fa-solid fa-pencil"
                        dense
                        flat
                        size="xs"
                        :disable="XMLViewerStore.downloadingMDT"
                        @click="
                          openAndEditType({
                            parsedFileIndex: index,
                            parsedFileNodeIndex: idxEl,
                            node: el,
                          })
                        "
                      />
                    </div>
                    <q-item-section>
                      <div
                        class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-left"
                        style="max-width: 250px; font-size: 11px"
                      >
                        <div
                          style="min-width: max-content"
                          v-for="(memb, membindex) in el.members"
                        >
                          MEMBERS:
                          <strong :key="membindex"
                            >{{ Object.values(memb)[0] }}
                          </strong>
                        </div>
                        <div>
                          NAME:
                          <strong> {{ el.name["#text"] }}</strong>
                        </div>

                        <q-separator />
                      </div>
                    </q-item-section>
                  </q-item>
                </draggable>
              </q-scroll-area>
              <div class="text-caption" style="margin-top: 5%">
                Last Modified:
                {{
                  item.parsed["#comment"]
                    ? item.parsed["#comment"]["#text"]
                    : null
                }}
              </div>
            </q-list>
          </div>
        </draggable>
      </div>
    </q-scroll-area>
    <div
      style="position: fixed; vertical-align: middle; bottom: 10px; right: 10px"
    >
      <q-badge
        :class="this.AppStore.CLIObsolete ? 'pulse cursor-pointer' : null"
        outline
        align="middle"
        :color="this.AppStore.CLIObsolete ? 'red' : 'primary'"
        @click="this.AppStore.CLIObsolete ? openSFUpdateClIPage() : null"
      >
        {{ this.AppStore.CLIObsolete ? "SFDX:" : "SF:" }}
        {{ this.AppStore.CLIVersion }}
        <q-tooltip v-if="this.AppStore.CLIObsolete">
          SFDX CLI è obsoleta, si consiglia di installare una versione più
          aggiornata! Clicca qui per aprire la pagina Salesforce per la
          procedura di aggiornamento!
        </q-tooltip>
      </q-badge>
    </div>
  </div>
</template>
<script>
import { useAppStore } from "src/stores/app";
import { useMergeToolStore } from "src/stores/mergeTool";
import { useXMLViewerStore } from "src/stores/xml_viewer";
import { useTestJson } from "src/stores/testJson";

import { useDropzone } from "vue3-dropzone";
import { VueDraggableNext } from "vue-draggable-next";
import { useClipboard, usePermission } from "@vueuse/core";
import { useQuasar, Notify } from "quasar";

export default {
  name: "XMLVIEWER",
  setup() {
    let notifyDismissDownloadMDT = null;
    let xmlText = null;

    const $q = useQuasar();
    const XMLViewerStore = useXMLViewerStore();
    const MergeToolStore = useMergeToolStore();
    const AppStore = useAppStore();
    const JsonTestStore = useTestJson();

    const { text, isSupported, copy } = useClipboard();
    const permissionRead = usePermission("clipboard-read");
    const permissionWrite = usePermission("clipboard-write");

    const { getRootProps, getInputProps, ...rest } = useDropzone({
      accept: ".xml",
      onDrop,
      multiple: false,
      onDropAccepted: dropNewFile,
      onDropRejected: failedDropNewFile,
    });
    function onDrop(acceptFiles, rejectReasons) {
      console.log(acceptFiles);
      console.log(rejectReasons);
    }
    function dropNewFile(file) {
      console.log("DROP NEW FILE", file);
      XMLViewerStore.SET_FILE(file);
    }

    function failedDropNewFile(file) {
      console.log("FAIL DROP, REJECTED");
    }
    return {
      xmlText,
      XMLViewerStore,
      MergeToolStore,
      AppStore,
      JsonTestStore,
      Notify,
      text,
      copy,
      permissionRead,
      permissionWrite,
      isSupported,
      notifyDismissDownloadMDT,
      getRootProps,
      getInputProps,
      ...rest,
    };
  },
  computed: {
    dialogMerge: {
      get() {
        return this.XMLViewerStore.dialogMerge;
      },
      set(data) {
        this.XMLViewerStore.dialogMerge = data;
      },
    },
    dialogModifyType: {
      get() {
        return this.XMLViewerStore.dialogModifyType;
      },
      set(data) {
        this.XMLViewerStore.dialogModifyType = data;
      },
    },
    dialogJsonTest: {
      get() {
        return this.XMLViewerStore.dialogJsonTest;
      },
      set(data) {
        this.XMLViewerStore.dialogJsonTest = data;
      },
    },
    file: {
      get() {},
      set(data) {
        //console.log(data);
        this.XMLViewerStore.SET_FILE(data);
      },
    },
  },
  async mounted() {
    if (!this.AppStore.selectedOrg) {
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

    const CLIData = await window.myAPI.checkSfdxUpdate();
    this.AppStore.CLIVersion = CLIData.version;
    this.AppStore.CLIObsolete = CLIData.obsoleteVersion;
    console.log(await this.AppStore.CLIVersion);

    this.XMLViewerStore.$subscribe((mutation, state) => {
      switch (mutation.events.key) {
        case "parsedFile":
          //console.log(mutation.events.newValue);

          break;
      }
    });

    this._keyListener = async function (e) {
      if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
        //e.preventDefault(); // present "Save Page" from getting triggered.
        this.text = await window.myAPI.getExternalClipboard();
        this.XMLViewerStore.SET_FILE(this.text);
        console.log("CONTROL V", this.text);
        this.text = null;
        this.copy("");
      } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault(); // present "Save Page" from getting triggered.
        this.text = null;
        this.copy(this.MergeToolStore.EXPORT_XML());
        console.log("CONTROL C", this.text);
      }
    };

    document.addEventListener("keydown", this._keyListener.bind(this));
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this._keyListener);
  },
  updated() {},
  methods: {
    async openAndEditType(data) {
      if (this.AppStore.selectedOrg == null) {
        this.Notify.create({
          message: "NO ORG SELECTED - NO AUTOCOMPLETE TYPES AVAILABLE ",
          color: "orange",
          timeout: 0,
          position: "bottom",
          textColor: "black",
          actions: [
            {
              label: "CLOSE",
              handler: () => {},
            },
          ],
        });
      } else if (data.node.name["#text"] == "CHANGE_ME") {
        this.dialogModifyType = true;
        //console.log(data);
        this.XMLViewerStore.SET_TYPE_ON_MODIFY(data);

        this.XMLViewerStore.ADD_COMMENT_LASTMODIFIED_ON_XML(
          data.parsedFileIndex
        );
      } else {
        //this._notifyDownloadFromOrgMDT(); TODO
        this.XMLViewerStore.CREATE_NOTIFY_DOWNLOAD_FROM_ORG_MDT(
          this.AppStore.GET_SELECTED_ORG
        );

        //localStorage.setItem("MDT_TEMP", []);
        if (this.AppStore.GET_SELECTED_ORG != this.AppStore.lastActiveOrg) {
          this.XMLViewerStore.lastMetadataRetrievied = null;
          this.AppStore.SET_PAIR_ORG();
        }
        if (
          data.node.name["#text"] != this.XMLViewerStore.lastMetadataRetrievied
        ) {
          this.XMLViewerStore.lastMetadataRetrievied = data.node.name["#text"];
          this.XMLViewerStore.SET_METADATA_RETRIEVED(
            await window.myAPI.retrieveMetadata({
              org: this.AppStore.GET_SELECTED_ORG,
              mdtName: data.node.name["#text"],
              api: localStorage.getItem("API_VERSION"),
            })
          );
        }
        //this.notifyDismissDownloadMDT(); TODO
        this.XMLViewerStore.notifyDismissDownloadMDT();

        this.XMLViewerStore.downloadingMDT = false;
      }

      this.dialogModifyType = true;
      //console.log(data);
      this.XMLViewerStore.SET_TYPE_ON_MODIFY(data);

      this.XMLViewerStore.ADD_COMMENT_LASTMODIFIED_ON_XML(data.parsedFileIndex);
    },

    /*     savePackage() {
      let xml = this.MergeToolStore.EXPORT_XML();
      window.myAPI.savePackage(xml);
    }, */

    async initJsonTest(data) {
      let existApexClasses = this.XMLViewerStore.parsedFile[data].parsed[
        "Package"
      ]["types"].filter((type) => type.name["#text"] == "ApexClass");
      console.log(existApexClasses);
      if (existApexClasses.length > 0) {
        this.JsonTestStore.statusApexClasses = true;

        //this._notifyDownloadFromOrgMDT(); TODO
        this.XMLViewerStore.CREATE_NOTIFY_DOWNLOAD_FROM_ORG_MDT(
          this.AppStore.GET_SELECTED_ORG
        );

        this.XMLViewerStore.SET_METADATA_RETRIEVED(
          await window.myAPI.retrieveMetadata({
            org: this.AppStore.GET_SELECTED_ORG,
            mdtName: "ApexClass",
            api: localStorage.getItem("API_VERSION"),
          })
        );

        this.JsonTestStore.apexClassFounded = existApexClasses[0].members;
        this.JsonTestStore.INIT_JSON();

        if (this.JsonTestStore.autoCopyJsonOnCreate) {
          this.copy(this.JsonTestStore.bodyJson);
          Notify.create({
            message: "JSON copiato!",
            color: "orange",
            timeout: 3000,
          });
        }

        this.dialogJsonTest = !this.dialogJsonTest;
        this.XMLViewerStore.downloadingMDT = false;

        //this.notifyDismissDownloadMDT(); TODO
        this.XMLViewerStore.notifyDismissDownloadMDT();
      } else {
        this.dialogJsonTest = !this.dialogJsonTest;
        this.JsonTestStore.statusApexClasses = false;
        this.JsonTestStore.bodyJson = "Non ci sono classi Apex nel XML";
      }
    },
    openSFUpdateClIPage() {
      window.open(
        "https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_move_to_sf_v2.htm"
      );
    },
    /*
    _notifyDownloadFromOrgMDT() {
      this.XMLViewerStore.downloadingMDT = true;
      this.notifyDismissDownloadMDT = this.Notify.create({
        message: "Scarico Metadata dalla ORG...",
        color: "blue",
        timeout: 0,
        position: "bottom",
        textColor: "white",
        spinner: QSpinnerGrid,
      });
    }, */
  },
  components: {
    draggable: VueDraggableNext,
  },
};
</script>
<style>
.card-hover {
  border-width: 5px;
  border-color: chartreuse;
}

.pulse {
  animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px rgba(255, 0, 0, 0.8);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
}

@font-face {
  font-family: "Roboto Flex";
  font-style: normal;
  font-weight: 100 1000;
  font-stretch: 0% 200%;
  src: url(https://fonts.gstatic.com/s/robotoflex/v9/NaNeepOXO_NexZs0b5QrzlOHb8wCikXpYqmZsWI-__OGfttPZktqc2VdZ80KvCLZaPcSBZtOx2MifRuWR28sPJtUMbsFEK6cRrleUx9Xgbm3WLHa_F4Ep4Fm0PN19Ik5Dntczx0wZGzhPlL1YNMYKbv9_1IQXOw7AiUJVXpRJ6cXW4O8TNGoXjC79QRyaLshNDUf9-EmFw.woff2)
    format("woff2");
}
</style>
