import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
//使用第三方插件实现树形表格
import TreeTable from 'vue-table-with-tree-grid'
/*全局注册 TreeTable组件*/
Vue.component('tree-table',TreeTable)
import './plugins/element.js'
/* 导入全局样式表*/
import './assets/css/global.css'
/* 导入字体图标*/
import "./assets/fonts/iconfont.css"
import {Tree} from "element-ui";
/* 配置请求的根路径,注意最后带 / */
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/";
/*在向后台发送请求之前进行拦截，进行相应处理后，在向后台发送请求*/
axios.interceptors.request.use(config=>{
    /*应后台API的要求，添加Authorization请求头*/
    config.headers.Authorization = window.sessionStorage.getItem("token");
    // config对象最后必须返回
    return config;
})
Vue.config.productionTip = false
/* 通过修改Vue的原型对象，使得每一个Vue实例都可以直接通过this.$http使用axios*/
Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
