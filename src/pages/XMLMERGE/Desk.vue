<template>
  <div class="row full-width full-height unselectable">
    <div class="col-4">
      <q-file
        borderless
        type="file"
        dark
        dense
        color="white"
        v-model="fileRed"
        label="Carica/Trascina File XML"
        accept=".xml"
        style="margin-left: 2%; margin-top: 1%; min-width: 300px"
      >
        <template v-slot:before>
          <q-icon name="fa-solid fa-file-circle-plus" />
        </template>
      </q-file>
      <q-separator dark spaced />
      <q-scroll-area dark style="height: 85%">
        <q-list dense dark padding class="rounded-borders" separator>
          <div v-for="(item, index) in DeskStore.parsedFile" :key="index">
            <div v-if="item.side == 'RED'" :key="indexElement">
              <div
                v-for="(k, idx) in Object.keys(item.parsed['Profile'])"
                :key="idx"
              >
                <q-expansion-item>
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-avatar
                        icon="fa-solid fa-tag"
                        color="blue-3"
                        text-color="white"
                      />
                    </q-item-section>

                    <q-item-section> {{ k }} </q-item-section>

                    <q-item-section side>
                      <div class="row items-center">
                        <q-icon name="star" color="red" size="24px" />
                        <q-icon name="star" color="red" size="24px" />
                        <q-icon name="star" color="red" size="24px" />
                      </div>
                    </q-item-section>
                  </template>
                  <q-slide-item
                    dense
                    @left="onLeft"
                    left-color="red-5"
                    v-for="(line, indexLine) in item.parsed['Profile'][k]"
                    :key="indexLine"
                    dark
                  >
                    <template v-slot:left class="full-width">
                      <q-btn right dense flat icon="fa-solid fa-circle-xmark" />
                      {{ indexLine }} {{ line }}
                    </template>
                    <q-item
                      dark
                      class="text-red"
                      clickable
                      v-ripple
                      style=" <!-- margin-left: 10% -->"
                    >
                      <q-item-section
                        >{{ indexLine }} {{ line }}</q-item-section
                      >
                    </q-item>
                  </q-slide-item>
                </q-expansion-item>
              </div>
            </div>
          </div>
        </q-list>
      </q-scroll-area>
    </div>

    <q-separator dark vertical />

    <div class="col">
      <div class="row" style="place-content: space-between">
        <q-btn
          flat
          color="green"
          icon-right="fa-solid fa-arrow-right"
          style="margin-top: 1.7%"
        />
        <q-btn
          flat
          color="green"
          icon="fa-solid fa-link"
          style="margin-top: 1.7%"
        />
        <q-btn
          flat
          color="green"
          icon="fa-solid fa-save"
          style="margin-top: 1.7%"
        />
        <q-btn
          flat
          color="green"
          icon="fa-solid fa-trash"
          style="margin-top: 1.7%"
        />
        <q-btn
          flat
          color="green"
          icon="fa-solid fa-arrow-left"
          style="margin-top: 1.7%"
        />
      </div>
      <q-separator dark spaced />
      <q-scroll-area dark style="height: 85%">
        <q-list dense dark padding class="rounded-borders">
          <q-item
            class="text-white"
            clickable
            v-ripple
            v-for="n in 100"
            :key="n"
            style="margin-top: 0.5%; margin-bottom: 0.5%; <!-- margin-left: 10% -->"
          >
            <q-item-section> {{ n }} </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>

    <q-separator dark vertical />

    <div class="col-4">
      <div class="row">
        <q-file
          borderless
          type="file"
          dark
          dense
          color="white"
          v-model="fileGreen"
          label="Carica/Trascina File XML"
          accept=".xml"
          style="margin-left: 2%; margin-top: 1%; min-width: 300px"
        >
          <template v-slot:before>
            <q-icon name="fa-solid fa-file-circle-plus" />
          </template>
        </q-file>
        <q-space />
        <q-btn
          label="carica da org"
          flat
          dark
          color="blue-3"
          style="margin-top: 1%; margin-right: 1%"
        />
      </div>
      <q-separator dark spaced />
      <q-scroll-area dark style="height: 85%">
        <q-list dense dark padding class="rounded-borders">
          <q-item
            class="text-green"
            clickable
            v-ripple
            v-for="n in 100"
            :key="n"
            style="margin-top: 0.5%; margin-bottom: 0.5%; <!-- margin-left: 10% -->"
          >
            <q-item-section> {{ n }} </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </div>
  </div>
</template>
<script>
import { useDeskStore } from "../../stores/desk";

export default {
  setup() {
    const DeskStore = useDeskStore();

    return {
      DeskStore,
    };
  },

  computed: {
    fileRed: {
      get() {},
      set(data) {
        this.DeskStore.SET_FILE(data, "RED");
      },
    },
    fileGreen: {
      get() {},
      set(data) {
        this.DeskStore.SET_FILE(data, "GREEN");
      },
    },
  },
};
</script>
<style>
.unselectable {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
