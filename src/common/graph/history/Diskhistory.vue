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
	name: 'DiskHistory',
	props: {
		time: Array,
		diskuse: Array,
		diskoption: Array
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
				let diskHistoryOption = {
					 title: {
				        text: '磁盘历史数据',
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
		          //   	formatter: '{a0}: {c0}%<br/>{a1}: {c1}%'
				    },
				    legend: {
				        data: ['已使用', '未使用'],
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
				            name: '已使用(%)',
				            type: 'value'
				        },
				        {
				            name: '未使用(%)',
				            nameLocation: 'start',
				            type: 'value',
				            inverse: true
				        }
				    ],
				    series: [
				        {
				            name: '已使用',
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
				            data: this.diskuse
				        },
				        {
				            name: '未使用',
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
				            data: this.diskoption
				        }
				    ]
				};
				myEchart.setOption(diskHistoryOption);
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