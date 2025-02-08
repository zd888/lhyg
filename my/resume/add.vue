<template>
	<view style="padding-bottom: 40rpx;">
		<view class="from flex align-center justify-center">
			<view class="from-box">
				<u-form :label-style="labelStyle" :model="form" ref="uForm">
					<u-form-item label="简历名称">
						<u-input v-model="form.resumesName" placeholder="请输入简历名称" />
					</u-form-item>
					<u-form-item label="姓名">
						<u-input v-model="form.realName" placeholder="请输入姓名" />
					</u-form-item>
					<u-form-item label="年龄">
						<u-input v-model="form.age" type="number" placeholder="请输入年龄" />
					</u-form-item>
					<u-form-item label="手机号">
						<u-input v-model="form.phone" type="number" placeholder="请输手机号" />
					</u-form-item>
					<u-form-item label="是否兼职" :right-icon-style="rightIconStyle" right-icon="arrow-right">
						<u-input @click="showjz = true" v-model="form.isConcurrentName" disabled placeholder="请选择是否兼职" />
					</u-form-item>
					<u-form-item label="婚姻状况" :right-icon-style="rightIconStyle" right-icon="arrow-right">
						<u-input @click="showhy = true" v-model="form.marriageStatusName" disabled placeholder="请选择婚姻状况" />
					</u-form-item>
					<u-form-item label-width="250" label="期望薪资(元/月)">
						<u-input v-model="form.hopeSalary" type="number" placeholder="请选择期望薪资" />
					</u-form-item>
					<u-form-item label="工作范围" :right-icon-style="rightIconStyle" right-icon="arrow-right">
						<u-input v-model="form.work" @click="showWork = true" disabled placeholder="请输入工作范围" />
					</u-form-item>
					<u-form-item :border-bottom="false" label="接受晚班" :right-icon-style="rightIconStyle"
						right-icon="arrow-right">
						<u-input v-model="form.acceptNightWorkName" @click="showwb = true" disabled placeholder="请选择接受晚班" />
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view class="uploud flex align-center justify-center">
			<view class="uploud-box">
				<view class="uploud-box-title">
					准驾机械
				</view>
				<view class="uploud-box-img flex align-center flex-wrap">
					<view class="uploud-box-img-item" v-for="(item,index) in form.driveLicense" :key="index">
						<image :src="item" mode=""></image>
						<u-icon name="close-circle" @click="deleteImg(1,index)" class="uploud-box-img-item-icon" color="red" size="38"></u-icon>
					</view>
					<view class="uploud-box-img-item" @click="uploadImg(1)">
						<u-icon name="camera" style="margin-top: 30rpx;margin-left: 30%;" color="#000000"
							size="54"></u-icon>
						<view class="uploud-box-img-item-txt">
							添加图片
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uploud flex align-center justify-center">
			<view class="uploud-box">
				<view class="uploud-box-title">
					资质认证
				</view>
				<view class="uploud-box-img flex align-center flex-wrap">
					<view class="uploud-box-img-item" v-for="(item,index) in form.qualifications" :key="index">
						<image :src="item" mode=""></image>
						<u-icon name="close-circle"  @click="deleteImg(2,index)" class="uploud-box-img-item-icon" color="red" size="38"></u-icon>
					</view>
					<view class="uploud-box-img-item" @click="uploadImg(2)">
						<u-icon name="camera" style="margin-top: 30rpx;margin-left: 30%;" color="#000000"
							size="54"></u-icon>
						<view class="uploud-box-img-item-txt">
							添加图片
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uploud flex align-center justify-center">
			<view class="uploud-box">
				<view class="uploud-box-title">
					保险
				</view>
				<view class="uploud-box-img flex align-center flex-wrap">
					<view class="uploud-box-img-item" v-for="(item,index) in form.insure" :key="index">
						<image :src="item" mode=""></image>
						<u-icon name="close-circle"  @click="deleteImg(3,index)" class="uploud-box-img-item-icon" color="red" size="38"></u-icon>
					</view>
					<view class="uploud-box-img-item" @click="uploadImg(3)">
						<u-icon name="camera" style="margin-top: 30rpx;margin-left: 30%;" color="#000000"
							size="54"></u-icon>
						<view class="uploud-box-img-item-txt">
							添加图片
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="add flex align-center justify-center">
			<view class="add-box flex align-center justify-center" @click="addResume()">
				保存简历
			</view>
		</view>
		<!-- 是否兼职 -->
		<u-action-sheet :list="listjz" @click="clickjz" v-model="showjz"></u-action-sheet>
		<!-- 婚姻状态 -->
		<u-action-sheet :list="listhy" @click="clickhy" v-model="showhy"></u-action-sheet>
		<!-- 接受晚班 -->
		<u-action-sheet :list="listjz" @click="clickwb" v-model="showwb"></u-action-sheet>
		<!-- 工作范围 -->
		<u-picker v-model="showWork" mode="region" @confirm="confirmWork"></u-picker>
	</view>
</template>

<script>
	import config from '../../common/config.js'
	export default {
		data() {
			return {
				showWork:false,
				showwb:false,
				listjz: [{
					text: '否',
				}, {
					text: '是'
				}],
				showjz: false,
				listhy: [{
					text: '未婚',
				}, {
					text: '已婚'
				}],
				showhy: false,
				labelStyle: {
					color: '#333333',
					fontSize: '30rpx',
					fontWeight: 'bold',
				},
				rightIconStyle: {
					color: '#999999'
				},
				form: {
					resumesName:'',//简历名称
					realName: '', //姓名
					age: '', //年龄
					phone: '', //手机号
					isConcurrentName:'',
					isConcurrent: '', //是否兼职
					marriageStatusName: '', //婚姻状态
					marriageStatus: '', //婚姻状态
					hopeSalary: '', //期望薪资
					work: '', //工作范围
					acceptNightWorkName: '', //是否接受晚班
					acceptNightWork: '', //是否接受晚班
					workProvince: '', //工作范围-省
					workCity: '', //工作范围-市
					workDistrict: '', //工作范围-区/县
					driveLicense:[],//准驾机械
					qualifications:[],//资质认证
					insure:[],//保险
				},
				resumesId:'',
			};
		},
		onLoad(option) {
			if(option.resumesId){
				this.resumesId = option.resumesId
				this.getResumeInfo()
			}
		},
		methods: {
			//获取简历详情
			getResumeInfo(){
				let data = {
					resumesId:this.resumesId
				}
				this.$Request.getT('/app/resumes/getResumes',data).then(res=>{
					if(res.code == 0){
						this.form.resumesName = res.data.resumesName//简历名称
						this.form.realName = res.data.realName //姓名
						this.form.age = res.data.age //年龄
						this.form.phone = res.data.phone //手机号
						this.form.isConcurrentName = res.data.isConcurrent==1?'是':'否'
						this.form.isConcurrent = res.data.isConcurrent //是否兼职
						this.form.marriageStatusName = res.data.marriageStatus==1?'已婚':'未婚' //婚姻状态
						this.form.marriageStatus = res.data.marriageStatus //婚姻状态
						this.form.hopeSalary = res.data.hopeSalary //期望薪资
						this.form.work = res.data.workProvince+''+res.data.workCity+''+res.data.workDistrict //工作范围
						this.form.acceptNightWorkName = res.data.acceptNightWork==1?'是':'否' //是否接受晚班
						this.form.acceptNightWork = res.data.acceptNightWork //是否接受晚班
						this.form.workProvince = res.data.workProvince//工作范围-省
						this.form.workCity = res.data.workCity //工作范围-市
						this.form.workDistrict = res.data.workDistrict //工作范围-区/县
						this.form.driveLicense = res.data.driveLicense.split(',') //准驾机械
						this.form.qualifications = res.data.qualifications.split(',')//资质认证
						if(res.data.insure){
							this.form.insure = res.data.insure.split(',')//保险
						}
						this.form.resumesId = res.data.resumesId
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			//添加简历
			addResume() {
				if (!this.form.resumesName) {
					uni.showToast({
						title: '请输入简历名称',
						icon: 'none'
					})
					return
				}
				if (!this.form.realName) {
					uni.showToast({
						title: '请输入姓名',
						icon: 'none'
					})
					return
				}
				if (!this.form.age) {
					uni.showToast({
						title: '请输入年龄',
						icon: 'none'
					})
					return
				}
				if (!this.form.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return
				}
				if (!this.form.isConcurrentName) {
					uni.showToast({
						title: '请选择是否兼职',
						icon: 'none'
					})
					return
				}
				if (!this.form.marriageStatusName) {
					uni.showToast({
						title: '请选择婚姻状态',
						icon: 'none'
					})
					return
				}
				if (!this.form.hopeSalary) {
					uni.showToast({
						title: '请选择期望薪资',
						icon: 'none'
					})
					return
				}
				if (!this.form.work) {
					uni.showToast({
						title: '请选择工作范围',
						icon: 'none'
					})
					return
				}
				if (!this.form.acceptNightWorkName) {
					uni.showToast({
						title: '请选择是否接受晚班',
						icon: 'none'
					})
					return
				}
				if (this.form.driveLicense.length==0) {
					uni.showToast({
						title: '请上传准驾机械',
						icon: 'none'
					})
					return
				}
				if (this.form.qualifications.length==0) {
					uni.showToast({
						title: '请上传资质认证',
						icon: 'none'
					})
					return
				}
				let data = JSON.parse(JSON.stringify(this.form))
				data.driveLicense = (data.driveLicense).join(',')
				data.qualifications = (data.qualifications).join(',')
				if(data.insure.length>0){
					data.insure = (data.insure).join(',')
				}else{
					data.insure = ''
				}
				this.$Request.postT('/app/resumes/saveResumes',data).then(res=>{
					if(res.code == 0){
						uni.showToast({
							title:'提交成功'
						})
						setTimeout(()=>{
							uni.navigateBack()
						},1000)
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
				

			},
			//删除图片
			deleteImg(type,index){ // type 1:准驾机械 2:资质认证 3:保险
				switch (type){
					case 1:
						this.form.driveLicense.splice(index,1)
						break;
					case 2:
						this.form.qualifications.splice(index,1)
						break;
					case 3:
						this.form.insure.splice(index,1)
						break;
					default:
						break;
				}
				this.$forceUpdate()
			},
			uploadImg(type){//上传图片 1:准驾机械 2:资质认证 3:保险
				let that = this
				uni.chooseImage({
					count:1,
					success(ret) {
						uni.showLoading({
							title:'上传中...'
						})
						uni.uploadFile({
							url:config.APIHOST+'/alioss/upload',
							filePath:ret.tempFilePaths[0],
							name: 'file',
							success(uploadFileRes) {
								uni.hideLoading();
								if(type == 1){
									that.form.driveLicense.push(JSON.parse(uploadFileRes.data).data)
								}else if(type == 2){
									that.form.qualifications.push(JSON.parse(uploadFileRes.data).data)
								}else if(type == 3){
									that.form.insure.push(JSON.parse(uploadFileRes.data).data)
								}
								
								
							},
							fail(error) {
								uni.hideLoading();
								uni.showToast({
									title:'上传失败，请重试!',
									icon:'none'
								})
							}
						})
					},
					fail(err) {
						uni.showToast({
							title:'上传失败，请重试!',
							icon:'none'
						})
					}
				})
			},
			//工作范围
			confirmWork(e){
				this.form.work = e.province.label+''+e.city.label+''+e.area.label
				this.form.workProvince = e.province.label
				this.form.workCity = e.city.label
				this.form.workDistrict = e.area.label
			},
			//是否接受晚班
			clickwb(index){
				this.form.acceptNightWorkName = this.listjz[index].text
				this.form.acceptNightWork = index
			},
			//是否兼职
			clickjz(index){
				this.form.isConcurrentName = this.listjz[index].text
				this.form.isConcurrent = index
			},
			//婚姻状态
			clickhy(index){
				this.form.marriageStatusName = this.listhy[index].text
				this.form.marriageStatus = index
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F2F7;
	}
	/deep/.u-form-item{
		padding: 24rpx 0 !important;
	}
	.from {
		width: 100%;
		height: auto;
		margin-top: 40rpx;

		.from-box {
			width: 686rpx;
			height: 100%;
			padding: 10rpx 30rpx;
			background-color: #ffffff;
			border-radius: 24rpx;
		}
	}

	.uploud {
		width: 100%;
		// height: 274rpx;
		margin-top: 20rpx;

		.uploud-box {
			width: 686rpx;
			height: 100%;
			border-radius: 24rpx;
			background-color: #ffffff;
			padding: 30rpx 30rpx 10rpx 30rpx;
		}

		.uploud-box-title {
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
		}

		.uploud-box-img {
			width: 100%;
			margin-top: 30rpx;

			.uploud-box-img-item {
				width: 150rpx;
				height: 150rpx;
				background-color: #F5F5F5;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				position: relative;
				.uploud-box-img-item-icon{
					position: absolute;
					top: -10rpx;
					right: -10rpx;
				}
				image{
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
				.uploud-box-img-item-txt {
					width: 100%;
					text-align: center;
					color: #333333;
					font-size: 20rpx;
					margin-top: 10rpx;
				}
			}
		}
	}

	.add {
		width: 100%;
		height: 88rpx;
		margin-top: 50rpx;

		.add-box {
			width: 686rpx;
			height: 100%;
			background-color: #4498FF;
			border-radius: 8rpx;
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
</style>