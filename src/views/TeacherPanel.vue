<template>
<div>

<el-container>
	<el-header class="el-dark">
		<vheader title="教师管理界面"/>
		<!-- Header content -->
	</el-header>

	<el-container>
		<el-aside width="15%" class="el-shadow-dark" id="box">
			<el-menu default-active="1"    
				background-color="#545c64" text-color="#ffffff">				
				<el-submenu index="1">
					<template #title><span style="font-size:120%;font-weight:bold;">课程选择</span></template>
					<el-menu-item v-for="(value,key) in courses" 
						:key="key" :index="'1-' + key" 
						 @click="onSelectCourse(value)" 
					 >
						<div class="sub-menu-item">{{value.course_name}}</div>
					</el-menu-item>
				</el-submenu>
			</el-menu>
		</el-aside>
		<el-main>
			<!-- Main content about teacher panel-->
			<teacher-content v-if="selected_course!=null" :course="selected_course" :key="new Date().getTime()"></teacher-content>
			<teacher-info v-else></teacher-info>
		</el-main>
	</el-container>
	
</el-container>

</div>
</template>
<script>
import Vheader from '/src/components/Vheader.vue'
import TeacherContent from './TeacherContent.vue'
import TeacherInfo from './TeacherInfo.vue'

export default {
    name: 'Subjects',
	components:{
		TeacherContent,
		Vheader,
		TeacherInfo
	},
	created() {
	},
	mounted() {

		this.teacher_id = this.$route.params.id
		var url = "api/get_teacher_course/" + this.teacher_id
		this.$axios.get(url)
		.then(res => {
			res.data.courses.forEach(element => {
				this.courses.push(element)
			});
		})
		.catch(err => {
			console.error(err); 
		})
	},
	methods: {
		onSelectCourse(course){
			this.selected_course = course
		}
	},

    data() {
		return {
			teacher_id : null,
			selected_course : null,
			courses : []
		}
    }
}
</script>
<style scoped>
.el-header {
	line-height: 60px;
}
.el-aside {
	color: #333;
}
.el-dark {
	background-color: rgb(36,47,66);
}
.el-shadow-dark{
	background-color: rgb(50,61,87);
}
</style>
