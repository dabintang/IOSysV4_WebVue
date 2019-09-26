<!-- 账户列表 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>基础</el-breadcrumb-item>
        <el-breadcrumb-item>账户信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-row :span="24">
        <el-form :inline="true">
          <el-form-item class="toolbar-item toolbar-right">
            <el-button type="primary" @click="search">刷新</el-button>
            <el-button type="primary" @click="showForm(0)">新增</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!--列表-->
      <el-table :data="this.$store.getters.lstAmountAccount" :default-sort="{prop: 'amount', order: 'descending'}" show-summary :summary-method="doSum" highlight-current-row style="width: 100%;" :maxHeight="tableHeight" :row-class-name:="rowClassName" stripe>
        <el-table-column type="index" width="100"></el-table-column>
        <el-table-column prop="name" label="名称" sortable></el-table-column>
        <el-table-column prop="amount" label="金额" width="200" align="right" :formatter="formatAmount" sortable></el-table-column>
        <el-table-column prop="isActive" label="状态" width="150" align="center" sortable>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isActive" type="success" disable-transitions>可用</el-tag>
            <el-tag v-if="!scope.row.isActive" type="danger" disable-transitions>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showForm(scope.row.id)">修改</el-button>
            <el-button type="danger" @click="deleteRecord(scope.row.id)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--对话框-->
      <AmountAccountDetail ref="form" @saved="saved"></AmountAccountDetail>

    </el-col>
  </el-row>
</template>
<script>
import Util from '@/utils/util';
import BasAPI from "@/api/basicAPI";
import AmountAccountDetail from '@/pages/basic/amountAccountDetail';

export default {
  components: {
    AmountAccountDetail
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
    //查询账户列表
    search() {
      let that = this;

      //查询账户列表
      BasAPI.queryAmountAccount().then(function(result) {
        if (result.isOK) {
          //缓存
          that.$store.commit(
            CST.Store.Bas.SetAmountAccountList,
            result.lstInfo
          );
        }
      });
    },
    //表格行样式
    rowClassName(row, rowIndex) {
      if (!row.row.isActive) {
        return "disable-row";
      }
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
          sums[index] = "合计";
          return;
        }
        //非金额列
        if (column.property != "amount") {
          sums[index] = "";
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
      this.$refs.form.showForm(id);
    },
    //弹框保存成功
    saved(){
      //重新查询列表
      this.search();
    },
    //删除
    deleteRecord: function(id) {
      let that = this;
      this.$confirm("确认删除该记录吗?", "提示", { type: "warning" }).then(
        () => {
          //删除
          BasAPI.deleteAmountAccount({ id: id }).then(function(result) {
            if (result.isOK) {
              //成功提示
              that.$message.success({
                showClose: true,
                message: "删除成功",
                duration: 2000
              });

              //重新查询列表
              that.search();
            } else {
              //错误提示
              let msg = "删除失败（" + result.msg + "）";
              that.$message.error({
                showClose: true,
                message: msg,
                duration: 2000
              });
            }
          });
        }
      );
    }
  }
};
</script>

<style scoped lang="scss">
</style>
