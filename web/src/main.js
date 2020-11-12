import Vue from 'vue'
import App from './App.vue';


import 'element-ui/lib/theme-chalk/index.css';
import './assets/font/iconfont.css';
//引入
import fastClick from 'fastclick'
//初始化FastClick实例。在页面的DOM文档加载完成后
fastClick.attach(document.body)

import './style/common.css'
// import './style/main.css'
// import './style/mobile.css'


//axios
import http from './plugins/axios';
Vue.prototype.$http = http;
//socket.io
import io from './assets/js/socket';
const socket = io(Vue.prototype.$myUrl);

//按需导入
import {
  Pagination, Dialog, Button, Message, Notification,
  Loading, Upload, Form, FormItem, Input, Radio, RadioGroup
} from 'element-ui';
Vue.use(RadioGroup);
Vue.use(Upload);
Vue.use(Button);
Vue.use(Dialog);
Vue.use(Form);
Vue.use(Input);
Vue.use(Radio);
Vue.use(FormItem);
Vue.use(Pagination);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;

//全局混入
Vue.mixin({
  data() {
    return {
      socket
    }
  }
})
console.log(socket);

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
