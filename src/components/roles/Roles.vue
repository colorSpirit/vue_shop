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
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!--渲染二级权限-->
                                <el-row class="vcenter" v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2===0?'':'bd-top']">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!--渲染三级权限-->
                                    <el-col :span="18">
                                        <!--closable给每一个三级权限tag上都添加一个 关闭的图标，并且点击该关闭图标时会触发该tag的中自带的close事件 -->
                                        <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
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
            },
            /*当点击 三级权限关闭的图标时会触发该三级权限的tag自带的close事件*/
           async removeRightById(role,rightId){
                const result = await this.$confirm('是否删除该权限','删除权限',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).catch(err=>err)
               if(result !=='confirm'){
                   return this.$message.info('取消了删除操作');
               }
               const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
               if(res.meta.status!==200){
                   return this.$message.error("未能成功删除权限");
               }
              /* await this.getRolesList(); 如果调用该方法则，会重新获取所有角色的权限列表，从而导致页面重新渲染，以至于 打开的 el-expand会合上*/
              /*将服务器端返回的当前用角色的权限赋值给该角色的children属性即实现了页面上该角色的权限更新又防止了页面的整体刷新，*/
               role.children=res.data;
               this.$message.success("成功删除该权限");
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
