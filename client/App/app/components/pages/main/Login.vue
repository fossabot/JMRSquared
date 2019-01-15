<template>
  <page actionBarHidden="true" @loaded="pageLoaded()">
    <GridLayout rows="auto,*">
      <CardView class="m-b-5" row="0" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
        <GridLayout class="bg-dark-blue p-y-15 p-5" rows="auto" columns="auto,*,auto">
          <Ripple rowSpan="2" @tap="navigate('/home')" verticalAlignment="center" borderRadius="50%">
            <Label verticalAlignment="center" textAlignment="center" class="mdi text-white" fontSize="25%" :text="'mdi-home' | fonticon"></Label>
          </Ripple>
          <Ripple row="0" rowSpan="2" col="2" verticalAlignment="center" class="p-20 m-x-20 font-weight-bold" @tap="isEnterEmail = !isEnterEmail">
            <Label class="text-white" verticalAlignment="center" textWrap="true" :text="isEnterEmail ? 'Use numbers' : 'Use email'"></Label>
          </Ripple>
          <label row="0" col="0" colSpan="3" fontSize="18%" verticalAlignment="bottom" textAlignment="center" class="font-weight-bold text-white text-mute" text="Login"></label>
        </GridLayout>
      </CardView>
      <ScrollView row="1" width="100%">
        <CardView verticalAlignment="center" padding="10" margin="5" elevation="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
          <GridLayout width="100%">
            <FlexboxLayout class="m-10" justifyContent="space-between" width="100%" alignSelf="center" height="100%" flexDirection="column">
  
              <GridLayout v-show="!isEnterEmail" class="m-10" rows="auto,auto" columns="auto,*">
                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact numbers"></label>
                <TextField row="1" col="1" :isEnabled="!isEnterEmail" keyboardType="number" returnKeyType="next" v-model="user.numbers" autocorrect="true"></TextField>
              </GridLayout>
  
              <GridLayout v-show="isEnterEmail" class="m-10" rows="auto,auto" columns="auto,*">
                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-email' | fonticon"></label>
                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Email"></label>
                <TextField row="1" col="1" :isEnabled="isEnterEmail" keyboardType="email" returnKeyType="next" v-model="user.email" autocorrect="true" autocapitalizationType="none" :class="{ 'light hidden': isEnterEmail}" :hidden="!isEnterEmail"></TextField>
              </GridLayout>
  
              <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-10" fontSize="25%" :text="'mdi-lock' | fonticon"></label>
                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Password"></label>
                <TextField row="1" col="1" ref="password" secure="true" returnKeyType="done" v-model="user.password" @returnPress="submit()" :class="{ light: !isLoading }"></TextField>
              </GridLayout>
  
              <ActivityIndicator :busy="isLoading"></ActivityIndicator>
  
              <StackLayout v-show="!isLoading">
                <Button text="Login" :isEnabled="!isLoading" class="submit-button bg-dark-blue" @tap="submit()"></Button>
              </StackLayout>
  
              <GridLayout v-show="$navigator.route.meta.userAuthLevel > 0" justifyContent="flex-end" columns="*" rows="auto">
                <Button v-if="$navigator.route.meta.userAuthLevel == 1" @tap="navigate('/tenant/dashboard')" :text="'Continue as ' + $store.state.cache.cachedTenant.username"></Button>
                <Button v-if="$navigator.route.meta.userAuthLevel == 3" @tap="navigate('/admin/dashboard')" :text="'Continue as ' + $store.state.cache.cachedAdmin.userName"></Button>
              </GridLayout>
  
            </FlexboxLayout>
          </GridLayout>
        </CardView>
      </ScrollView>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");
const http = require("http");

import * as Toast from "nativescript-toast";
var appSettings = require("application-settings");

import * as connectivity from "tns-core-modules/connectivity";

export default {
  name: "login",
  data() {
    return {
      isEnterEmail: false,
      user: {
        numbers: "",
        password: "",
        email: ""
      }
    };
  },
  mounted() {
    this.pageLoaded();
  },
  created() {
    this.pageLoaded();
  },
  beforeDestroy() {
    this.isLoading = false;
  },
  Destroy() {
    this.isLoading = false;
  },
  methods: {
    pageLoaded() {
      this.$store.commit("refreshCache", {
        db: this.$db,
        api: this.$api,
        appSettings: appSettings,
        doc: "admin"
      });
    },
    submit() {
      var self = this;
      this.isLoading = true;
      var connectionType = connectivity.getConnectionType();
      if (connectionType == connectivity.connectionType.none) {
        if (this.$navigator.route.meta.userAuthLevel == -1) {
          this.loadAdminData();
        } else if (this.$navigator.route.meta.userAuthLevel == -2) {
          this.loadTenantData();
        } else {
          this.$feedback.error({
            title: "NO INTERNET CONNECTION",
            duration: 4000,
            message: "Please switch on your data/wifi."
          });
        }
      } else {
        http
          .request({
            url: this.$store.state.settings.baseLink + "/a/login",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            content: JSON.stringify({
              useEmail: this.isEnterEmail,
              numbers: this.user.numbers,
              email: this.user.email,
              pass: this.user.password
            })
          })
          .then(response => {
            var statusCode = response.statusCode;
            this.$feedback.info({
              message: statusCode
            });
            if (statusCode == 200) {
              var result = response.content.toJSON();
              this.loginAdmin(self, result);
              this.isLoading = false;
              this.navigate("/admin/dashboard");
            } else {
              var error = response.content.toString();
              this.$feedback.error({
                message: error
              });
              this.isLoading = false;
            }
          })
          .catch(err => {
            this.$feedback.error({
              message: err
            });

            this.isLoading = false;
          });
      }
    }
  }
};
</script>

<style>
</style>
