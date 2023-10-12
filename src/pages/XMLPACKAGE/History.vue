<template>
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
</template>
<script>
import { useXMLViewerStore } from "../../stores/xml_viewer";
import { useHistoryStore } from "../../stores/history";

export default {
  setup() {
    const xmlStore = useXMLViewerStore();
    const historyStore = useHistoryStore();

    return {
      xmlStore,
      historyStore,
    };
  },
};
</script>
<style></style>
