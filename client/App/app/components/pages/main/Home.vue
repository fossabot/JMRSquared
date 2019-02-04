<template>
  <page class="backgroundImage" actionBarHidden="true" @loaded="pageLoaded()">
    <GridLayout class="backgroundImageOverlay" rows="auto,*,auto,auto" columns="*,auto">
      <label colSpan="2" :text="introTxt" fontSize="18" :textWrap="true" class="p-20 text-white bg-dark-blue-overlay topMainText" textAlignment="center"></label>
      <Image row="2" col="1" src="res://jmrlogo" alignSelf="center" stretch="aspectFill" />
      <Button row="3" colSpan="2" class="bg-dark-blue p-15 text-white" fontSize="18" @tap="navigate('/login')" text="Login"></Button>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
var appSettings = require("application-settings");

import * as connectivity from "tns-core-modules/connectivity";
export default {
  data() {
    return {
      introTxt: "Digitalize your business and keep track of all your earnings."
    };
  },
  created() {
    this.pageLoaded();
  },
  mounted() {
    this.pageLoaded();
  },
  methods: {
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: appSettings,
        doc: "admin"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.topMainText {
  color: white;
  background-color: linear-gradient(
    top bottom,
    rgba(255, 0, 0, 0.5),
    rgba(255, 20, 0, 0.7),
    rgba(255, 0, 30, 0.5),
    rgba(255, 20, 30, 0.7)
  );
}

.backgroundImage {
  background: url("~/assets/images/suit77_black_white.jpeg") no-repeat center
    center;
  background-size: cover;
  padding-top: 3%;
  padding-bottom: 3%;
}

.backgroundImageOverlay {
  background-color: rgba(0, 0, 0, 0.3);
  z-index: -1;
}

.bg-dark-blue-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
