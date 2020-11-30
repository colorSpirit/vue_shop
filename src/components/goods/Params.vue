<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图区-->
        <el-card>
            <!--头部的警告区-->
            <el-alert title="注意:只允许为第三级分类设置参数" type="warning" :closable="false" show-icon></el-alert>
            <!--选择商品分类的区域-->
            <el-row class="cat_opt">
                <el-col>
                    <span style="margin-right:15px;">选择商品分类:</span>
                    <el-cascader
                            expand-trigger="hover"
                            :options="cateList"
                            :props="cateProps"
                            v-model="selectedCateKeys"
                            @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!--tabs标签页区域-->
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
                <!--添加动态参数的面板-->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
                    <!--动态参数表格-->
                    <el-table :data="manyTableData" border stripe>
                        <!--展开行-->
                        <el-table-column type="expand"></el-table-column>
                        <!--索引列-->
                        <el-table-column type="index"></el-table-column>
                        <!--参数名称列-->
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <!--操作列-->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" class="el-icon-edit">编辑</el-button>
                                <el-button type="danger" class="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!--添加静态属性的面板-->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
                    <!--静态属性 表格-->
                    <el-table :data="onlyTableData" border stripe>
                        <!--展开行-->
                        <el-table-column type="expand"></el-table-column>
                        <!--索引列-->
                        <el-table-column type="index"></el-table-column>
                        <!--参数名称列-->
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <!--操作列-->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" class="el-icon-edit">编辑</el-button>
                                <el-button type="danger" class="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!--添加参数对话框-->
        <el-dialog
                :title="titleText"
                :visible.sync="addDialogVisible"
                width="50%"
        @close="addDialogClosed">
            <el-form :model="addForm"  :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="addParams">确定</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                /*存储商品类别信息*/
                cateList: [],
                /*存储选中的类别id*/
                selectedCateKeys: [],
                /*级联选择器的配置项*/
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                /*tabs标签页，默认选中的标签*/
                activeName: 'many',
                /*存储动态参数的数据*/
                manyTableData: [],
                /*存储静态属性的数据*/
                onlyTableData: [],
                addDialogVisible: false,
                addForm:{},//添加参数的验证表单所绑定的数据
                addFormRules:{
                    attr_name:[
                        {
                            required:true,
                            message:'请输入参数名称',
                            trigger:'blur'
                        }
                    ]
                }// 添加参数的验证表单所使用的验证规则
            };
        },
        created() {
            /*获取商品分类的数据*/
            this.getCateList()
        },
        methods: {
            /*获取商品分类信息*/
            async getCateList() {
                const {data: res} = await this.$http.get('/categories');
                if (res.meta.status !== 200) {
                    return this.$message.error("获取商品分类信息失败");
                } else {
                    this.cateList = res.data;
                }
            },
            /*当级联选择框中选中的商品类别信息发生改变时调用该方法*/
            handleChange() {
                this._getParamsData();
            },
            /*当选中的tabs标签页发生改变时调用该函数*/
            handleTabsClick() {
                this._getParamsData();
            },
            async _getParamsData() {
                /*
               控制级联选择器的范围,只能选中三级分类
                */
                if (this.selectedCateKeys.length !== 3) {
                    return this.selectedCateKeys = [];
                } else {
                    /*根据选择的三级分类的id和对应的面板获取相应的参数 */
                    const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,
                        {
                            params: {
                                sel: this.activeName
                            }
                        });
                    if (res.meta.status !== 200) {
                        return this.$message.error("获取参数列表失败");
                    } else {
                        if (this.activeName === 'many') {
                            this.manyTableData = res.data;
                        } else if (this.activeName === 'only') {
                            this.onlyTableData = res.data;
                        }
                    }
                }
            },
            /*当添加参数的对话框关闭时调用该方法*/
            addDialogClosed(){

                this.$refs.addFormRef.resetFields();
            },
            /*当点击添加参数的确定按钮时进行相应处理*/
           addParams(){
                this.$refs.addFormRef.validate(async validation=>{
                    if(!validation){
                        return this.$message.error("参数格式错误");
                    }
                    const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                        attr_name:this.addForm.attr_name,
                        attr_sel:this.activeName
                    });
                    if(res.meta.status!==201){
                        return this.$message.error("添加参数失败");
                    }
                    this.$message.success("添加参数成功");
                    this.addDialogVisible=false;
                    /*刷新数据*/
                    await this._getParamsData();
                })
            }
        },
        computed: {
            /*添加属性或添加参数的按钮是否应该被禁用*/
            isBtnDisabled() {
                return this.selectedCateKeys.length !== 3;
            },
            /*获取选中的三级分类的id*/
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2];
                } else {
                    return null;
                }
            },
            /*返回对话框的标题，动态参数或静态属性*/
            titleText() {
                if (this.activeName === 'many') {
                    return "动态参数";
                }
                return "静态属性";
            }
        }
    }
</script>

<style scoped lang="less">
    .cat_opt {
        margin: 15px 0;
    }

</style>
