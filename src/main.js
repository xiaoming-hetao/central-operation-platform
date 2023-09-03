// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
//每个子组件都可以使用根实例里声明的东西
new Vue({
  el: '#app',
  router,
  store,//把store的实例注入到所有子组件中
  components: { App },
  template: '<App/>'
})
