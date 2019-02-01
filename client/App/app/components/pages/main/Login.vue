<template>
  <page class="backgroundImage" actionBarHidden="true" @loaded="pageLoaded()">
    <GridLayout class="backgroundImageOverlay" rows="auto,*">
      <CardView class="m-b-5" backgroundColor="transparent" row="0" textAlignment="center" shadowOpacity="0.2" shadowRadius="50" elevation="20">
        <GridLayout class="bg-dark-blue-overlay p-y-15 p-5" rows="auto" columns="auto,*,auto">
          <Ripple @tap="navigate('/home')" verticalAlignment="center" borderRadius="50%">
               <Image verticalAlignment="center" width="50" height="50" class="circle" stretch="aspectFill" src="res://icon" borderRadius="50%" />
          </Ripple>
          <Ripple row="0" col="2" verticalAlignment="center" @tap="isEnterEmail = !isEnterEmail">
            <Label class="text-white" verticalAlignment="center" textWrap="true" :text="isEnterEmail ? 'Use numbers' : 'Use email'"></Label>
          </Ripple>
          <label row="0" col="0" colSpan="3" fontSize="20%" verticalAlignment="center" textAlignment="center" class="font-weight-bold text-white text-mute" text="Login"></label>
        </GridLayout>
      </CardView>
      <ScrollView row="1" width="100%">
        <CardView verticalAlignment="center" padding="10" margin="25" elevation="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
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
  
              <ActivityIndicator v-show="isLoading" :busy="isLoading"></ActivityIndicator>
  
              <StackLayout v-show="!isLoading">
                <Button text="Login" :isEnabled="!isLoading" class="submit-button bg-dark-blue text-white" @tap="submit()"></Button>
              </StackLayout>
  
              <GridLayout v-if="$router.current.userAuthLevel() > 0" justifyContent="flex-end" columns="*" rows="auto">
                <Button v-if="$router.current.userAuthLevel() == 3" @tap="navigate('/admin/dashboard',null,{ clearHistory: true })" :text="'Continue as ' + $store.state.cache.cachedAdmin.userName"></Button>
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
      this.$api
        .adminLogin({
          useEmail: this.isEnterEmail,
          numbers: this.user.numbers,
          email: this.user.email,
          pass: this.user.password
        })
        .then(response => {
          var statusCode = response.statusCode;
          if (statusCode == 200) {
            var result = response.content.toJSON();
            this.appSettings.setString("CurrentUserID", result._id);
            this.$api
              .getAuthToken()
              .then(answer => {
                console.log("tag", answer);
                this.loginAdmin(self, result);
                this.isLoading = false;
                this.navigate("/admin/dashboard", null, {
                  clearHistory: true,
                  transition: {
                    name: "slideTop",
                    duration: 1000,
                    curve: "spring"
                  }
                });
              })
              .catch(err => {
                this.$feedback.warning({
                  title: "Access denied!",
                  duration: 40000,
                  message: err.message
                });
                this.isLoading = false;
                this.navigate("/home", null, {
                  clearHistory: true
                });
                console.log("err", err);
              });
          } else if (statusCode == 512) {
            throw new Error(response.data.toString());
          } else {
            throw new Error("Try again later");
          }
        })
        .catch(err => {
          if (err.message.indexOf("Failed to connect") >= 0) {
            err.message = "Please check your internet connection";
          }

          this.$feedback.error({
            title: "Unable to log in",
            message: err.message
          });
          this.isLoading = false;
        });
    }
  }
};
</script>

<style scoped>
.backgroundImage {
  background: url("~/assets/images/suit77_black_white.jpeg") no-repeat center;
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
