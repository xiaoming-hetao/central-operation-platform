<template>
   <div class="block">
	  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
	    :page-sizes="[5, 10, 20, 40]"
	    :page-size="pageSize"
	    layout="total, sizes, prev, pager, next, jumper"
	    :total="total">
	  </el-pagination>
   </div>
</template>

<script>
  export default {
  	name: 'Pagination',
    props: {
      total: Number,
    },
    data() {
      return {
        pageSize: 5,
        currentPage: 1
      }
    },
    methods: {
      //选择每页展示条数改变时触发
  		handleSizeChange(size) {
        this.$emit('sizechange',size);
  		},
      //切换当前页时触发
  		handleCurrentChange(currentPage) {
        this.$emit('currentchange',currentPage);;
  		}
  	}
  }
</script>

<style scoped>
  .block {
  	margin-top: 10px;
  }
</style>
