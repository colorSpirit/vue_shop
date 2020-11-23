import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home
  }
]

const router = new VueRouter({
  routes
})
// 添加全局前置导航守卫
router.beforeEach((to,from,next)=>{
     // next() 放行， next("/path") 强制跳转
  if(to.path==='/login')return next();
  //如果不是登录页，则进行相应的处理
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr)return next("/login");
  next();

})
export default router
