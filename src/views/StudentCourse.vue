<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="6" :offset="0">
                <el-row :gutter="24">
                    <el-col :offset="0">
                    <el-card shadow="always" :body-style="{ padding: '20px' , margin : '20px' }">
                        <template #header>
                            <span class="header-bold">学生信息</span>
                        </template>
                        <!-- card body -->
                        <div>
                            学工号：{{student.id}}
                        </div>
                        <div>
                            学生姓名：{{student.student_name}}
                        </div>
                    </el-card>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :offset="0">
                    <el-card shadow="always" :body-style="{ padding: '20px' }">
                        <template #header>
                            <span class="header-bold">正在进行</span>
                        </template>
                        <div v-if="has_lecturing_courses">
                            <el-button type="primary" size="default" @click="enterClass">进入课程</el-button>
                        </div>
                        <div v-else>没有正在进行的课程</div>
                    </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="18" :offset="0">
                <el-card shadow="hover" :body-style="{ padding: '20px' }">
                    <template #header>
                        <h3>选修课程</h3>
                    </template>
                    <el-table
                        :data="courses"
                        :height="250"
                        stripe
                        style="width: 100%"
                        highlight-current-row
                    >
                        <el-table-column
                            prop="course_uid"
                            label="课程uid"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="course_name"
                            label="课程名"
                        >
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        
    </div>
</template>
<script>
export default {
    mounted() {
        var student_id = this.$route.params.student_id
        this.$axios.post("api/get_user_info",{
            "user_type":"student",
            "user_id":student_id
        })
        .then(res => {
            console.log(res)
            this.student = res.data
        })
        .catch(err => {
            console.error(err); 
        })

        this.$axios.get("api/get_student_course/" + student_id)
        .then(res=>{
            console.log(res);
            this.courses = res.data.courses
        })
        .catch( err=>{
            console.error(err)
        })

        this.$axios.post("api/get_lecturing_course",{
            "user_type" : "student",
            "id" : student_id
        })
        .then(res=>{
            this.lecturing_courses = res.data.courses
            console.log("lecturing")
            console.log(this.lecturing_courses.length)
            if(this.lecturing_courses && this.lecturing_courses.length > 0){
                this.has_lecturing_courses = true;
            }
            // this.$router.push(`/live_student/${student_id}/${course.course_id}/${course.course_index}`)
        })
        .catch( err=>{
            console.error(err)
            console.log(student_id);
        })
    },
    data() {
        return {
            student : {id:"",name:""},
            courses : [],
            lecturing_courses : [],
            has_lecturing_courses : false
        }
    },
    methods: {
        get_lecturing_info(id){
            // this.lecturing_courses.forEach(element=>{
            for(let i = 0 ; i < this.courses.length;i++){
                var course_ = this.courses[i]
                if(id == course_.id){
                    return course_.course_name
                }
            }   
        
        },
        enterClass(){
            if(this.lecturing_courses.length > 0){
                var course = this.lecturing_courses[0]
                this.$axios.post("api/student_join_class",{
                    "index":course.course_index,
                    "course_id":course.course_id,
                    "student_id":this.student.id
                })
                .then(res => {
                    console.log(res);
                    this.$router.push(`/live_student/${this.student.id}/${course.course_id}/${course.course_index}`)
                })
                .catch(err => {
                    console.error(err); 
                })
            }
        }
    }
}
</script>
<style scoped>
.header-bold{
    font-weight: bold;
}
</style>