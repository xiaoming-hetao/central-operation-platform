<template>
  <div ref="line" class="graph" v-loading="loading">
  	
  </div>
</template>

<script>
//引入echarts主模块
let echarts = require('echarts/lib/echarts')
// 引入折线图
require('echarts/lib/chart/line');
// 引入提示框、标题和图例组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');

export default {
  name: 'Network',
  props: {
  	networkData: Array
  },
  data() {
    return {
        loading: true,
        rxpc: [],
        txpc: [],
        time: []
    }
  },
  watch: {
     networkData: function(newValue, oldValue) {
      console.log(newValue);
      if (newValue != '') {
        for (let i=0; i<newValue.length; i++) {
          this.rxpc[i] = parseFloat(newValue[i].rxpc);
          this.txpc[i] = parseFloat(newValue[i].txpc);
          this.time[i] = newValue[i].time;
        }
        
        this.showNetwokInfo();
        this.loading = false;
      }
    }
  },
  methods: {
    showNetwokInfo() {
         //通过 echarts.init 方法初始化一个echarts实例并通过setOption方法生成图表
        //网络发送字节数和接收字节数
        let myEchart = echarts.init(this.$refs.line);
        let colors = ['#5793f3', '#E6A23C', '#675bba'];
        let networkOption = {
            color: colors,
            title: {
                text: '网络信息',
                right: 'center',
                textStyle: {
                  fontSize: 14,
                  color: '#666'
                }
            },
            tooltip: {
                trigger: 'none',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data:['每秒发送字节数', '每秒接收字节数'],
                top: 22
            },
            grid: {
                top: 70,
                bottom: 50
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return '接收字节数  ' + params.value
                                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            }
                        }
                    },
                    data: this.time
                },
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisPointer: {
                        label: {
                            formatter: function (params) {
                                return '发送字节数  ' + params.value
                                    + (params.seriesData.length ? '：' + params.seriesData[0].data : '');
                            }
                        }
                    },
                    data: this.time
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                      formatter: '{value} kb/s'
                    }
                }
            ],
            series: [
                {
                    name: '每秒发送字节数',
                    type: 'line',
                    xAxisIndex: 1,
                    smooth: true,
                    data: this.txpc
                },
                {
                    name: '每秒接收字节数',
                    type: 'line',
                    smooth: true,
                    data: this.rxpc
                }
            ]
        };
        myEchart.setOption(networkOption);
            
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
