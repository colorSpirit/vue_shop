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

            <!--分页pagination局域-->
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
                total:0,//存储总数据条数
            }
        },
        created() {
            this.getCateList();
        },
        methods: {
            /*获取商品类别信息，并用获得的结果对data中的数据重新赋值*/
            async getCateList() {

                const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
                if(res.meta.status!==200){
                    return this.$message.error("未能成功获得类别信息")
                }
                this.cateList = res.data.result; //存储获得的分类数据
                this.total = res.data.total; // 存储数据总条数
            }
        }
    }
</script>

<style scoped>

</style>
