<template>
    <page class="page" actionBarHidden="true" width="100%" height="100%" @loaded="pageLoaded">
        <ScrollView>
            <FlexboxLayout flexDirection="column" justifyContent="space-between" width="100%">
                <StackLayout>
                    <CardView elevation="5" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <GridLayout class="m-20" rows="auto" columns="*,auto">
                            <StackLayout row="0" col="0">
                                <label class="h3" text="Adding a business for : "></label>
                                <label class="h4 m-l-20" :text="adminProfile.userName"></label>
                            </StackLayout>
                            <Button row="0" col="1" @tap="$router.back()" selfAlign="right" text="Cancel"></Button>
                        </GridLayout>
                    </CardView>
                    <Progress clas="m-y-10" :value="(currentPage + 1) * 20"></Progress>
                </StackLayout>
                <!-- PAGE 0 -->
                <StackLayout v-show="currentPage == 0">
                    <CardView margin="20" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <ScrollView>
                            <StackLayout>
                                <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" verticalAlignment="center" textAlignment="center" text="Add a new business"></label>
    
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
                    <CardView margin="30" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <ScrollView>
                            <StackLayout>
                                <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" :text="`${business.name}'s logo`"></label>
    
                                <label class="p-x-10 t-15 font-italic text-mute text-light-blue" textWrap="true" verticalAlignment="center" textAlignment="center" text="Uploading the logo is not a requirement"></label>
                                <label class="p-x-10 t-10 font-italic text-mute text-light-blue" textWrap="true" verticalAlignment="center" textAlignment="center" text="You can do it at a later stage as well."></label>
    
                                <Ripple @tap="uploadLogo()">
                                    <GridLayout class="m-10 waves-effect" rows="auto,auto,*" columns="auto,*">
                                        <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-camera' | fonticon"></label>
                                        <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business logo"></label>
                                        <label row="1" col="1" class="h3 font-weight-bold text-mute" text="Click to upload your business's logo"></label>
                                        <Image row="2" col="0" colSpan="2" v-show="business.logo" :src="business.logo" stretch="aspectFill" width="100%" />
                                    </GridLayout>
                                </Ripple>

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
                    <CardView margin="30" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <ScrollView>
                            <StackLayout>
                                <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" text="Verify information"></label>
    
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
                                    <label row="0" col="0" verticalAlignment="top" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-work' | fonticon"></label>
                                    <label row="0" col="1" verticalAlignment="center" class="h3 font-weight-bold text-mute" text="Business Type"></label>
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

                                    <GridLayout v-show="business.logo" class="m-10 waves-effect" rows="auto,*" columns="auto,*">
                                        <label row="0" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-camera' | fonticon"></label>
                                        <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business logo"></label>
                                        <Image row="1" col="0" colSpan="2" :src="business.logo" stretch="aspectFill" width="100%" />
                                    </GridLayout>

                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="RENT AMOUNT"></label>
                                    <label row="1" col="1" class="h4" keyboardType="number" :text="rentAmount"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="RENT DUE ON"></label>
                                    <label row="1" col="1" class="h4" :text="rentDueOn"></label>
                                </GridLayout>
    
                                <GridLayout v-show="hasDeposit" class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="DEPOSIT AMOUNT"></label>
                                    <label row="1" col="1" class="h4" keyboardType="number" hint="e.g 3000" :text="depositAmount"></label>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout class="m-10" rows="auto" columns="*,auto">
                                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Additional information"></label>
                                </GridLayout>
                                <GridLayout v-show="hasBusary" class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-business' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Busary provider"></label>
                                    <label row="1" col="1" class="h4" hint="e.g Investec" :text="busaryProvider"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Full Names"></label>
                                    <label row="1" col="1" class="h4" hint="e.g Sirwali Joe" :text="nextOfKin.name"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact Numbers"></label>
                                    <label row="1" col="1" class="h4" keyboardType="number" hint="e.g 076 048 7292" :text="nextOfKin.contact"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-group-work' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Relationship"></label>
                                    <label row="1" col="1" class="h4" hint="e.g Father" :text="nextOfKin.relationship"></label>
                                </GridLayout>
                            </StackLayout>
                        </ScrollView>
                    </CardView>
                </StackLayout>
                <DockLayout v-show="txtError.length > 2" alignSelf="center" justifyContent="flex-end" orientation="horizontal" textAlignment="center">
                    <Label :text="txtError" textWrap="true" class="text-mute text-light-red" textAlignment="center"></Label>
                </DockLayout>
                <DockLayout v-show="txtError.length < 2" alignSelf="center" justifyContent="flex-end" orientation="horizontal" textAlignment="center">
                    <Label text="You can proceed" textWrap="true" class="text-mute text-light-blue" textAlignment="center"></Label>
                </DockLayout>
    
                <DockLayout v-show="!isLoading" alignSelf="center" justifyContent="flex-end" orientation="horizontal" textAlignment="center">
                    <Button @tap="currentPage--" :isEnabled="currentPage > 0" class="mdi h3" :text="'mdi-arrow-back' | fonticon"></Button>
                    <Button @tap="moveForward()" v-show="currentPage != 4" class="mdi h3" :text="'mdi-arrow-forward' | fonticon"></Button>
                    <Button @tap="submitTenant()" v-show="currentPage == 4" class="btn-primary bg-light-blue" text="Proceed"></Button>
                </DockLayout>
    
                <ActivityIndicator :busy="isLoading"></ActivityIndicator>
    
            </FlexboxLayout>
        </ScrollView>
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
          index: -1,
          category: ""
        },
        options: {
          types: []
        }
      },
      txtError: "",
      currentPage: 0,
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
  computed: {},
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
    generatePassword() {
      var text = "";
      var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    },
    submitTenant() {
      var self = this;

      self.isLoading = true;

      var connectionType = connectivity.getConnectionType();
      if (connectionType == connectivity.connectionType.none) {
        self.$feedback.error({
          title: "NO INTERNET CONNECTION",
          duration: 4000,
          message: "Please switch on your data/wifi."
        });
        self.isLoading = false;
      } else {
        http
          .request({
            url: this.$store.state.settings.baseLink + "/s/add",
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            content: JSON.stringify({
              addedBy: this.$store.state.cache.cachedAdmin._id,
              username: this.tenantUserName,
              firstName: this.tenantName.split(" ")[1],
              surname: this.tenantName.split(" ")[0],
              room: this.tenantRoom,
              password: this.generatePassword(),
              contactNumbers: this.tenantNumbers,
              nextOfKin: {
                name: this.nextOfKin.name.split(" ")[1],
                surname: this.nextOfKin.name.split(" ")[0],
                relationship: this.nextOfKin.relationship,
                contact: this.nextOfKin.contact
              },
              sponsor: this.hasBusary ? this.busaryProvider : null,
              lease: {
                rentDueOn: this.rentDueOn,
                startDate: this.leaseStartDate,
                endDate: this.leaseEndDate,
                rentAmount: this.rentAmount,
                depositAmount: this.hasDeposit ? this.depositAmount : null
              }
            })
          })
          .then(
            function(response) {
              var statusCode = response.statusCode;
              var result = response.content.toString();

              if (statusCode == 200) {
                var result = response.content.toString();

                self.$feedback
                  .success({
                    title: self.tenantUserName + " successfully added",
                    duration: 30000,
                    onTap: () => {
                      self.$router.replace(
                        "/admin/fulham/student/profile/" + result
                      );
                    }
                  })
                  .then(() => {
                    self.router.replace("/admin/dashboard");
                  });
              } else {
                self.$feedback.error({
                  title: "Error (" + statusCode + ")",
                  duration: 4000,
                  message: result
                });
              }
              self.isLoading = false;
            },
            function(e) {
              dialogs.alert(e).then(() => {
                console.log("Error occurred " + e);
              });

              self.isLoading = false;
            }
          )
          .catch(err => {
            self.$feedback.error({
              title: "Server error",
              duration: 4000,
              message: err,
              onTap: () => {
                dialogs.alert("TODO : Handle the error");
              }
            });
            self.isLoading = false;
          });
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
      }
    },
    uploadLogo() {
      let context = imagepicker.create({
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
          this.$feedback.error({
            title: "No file selected",
            message: "Please select a valid image file",
            duration: 4000,
            position: 1,
            onTap: () => {}
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/variables";
</style>
