import Vue from "nativescript-vue";

import router from "./router";

import store from "./store";

import {
  Couchbase
} from "nativescript-couchbase";

import moment from "moment";

import "./styles.scss";

import * as connectivity from "tns-core-modules/connectivity";

import * as imagepicker from "nativescript-imagepicker";
import * as imageSource from "tns-core-modules/image-source";

import {
  TNSFontIcon,
  fonticon
} from "nativescript-fonticon"; // require the couchbase module

import {
  Feedback,
  FeedbackType,
  FeedbackPosition
} from "nativescript-feedback";

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  fa: "FontAwesome.css",
  mdi: "MaterialIcons.css"
};
TNSFontIcon.loadCss();

const application = require("application");
const http = require("http");

// Uncommment the following to see NativeScript-Vue output logs
//Vue.config.silent = false;

Vue.registerElement(
  "CardView",
  () => require("nativescript-cardview").CardView
);

Vue.registerElement("Ripple", () => require("nativescript-ripple").Ripple);

Vue.registerElement(
  "PullToRefresh",
  () => require("nativescript-pulltorefresh").PullToRefresh
);

Vue.registerElement(
  "Fab",
  () => require("nativescript-floatingactionbutton").Fab
);

Vue.filter("fonticon", fonticon);

Vue.prototype.$db = new Couchbase("jmrdb");
Vue.prototype.$feedback = new Feedback();

const dialogs = require("ui/dialogs");

import * as Toast from "nativescript-toast";
import * as fs from "tns-core-modules/file-system";
import * as ChangeLog from "./changeLog";

var appSettings = require("application-settings");
Vue.mixin({
  data() {
    return {
      isLoading: false,
      toggleSearch: false
    };
  },
  methods: {
    showChangeLog() {
      var log = ChangeLog.GetLogs("0.3");
      if (log != null && log != undefined) {
        this.$feedback.info({
          title: "Change log ( v" + log.version + " )",
          message: log.text.trim(),
          duration: 90000,
          position: 1
        });
      }
    },
    reportBug() {
      let selectedImage = null;
      let isLoading = false;
      this.$showModal({
        template: ` 
                  <Page>
                     <TabView selectedTabTextColor="#4ac4d5" androidSelectedTabHighlightColor="#0093a4" tabBackgroundColor="transparent">
                        <TabViewItem title="Log a bug">
                           <StackLayout verticalAlignment="center">
                              <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                  <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-account-circle' | fonticon"></label>
                                  <label row="0" col="1" class="h3 font-weight-bold text-mute" text="You are logging the bug as"></label>
                                  <label row="1" col="1" class="h4" :text="$route.meta.userAuthLevel == 1 ? $store.state.cache.cachedTenant.username : $store.state.cache.cachedAdmin.userName"></label>
                              </GridLayout>
                              
                              <StackLayout width="100%" class="hr-light"></StackLayout>
                              <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                                  <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-bug-report' | fonticon"></label>
                                  <label row="0" col="1" class="h3 font-weight-bold text-mute" text="What is the bug?"></label>
                                  <TextView v-model="txtBug" row="1" col="1" class="h4" hint="Please explain in a way that i will understand."></TextView>
                              </GridLayout>
                              <StackLayout width="100%" class="hr-light"></StackLayout>

                              <GridLayout class="m-10" rows="auto,auto,auto" @tap="uploadScreenshot()" columns="auto,*">
                                <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-attach-file' | fonticon"></label>
                                <label row="0" col="1" class="h3 font-weight-bold text-mute" text="Screenshot"></label>
                                <label row="1" col="1" text="Tap to upload a screenshot of the bug" class="h4"></label>
                                <Image row="2" col="1" :src="selectedImage" stretch="aspectFill" width="90%" />
                              </GridLayout>
                              <StackLayout width="100%" class="hr-light"></StackLayout>

                              <ActivityIndicator :busy="isLoading"></ActivityIndicator>
                              <Button text="Submit" v-if="!isLoading" @tap="submitBug()"></Button>
                            </StackLayout>
                        </TabViewItem>
                        <TabViewItem title="View bugs">
                          <StackLayout verticalAlignment="center">
                          <Label textAlignment="center" class="text-muted p-20" text="Pull to refresh the list."></Label>
                            <PullToRefresh row="2" @refresh="refreshList($event)">
                                <ScrollView>
                                <StackLayout>
                                  <StackLayout v-for="(bug,i) in bugs" :key="i">
                                    <Ripple verticalAlignment="center" @tap="getBugScreenshot(bug._id)" borderRadius="50%">
                                        <CardView class="p-10 bg-white" margin="3" elevation="20" radius="10" shadowOffsetHeight="10" shadowOpacity="0.2" shadowRadius="50">
                                            <GridLayout class="p-10" columns="auto,*,auto" rows="auto,auto">
                                                <Image row="0" col="0" rowSpan="2" alignSelf="center" class="p-5" backgroundColor="#ffffff" stretch="aspectFill" :src="bug.senderPic ? bug.senderPic : $store.state.settings.defaultProfilePic"
                                                    width="60" height="60" borderRadius="50%" />
                                                <Label row="0" col="1" class="font-weight-bold" :text="bug.senderName"></Label>
                                                <Label row="0" col="2" class="font-italic text-muted" :text="getMoment(bug.date).fromNow()"></Label>
                                                <Label row="1" col="1" colSpan="2" class="body p-5" :text="bug.bugText" textWrap="true"></Label>
                                                <Label row="1" col="2" class="mdi" textAlignment="right" verticalAlignment="center" :text="'mdi-image' | fonticon" fontSize="20%"></Label>
                                            </GridLayout>
                                        </CardView>
                                    </Ripple>
                                  </StackLayout>
                                  </StackLayout>
                              </ScrollView>
                            </PullToRefresh>
                          </StackLayout>
                        </TabViewItem>
                      </TabView>
                  </Page>
                  `,
        data: function () {
          return {
            txtBug: "",
            bugs: [
              //  {text:'This is the first bug',reporter:'joe',date:new Date(),profilePic:''},{text:'This is the second bug',reporter:'uzzie',date:new Date(),profilePic:''}
            ]
          };
        },
        computed: {
          adminProfile: {
            get() {
              return this.$store.state.cache.cachedAdmin;
            }
          },
        },
        methods: {
          getBugScreenshot(id) {
            // TODO : Add a page for an individual bug discussion.
            return;
            http
              .getJSON(this.$store.state.settings.baseLink + "/a/bug/get/" + id)
              .then(results => {
                this.$feedback.success({
                  title: "Done",
                  duration: 40000,
                  message: results.screenshot
                });
              })
              .catch(err => {
                this.$feedback.error({
                  title: "Error",
                  duration: 4000,
                  message: err
                });
              });
          },
          uploadScreenshot() {
            let context = imagepicker.create({
              mode: "single" // use "multiple" for multiple selection
            });

            context
              .authorize()
              .then(function () {
                return context.present();
              })
              .then(selection => {
                selection.forEach(selected => {
                  // process the selected image
                  selectedImage = selected;
                });
              })
              .catch(err => {
                // process error
              });
          },
          submitBug() {
            isLoading = true;
            http
              .request({
                url: this.$store.state.settings.baseLink + "/a/bug/add",
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                content: JSON.stringify({
                  senderName: this.$route.meta.userAuthLevel == 1 ?
                    this.$store.state.cache.cachedTenant.username : this.$store.state.cache.cachedAdmin.userName,
                  senderPic: this.$route.meta.userAuthLevel == 1 ?
                    this.$store.state.cache.cachedTenant.profilePic : this.$store.state.cache.cachedAdmin.profilePic,
                  bugText: this.txtBug
                })
              })
              .then(response => {
                var answer = response.content.toString();
                var statusCode = response.statusCode;

                isLoading = false;
                if (statusCode == 200) {
                  this.$feedback.success({
                    title: "Your bug was logged successfully",
                    message: "The screenshot was not saved."
                  });
                } else {
                  this.$feedback.error({
                    title: "The bug was not logged.",
                    duration: 40000,
                    message: answer
                  });
                }

                this.$modal.close();
              })
              .catch(err => {
                isLoading = false;
                this.$modal.close();
                this.$feedback.error({
                  duration: 4000,
                  message: err
                });
              });
          },
          refreshList(args) {
            var pullRefresh = args.object;

            var connectionType = connectivity.getConnectionType();
            if (connectionType == connectivity.connectionType.none) {
              this.$modal.close();
              this.$feedback.error({
                title: "NO INTERNET CONNECTION",
                duration: 4000,
                message: "Please switch on your data/wifi."
              });

              pullRefresh.refreshing = false;
            } else {
              http
                .getJSON(this.$store.state.settings.baseLink + "/a/bug/all")
                .then(results => {
                  this.bugs = results;
                  pullRefresh.refreshing = false;
                })
                .catch(err => {
                  this.$modal.close();
                  this.$feedback.error({
                    title: "Error",
                    duration: 4000,
                    message: err
                  });
                  pullRefresh.refreshing = false;
                });
            }
          }
        }
      });
    },
    ApplyNavigation(self) {
      var AndroidApplication = application.android;
      var activity = AndroidApplication.foregroundActivity;
      activity = AndroidApplication.foregroundActivity;
      activity.onBackPressed = function (e) {
        if (self.currentPage && self.currentPage > 0) {
          self.currentPage--;
        } else {
          activity.onBackPressed = function () {
            self.$router.back();
          };
          self.$router.back();
        }
      };
    },
    logBug() {
      console.log("Logggging bug");
    },
    getMoment(val) {
      return moment(val);
    },
    loginTenant(self, result) {
      appSettings.setNumber("authLevel", 1);

      self.$store.commit("login", {
        id: result._id,
        userName: result.username,
        pass: result.password,
        email: result.email,
        numbers: result.contactNumbers,
        profilePic: result.profilePic,
        role: null,
        isLoggedIn: true,
        isAdmin: false
      });

      self.$store.commit("cacheUser", {
        db: self.$db,
        appSettings: appSettings,
        user: result,
        isAdmin: false
      });
    },
    loginAdmin(self, result) {
      appSettings.setNumber("authLevel", 3);

      self.$store.commit("login", {
        id: result._id,
        userName: result.userName,
        pass: result.pass,
        email: result.email,
        numbers: result.numbers,
        profilePic: result.profilePic,
        role: result.role,
        isLoggedIn: true,
        isAdmin: true
      });

      self.$store.commit("cacheUser", {
        db: self.$db,
        appSettings: appSettings,
        user: result,
        isAdmin: true
      });

      self.$store.dispatch("PopulateNotifications", {
        notifications: result.notifications.filter(v => v.dueDate == null)
      });

      self.$store.dispatch("PopulateTasks", {
        tasks: result.notifications.filter(v => v.dueDate != null)
      });
    },
    loadData(userAuthLevel) {
      if (userAuthLevel == 1) {
        this.loadTenantData();
      } else if (userAuthLevel == 3) {
        this.loadAdminData();
      }
    },
    loadTenantData() {
      this.isLoading = true;
      var user = this.$store.state.cache.cachedTenant;
      if (user != null) {
        this.loginTenant(this, user);
        this.isLoading = false;
        this.$router.push("/tenant/dashboard");
      } else {
        this.$feedback.error({
          title: "Error not expected",
          duration: 4000,
          message: "Report this as (Error : VVPAOS09)"
        });
        this.isLoading = false;
      }
    },
    loadAdminData() {
      this.isLoading = true;
      var user = this.$store.state.cache.cachedAdmin;
      if (user != null) {
        this.loginAdmin(this, user);
        this.isLoading = false;
        this.$router.push("/admin/dashboard");
      } else {
        this.$feedback.error({
          title: "Error not expected",
          duration: 4000,
          message: "Report this as (Error : RVPAOS09)"
        });
        this.isLoading = false;
      }
    },
    logOut() {
      dialogs
        .confirm({
          title: "Confirm log out",
          message: "You want to log out?",
          okButtonText: "Yes",
          cancelButtonText: "No"
        })
        .then(result => {
          if (result) {
            appSettings.setNumber("authLevel", -1);
            this.$router.replace("/home");
          }
        });
    }
  }
});

new Vue({
  router,
  store
}).$start();