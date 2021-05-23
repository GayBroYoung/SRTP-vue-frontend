<template>
<div class="login-wrap">
	<div class="ms-login">
		<el-form :model="form" ref="form" label-width="0px" class="input-account" :inline="false" size="normal">
			<el-form-item >
				<el-input v-model="input_id" placeholder="学工号"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onStudentLogin()">学生登录</el-button>
				<el-button type="primary" @click="onTeacherLogin()">老师登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</div>
</template>
<script>
import { ElMessage } from 'element-plus'
export default {

	data() {
		return {
			form : {
				account  : ''
			},
			input_id : null
		}
	},
	methods: {
		onTeacherLogin(){
			var url = "api/teacher_login"
			var param = {
				"teacher_id" : this.input_id
			}
			this.$axios.post(url,param)
			.then(res => {
				var data = res.data
				var teacher_id = res.data.teacher.id;
				sessionStorage.setItem("user_id",teacher_id)
				sessionStorage.setItem("user_type","teacher")
				// console.log(res.data)
				ElMessage.success({
					type:"success",
					message:"欢迎您" + res.data.teacher.teacher_name + "老师"
				})
				setTimeout(()=>{
					var id = data.teacher.id
					this.$router.push("/tmanage/" + id)
				},1000)
				
			})
			.catch(err => {
				console.error(err); 
				ElMessage.error({
					type:"error",
					message:"登录失败，请检查学号"
				})
				console.log(this.$store.getters.get_id)

			})
			// console.log(this.teacher_id);
			//
		},
		onStudentLogin(){
			var url = "api/student_login"
			var param = {
				"student_id" : this.input_id
			}
			this.$axios.post(url,param)
			.then(res => {
				console.log(res)
				sessionStorage.setItem("user_id",res.data.student.student_id)
				sessionStorage.setItem("user_type","student")
				ElMessage.success({
					type:"success",
					message:"欢迎您" + res.data.student.student_name + "同学"
				})
				setTimeout(()=>{
					var id = res.data.student.id
					this.$router.push("/smanage/" + id)
				},1000)
			})
			.catch(err => {
				console.error(err); 
				ElMessage.error({
					type:"error",
					message:"登录失败，请检查学号"
				})
				console.log(this.$store.getters.get_id)

			})
		}
	},
}
</script>

<style scoped>
.login-wrap {
	background:url("/src/assets/img/login-bg.jpg");
	width:100%;
	height:100%;
	position:fixed;
	background-size:100% 100%;
}
.el-form {
	align-self:center;
}
.input-account{
	margin-top: 50px;
	margin-left: 10%;
	margin-right: 10%;
}
.form-wrap {
	align-content: center;
	align-items: center;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.5);
    overflow: hidden;
}
</style>
