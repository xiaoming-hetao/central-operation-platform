import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login/Login'
import Home from '@/pages/home/Home'
import ReStart from '@/pages/concentrate/Restart'
import DefineScript from '@/pages/concentrate/Definescript'
import ExecuteScript from '@/pages/concentrate/Executescript'
import PullFile from '@/pages/concentrate/Pullfile'
import SendFile from '@/pages/concentrate/Sendfile'
import MyFiles from '@/pages/concentrate/Myfiles'
import DataReport from '@/pages/concentrate/Datareport'
import PcManagement from '@/pages/pcmanagement/Management'
import Monitor from '@/pages/monitor/Monitor'
import AdminLog from '@/pages/adminlog/Log'

Vue.use(Router)

//重写路由的push方法
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

export default new Router({
  // mode: 'history',
  //base: '/app/',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      redirect: '/management',//重定向，第一次进入进显示这个页面
      children: [
        //设备管理
        {
      	  path: '/management',
      	  name: '/management',
      	  component: PcManagement
        },
        //设备监控
        {
      	  path: '/monitor',
      	  name: '/monitor',
      	  component: Monitor
        },

        /*集中运维*/

        //重启
        {
      	  path: '/restart',
      	  name: '/restart',
      	  component: ReStart
        },
        //定义剧本
        {
          path: '/definescript',
          name: '/definescript',
          component: DefineScript
        },
        //执行剧本
        {
          path: '/executescript',
          name: '/executescript',
          component: ExecuteScript
        },
        //拉取文件
        {
          path: '/pullfile',
          name: '/pullfile',
          component: PullFile
        },
        //下发文件
        {
      	  path: '/sendfile',
      	  name: '/sendfile',
      	  component: SendFile
        },
        //我的文件
        {
          path: '/myfiles',
          name: '/myfiles',
          component: MyFiles
        },
        //数据报表
        {
      	  path: '/datareport',
      	  name: '/datareport',
      	  component: DataReport
        },
        //管理日志
        {
      	  path: '/log',
      	  name: '/log',
      	  component: AdminLog
        },
      ]
    }
  ],
  // scrollBehavior 方法接收 to 和 from 路由对象。
  // 第三个参数 savedPosition 当且仅当 popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用。
  //让页面切换时每一次都回到最顶部
  scrollBehavior (to, from, savedPosition){
    return {x: 0, y: 0}
  }
})
