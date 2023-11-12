<template>
  <div full-width>
    <q-card dark flat>
      <div
        style="
          position: absolute;
          vertical-align: middle;
          top: 10px;
          left: 10px;
          z-index: 10000;
        "
      >
        <q-checkbox
          color="blue-3"
          true-value="XMLPACKAGE"
          :false-value="''"
          :toggle-indeterminate="false"
          v-model="autoLaunch"
        >
          <q-tooltip
            >Apri sempre XML PACKAGE all'avvio, senza passare da questa
            schermata</q-tooltip
          >
        </q-checkbox>
      </div>
      <q-card-section horizontal style="justify-content: center">
        <div>
          <q-badge
            style="position: absolute; top: 10px; right: 10px"
            outline
            rounded
            align="middle"
            color="green"
          >
            STABILE
          </q-badge>
        </div>
        <q-card-section
          class="q-pt-xs"
          style="justify-content: center; text-align: center"
        >
          <div class="text-h5 q-mt-sm q-mb-xs">XML PACKAGE</div>
          <div class="text-caption text-grey">
            Devi creare un package.xml o modificarlo?
            <br />
            Qui potrai creare da zero, modificare e mergiare tutti i package che
            vorrai!
          </div>
        </q-card-section>
      </q-card-section>

      <q-card-actions style="justify-content: center">
        <q-btn
          color="blue-3"
          push
          style="width: 125px"
          @click="choiceApp('XMLPACKAGE')"
        >
          APRI
        </q-btn>
        <div
          style="
            position: absolute;
            vertical-align: middle;
            bottom: 45%;
            right: 20%;
          "
        >
          <!--   <q-badge outline align="middle" color="green">
            Lavoro in corso presente
          </q-badge>
          <q-btn size="xs" icon="fa-solid fa-arrows-rotate" color="green" flat>
            <q-tooltip> Elimina e resetta il lavoro in corso </q-tooltip></q-btn
          > -->
        </div>
      </q-card-actions>
    </q-card>

    <q-separator dark style="margin-top: 1%; margin-bottom: 1%" />

    <q-card :disabled="true" dark flat>
      <div
        style="
          position: absolute;
          vertical-align: middle;
          top: 10px;
          left: 10px;
          z-index: 10000;
        "
      >
        <q-checkbox
          :disable="true"
          color="blue-3"
          true-value="XMLMERGE"
          :false-value="''"
          v-model="autoLaunch"
        >
          <q-tooltip
            >Apri sempre XML MERGE all'avvio, senza passare da questa
            schermata</q-tooltip
          >
        </q-checkbox>
      </div>
      <q-card-section horizontal style="justify-content: center">
        <div>
          <q-badge
            style="
              vertical-align: middle;
              position: absolute;
              top: 10px;
              right: 10px;
            "
            outline
            rounded
            align="middle"
            color="orange"
          >
            EXPERIMENTAL
          </q-badge>
        </div>
        <q-card-section
          class="q-pt-xs"
          style="justify-content: center; text-align: center"
        >
          <div class="text-h5 q-mt-sm q-mb-xs">XML MERGE</div>
          <div class="text-caption text-grey">
            Devi mergiare o controllare Profile xml?
          </div>
        </q-card-section>
      </q-card-section>

      <q-card-actions style="justify-content: center">
        <q-btn
          :disabled="true"
          color="blue-3"
          push
          style="width: 125px"
          @click="choiceApp('XMLMERGE')"
        >
          APRI
        </q-btn>
        <div
          style="
            position: absolute;
            vertical-align: middle;
            bottom: 45%;
            right: 20%;
          "
        >
          <!--   <q-badge outline align="middle" color="green">
            Lavoro in corso presente
          </q-badge>
          <q-btn size="xs" icon="fa-solid fa-arrows-rotate" color="green" flat>
            <q-tooltip> Elimina e resetta il lavoro in corso </q-tooltip></q-btn
          > -->
        </div>
      </q-card-actions>
    </q-card>
    <div
      style="position: fixed; vertical-align: middle; bottom: 10px; right: 10px"
    >
      <q-btn
        size="sm"
        label="CONTROLLA AGGIORNAMENTI"
        dense
        outline
        color="primary"
      />
    </div>
    <div
      style="position: fixed; vertical-align: middle; bottom: 10px; left: 10px"
    >
      <q-badge outline align="middle" color="green">
        Versione attuale: 0.9.1
      </q-badge>
    </div>
  </div>
</template>
<script>
import { useAppStore } from "src/stores/app";

export default {
  setup() {
    const appStore = useAppStore();

    return {
      appStore,
    };
  },
  mounted() {
    this.appStore.autoLaunchApp = localStorage.getItem("AUTO_LAUNCH");
    if (this.appStore.firstLaunch) {
      this.appStore.firstLaunch = false;
      if (this.appStore.autoLaunchApp) {
        this.appStore.appChoiced = true;
        this.appStore.appActive = this.appStore.autoLaunchApp;
      }
    }
  },
  computed: {
    autoLaunch: {
      get() {
        return this.appStore.autoLaunchApp;
      },
      set(value) {
        if (this.appStore.getAutoLaunch != value) {
          localStorage.setItem("AUTO_LAUNCH", value);
          this.appStore.autoLaunchApp = value;
        }
      },
    },
  },
  methods: {
    choiceApp(value) {
      localStorage.setItem("AUTO_LAUNCH", value);
      this.appStore.appChoiced = true;
      this.appStore.appActive = value;
    },
  },
};
</script>
<style></style>
