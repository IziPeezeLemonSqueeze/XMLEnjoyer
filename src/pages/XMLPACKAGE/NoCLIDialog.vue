<template>
  <q-dialog
    v-model="AppStore.GET_DIALOG_ACTIVE_BY_CLI_INSTALLED"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="bg-orange text-white">
      <q-card-section>
        <div class="text-h6">ATTENZIONE NESSUNA CLI SF</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Nessuna CLI SF trovata. Prima di poter proseguire, assicurati di aver
        installato la CLI di Salesforce. Per installare la cli, segui questi
        passaggi:
        <br />
        <br />
        1: Installa la CLI usando questo comando nel Prompt dei Comandi di
        Windows
        <q-input dark standout v-model="textCommand" dense="true" readonly>
          <template v-slot:append>
            <q-icon
              @click="copyCommand"
              class="cursor-pointer"
              name="fa-regular fa-copy"
            />
          </template>
        </q-input>
        <br />
        <br />
        2: Dopo che l'installazione è avvenuta, ravvia l'applicazione o
        semplicemente premi <b>CTRL + R</b>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useAppStore } from "src/stores/app";
import { useClipboard, usePermission } from "@vueuse/core";
import { useQuasar, Notify } from "quasar";

export default {
  setup() {
    const $q = useQuasar();
    const AppStore = useAppStore();
    const textCommand = "npm install @salesforce/cli --global";
    const { text, isSupported, copy } = useClipboard();

    return {
      textCommand,
      text,
      isSupported,
      copy,
      Notify,
      AppStore,
    };
  },
  methods: {
    copyCommand() {
      this.copy(this.textCommand);
      Notify.create({
        message: "Comando copiato!",
        color: "green",
        timeout: 3000,
      });
    },
  },
};
</script>
<style></style>
