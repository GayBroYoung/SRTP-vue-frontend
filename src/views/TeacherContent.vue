<template>
<div>

<el-row :gutter="20">
	<el-col :span="8" :offset="0">
		<el-row>
			<el-col :span="24">
				<el-card shadow="hover">
					<div class="user-info">
						<div class="user-info-cont">
							<div >
								<el-row :gutter="20">
									<el-col :span="24" :offset="0" class="card-header">课程信息概览</el-col>
								</el-row>
							</div>
						</div>
					</div>
					<div style="text-align:left">
						<div class="user-info-list">
							课程号：
							<span>{{course.id}}</span>
						</div>
						<div class="user-info-list">
							课程名：
							<span>{{course.course_name}}</span>
						</div>
						<div class="user-info-list">
							课程信息：
							<span>{{course.course_intro}}</span>
						</div>
						<el-button v-if="lecturing_courses.length == 0" type="primary" size="default" @click="beginClass">
							开始上课
						</el-button>
						<el-button v-else type="primary" size="default" @click="continueClass">
							继续课程
						</el-button>
					</div>
				</el-card>
			</el-col>
		</el-row>
		<!-- <el-row>
			<el-col :span="24" :offset="0">
				<el-card shadow="hover" :body-style="{ padding: '20px' }">
					<template #header >
						<span class="card-header">课程总体情况</span>
					</template>
					
					<el-progress :percentage="evaluation.late" color="#ff5555">迟到率 {{evaluation.late}}%</el-progress>
					<el-progress :percentage="evaluation.attendence" color="#5b7ad8">出勤率 {{evaluation.attendence}}%</el-progress>
					<el-progress :percentage="evaluation.attention" color="#91cd75">专注率 {{evaluation.attention}}%</el-progress>
				</el-card>
			</el-col>
		</el-row> -->
	</el-col>
	<el-col :span="16" :offset="0">
		<el-row>
			<el-col>
				<div style="height:400px">
					<el-card shadow="hover" style="height:100%">
						<template #header>
							<div class="card-header">
								查看课程历史信息
							</div>	
						</template>
						<el-table
							:data="course_history"
							:height="250"
							stripe
							style="width: 100%"
							highlight-current-row
						>
							<el-table-column
								prop="index"
								label="记录序号"
							>
							</el-table-column>
							<el-table-column
								prop="start_time"
								label="开始时间"
							>
							</el-table-column>
							<el-table-column
								prop="end_time"
								label="结束时间"
							>
							</el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<el-button
									size="mini"
									@click="handleClick(scope.row)">详情</el-button>
	
								</template>
							</el-table-column>
						</el-table>
					</el-card>
				</div>
				
			</el-col>
		</el-row>
	</el-col>
	
</el-row>

<el-row :gutter="20">
	<el-col :span="10">
		<el-card shadow="hover">
			<div id="pie" class="mechart" canvasId="bar" ></div>
		</el-card>
	</el-col>
	<el-col :span="14">
		<el-card shadow="hover">
			<div id="line" class="mechart" > 0" canvasId="line"></div>
		</el-card>
	</el-col>
</el-row>
</div>
</template>
<script>
import * as echarts from 'echarts'
export default {
	created(){
		this.teacher_id = this.$route.params.id
		this.$axios.post("api/get_lecturing_course",{
			"id":this.$route.params.id,
			"user_type":"teacher"
		})
		.then(res => {
			this.lecturing_courses = res.data.courses
			console.log(this.lecturing_courses);
		})
		.catch(err => {
			console.error(err); 
		})
	},
	mounted() {
		console.log(this.course);
		this.linechart = echarts.init(document.getElementById('line'))
		this.linechart.setOption(this.line_chart_data,true)

		this.rateChart = echarts.init(document.getElementById('pie'))
		this.rateChart.setOption(this.pie_chart_data)
		this.$axios.get("api/get_course_info/" + this.course.id)
		.then(res => {
			this.course_history = res.data.course_history
			// console.log(this.course_history)
		})
		.catch(err => {
			console.error(err); 
		})
	},
	methods: {

		handleClick(row){
			var index = row.index
			var course_id = row.course_id
			console.log(typeof(index))
			var url = "api/get_course_evaluation"
			var params = {
				"course_id" : course_id,
				"course_index" : index
			}
			this.$axios.post(url,params)
			.then(res => {
				this.eval = res.data.history
				console.log(this.eval);
				this.setData()
				this.linechart.setOption(this.line_chart_data,true)
				this.rateChart.setOption(this.pie_chart_data,true)
			})
			.catch(err => {
				console.error(err); 
			})
		},
		continueClass(){
			var course = this.lecturing_courses[0]
			this.$router.push(`/course_state/${this.teacher_id}/${course.course_id}/${course.course_index}`)
		},
		beginClass(){
			console.log((this.course));
			this.$axios.post("api/operate_class",{"course_type":"begin","course_id":this.course.id})
			.then(res => {
				// console.log(res)
				var course = res.data.course
				this.$router.push(`/course_state/${this.teacher_id}/${this.course.id}/${course.course_index}`);
			})
			.catch(err => {
				console.error(err); 
			})
		},
		endClass(){
			this.$axios.post("api/operate_class",{"course_type":"end","course_id":this.course.id})
			.then(res => {
				console.log(res)
			})
			.catch(err => {
				console.error(err); 
			})
		},
		setData(){
			var dis = []
			var con = []
			var off = []
			var dat = []
			var i = 0
			var sumDistracted=0,sumConentrated=0,sumOffline=0
			this.eval.forEach(element => {
				sumDistracted += element.nr_distracted;
				sumConentrated += element.nr_concentrated;
				sumOffline += element.nr_offline;

				dis.push(element.nr_distracted)
				con.push(element.nr_concentrated)
				off.push(element.nr_offline)
				dat.push(`${i}`)
				i++;
			});
			if(this.eval.length > 0){
				sumDistracted /= this.eval.length;
				sumConentrated /= this.eval.length;
				sumOffline /= this.eval.length;
			}
			

			var pie_data = [
				{name:'专注',value:sumConentrated},
				{name:'不专注',value:sumDistracted},
				{name:'离线',value:sumOffline}
			]

			var series = [
				{	
					name:'专注',
					type:'line',
					data: con
				},
				{
					name:'不专注',
					type:'line',
					data: dis
				},
				{
					name:'离线',
					type:'line',
					data: off
				}
			]
			

			var xAxis = {
				data : dat
			}
			this.line_chart_data.series = series
			this.line_chart_data.xAxis = xAxis
			this.pie_chart_data.series[0].data = pie_data
			// console.log(this.line_chart_data)
		}
	},
	props:['course'],
	computed: {
		normalizedSize: function () {
			return this.course.name
		}
	},
	// watch: {
	// 	course:function(current){
	// 		this.line_chart_data.series[0].data[0] += 1
	// 		this.linechart.setOption(this.line_chart_data)
	// 		this.rateChart.setOption(this.pie_chart_data)
	// 	}
	// },
	data() {
		return {
			has_lecturing_class : false,
			lecturing_courses : [],
			lineChart:null,
			rateChart:null,
			course_history:[],
			eval: [],
			
			evaluation:{
				late:43,
				attention:28,
				attendence:82
			},

			
			pie_chart_data:{
			title:{
				text:"课堂综合情况",
				x:"center"
			},
			legend: {
				bottom : '5%',
				left: 'center'
			},
			avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}({d}%)"
			},
			series:[
				{
					name:'课堂评价',
					radius: ['40%', '70%'],
					type:'pie',
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 10,
						borderColor: '#fff',
						borderWidth: 2
					},
					label: {
						show: false,
						position: 'center'
					},
					emphasis: {
						label: {
							show: true,
							fontSize: '40',
							fontWeight: 'bold'
						}
					},
					labelLine: {
						show: false
					},
					data:[
						{name:'专注',value:15},
						{name:'不专注',value:20},
						{name:'离线',value:23}
					]
				}
				]
			},
			line_chart_data:{
				// title:"平均专注率图",
				xAxis:{
					data:['15min','30min','45min','60min']
				},
				yAxis:{},
				legend:{
					data:['专注','不专注','离线']
				},
				series:[
				{	
					name:'专注',
					type:'line',
					data:[10,20,30,20]
				},
				{
					name:'不专注',
					type:'line',
					data:[40,30,20,10]
				}
				]
			}
		}
	}
}
</script>
<style scoped>
.el-col {
	border-radius: 4px;
}
.nav-menu{
	padding-top: 10px;
	padding-left: 10px;
	display: flex;
	justify-content: left;
}
.el-row {
	margin-bottom: 10px;
}
.el-progress{
	margin-top: 10px;
}

.bg-purple-dark {
	background: #99a9bf;
}
.bg-purple {
	background: #d3dce6;
}
.bg-purple-light {
	background: #e5e9f2;
}
.grid-content {
	border-radius: 8px;
	min-height: 36px;
}
.row-bg {
	padding: 10px 0;
	background-color: #f9fafc;
}
.el-card {
	border-radius: 8px;
}
.mechart {
	width: 100%;
	height: 300px;
}
.progress-line {
	display: flex;
}
.user-info {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 2px solid #ccc;
	margin-bottom: 20px;
}

.user-avator {
	width: 120px;
	height: 120px;
	border-radius: 50%;
}

.user-info-cont {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	font-size: 14px;
	color: #999;
	line-height: 25px;
}
.card-header {
	display: flex;
	justify-content: left;
	padding-left: 10px;
	font-size: 18px;
	color: rgb(32, 32, 32);
}

</style>