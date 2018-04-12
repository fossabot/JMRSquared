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

// Uncommment the following to see NativeScript-Vue output logs
//Vue.config.silent = false;

Vue.registerElement('CardView', () => require('nativescript-cardview').CardView)

Vue.registerElement('PullToRefresh', () => require('nativescript-pulltorefresh').PullToRefresh)

Vue.filter('fonticon', fonticon);

Vue.prototype.$db = new Couchbase("jmrdb");
Vue.prototype.$feedback = new Feedback();

Vue.mixin({
  methods: {
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
