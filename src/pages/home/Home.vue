<template>
  <div class="body-bg">
    <el-backtop 
      target=".body-bg" 
      :visibility-height="100"
      :bottom="100"
      style="background:#67C23A;color:#fff;"
    >
    <i class="el-icon-top"></i>
    </el-backtop>
  	<el-container>
  		<!-- 头部 -->
  	  <el-header>
  	  	<home-header :user="user"></home-header>
  	  </el-header>
  	  <el-container id="content">
  	  	<!-- 侧边导航 -->
  	  	<el-aside width="200px">
  	  	  <home-aside></home-aside>
  	  	</el-aside>
  	  	<el-container>
  	  		<!-- 内容主体 -->
  	  	  <el-main>
  	  	  	<transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
  	  	  </el-main>
  	  	  <!-- 底部 -->
  	  	  <el-footer>
  	  	  	
  	  	  </el-footer>
  	  	</el-container>
  	  </el-container>
  	</el-container>
  </div>
</template>

<script>
import HomeHeader from './components/Header'
import HomeAside from './components/Aside'
export default {
  name: 'Home',
  components: {
  	HomeHeader,
  	HomeAside
  },
  data() {
    return {
      user: ''
    }
  },
  methods: {
    checkUser() {
      if (!this.user) { //如果用户名为空，则说明用户没有登录，强制把用户返回登录页面
        this.$message({
          message:'您还未登录，请先登录',
          type: 'info',
          center: true
        });
        this.$router.push('/login');
      }
    }
  },
  created() {
    //获取用户名
    let store = window.sessionStorage;
    this.user = store.getItem('username');
    this.checkUser();
  }
}
</script>

<style scoped>
   .body-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      overflow-y: auto;
      background-color: #EBEEF5 ;
  }
  .el-aside {
    text-align: center;
  }
  #content {
  	margin: 20px 20px;
  	background: #fff;
  }
  /*渐隐渐现动画*/
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  /*滚动条的整体部分*/
  ::-webkit-scrollbar {
    width: 6px;
    height: 4px;
    background-color: #fff;
  }
  /*定义滚动条轨道*/
  ::-webkit-scrollbar-track {
    border-radius:2px;
    background: #fff ;
  }
  /*定义滑块*/
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #ddd;
  }
  ::-webkit-scrollbar-thumb:hover {
    border-radius: 3px;
    background-color: #C3C3C3;
  }
</style>
