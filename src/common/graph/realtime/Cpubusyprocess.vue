<template>
  <div ref="bar" class="graph" v-loading="loading">
  	
  </div>
</template>

<script>
//引入echarts主模块
let echarts = require('echarts/lib/echarts')
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/scatter');
// 引入提示框、标题和图例组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');

export default {
  name: 'CpubusyProcess',
  props: {
  	cpuStates: Array
  },
  data() {
    return {
       yAxisData: [],
       seriesData1: [],//cpu利用率占比
       seriesData2: [],//进程名称
       loading: true
    }
  },
  watch: {
    cpuStates: function(newValue, oldValue) {
      
      if (newValue != oldValue) {
        for (let i=0; i< newValue.length; i++) {
          this.yAxisData[i] = newValue[i].program;
          this.seriesData1[i] = parseFloat(newValue[i].cpu);
          this.seriesData2[i] = newValue[i].pid;
        }
        this.showCpustateInfo();
        this.loading = false;
      }
    }
  },
  methods: {
    showCpustateInfo() {
      //通过 echarts.init 方法初始化一个echarts实例并通过setOption方法生成图表

        //最忙碌的十个进程
      let myEchart = echarts.init(this.$refs.bar);
      let processOption = {
        color: ['#E6A23C'],
        title: {
          text: 'cpu利用率最高的'+this.yAxisData.length+'个进程',
          right: 'center',
          textStyle: {
            fontSize: 14,
            color: '#666'
          }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            //a是系列名，c是数据值
            formatter: '{a0}: {c0}<br/>{a1}: {c1}%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: [
            //进程编号
            {
                type: 'value',
                position: 'top',
                show: false
            },
            {
                type: 'value',
                name: 'cpu利用率占比',
                nameLocation: 'center',
                nameGap: '30',
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        yAxis: {
            type: 'category',
            name: '进程名称',
            data: this.yAxisData
        },
        series: [
          {
              name: '进程编号',
              type: 'line',
              xAxisIndex: 0,
              data: this.seriesData2,
              symbol: 'none', //隐藏点
              //隐藏线
              lineStyle: {
                width: 0,
                color: '#fff'
              }
          },
          {
              name: 'cpu利用率占比',
              type: 'bar',
              xAxisIndex: 1,
              data: this.seriesData1
          }
        ]
      };
      myEchart.setOption(processOption);
    }
  }
 
}
</script>

<style scoped>
  .graph {
  	width: 800px;
  	height: 300px;
  }
</style>
