<template>
  <q-dialog v-model="XMLViewerStore.GET_DIALOG_MODIFY_TYPE_HIDE">
    <q-card
      dark
      class="bg-grey-4 text-black"
      style="width: -webkit-fill-available"
    >
      <q-toolbar>
        <q-icon size="md" name="fa-solid fa-object-group" />

        <q-toolbar-title
          ><span class="text-weight-bold">Modify</span> types</q-toolbar-title
        >
        <q-btn
          flat
          rounded
          color="red"
          dense
          icon="close"
          v-close-popup
          @click="XMLViewerStore.dialogModifyType = false"
        />
      </q-toolbar>
      <q-separator spaced dark />
      <div class="row full-width" style="place-content: center">
        <q-btn
          dense
          flat
          rounded
          label="Members "
          icon="fa-solid fa-circle-plus"
          @click="XMLViewerStore.ADD_TYPE_FROM_ONMODIFY"
        />
        <q-btn
          dense
          flat
          label="ORDINA"
          rounded
          icon="fa-solid fa-arrow-down-a-z"
          @click="XMLViewerStore.SORT_TYPES_FROM_ONMODIFY"
        />
      </div>
      <q-card-section>
        <q-list
          bordered
          separator
          v-for="(el, index) in XMLViewerStore.nodeOnModify.members"
        >
          <q-item clickable v-ripple :key="index">
            <q-item-section side top>
              <q-btn
                dense
                color="red"
                icon="fa-solid fa-trash"
                @click="XMLViewerStore.DELETE_TYPE_FROM_ONMODIFY(index)"
              />
            </q-item-section>
            <q-item-section>
              <q-popup-edit
                buttons
                style="width: 20%"
                v-model="XMLViewerStore.nodeOnModify.members[index]['#text']"
                auto-save
                v-slot="scope"
              >
                <!--   <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  debounce="10"
                  @keyup.enter="scope.set"
                  @update="filterFn"
                ></q-input> -->
                <q-select
                  filled
                  v-model="el['#text']"
                  use-input
                  hide-selected
                  fill-input
                  :loading="options.length > 0 ? false : true"
                  input-debounce="100"
                  :options="options"
                  @filter="filterFn"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-popup-edit>

              <q-item-label>{{ el["#text"] }} </q-item-label>
              <q-item-label caption>MEMBER</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-item-label style="margin-top: 4%">
          <q-popup-edit
            buttons
            style="width: 20%"
            v-model="XMLViewerStore.nodeOnModify.name['#text']"
            auto-save
            v-slot="scope"
          >
            <q-input
              v-model="scope.value"
              dense
              autofocus
              counter
              @keyup.enter="scope.set"
            />
          </q-popup-edit>
          {{ XMLViewerStore.nodeOnModify.name["#text"] }}
        </q-item-label>
        <q-item-label caption>NAME</q-item-label>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script>
import { useXMLViewerStore } from "src/stores/xml_viewer";
import { ref } from "vue";
export default {
  computed: {},

  setup() {
    const XMLViewerStore = useXMLViewerStore();
    const options = ref(XMLViewerStore.metadataRetrieved);
    return {
      XMLViewerStore,
      options,

      filterFn(val, update, abort) {
        update(() => {
          const needle = val.toLowerCase();
          options.value = XMLViewerStore.metadataRetrieved.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1
          );
        });
      },
    };
  },
  methods: {},
  update() {
    this.XMLViewerStore.SET_METADATA_RETRIEVED();
  },
};
</script>
<style></style>
