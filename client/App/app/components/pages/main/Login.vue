<template>
  <page @loaded="pageLoaded()">
    <ActionBar>
      <GridLayout rows="auto" columns="auto,*,auto,auto" orientation="horizontal">
        <Ripple class="p-10" @tap="navigate('/home')" verticalAlignment="center" col="0" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-home' | fonticon"></Label>
        </Ripple>
        <Label col="1" class="m-l-25 font-weight-bold" verticalAlignment="center" text="Login"></Label>
        <Ripple class="p-10" @tap="reportBug()" verticalAlignment="center" col="2" borderRadius="50%">
          <Label verticalAlignment="center" class="mdi" fontSize="25%" :text="'mdi-bug-report' | fonticon"></Label>
        </Ripple>
        <Ripple class="p-20 m-x-20 font-weight-bold" @tap="isEnterEmail = !isEnterEmail" textAlignment="right" verticalAlignment="center" col="3">
          <Label verticalAlignment="center" textWrap="true" :text="isEnterEmail ? 'Use numbers' : 'Use email'"></Label>
        </Ripple>
      </GridLayout>
    </ActionBar>
    <ScrollView width="100%">
      <CardView verticalAlignment="center" padding="10" margin="4" elevation="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
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
              <Button text="Login" :isEnabled="!isLoading" class="submit-button" @tap="submit()"></Button>
            </StackLayout>
  
            <GridLayout v-show="$navigator.route.meta.userAuthLevel > 0" justifyContent="flex-end" columns="*" rows="auto">
              <Button v-if="$navigator.route.meta.userAuthLevel == 1" @tap="navigate('/tenant/dashboard')" :text="'Continue as ' + $store.state.cache.cachedTenant.username"></Button>
              <Button v-if="$navigator.route.meta.userAuthLevel == 3" @tap="navigate('/admin/dashboard')" :text="'Continue as ' + $store.state.cache.cachedAdmin.userName"></Button>
            </GridLayout>
  
          </FlexboxLayout>
        </GridLayout>
      </CardView>
    </ScrollView>
  
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
          appSettings: appSettings
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
              message: "Please switch on your data/wifi.",
            });
          }
        }else{
  
        dialogs
          .action("What type of user are you?", "cancel", ["Tenant", "Admin"])
          .then(userType => {
            if (userType == "Tenant") {
              http
                .request({
                  url: this.$store.state.settings.baseLink + "/s/login",
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
                  if (statusCode == 200) {
                    var result = response.content.toJSON();
                    this.loginTenant(this, result);
                    this.isLoading = false;
                    this.navigate("/tenant/dashboard");
                  } else {
                    var error = response.content.toString();
                    this.$feedback.error({
                      message: error
                    });
                    this.isLoading = false;
                  }
                }).catch(err => {
                  this.$feedback.error({
                    message: err
                  });
  
                  this.isLoading = false;
                });
            } else if (userType == "Admin") {
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
                }).then(response => {
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
                }).catch(err => {
                  this.$feedback.error({
                    message: err
                  });
  
                  this.isLoading = false;
                });
  
            } else {
              //WHen they press cancel
              this.isLoading = false;
            }
          });
      }}
    }
  };
</script>

<style>
  
</style>
