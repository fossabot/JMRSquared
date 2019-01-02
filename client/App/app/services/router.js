import Home from '../components/pages/main/Home.vue'
import Login from '../components/pages/main/Login.vue'

// Admin
import AdminDashboard from '../components/pages/admin/Dashboard.vue'
import EditDetails from '../components/pages/admin/EditDetails.vue'

// Business
import AddBusiness from '../components/pages/business/AddBusiness.vue'
import AddPartner from '../components/pages/business/AddPartner.vue'
import AddTransaction from '../components/pages/business/AddTransaction.vue'
import BusinessHome from '../components/pages/business/BusinessHome.vue'

// Business Components
import PartnersList from '../components/pages/business/Components/PartnersList.vue'
import ExpensesList from '../components/pages/business/Components/ExpensesList.vue'
import IncomeList from '../components/pages/business/Components/IncomeList.vue'

// Notifications
import SendNotification from '../components/pages/notification/SendNotification.vue'

const http = require("http");
import store from '../store';

var appSettings = require("application-settings");
import {
  Feedback,
  FeedbackType,
  FeedbackPosition
} from "nativescript-feedback";
var feedback = new Feedback();
var router = {};

router.routes = {
  /** 
   * Main Routes
   */
  '/home': {
    name: 'home',
    path: '/home',
    component: Home,
    meta: {
      title: 'Home',
      authLevel: 0
    },
  },
  '/login': {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      title: 'Login',
      authLevel: 0
    },
  },
  /** 
   * Admin Routes
   */
  '/admin/profile/edit': {
    name: 'adminProfileEdit',
    path: '/admin/profile/edit',
    component: EditDetails,
    meta: {
      title: 'ProfileEdit',
      authLevel: 3,
      source: 'PROPERTY'
    },
  },
  '/admin/dashboard': {
    name: 'adminDashboard',
    path: '/admin/dashboard',
    component: AdminDashboard,
    meta: {
      title: 'Admin Dashboard',
      authLevel: 3,
      source: null
    },
  },
  /**
   * Business Routes
   */
  '/business/add/business': {
    name: 'AddBusiness',
    path: '/business/add/business',
    component: AddBusiness,
    meta: {
      title: 'Add Business',
      authLevel: 3,
      source: null
    },
  },
  '/business/add/transaction': {
    name: 'AddTransaction',
    path: '/business/add/transaction/:businessId/:businessName/:businessSettings',
    component: AddTransaction,
    meta: {
      title: 'Add Transaction',
      authLevel: 3,
      source: null
    },
  },
  '/business/add/partner': {
    name: 'AddPartner',
    path: '/business/add/partner/:businessId/:businessName',
    component: AddPartner,
    meta: {
      title: 'Add Partner',
      authLevel: 3,
      source: null
    },
    props: true
  },
  '/business/home': {
    name: 'BusinessHome',
    path: '/business/home/:businessID',
    component: BusinessHome,
    meta: {
      title: 'Business Home',
      authLevel: 3,
      source: null
    },
    props: true
  },
  '/business/partners/list': {
    name: 'PartnersList',
    path: '/business/partners/list/:businessID/:businessName',
    component: PartnersList,
    meta: {
      title: 'Partners list',
      authLevel: 3,
      source: null
    },
    props: true
  },
  '/business/expenses/list': {
    name: 'ExpensesList',
    path: '/business/expenses/list/:businessID/:businessName',
    component: ExpensesList,
    meta: {
      title: 'Expenses list',
      authLevel: 3,
      source: null
    },
    props: true
  },
  '/business/income/list': {
    name: 'IncomeList',
    path: '/business/income/list/:businessID/:businessName',
    component: IncomeList,
    meta: {
      title: 'Income list',
      authLevel: 3,
      source: null
    },
    props: true
  },
  /**
   * Notification
   */
  '/notification/send': {
    name: 'SendNotification',
    path: '/notification/send/:businessID',
    component: SendNotification,
    meta: {
      title: 'Send Notification',
      authLevel: 3,
      source: null
    },
    props: true
  }
};

router.current = {
  userAuthLevel: () => {
    if (router.userAuthLevel == null) {
      let authLevel = appSettings.getNumber("authLevel");

      let documentID = appSettings.getString(store.state.cache.adminLoggedInString) != null ? appSettings.getString(store.state.cache.adminLoggedInString) : appSettings.getString(store.state.cache.tenantLoggedInString);

      if (isNaN(authLevel) && documentID == null) {
        authLevel = 0;
        appSettings.setNumber("authLevel", authLevel);
      } else if (documentID != null && authLevel < 0) {
        authLevel = appSettings.getString(store.state.cache.adminLoggedInString) != null ? -1 : -2;
        appSettings.setNumber("authLevel", authLevel);
      }

      router.userAuthLevel = authLevel;
    }
    return router.userAuthLevel
  }
}

router.beforeEach = (to, from, next) => {
  let authLevel = appSettings.getNumber("authLevel");

  let documentID = appSettings.getString(store.state.cache.adminLoggedInString) != null ? appSettings.getString(store.state.cache.adminLoggedInString) : appSettings.getString(store.state.cache.tenantLoggedInString);

  if (isNaN(authLevel) && documentID == null) {
    authLevel = 0;
    appSettings.setNumber("authLevel", authLevel);
  } else if (documentID != null && authLevel < 0) {
    authLevel = appSettings.getString(store.state.cache.adminLoggedInString) != null ? -1 : -2;
    appSettings.setNumber("authLevel", authLevel);
  }

  // feedback.error({
  //   title: "Your level " + authLevel,
  //   message: "You have permissions to access " + store.state.cache.cachedAdmin.role + " only ... Trying to access " + to.meta.authLevel + " " + to.name
  // });

  switch (to.meta.authLevel) {
    case 1:
      if (authLevel < 1) {
        feedback.error({
          title: "You are not Authorized to access this page!"
        });
        return;
      }
      break;
    case 2:
      if (authLevel < 2) {
        feedback.error({
          title: "You are not Authorized to access this page!"
        });
        return;
      }
      break;
    case 3:
      if (authLevel < 3) {
        feedback.error({
          title: "You are not Authorized to access this page!"
        });
        return;
      } else {
        if (to.meta.source != null && to.meta.source != store.state.cache.cachedAdmin.role && store.state.cache.cachedAdmin.role != "ALL") {
          feedback.error({
            title: "You are not Authorized to access this page!",
            message: "You have permissions to access " + store.state.cache.cachedAdmin.role + " only "
          });
          return;
        }
      }
      break;
  }

  to.meta.userAuthLevel = authLevel;

  if (to.name == 'studentProfile' || to.name == 'tenantProfileEdit') {
    http.getJSON(store.state.settings.baseLink + "/s/" + to.params.profileID + "/get").then((student) => {
      to.meta.user = student;
      next();
    }).catch(err => {
      alert(err);
    });
  } else {
    next();
  }
}

router.goto = function (to, options, self) {
  var path = router.routes.filter(t => t.path == to)[0];
  if (path) {
    path.meta.userAuthLevel = 0;
    options.props = {
      '$route': path,
      'name': 'joe'
    };
    options.transition = {
      name: "fade",
      duration: 100,
      curve: "easeIn"
    }
    console.log('routing', path);
    console.log('navigating', options)
    console.log('this', this);
    console.log('self', self);
    this.$navigateTo(path.component, options);
  } else {
    console.log('InvalidNavigate', "Sorry we cant take you to the requested route");
  }
}

export default router;

/*
export default class Router {
  constructor(self) {
    this.self = self;
  }

  push(to) {
    console.log("selfie", this.self);
    console.log("this", this);
      this.self.$navigateTo(path.component, options);
    //this.goto(to, {})
  }

  goto(to, options) {
    var path = router.routes.filter(t => t.path == to)[0];
    if (path) {
      path.meta.userAuthLevel = 0;
      options.props = {
        '$route': path,
        'name': 'joe'
      };
      options.transition = {
        name: "fade",
        duration: 100,
        curve: "easeIn"
      }
      console.log('thissss', this);
      this.self = this;
      console.log('routing', path);
      this.$navigateTo(path.component, options);
    } else {
      console.log('InvalidNavigate', "Sorry we cant take you to the requested route");
    }
  }
};

*/