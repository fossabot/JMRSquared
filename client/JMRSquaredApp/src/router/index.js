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


import Students from '../components/Admin/Fulham/Students.vue'

import Tenant_EditDetails from '../components/Tenant/Tenant_EditDetails.vue'

const http = require("http");

import store from '../store';

var appSettings = require("application-settings");
import  { Feedback, FeedbackType, FeedbackPosition }  from "nativescript-feedback";
var feedback = new Feedback();

const router = new VueRouter({
  pageRouting: true,
  routes: [
    {
      name:'home',
      path: '/home',
      component: Home,
      meta: {
        title: 'Home',
        authLevel:0
      },
    },
    {
      path: '/register',
      component: Register,
      meta: {
        title: 'Register',
        authLevel:0
      },
    },
    {
      path: '/explore',
      component: Explore,
      meta: {
        title: 'Explore',
        authLevel:0
      },
    },
    {
      name:'login',
      path: '/login',
      component: Login,
      meta: {
        title: 'Login',
        authLevel:0
      },
    },
    /**
     * Tenant staff START
     */
    {
      name:'tenantDashboard',
      path: '/tenant/dashboard',
      component: Tenant_DashboardVue,
      meta: {
        title: 'Tenant Dashboard',
        authLevel:1
      },
    },
    {
      name:'studentList',
      path: '/admin/fulham/students',
      component: Students,
      meta: {
        title: 'Student List',
        authLevel:0
      },
    },
    {
      name:'tenantProfileEdit',
      path: '/tenant/profile/edit',
      component: Tenant_EditDetails,
      meta: {
        title: 'Student Edit Profile',
        authLevel:2
      },
    },
     /**
      * Tenant staff END
      */
    /**
     * Admin stuff START
     */
    {
      name:'adminProfileEdit',
      path: '/admin/profile/edit',
      component: EditDetails,
      meta: {
        title: 'ProfileEdit',
        authLevel:3
      },
    },
    {
      name:'adminDocuments',
      path: '/admin/documents',
      component: DocumentList,
      meta: {
        title: 'Documents',
        authLevel:3
      },
    },
    {
      name:'adminReminders',
      path: '/admin/reminders',
      component: RemindersList,
      meta: {
        title: 'Reminders',
        authLevel:3
      },
    },
    {
      name:'adminDashboard',
      path: '/admin/dashboard',
      component: Admin_DashboardVue,
      meta: {
        title: 'Admin Dashboard',
        authLevel:3
      },
    },
    {
      name:'fulhamHome',
      path: '/admin/fulham/home',
      component:Fulham_HomeVue,
      meta: {
        title: 'Fulham Home',
        authLevel:3
      },
    },
    {
        name:'fulhamHomeNav',
        path: '/admin/fulham/nav',
        component:BottomNav,
        meta: {
          title: 'Fulham Home',
        authLevel:3
        },
    },
    {
          name:'adminAddStudents',
          path: '/admin/students/add',
          component:AddStudent,
          meta: {
            title: 'Add Students',
            authLevel:3
          },
    },
    {
      name:'studentProfile',
      path: '/admin/fulham/student/profile/:profileID',
      component:StudentProfile,
      meta: {
        title: 'StudentProfile',
        authLevel:1
      },
  },
    {path: '*', redirect: '/home'},
  ],
});

router.beforeEach((to, from, next) => {
  let authLevel = appSettings.getNumber("authLevel");
  appSettings.setBoolean("isLoading",false);

  let documentID = appSettings.getString(store.state.cache.adminLoggedInString) != null ? appSettings.getString(store.state.cache.adminLoggedInString) : appSettings.getString(store.state.cache.tenantLoggedInString);
   
  if(isNaN(authLevel) || documentID == null) {
    authLevel = 0;
    appSettings.setNumber("authLevel",authLevel);
  }
  
  switch(to.meta.authLevel){
    case 1:
      if(authLevel < 1){
        feedback.error({ title : "You are not Authorized to access this page!"});
        return;
      }
    break;
    case 2:
      if(authLevel < 2){
        feedback.error({ title : "You are not Authorized to access this page!"});
          return;
        }
    break;
    case 3:
      if(authLevel < 3){
        feedback.error({ title : "You are not Authorized to access this page!"});
        return;
      }
    break;
  }

  to.meta.userAuthLevel = authLevel;

  if(to.name == 'studentProfile'){
    http.getJSON(store.state.settings.baseLink + "/s/" + to.params.profileID + "/get").then((student) => {
      to.meta.user = student;
      next();
    }).catch(err=>{
        alert(err);
    });
  }else if(to.name == 'login'){
    next();
  }else if(to.name == 'home'){
    next();
  }else{
    next();
  }
})

router.replace('/home');

module.exports = router;
