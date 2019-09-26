<!-- 支出统计 -->
<template>
  <el-row class="warp">
    <el-col
      :span="24"
      class="warp-breadcrum"
    >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
        <el-breadcrumb-item>报表</el-breadcrumb-item>
        <el-breadcrumb-item>支出统计</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col
      :span="24"
      class="warp-main"
    >
      <!--工具条-->
      <el-row :span="24">
        <el-form :inline="true">
          <el-form-item
            label="日期"
            class="toolbar-item"
          >
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

          <el-form-item
            label="类型"
            class="toolbar-item"
          >
            <OGSelect
              v-model="req.groupType"
              ref="groupType"
            ></OGSelect>
          </el-form-item>

          <el-form-item
            class="toolbar-item"
            style="margin-left:20px;"
          >
            <el-button
              type="primary"
              @click="search"
            >统计</el-button>
          </el-form-item>
          
          <el-form-item class="toolbar-item">
            <el-switch
              v-model="req.isContainBorrowRepay"
              active-text="包含借还"
              @change="search"
            ></el-switch>
          </el-form-item>

        </el-form>
      </el-row>

      <el-tabs
        type="card"
        style="margin-top:10px; "
      >
        <el-tab-pane
          label="图标"
          :lazy="true"
        >
          <div
            id="echartDiv"
            :style="'height: ' + tableHeight + 'px;'"
          ></div>
        </el-tab-pane>
        <el-tab-pane label="数据">
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
            stripe
          >
            <el-table-column
              type="index"
              width="80"
            ></el-table-column>
            <el-table-column
              prop="name"
              :label="groupTypeName"
              width="200"
              sortable
            ></el-table-column>
            <el-table-column
              prop="value"
              label="金额"
              align="right"
              :formatter="formatAmount"
              sortable
            ></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-col>
  </el-row>
</template>
<script>
import Util from "@/utils/util";
import ReportAPI from "@/api/reportAPI";
import OGSelect from "@/components/ogSelect";

//图标清晰度
//注意：
//1.这段代码应当写在echarts.js引入之前
//2.这个属性对于移动端设备有重要影响，使用时请结合项目，切勿乱用
window.devicePixelRatio = 2;

// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入饼图
require("echarts/lib/chart/pie");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
// 引入legend组件
require("echarts/lib/component/legend");
//滚动条
require("echarts/lib/component/legendScroll");

export default {
  components: {
    OGSelect
  },
  data() {
    return {
      //表格高度
      tableHeight: window.innerHeight - 210,

      //开始日期快捷方式
      startDateOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
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
        startDate: Util.Fun.formatDate(Util.Fun.getCurYearStart()), //开始日期
        endDate: Util.Fun.formatDate(new Date()), //截止日期
        groupType: 0 //统计类型（0：分类；1：类型；2：账户；3：月份；4：年度）
      },

      //分组类型名称
      groupTypeName: "类型",

      //表格数据
      list: []
    };
  },
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
      this.tableHeight = window.innerHeight - 210;
    },
    //格式化金额
    formatAmount(row, column, cellValue, index) {
      return Util.Fun.formatAmount(cellValue);
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
      ReportAPI.sumOutPut(this.req).then(function(result) {
        if (result.isOK) {
          //分组名
          let groupTypeItem = that.$refs.groupType.findItem(that.req.groupType);
          if (groupTypeItem) {
            that.groupTypeName = groupTypeItem.name;
          }

          //清空排序状态
          that.$refs.table.clearSort();

          //统计结果
          that.list = result.lstInfo;
          //排序方式
          switch (that.req.groupType) {
            case 0: //分类
            case 1: //类型
            case 2: //账户
              that.$refs.table.sort("value", "descending");
              break;
            default:
              //月份、年度
              that.$refs.table.sort("name", "descending");
              break;
          }

          //显示图标
          that.showEchart();
        }
      });
    },
    //显示图标
    showEchart() {
      //总金额
      let totalAmount = 0;
      //图例
      let legendData = [];

      //遍历统计结果
      this.list.forEach(item => {
        totalAmount += item.value;
        legendData.push(item.name);
      });

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("echartDiv"));
      // 绘制图表
      myChart.setOption(
        {
          title: {
            text: "支出统计",
            subtext: "¥" + Util.Fun.formatAmount(totalAmount),
            x: "center"
          },
          tooltip: {
            trigger: "item",
            formatter: "{b}：¥{c} ({d}%)"
          },
          legend: {
            type: "scroll",
            orient: "vertical",
            left: "left",
            data: legendData
          },
          series: [
            {
              type: "pie",
              radius: "55%",
              center: ["50%", "50%"],
              data: this.list,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                },
                normal: {
                  label: {
                    formatter: "{b}：¥{c}"
                  }
                }
              }
            }
          ]
        });

        window.onresize = myChart.resize;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
