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
            <!--搜索用户输入框和添加用户按钮区-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- element-ui 的 el-input 的clearable属性使得该输入框具有可清空的功能-->
                    <el-input placeholder="请输入内容" class="input-with-select" clearable @clear="getUserList"
                              v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
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
                        <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
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
        <!--添加用户的对话框-->
        <!--
        visible.sync 控制对话框的显示和隐藏，
        width 对话框的宽度
        before-close 对话框关闭之前触发该事件
        close  element-ui 中给对话框添加的close事件即对话框关闭事件
        -->
        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="50%"
                @close="addDialogClosed"
        >
            <!-- 内容主体区域 -->
            <span>
                <!--添加 添加用户并且带验证功能的表单-->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px"
                         class="demo-ruleForm">
                      <el-form-item label="用户名" prop="username">
                         <el-input v-model="addForm.username"></el-input>
                      </el-form-item>
                     <el-form-item label="密码" prop="password">
                         <el-input v-model="addForm.password" type="password"></el-input>
                      </el-form-item>
                     <el-form-item label="邮箱" prop="email">
                         <el-input v-model="addForm.email"></el-input>
                      </el-form-item>
                     <el-form-item label="手机" prop="mobile">
                         <el-input v-model="addForm.mobile"></el-input>
                      </el-form-item>
                </el-form>
            </span>
            <!-- 底部区域-->
            <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!--修改用户的对话框-->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
            <!--主体内容区域-->
            <span>这是一段信息</span>
            <!--页脚局域-->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            /* 自定义校验规则 */
            /*验证邮箱的自定义校验规则*/
            /*
            * rule  验证规则
            * value 需要验证的值
            * callback回调函数
            * */
            let checkEmail = (rule, value, callback) => {
                /*验证邮箱的正则表达式*/
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
                if (regEmail.test(value)) {
                    /* 合法邮箱*/
                    return callback();
                }
                callback("请输入合法的邮箱");
            };
            /*验证手机的自定义校验规则*/
            let checkMobile = (rule, value, callback) => {
                /*验证手机号的正则表达式*/
                const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (regMobile.test(value)) {
                    return callback()
                }
                callback("请输入合法的手机号")
            }
            return {
                editForm:{}, // 查询得到的用户信息对象
                editDialogVisible: false,//控制修改用户的对话框的显示和隐藏
                addFormRules: {
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号',
                            trigger: 'blur'
                        }, {
                            validator: checkMobile,
                            trigger: 'blur'
                        }
                    ],
                    email: [
                        {
                            required: true,
                            message: '请输入邮箱',
                            trigger: 'blur'
                        }, {
                            validator: checkEmail,
                            trigger: 'blur'
                        }
                    ],
                    password: [
                        {
                            required: true,
                            message: "请输入密码",
                            trigger: 'blur'
                        },
                        {
                            min: 6,
                            max: 15,
                            message: '密码长度在 6到15 之间',
                            trigger: 'blur'
                        }
                    ],
                    username: [
                        {
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 10,
                            message: '用户名的长度在 3到10 之间',
                            trigger: 'blur'
                        }
                    ]
                },// 添加用户时，所用到的验证规则
                addForm: {
                    mobile: '',
                    email: '',
                    password: '',
                    username: ''
                },// 添加用户的对话框中的表单所用到的对象
                userList: [],// 用户列表
                total: 0,// 总数据条数
                queryInfo: { // 作为请求参数传给后台， 所以属性名要根据后台API来命名，即属性名不能随意起
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                addDialogVisible: false //控制添加用户对话的显示和隐藏
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
            /*保存状态的改变,通过ajax请求将其同步到后台的数据库中*/
            async userStateChanged(newInfo) {
                const {data: res} = await this.$http.put(`users/${newInfo.id}/state/${newInfo.mg_state}`);
                if (res.meta.status !== 200) {
                    newInfo.mg_state = !newInfo.mg_state;
                    return this.$message.error("更新用户状态失败");
                }
                this.$message.success("更新用户状态成功");

            },
            /*当添加用户的对话框关闭时调用该函数，重置该对话框中的内容*/
            addDialogClosed() {
                this.$refs.addFormRef.resetFields();
            },
            /*点击添加用户对话框的确定按钮时触发该事件*/
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (valid) {
                        const {data: res} = await this.$http.post('users', this.addForm);
                        if (res.meta.status !== 201) {
                            return this.$message.error("添加用户失败");
                        }
                        this.$message.success("成功添加用户");
                        /*隐藏添加用户的对话框*/
                        this.addDialogVisible = false;
                        /*重新向后台发送请求，得到最新的用户列表*/
                        await this.getUserList();

                    }
                })

            },
            /*点击编辑用户信息的按钮时调用该函数，展现编辑对话框*/
            async showEditDialog(userId) {
                const {data: res} = await this.$http.get(`users/${userId}`);
                if (res.meta.status !== 200) {
                    return this.$message.error("查询用户信息失败");
                }
                this.editForm = res.data;
                this.editDialogVisible = true;

            }
        }
    }
</script>

<style lang="less" scoped>

</style>
