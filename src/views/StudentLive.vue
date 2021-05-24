<template>
<div>
    <el-row :gutter="10" style="padding:20px">
        <el-col :span="6" :offset="0">
                <el-card shadow="hover" :body-style="{ padding: '20px' ,margin:'20px'}">
                    <div style="margin:20px;padding:20px">
                        {{tip}}
                    </div>
                    <el-button type="danger" size="default" @click="leave">
                        退出课程
                    </el-button>
                </el-card>
        </el-col>
        <el-col :span="18" :offset="0">
            <video-card ref="pagevideo" title="直播画面"></video-card>
        </el-col>
    </el-row>
</div>
</template>
<script>
import VideoCard from '../components/VideoCard.vue'
export default {
    components:{
        VideoCard 
    },
    mounted() {
        this.page_video = this.$refs.pagevideo.page_video
        this.student_id = this.$route.params.student_id
        this.course_id = this.$route.params.course_id
        this.course_index = this.$route.params.course_index
        this.timer_id = setInterval(this.get_result,1000)
    },
    beforeRouteLeave (to, from, next) {
        clearInterval(this.timer_id)
        this.$refs.pagevideo.close_video()
        next()
    },
    computed: {
        tip: function () {
            if(this.evalutaiton){
                return "您现在在认真听课"
            }
            else{
                return "现在您没有认真听课哦"
            }
        }   
    },
    methods: {
        leave() {
            clearInterval(this.timer_id)
            this.$axios.post("api/student_leave_class",{
                "index":this.course_index,
                "student_id":this.student_id,
                "course_id":this.course_id
            })
            .then(res=>{
                console.log(res)
                this.$router.go(-1)
            })
            .catch(err=>{
                console.error(err)
            })
        },
        get_result(){
            let form = new FormData()
            console.log(this.page_video)
            let base64_str = this.$refs.pagevideo.capture_video_picture()
            form.append("student_id",this.student_id)
            form.append("course_index",this.course_index)
            form.append("course_id",this.course_id)
            form.append("img",base64_str)
            // console.log(base64_str)
            const instance = this.$axios.create({
                withCredentials: true
            })
            instance.post("api/img_stream",form)
            .then(res=>{
                console.log(res.data.result);
                this.evalutaiton = res.data.result
            })
            .catch(err=>{
                console.error(err);
                this.$router.push("/Login")
            })
        }
    },
    data() {
        return {
            page_video : {},
            evalutaiton : false
        }
    },
}
</script>