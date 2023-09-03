<template>
  <div>
  	<el-button
  	  type="success"
  	  icon="el-icon-plus"
  	  size="small"
  	  @click="dialogFormVisible = true"
  	  >新增
  	</el-button>

  	<!-- 新增对话框 -->
  	<el-dialog
  	  title="添加设备"
  	  :visible.sync="dialogFormVisible"
  	  center
  	  width="40%"
  	  >
      <el-form :model="form" class="dialogForm" size="medium">
        <el-form-item label="设备名称" :label-width="formLabelWidth">
          <el-input v-model.trim="form.pcName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备ip" :label-width="formLabelWidth">
           <el-input v-model.trim="form.formpcIP" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="组" :label-width="formLabelWidth">
           <el-input v-model.trim="form.pcGroup" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="登录名" :label-width="formLabelWidth">
           <el-input v-model.trim="form.loginName" autocomplete="off" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" >
           <el-input v-model.trim="form.loginPassword" type="password" autocomplete="off" clearable style="width:180px;"></el-input>
           <span>ssh端口</span>
           <el-input style="width:70px;" v-model.trim="form.pcPort" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleLink">测试连接</el-button>
        <el-button type="success" @click="handleAddpc">完成</el-button>
      </div>
    </el-dialog>

  	<el-row class="search">
  	  <el-select
        v-model="searchpcIP"
        placeholder="请选择设备ip(可输入搜索)"
        size="small"
        filterable
        clearable
        >
          <el-option
            v-for="item in pcIP"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      <el-button type="success" icon="el-icon-search" size="small" @click="handleSearch">搜索</el-button>
  	</el-row>

  	<!-- 获取数据以表格形式展示 -->
  	<pcdata-table
      :pcData="pcData"
      :total="total"
    >
    </pcdata-table>
  </div>
</template>

<script>
import PcdataTable from './components/Table'
import requestMethod from '@/utils/request'
import { mapState } from 'vuex'
export default {
  name: 'PcManagement',
  components: {
    PcdataTable
  },
  data () {
  	return {
  		searchpcIP: '',
  		linkSuccess: '',//添加设备时，测试连接成功之后，再允许添加
      currentPage: 1,
      pageSize: 1,
  		dialogFormVisible: false,
  		formLabelWidth: '90px',
  		//表单数据
  		form: {
  			pcName: '',
  			formpcIP: '',
        pcGroup: '',
  			pcPort: '',
  			loginName: '',
  			loginPassword: ''
  		}
  	}
  },
  methods: {
      //测试连接
      handleLink() {
        const that = this;
        let linkData = {
          ip: that.form.formpcIP,
          port: that.form.pcPort,
          user: that.form.loginName,
          pass: that.form.loginPassword
        };
        requestMethod({
          url: '/ping',
          method: 'post',
          data: linkData
        })
          .then(function (res) {
            console.log(res.data);
             if (res.data == true) {
               that.$message({
                 message: '连接成功',
                 center: true,
                 type: 'success'
               });
              that.linkSuccess = 'success';
             } else {
                 that.$message({
                 message: '连接失败，请检查信息',
                 center: true,
                 type: 'error'
               });
             }

         });

      },
      //添加设备完成操作
      handleAddpc() {
        //测试连接成功之后再允许添加设备
        if (this.linkSuccess == 'success') {
          const that = this;
          let addData = {
             pcName: that.form.pcName,
             pcIP: that.form.formpcIP,
             pcPort: that.form.pcPort,
             pcGroup: that.form.pcGroup,
             loginName: that.form.loginName,
             loginPassword: that.form.loginPassword
          };
          requestMethod({
            url: '/addHost',
            method: 'post',
            data: addData
          })
            .then(function (res) {
              if (res.data == '1') {
                that.$message({
                  message: '添加成功',
                  center: true,
                  type: 'success'
                });
              setTimeout(function(){
                that.$store.dispatch('getPcData');//更新表格数据
              },3000);

              } else {
                that.$message({
                  message: '添加失败,设备ip已存在',
                  center: true,
                  type: 'error'
                });
              }

            });
          that.dialogFormVisible = false;
        } else {
          this.$message({
            message: '请先测试连接',
            center: true,
            type: 'info'
          });
        }
      },
      //搜索ip
      handleSearch() {
        const that = this;
        let ip = {
            pcIP: that.searchpcIP
        };
        requestMethod({
          url: '/getHostsByPcIp',
          method: 'post',
          data: ip
        })
          .then(function (res) {
            const data = res.data;
             that.pcData = data.data;
             that.total = that.pcData.length;
          });

      }

    },
    computed: {
      //当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 mapState 辅助函数帮助我们生成计算属性

      //当映射的计算属性的名称与state的子节点名称相同时，我们也可以给 mapState 传一个字符串数组
      pcData: {
        get() {
          return this.$store.state.pcData;
        },
        set(value) {
          this.$store.commit('updatePcData', value);
        }
      },
      total: {
        get() {
          return this.$store.state.total;
        },
        set(value) {
          this.$store.commit('updateTotal', value);
        }
      },
      ...mapState(['pcIP'])//存储在store里的状态（数据）
    },
    created() {
      //通过dispatch方法激活action ‘getPcData’,action再去commit mutation
      this.$store.dispatch('getPcData');
    }
}
</script>

<style scoped>
  .search {
  	margin-top: 20px;
  }
  .dialogForm {
  	width: 400px;
  }
</style>
