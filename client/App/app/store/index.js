import Vue from 'nativescript-vue';
import Vuex from 'vuex';

import user from './modules/user';
import settings from './modules/settings';
import collections from './modules/collections';
import cache from './modules/cache';

Vue.use(Vuex);

const debug = TNS_ENV !== 'production';

const store = new Vuex.Store({
  modules: {
    user,
    settings,
    collections,
    cache
  },
  strict: debug,
});

Vue.prototype.$store = store;

export default store;