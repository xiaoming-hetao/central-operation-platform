<template>
  <div>
    <el-tag type="success">剧本管理</el-tag>
    <el-popover
      placement="right"
      width="400"
      trigger="hover"
    >
      <el-table :data="data">
        <el-table-column width="200" property="pcName" label="剧本名称"></el-table-column>
        <el-table-column width="200" property="pcIP" label="变量"></el-table-column>
      </el-table>
      <el-button slot="reference" size="small" type="success" style="margin-left:140px;" @click="handleMyScript">已上传剧本</el-button>
    </el-popover>

    <el-divider></el-divider>
  </div>
</template>

<script>
import Pagination from 'common/pagination/Pagination'
import axios from 'axios'
export default {
  name: 'ManageScript',
  components: {
    Pagination
  },
  data () {
  	return {
  		//dialogTableVisible: false,
      pageSize: 5,
      currentPage: 1,
      data:[]
  	}
  },
  methods: {
    //处理分页
    hadleSizechange(size) {
      this.pageSize = size;
    },
    hadleCurrentchange(currentPage) {
      this.currentPage = currentPage;
    },
    handleMyScript() {
      axios.get('http://39.97.178.49:8080/DevOps/getOwnPlaybook')
        .then((res) => {
          alert('1')
        })
    }
  }
    
  
}
</script>

<style scoped>
  .el-tag {
    margin-left: 200px;
    margin-bottom: 20px;
  }
</style>
