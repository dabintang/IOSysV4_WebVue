<!-- 借还统计 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>报表</el-breadcrumb-item>
        <el-breadcrumb-item>借还统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-row :span="24">
        <el-form :inline="true">
          <el-form-item class="toolbar-item">
            <el-switch
              v-model="req.isShowZero"
              active-text="显示已还清记录"
              inactive-text="隐藏已还清记录"
              @change="search"
            ></el-switch>
          </el-form-item>
        </el-form>
      </el-row>

      <!--列表-->
      <el-table
        ref="table"
        :data="list"
        highlight-current-row
        style="width: 100%;"
        :maxHeight="tableHeight"
        :default-sort="{ prop: 'value', order: 'descending' }"
        show-summary
        :summary-method="doSum"
        @expand-change="expandChange"
        stripe
      >
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column type="expand" width="50">
          <template slot-scope="brScope">
            <el-card class="box-card">
              <el-table
                :data="brScope.row.lstDetail"
                highlight-current-row
                style="width: 100%;"
                maxHeight="300"
                stripe
              >
                <el-table-column type="index" width="70"></el-table-column>
                <el-table-column prop="brDate" label="日期" :formatter="formatDate" width="130"></el-table-column>
                <el-table-column prop="brTypeName" label="类型" width="180"></el-table-column>
                <el-table-column prop="amountAccountName" label="账户" width="180"></el-table-column>
                <el-table-column prop="amount" label="金额" align="right" :formatter="formatAmount"></el-table-column>
              </el-table>
            </el-card>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="对方" width="200"></el-table-column>
        <el-table-column
          prop="value"
          label="金额"
          align="right"
          :formatter="formatAmount"
          sortable
          :sort-method="sortMethod"
        ></el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>
<script>
import Util from "@/utils/util";
import ReportAPI from "@/api/reportAPI";

export default {
  data() {
    return {
      //表格高度
      tableHeight: window.innerHeight - 150,

      //查询条件
      req: {
        isShowZero: false //是否显示已还清记录
      },

      //表格数据
      list: []
    };
  },
  created() {},
  mounted() {
    //监听window高度
    window.addEventListener("resize", this.docResize);
    //查询
    this.search();
  },
  destroyed() {
    window.removeEventListener("resize", this.docResize);
  },
  methods: {
    //文档大小改变事件
    docResize() {
      this.tableHeight = window.innerHeight - 150;
    },
    //格式化金额
    formatAmount(row, column, cellValue, index) {
      //明细记录中的借出、还出，显示层负数
      if (row.brType && (row.brType == CST.Cst.BorrowRepayType.borrowOut || row.brType == CST.Cst.BorrowRepayType.repayOut)) {
        return Util.Fun.formatAmount(-cellValue);
      }

      return Util.Fun.formatAmount(cellValue);
    },
    //格式化日期
    formatDate(row, column, cellValue, index) {
      return Util.Fun.formatDate(cellValue);
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
        if (column.property != "value") {
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
    //查询
    search() {
      let that = this;

      //统计
      ReportAPI.sumBorrowRepayTarget(this.req).then(function(result) {
        if (result.isOK) {
          //统计结果添加空的明细数组
          result.lstInfo.forEach(item => {
            item.lstDetail = [];
          });

          that.list = result.lstInfo;
        }
      });
    },
    //自定义排序
    sortMethod(item1, item2) {
      let v1 = Math.abs(item1.value);
      let v2 = Math.abs(item2.value);

      if (v1 > v2) {
        return 1;
      } else if (v1 < v2) {
        return -1;
      }

      if (item1.value > item2.value) {
        return 1;
      } else if (item1.value < item2.value) {
        return -1;
      } else {
        return 0;
      }
    },
    //展开借还明细事件
    expandChange(row, expandedRows) {
      //如果已有明细，无需重新查询
      if (row.lstDetail && row.lstDetail.lenght > 0) {
        return;
      }

      //查询借还明细条件
      let reqDetail = { target: row.name, sort: "brDate desc" };

      //查询借还明细
      ReportAPI.queryBorrowRepayRecord(reqDetail).then(function(result) {
        if (result.isOK) {
          row.lstDetail = result.lstInfo;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
