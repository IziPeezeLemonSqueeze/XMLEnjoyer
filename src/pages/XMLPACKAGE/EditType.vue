<template>
  <q-dialog v-model="XMLViewerStore.GET_DIALOG_MODIFY_TYPE_HIDE">
    <q-card dark class="bg-grey-4 text-black" style="width: -webkit-fill-available;top:-20%; max-height: 500px;">
      <q-toolbar>
        <q-icon size="md" name="fa-solid fa-code" />

        <q-toolbar-title><span class="text-weight-bold">Modify</span> TYPES</q-toolbar-title>
        <q-btn flat rounded color="red" dense icon="close" v-close-popup
          @click="XMLViewerStore.dialogModifyType = false" />
      </q-toolbar>
      <q-separator spaced dark />
      <div class="row full-width"
        style="display: flex;flex-direction: row;flex-wrap: nowrap;align-items: center;place-content: space-evenly;">
        <q-btn :disable="XMLViewerStore.downloadingMDT" dense flat rounded label="Members "
          icon="fa-solid fa-circle-plus" @click="XMLViewerStore.ADD_TYPE_FROM_ONMODIFY" />
        <q-btn :disable="XMLViewerStore.downloadingMDT" dense flat label="ORDINA" rounded
          icon="fa-solid fa-arrow-down-a-z" @click="XMLViewerStore.SORT_TYPES_FROM_ONMODIFY" />
        <q-btn :disable="!AppStore.selectedOrg" dense flat label="Sync" rounded icon="fa-solid fa-arrows-rotate"
          @click="synchMetadata" />
      </div>
      <q-card-section>
        <q-scroll-area style="height: 200px;max-height: 500px; max-width: 600px;" ref="scrollAreaRef">
          <q-list :disable="XMLViewerStore.downloadingMDT" bordered separator>
            <q-item v-for="(el, index) in XMLViewerStore.nodeOnModify.members"
              :clickable="XMLViewerStore.downloadingMDT" v-ripple :key="index">
              <q-item-section side top>
                <q-btn dense color="red" icon="fa-solid fa-trash"
                  @click="XMLViewerStore.DELETE_TYPE_FROM_ONMODIFY(index)" />
              </q-item-section>
              <q-item-section>
                <q-popup-edit :disable="XMLViewerStore.downloadingMDT" :auto-save="false" style="width: 20%"
                  v-model="XMLViewerStore.nodeOnModify.members[ index ][ '#text' ]" v-slot="scope">
                  <q-input v-if="!AppStore.selectedOrg" v-model="scope.value" dense autofocus
                    hint="Premi INVIO per salvare" @keyup.enter="scope.set"></q-input>
                  <q-select v-if="AppStore.selectedOrg" style="height: 90%;z-index:1000; " v-model="el[ '#text' ]"
                    filled use-input hide-selected fill-input :loading="options.length > 0 ? false : true"
                    input-debounce="100" :options="options" @filter="filterFn">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No results
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </q-popup-edit>

                <q-item-label>{{ el[ "#text" ] }} </q-item-label>
                <q-item-label caption>MEMBER</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <q-item-label style="margin-top: 4%;">
          <q-popup-edit :auto-save="false" style="width: 20%" v-model="XMLViewerStore.nodeOnModify.name[ '#text' ]"
            v-slot="scope">
            <!--             <q-input
              v-model="scope.value"
              dense
              autofocus
              counter
              @keyup.enter="scope.set"
            /> -->
            <q-select :disable="XMLViewerStore.downloadingMDT ||
              XMLViewerStore.nodeOnModify.members.length > 0
              " v-model="XMLViewerStore.nodeOnModify.name[ '#text' ]" use-input hide-selected fill-input
              input-debounce="100" @popup-hide="updatedTypeName" :options="optionsMDTList" @filter="filterFnMDTList">

              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-popup-edit>
          {{ XMLViewerStore.nodeOnModify.name[ "#text" ] }}
        </q-item-label>
        <q-item-label caption>NAME</q-item-label>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { useAppStore } from "src/stores/app";
import { useXMLViewerStore } from "src/stores/xml_viewer";

import { ref } from "vue";
export default {
  computed: {},

  setup()
  {
    const XMLViewerStore = useXMLViewerStore();
    const AppStore = useAppStore();
    const options = ref(XMLViewerStore.metadataRetrieved);
    const optionsMDTList = ref(XMLViewerStore.metadataList);
    const scrollAreaRef = ref(null);
    return {
      XMLViewerStore,
      AppStore,
      options,
      optionsMDTList,

      filterFn(val, update, abort)
      {
        update(() =>
        {
          const needle = val.toLowerCase();

          let nodeOnModData = [];

          for (const mem of XMLViewerStore.nodeOnModify.members)
          {
            if (mem[ "#text" ] && mem[ "#text" ] != "")
            {
              nodeOnModData.push(mem[ "#text" ]);
            }
          }

          const mtdData = XMLViewerStore.metadataRetrieved.flatMap((mem) =>
          {
            console.log("mem", mem);
            if (nodeOnModData.includes(mem))
            {
              return [];
            }
            return [ mem ];
          });

          options.value = mtdData.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },

      filterFnMDTList(val, update, abort)
      {
        update(() =>
        {
          const needle = val.toLowerCase();
          optionsMDTList.value = XMLViewerStore.metadataList.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },
    };
  },
  methods: {
    async synchMetadata()
    {
      if (this.XMLViewerStore.nodeOnModify.name[ "#text" ] != "CHANGE_ME")
      {
        this.AppStore.SET_PAIR_ORG();
        this.XMLViewerStore.CREATE_NOTIFY_DOWNLOAD_FROM_ORG_MDT(
          this.AppStore.GET_SELECTED_ORG
        );

        this.XMLViewerStore.SET_METADATA_RETRIEVED(
          await window.myAPI.retrieveMetadata({
            org: this.AppStore.GET_SELECTED_ORG,
            mdtName: this.XMLViewerStore.nodeOnModify.name[ "#text" ],
            api: localStorage.getItem("API_VERSION"),
          })
        );
        this.XMLViewerStore.notifyDismissDownloadMDT();
        this.XMLViewerStore.downloadingMDT = false;
      }
    },

    async updatedTypeName()
    {
      if (this.AppStore.selectedOrg != null)
      {
        this.XMLViewerStore.CREATE_NOTIFY_DOWNLOAD_FROM_ORG_MDT(
          this.AppStore.GET_SELECTED_ORG
        );

        if (this.AppStore.GET_SELECTED_ORG != this.AppStore.lastActiveOrg)
        {
          this.XMLViewerStore.lastMetadataRetrievied = null;
          this.AppStore.SET_PAIR_ORG();
        }
        if (
          this.XMLViewerStore.nodeOnModify.name[ "#text" ] !=
          this.XMLViewerStore.lastMetadataRetrievied &&
          this.XMLViewerStore.nodeOnModify.name[ "#text" ] != "CHANGE_ME"
        )
        {
          this.XMLViewerStore.lastMetadataRetrievied =
            this.XMLViewerStore.nodeOnModify.name[ "#text" ];
          this.XMLViewerStore.SET_METADATA_RETRIEVED(
            await window.myAPI.retrieveMetadata({
              org: this.AppStore.GET_SELECTED_ORG,
              mdtName: this.XMLViewerStore.nodeOnModify.name[ "#text" ],
              api: localStorage.getItem("API_VERSION"),
            })
          );
        }
        this.XMLViewerStore.notifyDismissDownloadMDT();

        this.XMLViewerStore.downloadingMDT = false;
      }
    },
    update()
    {
      this.XMLViewerStore.SET_METADATA_RETRIEVED();
    },

    logSelectedMember(value)
    {
      console.log(value);
    },
  },
};
</script>
<style></style>
