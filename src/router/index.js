import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from "../components/user/Users"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    /*
    * 注意重定向到同级组件和重定向到子组件的区别，
    * 重定向到子组件，则该组件仍然会显示，子组件会在该组件中的router-view处显示，如果没有router-view则子组件不会显示
    * */
    {
        path: '/home',
        component: Home,
        redirect: "/welcome",
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            }
        ]
    }
]

const router = new VueRouter({
    routes
})
// 添加全局前置导航守卫
router.beforeEach((to, from, next) => {
    // next() 放行， next("/path") 强制跳转
    if (to.path === '/login') return next();
    //如果不是登录页，则进行相应的处理
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next("/login");
    next();

})
export default router
