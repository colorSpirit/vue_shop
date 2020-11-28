<template>
    <div>
        <!--面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图-->
        <el-card>
            <!--添加分类按钮-->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!--各个类别组成的表格-->
            <!--
            使用第三方插件实现树形表格的功能
            data 指定数据源
            columns 表格每列具体的配置
            selection-type 是否展现复选框
            expand-type 是否展现展开行的效果，即每行开头是否有一个箭头
            show-index 是否展现索引列 即每行开始的数字
            index-text 指定标题行处索引列的文本，即第一行开头的文本，默认为 序号
            border 是否在列与列之间显示纵向边框
            show-row-hover 鼠标悬停的时候，改行是否高亮
            -->
            <tree-table :data="cateList"
                        :columns="columns"
                        :selection-type="false"
                        :expand-type="false"
                        :show-index="true"
                        index-text="#"
                        border
                        :show-row-hover="false"
                        class="treeTable"
            >
                <!--通过作用域插槽渲染第二列，从而实现自定义样式-->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color:red;"></i>
                </template>
                <!--通过作用域插槽渲染第三列 排序-->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <!--通过作用域插槽渲染第四列 操作-->
                <template slot="opt" slot-scope="scope">
                    <el-button icon="el-icon-edit">编辑</el-button>
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                    <el-button type="danger" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!--分页pagination局域-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[3,5,10,15]"
                    :page-size="queryInfo.pagesize"
                    layout="total,sizes,prev,pager,next,jumper"
                    :total="total"
            ></el-pagination>
        </el-card>
        <!--添加分类 对话框-->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
            <!--添加分类的表单-->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label='分类名称:' prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label='父级分类'>
                    <!--级联列表 区域，显示分类层级-->
                    <!--
                        expand-trigger 通过鼠标覆盖展现级联列表
                        options 当前级联组件的数据源
                        props 当前级联组件的配置项
                        v-model 来设置选中的id组成的数组，该数组存储那个选项被选中了
                        change 当选择的项发生变化时，便会调用相应的事件处理函数
                        clearable 是否支持清空选项
                        change-on-select  是否可以选中任意的选项，即不仅可以选中二级选项还可以选中一级选项
                    -->
                    <el-cascader expand-trigger="hover"
                                 :options="parentCateList"
                                 :props="cascaderProps"
                                 v-model="selectedKeys"
                                 @change="parentCateChanged"
                                 clearable
                                 change-on-select
                    >

                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible=false">取消</el-button>
               <el-button type='primary' @click="addCateDialogVisible=false">确定</el-button>
            </span>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                /*存放父级分类的数据*/
                parentCateList: [],
                addCateFormRules: {
                    cat_name: [
                        {
                            required: true,
                            message: '请输入分类名称',
                            trigger: 'blur'
                        }
                    ]
                },// 添加分类的表单对应的验证规则
                addCateForm: {
                    cat_name: '',//将要添加的分类名称
                    cat_pid: 0,//父级分类的id
                    cat_level: 0//分类的等级默认添加的是一级分类
                },// 添加分类的表单数据对象
                addCateDialogVisible: false,
                queryInfo: {
                    type: 3,//请求 1，2，3级分类
                    pagenum: 1,//默认请求第一页的数据
                    pagesize: 5//每页五条数据
                },
                /*存储所有的类别信息*/
                cateList: [],
                total: 0,//存储总数据条数
                columns: [
                    {
                        label: '分类名称', //标题
                        prop: 'cat_name',//该列所关联的属性，即该列的数据源
                    },
                    {
                        label: '是否有效',
                        /*通过type属性 将该列定义为模板列*/
                        type: 'template',
                        /*通过template属性指定该列使用的模板*/
                        template: 'isok'
                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'order'
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'opt'
                    }
                ],//tree-table 每列的配置
                cascaderProps: {
                    value: 'cat_id',// 实际选中的值，即option的value
                    label: 'cat_name',//展现的内容，即option中的文本
                    children: 'children' // 父子节点通过那个属性相互关联
                },
                /*存储被选中的选项*/
                selectedKeys: []
            }
        },
        created() {
            this.getCateList();
        },
        methods: {
            /*获取商品类别信息，并用获得的结果对data中的数据重新赋值*/
            async getCateList() {

                const {data: res} = await this.$http.get('categories', {params: this.queryInfo});
                if (res.meta.status !== 200) {
                    return this.$message.error("未能成功获得类别信息")
                }
                this.cateList = res.data.result; //存储获得的分类数据
                this.total = res.data.total; // 存储数据总条数
            },
            /*监听pagesize改变的事件*/
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getCateList();
            },
            /*当前页码pagenum发生改变时触发该事件*/
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getCateList();
            },
            /*点击展现添加分类对话框*/
            showAddCateDialog() {
                this.getParentCateList();
                this.addCateDialogVisible = true;
            },
            /*获取父级分类的数据列表*/
            async getParentCateList() {
                const {data: res} = await this.$http.get(`categories`, {
                    params: {
                        type: 2 //获取前两级的所有分类
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error("获取父级分类失败");
                }
                this.parentCateList = res.data;
            },
            /*当选择的项发生改变时调用该方法 */
            parentCateChanged() {

            }
        }
    }
</script>

<style scoped>
    .treeTable {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }
</style>
