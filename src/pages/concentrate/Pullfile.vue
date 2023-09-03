<template>
  <div 
    :class="{loadingMask: fullscreenLoading}"
    v-loading.lock="fullscreenLoading"
    element-loading-text="正在拉取文件..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
  	<choose-host @choosehost="handleChoose"></choose-host>
    <el-row>
      <span>文件存放位置</span>
      <el-input v-model="fileAddress" size="medium" placeholder="盘符:\文件夹，如D:\web\"></el-input>
      <el-button type="success" size="small" @click="handleConfirm">确定</el-button>
    </el-row>

   <!-- 显示下发文件结果 -->
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
import qs from 'qs'
import requestMethod from '@/utils/request'
export default {
  name: 'PullFile',
  components: {
  	ChooseHost,
    ReturnMsg
  },
  data() {
    return {
      fullscreenLoading: false,
      visible: false,
      fileAddress: '',
      currentHost: [], //当前选择的主机ip
      messageList: [], //下发文件结果信息,
      totalHost: 0,
      successNum: 0,
      errorNum: 0,
      msgType: '拉取文件',
      timer: null
    }
  },
  methods: {
    hadleSizechange(size) {
      this.pageSize = size;
    },
    hadleCurrentchange(currentPage) {
      this.currentPage = currentPage;
    },
    handleChoose(selectedPc) {
      this.currentHost = selectedPc;
      this.totalHost = selectedPc.length;
    },
    handleConfirm() {
      if (this.currentHost == '') {
        if (this.timer) {
          clearTimeout(this.timer);
        } else {
          const that = this;
          that.timer = setTimeout(function() {
            that.$message({
              message: '请先选择主机',
              type: 'info'
            });
          },16);
        }
      } else {
        const that = this;
        that.fullscreenLoading = true;
        let postData = qs.stringify(
          {
            pcIP: that.currentHost, 
            fileAddress: that.fileAddress
          },
          { indices: false }
          ); 
        requestMethod({
          url: '/fetch',
          method: 'post',
          data: postData
        })
          .then(function(res){
            if (res.data) {
              const data = res.data;
              that.messageList = data;
              that.handlePullfileInfo();
            } else {//如果没有返回值，说明所有主机拉取文件失败
                that.errorNum = that.totalHost.length;
            }
          });
      }
    },
    //判断几台拉取文件成功，几台失败
    handlePullfileInfo() {
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
       //当messageList不为空时，说明下发文件已经完成，此时便显示下发文件结果
      if (newValue != '') {
        this.fullscreenLoading = false;
        this.visible = true;
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.fullscreenLoading) {
       this.$confirm('离开页面拉取文件操作会取消，确定要离开吗','提示',{
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
  .el-input {
    width: 217px;
  }
  .el-row {
    width: 400px;
    margin: 0 auto;
    color: #666;
  }
  .el-button {
    margin-left:10px;
  }
</style>
