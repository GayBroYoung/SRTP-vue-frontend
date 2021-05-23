<template>
<div>
    <el-row :gutter="10" style="padding:20px">
        <el-col :span="6" :offset="0">
            <el-card shadow="hover" :body-style="{ padding: '20px' }">
                <template #header >
                    <span class="card-header">课程总体情况</span>
                </template>
                <!-- card body -->
                <el-progress :percentage="attendence_rate" color="#ff5555"> 到课率 {{attendence_rate.toFixed(2)}}%</el-progress>
                <el-progress :percentage="concentrated_rate" color="#91cd75"> 专注率 {{concentrated_rate.toFixed(2)}}%</el-progress>
                <el-button type="danger" size="default" @click="end_class">结束直播</el-button>
            </el-card>
        </el-col>
        <el-col :span="18" :offset="0">
            <video-card ref="video" title="直播画面"></video-card>
        </el-col>

    </el-row>
</div>
</template>
<script>
import VideoCard from "../components/VideoCard.vue";

// import $ from 'jquery'
export default{
    components: { VideoCard },
    
    computed: {
        attendence_rate: function(){
            if (this.nr_offline + this.nr_distracted + this.nr_concentrated == 0) {
                return 0
            }
            let rate = (1 - (this.nr_offline / (this.nr_offline + this.nr_distracted + this.nr_concentrated))) * 100
            return rate;
        },
        concentrated_rate:function(){
            if (this.nr_distracted + this.nr_concentrated == 0) {
                return 0
            }
            let rate = this.nr_concentrated / (this.nr_distracted + this.nr_concentrated) * 100;
            return rate;
        }
    },
    mounted() {
        console.log(this.$refs.video.page_video);
        this.nr_offline = 50
        this.course_id = this.$route.params.course_id
        this.teacher_id = this.$route.params.teacher_id
        this.course_index = this.$route.params.course_index
        this.timer_id = setInterval(this.acquire_data,1000)
    },
    beforeRouteLeave (to, from, next) {
        clearInterval(this.timer_id)
        this.$refs.video.close_video()
        next()
    },
    methods: {
        end_class(){
            var url = "api/operate_class"
            var params = {
                "course_type":"end",
                "course_id":this.$route.params["course_id"]
            }
            this.$axios.post(url,params)
            .then(res => {
                console.log(res)
                this.$router.go(-1)
            })
            .catch(err => {
                console.error(err); 
            })
        },
        acquire_data() {
            var url = "api/get_current_evaluation"
            var params = {
                "course_id" : this.course_id,
                "index" : this.course_index
            }
            console.log(this.course_index)
            this.$axios.post(url,params)
            .then(res => {
                // console.log(res)
                this.nr_offline = res.data.nr_offline
                this.nr_concentrated = res.data.nr_concentrated
                this.nr_distracted = res.data.nr_distracted
            })
            .catch(err => {
                console.error(err); 
            })
        }
    },
    data(){
        return {
            timer_id : -1,
            page_video : null,
            nr_offline:0,
            nr_distracted:0,
            nr_concentrated:0,
            course_id : 0,
            course_index : 0
        }
    },
}
</script>
<style scoped>
video {
    width: 300px;
    height: 300px;
    border: 1px solid #ccc;
}

</style>
