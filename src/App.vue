<template>
  <q-layout view="hHh lpR lff">
    <q-header reveal elevated class="bg-grey-6 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <q-icon name="fa-solid fa-file-code" size="30px" />
          </q-avatar>
          {{ '<?XML Enjoyer @Salesforce version="0.1a" ?>' }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container class="bg-grey-10 full-width">
      <q-page class="row full-width">
        <div
          class="col-5 q-pa-md text-white"
          style="max-width: 250px; min-width: auto; border-color: green"
        >
          HISTORY XML
          <q-separator spaced dark />

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
        </div>
        <q-separator vertical dark />
        <div class="col full-width">
          <XMLViewer />
          <MergeVue />
          <EditType />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import { useAppStore } from "src/stores/app";
import { useHistoryStore } from "./stores/history";
import { useXMLViewerStore } from "./stores/xml_viewer";

import XMLViewer from "./pages/XMLViewer.vue";
import MergeVue from "./pages/Merge.vue";
import EditType from "./pages/EditType.vue";

export default defineComponent({
  name: "App",
  setup() {
    const appStore = useAppStore();
    const historyStore = useHistoryStore();
    const xmlStore = useXMLViewerStore();
    return {
      appStore,
      historyStore,
      xmlStore,
    };
  },
  components: {
    XMLViewer,
    MergeVue,
    EditType,
  },
});
</script>
