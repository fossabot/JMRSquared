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
                    <CardView margin="30" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <ScrollView>
                            <StackLayout>
                                <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" verticalAlignment="center" textAlignment="center" text="Add a new business"></label>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-business' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Business name"></label>
                                    <TextField v-model="tenantUserName" row="1" col="1" class="h4" hint="e.g JMRSquared"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Full Names"></label>
                                    <TextField v-model="tenantName" row="1" col="1" class="h4" hint="e.g Sirwali Joe"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact numbers"></label>
                                    <TextField v-model="tenantNumbers" row="1" col="1" class="h4" keyboardType="number" hint="e.g 076 048 7292"></TextField>
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
                                <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" :text=" tenantUserName + '\'s Lease dates'"></label>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-home' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Room number"></label>
                                    <TextField v-model="tenantRoom" row="1" col="1" class="h4" hint="e.g S1"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout @tap="changeLeaseDate(true)" class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="LEASE START DATE"></label>
                                    <label row="1" col="1" class="h4" :text="leaseStartDate.toISOString().slice(0,10)"></label>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout @tap="changeLeaseDate(false)" class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="LEASE END DATE"></label>
                                    <label row="1" col="1" class="h4" :text="leaseEndDate.toISOString().slice(0,10)"></label>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout v-show="leaseTotalMonths >= 0" class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-update' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="LEASE LENGTH"></label>
                                    <label row="1" col="1" class="h4" :text="leaseTotalMonths + ' month/s'"></label>
                                </GridLayout>
                            </StackLayout>
                        </ScrollView>
                    </CardView>
                </StackLayout>
                <StackLayout v-show="currentPage == 2">
                    <CardView margin="30" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <ScrollView>
                            <StackLayout>
                                <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" text="Rent details"></label>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="RENT AMOUNT"></label>
                                    <TextField row="1" col="1" class="h4" keyboardType="number" hint="e.g 3000" v-model="rentAmount"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout @tap="changeRentDueOn()" class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="RENT DUE ON"></label>
                                    <label row="1" col="1" class="h4" :text="rentDueOn"></label>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout @tap="hasDeposit = !hasDeposit" class="m-10" rows="auto" columns="*,auto">
                                    <label row="0" col="0" class="h3 font-weight-bold text-mute" text="DEPOSIT REQUIRED"></label>
                                    <switch row="0" col="1" v-model="hasDeposit"></switch>
                                </GridLayout>
    
                                <GridLayout v-show="hasDeposit" class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-money' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="DEPOSIT AMOUNT"></label>
                                    <TextField row="1" col="1" class="h4" keyboardType="number" hint="e.g 3000" v-model="depositAmount"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                            </StackLayout>
                        </ScrollView>
                    </CardView>
                </StackLayout>
                <StackLayout v-show="currentPage == 3">
                    <CardView margin="30" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <ScrollView>
                            <StackLayout>
                                <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" text="Additional information"></label>
    
                                <GridLayout @tap="hasBusary = !hasBusary" class="m-10" rows="auto" columns="*,auto">
                                    <label row="0" col="0" class="h3 font-weight-bold text-mute" text="Using a Busary"></label>
                                    <switch row="0" col="1" v-model="hasBusary"></switch>
                                </GridLayout>
    
                                <GridLayout v-show="hasBusary" class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-business' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Busary provider"></label>
                                    <TextField row="1" col="1" class="h4" hint="e.g Investec" v-model="busaryProvider"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout class="m-10" rows="auto" columns="*,auto">
                                    <label row="0" col="0" class="h3 font-weight-bold text-mute" text="Next of kin"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Full Names"></label>
                                    <TextField row="1" col="1" class="h4" hint="e.g Sirwali Joe" v-model="nextOfKin.name"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact Numbers"></label>
                                    <TextField row="1" col="1" class="h4" keyboardType="number" hint="e.g 076 048 7292" v-model="nextOfKin.contact"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-group-work' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Relationship"></label>
                                    <TextField row="1" col="1" class="h4" hint="e.g Father" v-model="nextOfKin.relationship"></TextField>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                            </StackLayout>
                        </ScrollView>
                    </CardView>
                </StackLayout>
                <StackLayout v-show="currentPage == 4">
                    <CardView margin="30" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                        <ScrollView>
                            <StackLayout>
                                <label class="h2 p-15 font-weight-bold text-mute text-dark-blue" row="0" col="0" colSpan="2" verticalAlignment="center" textAlignment="center" text="Verify information"></label>
    
                                <label class="m-10 t-10 font-italic" textWrap="true" verticalAlignment="center" text="Please validate if the following information is correct and click proceed or go back and fix all the mistakes."></label>
    
    
                                <GridLayout class="m-10" rows="auto" columns="*,auto">
                                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Tenant information"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-circle' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="User name"></label>
                                    <label :text="tenantUserName" row="1" col="1" class="h4"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-person' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Full Names"></label>
                                    <label :text="tenantName" row="1" col="1" class="h4"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-phone' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Contact numbers"></label>
                                    <label :text="tenantNumbers" row="1" col="1" class="h4"></label>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout class="m-10" rows="auto" columns="*,auto">
                                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Lease information"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-home' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Room number"></label>
                                    <label :text="tenantRoom" row="1" col="1" class="h4"></label>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="LEASE START DATE"></label>
                                    <label row="1" col="1" class="h4" :text="leaseStartDate.toISOString().slice(0,10)"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-date-range' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="LEASE END DATE"></label>
                                    <label row="1" col="1" class="h4" :text="leaseEndDate.toISOString().slice(0,10)"></label>
                                </GridLayout>
    
                                <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-update' | fonticon"></label>
                                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="LEASE LENGTH"></label>
                                    <label row="1" col="1" class="h4" :text="leaseTotalMonths + ' month/s'"></label>
                                </GridLayout>
                                <StackLayout width="100%" class="hr-light"></StackLayout>
    
                                <GridLayout class="m-10" rows="auto" columns="*,auto">
                                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Rent information"></label>
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

import * as connectivity from "tns-core-modules/connectivity";

export default {
  data() {
    return {
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
      if (this.currentPage == 0) {
        let answer =
          this.tenantUserName.length > 2 &&
          this.tenantName.length > 2 &&
          this.tenantNumbers.length == 10 &&
          this.tenantName.split(" ").length > 1;
        this.txtError =
          this.tenantName.split(" ").length > 1
            ? ""
            : "Please provide a surname and name separated by a space under full name";
        if (this.txtError.length < 2) {
          this.txtError = answer ? "" : "All fields are required";
        }
        return answer;
      } else if (this.currentPage == 1) {
        this.txtError =
          this.leaseTotalMonths > 0
            ? ""
            : "Please provide a start date that is before the end date";
        if (this.txtError.length < 2) {
          this.txtError =
            this.tenantRoom.length > 0
              ? ""
              : "Please provide a valid room number";
        }
        return this.leaseTotalMonths >= 0 && this.tenantRoom.length > 0;
      } else if (this.currentPage == 2) {
        let answer =
          !isNaN(this.rentAmount) &&
          this.rentAmount > 0 &&
          (!this.hasDeposit ||
            (this.hasDeposit &&
              !isNaN(this.depositAmount) &&
              this.depositAmount > 0));
        this.txtError = answer ? "" : "All fields are required";
        return answer;
      } else if (this.currentPage == 3) {
        let answer =
          (!this.hasBusary ||
            (this.hasBusary && this.busaryProvider.length > 2)) &&
          this.nextOfKin.name.length > 2 &&
          this.nextOfKin.contact.length > 2 &&
          this.nextOfKin.relationship.length > 2;
        this.txtError = answer ? "" : "All fields are required";
        return answer;
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
    AddStudents() {
      dialogs.alert("Add new student").then(() => {
        console.log("FIne");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/variables";
</style>
