<template>
  <!-- 显示下发文件结果 -->
  <div>
    <el-divider></el-divider>
    <div style="text-align:center">
      <i class="el-icon-circle-check"></i>
      <p class="finishRestart">{{ msgType }}完成</p>
    </div>
    <div class="box-card">
      <el-card>
        <div slot="header" class="clearfix">
          <span>共完成{{ totalHost }}台主机的{{ msgType }}，{{ successNum }}台成功，{{ errorNum }}台失败</span>
        </div>
        <div v-for="(item, index) of handleMessageList" class="text item">
          <p :key="item.ip">
            主机ip：{{ item.ip }}，{{ msgType }}结果：
            <span :title="item.message">
              <i class="el-icon-chat-dot-round" :class="{successIcon: isSuccess, errorIcon: isError}"></i>
            </span>
          </p>
        </div>
      </el-card>
      <pagination
        :total="totalHost"
        @sizechange="hadleSizechange"
        @currentchange="hadleCurrentchange"
      ></pagination>
    </div>
  </div>
</template>

<script>
import Pagination from 'common/pagination/Pagination'
export default {
  name: 'ReturnMsg',
  components: {
  	Pagination
  },
  props: {
  	totalHost: Number,
  	successNum: Number,
  	errorNum: Number,
  	msgType: String,
  	messageList: Array
  },
  data() {
  	return {
  	  pageSize: 5,
  	  currentPage: 1,
      isSuccess: false,
      isError: false
  	}
  },
  methods: {
  	 //分页
  	 hadleSizechange(size) {
      this.pageSize = size;
    },
    hadleCurrentchange(currentPage) {
      this.currentPage = currentPage;
    },
  },
  computed: {
    handleMessageList() {
    	return this.messageList.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize);
    }
  },
  watch: {
    messageList: function(newValue, oldValue) {
      if (newValue != oldValue) {
        for (let item of this.messageList) {
          if (item.message != 'ok') {
            this.isError = true;
          } else {
            this.isSuccess = true;
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .el-icon-circle-check {
    color: #67C23A;
    font-size: 60px;
  }
  .finishRestart {
    font-size: 16px;
    color: #67C23A;
  }
  /*卡片*/
  .text {
    font-size: 16px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
    margin: 0 auto;
  }
  /*信息图标*/
  .successIcon {
    font-size:20px;
    color: #67C23A;
    cursor: pointer;
  }
  .errorIcon {
    color: #F56C6C;
    font-size:20px;
    cursor: pointer;
  }
</style>