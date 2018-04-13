import Vue from 'nativescript-vue';

import router from './router';

import store from './store';

import { Couchbase } from "nativescript-couchbase";

import './styles.scss';

import { TNSFontIcon, fonticon } from 'nativescript-fonticon';// require the couchbase module

import  { Feedback, FeedbackType, FeedbackPosition }  from "nativescript-feedback";

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  fa: 'FontAwesome.css',
  mdi:'MaterialIcons.css'
};
TNSFontIcon.loadCss();

const application = require('application')

// Uncommment the following to see NativeScript-Vue output logs
//Vue.config.silent = false;

Vue.registerElement('CardView', () => require('nativescript-cardview').CardView)

Vue.registerElement('Ripple', () => require('nativescript-ripple').Ripple)

Vue.registerElement('PullToRefresh', () => require('nativescript-pulltorefresh').PullToRefresh)

Vue.filter('fonticon', fonticon);

Vue.prototype.$db = new Couchbase("jmrdb");
Vue.prototype.$feedback = new Feedback();

Vue.mixin({
  methods: {
    reportBug(){
      this.$showModal({
        template: ` 
                  <Page>
                    <StackLayout>
                      <GridLayout class="m-10" rows="auto,auto" columns="auto,*">
                          <label row="0" rowSpan="2" col="0" verticalAlignment="center" textAlignment="center" class="mdi m-15" fontSize="25%" :text="'mdi-bug-report' | fonticon"></label>
                          <label row="0" col="1" class="h3 font-weight-bold text-mute" text="What is the bug?"></label>
                          <TextView v-model="txtBug" row="1" col="1" class="h4" hint="Please explain in a way that i will understand."></TextView>
                      </GridLayout>
                      <StackLayout width="100%" class="hr-light"></StackLayout>
                      <Button text="Submit" @tap="submitBug()"></Button>
                    </StackLayout>
                  </Page>
                  `,
        data: function() {
          return {
            txtBug:''
          }
        },
        methods: {
          submitBug() {
            alert("We got us a bug");
            alert(txtBug);
          }
        },
      })
    },
    ApplyNavigation(self){
      var AndroidApplication = application.android;
      var activity = AndroidApplication.foregroundActivity;
      activity = AndroidApplication.foregroundActivity;
      activity.onBackPressed = function(e) {
          if (self.currentPage && self.currentPage > 0) {
              self.currentPage--;
          } else {
              activity.onBackPressed = function() {
                  self.$router.back();
              }
              self.$router.back();
          }

      };
    },
    logBug(){
      console.log("Logggging bug");
    },
    loginAdmin(self, result) {
  
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

      self.$store.dispatch("PopulateNotifications", {
        notifications: result.notifications.filter((v) => v.dueDate == null)
      });

      self.$store.dispatch("PopulateTasks", {
        tasks: result.notifications.filter((v) => v.dueDate != null)
      });
    }
  }
});

new Vue({
  router,
  store,
}).$start();
