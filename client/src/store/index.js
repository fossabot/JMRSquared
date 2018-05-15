import Vue from 'nativescript-vue';
import Vuex from 'vuex';

import user from './modules/user';
import settings from './modules/settings';
import collections from './modules/collections';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    user,
    settings,
    collections
  },
  strict: debug,
});

Vue.prototype.$store = store;

module.exports = store;