<template>
  <page class="page" actionBarHidden="true" width="100%" height="100%">
    <GridLayout rows="auto,*,auto">
      <StackLayout row="0">
        <CardView elevation="5" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
          <StackLayout>
            <GridLayout class="m-10" rows="auto" columns="*,auto">
              <StackLayout verticalAlignment="center" row="0" col="0">
                <label class="h3" text="Sending a notification"></label>
              </StackLayout>
              <Button row="0" col="1" @tap="navigate(null,true)" selfAlign="right" text="Cancel"></Button>
            </GridLayout>
            <label class="h3 font-weight-bold text-mute text-dark-blue" verticalAlignment="center" textAlignment="center" :text="currentPageTitle"></label>
          </StackLayout>
        </CardView>
        <Progress :value="(currentPage + 1) * 25"></Progress>
      </StackLayout>
      <ScrollView row="1">
        <FlexboxLayout flexDirection="column" justifyContent="center" width="100%">
          <!-- PAGE 0 -->
          <StackLayout v-show="currentPage == 0">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout>
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-switch' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Select a partner or partners"></label>
                    <ScrollView row="1" col="1" orientation="horizontal">
                      <WrapLayout>
                        <Label v-for="(partner,i) in notificationPartners" @tap="addPartnerToNotification(partner,false)" :class="{'chip-selected':notification.partners.indexOf(partner) >= 0}" :text="partner.userName" v-bind:key="i" class="m-10" padding="5" backgroundColor="grey"
                          borderRadius="99%"></Label>
                      </WrapLayout>
                    </ScrollView>
                  </GridLayout>
                  <StackLayout width="80%" textAlignment="center" class="hr-light"></StackLayout>
  
                  <Ripple @tap="changeSelectedNotificationType">
                    <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                      <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-' + notification.type.icon | fonticon"></label>
                      <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Notification type (Tap to change)"></label>
                      <label :text="notification.type.text" row="1" col="1" class="h4"></label>
                    </GridLayout>
                  </Ripple>
                </StackLayout>
              </ScrollView>
            </CardView>
          </StackLayout>
          <StackLayout v-show="currentPage == 1">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout>
                  <Ripple @tap="changeNotificationDate()">
                    <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                      <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-calendar-range' | fonticon"></label>
                      <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Date (tap to change)"></label>
                      <label row="1" col="1" :text="getMoment(notification.sendDateTime).format('DD MMMM YYYY')" class="h4"></label>
                    </GridLayout>
                  </Ripple>
                  <Ripple @tap="changeNotificationTime()">
                    <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                      <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-calendar-clock' | fonticon"></label>
                      <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Time (tap to change)"></label>
                      <label row="1" col="1" :text="getMoment(notification.sendDateTime).format('hh:mm A')" class="h4"></label>
                    </GridLayout>
                  </Ripple>
                </StackLayout>
              </ScrollView>
            </CardView>
          </StackLayout>
  
          <StackLayout v-show="currentPage == 2">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout>
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-message-text-outline' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Title"></label>
                    <TextField row="1" col="1" v-model="notification.title" hint="The title of the notification" returnKeyType="next" class="h4"></TextField>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-message-text' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Message"></label>
                    <TextView row="1" col="1" v-model="notification.body" hint="The message to be sent as a notification" returnKeyType="next" class="h4"></TextView>
                  </GridLayout>
                </StackLayout>
              </ScrollView>
            </CardView>
          </StackLayout>
  
          <StackLayout v-show="currentPage == 3">
            <CardView margin="10" elevation="10" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
              <ScrollView>
                <StackLayout>
  
                  <label class="m-10 t-10 font-italic" textWrap="true" verticalAlignment="center" text="Please validate if the following information is correct and click proceed or go back and fix all the mistakes."></label>
  
                  <GridLayout class="m-10" rows="auto" columns="*,auto">
                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Notification summary"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-message-text-outline' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Title"></label>
                    <label :text="notification.title" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-message-text' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Message"></label>
                    <label :text="notification.body" row="1" col="1" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto" columns="*,auto">
                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Partners that will receive the notification"></label>
                  </GridLayout>
  
                  <GridLayout v-for="(partner,i) in notification.partners" :key="i" class="m-10" rows="auto,auto" columns="auto,*">
                    <Image row="0" rowSpan="2" col="0" verticalAlignment="center" width="40" height="40" class="m-5 circle" stretch="aspectFill" :src="partner.profilePic ? partner.profilePic : $store.state.settings.defaultProfilePic" borderRadius="50%" />
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" :text="partner.userName"></label>
                    <label row="1" col="1" class="h4" :text="partner.fullName"></label>
                  </GridLayout>
                  <StackLayout width="100%" class="hr-light"></StackLayout>
  
                  <GridLayout class="m-10" rows="auto" columns="*,auto">
                    <label row="0" col="0" class="h3 font-weight-bold text-mute text-dark-blue" text="Date time to send the notification"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-calendar-range' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Date"></label>
                    <label row="1" col="1" :text="getMoment(notification.sendDateTime).format('Do MMMM YYYY')" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-calendar-clock' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Time"></label>
                    <label row="1" col="1" :text="getMoment(notification.sendDateTime).format('hh:mm A')" class="h4"></label>
                  </GridLayout>
  
                  <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                    <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-calendar-clock' | fonticon"></label>
                    <label row="0" col="1" class="h3 font-weight-bold text-mute" text="When will the notification be sent?"></label>
                    <label row="1" col="1" :text="(getMoment().diff(notification.sendDateTime,'hours') >= -1) ? 'Immediatly' : getMoment(notification.sendDateTime).fromNow()" class="h4"></label>
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
              <GridLayout v-show="!savedNotification" rows="auto,auto" columns="*,*">
                <Label row="0" colSpan="2" :text="txtError.length < 2 ? '' :txtError" textWrap="true" :class="`text-mute text-light-${txtError.length < 2 ? 'blue' : 'red'}`" textAlignment="center"></Label>
                <Button row="1" col="1" @tap="submitNotification()" v-show="currentPage == 3" class="btn-primary bg-light-green" text="Send"></Button>
                <Button row="1" col="0" @tap="currentPage--" v-show="currentPage > 0" :isEnabled="currentPage > 0" class="btn-primary bg-light-red" text="back"></Button>
                <Button row="1" col="1" @tap="moveForward()" v-show="currentPage != 3" class="btn-primary bg-light-blue" text="proceed"></Button>
              </GridLayout>
              <GridLayout v-show="savedNotification" rows="auto,auto" columns="*">
                <Label row="0" text="Your notification was sent!" textWrap="true" class="text-mute text-light-blue" textAlignment="center"></Label>
                <Button row="1" @tap="navigate('/admin/dashboard')" class="btn-primary bg-light-blue" text="Go Home"></Button>
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
import * as imageSource from "tns-core-modules/image-source";

import * as imagepicker from "nativescript-imagepicker";

import * as connectivity from "tns-core-modules/connectivity";

export default {
  data() {
    return {
      notificationTypes: [
        {
          index: 0,
          text: "Reminder",
          icon: "alarm"
        },
        {
          index: 1,
          text: "Warning",
          icon: "alert-outline"
        },
        {
          index: 2,
          text: "Info",
          icon: "information-variant"
        },
        {
          index: 3,
          text: "Error",
          icon: "alert-circle-outline"
        },
        {
          index: 4,
          text: "Success",
          icon: "check"
        }
      ],
      notificationPartners: [],
      notification: {
        sendDateTime: new Date().setMinutes(new Date().getMinutes() + 10),
        type: {
          index: 0,
          text: "Reminder",
          icon: "alarm"
        },
        fromId: null,
        toId: null,
        partners: [],
        title: "",
        body: ""
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
      savedNotification: false,
      txtError: "",
      currentPage: 0,
      currentPageTitle: "Who to notify?",
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
  props: ["businessName", "businessId"],
  watch: {
    currentPage(newVal, oldVal) {
      switch (newVal) {
        case 0:
          this.currentPageTitle = "Who to notify?";
          break;
        case 1:
          this.currentPageTitle = "When to send the notification";
          break;
        case 2:
          this.currentPageTitle = "What is the notification?";
          break;
        case 3:
          this.currentPageTitle = "Confirm the notification";
          break;
        default:
          this.currentPageTitle = "";
      }
    }
  },
  mounted() {
    this.pageLoaded();
  },
  methods: {
    changeSelectedNotificationType() {
      let index = this.notification.type.index;
      index++;
      if (index >= this.notificationTypes.length) {
        this.notification.type = this.notificationTypes[0];
      } else {
        this.notification.type = this.notificationTypes[index];
      }
    },
    ChangeCheck(event, index) {
      for (let i = 0; i < this.notificationTo.length; i++) {
        if (i == index) {
          this.notificationTo[i].value = event.value;
        } else {
          this.notificationTo[i].value = !event.value;
        }
      }
    },
    changeNotificationDate() {
      var self = this;
      this.$showModal({
        template: ` 
                              <Page>
                                  <GridLayout rows="auto,*,auto" columns="*" width="100%" height="60%">
                                      <Label row="0" class="h3 m-5" :textWrap="true" textAlignment="center" text="When must the notification be sent?"></Label>
                                      <DatePicker verticalAlignment="center" row="1" v-model="selectedDueDate" />
                                      <Label row="2" class="mdi h1 m-5" @tap="changeDueRent($modal)" textAlignment="center" :text="'mdi-check' | fonticon"></Label>
                                  </GridLayout>
                              </Page>
                              `,
        data: function() {
          return {
            selectedDueDate: new Date()
          };
        },
        methods: {
          changeDueRent(modal) {
            var date = self.notification.sendDateTime;
            var now = new Date(
              this.selectedDueDate.getFullYear(),
              this.selectedDueDate.getMonth(),
              this.selectedDueDate.getDate(),
              date.getHours(),
              date.getMinutes()
            );
            self.notification.sendDateTime = now;
            this.$modal.close();
          }
        }
      });
    },
    changeNotificationTime() {
      var self = this;
      this.$showModal({
        template: ` 
                              <Page>
                                  <GridLayout rows="auto,*,auto" columns="*" width="100%" height="60%">
                                      <Label row="0" class="h3 m-5" :textWrap="true" textAlignment="center" text="What time must the notification be sent?"></Label>
                                      <TimePicker v-model="selectedTime" verticalAlignment="center" row="1" />
                                      <Label row="2" class="mdi h1 m-5" @tap="changeDueRent($modal)" textAlignment="center" :text="'mdi-check' | fonticon"></Label>
                                  </GridLayout>
                              </Page>
                              `,
        data: function() {
          return {
            selectedTime: new Date()
          };
        },
        methods: {
          changeDueRent(modal) {
            var date = self.notification.sendDateTime;
            var now = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              this.selectedTime.getHours(),
              this.selectedTime.getMinutes()
            );
            self.notification.sendDateTime = now;
            this.$modal.close();
          }
        }
      });
    },
    pageLoaded(args) {
      var self = this;
      this.ApplyNavigation(self);

      this.loadPartners();
    },
    addPartnerToNotification(partner) {
      if (partner.newIndex != null) {
        partner = this.notificationPartners[partner.newIndex];
      }

      let index = this.notification.partners.indexOf(partner);
      if (index >= 0) {
        this.notification.partners.splice(index, 1);
      } else {
        this.notification.partners.push(partner);
      }
    },
    loadPartners() {
      this.$api
        .getPartners(this.businessId)
        .then(partners => {
          this.notificationPartners = partners;
        })
        .catch(err => {
          this.$feedback.error({
            title: "Unable to load partners",
            duration: 4000,
            message: err.message
          });
        });
    },
    submitNotification() {
      this.isLoading = true;
      this.notification.fromId = this.$store.state.cache.cachedAdmin._id;
      this.notification.type = this.notification.type;
      this.notification.businessID = this.businessId;
      var hoursDiff = this.getMoment().diff(
        this.notification.sendDateTime,
        "hours"
      );
      if (hoursDiff < -1) {
        this.notification.scheduled = true;
        var dateTime = this.notification.sendDateTime;
        this.notification.scheduleInterval = `${dateTime.getMinutes()} ${dateTime.getHours()} ${dateTime.getDate()} ${dateTime.getMonth() +
          1} * `;
      } else {
        this.notification.scheduled = false;
      }
      var sentCount = 0;
      this.notification.partners.forEach(partner => {
        this.notification.toId = partner._id;
        this.$api
          .submitNotification(this.notification)
          .then(response => {
            this.$feedback.success({
              title:
                "Notification successfully " +
                (this.notification.scheduled ? "scheduled for " : "sent to ") +
                partner.userName,
              duration: 5000
            });
            sentCount++;
            if (sentCount == this.notification.partners.length) {
              this.savedNotification = true;
              this.isLoading = false;
            }
          })
          .catch(err => {
            this.$feedback.error({
              title: "NO INTERNET CONNECTION",
              duration: 4000,
              message: "Please switch on your data/wifi."
            });
            sentCount++;
            if (sentCount == this.notification.partners.length) {
              this.savedNotification = true;
              this.isLoading = false;
            }
          });
      });
    },
    canGoForward() {
      this.txtError = "";
      if (this.currentPage == 0) {
        if (this.notification.partners.length < 1) {
          this.txtError = "Please select atleast a partner to notify.";
          return false;
        }
        return true;
      } else if (this.currentPage == 1) {
        if (this.notification.sendDateTime < Date.now()) {
          this.txtError = "Please provide a date that is in the future.";
          return false;
        }
        return true;
      } else if (this.currentPage == 2) {
        if (this.notification.title.length < 2) {
          this.txtError = "Please provide a title for your notification.";
          return false;
        } else if (this.notification.body.length < 2) {
          this.txtError = "A notification requires a longer message.";
          return false;
        }
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
