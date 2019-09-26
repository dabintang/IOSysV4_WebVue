<!-- 支出明细列表 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>报表</el-breadcrumb-item>
        <el-breadcrumb-item>支出明细</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-row :span="24">
        <el-form :inline="true">
          <el-form-item label="日期" class="toolbar-item">
            <el-date-picker
              span="6"
              type="date"
              v-model="req.startDate"
              placeholder="请选择开始日期"
              :picker-options="startDateOptions"
              value-format="yyyy-MM-dd"
              style="width:160px;"
            ></el-date-picker>&nbsp;&nbsp;~&nbsp;&nbsp;
            <el-date-picker
              type="date"
              v-model="req.endDate"
              placeholder="请选择截止日期"
              :picker-options="endDateOptions"
              value-format="yyyy-MM-dd"
              style="width:160px;"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="类型" class="toolbar-item">
            <OTMultipleSelect v-model="req.lstOutTypeID"></OTMultipleSelect>
          </el-form-item>

          <el-form-item label="账户" class="toolbar-item">
            <AAMultipleSelect v-model="req.lstAmountAccountID"></AAMultipleSelect>
          </el-form-item>
        </el-form>

        <el-form :inline="true" style="margin-top:10px;">
          <el-form-item label="备注" class="toolbar-item">
            <el-input v-model="req.remark" placeholder="模糊匹配备注" style="width:500px;"></el-input>
          </el-form-item>
          <el-form-item class="toolbar-item" style="margin-left:20px;">
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <!--列表-->
      <el-table
        :data="table.list"
        highlight-current-row
        style="width: 100%;"
        :maxHeight="tableHeight"
        :default-sort="{prop: 'outDate', order: 'descending'}"
        @sort-change="sortList"
        stripe
      >
        <el-table-column prop="seq" label="#" width="80"></el-table-column>
        <el-table-column
          prop="outDate"
          label="日期"
          :formatter="formatDate"
          width="130"
          sortable="custom"
        ></el-table-column>
        <el-table-column prop="outCategoryName" label="分类" width="150" sortable="custom"></el-table-column>
        <el-table-column prop="outTypeName" label="类型" width="150" sortable="custom"></el-table-column>
        <el-table-column prop="amountAccountName" label="账户" width="150" sortable="custom"></el-table-column>
        <el-table-column
          prop="amount"
          :label="'金额'+(table.totalAmount>0?('('+table.totalAmount.toFixed(2)+')'):'')"
          width="150"
          align="right"
          :formatter="formatAmount"
          sortable="custom"
        ></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        v-if="table.total > 0"
        @size-change="pageSizeChange"
        @current-change="pageCurrentChange"
        :page-sizes="[100, 200, 500]"
        :current-page.sync="req.pageNum"
        layout="total, sizes, prev, pager, next"
        :total="table.total"
      ></el-pagination>
    </el-col>
  </el-row>
</template>
<script>
import Util from "@/utils/util";
import ReportAPI from "@/api/reportAPI";
import OTMultipleSelect from "@/components/otMultipleSelect";
import AAMultipleSelect from "@/components/aaMultipleSelect";

export default {
  components: {
    OTMultipleSelect,
    AAMultipleSelect
  },
  data() {
    return {
      //表格高度
      tableHeight: window.innerHeight - 230,

      //开始日期快捷方式
      startDateOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "本月初",
            onClick(picker) {
              picker.$emit("pick", Util.Fun.getCurMonthStart());
            }
          },
          {
            text: "上月初",
            onClick(picker) {
              const today = new Date();
              picker.$emit("pick", Util.Fun.getPreMonthStart());
            }
          },
          {
            text: "本年初",
            onClick(picker) {
              const today = new Date();
              picker.$emit("pick", Util.Fun.getCurYearStart());
            }
          },
          {
            text: "去年初",
            onClick(picker) {
              const today = new Date();
              picker.$emit("pick", Util.Fun.getPreYearStart());
            }
          }
        ]
      },

      //截止日期快捷方式
      endDateOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "上月末",
            onClick(picker) {
              const today = new Date();
              picker.$emit("pick", Util.Fun.getPreMonthEnd());
            }
          },
          {
            text: "去年末",
            onClick(picker) {
              const today = new Date();
              picker.$emit("pick", Util.Fun.getPreYearEnd());
            }
          }
        ]
      },

      //查询条件
      req: {
        startDate: Util.Fun.formatDate(Util.Fun.getCurMonthStart()), //开始日期
        endDate: Util.Fun.formatDate(new Date()), //截止日期
        lstOutTypeID: [], //支出类型ID集合
        lstAmountAccountID: [], //账户ID集合
        remark: "", //备注（模糊匹配）
        sort: "outDate desc", //排序
        pageNum: 1, //当前页码
        pageSize: 100 //每页条数
      },

      //表格数据
      table: {
        total: 0, //总条数
        totalAmount: 0, //总金额
        list: [] //列表
      }
    };
  },
  mounted() {
    //监听window高度
    window.addEventListener("resize", this.docResize);
    // //查询
    // this.search();
  },
  destroyed() {
    window.removeEventListener("resize", this.docResize);
  },
  methods: {
    //文档大小改变事件
    docResize() {
      this.tableHeight = window.innerHeight - 230;
    },
    //格式化金额
    formatAmount(row, column, cellValue, index) {
      return Util.Fun.formatAmount(cellValue);
    },
    //格式化日期
    formatDate(row, column, cellValue, index) {
      return Util.Fun.formatDate(cellValue);
    },
    //查询
    search() {
      let that = this;

      //查询列表
      ReportAPI.queryOutRecord(this.req).then(function(result) {
        if (result.isOK) {
          //表格设值
          that.table.total = result.totalRecord;
          that.table.totalAmount = result.totalAmount;
          that.table.list = result.lstInfo;
        }
      });
    },
    //每页条数改变事件
    pageSizeChange(val) {
      //每页条数
      this.req.pageSize = val;

      //查询
      this.search();
    },
    //当前页改变事件
    pageCurrentChange(val) {
      //查询
      this.search();
    },
    //排序
    sortList(column) {
      if (!column.prop || !column.order) {
        //不排序
        this.req.sort = "";
      } else {
        switch (column.prop) {
          case "outDate":
            this.req.sort = "outDate";
            break;
          case "outCategoryName":
            this.req.sort = "outCategoryID";
            break;
          case "outTypeName":
            this.req.sort = "outTypeID";
            break;
          case "amountAccountName":
            this.req.sort = "amountAccountID";
            break;
          case "amount":
            this.req.sort = "amount";
            break;
          default:
            this.req.sort = "outDate";
            break;
        }

        this.req.sort += column.order == "ascending" ? " asc" : " desc";
      }

      //查询
      this.search();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
