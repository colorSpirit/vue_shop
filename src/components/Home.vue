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
            <el-aside width="200px">Aside</el-aside>
            <!--内容主体区-->
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        methods: {
            logout() {
                /* 删除 token，重定向到登录页面*/
                window.sessionStorage.clear();
                this.$router.push("/login");
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
        display:flex;
        justify-content: space-between;
        padding-left:0;
        /*flex布局中单行垂直居中*/
        align-items: center;
        background-color: #373D41;
        color:#fff;
        font-size:20px;
        /* 设置logo的样式*/
        > div{
            display:flex;
            align-items: center;
            span{
                margin-left:15px;
            }
        }
    }

    .el-aside {
        background-color: #333744;
    }

    .el-main {
        background-color: #EAEDF1;
    }
</style>
