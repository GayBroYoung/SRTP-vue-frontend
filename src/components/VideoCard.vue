<template>
<div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
        <template #header>
            <span class="video-title">{{title}}</span>
        </template>
        <!-- card body -->
        <video autoplay id ="live-video"></video>
    </el-card>
</div>
</template>
<script>
export default {
    beforeDestroy() {
        console.log("fuck that ")
    },
    mounted() {
        navigator.getUserMedia =
                navigator.getUserMedia || 
                navigator.webkitGetUserMedia || 
                navigator.mozGetUserMedia || 
                navigator.msGetUserMedia;
        //setInterval(this.aquire_data,1000);
        navigator.getUserMedia({video:true,audio:false},this.cap_success,this.cap_error)
    
        this.page_video = document.getElementById("live-video")
    },
    
    methods: {
        close_video(){
            try{
                this.track.stop()
            }catch(error){
                console.error(error)
            }
        },
        cap_success(stream){
            console.log('摄像头开启成功')
            this.page_video.srcObject = stream
            this.track = stream.getVideoTracks()[0]
            // this.mediaStreamTrack = stream.getTracks()[0]
        },
        cap_error(error){
            console.error(error)
        },
        capture_video_picture(){
            var canvas=document.createElement('canvas');
            canvas.width = 224
            canvas.height = 224
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this.page_video,0,0,canvas.width, canvas.height)
            var imgData=canvas.toDataURL("image/jpeg");
            var base64_str = imgData.substring(23)
            return base64_str
        }
    },
    data(){
        return {
            page_video : null
        }
    },
    props:["title"]
}
</script>
<style scoped>
.video-title{
	display: flex;
	justify-content: center;
	padding-left: 10px;
	font-size: 18px;
	color: rgb(32, 32, 32);
    size: 20px;
    font-weight: bold;
}
</style>