<template>
    <div id="login" class="login_container">
        <div class="login_box">
            <!-- 头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区域-->
            <el-form label-width="0" class="login_form">
                <!--用户名区域-->
                <el-form-item>
                    <el-input placeholder="输入用户名" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码区域-->
                <el-form-item>
                    <el-input placeholder="输入密码" prefix-icon="iconfont icon-3702mima"></el-input>
                </el-form-item>
                <!-- 按钮区域-->
                <el-form-item class="btns">
                    <el-button type="primary">登录</el-button>
                    <el-button type="info">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="less" scoped>
    .login_container {
        height: 100%;
        background-color: #2b4b6b
    }

    .login_box {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 2px;

        /* 设置avatar_box的样式*/

        .avatar_box {
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            height: 130px;
            width: 130px;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, .8);

            /* 设置头像的样式*/

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }

        }

        /* 设置登录区域的样式 */
        .login_form{
            position:absolute;
            bottom:3px;
            width:100%;
            padding:0 5px;
            box-sizing:border-box;
            /*设置登录和重置按钮的样式*/
            .btns {
                display: flex;
                justify-content: flex-end;
            }
        }
    }


</style>
