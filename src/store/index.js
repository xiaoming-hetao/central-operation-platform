import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)
//index.js是组装并导出store的地方
export default new Vuex.Store({
	state,
	mutations,
	actions
})


