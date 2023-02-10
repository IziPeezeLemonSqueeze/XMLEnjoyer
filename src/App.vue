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
        <q-btn dense flat icon="minimize" @click="minimizeApp" />
        <q-btn dense flat icon="crop_square" @click="maximizeApp" />
        <q-btn dense flat icon="close" @click="quitApp" />
        <q-separator dark spaced vertical />
        <q-btn
          dense
          flat
          round
          icon="fa-solid fa-gear"
          @click="toggleRightDrawer"
        />
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

        <XMLViewer />
        <MergeVue />
        <EditType />
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
  mounted() {
    this.xmlStore.$q = useQuasar();
    this.xmlStore.Notify = Notify;
  },
  components: {
    XMLViewer,
    MergeVue,
    EditType,
  },
  methods: {
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
