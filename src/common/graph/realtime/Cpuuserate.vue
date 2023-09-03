<template>
  <div ref="pie" class="graph" v-loading="loading">
  	
  </div>
</template>

<script>
//引入echarts主模块
let echarts = require('echarts/lib/echarts')
// 引入饼图
require('echarts/lib/chart/pie');
// 引入提示框、标题和图例组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');

export default {
  name: 'CpuUserate',
  props: {
  	idle: Number,
    systemCpu: Number,
    userCpu: Number
  },
  data() {
    return {
      loading: true
    }
  },
  watch: {
    idle: function(newValue, oldValue) {
      if (newValue != oldValue) {
          //通过 echarts.init 方法初始化一个echarts实例并通过setOption方法生成图表

            //cpu利用率
          let myEchart = echarts.init(this.$refs.pie);

          let cpurateOption = {
            color:['#E6A23C','#409EFF','#F56C6C'],
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
               orient: 'vertical',
               left: '-5',
               data: ['cpu空闲比率', '系统cpu占比','用户cpu占比']
            },
            series: [
                {
                    name: 'cpu利用率',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '12',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                      {value: this.idle, name: 'cpu空闲比率'},
                      {value: this.systemCpu, name: '系统cpu占比'},
                      {value: this.userCpu, name: '用户cpu占比'}
                    ]
                }
            ]
          };
          myEchart.setOption(cpurateOption);
          this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
  .graph {
  	width: 300px;
  	height: 130px;
  }
</style>
