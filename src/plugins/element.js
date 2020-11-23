import Vue from 'vue'
/*
 全部导入
import Element from 'element-ui'
Vue.use(Element)
*/
/* 按需导入 ，需要导入所需的文件*/
import {
    Button,
    Form,
    FormItem,
    Input,
    Message,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    MenuItem,
    Submenu
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
/*挂载到Vue原型上，使得每一个Vue实例都可以访问Message的JS方法*/
Vue.prototype.$message = Message

