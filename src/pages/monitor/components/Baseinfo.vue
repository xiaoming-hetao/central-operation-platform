<template>
  <div v-loading="loading">
  	<el-tag type="success">基本信息</el-tag>
  	<el-row>
  		<el-col :span="6"><p>设备名称</p></el-col>
  		<el-col :span="6"><p>{{ pcName }}</p></el-col>
  	</el-row>
    <el-row>
      <el-col :span="6"><p>设备ip</p></el-col>
      <el-col :span="6"><p>{{ pcIP }}</p></el-col>
    </el-row>
  	<el-row>
  		<el-col :span="6"><p>cpu信息</p></el-col>
  		<el-col :span="6"><p>{{ pcCpu }}</p></el-col>
  	</el-row>
  	<el-row>
  		<el-col :span="6"><p>硬盘信息</p></el-col>
  		<el-col :span="6"><p>{{ pcDisk }}</p></el-col>
  	</el-row>
  	<el-row>
  		<el-col :span="6"><p>内存信息</p></el-col>
  		<el-col :span="6"><p>{{ pcMemory }}</p></el-col>
  	</el-row>
  	<el-divider></el-divider>
  </div>
</template>

<script>
// //引入中央事件总线
// import bus from '@/assets/bus'
export default {
  name: 'MonitorBaseinfo',
  props: {
    baseInfo: Array
  },
  data() {
    return {
      pcName: '',
      pcIP: '',
      pcCpu: '',
      pcDisk: '',
      pcMemory: '',
      baseInfoData: [],
      loading: true
    }
  },
  watch: {
    //由于baseInfo是动态请求的数据，所以当请求速度慢于页面渲染速度时，
    //页面会因为找不到数据而报错
    //所以最好的办法是先检测接受到的值是否为空，不为空再渲染页面
    baseInfo: function(newValue, oldValue) {
      if (newValue != oldValue) {
        this.baseInfoData = newValue;
        this.showBaseInfo();
        this.loading = false;
      }
    }
  },
  methods: {
    showBaseInfo() {
      this.pcName = this.baseInfoData[0].owner;
      this.pcIP = this.baseInfoData[0].ip;
      this.pcCpu = this.baseInfoData[0].cpu;
      this.pcDisk = this.baseInfoData[0].disk;
      this.pcMemory = this.baseInfoData[0].mem;

      // //通过事件总线向兄弟组件Realtime传值（磁盘和内存信息）
      // bus.$emit('diskMemInfo', this.pcDisk, this.pcMemory);
      //把盘和内存信息存到本地仓库中
      let store = window.localStorage;
      store.setItem('pcDisk',this.pcDisk);
      store.setItem('pcMemory',this.pcMemory);
    }
  }
}
</script>

<style scoped>
  .el-row {
  	text-align: center;
    color: #666;
  }
</style>
