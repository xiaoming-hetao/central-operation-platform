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
  name: 'DiskUse',
  props: {
  	diskuse: Number,
    diskoption: Number
  },
  data() {
    return {
      loading: true
    }
  },
  watch: {
  	diskuse: function(newValue, oldValue) {
      if (newValue != oldValue) {
        //通过 echarts.init 方法初始化一个echarts实例并通过setOption方法生成图表
        //磁盘使用量
        let myEchart = echarts.init(this.$refs.pie);

        let diskOption = {
          color:['#E6A23C','#409EFF'],
          tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
             orient: 'vertical',
             left: '-5',
             data: ['使用中', '未使用']
          },
          series: [
              {
                  name: '磁盘使用量',
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
                    {value: this.diskuse, name: '使用中'},
                    {value: this.diskoption, name: '未使用'}
                  ]
              }
          ]
        };
        myEchart.setOption(diskOption);
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
