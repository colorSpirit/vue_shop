<template>
    <el-container class="home-container">
        <!--头部区域-->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商平台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!--页面主体区域-->
        <el-container>
            <!--侧边栏-->
            <el-aside :width="isCollapse?'64px':'200px'">
                <!--展开或折叠所有菜单-->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff"
                        :unique-opened="true"
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        :router="true"
                        :default-active="activePath">
                    <!--
                    element-ui自带属性，:unique-opened='true' 设置只允许展开一个菜单-,
                    collapse设置菜单是否折叠,router是否开启路由模式,开启后点击el-menu-item时将通过index值进行跳转，注意是点击el-menu-item而不是el-submenu
                    -->
                    <!--一级菜单-->
                    <!-- element-ui 通过index属性来确定操作那个菜单 -->
                    <el-submenu :index="index.toString()" v-for="(item,index) in menuList" :key="item.id">
                        <!--一级菜单的模板区-->
                        <template slot="title">
                            <!--一级菜单的图标-->
                            <i :class="iconObj[item.id]"></i>
                            <!--一级菜单的文本内容-->
                            <span>{{item.authName}}</span>
                        </template>
                        <!--一级菜单的子菜单，二级菜单-->
                        <!-- element-ui 通过index属性来确定操作那个菜单 -->
                        <el-menu-item :index="'/'+subItem.path" v-for="(subItem,subIndex) in item.children"
                                      :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                            <template slot="title">
                                <!--二级菜单的图标-->
                                <i class="el-icon-menu"></i>
                                <!--二级菜单的文本内容-->
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>

                    </el-submenu>

                </el-menu>
            </el-aside>
            <!--内容主体区-->
            <el-main>
                <!--显示Welcome组件-->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                menuList: [],
                iconObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                isCollapse: false,
                /*当前二级菜单*/
                activePath: ""
            }
        },
        created() {
            /*再模板渲染之前获得数据,以便进行渲染*/
            this.getMenuList();
            /* 用于刷新后仍然保持当前二级菜单高亮*/
            this.activePath = window.sessionStorage.getItem("activePath");
        },
        methods: {
            logout() {
                /* 删除 token，重定向到登录页面*/
                window.sessionStorage.clear();
                this.$router.push("/login");
            },
            /*获取所有的菜单*/
            async getMenuList() {
                /*  别忘使用 await关键字, 在获得后台的数据后再往下执行*/
                const {data: res} = await this.$http.get("menus")
                if (res.meta.status !== 200) this.$message.error(res.meta.message);
                this.menuList = res.data;
            },
            /* 点击按钮切换菜单的折叠和展开*/
            toggleCollapse() {
                this.isCollapse = !this.isCollapse;
            },
            /*保持当前选中的二级菜单高亮，哪怕是刷新后仍然会保持高亮*/
            saveNavState(activePath) {
                window.sessionStorage.setItem("activePath", activePath)
                this.activePath = activePath;
            }
        }

    }
</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    /*在element-ui中 el-xxx 本身就是一个类名*/
    .el-header {
        display: flex;
        justify-content: space-between;
        padding-left: 0;
        /*flex布局中单行垂直居中*/
        align-items: center;
        background-color: #373D41;
        color: #fff;
        font-size: 20px;
        /* 设置logo的样式*/

        > div {
            display: flex;
            align-items: center;

            span {
                margin-left: 15px;
            }
        }
    }

    .el-aside {
        background-color: #333744;

        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #EAEDF1;
    }

    .iconfont {
        margin-right: 10px;
    }

    .toggle-button {
        background-color: #4A5064;
        font-size: 10px;
        text-align: center;
        line-height: 24px;
        color: #fff;
        letter-spacing: 3px;
        cursor: pointer;
    }
</style>
