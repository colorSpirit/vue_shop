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
                    <el-button type="primary">添加分类</el-button>
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
    </div>
</template>

<script>
    export default {
        data() {
            return {
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
            }
        }
    }
</script>

<style scoped>
.treeTable{
    margin-top:15px;
}
</style>
