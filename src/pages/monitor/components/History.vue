<template>
  <div>
  	<time-picker
  	  @defaultCheck="handleDefault"
  	  @check="handleCheck"
  	></time-picker>
     <!-- 内存历史数据 -->
    <el-row>
      <mem-history
        :time="time"
        :kbcache="kbcache"
        :kbcommit="kbcommit"
        :kbswap="kbswap"
      ></mem-history>
    </el-row>
     <!-- 磁盘历史数据 -->
    <el-row>
      <disk-history
        :time="time"
        :diskuse="diskuse"
        :diskoption="diskoption"
      ></disk-history>
    </el-row>
    <!-- cpu历史数据 -->
    <el-row>
      <cpu-history
        :time="time"
        :idle="idle"
        :systemCpu="systemCpu"
        :userCpu="userCpu"
      ></cpu-history>
    </el-row>
    <!-- 网络历史数据 -->
    <el-row>
      <network-history
        :time="time"
        :txpc="txpc"
        :rxpc="rxpc"
      ></network-history>
    </el-row>
  </div>
</template>

<script>
import TimePicker from 'common/timepicker/Timepicker'
import CpuHistory from 'common/graph/history/Cpuhistory'
import NetworkHistory from 'common/graph/history/Networkhistory'
import DiskHistory from 'common/graph/history/Diskhistory'
import MemHistory from 'common/graph/history/Memhistory'
import requestMethod from '@/utils/request'
export default {
  name: 'MonitorHistory',
  props: {
    postIP: String
  },
  components: {
  	TimePicker,
    CpuHistory,
    NetworkHistory,
    DiskHistory,
    MemHistory
  },
  data() {
  	return {
  		startTime: '',
  		endTime: '',
      historyData: [], //返回查看的时间段内所有的数据
      time: [],//查看的时间段
      //内存历史数据
      kbcache: [],
      kbcommit: [],
      kbswap: [],
      //cpu历史数据
      idle: [],
      //iowait: [],
      systemCpu: [],
      userCpu: [],
      //网络历史数据
      txpc: [],
      rxpc: [],
      //磁盘历史数据
      diskuse: [],
      diskoption: []
  	}
  },
  methods: {
  	//默认查看的时昨天到现在的数据
  	handleDefault(startTime, endTime) {
  		this.startTime = startTime;
  		this.endTime = endTime;
  	},
  	//选择查看的数据
  	handleCheck(startTime, endTime) {
  		this.startTime = startTime;
  		this.endTime = endTime;
      // alert(startTime + '' + endTime)
  	},
    //处理历史数据
    handleHistoryData() {
      //每次请求都需要清空上一次请求的数据
      this.time = [];
      this.idle = [];
      this.systemCpu = [];
      this.userCpu = [];
      this.txpc = [];
      this.rxpc = [];
      this.diskuse = [];
      this.diskoption = [];
      this.kbcache = [];
      this.kbcommit = [];
      this.kbswap = [];
      for (let item of this.historyData) {
        //时间
        this.time.push(item.time);
        //cpu历史数据
        this.idle.push(item.idle);
        //this.iowait.push(item.iowait);
        this.systemCpu.push(item.system_cpu);
        this.userCpu.push(item.user_cpu);

        //网络历史数据
        this.txpc.push(item.txpc);
        this.rxpc.push(item.rxpc);

        //磁盘历史数据
        let diskoption = (100-item.diskuse).toFixed(1);
        this.diskuse.push(item.diskuse);
        this.diskoption.push(diskoption);

        //内存历史数据
        let kbcache = parseFloat(item.kbcache/item.kbmemsum).toFixed(2);
        let kbcommit = parseFloat(item.kbcommit/item.kbmemsum).toFixed(2);
        let kbswap = parseFloat(item.kbswap/item.kbmemsum).toFixed(2);
        this.kbcache.push(kbcache);
        this.kbcommit.push(kbcommit);
        this.kbswap.push(kbswap);
      }
    }
  },
  watch: {
  	//时间不为空便请求数据
  	startTime: function(newValue, oldValue) {
  		if (newValue != oldValue) {
  			const that = this;
  			let postData = {
          pcIP: that.postIP,
  				startTime: newValue,
  				endTime: that.endTime
  			};
        requestMethod({
          url: '/gethistoryData',
          method: 'post',
          data: postData
        })
  			  .then(function(res) {
  			  	const data = res.data;
            that.historyData = data;
            that.handleHistoryData();
  			  });
  		}
  	}
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
</style>