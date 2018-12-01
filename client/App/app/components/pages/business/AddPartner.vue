<template>
  <page class="page" actionBarHidden="true" width="100%" height="100%">
    <GridLayout rows="auto,*,auto">
      <StackLayout row="0">
        <CardView elevation="5" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
          <StackLayout>
            <GridLayout class="m-10" rows="auto,auto" columns="*,auto">
              <label row="0" col="0" :textWrap="true" class="h3 m-l-20" :text="currentPageTitle"></label>
              <label row="1" col="0" class="h3 m-l-20 font-weight-bold text-dark-blue" :text="businessName"></label>
              <Button row="0" col="1" rowSpan="2" verticalAlignment="center" @tap="$router.back()" selfAlign="right" text="Cancel"></Button>
            </GridLayout>
          </StackLayout>
        </CardView>
        <Progress :value="(currentPage + 1) * 50"></Progress>
      </StackLayout>
      <ScrollView row="1">
        <FlexboxLayout flexDirection="column" justifyContent="center" width="100%">
          <!-- PAGE 0 -->
          <StackLayout v-show="currentPage == 0">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout>
  
                  <label class="m-10 t-10 font-italic text-light-blue" textAlignment="center" :textWrap="true" verticalAlignment="center" text="Please enter your partner's details below and proceed."></label>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-circle' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Username *"></label>
                    <TextField v-model="partner.username" returnKeyType="next" row="1" col="1" class="h4" hint="e.g Joe"></TextField>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact numbers *"></label>
                    <TextField v-model="partner.contactNumbers" returnKeyType="next" keyboardType="number" row="1" col="1" class="h4" hint="e.g 0760487292"></TextField>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-email' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Email"></label>
                    <TextView v-model="partner.email" returnKeyType="next" keyboardType="email" row="1" col="1" class="h4" hint="e.g mulavhe@gmail.com"></TextView>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-card-details' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Full name"></label>
                    <TextView v-model="partner.fullName" returnKeyType="done" row="1" col="1" class="h4" hint="e.g Sirwali Joseph"></TextView>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
                </StackLayout>
              </ScrollView>
            </CardView>
          </StackLayout>
          <StackLayout v-show="currentPage == 1">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout>
  
                  <label class="m-10 t-10 font-italic text-light-blue" textAlignment="center" :textWrap="true" verticalAlignment="center" text="Please validate if the following information is correct and click proceed or go back and fix all the mistakes."></label>
  
                  <GridLayout class="m-10" rows="auto" columns="*,auto">
                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Partner's information"></label>
                  </GridLayout>
  
  
                  <GridLayout v-show="partner.username.length > 2" class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-circle' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Username *"></label>
                    <label :text="partner.username" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout v-show="partner.contactNumbers.toString().length > 2" class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact numbers *"></label>
                    <label :text="partner.contactNumbers" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout v-show="partner.email.length > 2" class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-email' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Email"></label>
                    <label :text="partner.email" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout v-show="partner.fullName.length > 2" class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-card-details' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Full name"></label>
                    <label :text="partner.fullName" row="1" col="1" class="h4"></label>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
                </StackLayout>
              </ScrollView>
            </CardView>
          </StackLayout>
        </FlexboxLayout>
      </ScrollView>
      <StackLayout row="2">
        <CardView class="bg-white m-t-10 p-t-10" elevation="5" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
          <StackLayout>
            <FlexboxLayout v-show="!isLoading" flexDirection="column" alignContent="flex-end" justifyContent="flex-end" width="100%">
              <GridLayout v-show="!savedPartner" rows="auto,auto" columns="*,*">
                <Label row="0" colSpan="2" :text="txtError.length < 2 ? 'You can proceed' :txtError" textWrap="true" :class="`text-mute text-light-${txtError.length < 2 ? 'blue' : 'red'}`" textAlignment="center"></Label>
                <Button row="1" col="1" @tap="submitPartner()" v-show="currentPage == 1" class="btn-primary bg-light-green" :text="`Save ${partner.username}`"></Button>
                <Button row="1" col="0" @tap="currentPage--" v-show="currentPage > 0" :isEnabled="currentPage > 0" class="btn-primary bg-light-red" text="back"></Button>
                <Button row="1" col="1" @tap="moveForward()" v-show="currentPage != 1" class="btn-primary bg-light-blue" text="proceed"></Button>
              </GridLayout>
              <GridLayout v-show="savedPartner" rows="auto,auto" columns="*">
                <Label row="0" text="Partner successfully added!" textWrap="true" class="text-mute text-light-blue" textAlignment="center"></Label>
                <Button row="1" @tap="GoToPartnerProfile(savedPartner)" class="btn-primary bg-light-blue" :text="`Open ${partner.username}`"></Button>
              </GridLayout>
            </FlexboxLayout>
            <ActivityIndicator v-show="isLoading" :busy="isLoading"></ActivityIndicator>
          </StackLayout>
        </CardView>
      </StackLayout>
    </GridLayout>
  </page>
</template>

<script>
const dialogs = require("ui/dialogs");

import * as Toast from "nativescript-toast";
import * as LocalNotifications from "nativescript-local-notifications";
const http = require("http");
import * as imageSource from "tns-core-modules/image-source";

import * as imagepicker from "nativescript-imagepicker";

import * as connectivity from "tns-core-modules/connectivity";
// var keyboard = require("nativescript-keyboardshowing");

export default {
  data() {
    return {
      partner: {
        username: "",
        contactNumbers: "",
        email: "",
        fullName: ""
      },
      business: {
        name: "",
        logo: null,
        description: "",
        type: {
          icon: "",
          type: "",
          index: 0,
          category: "",
          optionals: []
        },
        options: {
          types: []
        }
      },
      savedPartner: false,
      txtError: "",
      currentPage: -1,
      currentPageTitle: "......",
      tenantName: "",
      tenantUserName: "",
      tenantNumbers: "",
      tenantRoom: "",
      leaseStartDate: new Date(),
      leaseEndDate: new Date(),
      leaseTotalMonths: 0,
      rentAmount: "",
      rentDueOn: "1st of each month",
      hasDeposit: false,
      depositAmount: "",
      hasBusary: false,
      busaryProvider: "",
      nextOfKin: {
        name: "",
        contact: "",
        relationship: ""
      }
    };
  },
  watch: {
    currentPage(newVal, oldVal) {
      switch (newVal) {
        case 0:
          this.currentPageTitle = "Adding a partner for ";
          break;
        case 1:
          this.currentPageTitle = "Verify information";
          break;
        default:
          this.currentPageTitle = "";
      }
    }
  },
  created() {
    this.pageLoaded();
  },
  mounted() {
    this.pageLoaded();
  },
  props: ["businessName", "businessId"],
  methods: {
    pageLoaded(args) {
      this.currentPage = 0;
      var self = this;
      this.ApplyNavigation(self);
    },
    GeneratePassword() {
      return Math.floor(100000 + Math.random() * 900000);
    },
    submitPartner() {
      this.isLoading = true;

      var connectionType = connectivity.getConnectionType();
      if (connectionType == connectivity.connectionType.none) {
        this.$feedback.error({
          title: "NO INTERNET CONNECTION",
          duration: 4000,
          message: "Please switch on your data/wifi."
        });
        this.isLoading = false;
      } else {
        http
          .request({
            url: this.$store.state.settings.baseLink + "/a/add",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            content: JSON.stringify({
              email: this.partner.email,
              pass: this.GeneratePassword(),
              numbers: this.partner.contactNumbers,
              role: "WORKER",
              username: this.partner.username,
              fullName: this.partner.fullName
            })
          })
          .then(answer => {
            var statusCode = answer.statusCode;
            if (statusCode == 200) {
              var userID = answer.content;
              http
                .request({
                  url:
                    this.$store.state.settings.baseLink +
                    "/b/assign/to/business",
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  content: JSON.stringify({
                    assignedBY: this.$store.state.cache.cachedAdmin._id,
                    adminID: userID,
                    adminAuthority: "WORKER",
                    businessID: this.businessId
                  })
                })
                .then(
                  response => {
                    statusCode = response.statusCode;
                    var result = response.content.toString();

                    if (statusCode == 200) {
                      this.savedPartner = response.content.toString();

                      this.$feedback
                        .success({
                          title: this.partner.username + " successfully added",
                          message:
                            this.partner.username +
                            " is now linked to " +
                            this.businessName,
                          duration: 30000,
                          onTap: () => {
                            this.GoToPartner(this.savedPartner);
                          }
                        })
                        .then(() => {});
                    } else {
                      this.$feedback.error({
                        title: "Error (" + statusCode + ")",
                        duration: 4000,
                        message: result
                      });
                    }
                    this.isLoading = false;
                  },
                  e => {
                    dialogs.alert(e).then(() => {
                      console.log("Error occurred " + e);
                    });

                    this.isLoading = false;
                  }
                )
                .catch(err => {
                  throw new Error(err);
                  this.isLoading = false;
                });
            } else {
              throw new Error(answer.content);
            }
          })
          .catch(err => {
            this.$feedback.error({
              title: "Server error",
              duration: 4000,
              message: err
            });
            this.isLoading = false;
          });
      }
    },
    canGoForward() {
      this.txtError = "";
      if (this.currentPage == 0) {
        if (this.partner.username.length < 2) {
          this.txtError = "Provide a valid partner username.";
          return false;
        } else if (
          isNaN(this.partner.contactNumbers) ||
          this.partner.contactNumbers.toString().length < 10 ||
          this.partner.contactNumbers.toString().length > 13
        ) {
          this.txtError = "Please provide valid partner contact numbers.";
          return false;
        }
        return true;
      } else if (this.currentPage == 1) {
        return true;
      } else {
        return false;
      }
    },
    moveForward() {
      if (this.canGoForward()) {
        this.currentPage++;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
