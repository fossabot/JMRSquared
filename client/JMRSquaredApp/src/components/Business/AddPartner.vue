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
        <Progress :value="(currentPage) * 50"></Progress>
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
                    <TextView v-model="partner.email" returnKeyType="next" keyboardType="number" row="1" col="1" class="h4" hint="e.g mulavhe@gmail.com"></TextView>
                  </GridLayout>

                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
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
  
                  <label v-show="!business.logo" class="p-10 t-10 font-italic text-mute text-light-blue" textWrap="true" verticalAlignment="center" textAlignment="center" text="You can do it at a later stage as well."></label>
  
                  <Ripple v-show="business.logo" @tap="business.logo = null">
                    <GridLayout class="m-10 waves-effect" rows="auto,auto" columns="auto,*">
                      <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-delete' | fonticon"></label>
                      <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Remove business logo"></label>
                      <label row="1" col="1" class="h3 font-weight-bold text-mute" text="Click to remove your business's logo"></label>
                    </GridLayout>
                  </Ripple>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
                </StackLayout>
              </ScrollView>
            </CardView>
          </StackLayout>
          <StackLayout v-show="currentPage == 2">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout>
  
                  <label class="m-10 t-10 font-italic" textWrap="true" verticalAlignment="center" text="Please validate if the following information is correct and click proceed or go back and fix all the mistakes."></label>
  
                  <GridLayout class="m-10" rows="auto" columns="*,auto">
                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Business information"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-business' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business name"></label>
                    <label :text="business.name" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="top" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-work' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business Type"></label>
                    <label :text="business.type.type" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-' + business.type.icon | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business Category"></label>
                    <label :text="business.type.category" row="1" col="1" class="h4"></label>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <GridLayout class="m-10" rows="auto" columns="*,auto">
                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Optional information"></label>
                  </GridLayout>
  
                  <GridLayout v-show="business.description.length != 0" class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-description' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business description"></label>
                    <label :text="business.description" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" v-if="business.type.optionals && optional.answer && optional.answer.length != 0" v-for="(optional,o) in business.type.optionals" :key="o" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-' + optional.icon | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="optional.title"></label>
                    <label :text="optional.answer" row="1" col="1" class="h4"></label>
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
              <GridLayout v-show="!savedBusiness" rows="auto,auto" columns="*,*">
                <Label row="0" colSpan="2" :text="txtError.length < 2 ? 'You can proceed' :txtError" textWrap="true" :class="`text-mute text-light-${txtError.length < 2 ? 'blue' : 'red'}`" textAlignment="center"></Label>
                <Button row="1" col="1" @tap="submitBusiness()" v-show="currentPage == 2" class="btn-primary bg-light-green" :text="`save ${business.name}`"></Button>
                <Button row="1" col="0" @tap="currentPage--" v-show="currentPage > 0" :isEnabled="currentPage > 0" class="btn-primary bg-light-red" text="back"></Button>
                <Button row="1" col="1" @tap="moveForward()" v-show="currentPage != 2" class="btn-primary bg-light-blue" text="proceed"></Button>
              </GridLayout>
              <GridLayout v-show="savedBusiness" rows="auto,auto" columns="*">
                <Label row="0" text="Your business is ready!" textWrap="true" class="text-mute text-light-blue" textAlignment="center"></Label>
                <Button row="1" @tap="GoToBusiness(savedBusiness)" class="btn-primary bg-light-blue" :text="`Save ${partner.username}`"></Button>
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
      businessId: "",
      businessName: "",
      partner: {
        username: "",
        contactNumbers: ""
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
      savedBusiness: false,
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
  methods: {
    pageLoaded(args) {
      this.businessId = this.$route.params.businessId;
      this.businessName = this.$route.params.businessName;

      this.currentPage = 0;
      var self = this;
      this.ApplyNavigation(self);
    },
    submitBusiness() {
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
        if (this.business.logo) {
          new imageSource.ImageSource()
            .fromAsset(this.business.logo)
            .then(img => {
              this.business.logo =
                "data:image/png;base64," + img.toBase64String("png");
              http
                .request({
                  url: this.$store.state.settings.baseLink + "/b/add/business",
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  content: JSON.stringify({
                    adminID: this.$store.state.cache.cachedAdmin._id,
                    adminAuthority: "ADMIN",
                    business: this.business
                  })
                })
                .then(
                  response => {
                    var statusCode = response.statusCode;
                    var result = response.content.toString();

                    if (statusCode == 200) {
                      this.savedBusiness = response.content.toString();

                      this.$feedback
                        .success({
                          title: this.business.name + " successfully added",
                          duration: 30000,
                          onTap: () => {
                            this.GoToBusiness(this.savedBusiness);
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
                  this.$feedback.error({
                    title: "Server error",
                    duration: 4000,
                    message: err,
                    onTap: () => {
                      dialogs.alert("TODO : Handle the error");
                    }
                  });
                  this.isLoading = false;
                });
            })
            .catch(err => {
              this.$feedback.error({
                title: "Unable to upload your logo",
                message:
                  "Please choose another image, or go back and remove it.",
                duration: 4000
              });
            });
        } else {
          http
            .request({
              url: this.$store.state.settings.baseLink + "/b/add/business",
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              content: JSON.stringify({
                adminID: this.$store.state.cache.cachedAdmin._id,
                adminAuthority: "ADMIN",
                business: this.business
              })
            })
            .then(
              response => {
                var statusCode = response.statusCode;
                var result = response.content.toString();

                if (statusCode == 200) {
                  this.savedBusiness = response.content.toString();

                  this.$feedback
                    .success({
                      title: this.business.name + " successfully added",
                      duration: 30000,
                      onTap: () => {
                        this.GoToBusiness(this.savedBusiness);
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
              this.$feedback.error({
                title: "Server error",
                duration: 4000,
                message: err,
                onTap: () => {
                  dialogs.alert("TODO : Handle the error");
                }
              });
              this.isLoading = false;
            });
        }
      }
    },
    canGoForward() {
      this.txtError = "";
      if (this.currentPage == 0) {
        if (this.business.name.length < 2) {
          this.txtError = "Provide a valid business name.";
          return false;
        } else if (this.business.type.index < 0) {
          this.txtError =
            "Please pick a business type, make sure you have internet connection.";
          return false;
        } else {
          var fails = this.business.type.optionals
            .filter(o => o.required && (!o.answer || o.answer.length < 2))
            .map(o => o.requiredError);
          if (fails && fails.length > 0) {
            this.txtError = fails[0];
            return false;
          }
        }
        return true;
      } else if (this.currentPage == 1) {
        return true;
      } else if (this.currentPage == 2) {
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
@import "../../assets/variables";
</style>
