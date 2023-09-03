<template>
  <div v-loading="loading">
   <el-table
    :data="handlePcdata"
    style="width: 90%;margin-top:30px"
    >
      <el-table-column
        label="组"
        width="180">
        <template slot-scope="scope">
         <span>{{ scope.row.pcGroup }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备名称"
        width="180">
        <template slot-scope="scope">
         <span>{{ scope.row.pcName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="设备ip与端口"
        width="180">
      <template slot-scope="scope">
       <span>{{ scope.row.pcIP }}:{{ scope.row.pcPort }}</span>
      </template>
      </el-table-column>
      <el-table-column
        label="设备状态"
        width="180">
      <template slot-scope="scope">
       <span>{{ scope.row.status }}</span>
      </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-popconfirm
             confirmButtonText='确定'
             cancelButtonText='取消'
             confirmButtonType="success"
             icon="el-icon-info"
             iconColor="red"
             title='确定删除该设备吗？'
             @onConfirm="handleConfirm(scope.$index, scope.row)"
          >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              slot="reference"
              >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      :total="total"
      @sizechange="hadleSizechange"
      @currentchange="hadleCurrentchange"
    ></pagination>
    <!-- 修改弹出层 -->
    <el-dialog
      title="修改设备信息"
      :visible.sync="dialogFormVisible"
      center
      width="35%"
      >
      <el-form :model="form">
        <el-form-item label="设备组别" :label-width="formLabelWidth">
          <el-select
            v-model="form.pcGroupSelected"
            placeholder="请选择组"
            filterable
            clearable>
            <el-option
              v-for="item in pcGroup"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-input v-model.trim="form.pcName" autocomplete="off" style="width:217px;" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="success" @click="handleSubmit">修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from 'common/pagination/Pagination'
import requestMethod from '@/utils/request'
import { mapState } from 'vuex'
export default {
	name: 'PcdataTable',
  components: {
    Pagination
  },
  props: {
		pcData: Array,  //从父组件接收名为pcData数组
    total: Number
  },
  data() {
    return {
      pageSize: 5,
      currentPage: 1,
      loading: true,
      pcIP: '',
      form: {
        pcName: '',
        pcGroupSelected: ''
      },
      formLabelWidth: '120px',
      dialogFormVisible: false
    }
  },
  computed: {
    //对返回的资产清单数组进行切割，实现每页显示几条
    handlePcdata() {
      return this.pcData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
    },
    ...mapState(['pcGroup'])
  },
  methods: {
    //处理分页
    hadleSizechange(size) {
      this.pageSize = size;
    },
    hadleCurrentchange(currentPage) {
      this.currentPage = currentPage;
    },
    //修改删除数据
    handleEdit(index, row) {
      this.dialogFormVisible = true;
      //回填要修改的设备信息
      this.form.pcName = row.pcName;
      this.form.pcGroupSelected = row.pcGroup;
      this.pcIP = row.pcIP;
    },
    handleConfirm(index, row) {

      const that = this;
      let deleteData = {
        pcIP: row.pcIP
      };
      requestMethod({
        url: '/deleteHost',
        method: 'post',
        data: deleteData
      })
        .then(function (res) {
          if (res.data == 0) {
            that.$message({
              message: '删除成功',
              center: true,
              type: 'success'
            });
            that.visible = false;
          }
        });
      //删除数据后，store里的状态要变更，通过dispatch方法激活action，action通过commmit调用getPcData mutation,更新表格数据
      setTimeout(function(){
        that.$store.dispatch('getPcData');
      },3000);
    },
    handleSubmit() {
      const that = this;
      let editData = {
        pcName: that.form.pcName,
        pcGroup: that.form.pcGroupSelected,
        pcIP: that.pcIP
      };
      requestMethod({
        url: '/updateHost',
        method: 'post',
        data: editData
      })
        .then(function(res){
          if (res.data == 0) {
            that.$message({
              message: '修改成功',
              center: true,
              type: 'success'
            });
            setTimeout(function(){
              that.$store.dispatch('getPcData');//更新表格数据
            }, 3000);
          }
        });

      that.dialogFormVisible = false;
    }

  },
  watch: {
    handlePcdata: function(newValue, oldValue) {
      if (newValue != '') {
        this.loading = false;
      }
    }
  },
  created() {
    this.$store.dispatch('getPcData');
  }
}
</script>

<style scoped>

</style>
