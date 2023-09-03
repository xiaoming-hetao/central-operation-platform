<template>
  <div>
  	<choose-host @choosehost="handleChoose"></choose-host>
  	<el-tag type="success">每周报表</el-tag>
  	 <el-row>
      <!-- 在router-link组件中添加事件会被拦截无效，要加上.native
      修饰符 -->
       <router-link
         :to="downloadPath"
         active-class="activeClass"
         @click.native="downloadReport"
       >昨日巡检报告</router-link>
    </el-row>
    <el-divider></el-divider>
    <el-row>
       <p>数据更新时间: {{ time }}</p>
       <el-table
         :data="handleupdateTime"
         style="width: 90%;margin-top:30px"
         >
          <el-table-column
            label="数据项"
            >
            <template slot-scope="scope">
             <span>{{ scope.row.data }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="平均值"
            >
            <template slot-scope="scope">
             <span>{{ scope.row.ave_data }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="最大值"
            >
          <template slot-scope="scope">
           <span>{{ scope.row.max_data }}</span>
          </template>
          </el-table-column>
          <el-table-column
            label="较上周涨跌"
            >
          <template slot-scope="scope">
           <span>{{ scope.row.rate_data }}</span>
          </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <pagination
          :total="dataTotal"
          @sizechange="hadleSizechange"
          @currentchange="hadleCurrentchange"
        ></pagination>
    </el-row>
    <el-row>
       <p>内存占用TOP5:</p>
       <el-table
         :data="handlememTop"
         style="width: 90%;margin-top:30px"
         >
          <el-table-column
            label="程序名称"
            >
            <template slot-scope="scope">
             <span>{{ scope.row.data }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="平均占用"
            >
            <template slot-scope="scope">
             <span>{{ scope.row.ave }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="最大占用"
            >
          <template slot-scope="scope">
           <span>{{ scope.row.max }}</span>
          </template>
          </el-table-column>
          <el-table-column
            label="频次"
            >
          <template slot-scope="scope">
           <span>{{ scope.row.nums }}</span>
          </template>
          </el-table-column>
        </el-table>
           <!-- 分页 -->
        <pagination
          :total="memTotal"
          @sizechange="hadleSizechange"
          @currentchange="hadleCurrentchange"
        ></pagination>
    </el-row>
    <el-row>
       <p>cpu占用TOP5:</p>
        <el-table
         :data="handlecpuTop"
         style="width: 90%;margin-top:30px"
         >
          <el-table-column
            label="程序名称"
            >
            <template slot-scope="scope">
             <span>{{ scope.row.data }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="平均占用"
            >
            <template slot-scope="scope">
             <span>{{ scope.row.ave }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="最大占用"
            >
          <template slot-scope="scope">
           <span>{{ scope.row.max }}</span>
          </template>
          </el-table-column>
          <el-table-column
            label="频次"
            >
          <template slot-scope="scope">
           <span>{{ scope.row.nums }}</span>
          </template>
          </el-table-column>
        </el-table>
           <!-- 分页 -->
        <pagination
          :total="cpuTotal"
          @sizechange="hadleSizechange"
          @currentchange="hadleCurrentchange"
        ></pagination>
    </el-row>
  </div>
</template>

<script>
import ChooseHost from 'common/choosehost/Choosehost'
import Pagination from 'common/pagination/Pagination'
import requestMethod from '@/utils/request'
export default {
  name: 'DataReport',
  components: {
  	ChooseHost,
    Pagination
  },
  data() {
    return {
      visible: false,
      currentHost: [],
      downloadPath: '',
      notice: '',
      pageSize: 5,
      currentPage: 1,
      //数据更新时间
      updateTime: [],
      time: '',
      dataTotal: 0,
      //内存top5
      memTotal: 0,
      memTop: [],
      //cputop5
      cpuTotal: 0,
      cpuTop: []
    }
  },
  computed: {
     handleupdateTime() {
        return this.updateTime.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
    },
     handlememTop() {
        return this.memTop.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
    },
     handlecpuTop() {
        return this.cpuTop.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
    }
  },
  methods:{
     //处理分页
    hadleSizechange(size) {
      this.pageSize = size;
    },
    hadleCurrentchange(currentPage) {
      this.currentPage = currentPage;
    },
    handleChoose(selectedPcIP) {
      this.currentHost = selectedPcIP;
    },
    downloadReport() {
      if (this.currentHost.length == 0) {
        this.$message({
          message: '请先选择主机',
          type: 'info',
          center: true
        });
      } else if(this.currentHost.length > 1) {
        this.$message({
          message: '只能选择一台主机',
          type: 'warning',
          center: true
        });
      } else {
        const that = this;
        let ip = {
          ip: that.currentHost[0]
        };
        //数据更新时间
        requestMethod({
          url: '/getUrl',
          method: 'post',
          data: ip
        })
          .then((res) => {
            const data = res.data;
            that.downloadPath = 'http://'+data;
            window.open(that.downloadPath,'_blank');
          });

      }
    }
  },
  watch: {
    currentHost: function(newValue, oldValue) {
      if (newValue.length > 1) {
         this.$message({
          message: '只能选择一台主机',
          type: 'warning',
          center: true
        });
      } else {
        const that = this;
        let ip = {
          ip: newValue[0]
        };

        //数据更新时间
        requestMethod({
          url: '/getStatistics',
          method: 'post',
          data: ip
        })
          .then((res) => {
            const data = res.data;
            that.updateTime = data;
            that.dataTotal = data.length;
            that.time = data[0].time;
          });

        //内存占用TOP5:
        requestMethod({
          url: '/getTopMem',
          method: 'post',
          data: ip
        })
          .then((res) => {
            const data = res.data;
            that.memTop = data;
            that.memTotal = data.length;
          });
        //cpu占用TOP5:
        requestMethod({
          url: '/getTopCPU',
          method: 'post',
          data: ip
        })
          .then((res) => {
            const data = res.data;
            that.cpuTop = data;
            that.cpuTotal = data.length;
          });
      }
    }
    
  },
  mounted() {
    // 调用 Notification 或 this.$notify 会返回当前 Notification 的实例。
    this.notice = this.$notify({
      title: '温馨提示',
      message: '每次只能选择一台主机',
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
  .el-tag,.el-row {
  	margin-left: 200px;
  	margin-bottom: 30px;
  }
  p {
    color: #666;
  }
  .activeClass {
    color: #67C23A;
  }
</style>
