<!-- 收入统计 -->
<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <b>首页</b>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>

    <el-col :span="24" class="warp-main">
      <!--工具条-->
      <el-row :span="24">
        <el-form :inline="true">
          <el-form-item class="toolbar-item">
            <el-switch
              v-model="showAll"
              inactive-color="#13ce66"
              active-text="全部"
              inactive-text="今年"
              @change="showAllChanged"
            ></el-switch>
          </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-form-item class="toolbar-item">
            <el-switch
              v-model="req.groupType"
              inactive-color="#13ce66"
              active-text="按年"
              inactive-text="按月"
              active-value="4"
              inactive-value="3"
              @change="search"
            ></el-switch>
          </el-form-item>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-form-item class="toolbar-item">
            <el-switch
              v-model="req.isContainBorrowRepay"
              inactive-color="#13ce66"
              active-text="包含借还"
              inactive-text="不包含借还"
              @change="search"
            ></el-switch>
          </el-form-item>
        </el-form>
      </el-row>

      <el-tabs type="card" style="margin-top:10px; ">
        <el-tab-pane label="图标" :lazy="true">
          <div id="echartDiv" :style="'height: ' + tableHeight + 'px;'"></div>
        </el-tab-pane>
        <el-tab-pane label="数据">
          <!--列表-->
          <el-table
            ref="table"
            :data="list"
            highlight-current-row
            style="width: 100%;"
            :maxHeight="tableHeight"
            :default-sort="{ prop: 'period', order: 'descending' }"
            show-summary
            :summary-method="doSum"
            stripe
          >
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column prop="period" label="日期" width="200" sortable></el-table-column>
            <el-table-column prop="inOut" label="收支" width="200" sortable></el-table-column>
            <el-table-column
              prop="amount"
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
import axios from "axios";

//图标清晰度
//注意：
//1.这段代码应当写在echarts.js引入之前
//2.这个属性对于移动端设备有重要影响，使用时请结合项目，切勿乱用
window.devicePixelRatio = 2;

// 引入 ECharts 主模块
var echarts = require("echarts/lib/echarts");
// 引入柱形图
require("echarts/lib/chart/bar");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
// 引入legend组件
require("echarts/lib/component/legend");
//滚动条
require("echarts/lib/component/legendScroll");
//标记
require("echarts/lib/component/markLine");


export default {
  data() {
    return {
      //表格高度
      tableHeight: window.innerHeight - 180,

      //统计范围条件
      showAll: false, //true：显示全部；false：显示今年

      //查询条件
      req: {
        startDate: Util.Fun.formatDate(Util.Fun.getCurYearStart()), //开始日期
        endDate: null, //截止日期
        groupType: 3, //统计类型（3：月份；4：年度）
        isContainBorrowRepay: false //是否包含借还
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
      this.tableHeight = window.innerHeight - 180;
    },
    //格式化金额
    formatAmount(row, column, cellValue, index) {
      //支出显示成负数
      if (row.inOut == "支出") {
        return Util.Fun.formatAmount(-cellValue);
      }

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
        if (column.property != "amount") {
          sums[index] = "";
          return;
        }

        //金额列
        sums[index] = 0;
        data.forEach(item => {
          //支出列按负数计算
          if (item.inOut == "支出") {
            sums[index] += -item[column.property];
          } else {
            sums[index] += item[column.property];
          }
        });

        sums[index] = Util.Fun.formatAmount(sums[index]);
      });

      return sums;
    },
    //统计范围条件改变
    showAllChanged() {
      if (this.showAll) {
        //显示全部
        this.req.startDate = null;
      } else {
        //只显示今年
        this.req.startDate = Util.Fun.formatDate(Util.Fun.getCurYearStart());
      }

      //查询
      this.search();
    },
    //查询
    search() {
      let that = this;

      //清空列表
      that.list = [];

      //调接口
      axios
        .all([
          //收入统计
          ReportAPI.sumInCome(this.req),
          //支出统计
          ReportAPI.sumOutPut(this.req)
        ])
        .then(
          axios.spread(function(inRes, outRes) {
            //收入统计结果
            if (inRes.isOK) {
              //收入统计结果加入列表
              inRes.lstInfo.forEach(info => {
                let item = {
                  period: info.name,
                  inOut: "收入",
                  amount: info.value
                };

                that.list.push(item);
              });
            }

            //支出统计结果
            if (outRes.isOK) {
              //支出统计结果加入列表
              outRes.lstInfo.forEach(info => {
                let item = {
                  period: info.name,
                  inOut: "支出",
                  amount: info.value
                };

                that.list.push(item);
              });
            }

            //排序
            Util.Fun.sortArrayObj(that.list, "period", false);

            //显示图标
            that.showEchart();
          })
        );
    },
    //找数据
    findItem(period, inOut) {
      let ret = null;

      //遍历数据
      this.list.forEach(item => {
        if (item.period == period && item.inOut == inOut) {
          ret = item;
          return false; //退出循环
        }
      });

      return ret;
    },
    //显示图标
    showEchart() {
      //图例
      let legendData = ["收入", "支出"];

      //X轴
      let xAxisData = [];
      this.list.forEach(item => {
        xAxisData.push(item.period);
      });
      //图例去重
      xAxisData = Util.Fun.distinctArray(xAxisData);
      //排序
      xAxisData.sort();

      //收入总金额
      let inTotalAmount = 0;
      //支出总金额
      let outTotalAmount = 0;
      //收入集合
      let arrIn = [];
      //支出集合
      let arrOut = [];

      //遍历X轴
      xAxisData.forEach(xAxis => {
        //收入数据
        let inData = this.findItem(xAxis, "收入");
        if (inData) {
          inTotalAmount += inData.amount;
          arrIn.push(inData.amount);
        } else {
          arrIn.push("0.00");
        }

        //支出数据
        let outData = this.findItem(xAxis, "支出");
        if (outData) {
          outTotalAmount += outData.amount;
          arrOut.push(outData.amount);
        } else {
          arrOut.push("0.00");
        }
      });

      //金额格式化
      inTotalAmount = Util.Fun.formatAmount(inTotalAmount);
      outTotalAmount = Util.Fun.formatAmount(outTotalAmount);

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("echartDiv"));
      // 绘制图表
      myChart.setOption(
        {
          title: {
            text: "收支统计",
            subtext:
              "总收入：¥" +
              inTotalAmount +
              " - 总支出：¥" +
              outTotalAmount +
              " = ¥" +
              Util.Fun.formatAmount(inTotalAmount - outTotalAmount)
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            data: legendData
          },
          toolbox: {
            show: true,
            feature: {
              magicType: { show: true, type: ["line", "bar"] }
            }
          },
          calculable: true,
          xAxis: [
            {
              type: "category",
              data: xAxisData
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "收入",
              type: "bar",
              data: arrIn,
              label: {
                normal: {
                  show: true,
                  position: "top"
                }
              },
              markLine: {
                data: [{ type: "average", name: "平均值" }]
              }
            },
            {
              name: "支出",
              type: "bar",
              data: arrOut,
              label: {
                normal: {
                  show: true,
                  position: "top"
                }
              },
              markLine: {
                data: [{ type: "average", name: "平均值" }]
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
