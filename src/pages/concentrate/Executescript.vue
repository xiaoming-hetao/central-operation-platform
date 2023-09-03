<template>
  <div
    :class="{loadingMask: fullscreenLoading}"
    v-loading.lock="fullscreenLoading"
    element-loading-text="剧本执行中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
  	<choose-host @choosehost="handleChoose"></choose-host>
    <el-select v-model="script" placeholder="请选择剧本" size="small" filterable clearable>
      <el-option
        v-for="(item, index) in scriptOptions"
        :key="index"
        :label="item.playbookname"
        :value="item.playbookname">
      </el-option>
    </el-select>
    <el-divider></el-divider>

    <div class="script">
      <el-table
        :data="handleScriptdata"
      >
        <el-table-column label="脚本配置项"  align="center">
          <el-table-column
            label="键"
            align="center"
          >
            <template slot-scope="scope">
             <span>{{ scope.row.key }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="值"
            align="center"
          >
            <template slot-scope="scope">
              <!-- 默认不显示输入框 -->
              <span v-if="scope.row.edit=='true'">
                {{ scope.row.value }}
              </span>
              <span v-else>
                <el-input type="text" v-model.trim="scope.row.value" @blur="handleBlur(scope.$index, scope.row)"></el-input>
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
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <el-button type="success" @click="handleExecute">执行</el-button>

    <!-- 显示剧本执行结果 -->
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
  name: 'ExecuteScript',
  components: {
  	ChooseHost,
    ReturnMsg
  },
  data() {
    return {
      defaultValues: [], //脚本配置项的默认值
      editValues: [], //用户输入的脚本配置项的值
      values: [], //提交给后台的脚本配置项
      fullscreenLoading: false,
      visible: false,
      //展示执行结果的相关信息
      totalHost: 0,
      successNum: 0,
      errorNum: 0,
      msgType: '剧本执行',
      messageList: [],
      currentHost: [],
      script: '',
      scriptOptions: [],//从后台接收的全部脚本
      scriptData: [],//从后台接收的脚本配置项
      timer1: null,
      timer2: null
    }
  },
  computed: {
    //返回的数据添加一个edit属性，用于切换输入框和单元格
    handleScriptdata() {
        for (let i=0; i<this.scriptData.length; i++) {
          //向vue的响应式对象中添加一个响应属性edit
          this.$set(this.scriptData[i],"edit","true");
        }
        return this.scriptData;
    }
  },
  methods: {
    //当点击编辑图标时显示输入框
    handleShow(index, row) {
      this.$set(row,"edit","false");
    },
    //当输入款失去焦点时，把输入框里的值添加到数组editValues里
    //同时隐藏输入框
    handleBlur(index, row) {
      this.editValues.push(row.key,row.value);
      this.$set(row,"edit","true");
    },
    getScript() {
      const that = this;
      requestMethod({
        url: '/getPlaybook',
        method: 'get'
      })
        .then(function(res){
          const data = res.data;
          that.scriptOptions = data;
        });
    },
    //获取脚本配置项的默认值
    getDefaultValues() {
      this.defaultValues = [];
      for (let item of this.scriptData) {
        this.defaultValues.push(item.key);
        this.defaultValues.push(item.value);
      }
      //如果用户不修改，则提交的是默认值
      this.values = this.defaultValues;
    },
    handleValues() {
      if (this.editValues != '') { //编辑值不为空，则说明用户做了修改
         for (let item of this.editValues) {
          //删除原来默认值数组中包含修改值数组的键和值
          let index = this.defaultValues.indexOf(item);
          if (index >-1) {
            this.defaultValues.splice(index, 2);
          }
        }
        //合并默认值数组和修改值数组
        this.values = [...this.defaultValues,...this.editValues];

      }
    },
    handleChoose(selectedPc) {
      this.currentHost = selectedPc;
      this.totalHost = selectedPc.length;
    },
    handleExecute() {
      if (this.currentHost == '') {
        if (this.timer1) {
          clearTimeout(this.timer1);
        } else {
          const that = this;
          that.timer1 = setTimeout(function() {
            that.$message({
              message: '请先选择主机',
              type: 'info'
            });
          },16);
        }
      } else if (this.script == '') {
        if (this.timer2) {
          clearTimeout(this.timer2);
        } else {
          const that = this;
          that.timer2 = setTimeout(function() {
            that.$message({
              message: '请先选择剧本',
              type: 'info'
            });
          },16);
        }
      } else {
        const that = this;
        that.fullscreenLoading = true;
        that.handleValues();//先处理提交的配置项的值
        let postData = {
          script: that.script,
          values: that.values,
          pcIP: that.currentHost
        };
        requestMethod({
          url: '/play',
          method: 'post',
          data: postData
        })
          .then(function(res) {
            if (res.data) {
              const data = res.data;
              that.messageList = data;
              that.handleExecuteInfo();
            }
          });
      }
    },
    //判断几台剧本执行成功，几台失败
    handleExecuteInfo() {
      for (let item of this.messageList) {
        if (item.message == 'ok') {
          this.successNum += 1;
        }
      }
      this.errorNum = this.totalHost - this.successNum;
    }
  },
  watch: {
    //监听script属性，当其不为空时，说明用户选择了脚本
    //此时便请求对应脚本的配置项
    script: function(newValue, oldValue) {
      if (newValue != oldValue) {
        const that = this;
        let script = {
          script: newValue,
        };
        requestMethod({
          url: '/getSetting',
          method: 'post',
          data: script
        })
          .then(function(res) {
            const data = res.data;
            that.scriptData = data;
            //换了剧本之后，要把上一个剧本的编辑值置空，并且获取当前剧本的默认值
            that.editValues = [];
            that.getDefaultValues();
            that.messageList = [];
          });
      } else { //如果用户清空了脚本，则把配置项也置空，以及隐藏剧本执行结果
        this.scriptData = [];
        this.messageList = [];
      }
    },
    messageList: function(newValue, oldValue) {
         //当messageList不为空时，说明剧本执行已经完成，此时便显示剧本执行信息
        if (newValue != '') {
          this.visible = true;
          this.fullscreenLoading = false;
        } else {
          this.visible = false;
        }
    }
  },
  mounted() {
    this.getScript();
  },
  beforeRouteLeave(to, from, next) {
    if (this.fullscreenLoading) {
       this.$confirm('离开页面剧本执行操作会取消，确定要离开吗','提示',{
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
    height: 550px;
  }
  .el-select {
    width: 200px;
    display: block;
    margin:20px auto;
  }
  .script {
    width: 35%;
    margin:20px auto;
  }
  .el-button {
    display: block;
    margin: 20px auto;
    width: 170px;
  }
  .el-icon-edit {
    color: #67C23A;
    cursor: pointer;
  }
  /*剧本执行完成提示*/
  .el-icon-circle-check {
    color: #67C23A;
    font-size: 60px;
  }
  .finishRestart {
    font-size: 16px;
    color: #67C23A;
  }

</style>
