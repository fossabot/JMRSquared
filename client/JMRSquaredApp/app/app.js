const Vue = require('nativescript-vue/dist/index')
const http = require("http")

import App from './components/App.vue'

import './app.scss'

Vue.prototype.$http = http

new Vue({
    render: h => h('app'),

    components: {
        App
    }
}).$start();