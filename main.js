import Vue from 'vue'
import App from './App'

import HttpRequest from './common/httpRequest.js'
import HttpCache from './common/cache.js'
import queue from './common/queue.js'

import store from './store/index.js'

Vue.config.productionTip = false
Vue.prototype.$Request = HttpRequest;
Vue.prototype.$queue = queue;

Vue.prototype.$Sysconf = HttpRequest.config;
Vue.prototype.$SysCache = HttpCache;



App.mpType = 'app'

// 引入全局uView
import uView from "uview-ui";
Vue.use(uView);

const app = new Vue({
	store,
    ...App
})

app.$mount()
