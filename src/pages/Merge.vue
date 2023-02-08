<template>
  <q-dialog v-model="XMLViewerStore.GET_DIALOG_MERGE_HIDE">
    <q-card dark class="bg-grey-5" style="width: -webkit-fill-available">
      <q-toolbar>
        <q-icon size="md" name="fa-solid fa-object-group" />

        <q-toolbar-title
          ><span class="text-weight-bold">Merge</span> tool</q-toolbar-title
        >

        <q-btn
          flat
          rounded
          color="red"
          dense
          icon="close"
          v-close-popup
          @click="XMLViewerStore.dialogMerge = false"
        />
      </q-toolbar>

      <q-separator spaced dark />
      <q-card-section>
        <div
          class="col q-pa-md"
          v-if="XMLViewerStore.GET_SELECTED_XML.length < 2"
        >
          Per utilizzare la funzione di Merge devi prima selezionare due o più
          XML
        </div>
        <div class="col q-pa-md" v-else>
          <div
            class="row full-width"
            style="align-items: center; place-content: space-between"
          >
            <div class="col-auto">
              <q-list dark v-for="(el, index) in XMLViewerStore.parsedFile">
                <q-item :key="index" v-if="el.checked">
                  <q-item-section side top>
                    <q-icon name="fa-solid fa-file-code" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label> {{ el.index }} </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-auto">
              <q-icon name="fa-solid fa-arrow-right-long" />
            </div>
            <div class="col-3" style="text-align: center">
              <q-icon name="fa-solid fa-file-code" size="50px" />
              <q-input dense dark placeholder="package" style="margin-top: 5%">
                <template dense v-slot:append>.xml</template>
              </q-input>
            </div>
          </div>
          <q-separator dark spaced />
          <div class="col q-pa-sm">
            <div class="q-gutter-sm">
              <q-checkbox
                dense
                v-model="MergeToolStore.validationXml"
                label="Validazione XML finale"
              />
              <q-checkbox
                dense
                v-model="MergeToolStore.reorderOnFinalXml"
                label="Ordina TYPES nel file finale"
              />
              <q-linear-progress
                style="margin: 5% 0 -5% 0"
                stripe
                rounded
                size="25px"
                :value="MergeToolStore.GET_PROGRESS_BAR_STATUS"
                color="green"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    v-if="MergeToolStore.GET_PROGRESS_BAR_STATUS > 0"
                    color="white"
                    text-color="black"
                    :label="MergeToolStore.GET_LABEL_PROGRESS_BAR_STATUS"
                  />
                </div>
              </q-linear-progress>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator spaced dark />
      <q-card-actions v-if="XMLViewerStore.GET_SELECTED_XML.length > 1">
        <q-space />
        <q-btn
          color="green"
          label="Merge"
          class="full-width"
          :disabled="MergeToolStore.GET_MERGING_IN_PROGRESS"
          @click="MergeToolStore.START_MERGING"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useXMLViewerStore } from "src/stores/xml_viewer";
import { useMergeToolStore } from "src/stores/mergeTool";

export default {
  computed: {},

  setup() {
    const XMLViewerStore = useXMLViewerStore();
    const MergeToolStore = useMergeToolStore();

    return {
      XMLViewerStore,
      MergeToolStore,
    };
  },
};
</script>
<style></style>
