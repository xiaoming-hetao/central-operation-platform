<template>
  <div>
  	<el-upload
      class="upload-demo"
      ref="upload"
      :action="url"
      :on-success="uploadSuccess"
      :on-error="uploadFalse"
      :limit="1"
      :on-exceed="handleExceed"
    >
      <el-button size="small" type="success" class="upload-btn">上传文件</el-button>
    </el-upload>
    <el-divider></el-divider>

    <!-- 展示文件 -->
    <div class="myfileContainer">
    	<div v-for="(item, index) of handleFilelist" class="myfile">
    		<el-popover
			  placement="top"
			  width="100"
			  trigger="click"
        :key="item.name"
			>
			  <el-button type="success" size="small" @click="handleDownload(item.name)">下载</el-button>
			  <el-button type="danger" size="small" style="margin-left:30px;" @click="handleDelete(item.name)">删除</el-button>
			  <i class="el-icon-document" slot="reference"></i>
			</el-popover>
    		<p class="filename" :title="item.name">{{ item.name }}</p>
    	</div>
    </div>

    <!-- 分页 -->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
  	  :pager-count="7"
  	  :page-size="pageSize"
  	  layout="total, prev, pager, next, jumper"
  	  :total="total">
    </el-pagination>
  </div>
</template>

<script>
import requestMethod from '@/utils/request'
export default {
  name: 'MyFiles',
  data() {
  	return {
  		fileList: [],
  		total: 0,
  		pageSize: 8,
  		currentPage: 1,
      url: process.env.API_ROOT + '/upFile',
  	}
  },
  computed: {
  	handleFilelist() {
  		return this.fileList.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
  	}
  },
  methods: {
  	downloadFile(fileurl, filename) {
		var  a = document.createElement('a'); 
		a.download = filename;
		a.style.display = 'none';
		var  blob = new Blob(fileurl); 
		a.href = URL.createObjectURL(blob);
		document.body.appendChild(a);  
		 a.click(); 
		document.body.removeChild(a); 
	},

  	//从后台获取文件
  	getFile() {
      const that = this;
      requestMethod({
        url: '/getAllFileMessage',
        method: 'get'
      })
        .then(function(res) {
           const data = res.data;
           that.fileList = data;
           that.total = data.length;
        });
  	},
  	handleDelete(name) {
  	  const that = this;
      that.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let deleteData = {
          	fileName:name
          };
          requestMethod({
            url: '/deleteFile',
            method: 'post',
            data: deleteData
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
              	that.getFile();
              }, 3000);
            });
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
  	},
  	handleDownload(name) {
  	  const that = this;
      that.$confirm('是否下载该文件', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        	alert(name)
        	that.downloadFile('',name);
        	//window.open(url,'_blank');
          // let downloadData = {
          // 	name:name
          // };
          // axios.post('',downloadData)
          //   .then((res) => {
             
          //   });
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消下载'
          });
        });
  	},
  	uploadSuccess(res, file, fileList) {
  		this.$message({
  			type: 'success',
  			message: '上传成功'
  		});
  		this.fileList.push({name:file.name,desc:'本地上传的文件'});
  		this.total += 1;
  	},
  	uploadFalse(res, file, fileList) {
		this.$message({
				message: '上传失败',
				type: 'error'
			});
	},
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleCurrentChange(currentPage) {
    	this.currentPage = currentPage;
    }
  },
  mounted() {
  	this.getFile();
  }
}
</script>

<style scoped>
  .myfileContainer {
  	width: 520px;
  	height: 240px;
  	margin: 50px auto;
  	padding: 20px;
  	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
  }
  p{
    color: #666;
  }
  .myfile {
  	display:inline-block;
  	padding:20px;
  }
  .el-icon-document {
  	cursor: pointer;
  	font-size: 30px;
  	color: #409EFF;
  }
  .el-popover {
  	margin: 0 auto;
  }
  .filename {
  	width:90px; 
  	white-space:nowrap; 
  	text-overflow:ellipsis; 
  	overflow:hidden;
  	cursor:pointer
  }
</style>