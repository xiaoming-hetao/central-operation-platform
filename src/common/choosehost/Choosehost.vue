<template>
  <div>
    <el-button
      type="success"
      size="small"
      @click="dialogTableVisible = true"
    >选择主机</el-button>

    <el-popover
      placement="right"
      width="400"
      trigger="hover"
      >
      <el-table :data="selectedPc">
        <el-table-column width="200" property="pcName" label="主机名称"></el-table-column>
        <el-table-column width="200" property="pcIP" label="主机ip"></el-table-column>
      </el-table>
      <el-button slot="reference" size="small" type="success" class="currentHostBtn">当前主机</el-button>
    </el-popover>

  	<!-- 主机选择对话框 -->
  	<el-dialog
  	  title="选择主机"
  	  :visible.sync="dialogTableVisible"
  	  center
  	  width="45%"
      top="5px"
  	  >
      <el-row>
        <span>选择组</span>
        <el-select
          v-model="pcGroupSelected"
          placeholder="请选择"
          size="small"
          filterable
          clearable
          >
          <el-option
            v-for="item in pcGroup"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-row>
      <el-divider></el-divider>
      <p>单独选择</p>
      <el-table
        :data="handlePcdata"
        border
        ref="selectionTable"
        @selection-change="handleSelectionChange"
        style="width: 100%;margin-top: 30px"
      >
        <el-table-column
          type="selection"
          width="100">
        </el-table-column>
  	    <el-table-column
  	      label="设备名称"
  	      width="225">
  	      <template slot-scope="scope">
  	        <span>{{ scope.row.pcName }}</span>
  	      </template>
  	    </el-table-column>
  	    <el-table-column
  	      label="设备IP"
  	      >
  	      <template slot-scope="scope">
  	         <span>{{ scope.row.pcIP }}</span>
  	      </template>
  	    </el-table-column>
      </el-table>
      <pagination
        :total="total"
        @sizechange="hadleSizechange"
        @currentchange="hadleCurrentchange"
      ></pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="handleConfirm">确定</el-button>
        <el-button type="success" @click="handleCancel">取消</el-button>
      </div>
    </el-dialog>
    <el-divider></el-divider>
  </div>
</template>

<script>
import Pagination from 'common/pagination/Pagination'
import requestMethod from '@/utils/request'
import { mapState } from 'vuex'
export default {
  name: 'ChooseHost',
  components: {
    Pagination
  },
  data () {
  	return {
  		dialogTableVisible: false,
      pcGroupSelected: '',//选中的组
      pageSize: 5,
      currentPage: 1,
      selectedPc: [],  //被选择的设备
      selectedPcIP: []
  	}
  },
  methods: {
  	handleConfirm () {
  		//向外触发choosehost事件
  		this.$emit('choosehost', this.selectedPcIP);
  		this.dialogTableVisible = false;
  	},
    handleCancel() {
      this.dialogTableVisible = false;
      // clearSelection()方法用于清空用户选择
      this.$refs.selectionTable.clearSelection();
      this.selectedPcIP = [];
      this.$emit('choosehost', this.selectedPcIP);
    },
    //处理分页
    hadleSizechange(size) {
      this.pageSize = size;
    },
    hadleCurrentchange(currentPage) {
      this.currentPage = currentPage;
    },
    //选择的主机
    handleSelectionChange(val) {
      this.selectedPc = val;
    },
    //选择的主机ip
    handleSelectedPc() {
      for (let i=0; i<this.selectedPc.length; i++) {
       this.selectedPcIP[i] = this.selectedPc[i].pcIP;
      }
    }
  },
  computed: {
    //计算属性pcData
    pcData: {
      //当组件挂载完后，直接获取使用store里的pcData（全部设备）
      get() {
        return this.$store.state.pcData;
      },
      //当用户选择组后，通过mutation 'updatePcData'，更新store里的pcData（所选择的组对应的设备）
      //参数value指的是pcData本身
      set(value) {
        this.$store.commit('updatePcData', value);
      }
    },
    //计算属性total(设备总数，用于分页)
    total: {
      get() {
        return this.$store.state.total;
      },
      set(value) {
        this.$store.commit('updateTotal', value);
      }
    },

    ...mapState(['pcGroup']),
    //对返回的资产清单数组进行切割，实现每页显示几条
    handlePcdata() {
      return this.pcData.slice((this.currentPage-1)*this.pageSize,this.currentPage*this.pageSize);
    }
  },
  created() {
    this.$store.dispatch('getPcData');
  },
  watch: {
    //监听pcGroupSelected属性的变化
    //如果它的值不为空，则说明用户选择了组，那么就请求该组对应的设备
    pcGroupSelected: function(newValue, oldValue) {
      if (newValue != '') {
        const that = this;
        requestMethod({
          url: '/getHostsByPcGroup',
          method: 'post',
          data: {pcGroup: newValue}
        })
          .then(function (res) {
            const data = res.data;
             that.pcData = data.data;
             that.total = that.pcData.length;
          });
      } else {//当组为空的时候，显示全部数据
        this.$store.dispatch('getPcData');
      }
    },
    selectedPc: function(newValue, oldValue) {
      if (newValue != '') {
        this.handleSelectedPc();
      }
    }
  }
}
</script>

<style scoped>
  .currentHostBtn {
    margin-left: 10%;
  }
</style>
