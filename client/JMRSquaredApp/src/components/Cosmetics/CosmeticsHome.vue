<template>
  <page @loaded="pageLoaded">
    <ActionBar>
      <GridLayout rows="auto" columns="auto,*,auto,auto" orientation="horizontal">
        <Ripple class="p-10" @tap="$router.back()" verticalAlignment="center" col="0" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-arrow-back' | fonticon"></Label>
        </Ripple>
        <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" :text="tabs[currentTab].text"></Label>
        <Ripple class="p-10" @tap="reportBug()" verticalAlignment="center" col="2" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
        </Ripple>
        <Ripple class="p-10" @tap="toggleSearch = !toggleSearch" verticalAlignment="center" col="3" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-search' | fonticon"></Label>
        </Ripple>
      </GridLayout>
    </ActionBar>
  
    <GridLayout rows="*" columns="*">
      <StackLayout row="0">
        <component :is="tabs[currentTab].view"></component>
        <ActivityIndicator verticalAlignment="center" :busy="!tabs[currentTab].isLoaded"></ActivityIndicator>
      </StackLayout>
  </GridLayout>
</page>
</template>

<script>
const dialogs = require("ui/dialogs");
import * as Toast from "nativescript-toast";

import Transactions from "./CosmeticsTransactions.vue";
import Stats from "../Admin/Fulham/Stats.vue";

import * as connectivity from "tns-core-modules/connectivity";
export default {
  name: "CosmeticsHomeVue",
  components: {
    Transactions,
    Stats
  },
  data() {
    return {
      count: 20,
      currentTab: 0,
      isLoaded: false,
      tabs: [
        {
          text: "Transactions",
          icon: "mdi-attach-money",
          view: "Transactions",
          isLoaded: false
        },
        {
          text: "Stats",
          icon: "mdi-equalizer",
          view: "Stats",
          isLoaded: true
        }
      ]
    };
  },
  created() {
    if (!this.isLoaded) {
      this.pageLoaded();
    }
  },
  mounted() {
    if (!this.isLoaded) {
      this.pageLoaded();
    }
  },
  methods: {
    pageLoaded() {
      var connectionType = connectivity.getConnectionType();
      if (connectionType == connectivity.connectionType.none) {
        this.$feedback.warning({
          title: "NO INTERNET CONNECTION",
          duration: 4000,
          message: "Data loaded is not recent."
        });
        this.isLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/variables";
</style>