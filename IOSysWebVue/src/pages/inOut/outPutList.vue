<!-- 支出列表 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>收支</el-breadcrumb-item>
        <el-breadcrumb-item>支出</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-row :span="24">
        <el-form :inline="true">
          <el-form-item label="日期" class="toolbar-item toolbar-left">
            <el-date-picker v-model="req.date" type="date" placeholder="请选择日期" value-format="yyyy-MM-dd" :clearable="false" @change="search">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="toolbar-item toolbar-right">
            <el-button type="primary" @click="search">刷新</el-button>
            <el-button type="primary" @click="showForm(0)">新增</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!--列表-->
      <el-table :data="list" :default-sort="{prop: 'amount', order: 'descending'}" show-summary :summary-method="doSum" highlight-current-row style="width: 100%;" :maxHeight="tableHeight" stripe>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="outCategoryName" label="分类" sortable></el-table-column>
        <el-table-column prop="outTypeName" label="类型" sortable></el-table-column>
        <el-table-column prop="amountAccountName" label="账户" width="200" sortable></el-table-column>
        <el-table-column prop="amount" label="金额" width="200" align="right" :formatter="formatAmount" sortable></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showForm(scope.row.id)">修改</el-button>
            <el-button type="danger" @click="deleteRecord(scope.row.id)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--对话框-->
      <OutPutDetail ref="form" @saved="saved"></OutPutDetail>
    </el-col>
  </el-row>
</template>
<script>
import InOutAPI from '@/api/inOutAPI';
import Util from '@/utils/util';
import OutPutDetail from '@/pages/inOut/outPutDetail';

export default {
  components: {
    OutPutDetail
  },
  data() {
    return {
      //表格高度
      tableHeight: window.innerHeight - 170,

      //查询条件
      req: {
        date: Util.Fun.formatDate(new Date()) //日期
      },

      //列表
      list: []
    };
  },
  mounted() {
    //监听window高度
    window.addEventListener('resize', this.docResize);

    //查询
    this.search();
  },
  destroyed() {
    window.removeEventListener('resize', this.docResize);
  },
  methods: {
    //文档大小改变事件
    docResize() {
      this.tableHeight = window.innerHeight - 170;
    },
    //查询收入列表
    search() {
      let that = this;

      //查询列表
      InOutAPI.queryOutPut(this.req.date).then(function(result) {
        if (result.isOK) {
          //列表设值
          that.list = result.lstInfo;
        }
      });
    },
    //格式化金额
    formatAmount(row, column, cellValue, index) {
      let value = Util.Fun.formatAmount(cellValue);
      return value;
    },
    //合计金额
    doSum(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        //序号列
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        //非金额列
        if (column.property != 'amount') {
          sums[index] = '';
          return;
        }

        //金额列
        const values = data.map(item => Number(item[column.property]));
        let sum = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);

        sums[index] = Util.Fun.formatAmount(sum);
      });

      return sums;
    },
    //显示对话框
    showForm(id) {
      //显示对话框
      this.$refs.form.showForm(id, this.req.date);
    },
    //弹框保存成功
    saved(){
      //重新查询列表
      this.search();
    },
    //删除
    deleteRecord: function(id) {
      let that = this;
      this.$confirm('确认删除该记录吗?', '提示', { type: 'warning' }).then(() => {
        //删除
        InOutAPI.deleteOutPut({ id: id }).then(function(result) {
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
