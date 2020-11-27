<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图-->
        <el-card>
            <!--添加角色-->
            <el-row>
                <el-button type="primary">添加角色</el-button>
            </el-row>
            <!--角色列表区-->
            <el-table :data="roleList" border stripe>
                <!--展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!-- 注意此处的布局-->
                        <el-row class="vcenter" v-for="(item1,index1) in scope.row.children" :key="index1" :class="['bd-bottom',index1===0?'bd-top':'']">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <el-tag>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!--渲染二级权限-->
                                <el-row class="vcenter" v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2===0?'':'bd-top']">
                                    <el-col :span="6">
                                        <el-tag type="success">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                                    </el-col>

                                </el-row>

                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列-->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                /*所有角色列表的信息*/
                roleList: []
            }
        },
        created() {
            this.getRolesList();
        },
        methods: {
            /*获取角色列表*/
            async getRolesList() {
                const {data: res} = await this.$http.get("roles");
                if (res.meta.status !== 200) {
                    return this.$message.error("获取角色列表失败")
                }
                this.roleList = res.data;
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-tag{
        margin:7px;
    }
    .bd-top{
        border-top:1px solid #eee;
    }
    .bd-bottom{
        border-bottom:1px solid #eee
    }
    /*设置纵向对齐*/
    .vcenter{
        display:flex;
       align-items: center;
    }
</style>
