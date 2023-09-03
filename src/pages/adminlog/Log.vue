<template>
  <div>
    <el-tag type="success">日志信息</el-tag>
    <el-divider></el-divider>
    <div class="block">
      <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(log, index) in handleLogs"
        :key="index"
        :timestamp="handleLogs.timestamp"
        >
        {{handleLogs.content}}
      </el-timeline-item>
      </el-timeline>
      <!-- 分页组件 -->
      <pagination
        :total="total"
        @sizechange="hadleSizechange"
        @currentchange="hadleCurrentchange"
      >
      </pagination>

      <el-divider></el-divider>

      <el-row style="text-align: center">
        <el-button
        type="success"
        icon="el-icon-download"
        size="small"
        >导出日志</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
import Pagination from 'common/pagination/Pagination'
import requestMethod from '@/utils/request'
export default {
  name: 'AdminLog',
  components: {
  	Pagination
  },
  data () {
  	return {
  		reverse: true,//正序排列
      pageSize: 5,
      currentPage: 1,
      total: 0,
  		logs: [],
      notice: '',
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
    //获取日志数据
    getLogInfo() {
      const that = this;
      requestMethod({
        url: '/getLogs',
        method: 'get'
      })
        .then(function(res){
          const data = res.data;
          that.logs = data.logs;
          that.total = data.logs.length;
        });
    }
  },
  computed: {
    handleLogs() {
      return this.logs.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize);
    }
  },
  mounted() {
    this.getLogInfo();
     // 调用 Notification 或 this.$notify 会返回当前 Notification 的实例。
    this.notice = this.$notify({
      title: '温馨提示',
      message: '此功能善未完成',
      type: 'info',
      duration: 0,
      offset: 60
    })
  },

  beforeDestroy() {
    this.notice.close();//关闭Notification实例
  }
}
</script>

<style scoped>
  .block {
    margin-left: 20px;
  }
</style>
