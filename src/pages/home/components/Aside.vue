<template>
  <el-menu 
    router
    unique-opened
    @select="handleSelect"
    active-text-color="#fff"
    :default-active="active"
  >
    <el-menu-item index="/management" :class="{active: active == '/management'}">
      <span slot="title">设备管理</span>
    </el-menu-item>

    <el-menu-item index="/monitor" :class="{active: active == '/monitor'}">
      <span slot="title">设备监控</span>
    </el-menu-item>

    <el-submenu index="3">
      <template slot="title">集中运维</template>
      <el-menu-item-group id="group">
        <el-menu-item index="/restart" :class="{active: active == '/restart'}">重启</el-menu-item>
        <el-menu-item index="/sendfile" :class="{active: active == '/sendfile'}">下发文件</el-menu-item>
        <el-menu-item index="/pullfile" :class="{active: active == '/pullfile'}">拉取文件</el-menu-item>
        <el-menu-item index="/myfiles" :class="{active: active == '/myfiles'}">我的文件</el-menu-item>
        <el-menu-item index="/executescript" :class="{active: active == '/executescript'}">剧本执行</el-menu-item>
        <el-menu-item index="/definescript" :class="{active: active == '/definescript'}">自定义剧本</el-menu-item>
        <el-menu-item index="/datareport" :class="{active: active == '/datareport'}">数据报表</el-menu-item>
      </el-menu-item-group>
    </el-submenu>

    <el-menu-item index="/log" :class="{active: active == '/log'}">
      <span slot="title">管理日志</span>
    </el-menu-item>

</el-menu>
</template>

<script>
export default {
  name: 'HomeAside',
  data () {
    return {
      active: ''//选中的导航栏
    }
  },
  methods: {
    //改变选中的菜单背景色
    handleSelect (key, keyPath) {
      if (key == "/management") {
        this.active = "/management";
      }else if (key == "/monitor") {
        this.active = "/monitor";
      }else if (key == "/restart") {
        this.active = "/restart";
      }else if (key == "/sendfile") {
        this.active = "/sendfile";
      }else if (key == "/pullfile") {
        this.active = "/pullfile";
      }else if (key == "/myfiles") {
        this.active = "/myfiles";
      }else if (key == "/executescript") {
        this.active = "/executescript";
      }else if (key == "/definescript") {
        this.active = "/definescript";
      }else if (key == "/datareport") {
        this.active = "/datareport";
      }else {
        this.active = "/log";
      }
    },
    // handleroute() {
    //   // console.log(this.$route.name)
    // }
  },
  mounted() {
    // $route对象 表示当前激活的路由的状态信息，包含了当前 URL 解析得到的信息
    // $router对象 表示全局的路由实例，是router构造方法的实例，在 Vue 实例内部，你可以通过 $router 访问路由实例
    this.active = this.$route.name;
  },
  // watch: {
  //   '$route': 'handleroute'
  // }
}
</script>

<style scoped>
  #group {
    text-indent: 2rem;
  }
  .active {
    background: #67C23A;
    color: #fff;
  }
</style>
