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

const router = new VueRouter({
  pageRouting: true,
  routes: [
    {
      name:'home',
      path: '/home',
      component: Home,
      meta: {
        title: 'Home',
      },
    },
    {
      path: '/register',
      component: Register,
      meta: {
        title: 'Register',
      },
    },
    {
      path: '/explore',
      component: Explore,
      meta: {
        title: 'Explore',
      },
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: 'Login',
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
      },
    },
    {
      name:'studentList',
      path: '/admin/fulham/students',
      component: Students,
      meta: {
        title: 'Student List',
      },
    },
    {
      name:'tenantProfileEdit',
      path: '/tenant/profile/edit',
      component: Tenant_EditDetails,
      meta: {
        title: 'Student Edit Profile',
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
      },
    },
    {
      name:'adminDocuments',
      path: '/admin/documents',
      component: DocumentList,
      meta: {
        title: 'Documents',
      },
    },
    {
      name:'adminReminders',
      path: '/admin/reminders',
      component: RemindersList,
      meta: {
        title: 'Reminders',
      },
    },
    {
      name:'adminDashboard',
      path: '/admin/dashboard',
      component: Admin_DashboardVue,
      meta: {
        title: 'Admin Dashboard',
      },
    },
    {
      name:'fulhamHome',
      path: '/admin/fulham/home',
      component:Fulham_HomeVue,
      meta: {
        title: 'Fulham Home',
      },
    },
    {
        name:'fulhamHomeNav',
        path: '/admin/fulham/nav',
        component:BottomNav,
        meta: {
          title: 'Fulham Home',
        },
    },
    {
          name:'adminAddStudents',
          path: '/admin/students/add',
          component:AddStudent,
          meta: {
            title: 'Add Students',
          },
    },
    {
      name:'studentProfile',
      path: '/admin/fulham/student/profile/:profileID',
      component:StudentProfile,
      meta: {
        title: 'StudentProfile',
      },
  },
    {path: '*', redirect: '/home'},
  ],
});

router.beforeEach((to, from, next) => {
  console.log(to.path);
  console.log(from.path);

  console.log("Navigating ..... ");

  next();
})




router.replace('/home');

module.exports = router;
