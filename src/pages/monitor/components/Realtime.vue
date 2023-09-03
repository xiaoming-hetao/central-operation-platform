<template>
  <div>
    <el-row>
    	<el-col :span="6">
    	  <p>内存</p>
    	  <memory-use 
          :memused="memused"
          :memoption="memoption"
        >
        </memory-use>
        <p>使用量 {{memusedNum}}G</p>
        <p>未使用量 {{memoptionNum}}G</p>
        <p>缓存 {{kbcache}}G  交换区大小 {{kbswap}}</p>
        <p>最低需求内存 {{kbcommit}}G</p>
    	</el-col>
    	<el-col :span="6">
    	  <p>磁盘</p>
    	  <disk-use
          :diskuse="diskuse"
          :diskoption="diskoption"
        >  
        </disk-use>
        <p>使用量 {{diskuseNum}}G</p>
        <p>未使用量 {{diskoptionNum}}G</p>
    	</el-col>
      <el-col :span="6">
        <p>cpu利用率</p>
         <cpu-userate
           :idle="idle"
           :systemCpu="systemCpu"
           :userCpu="userCpu"
         >
         </cpu-userate>
        <p>cpu空闲率 {{idle}}%</p>
        <p>系统cpu占比 {{systemCpu}}%</p>
        <p>用户cpu占比 {{userCpu}}%</p>
      </el-col>
    </el-row>
    <el-row>
      <!-- 内存使用最多的十个进程 -->
      <membusy-process :memStates="memStates"></membusy-process>
    </el-row>
    <el-row>
      <!-- cpu利用率最高的十个进程 -->
      <cpubusy-process :cpuStates="cpuStates"></cpubusy-process>
    </el-row>
    <el-row>
      <!-- 网络信息 -->
      <network 
        :networkData="networkData"
      ></network>
    </el-row>
  </div>
</template>

<script>
import MemoryUse from 'common/graph/realtime/Memoryuse'
import DiskUse from 'common/graph/realtime/Diskuse'
import CpuUserate from 'common/graph/realtime/Cpuuserate'
import MembusyProcess from 'common/graph/realtime/Membusyprocess'
import CpubusyProcess from 'common/graph/realtime/Cpubusyprocess'
import Network from 'common/graph/realtime/Network'
//引入中央事件总线
import bus from '@/assets/bus'
export default {
  name: 'MonitorRealtime',
  components: {
    MemoryUse,
    DiskUse,
    CpuUserate,
    MembusyProcess,
    CpubusyProcess,
    Network
  },
  props: {
  	realtimeInfo: Object,
    networkData: Array
  },
  data() {
    return {
      disk: 0, //磁盘总量
      memory: 0, //内存总量
      cpuStates: [], //cpu利用率最高的进程
      memStates: [], //内存使用最多的进程,
      memused: 0, //已使用内存百分比
      memoption: 0, //剩余内存百分比
      kbcache: 0, //缓存
      kbcommit: 0, //最低需求内存
      kbswap: 0, //交换区
      diskuse: 0, //已使用磁盘百分比
      diskoption: 0, //剩余磁盘百分比
      idle: 0, //cpu空闲比率
      systemCpu: 0, //系统cpu占比
      userCpu: 0, //用户cpu占比
      diskuseNum: 0, //已使用磁盘量
      diskoptionNum: 0,//剩余磁盘量
      memusedNum: 0, //已使用内存量
      memoptionNum: 0 //剩余内存量
    }
  },
  
  watch: {
    realtimeInfo: function(newValue, oldValue) {
      if (newValue != oldValue) {
        //内存信息
        this.memused = parseFloat(newValue.memused);
        this.memoption = parseFloat((100-this.memused).toFixed(2));
        this.kbcache = parseFloat(newValue.kbcache/(1024*1024)).toFixed(2);
        this.kbcommit = parseFloat(newValue.kbcommit/(1024*1024)).toFixed(2);
        this.kbswap = parseFloat(newValue.kbswap/(1024*1024));
        //磁盘
        this.diskuse = parseFloat(newValue.diskuse);
        this.diskoption = parseFloat((100-this.diskuse).toFixed(2));
        //cpu信息
        this.idle = parseFloat(newValue.idle);
        this.systemCpu = parseFloat(newValue.system_cpu);
        this.userCpu = parseFloat(newValue.user_cpu);
        this.cpuStates = newValue.cpuStates;
        this.memStates = newValue.memStates;
        
        this.handleMemDsik();
      }
      
    }
  },
  methods: {
    handleMemDsik() {
      this.diskuseNum = (this.disk*(this.diskuse/100)).toFixed(2);//总磁盘乘于使用百分比
      this.diskoptionNum = (this.disk-this.diskuseNum).toFixed(2);

      this.memusedNum = (this.memory*(this.memused/100)).toFixed(2);//总内存乘于使用百分比
      this.memoptionNum = (this.memory-this.memusedNum).toFixed(2);
    }
  },
  mounted() {
    // //通过事件总线监听兄弟组件baseinfo触发的事件
    // const that = this;//不能再bus里直接使用this，因为this指的是bus实例，而不是当前vue实例
    // bus.$on('diskMemInfo', function(disk, memory) {
    //   that.disk = parseFloat(disk);
    //   that.memory = parseFloat(memory);
    //   alert(that.disk,that.memory);
    // });
    let store = window.localStorage;
    this.disk = parseFloat(store.getItem('pcDisk'));
    this.memory = parseFloat(store.getItem('pcMemory'));
  }
}
</script>

<style scoped>
  .el-row {
    width:800px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin-top: 30px;
    margin-left: 100px;
  }
  .el-col {
    margin-left: 50px;
  }
  .el-col > p {
  	color: #666;
  }
</style>
