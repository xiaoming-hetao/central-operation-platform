<template>
	<div
	  :class="{loadingMask: fullscreenLoading}"
      v-loading.lock="fullscreenLoading"
      element-loading-text="正在下发文件..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.7)"
	>
		<choose-host @choosehost="handleChoose"></choose-host>
		<el-form ref="form" :model="form" class="fileForm" label-width="100px">
			<el-form-item label="上传文件">
				<el-upload
					class="upload-demo"
					:action="url"
					ref="upload"
					:auto-upload="false"
					:data="upData"
					:on-change="handleChange"
					:on-success="uploadSuccess"
					:on-error="uploadFalse"
					:on-preview="handlePreview"
					:on-remove="handleRemove"
					:before-remove="beforeRemove"
					multiple
					:limit="1"
					:on-exceed="handleExceed"
					:file-list="fileList">
					<el-button size="small" type="success">选择文件</el-button>
				</el-upload>
			</el-form-item>
			<el-form-item label="选择文件">
				<el-select v-model="form.selectedFile" placeholder="请选择文件" size="small" filterable clearable>
			      <el-option
			        v-for="(item, index) in localFileList"
			        :key="index"
			        :label="item.name"
			        :value="item.name">
			      </el-option>
			    </el-select>
			</el-form-item>
			<el-form-item label="文件存放位置">
				<el-input
				  v-model="form.fileAddress"
				  size="medium"
				  style="width:217px"
				  placeholder="盘符:\文件夹，如D:\web\"
				  ></el-input>
			</el-form-item>
			<el-form-item label="文件权限">
				<el-select v-model="form.fileRoot" placeholder="请选择文件权限(可搜索)" size="medium" filterable>
					<el-option label="444" value="444"></el-option>
					<el-option label="600" value="600"></el-option>
					<el-option label="644" value="644"></el-option>
					<el-option label="666" value="666"></el-option>
					<el-option label="700" value="700"></el-option>
					<el-option label="744" value="744"></el-option>
					<el-option label="755" value="755"></el-option>
					<el-option label="777" value="777"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="success" size="small" style="width: 217px;" @click="submitUpload(form)">完成</el-button>
				<!-- <el-button type="success" size="small" @click="onCancel('form')">取消</el-button> -->
			</el-form-item>
	</el-form>

	<!-- 显示下发文件结果 -->
    <return-msg
      v-show="visible"
      :msgType="msgType"
      :totalHost="totalHost"
      :successNum="successNum"
      :errorNum="errorNum"
      :messageList="messageList"
    >
    </return-msg>
</div>
</template>

<script>
import ChooseHost from 'common/choosehost/Choosehost'
import ReturnMsg from 'common/message/Returnmsg'
import requestMethod from '@/utils/request'
export default {
	name: 'SendFile',
	components: {
		ChooseHost,
		ReturnMsg
	},
	data() {
		return {
			fileList: [],
			localFileList:[],
			form: {
				fileAddress: '',
				fileRoot: '',
				selectedFile: ''
			},
			url: process.env.API_ROOT + '/getFile',
			currentHost: [], //当前选择的主机ip
			visible: false,
			fullscreenLoading: false,
			totalHost: 0,
			successNum: 0,
			errorNum: 0,
			messageList: [],
			msgType: '下发文件',
			timer: null
		}
	},
	computed: {
		//定义上传文件时携带的参数，即表单数据和当前主机
		upData() {
			return {
	 			fileAddress: this.form.fileAddress,
				fileRoot: this.form.fileRoot,
				fileName: this.form.selectedFile,
				pcIP: this.currentHost
			};
		}
	},
	methods: {
		//获取我的文件模块里的文件
		getLocalFile(){
			const that = this;
			requestMethod({
				url: '/getAllFileMessage',
				method: 'get'
			})
        .then(function(res) {
           const data = res.data;
           that.localFileList = data;
        });
		},
		handleChoose(selectedPc) {
			this.currentHost = selectedPc;
			this.totalHost = selectedPc.length;
		},
		//文件上传成功触发
		uploadSuccess(res, file, fileList) {
			if (res) {
				const data = res;
				this.messageList = data;
				this.handleSendfileInfo();
			} else {//如果没有返回值，说明所有主机下发文件失败
				this.errorNum = this.totalHost;
			}
		},
		//判断几台下发成功，几台失败
		handleSendfileInfo() {
			for (let item of this.messageList) {
				if (item.message == 'ok') {
					this.successNum += 1;
				}
			}
			this.errorNum = this.totalHost-this.successNum;
		},
		handleRemove(file, fileList) {
			this.messageList = []; //移除文件后把本次的下发结果置空
		},
		//文件上传失败触发
		uploadFalse(res, file, fileList) {
			this.$message({
				message: '文件下发失败',
				type: 'error'
			});
			this.fullscreenLoading = false;
		},
		handlePreview(file) {
			console.log(file);
		},
		handleChange(file, fileList) {
			this.fileList = fileList;
		},
		handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${ file.name }？`);
		},
		//表单提交
		submitUpload(form) {
			if (this.currentHost == '') {
				if (this.timer) {
					clearTimeout(this.timer);
				} else {
					const that = this;
					that.timer = setTimeout(function() {
						that.$message({
							message: '请先选择主机',
							type: 'info'
						});
					},16);
				}
			} else {
				const that = this;
				that.fullscreenLoading = true;
				if (that.fileList != '') { //说明用户选择了本地上传文件
					//触发upload组件的action
					that.$refs.upload.submit();
				} else { //用户没有选择本地上传，直接从我的文件里选择
					let postData = {
						fileAddress: that.form.fileAddress,
						fileRoot: that.form.fileRoot,
						fileName: that.form.selectedFile,
						pcIP: that.currentHost
					}
					requestMethod({
						url: '/getFile',
						method: 'post',
						data: postData,
						headers: {'Content-Type': 'application/x-www-form-urlencoded'},
						transformRequest: [function (data) {
							let ret = '';
							for (let it in data) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
							}
							return ret
						}]
					})
					  .then((res) => {
					  	const data = res.data;
					  	that.messageList = data;
					  	that.handleSendfileInfo();
					  })
				}
				
				
			}

		},
		//表单取消
		// onCancel(form) {
		// 	alert(1)
		// 	this.$refs.form.resetFields();
		// }
	},
	watch: {
	    messageList: function(newValue, oldValue) {
	       //当messageList不为空时，说明下发文件已经完成，此时便显示下发文件信息
	      if (newValue != '') {
	      	this.fullscreenLoading = false;
	        this.visible = true;
	      }
	    }
   },
   mounted() {
   		this.getLocalFile();
   },
   beforeRouteLeave(to, from, next) {
    if (this.fullscreenLoading) {
       this.$confirm('离开页面下发文件操作会取消，确定要离开吗','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       }).then(() => {
          next();
       }).catch(() => {
          next(false);
       });
    } else {
      next()
    }
  }
}
</script>

<style scoped>
  .loadingMask {
    height: 500px;
  }
  .fileForm {
  	width: 400px;
  	margin: 0 auto;
  }
  
</style>
