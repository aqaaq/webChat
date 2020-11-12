import axios from 'axios';
import Vue from 'vue';

Vue.prototype.$myUrl = '/';
// Vue.prototype.$myUrl = 'http://localhost:3000';
// console.log(Vue.prototype.$myUrl)
const http = axios.create({
    baseURL: Vue.prototype.$myUrl,
    timeout: 5000,
})

//前置钩子
http.interceptors.request.use(config => {
    if (localStorage.token) {
        const token = 'Bearer ' + localStorage.token;
        config.headers.authorization = token;
    }
    return config;
})

//后置钩子
http.interceptors.response.use((data) => {
    return data
}, (err) => {
    if (!err.response) {

        Vue.prototype.$message.error(err.message);
        return ''
    }
    if (err.response.data.message) {
        Vue.prototype.$message.error(err.response.data.message);
    } else {
        Vue.prototype.$message.error(err.message)
    }
})
export default http;