<template>
  <div ref="line" class="graph" v-loading="loading">
  	
  </div>
</template>

<script>
//引入echarts主模块
let echarts = require('echarts/lib/echarts')
// 引入折线图
require('echarts/lib/chart/line');
// 引入提示框、标题、图例、缩放和标记组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
require('echarts/lib/component/dataZoom');
//require('echarts/lib/component/marker');

export default {
	name: 'NetworkHistory',
	props: {
		time: Array,
		txpc: Array,
		rxpc: Array
	},
	data() {
		return {
			loading: true
		}
	},
	watch: {
		time: function(newValue, oldValue) {
			if (newValue != '') {
				let myEchart = echarts.init(this.$refs.line);
				let networkHistoryOption = {
					 title: {
				        text: '网络信息历史数据',
				        left: 'center',
				        align: 'right'
				    },
				    grid: {
				        bottom: 70
				    },
				    toolbox: {
				        feature: {
				            dataZoom: {
				                yAxisIndex: 'none'
				            },
				            restore: {},
				            saveAsImage: {}
				        }
				    },
				    tooltip: {
				        trigger: 'axis',
				        axisPointer: {
				            type: 'cross',
				            animation: false,
				            label: {
				                backgroundColor: '#505765'
				            }
				        },
				        // //a是系列名，c是数据值
		          //   	formatter: '{a0}: {c0}kb/s<br/>{a1}: {c1}kb/s'
				    },
				    legend: {
				        data: ['发送字节数', '接收字节数'],
				        left: 'center',
				        top: 27
				    },
				    dataZoom: [
				        {
				            show: true,
				            realtime: true,
				            start: 65,
				            end: 85
				        },
				        {
				            type: 'inside',
				            realtime: true,
				            start: 65,
				            end: 85
				        }
				    ],
				    xAxis: [
				        {
				            type: 'category',
				            boundaryGap: false,
				            axisLine: {onZero: false},
				            data: this.time.map(function (str) {
				                return str.replace(' ', '\n');
				            })
				        }
				    ],
				    yAxis: [
				        {
				            name: '发送字节数(kb/s)',
				            type: 'value'
				        },
				        {
				            name: '接收字节数(kb/s)',
				            nameLocation: 'start',
				            type: 'value',
				            inverse: true
				        }
				    ],
				    series: [
				        {
				            name: '发送字节数',
				            type: 'line',
				            animation: false,
				            areaStyle: {},
				            lineStyle: {
				                width: 1
				            },
				            // markArea: {
				            //     silent: true,
				            //     data: [[{
				            //         xAxis: '2009/9/12\n7:00'
				            //     }, {
				            //         xAxis: '2009/9/22\n7:00'
				            //     }]]
				            // },
				            data: this.txpc
				        },
				        {
				            name: '接收字节数',
				            type: 'line',
				            yAxisIndex: 1,
				            animation: false,
				            areaStyle: {},
				            lineStyle: {
				                width: 1
				            },
				            // markArea: {
				            //     silent: true,
				            //     data: [
				            //         [{
				            //             xAxis: '2009/9/10\n7:00'
				            //         }, {
				            //             xAxis: '2009/9/20\n7:00'
				            //         }]
				            //     ]
				            // },
				            data: this.rxpc
				        }
				    ]
				};
				myEchart.setOption(networkHistoryOption);
				this.loading = false;
			}
		}
	}
}
</script>

<style scoped>
  .graph {
  	width: 800px;
    height: 400px;
  }
</style>