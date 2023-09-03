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
	name: 'CpuHistory',
	props: {
		time: Array,
		idle: Array,
		//iowait: Array
		systemCpu: Array,
		userCpu: Array,
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
				let cpuHistoryOption = {
					 title: {
				        text: 'Cpu历史数据',
				        left: 'center',
				        align: 'right'
				    },
				    grid: {
				        bottom: 70,
				        right: '20%'
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
		          //   	formatter: '{a0}: {c0}%<br/>{a1}: {c1}%<br/>{a2}: {c2}%'
				    },
				    legend: {
				        data: ['Cpu空闲率', '系统Cpu占比','用户Cpu占比'],
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
				            name: 'Cpu空闲率(%)',
				            type: 'value'
				        },
				        {
				            name: '系统Cpu占比(%)',
				            nameLocation: 'start',
				            type: 'value',
				            inverse: true
				        },
				        {
				            name: '用户Cpu占比(%)',
				            nameLocation: 'start',
				            position: 'right',
                            offset: 100,
				            type: 'value',
				            inverse: true
				        }
				    ],
				    series: [
				        {
				            name: 'Cpu空闲率',
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
				            data: this.idle
				        },
				        {
				            name: '系统Cpu占比',
				            type: 'line',
				            yAxisIndex: 1,
				            animation: false,
				            areaStyle: {},
				            lineStyle: {
				                width: 1
				            },
				            data: this.systemCpu
				        },
				         {
				            name: '用户Cpu占比',
				            type: 'line',
				            yAxisIndex: 1,
				            animation: false,
				            areaStyle: {},
				            lineStyle: {
				                width: 1
				            },
				            data: this.userCpu
				        }
				    ]
				};
				myEchart.setOption(cpuHistoryOption);
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