import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
/* 导入全局样式表*/
import './assets/css/global.css'
/* 导入字体图标*/
import "./assets/fonts/iconfont.css"
/* 配置请求的根路径,注意最后带 / */
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
Vue.config.productionTip = false
/* 通过修改Vue的原型对象，使得每一个Vue实例都可以直接通过this.$http使用axios*/
Vue.prototype.$http = axios
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
