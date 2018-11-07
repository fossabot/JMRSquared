<template>
  <page>
    <ActionBar></ActionBar>
  
    <GridLayout rows="*,auto" columns="*">
      <StackLayout row="0">
        <Label verticalAlignment="center" textAlignment="center" :text="BusinessID"></Label>
        <component :is="tabs[currentTab].view"></component>
        <ActivityIndicator verticalAlignment="center" :busy="!tabs[currentTab].isLoaded"></ActivityIndicator>
      </StackLayout>
      <SegmentedBar row="1" #tabs borderColor="$blueDarkColor" class="mdi" backgroundColor="transparent" selectedBackgroundColor="#0093a4" v-model="currentTab">
        <SegmentedBarItem v-for="(tab,i) in tabs" :key="i" :class="{'text-dark-blue':i == currentTab}" @tap="currentTab = i" style="font-size:25%" :title="tab.icon | fonticon"></SegmentedBarItem>
      </SegmentedBar>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
import * as Toast from "nativescript-toast";

import BusinessProfile from "./Pages/BusinessProfile.vue";
import BusinessSettings from "./Pages/BusinessSettings.vue";
import BusinessStats from "./Pages/BusinessStats.vue";
import BusinessTransactions from "./Pages/BusinessTransactions.vue";

import * as connectivity from "tns-core-modules/connectivity";
const http = require("http");
export default {
  name: "BusinessHome",
  components: {
    BusinessProfile,
    BusinessSettings,
    BusinessStats,
    BusinessTransactions
  },
  data() {
    return {
      count: 20,
      currentTab: 1,
      business: null,
      isLoaded: false,
      tabs: [
        {
          text: "Notifications",
          icon: "mdi-people",
          view: "BusinessProfile",
          isLoaded: true
        },
        {
          text: "Students",
          icon: "mdi-receipt",
          view: "BusinessTransactions",
          isLoaded: false
        },
        {
          text: "Transactions",
          icon: "mdi-bubble-chart",
          view: "BusinessStats",
          isLoaded: true
        },
        {
          text: "Stats",
          icon: "mdi-settings",
          view: "BusinessSettings",
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
  props: ["businessID"],
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
      } else {
        http
          .getJSON(
            this.$store.state.settings.baseLink +
              "/b/get/" +
              this.$route.params.businessID +
              "/for/" +
              this.$store.state.cache.cachedAdmin._id
          )
          .then(results => {
            this.business = results;
          })
          .catch(err => {
            // this.$feedback.error({
            //   title: "Unable to load your business",
            //   duration: 4000,
            //   message: "Please try again later"
            // });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/variables";
</style>