<template>
  <page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout rows="auto" columns="*,auto" orientation="horizontal">
        <Label col="0" class="m-l-25 font-weight-bold" verticalAlignment="center" text="Home"></Label>
        <Ripple v-show="$router.current.userAuthLevel() > 0" class="p-x-15" @tap="logOut()" verticalAlignment="center" col="2" height="100%" borderRadius="50%">
          <Label verticalAlignment="center" text="Log out"></Label>
        </Ripple>
      </GridLayout>
    </ActionBar>
    <FlexboxLayout justifyContent="space-between" width="100%" height="100%" flexDirection="column">
      <FlexboxLayout justifyContent="flex-start" flexDirection="column">
        <label :text="introTxt" textWrap="true" class="body p-t-30 p-l-15 p-r-15" textAlignment="center"></label>
      </FlexboxLayout>
      <FlexboxLayout flexDirection="column">
        <GridLayout columns="auto" rows="auto" justifyContent="center">
          <Image src="res://jmrlogo" row="0" col="0" width="100%" alignSelf="center" stretch="aspectFit" />
        </GridLayout>
      </FlexboxLayout>
      <FlexboxLayout justifyContent="flex-end" flexDirection="column">
        <GridLayout rows="auto" columns="*" textAlginment="center">
          <Button backgroundColor="transparent" width="50%" selfAlign="center" @tap="$router.push('/explore')" textAlignment="center" borderWidth="5px" borderColor="#0093a4" text="Explore"></Button>
        </GridLayout>
        <GridLayout v-show="$router.current.userAuthLevel() <= 0" justifyContent="flex-end" columns="*" rows="*" height="70">
          <Button @tap="navigate('/login')" row="0" text="Login"></Button>
        </GridLayout>
        <GridLayout v-show="$router.current.userAuthLevel() > 0" justifyContent="flex-end" columns="*" rows="*" height="70">
          <ActivityIndicator :busy="isLoading"></ActivityIndicator>
          <Button v-show="!isLoading" @tap="loadData($router.current.userAuthLevel())" text="My Dashboard"></Button>
        </GridLayout>
      </FlexboxLayout>
    </FlexboxLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
const http = require("http");

var appSettings = require("application-settings");

import * as connectivity from "tns-core-modules/connectivity";
export default {
  data() {
    return {
      introTxt:
        "JMRSquared is a company that deals with blah blah blah blah ......"
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
        appSettings: appSettings,
        doc: "admin"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
