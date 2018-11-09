<template>
  <page actionBarHidden="true">
      <GridLayout v-if="business" rows="*,auto" columns="*">
       <component row="0" :business="business" :is="tabs[currentTab].view"></component>
      <SegmentedBar v-show="business" :class="{'visible':business}" row="1" #tabs borderColor="$blueDarkColor" class="mdi businessIcon" backgroundColor="transparent" selectedBackgroundColor="#0093a4" v-model="currentTab">
        <SegmentedBarItem v-for="(tab,i) in tabs" :key="i" :class="{'text-dark-blue':i == currentTab}" @tap="currentTab = i" style="font-size:25%" :title="tab.icon | fonticon"></SegmentedBarItem>
      </SegmentedBar>
    </GridLayout>
    <GridLayout v-show="!business" rows="*" columns="*">
       <ActivityIndicator v-if="!business" verticalAlignment="center" textAlignment="center" :busy="!business"></ActivityIndicator>
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
      currentTab: 0,
      business: null,
      isLoaded: false,
      tabs: [
        {
          text: "Notifications",
          icon: "mdi-home",
          view: "BusinessProfile"
        },
        {
          text: "Students",
          icon: "mdi-receipt",
          view: "BusinessTransactions"
        },
        {
          text: "Transactions",
          icon: "mdi-bubble-chart",
          view: "BusinessStats"
        },
        {
          text: "Stats",
          icon: "mdi-settings",
          view: "BusinessSettings"
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
            this.tabs[0].icon = 'mdi-'+ this.business.type.icon;
            this.$forceUpdate();
            })
          .catch(err => {
            this.$feedback.error({
              title: "Unable to load your business",
              duration: 4000,
              message: "Please try again later"
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/variables";
.businessIcon {
  &.visible {
    animation-name: show;
    animation-duration: 1s;
    animation-fill-mode: forwards;
  }
  @keyframes show {
    from {
      transform: scale(4);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
}
</style>