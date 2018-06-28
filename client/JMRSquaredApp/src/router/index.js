import Vue from 'nativescript-vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Explore from '../components/Explore.vue'
import Login from '../components/Login.vue'

import Admin_DashboardVue from '../components/Admin/Admin_Dashboard.vue'

import Tenant_DashboardVue from '../components/Tenant/Tenant_Dashboard.vue'

import Fulham_HomeVue from '../components/Admin/Fulham_Home.vue'
import EditDetails from '../components/Admin/EditDetails.vue'


import BottomNav from '../components/BottomNav.vue'
import StudentProfile from '../components/Admin/Fulham/StudentProfile.vue'

import DocumentList from '../components/Admin/DocumentList.vue'
import RemindersList from '../components/Admin/RemindersList.vue'

import AddStudent from '../components/Admin/Fulham/AddStudent.vue'


import StudentList from '../components/StudentList.vue'

import Tenant_EditDetails from '../components/Tenant/Tenant_EditDetails.vue'

import TaxifyHome from '../components/Taxify/TaxifyHome.vue'
import TaxifyTransactions from '../components/Taxify/TaxifyTransactions.vue'

import CosmeticsHome from '../components/Cosmetics/CosmeticsHome.vue'
import CosmeticsTransactions from '../components/Cosmetics/CosmeticsTransactions.vue'

const http = require("http");

import store from '../store';

var appSettings = require("application-settings");
import {
  Feedback,
  FeedbackType,
  FeedbackPosition
} from "nativescript-feedback";
var feedback = new Feedback();

const router = new VueRouter({
  pageRouting: true,
  routes: [{
      name: 'home',
      path: '/home',
      component: Home,
      meta: {
        title: 'Home',
        authLevel: 0
      },
    },
    {
      path: '/register',
      component: Register,
      meta: {
        title: 'Register',
        authLevel: 0
      },
    },
    {
      path: '/explore',
      component: Explore,
      meta: {
        title: 'Explore',
        authLevel: 0
      },
    },
    {
      name: 'login',
      path: '/login',
      component: Login,
      meta: {
        title: 'Login',
        authLevel: 0
      },
    },
    /**
     * Tenant staff START
     */
    {
      name: 'tenantDashboard',
      path: '/tenant/dashboard',
      component: Tenant_DashboardVue,
      meta: {
        title: 'Tenant Dashboard',
        authLevel: 1
      },
    },
    {
      name: 'studentList',
      path: '/admin/fulham/students',
      component: StudentList,
      meta: {
        title: 'Student List',
        authLevel: 0
      },
    },
    {
      name: 'tenantProfileEdit',
      path: '/tenant/profile/edit/:profileID',
      component: Tenant_EditDetails,
      meta: {
        title: 'Student Edit Profile',
        authLevel: 2
      },
    },
    /**
     * Tenant staff END
     */
    /**
     * Taxify staff start
     */
    {
      name: 'taxifyHome',
      path: '/taxify/home',
      component: TaxifyHome,
      meta: {
        title: 'TaxifyHome',
        authLevel: 3,
        source: 'TAXIFY'
      },
    },
    {
      name: 'taxifyTransactions',
      path: '/taxify/transactions',
      component: TaxifyTransactions,
      meta: {
        title: 'TaxifyTransactions',
        authLevel: 3,
        source: 'TAXIFY'
      },
    },

    /**
     * Taxify staff END
     */

    /**
     * Cosmetics staff START
     */
    {
      name: 'cosmeticsHome',
      path: '/cosmetics/home',
      component: CosmeticsHome,
      meta: {
        title: 'CosmeticsHome',
        authLevel: 3,
        source: 'COSMETICS'
      },
    },
    {
      name: 'cosmeticsTransactions',
      path: '/cosmetics/transactions',
      component: CosmeticsTransactions,
      meta: {
        title: 'CosmeticsTransactions',
        authLevel: 3,
        source: 'COSMETICS'
      },
    },
    /**
     * Cosmetics staff END
     */

    /**
     * Admin stuff START
     */
    {
      name: 'adminProfileEdit',
      path: '/admin/profile/edit',
      component: EditDetails,
      meta: {
        title: 'ProfileEdit',
        authLevel: 3,
        source: 'PROPERTY'
      },
    },
    {
      name: 'adminDocuments',
      path: '/admin/documents',
      component: DocumentList,
      meta: {
        title: 'Documents',
        authLevel: 3,
        source: 'PROPERTY'
      },
    },
    {
      name: 'adminReminders',
      path: '/admin/reminders',
      component: RemindersList,
      meta: {
        title: 'Reminders',
        authLevel: 3,
        source: 'PROPERTY'
      },
    },
    {
      name: 'adminDashboard',
      path: '/admin/dashboard',
      component: Admin_DashboardVue,
      meta: {
        title: 'Admin Dashboard',
        authLevel: 3,
        source: null
      },
    },
    {
      name: 'fulhamHome',
      path: '/admin/fulham/home',
      component: Fulham_HomeVue,
      meta: {
        title: 'Fulham Home',
        authLevel: 3,
        source: 'PROPERTY'
      },
    },
    {
      name: 'fulhamHomeNav',
      path: '/admin/fulham/nav',
      component: BottomNav,
      meta: {
        title: 'Fulham Home',
        authLevel: 3,
        source: 'PROPERTY'
      },
    },
    {
      name: 'adminAddStudents',
      path: '/admin/students/add',
      component: AddStudent,
      meta: {
        title: 'Add Students',
        authLevel: 3,
        source: 'PROPERTY'
      },
    },
    {
      name: 'studentProfile',
      path: '/admin/fulham/student/profile/:profileID',
      component: StudentProfile,
      meta: {
        title: 'StudentProfile',
        authLevel: 1
      },
    },
    {
      path: '*',
      redirect: '/home'
    },
  ],
});

router.beforeEach((to, from, next) => {
  let authLevel = appSettings.getNumber("authLevel");

  let documentID = appSettings.getString(store.state.cache.adminLoggedInString) != null ? appSettings.getString(store.state.cache.adminLoggedInString) : appSettings.getString(store.state.cache.tenantLoggedInString);

  if (isNaN(authLevel) && documentID == null) {
    authLevel = 0;
    appSettings.setNumber("authLevel", authLevel);
  } else if (documentID != null && authLevel < 0) {
    authLevel = appSettings.getString(store.state.cache.adminLoggedInString) != null ? -1 : -2;
    appSettings.setNumber("authLevel", authLevel);
  }

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
        if (to.meta.source != null && to.meta.source != store.state.user.role && store.state.user.role != "ALL") {
          feedback.error({
            title: "You are not Authorized to access this page!",
            message: "You have permissions to access " + store.state.user.role + " only "
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
})

router.replace('/home');

module.exports = router;