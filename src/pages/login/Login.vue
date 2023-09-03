<template>
	<div class="body-bg">
		<el-row style="width:800px;margin: 120px auto;box-shadow: 0 0 12px #fff;">
			<el-col :span="8" class="left">
				<div class="content">
					<h1>欢迎登录</h1>
					<p>集中化运维监控平台</p>
				</div>
			</el-col>
			<el-col :span="12" class="right">
				<el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="60px" class="loginForm">
					<el-form-item label="用户名" prop="username">
						<el-input v-model="loginForm.username" autocomplete="off" clearable></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password">
						<el-input type="password" v-model="loginForm.password" autocomplete="off" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="success" @click="submitForm('loginForm')" style="width:217px" ref="submit">登录</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import debounce from '@/utils/debounce'
import requestMethod from '@/utils/request'
import as from 'qs'
export default {
	name: 'Login',
	data() {
		//定义验证器
		var validateUser = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入用户名'));
			} else {

				callback();
			}
		};
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入密码'));
			} else {

				callback();
			}
		};

		return {
			timer1: null,
			timer2: null,
			loginForm: {
				username: '',
				password: ''
			},
			rules: {
				username: [
				{ validator: validateUser, trigger: 'blur' }
				],
				password: [
				{ validator: validatePass, trigger: 'blur' }
				]
			}
		};
	},
	methods: {
		submitForm(formName) {
			// let submitbtn = this.$refs.submit;
			// submitbtn.disabled = true;
			this.$refs[formName].validate((valid) => {
				if (valid) { //如果数据通过验证，则把数据提交到后台
					//post请求
					const that = this;
					let loginData = {
						username: that.loginForm.username,
						password: that.loginForm.password
					};

					requestMethod({
						url:'/login',
						method: 'post',
						data: loginData
					})
						.then(function (res) {
							if (res.data == '1') {
								debounce(function(){
				            that.$message({
											message: '登录成功',
											center: true,
											type: 'success'
										});
				          },16)();
							// if (that.timer1) {
			    //       clearTimeout(that.timer1);
			    //     } else {
			    //       that.timer1 = setTimeout(function(){
			    //         that.$message({
							// 			message: '登录成功',
							// 			center: true,
							// 			type: 'success'
							// 		});
			    //       },16);
			        
							setTimeout(function(){
								that.$router.push('/home');
							},1000);
						} else {
							if (that.timer2) {
			          clearTimeout(that.timer2);
			        } else {
			          that.timer2 = setTimeout(function(){
			            that.$message({
										message: '用户名或密码错误',
										center: true,
										type: 'error'
									})
			          },16);
			        }
						}

					});
					//把用户名存到本地仓库中
					let store = window.sessionStorage;
					store.setItem('username',that.loginForm.username);
				}
			});
		}
	}
}
</script>

<style scoped>
 .body-bg  {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        overflow-y: auto;
        background-image: url(../../assets/login.jpg);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center center;
    }

	.left {
		width: 400px;
		height: 300px;
		display: flex;
		background: #67C23A;
	}
	.content {
		color: #fff;
		margin: auto;
	}
	.right {
		width: 400px;
		height: 300px;
		display: flex;
		background: #fff;
		padding: 50px 20px;
	}
	.loginForm {
		margin: auto;
	}
</style>
