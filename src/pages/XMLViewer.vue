<template>
  <q-page>
    <div class="col q-pa-md full-width">
      <div class="row q-ma-md">
        <q-file
          dark
          color="white"
          style="max-width: 300px"
          v-model="file"
          outlined
          label="Carica File XML"
          accept=".xml"
          :disable="XMLViewerStore.parsedFile.length >= 10"
        />
        <q-item-label class="text-white q-pa-sm" style="align-self: center">
          XML attivi :
          {{ XMLViewerStore.parsedFile.length + "/ 10" }}
        </q-item-label>
        <q-space />
        <q-btn
          dark
          class="text-white"
          size="md"
          color="green-6"
          icon="fa-solid fa-file-export"
        />
        <q-separator vertical dark spaced />
        <q-btn
          dark
          class="text-white"
          size="md"
          color="green-6"
          icon="fa-solid fa-object-group"
        />
        <q-separator vertical dark spaced />
        <q-btn
          dark
          color="green-6"
          class="text-white"
          size="md"
          icon="fa-solid fa-clone"
        />
        <q-separator vertical dark spaced />
        <q-btn
          dark
          color="green-6"
          class="text-white"
          size="md"
          icon="fa-solid fa-certificate"
        />
      </div>
      <q-separator dark />
      <q-scroll-area horizontal style="height: 720px" class="full-width">
        <div class="row no-wrap q-pa-sm text-pre-wrap" style="height: 760px">
          <draggable
            class="row no-wrap dropArea"
            :list="XMLViewerStore.parsedFile"
            @change="log"
            animation="300"
            easing="cubic-bezier(1, 0, 0, 1)"
          >
            <div
              style="min-width: 300px"
              v-for="(item, index) in XMLViewerStore.parsedFile"
              :key="index"
            >
              <q-list
                bordered
                padding
                style="min-width: 300px; border-radius: 10px"
                :class="
                  item.hover
                    ? item.parsed['Package']['@_xmlns']
                      ? item.parsed['Package']['@_xmlns'].includes('sforce')
                        ? 'bg-blue-3 q-pa-sm q-ma-sm shadow-20 card-hover '
                        : 'bg-grey-5 q-pa-sm q-ma-sm card-hover shadow-20'
                      : 'bg-grey-5 q-pa-sm q-ma-sm card-hover shadow-20'
                    : item.parsed['Package']['@_xmlns']
                    ? item.parsed['Package']['@_xmlns'].includes('sforce')
                      ? 'bg-blue-3 q-pa-sm q-ma-sm shadow-20'
                      : 'bg-grey-5 q-pa-sm q-ma-sm shadow-20'
                    : 'bg-grey-5 q-pa-sm q-ma-sm shadow-20'
                "
              >
                <q-item-section>
                  <q-bar style="border-radius: 10px 10px 0 0">
                    <div class="cursor-pointer">
                      <q-checkbox v-model="item.checked" />
                    </div>
                    <div>
                      <q-popup-edit
                        v-model="item.index"
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
                      {{ item.index }}
                    </div>
                    <q-space />
                    <q-btn
                      dense
                      flat
                      icon="close"
                      @click="item.closing = true"
                    />
                  </q-bar>

                  <q-banner
                    v-if="item.closing"
                    dense
                    inline-actions
                    class="text-white bg-red"
                  >
                    Chiudi?
                    <template v-slot:action>
                      <q-btn
                        flat
                        color="white"
                        label="Si"
                        @click="closeList(index)"
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
                    style="background-color: #9dcdf4; text-align-last: center"
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
                      style="overflow-wrap: break-word; text-align-last: left"
                    >
                      Nome File:
                      <strong>
                        {{ item.nameFile ? item.nameFile : null }}</strong
                      >
                      <br />
                      Path:
                      <strong>
                        {{ item.pathFile ? item.pathFile : null }}</strong
                      >
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
                    border-radius: 0 0 10px 10px;
                    justify-content: space-evenly;
                  "
                >
                  <q-btn
                    dense
                    flat
                    rounded
                    label="Aggiungi <Types/>"
                    icon="fa-solid fa-circle-plus"
                  />
                  <q-btn dense flat rounded icon="fa-solid fa-arrow-down-a-z" />
                  <q-btn dense flat rounded icon="fa-solid fa-arrow-down-z-a" />
                </q-bar>
                <q-scroll-area style="height: 500px">
                  <draggable
                    class="dragArea list-group w-full"
                    :list="item.nodes"
                    animation="300"
                    easing="cubic-bezier(1, 0, 0, 1)"
                    @change="log"
                  >
                    <q-item
                      tag="div"
                      v-for="(el, idxEl) in item.nodes"
                      :key="idxEl"
                      clickable="false"
                      focused="false"
                      manual-focus="true"
                    >
                      <q-btn icon="fa-solid fa-trash-can" dense flat size="xs">
                        <q-popup-edit
                          position="cover"
                          v-slot="scope"
                          class="q-pa-md bg-green-8"
                        >
                          <div class="col q-ma-sx text-center text-white">
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
                                @click="
                                  XMLViewerStore.REMOVE_NODE(index, idxEl);
                                  scope.cancel();
                                "
                              />
                              <q-space />
                              <q-btn
                                outline
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
                      <q-item-section>
                        <div
                          class="list-group-item bg-gray-300 m-1 p-3 rounded-md text-left q-ma-md"
                          style="max-width: 250px; font-size: 11px"
                        >
                          <div>
                            MEMBERS:
                            <strong>{{
                              JSON.parse(el.members)["#text"]
                            }}</strong>
                          </div>
                          <div>
                            NAME:
                            <strong> {{ JSON.parse(el.name)["#text"] }}</strong>
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
    </div>
  </q-page>
</template>
<script>
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { useXMLViewerStore } from "src/stores/xml_viewer";
import { VueDraggableNext } from "vue-draggable-next";
export default {
  name: "XMLVIEWER",
  computed: {
    file: {
      get() {},
      set(data) {
        console.log(data);
        this.XMLViewerStore.SET_FILE(data);
      },
    },
  },
  mounted() {
    this.XMLViewerStore.$subscribe((mutation, state) => {
      switch (mutation.events.key) {
        case "parsedFile":
          console.log(mutation.events.newValue);

          break;
      }
    });
  },
  methods: {},
  setup() {
    let xmlText = null;
    const XMLViewerStore = useXMLViewerStore();

    return {
      xmlText,
      XMLViewerStore,
    };
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
</style>
