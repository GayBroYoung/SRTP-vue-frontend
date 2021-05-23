import { createRouter, createWebHashHistory } from "vue-router"


const router = createRouter({
	history :createWebHashHistory(),
	routes:[
		{
			path: '/tmanage/:id',
			component: ()=> import('/src/views/TeacherPanel.vue')
		},
		{
			path:'/smanage/:student_id',
			component: ()=> import('/src/views/StudentCourse.vue')
		},
		{
			path:'/home',
			component:{
				template:`<h1>HOME</h1>`
			}
		},
		{
			path: '/login',
			component: ()=> import('/src/views/Login.vue')
		},
		{
			path: '/course_state/:teacher_id/:course_id/:course_index',
			component: ()=> import('/src/views/CourseInfo.vue')
		},
		{
			path: '/live_student/:student_id:/:course_id/:course_index',
			component: ()=> import('/src/views/StudentLive.vue')
		},
		{
			path: '/',
			redirect:'/home'
		}
	]
})

export default router