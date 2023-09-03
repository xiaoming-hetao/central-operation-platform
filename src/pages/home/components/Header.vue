<template>
  <div>
  	<div class="container">
      <div class="container-left">
        集中化运维控制中心
      </div>
      <div class="container-right">
        <div>
          <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
        </div>
        <el-badge :value="totalNum" :max="10" :hidden="!totalNum" class="item">
          <el-popover
          width="440"
          offset="20"
          trigger="hover">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1">通知</el-menu-item>
            <el-menu-item index="2">警报</el-menu-item>
          </el-menu>
          <!-- 显示通知信息 -->
          <div v-if="activeIndex==1">
            <el-collapse v-model="noticeActiveName" accordion>
              <el-collapse-item
              v-for="(item, index) of handleNotice"
              :key="index"
              :title="item.title"
              :name="index+1">
              <div>{{ item.msg }}</div>
            </el-collapse-item>
          </el-collapse>
          <!-- 分页 -->
          <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :pager-count="5"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          small
          :total="noticeNum"
          v-if="noticeNum>5"
          >
        </el-pagination>
        <!-- 没有通知时显示 -->
        <div style="width: 60px;margin: 10px auto">
          <p v-if="!noticeNum">暂无通知</p>
        </div>
      </div>
      <!-- 显示警报信息 -->
      <div v-else>
       <el-collapse v-model="warningActiveName" accordion>
        <el-collapse-item
        v-for="(item, index) of handleWarning"
        :key="index"
        :title="item.title"
        :name="index+1">
        <div>{{ item.msg }}</div>
      </el-collapse-item>
    </el-collapse>

    <!-- 分页 -->
    <el-pagination
    @current-change="handleCurrentChange"
    :current-page.sync="currentPage"
    :pager-count="5"
    :page-size="pageSize"
    layout="total, prev, pager, next, jumper"
    small
    :total="warningNum"
    v-if="warningNum>5"
    >
  </el-pagination>
  <el-button 
  type="danger" 
  size="small" 
  plain 
  @click="deleteWarning"
  v-if='warningNum'
  style="margin-top:10px;">删除警报</el-button>
  <!-- 没有警报时显示 -->
  <div style="width: 60px;margin: 10px auto">
    <p v-if="!warningNum">暂无警报</p>
  </div>
</div>
<i class="el-icon-message-solid" slot="reference"></i>

</el-popover>

</el-badge>
<el-dropdown @command="handleSignout">
  <span class="el-dropdown-link">
    {{ user }}<i class="el-icon-arrow-down el-icon--right"></i>
  </span>
  <el-dropdown-menu slot="dropdown">
    <el-dropdown-item>退出</el-dropdown-item>
  </el-dropdown-menu>
</el-dropdown>
</div>
</div>
</div>
</template>

<script>
import requestMethod from '@/utils/request'
export default {
  name: 'HomeHeader',
  props: {
    user: String
  },
  data() {
    return {
      pageSize: 5,
      currentPage:1,
      activeIndex: '1',
      noticeActiveName: '',
      warningActiveName:'',
      //系统通知信息
      notice: [],
      noticeNum: 0,
      //系统警报信息
      warning: [],
      warningNum: 0
    }
  },
  computed: {
    //系统消息条数
    totalNum() {
     return this.noticeNum + this.warningNum;
   },
   handleWarning() {
     return this.warning.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize);
   },
   handleNotice() {
     return this.notice.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize);
   }
 },
 methods: {
  handleSignout() {
   this.$router.push('/login');
 },
    //切换导航菜单触发的事件（切换显示系统通知和警报）
    handleSelect(key, keyPath) {
      this.activeIndex = key;
    },
    //获取系统通知
    getNotice() {
      const that = this;
      requestMethod({
        url: '/getNotice',
        method: 'get'
      })
        .then(function(res) {
          const data = res.data;
          that.notice = data;
          that.noticeNum = data.length;
        });
    },
    //获取系统警报
    getWarning() {
      const that = this;
      requestMethod({
        url: '/getWarning',
        method: 'get'
      })
        .then(function(res) {
          const data = res.data;
          that.warning = data;
          that.warningNum = data.length;
        });
    },
    //删除警报
    deleteWarning() {
      const that = this;
      that.$confirm('是否删除所有警报?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        requestMethod({
          url: '/deleteAllWarning',
          method: 'post'
        })
          .then((res) => {
            if (!res.data) {
              that.$message({
                type: 'success',
                message: '删除成功!',
              });
            }
                //删除后更新文件列表
                setTimeout(() => {
                  that.getWarning();
                }, 3000);
              });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //处理分页
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
    }
  },

  mounted() {
    this.getNotice();
    this.getWarning();
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  left: 0;
  height: 64px;
  position: absolute;
  color: #fff;
  background-color: #545c64;
}
.container-left {
  line-height: 64px;
  padding-left: 20px;
  font-size: 20px;
  display: inline-block;
}
.container-right {
  padding: 0px 20px;
  line-height: 64px;
  font-size: 15px;
  float: right;
  display: inline-block;
}
/*头像*/
.el-avatar{
  position:absolute;
  display: inline-block;
  margin-top: 12px;
  
}
/*消息*/
.item {
  margin-left: 60px;
  display: inline-block;
  margin-top: 6px;
}
.el-icon-message-solid {
  font-size: 26px;
  cursor: pointer;
}
/*用户名*/
.el-dropdown {
  margin-left: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
  font-size: 16px;
}

</style>
