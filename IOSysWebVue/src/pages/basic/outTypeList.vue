<!-- 支出分类类型列表 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>基础</el-breadcrumb-item>
        <el-breadcrumb-item>支出类型</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-row :span="24">
        <el-form :inline="true">
          <el-form-item class="toolbar-item toolbar-right">
            <el-button type="primary" @click="search">刷新</el-button>
            <el-button type="primary" @click="showFormCategory(0)">新增分类</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!--列表-->
      <el-table :data="this.$store.getters.lstOutCategoryType" highlight-current-row style="width: 100%;" :maxHeight="tableHeight" :row-class-name:="rowClassName" stripe>
        <el-table-column type="index" width="70"></el-table-column>
        <el-table-column type="expand" width="50">
          <template slot-scope="ocScope">
            <el-card class="box-card">
              <el-table :data="ocScope.row.lstOutType" highlight-current-row style="width: 100%;" :row-class-name:="rowClassName" :show-header="false" stripe>
                <el-table-column type="index" width="70"></el-table-column>
                <el-table-column prop="name" label="名称" sortable></el-table-column>
                <el-table-column prop="isActive" label="状态" width="150" align="center" sortable>
                  <template slot-scope="otScope">
                    <el-tag v-if="otScope.row.isActive" type="success" disable-transitions>可用</el-tag>
                    <el-tag v-if="!otScope.row.isActive" type="danger" disable-transitions>禁用</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="otScope">
                    <el-button type="primary" size="small" @click="showFormType(otScope.row.id, ocScope.row.id)">修改</el-button>
                    <el-button type="danger" @click="deleteRecordType(otScope.row.id)" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" sortable></el-table-column>
        <el-table-column prop="isActive" label="状态" width="150" align="center" sortable>
          <template slot-scope="ocScope">
            <el-tag v-if="ocScope.row.isActive" type="success" disable-transitions>可用</el-tag>
            <el-tag v-if="!ocScope.row.isActive" type="danger" disable-transitions>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="ocScope">
            <el-button type="primary" size="small" @click="showFormCategory(ocScope.row.id)">修改</el-button>
            <el-button type="danger" @click="deleteRecordCategory(ocScope.row.id)" size="small">删除</el-button>
            <el-button type="primary" @click="showFormType(0, ocScope.row.id)" :disabled="!ocScope.row.isActive" size="small">新增类型</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分类对话框-->
      <OutCategoryDetail ref="formCategory" @saved="savedCategory"></OutCategoryDetail>

      <!--类型对话框-->
      <OutTypeDetail ref="formType" @saved="savedType"></OutTypeDetail>
    </el-col>
  </el-row>
</template>
<script>
import BasAPI from '@/api/basicAPI';
import OutCategoryDetail from '@/pages/basic/outCategoryDetail';
import OutTypeDetail from '@/pages/basic/outTypeDetail';

export default {
  components: {
    OutCategoryDetail,
    OutTypeDetail
  },
  data() {
    return {
      //表格高度
      tableHeight: window.innerHeight - 170,
    };
  },
  mounted() {
    //监听window高度
    window.addEventListener("resize", this.docResize);

    //查询
    this.search();
  },
  destroyed(){
    window.removeEventListener('resize', this.docResize)
  },
  methods: {
    //文档大小改变事件
    docResize() {
      this.tableHeight = window.innerHeight - 170;
    },
    //查询列表
    search() {
      let that = this;

      //查询列表
      BasAPI.queryOutCategoryType().then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(CST.Store.Bas.SetOutCategoryTypeList, result.lstInfo);
        }
      });
    },
    //表格行样式
    rowClassName(row, rowIndex) {
      if (!row.row.isActive) {
        return 'disable-row';
      }
    },

    //显示分类对话框
    showFormCategory(id) {
      //显示对话框
      this.$refs.formCategory.showFormCategory(id);
    },
    //分类对话框保存成功
    savedCategory(){
      //重新查询列表
      this.search();
    },
    //删除分类
    deleteRecordCategory: function(id) {
      let that = this;
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
        //删除
        BasAPI.deleteOutCategory({ id: id }).then(function(result) {
          if (result.isOK) {
            //成功提示
            that.$message.success({
              showClose: true,
              message: '删除成功',
              duration: 2000
            });

            //重新查询列表
            that.search();
          } else {
            //错误提示
            let msg = '删除失败（' + result.msg + '）';
            that.$message.error({
              showClose: true,
              message: msg,
              duration: 2000
            });
          }
        });
      });
    },

    //显示类型对话框
    showFormType(id, outCategoryID) {
      //显示对话框
      this.$refs.formType.showFormType(id, outCategoryID);
    },
    //类型对话框保存成功
    savedType(){
      //重新查询列表
      this.search();
    },
    //删除类型
    deleteRecordType: function(id) {
      let that = this;
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
        //删除
        BasAPI.deleteOutType({ id: id }).then(function(result) {
          if (result.isOK) {
            //成功提示
            that.$message.success({
              showClose: true,
              message: '删除成功',
              duration: 2000
            });

            //重新查询列表
            that.search();
          } else {
            //错误提示
            let msg = '删除失败（' + result.msg + '）';
            that.$message.error({
              showClose: true,
              message: msg,
              duration: 2000
            });
          }
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
