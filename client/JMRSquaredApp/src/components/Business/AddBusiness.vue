<template>
  <page class="page" actionBarHidden="true" width="100%" height="100%">
    <GridLayout rows="auto,*,auto">
      <StackLayout row="0">
        <CardView elevation="5" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
          <StackLayout>
            <GridLayout class="m-10" rows="auto" columns="*,auto">
              <StackLayout row="0" col="0">
                <label class="h3" text="Adding a business for : "></label>
                <label class="h4 m-l-20" :text="adminProfile.userName"></label>
              </StackLayout>
              <Button row="0" col="1" @tap="$router.back()" selfAlign="right" text="Cancel"></Button>
            </GridLayout>
            <label class="h3 font-weight-bold text-mute text-dark-blue" verticalAlignment="center" textAlignment="center" :text="currentPageTitle"></label>
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
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-business' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business name *"></label>
                    <TextField v-model="business.name" row="1" col="1" class="h4" hint="e.g JMRSquared"></TextField>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" col="0" verticalAlignment="top" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-work' | fonticon"></label>
                    <label row="0" col="1" verticalAlignment="center" class="h3 font-weight-bold text-mute" text="Business Type *"></label>
                    <ListPicker row="1" col="0" colSpan="2" @selectedIndexChange="changeSelectedBusinessCategory" :items="business.options.types.map(t => t.type)" v-model="business.type.index" />
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-' + business.type.icon | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business Category *"></label>
                    <label :text="business.type.category" row="1" col="1" class="h4"></label>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <GridLayout class="m-10" v-if="business.type.optionals" v-for="(optional,o) in business.type.optionals" :key="o" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-' + optional.icon | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="optional.title"></label>
                    <TextField v-model="optional.answer" :keyboardType="optional.type" row="1" col="1" class="h4" :hint="optional.hint"></TextField>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-description' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business description"></label>
                    <TextView v-model="business.description" row="1" col="1" class="h4" hint="More information about your business"></TextView>
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
                  <Ripple @tap="uploadLogo()">
                    <GridLayout class="m-10 waves-effect" rows="auto,auto,*" columns="*">
                      <label v-show="!business.logo" row="0" col="1" verticalAlignment="center" textAlignment="center" rowSpan="2" verticalAli class="h3 font-weight-bold text-mute" text="Click to upload your business's logo"></label>
                      <Image row="2" col="0" verticalAlignment="center" textAlignment="center" v-show="business.logo" :src="business.logo" stretch="aspectFill" width="100%" />
                    </GridLayout>
                  </Ripple>
  
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
                  <GridLayout v-show="business.logo" class="m-10" rows="auto" columns="*,auto">
                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" :text="`${business.name}'s logo`"></label>
                  </GridLayout>
  
                  <GridLayout v-show="business.logo" class="m-10 waves-effect" rows="*" columns="*">
                    <Image row="0" col="0" :src="business.logo" stretch="aspectFill" width="100%" />
                  </GridLayout>
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
                <Button row="1" @tap="GoToBusiness(savedBusiness)" class="btn-primary bg-light-blue" :text="`Open ${business.name}`"></Button>
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

export default {
  data() {
    return {
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
      savedBusiness:false,
      txtError: "",
      currentPage: 0,
      currentPageTitle: "General Information",
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
          this.currentPageTitle = "General Information";
          break;
        case 1:
          this.currentPageTitle = this.business.name + "`s logo";
          break;
        case 2:
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
      var self = this;
      this.ApplyNavigation(self);
      this.business.options.types = [];

      var connectionType = connectivity.getConnectionType();
      if (connectionType == connectivity.connectionType.none) {
        this.$feedback.error({
          title: "NO INTERNET CONNECTION",
          duration: 4000,
          message: "Please switch on your data/wifi."
        });
      } else {
        http
          .getJSON(
            this.$store.state.settings.baseLink +
              "/settings/options/business/types"
          )
          .then(
            response => {
              this.business.options.types = response;
              this.changeSelectedBusinessCategory(0);
            },
            err => {
              dialogs.alert(e).then(() => {
                console.log("Error occurred " + e);
              });
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
          });
      }
    },
    changeRentDueOn() {
      var self = this;
      this.$showModal({
        template: ` 
                                                                                                                                                    <Page>
                                                                                                                                                        <GridLayout rows="auto,*,auto" columns="*" width="100%" height="60%">
                                                                                                                                                            <Label row="0" class="h2 m-5" textAlignment="center" text="Select when the rent is due"></Label>
                                                                                                                                                            <ListPicker row="1" :items="datesDue" v-model="selectedDueDateOn" />
                                                                                                                                                            <Label row="2" class="mdi h1 m-5" @tap="changeDueRent($modal,datesDue[selectedDueDateOn])" textAlignment="center" :text="'mdi-done' | fonticon"></Label>
                                                                                                                                                        </GridLayout>
                                                                                                                                                    </Page>
                                                                                                                                                    `,
        data: function() {
          return {
            datesDue: [
              "1st of each month",
              "15th of each month",
              "22nd of each month"
            ],
            selectedDueDateOn: 0
          };
        },
        methods: {
          changeDueRent(modal, value) {
            self.rentDueOn = value;
            this.$modal.close();
          }
        }
      });
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
        if(this.business.logo){
          new imageSource.ImageSource().fromAsset(this.business.logo).then(img => {
            this.business.logo = "data:image/png;base64," + img.toBase64String("png");
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
                  .then(() => {
                  });
              } else {
                this.$feedback.error({
                  title: "Error (" + statusCode + ")",
                  duration: 4000,
                  message: result
                });
              }
              this.isLoading = false;
            },(e) => {
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
          }).catch(err=>{
            this.$feedback.error({
              title: "Unable to upload your logo",
              message:"Please choose another image, or go back and remove it.",
              duration: 4000
            });
          });
        }else{
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
                  .then(() => {
                  });
              } else {
                this.$feedback.error({
                  title: "Error (" + statusCode + ")",
                  duration: 4000,
                  message: result
                });
              }
              this.isLoading = false;
            },(e) => {
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
    },
    changeLeaseDate(isStart) {
      var self = this;
      this.$showModal({
        template: ` 
                                                                                                <Page>
                                                                                                    <GridLayout rows="auto,*,auto" columns="*" width="100%" height="60%">
                                                                                                        <Label row="0" class="h2 m-5" textAlignment="center" text="Select a date"></Label>
                                                                                                        <DatePicker row="1" v-model="selectedDueDate" />
                                                                                                        <Label row="2" class="mdi h1 m-5" @tap="changeDueRent($modal,selectedDueDate)" textAlignment="center" :text="'mdi-done' | fonticon"></Label>
                                                                                                    </GridLayout>
                                                                                                </Page>
                                                                                                `,
        data: function() {
          return {
            selectedDueDate: new Date()
          };
        },
        methods: {
          changeDueRent(modal, value) {
            if (isStart) {
              self.leaseStartDate = value;
              self.leaseStartDate.setDate(value.getDate() + 1);
            } else {
              self.leaseEndDate = value;
              self.leaseEndDate.setDate(value.getDate() + 1);
            }

            let d1 = self.leaseStartDate;
            let d2 = self.leaseEndDate;
            let months = (d2.getFullYear() - d1.getFullYear()) * 12;
            months -= d1.getMonth() + 1;
            months += d2.getMonth();
            self.leaseTotalMonths = months + 1;
            this.$modal.close();
          }
        }
      });
    },
    changeSelectedBusinessCategory(index) {
      if (
        this.business.options.types.length > 0 &&
        this.business.options.types.length > this.business.type.index
      ) {
        this.business.type.category = this.business.options.types[
          this.business.type.index
        ].category;

        this.business.type.type = this.business.options.types[
          this.business.type.index
        ].type;

        this.business.type.icon = this.business.options.types[
          this.business.type.index
        ].icon;

        this.business.type.optionals = this.business.options.types[
          this.business.type.index
        ].optional;

        this.business.type.optionals.forEach(optional => {
          optional.answer = null;
        });
      }
    },
    uploadLogo() {
      var context = imagepicker.create({
        mode: "single" // use "multiple" for multiple selection
      });

      context
        .authorize()
        .then(function() {
          return context.present();
        })
        .then(selection => {
          selection.forEach(selected => {
            // process the selected image
            this.business.logo = selected;
          });
        })
        .catch(err => {
          // process error
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/variables";
</style>
