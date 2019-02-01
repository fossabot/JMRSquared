import Vue from "nativescript-vue";
import App from "./components/App";

import store from "./store";

import moment from "moment";

import "./styles.scss";

import * as connectivity from "tns-core-modules/connectivity";

import * as imagepicker from "nativescript-imagepicker";
import * as imageSource from "tns-core-modules/image-source";

import {
  TNSFontIcon,
  fonticon
} from "nativescript-fonticon"; // require the couchbase module

TNSFontIcon.debug = true;
TNSFontIcon.paths = {
  mdi: "./assets/materialdesignicons.css"
};
TNSFontIcon.loadCss();

Vue.config.silent = TNS_ENV === "production";
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

Vue.registerElement(
  "DropDown",
  () => require("nativescript-drop-down/drop-down").DropDown
);

Vue.registerElement(
  "CheckBox",
  () => require("nativescript-checkbox").CheckBox, {
    model: {
      prop: 'checked',
      event: 'checkedChange'
    }
  }
);

Vue.registerElement(
  "ImageZoom",
  () => require('nativescript-image-zoom').ImageZoom
);

Vue.filter("fonticon", fonticon);

import master from "./services/master";
Vue.prototype.$db = master.couchDB;
Vue.prototype.$feedback = master.feedback;
Vue.prototype.$approx = master.approximateNumber;
Vue.prototype.appSettings = master.appSettings;
Vue.prototype.$firebase = master.firebase;
Vue.prototype.$api = master.http;

import router from "./services/router";
import Navigator from "nativescript-vue-navigator";
Vue.use(Navigator, {
  routes: router.routes
});
Vue.prototype.$router = router;
Vue.prototype.$route = null;

const dialogs = require("ui/dialogs");
var application = require("application");

Vue.mixin({
  data() {
    return {
      isLoading: false,
      toggleSearch: false,
      master: master
    };
  },
  beforeCreate() {
    if (!this.$route) {
      this.$route = this.$navigator.route;
      //this.$route.meta.userAuthLevel = 0;
    }
    if (!this.$firebase || !this.$firebase.initialized) {
      master
        .initFCM(this)
        .then(instance => {
          console.log("firebase instance", this.$firebase);
          this.$firebase = instance;
          console.log("firebase instance", this.$firebase);
        })
        .catch(err => {
          console.log("tag", err);
        });
    }
    console.log('Device_Token', this.appSettings.getString("device_token"));
    if (this.$store.state.cache.cachedAdmin) {
      console.log('LoggedIn device Token', this.$store.state.cache.cachedAdmin.device_token);
    } else {
      console.log('LoggedIn device Token', 'No cached user');
    }
  },
  mounted() {

  },
  computed: {
    adminProfile: {
      get() {
        return this.$store.state.cache.cachedAdmin;
      }
    }
  },
  methods: {
    notificationReceived(result) {
      var message = JSON.stringify(result);
      console.log(message);
      master.feedback.success({
        title: 'message.title',
        duration: 4000,
        message: 'message.body',
        onTap: () => {
          self.navigate('/home');
        }
      })
    },
    navigate(to, props = null, options = null) {
      if (to == null) {
        if (this.currentPage && this.currentPage > 0 && !props) {
          this.currentPage--;
        } else {
          this.$navigator.back();
        }
      } else {
        options = options || {};
        options.props = props;
        console.log('Option', options);
        this.$navigator.navigate(to, options);
      }
    },
    showChangeLog() {
      var log = master.ChangeLog.GetLogs("0.3");
      if (log != null && log != undefined) {
        master.feedback.info({
          title: "Change log ( v" + log.version + " )",
          message: log.text.trim(),
          duration: 90000,
          position: 1
        });
      }
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
            self.navigate(null);
          };
          self.navigate(null);
        }
      };
    },
    getMoment(val) {
      return moment(val);
    },
    loginTenant(self, result) {
      this.appSettings.setNumber("authLevel", 1);

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
        api: self.$api,
        appSettings: this.appSettings,
        user: result,
        isAdmin: false
      });
    },
    loginAdmin(self, result) {
      this.appSettings.setNumber("authLevel", 3);

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
        api: self.$api,
        appSettings: this.appSettings,
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
        this.navigate("/tenant/dashboard");
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
        this.navigate("/admin/dashboard");
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
            this.appSettings.setNumber("authLevel", -1);
            this.$router.userAuthLevel = null;
            this.navigate("/home", null, {
              clearHistory: true
            });
          }
        });
    }
  }
});

new Vue({
  store,
  render: h => h(App)
}).$start();