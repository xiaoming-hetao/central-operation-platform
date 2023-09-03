<template>
  <div>
  	<monitor-header @check="handleCheck"></monitor-header>
    <transition-group name="fade" mode="out-in">
      <!-- 基本信息 -->
      <monitor-baseinfo
        v-show="show"
        key="baseinfo"
        :baseInfo="baseInfo"
      >
      </monitor-baseinfo>

      <!-- 实时监控和历史数据 -->
      <div v-show="show" key="realtime-history">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">实时监控</el-menu-item>
        <el-menu-item index="2">历史数据</el-menu-item>
        </el-menu>
        <div v-if="activeIndex==1" key="realtime">
          <monitor-realtime
            :realtimeInfo="realtimeInfo"
            :networkData="networkData"
          >
          </monitor-realtime>
        </div>
        <div v-else key="history">
          <monitor-history :postIP="postIP"></monitor-history>
        </div>
      </div>
    </transition-group>

  </div>
</template>

<script>
import MonitorHeader from './components/Header'
import MonitorBaseinfo from './components/Baseinfo'
import MonitorRealtime from './components/Realtime'
import MonitorHistory from './components/History'
import requestMethod from '@/utils/request'
export default {
  name: 'Monitor',
  components: {
  	MonitorHeader,
  	MonitorBaseinfo,
  	MonitorRealtime,
    MonitorHistory
  },
  data () {
  	return {
  		show: false,
      activeIndex: '1',
      baseInfo: [],
      realtimeInfo: {},
      postIP: '',
      networkData: [],
      timer1: null, //定义定时器，用来定时请求数据
      timer2: null
  	}
  },
  methods: {
  	handleCheck(pcIP) {
      this.postIP = pcIP;
   },
   //切换导航菜单触发的事件(切换显示实时监控和历史数据)
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    }
  },
  watch: {
    postIP: function(newValue, oldValue) {
      if (newValue != oldValue) {
        const that = this;
        let ip = {
          pcIP: that.postIP
        };
        //请求所搜索设备基本信息
        requestMethod({
          url: '/getState',
          method: 'post',
          data: ip
        })
          .then(function(res) {
              const data = res.data;
              that.baseInfo = data.data;
          });

        //3秒请求一次所搜索设备的实时信息
        that.timer1 = setInterval(() => {
           requestMethod({
            url: '/getTimeData',
            method: 'post',
            data: ip
          })
            .then(function(res) {
                  const data = res.data;
                  that.realtimeInfo = data;
                });
            }, 3000);

        that.timer2 =  setInterval(() => {
          //3秒请求一次所搜索设备的实时信息
          requestMethod({
            url: '/getSixTimeData',
            method: 'post',
            data: ip
          })
            .then(function(res) {
                const data = res.data;
                that.networkData = data.data;
              });
          },3000);

       that.show = true;
      }
    }
  },
  //组件销毁前（离开实时监控页面）清除定时器，停止请求实时数据
  beforeDestroy() {
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    this.timer1 = null;
    this.timer2 = null;
  }
}
</script>

<style scoped>
  /*渐隐渐现动画*/
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
</style>
