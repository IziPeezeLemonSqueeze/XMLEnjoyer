<template>
  <q-dialog v-model="XMLViewerStore.GET_DIALOG_TEST_JSON_HIDE" persistent>
    <q-card dark class="bg-orange-5" style="width: -webkit-fill-available">
      <q-toolbar>
        <q-icon size="md" name="fa-solid fa-flask-vial" />

        <q-toolbar-title
          ><span class="text-weight-bold">JSON</span> classi di
          test</q-toolbar-title
        >
        <q-btn
          flat
          rounded
          color="red"
          dense
          icon="close"
          v-close-popup
          @click="closeJsonTest"
        />
      </q-toolbar>
      <q-separator spaced dark />
      <q-card-section>
        <q-input
          type="textarea"
          standout
          dark
          v-model="JsonTestStore.bodyJson"
          readonly
        >
          <template v-slot:after>
            <q-btn
              color="orange-5"
              text-color="white"
              style="height: -webkit-fill-available"
              push
              dense
              icon="fa-solid fa-copy"
              @click="copyJson"
            />
          </template>
        </q-input>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { useXMLViewerStore } from "src/stores/xml_viewer";
import { useTestJson } from "src/stores/testJson";

import { useQuasar, Notify } from "quasar";
import { useClipboard, usePermission } from "@vueuse/core";

export default {
  computed: {},

  setup() {
    const XMLViewerStore = useXMLViewerStore();
    const JsonTestStore = useTestJson();

    const $q = useQuasar();
    const { text, isSupported, copy } = useClipboard();

    return {
      XMLViewerStore,
      JsonTestStore,
      copy,
      Notify,
    };
  },
  methods: {
    closeJsonTest() {
      this.XMLViewerStore.dialogJsonTest = false;
    },

    copyJson() {
      this.copy(this.JsonTestStore.bodyJson);
      Notify.create({
        message: "JSON copiato!",
        color: "orange",
        timeout: 3000,
      });
    },
  },
};
</script>
<style></style>
