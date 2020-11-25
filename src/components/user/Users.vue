<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片区域,显示用户信息-->
        <el-card class="box-card">
            <!--
            使用element-ui中的弹性布局设置搜索与添加区域
             总共24份，通过 el-col的span属性设置该列占的份数，通过 el-row的gutter属性设置 各列之间的距离
            -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>
            <!--用户列表区-->
            <!--
                通过le-table渲染用户列表,data接收一个数组对象， username等属性为数组对象中的对象的属性
            -->
            <el-table :data="userList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <!--作用域插槽-->
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.mg_state"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                @change="userStateChanged(scope.row)">
                        </el-switch>
                    </template>

                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit"></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete"></el-button>
                        <!--分配角色按钮-->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页区-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[1, 2, 5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                <!--
                    size-change 每一页显示多少条发生改变触发的事件
                    current-change 当前页码发生改变时触发的事件
                    current-page 当前页码，即当前是第几页
                    page-sizes 选择每一页显示多少条数据
                    page-size 当前 每一页有多少条数据
                    total 总共有多少条数据
                    layout  pagination上显示那些组件
                -->
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                userList: [],// 用户列表
                total: 0,// 总数据条数
                queryInfo: { // 作为请求参数传给后台， 所以属性名要根据后台API来命名，即属性名不能随意起
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                }
            }
        },
        created() {
            /* 给data中的变量重新赋值*/
            this.getUserList();
        },
        methods: {
            /* 异步请求，注意要用async在获得数据后代码再往下执行*/
            async getUserList() {
                const {data: res} = await this.$http.get('users', {params: this.queryInfo});
                if (res.meta.status !== 200) {
                    return this.$message.error("获取用户列表失败");
                }
                this.userList = res.data.users;
                this.total = res.data.total;
            },
            /*监听pageSize改变的事件*/
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getUserList();
            },
            /*页码值发生改变则会调用该函数*/
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUserList();
            },
            /*保存状态的改变*/
            async userStateChanged(newInfo) {
                const {data: res} = await this.$http.put(`users/${newInfo.id}/state/${newInfo.mg_state}`);
                if (res.meta.status !== 200) {
                    newInfo.mg_state = !newInfo.mg_state;
                    return this.$message.error("更新用户状态失败");
                }
                this.$message.success("更新用户状态成功");

            }

        }
    }
</script>

<style lang="less" scoped>

</style>
