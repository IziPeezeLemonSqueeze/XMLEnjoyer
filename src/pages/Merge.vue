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
          @click="closeMergingTool"
        />
      </q-toolbar>

      <q-separator spaced dark />
      <q-card-section>
        <div class="col q-pa-md">
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
            <div
              class="col-auto"
              v-if="MergeToolStore.GET_LABEL_PROGRESS_BAR_STATUS != 'COMPLETE'"
            >
              <q-icon name="fa-solid fa-arrow-right-long" />
            </div>
            <div
              class="col-3"
              style="text-align: center"
              v-if="MergeToolStore.GET_LABEL_PROGRESS_BAR_STATUS != 'COMPLETE'"
            >
              <q-icon name="fa-solid fa-file-code" size="50px" />
              <q-label>package.xml</q-label>
            </div>
          </div>
          <q-separator dark spaced />
          <div class="col q-pa-sm">
            <div class="q-gutter-sm">
              <q-linear-progress
                style="margin: 5% 0 -5% 0"
                stripe
                rounded
                size="25px"
                :indeterminate="MergeToolStore.GET_PROGRESS_BAR_STATUS"
                color="green"
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
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
      <q-card-actions>
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
  methods: {
    closeMergingTool() {
      this.XMLViewerStore.dialogMerge = false;
      this.MergeToolStore.labelProgress = "IN ATTESA";
      this.MergeToolStore.progress = false;
      this.MergeToolStore.merging = false;
    },
  },
};
</script>
<style></style>
