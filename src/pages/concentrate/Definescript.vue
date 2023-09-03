<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      :auto-upload="false"
      :action="url"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :on-error="uploadFalse"
      :before-remove="beforeRemove"
      :data="upData"
      multiple
      :limit="1"
      :on-exceed="handleExceed"
    >
      <el-button size="small" type="success" class="upload-btn">上传</el-button>
    </el-upload>
    <el-divider></el-divider>
    <div>
      <el-tag type="success">变量定义</el-tag>
      <el-form ref="form" :model="form" class="fileForm" label-width="100px">
        <el-form-item label="剧本名称">
          <el-input 
            v-model.trim="form.scriptName" 
            size="medium"
            style="width:217px"
            ></el-input>
        </el-form-item>
        <el-form-item label="变量定义">
          <el-input 
            v-model.trim="form.scriptVar" 
            size="medium"
            type="textarea"
            :rows="4"
            placeholder="变量之间用英文逗号隔开，如var1,var2"
            style="width:100%"
            ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="small" @click="submitUpload(form)">完成</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefineScript',
  data() {
    return {
      visible: false,
      form: {
        scriptName: '',
        scriptVar: ''
      },
      url: process.env.API_ROOT+'/playbookUpSetting'
    }
  },
  computed: {
    //定义上传文件时携带的参数，即表单数据和当前主机
    upData() {
      return {
        scriptName: this.form.scriptName,
        scriptVar: this.form.scriptVar
      };
    }
  },
  methods: {
    //剧本上传成功触发
    uploadSuccess(res, file, fileList) {
      if (res == 0) {
        this.$message({
          message: '剧本上传成功',
          center: true,
          type: 'success'
        });
      }
    },
    //剧本上传失败触发
    uploadFalse(res, file, fileList) {
      this.$message({
          message: '剧本上传失败',
          center: true,
          type: 'error'
        });
    },
    handleRemove(file, fileList) {
      console.log(file);
    },
    handlePreview(file) {
     console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    //表单提交
    submitUpload(form) {
      //触发组件的action
      this.$refs.upload.submit();
      
    },
  }
}
</script>

<style scoped>
  .el-tag {
  	margin-left: 200px;
  	margin-bottom: 20px;
  }
  .upload-btn {
    width: 92px;
  }
  .el-form {
    width: 500px;
    margin: 0 auto;
  }

</style>
