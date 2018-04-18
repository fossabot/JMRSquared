import Vue from 'nativescript-vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from '../components/Home.vue'
import Register from '../components/Register.vue'
import Explore from '../components/Explore.vue'
import Login from '../components/Login.vue'

import Admin_DashboardVue from '../components/Admin/Admin_Dashboard.vue'

import Fulham_HomeVue from '../components/Admin/Fulham_Home.vue'


import BottomNav from '../components/BottomNav.vue'
import StudentProfile from '../components/Admin/Fulham/StudentProfile.vue'

import DocumentList from '../components/Admin/DocumentList.vue'
import RemindersList from '../components/Admin/RemindersList.vue'

import AddStudent from '../components/Admin/Fulham/AddStudent.vue'

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
