<template>
	<div v-loading="loading">
		<el-tag type="success">设备概况</el-tag>
		<el-row>
			<span>本平台共管理 {{ total }} 台设备，{{highDiskNum}} 台硬盘将满，{{highMemNum}} 台内存过高，{{highCpuNum}}台CPU负载过高</span>
			<el-button type="success" size="small" style="margin-left:34px;" @click="handleSetting">监控设置</el-button>
			<el-button
			type="success"
			size="small"
			@click="dialogDetailVisible = true"
			>查看详情</el-button>

			<!-- 监控设置对话框 -->
			<el-dialog 
			  title="监控阈值设置" 
			  :visible.sync="dialogMonitorVisible"
			  center
			  @close="handleClose"
			  width="50%"
			>
				<el-table
				  :data="handleYuzhiData"
				  border
				  style="width: 100%;margin-top: 30px"
				>
					<el-table-column label="键" align="center">
						<template slot-scope="scope">
							<span>{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column label="最大值" align="center" width="140">
						<template slot-scope="scope">
							 <!-- 默认不显示输入框 -->
				             <span v-if="scope.row.edit=='true'">
				                {{ scope.row.max_condition }}
				             </span>
				              <span v-else>
				               <el-input type="text" placeholder="请输入数字" v-model.trim="scope.row.max_condition"></el-input>
				             </span>
						</template>
					</el-table-column>
					<el-table-column label="最小值" align="center" width="140">
						<template slot-scope="scope">
							<!-- 默认不显示输入框 -->
				            <span v-if="scope.row.edit=='true'">
				               {{ scope.row.min_condition }}
				            </span>
				            <span v-else>
				              <el-input type="text" placeholder="请输入数字" v-model.trim="scope.row.min_condition"></el-input>
				            </span>
						</template>
					</el-table-column>
					<el-table-column label="警报描述" align="center" width="160">
						<template slot-scope="scope">
							<!-- 默认不显示输入框 -->
				            <span v-if="scope.row.edit=='true'">
				               {{ scope.row.desc }}
				            </span>
				            <span v-else>
				              <el-input type="text" v-model.trim="scope.row.desc"></el-input>
				            </span>
						</template>
					</el-table-column>
					 <el-table-column
			           label="操作"
			           align="center"
			          >
			            <template slot-scope="scope">
			             <span>
			                <i class="el-icon-edit" @click="handleShow(scope.$index, scope.row)"></i>
			             </span>
			             <span v-show="saveIndex==scope.$index"><i class="el-icon-circle-check" :class="{saveIcon: isSave, unsaveIcon: isUnsave}" @click="handleSave(scope.$index, scope.row)"></i></span>
			            </template>
			          </el-table-column>
				</el-table>
				<pagination 
				  :total="yuzhiNum"
			      @sizechange="hadleSizechange"
			      @currentchange="hadleCurrentchange"
				></pagination>
				<div slot="footer" class="dialog-footer">
			        <el-button type="success" @click="handleUpdate">修改</el-button>
			        <el-button type="success" @click="handleCancel">取消</el-button>
		        </div>
		    </el-dialog>
			<!-- 设备详情对话框 -->
			<el-dialog 
			  title="设备详情" 
			  :visible.sync="dialogDetailVisible"
			  center
			  width="50%"
			>
				<el-table
				  :data="handlePcdata"
				  border
				  style="width: 100%;margin-top: 30px"
				>
					<el-table-column label="设备名称" width="225">
					<template slot-scope="scope">
						<span>{{ scope.row.pcName }}</span>
					</template>
					</el-table-column>
					<el-table-column label="设备IP">
					<template slot-scope="scope">
						<span>{{ scope.row.pcIP }}</span>
					</template>
					</el-table-column>
					<el-table-column label="主要问题">
					<template slot-scope="scope">
						<span>{{ scope.row.mainProblem }}</span>
					</template>
					</el-table-column>
				</el-table>
				<pagination 
				  :total="total"
			      @sizechange="hadleSizechange"
			      @currentchange="hadleCurrentchange"
				></pagination>
		  </el-dialog>
		</el-row>
		<el-divider></el-divider>
		<el-tag type="success">设备搜索</el-tag>
		<el-row>
			<span>请选择设备ip(可搜索)&nbsp;</span>
			<el-select 
			  v-model="pcIPSelected" 
			  placeholder="请选择" 
			  size="small" 
			  filterable
			  clearable
			  >
			    <el-option
			      v-for="item in pcIP"
			      :key="item"
			      :label="item"
			      :value="item">
			    </el-option>
		    </el-select>
			<el-button type="success" size="small" @click="handleCheck">查看</el-button>
		</el-row>
		<el-divider></el-divider>
	</div>
</template>

<script>
import Pagination from 'common/pagination/Pagination'
import requestMethod from '@/utils/request'
import { mapState } from 'vuex'
export default {
	name: 'MonitorHeader',
	components: {
		Pagination
	},
	data () {
		return {
			dialogMonitorVisible: false,
			dialogDetailVisible: false,
			//图标
			saveIndex: -1,
			isSave: false,
			isUnsave: true,
		    editValues: [], //用户输入的监控阈值的值
			yuzhiData: [],
			yuzhiNum: 0,//阈值数据总数
			pcIPSelected: '',
			pageSize: 5,
			currentPage: 1,
			loading: true,
			total: 0, //设备总数
			highCpuNum: 0, //cpu过载设备数
			highMemNum: 0, //内存过高设备数
			highDiskNum: 0 //磁盘将满设备数
		}
	},
	methods: {
		//获取监控阈值信息
		handleSetting() {
			const that = this;
			that.dialogMonitorVisible = true;
	    requestMethod({
	    	url: '/getThreshold',
	    	method: 'get'
	    })
			  .then(function(res) {
			  	const data = res.data;
			  	that.yuzhiData = data;
			  	that.yuzhiNum = data.length;
			  });
		},
		//切换显示单元格和输入框（监控阈值表格）,以及保存图标
		handleShow(index, row) {
			this.$set(row, "edit", "false");
			this.saveIndex = index;
			this.isSave = false;
	        this.isUnsave = true;
		},
		//当点击保存按钮时，把输入框里的值添加到数组editValues里
	    //同时隐藏输入框
	    handleSave(index, row) {
	      let obj = {
	      	name: row.name,
	      	max_condition: row.max_condition,
	      	min_condition: row.min_condition,
	      	desc: row.desc
	      };
	      this.editValues.push(obj);
	      this.isSave = true;
	      this.isUnsave = false;
	      this.$set(row,"edit","true");
	    },
	    //取消修改，则隐藏保存图标
	    handleCancel() {
	    	this.saveIndex = -1;
	    	this.dialogMonitorVisible = false;
	    },
	    //点击关闭图标，则隐藏保存图标
	    handleClose() {
	    	this.saveIndex = -1;
	    },
		//修改监控阈值
		handleUpdate() {
			const that = this;
			if (that.editValues != '') { //如果修改值不为空
				let postData = that.editValues;
				requestMethod({
					url: '/updateThreshold',
					method: 'post',
					data: postData
				})
				  .then(function(res) {
				  	if (res.data == 0) {
				  		that.$message({
				  			message: '修改成功',
				  			center: true,
				  			type: 'success'
				  		});
				  	} else {
				  		that.$message({
				  			message: '修改失败',
				  			center: true,
				  			type: 'error'
				  		});
				  	}
				  });
				that.dialogMonitorVisible=false;
				that.saveIndex = -1;
			} else { //如果用户没有修改值，则给出提示
				that.$message({
					message: '请先编辑值或先保存值再点击修改',
					type: 'info'
				});
			}
		},
		//查看设备信息
		handleCheck () {
			if (this.pcIPSelected == '') {
				this.$message({
					message: '请先选择设备ip',
					type: 'info'
				});
			} else {
				//向外触发check事件（输入设备ip，点击查看，便向服务器请求对应的PC数据）
				this.$emit('check', this.pcIPSelected);
			}
			
		},
		 //处理分页
	    hadleSizechange(size) {
	      this.pageSize = size;
	    },
	    hadleCurrentchange(currentPage) {
	      this.currentPage = currentPage;
	    },
	    getPcInfo() {
	    	const that = this;
		    requestMethod({
		    	url: '/getStateNum',
		    	method: 'get'
		    })
	    	  .then(function(res){
	    	  	console.log(res.data);
	    	  	const data = res.data;
	    	  	that.total = data.total;
	    	  	that.highDiskNum = data.highDict;
	    	  	that.highMemNum = data.highRam;
	    	  	that.highCpuNum = data.highCpu;
	    	  });
	    }
	},
	computed: {
		...mapState(['pcData', 'pcIP']),
		//对返回的资产清单数组进行切割，实现每页显示几条
	    handlePcdata() {
	      return this.pcData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
	    },
	    //返回的数据添加一个edit属性，用于切换输入框和单元格
		handleYuzhiData() {
			for (let i=0; i<this.yuzhiData.length; i++) {
				//向vue的响应式对象中添加一个响应属性edit
				this.$set(this.yuzhiData[i],"edit","true");
			}
			return this.yuzhiData.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize);
		}
	},
	watch: {
		total: function(newValue, oldValue) {
			if (newValue > 0) {
				this.loading = false;
			}
		}
	},
	created() {
    this.$store.dispatch('getPcData');
  },
  mounted() {
  	this.getPcInfo();
  }
}
</script>

<style scoped>
  .el-tag {
  	margin-bottom: 10px;
  }
  .el-row {
	margin-bottom: 25px;
	margin-left: 100px;
  }
  .el-row > .el-input {
	width: 200px;
  }
  .el-button {
	margin-left:20px;
  }
  span {
  	color: #666;
  }
  .el-icon-edit, .saveIcon{
  	color: #67C23A;
    cursor: pointer;
    font-size: 16px;
    margin-left: 10px;
  }
  .unsaveIcon {
  	color: #F56C6C;
  	cursor: pointer;
    font-size: 16px;
    margin-left: 10px;
  }
</style>
