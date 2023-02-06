<template>
  <q-dialog
    v-model="XMLViewerStore.GET_DIALOG_MERGE_HIDE"
    class="q-pa-md q-gutter-sm"
  >
    <q-card dark class="bg-grey-6">
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
        <div class="col q-pa-md" v-else-if="loading"></div>
        <div class="col q-pa-md" v-else>
          <q-checkbox label="Mantieni aperti XML originali" />
          <q-checkbox label="Riordina i TYPES" />
          <q-checkbox label="Riordina i MEMBERS" />
          <q-input dense dark placeholder="package" style="margin-top: 5%">
            <template v-slot:append> .xml </template>
          </q-input>
        </div>
      </q-card-section>
      <q-separator spaced dark />
      <q-card-actions v-if="XMLViewerStore.GET_SELECTED_XML.length > 1">
        <q-space />
        <q-btn color="green" label="Merge" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useXMLViewerStore } from "src/stores/xml_viewer";

export default {
  computed: {},

  setup() {
    const XMLViewerStore = useXMLViewerStore();

    return {
      XMLViewerStore,
    };
  },
};
</script>
<style></style>
