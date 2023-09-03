export default {
	//mutation把state作为它的第一个参数
	getPcData(state, {pcData, total, pcGroup, pcIP}) {
		state.pcData = pcData;
		state.total = total;
		state.pcGroup = pcGroup;
		state.pcIP = pcIP;
		
	},
	updatePcData(state, pcData) {
		state.pcData = pcData;
	},
	updateTotal(state, total) {
		state.total = total;
	}
}