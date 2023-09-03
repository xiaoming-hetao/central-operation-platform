//Action 可以包含任意异步操作
//Action 函数接受一个与store实例具有相同方法和属性的context对象，
//因此你可以调用context.commit提交一个mutation
import requestMethod from '@/utils/request'
export default {
	getPcData(context) {
        requestMethod({
        	url: '/getHosts',
        	method: 'get'
        })
				  .then(function (res) {
				  	const data = res.data;
				  	const pcData = data.data;
				  	const total = pcData.length;
				  	const pcGroup = data.pcGroup;
				  	const pcIP = [];
				  	//console.log(typeof pcData);
				  	for (let i = 0; i<total; i++) {
				  		pcIP[i] = pcData[i].pcIP;
				  	}
				  	//提交一个名为getPcData的mutation，把服务器返回的结果当做参数
				    context.commit('getPcData',{pcData, total, pcGroup, pcIP});
				  });
	}
}
