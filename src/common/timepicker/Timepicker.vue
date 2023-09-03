<template>
  <div>
  	<div class="block">
      <el-date-picker
        v-model="startTime"
        type="datetime"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm"
        :picker-options="pickerOptions"
        align="center"
        placeholder="开始时间"
        @change="handleStartChange"
      >
      </el-date-picker>
      <el-date-picker
        v-model="endTime"
        type="datetime"
        format="yyyy-MM-dd HH:mm"
        value-format="yyyy-MM-dd HH:mm"
        :picker-options="pickerOptions"
        align="center"
        placeholder="结束时间"
        @change="handleEndChange"
      >
      </el-date-picker>
      <el-button type="success" size="small" @click="handleClick">查看</el-button>
	</div>
  </div>
</template>

<script>
import getFormatDate from '@/utils/date'
export default {
  name: 'TimePicker',
  data() {
  	return {
  	  startTime: '',
  	  endTime: '',
  	  pickerOptions: {
  	  	//禁用选择一周以前的时间以及当前时间之后的时间
  	  	disabledDate(time) {
  	  		const date = new Date();
  	  		const curDate = date.getTime(); //当前时间
          // //一分钟，在js中以毫秒为单位
  	  		const week = 3600 * 1000 * 24 * 7;//一周时间
  	  		const oneWeekAgo = curDate -week;
  	  		return time.getTime() > curDate || time.getTime() < oneWeekAgo;
  	  	},
  	  	//快捷选项
  	     shortcuts: [{
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            }, {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }]
  	  }
    }
  },
  methods: {
    //用户选择开始时间后触发该方法
    handleStartChange() {
      if (this.startTime >= this.endTime && this.endTime != '') {
        this.$message({
          message: '开始时间不能等于或晚于结束时间',
          type: 'error'
        });
        this.startTime = '';
      }
    },
    //用户选择结束时间后触发该方法
    handleEndChange() {
      if (this.endTime <= this.startTime) {
        this.$message({
          message: '结束时间不能等于或早于开始时间',
          type: 'error'
        });
        this.endTime = '';
      }
    },
    //当正确选择开始时间和结束时间后，把所选值传给父组件，父组件请求相应数据
    handleClick() {
      if (this.startTime && this.endTime) { //当两者不为空时
        this.$emit('check', this.startTime, this.endTime);
      } else {
        this.$message({
          message: '请同时选择开始时间和结束时间',
          type: 'info'
        });
      }
    }
  },
  watch: {
  	
  },
  mounted() {
  	
  	let date = new Date();
  	let nowTimeStamp =  date.getTime();
  	let aDayAgoTimeStamp = nowTimeStamp - 3600 * 1000 * 24;
  	//默认请求的是昨天到现在的数据
  	this.startTime = getFormatDate(new Date(aDayAgoTimeStamp));
  	this.endTime = getFormatDate(new Date(nowTimeStamp));

    this.$emit('defaultCheck', this.startTime, this.endTime);
  }
}
</script>

<style scoped>
  .block {
  	margin-left: 100px;
  	margin-top: 20px;
  }
</style>