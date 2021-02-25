<template>
  <div>
    <div class="analyzeSystem" style="width:545px;height:340px;display: inline-block;float:left">
      <div :class="className" :id="id" :style="{height:height,width:width}" ref="myEchart"></div>
    </div>
    <div
      style="width:545px;height:340px;background:#fff;display: inline-block;margin-left:20px;float:left"
    >
      <p
        style="font-weight: 700;font-size: 15px;color: #333333;margin-left: 20px;margin-top: 20px;"
      >故障报警</p>
      <div
        style="width:477px;height:70px;margin-left:34px;background:rgba(242, 242, 242, 1);margin-top: 20px;padding-top: 15px;"
      >
        <p style="font-weight: 700;color: #333333;margin-left: 34px;">1号线-1号料架-3行2列-78992382(托盘1)</p>
        <p style="margin-left: 34px;color: #A30014;">急停故障(DB99.DBX1500.0)</p>
      </div>
      <div
        style="width:477px;height:70px;margin-left:34px;background:rgba(242, 242, 242, 1);margin-top: 20px;padding-top: 15px;"
      >
        <p style="font-weight: 700;color: #333333;margin-left: 34px;">1号线-1号料架-3行2列-78992382(托盘1)</p>
        <p style="margin-left: 34px;color: #A30014;">急停故障(DB99.DBX1500.0)</p>
      </div>
      <div
        style="width:477px;height:70px;margin-left:34px;background:rgba(242, 242, 242, 1);margin-top: 20px;padding-top: 15px;"
      >
        <p style="font-weight: 700;color: #333333;margin-left: 34px;">1号线-1号料架-3行2列-78992382(托盘1)</p>
        <p style="margin-left: 34px;color: #A30014;">急停故障(DB99.DBX1500.0)</p>
      </div>
    </div>
    <div
      style="margin-top:20px;width:1110px;height:300px;background:#fff;clear: both;display: inline-block;float:left"
    >
      <div style="width:1110px;height:300px;" ref="myEcharts"></div>
    </div>
    <div
      style="float: left;padding-top: 17px;padding-left: 17px;margin-top:20px;width:550px;height:250px;background:#fff;clear: both;display: inline-block;"
    >
      <p style="font-weight: 700;color: #333333;">入库队列</p>
      <p style="font-weight: 600;font-size:12px;color: #333333;">入库中:1,入库等待:1</p>
      <div style="padding-top:10px">
        <div style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;padding-left:10px">
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#2F57F7"
          ></div>
          <span style="font-size:12px;color: #333333;">入库中</span>
          <span style="margin-left:50px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
        <div
          style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;padding-left:10px;margin-top:5px"
        >
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#C3C3C3"
          ></div>
          <span style="font-size:12px;color: #333333;">入库等待</span>
          <span style="margin-left:38px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
        <div
          style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;padding-left:10px;margin-top:5px"
        >
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#2F57F7"
          ></div>
          <span style="font-size:12px;color: #333333;">入库中</span>
          <span style="margin-left:50px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
        <div
          style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;padding-left:10px;margin-top:5px"
        >
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#2F57F7"
          ></div>
          <span style="font-size:12px;color: #333333;">入库中</span>
          <span style="margin-left:50px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
        <div
          style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;padding-left:10px;margin-top:5px"
        >
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#00E941"
          ></div>
          <span style="font-size:12px;color: #333333;">入库完成</span>
          <span style="margin-left:38px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
      </div>
    </div>
    <!-- 出库队列 -->
    <div
      style="padding-top: 17px;padding-left: 17px;margin-top:20px;margin-left:10px;width:550px;height:250px;background:#fff;float: left;display: inline-block;"
    >
      <p style="font-weight: 700;color: #333333;">出库队列</p>
      <p style="font-weight: 600;font-size:12px;color: #333333;">出库中:1,出库等待:1</p>
      <div style="padding-top:10px">
        <div style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;">
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#2F57F7"
          ></div>
          <span style="font-size:12px;color: #333333;">出库中</span>
          <span style="margin-left:50px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
        <div style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;margin-top:5px">
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#C3C3C3"
          ></div>
          <span style="font-size:12px;color: #333333;">出库等待</span>
          <span style="margin-left:38px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
        <div style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;margin-top:5px">
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#2F57F7"
          ></div>
          <span style="font-size:12px;color: #333333;">出库中</span>
          <span style="margin-left:50px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
        <div style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;margin-top:5px">
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#2F57F7"
          ></div>
          <span style="font-size:12px;color: #333333;">出库中</span>
          <span style="margin-left:50px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
        <div style="width:480px;height:30px;line-height: 30px;background:#f5f7f9;margin-top:5px">
          <div
            style="position: relative;top: 5px;width:10px;height:20px;display:inline-block;background:#00E941"
          ></div>
          <span style="font-size:12px;color: #333333;">出库完成</span>
          <span style="margin-left:38px;font-size:12px;color: #333333;">TP202012030002(托盘2)</span>
          <span
            style="margin-left:50px;font-size:12px;font-weight: 700;color: #333333;"
          >2号线-2号料架-3行2列</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "analyzeSystem",
  props: {
    className: {
      type: String,
      default: "yourClassName"
    },
    id: {
      type: String,
      default: "yourID"
    },
    width: {
      type: String,
      default: "545px"
    },
    height: {
      type: String,
      default: "340px"
    }
  },
  data () {
    return {
      chart: null,
      charts: null
    };
  },
  mounted () {
    this.initChart();
  },
  beforeDestroy () {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$refs.myEchart);
      this.charts = echarts.init(this.$refs.myEcharts);
      // 把配置和数据放这里
      this.chart.setOption({
        backgroundColor: "#fff",

        title: {
          text: "仓库使用率",
          left: "20px",
          top: '20px',
          textStyle: {
            fontSize: 15
          }
        },

        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },

        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          icon: 'circle',
          data: ['满载', '有空余', '无托盘'],

          // selected: data.selected
        },
        series: [
          {
            name: '状态',
            color: ['#812430', '#648b26', '#4995e6'],
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            label: {
              formatter: '{b}:({d}%)'
            },
            data: [{ name: '满载', value: 29 }, { name: '有空余', value: 29 }, { name: '无托盘', value: 40 }],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        marior: {

        }
      });
      //折线图
      var colors = ['#5793f3', '#d14a61', '#675bba'];
      this.charts.setOption({
        color: colors,
        title: {
          text: '出入库走势图',
          left: "20px",
          top: '20px',
          textStyle: {
            fontSize: 15
          }
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['入库', '出库'],
          right: 50
        },
        grid: {
          top: 70,
          bottom: 50
        },
        xAxis: {
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          data: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10', '12-12', '12-13',
            '12-14',
            '12-15']
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '入库',
            type: 'line',
            smooth: true,
            data: [15, 18, 21, 8, 33, 30, 45, 20, 30, 33, 74, 50, 55, 30]
          },
          {
            name: '出库',
            type: 'line',
            smooth: true,
            data: [13, 17, 45, 18, 48, 69, 23, 46, 55, 18, 10, 7, 15, 20]
          }
        ]
      });

    }
  }
};
</script>

<style>
</style>