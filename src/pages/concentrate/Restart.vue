<template>
  <div
    :class="{loadingMask: fullscreenLoading}"
    v-loading.lock="fullscreenLoading"
    element-loading-text="正在重启中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
  	<choose-host 
      @choosehost="handleChoose"
      :dialogTableVisible="visible"
    ></choose-host>
    <el-button type="success" @click="handleRestart" class="restrat-btn">重启设备</el-button>
    
    <!-- 显示重启结果 -->
    <return-msg
      v-show="visible"
      :msgType="msgType"
      :totalHost="totalHost"
      :successNum="successNum"
      :errorNum="errorNum"
      :messageList="messageList"
    >
    </return-msg>
  </div>
</template>

<script>
import ChooseHost from 'common/choosehost/Choosehost'
import ReturnMsg from 'common/message/Returnmsg'
import requestMethod from '@/utils/request'
import qs from 'qs'
import debounce from '@/utils/debounce.js'
import throttle from '@/utils/throttle.js'
// import EventBus from '@/assets/bus'
export default {
  name: 'ReStart',
  components: {
  	ChooseHost,
    ReturnMsg
  },
  data () {
  	return {
      visible: false,
      fullscreenLoading: false,
      showcomplete: false,
      messageList: [], //重启结果信息,
      currentHost: [],
      totalHost: 0,
      successNum: 0,
      errorNum: 0,
      complete: 'false',//重启操作是否完成
      msgType: '重启',
      timer: null
  	}
  },
  methods: {
  	handleChoose (selectedPcIP) {
      this.currentHost = selectedPcIP;
      this.totalHost = selectedPcIP.length;
  	},
    handleRestart() {
      if (this.currentHost == '') {
        //函数节流（限制函数的执行频率，提高网页的性能），限制用户不断点击重启按钮时，只显示一次提示信息
        throttle(() => {
          this.$message({
              message: '请先选择主机',
              type: 'info'
            });
        },16)();
        // if (this.timer) {
        //   clearTimeout(this.timer);
        // } else {
        //   const that = this;
        //   that.timer = setTimeout(function(){
        //     that.$message({
        //       message: '请先选择主机',
        //       type: 'info'
        //     });
        //   },16);
        // }
      } else {
         this.$confirm('是否确定要重启?', '重启设备', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //console.log(selectedPcIP);
          const that = this;
          that.fullscreenLoading = true;
          //axios传递数组给后台
          let postData = qs.stringify({pcIP: that.currentHost},{ indices: false }); 
          requestMethod({
            url: '/reboot',
            method: 'post',
            data: postData
          })
            .then(function(res){
              if (res.data) {
                const data = res.data;
                that.messageList = data;
                that.handleRestartInfo();
              } else {//如果没有返回值，说明所有主机重启失败
                that.errorNum = selectedPcIP.length;
              }
            });
        });
      }
    },
    //判断几台重启成功，几台失败
    handleRestartInfo() {
       for (let item of this.messageList) {
         if (item.message == 'ok') {
           this.successNum += 1;
         }
       }
      this.errorNum = this.totalHost-this.successNum;
    }
  },
  watch: {
    messageList: function(newValue, oldValue) {
       //当messageList不为空时，说明重启已经完成，此时便隐藏加载重启动画，显示重启信息
      if (newValue != '') {
        this.fullscreenLoading = false;
        this.visible = true;
      }
    }
  },
  // 组件内的导航守卫
  // beforeRouteLeave离开守卫用来禁止用户在还未保存修改前突然离开。
  // 该导航可以通过next(false)来取消
  beforeRouteLeave(to, from, next) {
    if (this.fullscreenLoading) {
       this.$confirm('离开页面重启操作会取消，确定要离开吗','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       }).then(() => {
          next();
       }).catch(() => {
          next(false);
       });
    } else {
      next()
    }
  }
}
</script>

<style scoped>
  .loadingMask {
    height: 500px;
  }
  .restrat-btn {
    display: block;
    width: 130px;
    margin: 100px auto;
    box-shadow: 0 9px #ddd;
  }
  .restrat-btn:active {
    box-shadow: 0 5px #ddd;
    transform: translateY(4px);
  }
</style>
