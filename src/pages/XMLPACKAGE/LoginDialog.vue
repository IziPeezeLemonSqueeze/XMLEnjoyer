<template>
  <q-dialog v-model="AppStore.GET_DIALOG_LOGIN">
    <q-card
      v-if="AppStore.dialogLoginFirstStep"
      dark
      class="bg-blue-4 text-white"
      style="width: -webkit-fill-available"
    >
      <q-toolbar>
        <q-icon size="md" name="fa-solid fa-right-to-bracket" />

        <q-toolbar-title
          ><span class="text-weight-bold">AUTHORIZE</span> new
          ORG</q-toolbar-title
        >
        <q-btn
          flat
          rounded
          color="red"
          dense
          icon="close"
          v-close-popup
          @click="AppStore.dialogLogin = false"
        />
      </q-toolbar>
      <q-separator spaced dark />
      <div
        class="row full-width"
        style="place-content: center; align-items: center"
      >
        <q-input v-model="AppStore.alias" dark label="ALIAS" />

        <q-option-group
          v-model="AppStore.selectedLoginUrl"
          :options="AppStore.optionLoginUrl"
          color="primary"
          inline
        />
      </div>
      <q-card-actions>
        <q-btn
          :disable="
            AppStore.alias.length < 1 || AppStore.selectedLoginUrl == ''
          "
          flat
          label="LOGIN"
          dark
          class="full-width text-white"
          style="margin-top: 5%"
          @click="login"
        />
      </q-card-actions>
    </q-card>
    <!-- ------------------------------------------------------------ -->
    <q-card
      v-else
      dark
      class="bg-blue-4 text-white"
      style="width: -webkit-fill-available"
    >
      <q-toolbar>
        <q-icon size="md" name="fa-solid fa-right-to-bracket" />

        <q-toolbar-title
          ><span class="text-weight-bold">AUTHORIZE</span> new
          ORG</q-toolbar-title
        >
      </q-toolbar>
      <q-separator spaced dark />
      <div
        class="row full-width"
        style="place-content: center; align-items: center"
      >
        <q-spinner-grid color="primary" size="10em" />
      </div>
      <q-card-actions>
        <q-btn
          flat
          label="ABORT LOGIN"
          class="full-width"
          style="margin-top: 5%"
          @click="abort"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { useAppStore } from "src/stores/app";

export default {
  setup() {
    const AppStore = useAppStore();

    return {
      AppStore,
    };
  },
  methods: {
    async login() {
      this.AppStore.dialogLoginFirstStep = false;

      const loginResult = await window.myAPI.loginOrg({
        alias: this.AppStore.alias,
        url: this.AppStore.selectedLoginUrl,
      });
      //console.log(loginResult);
      if (loginResult.status == 0) {
        const orgAuthActive = await window.myAPI.getAuthList();

        this.AppStore.UPDATE_AUTHORIZED_ORGS(orgAuthActive);
      } else {
        //console.log("LOGIN NOT 0", loginResult);
      }

      this.AppStore.alias = "";
      this.AppStore.dialogLogin = false;
    },

    abort() {
      this.AppStore.dialogLoginFirstStep = true;
      this.AppStore.dialogLogin = false;

      // window.myAPI.interruptLogin();
    },
  },
  mounted() {
    this.AppStore.dialogLoginFirstStep = true;
  },
};
</script>
<style></style>
