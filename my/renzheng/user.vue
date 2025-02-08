<template>
	<view style="padding-bottom: 20rpx;">
		<view class="status">
			<view class="status-item" v-if="checkCertification && checkCertification == 0" style="color:green">
				审核中
			</view>
			<view class="status-item" v-if="checkCertification && checkCertification == 2" style="color:red">
				已拒绝：{{examineDetails}}
			</view>
		</view>
		<view class="from flex justify-center align-center">
			<view class="from-box">
				<u-form :model="form" :label-style="labelStyle" ref="uForm" label-position="top">
					<u-form-item label="真实姓名">
						<u-input input-align="left" :disabled="checkCertification==0" placeholder="请输入真实姓名" v-model="form.realName" />
					</u-form-item>
					<u-form-item label="身份证号">
						<u-input input-align="left" :disabled="checkCertification==0" placeholder="请输入身份证号" v-model="form.idCard" />
					</u-form-item>
					<u-form-item label="详细地址" right-icon="arrow-right" :right-icon-style="rightIconStyle">
						<u-input @click="checkCertification!=0?selectAddress():''" input-align="left" disabled placeholder="请选择详细地址" v-model="form.address" />
					</u-form-item>
					
				</u-form>
			</view>
		</view>
		<!-- 上传身份证正面 -->
		<view class="business flex justify-center align-center">
			<view class="business-box">
				<view class="business-box-title">
					上传身份证正面
				</view>
				<view class="business-box-uploud" @click="uploudImg(true)" v-if="form.idFront">
					<image :src="form.idFront" style="border-radius: 20rpx;" mode=""></image>
				</view>
				<view class="business-box-uploud" @click="uploudImg(true)" v-else>
					<image src="../../static/image/my/idFront.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 上传身份证反面 -->
		<view class="business flex justify-center align-center">
			<view class="business-box">
				<view class="business-box-title">
					上传身份证反面
				</view>
				<view class="business-box-uploud" @click="uploudImg(false)" v-if="form.idBack">
					<image :src="form.idBack" style="border-radius: 20rpx;" mode=""></image>
				</view>
				<view class="business-box-uploud" @click="uploudImg(false)" v-else>
					<image src="../../static/image/my/idBack.png" mode=""></image>
				</view>
			</view>
		</view>
		<view v-if="checkCertification!=0 && checkCertification!=1" class="submit flex justify-center align-center">
			<view @click="submit" class="submit-box flex justify-center align-center">
				提交认证
			</view>
		</view>
	</view>
</template>

<script>
	import config from '../../common/config.js'
	export default {
		data() {
			return {
				rightIconStyle: {
					color: '#999999'
				},
				//表单label样式
				labelStyle:{
					fontSize:'30rpx',
					fontWeight:'bold'
				},
				//表单
				form:{
					userType:1,//认证类型1个人 2企业
					realName:'',//真实姓名
					idCard:'',//身份证号
					address:'',//详细地址
					idFront:'',//身份证正面
					idBack:'',//身份证反面
				},
				checkCertification:null,
				examineDetails:'',//审核说明
			}
		},
		onLoad(optipn) {
			console.log(optipn.isUpdate)
			if(optipn.isUpdate || optipn.isUpdate == 'true'){
				this.getRenzhengInfo()
				this.checkCertification = optipn.checkCertification
			}else{
				this.checkCertification = null
			}

		},
		onShow() {

		},
		methods: {
			//获取认证信息
			getRenzhengInfo(){
				this.$Request.postT('/app/userCertification/getMyCertification').then(res=>{
					if(res.code == 0){
						this.form.realName = res.data.realName
						this.form.idCard = res.data.idCard
						this.form.address = res.data.address
						this.form.idFront = res.data.idFront
						this.form.idBack = res.data.idBack
						this.form.certificationId = res.data.certificationId
						this.examineDetails = res.data.examineDetails
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			submit(){
				if(!this.form.realName){
					uni.showToast({
						title:'请输入真实姓名',
						icon:'none'
					})
					return
				}
				if(!this.form.idCard){
					uni.showToast({
						title:'请输入身份证号码',
						icon:'none'
					})
					return
				}
				if(!this.form.address){
					uni.showToast({
						title:'请输入选择详细地址',
						icon:'none'
					})
					return
				}
				if(!this.form.idFront){
					uni.showToast({
						title:'请上传身份证正面',
						icon:'none'
					})
					return
				}
				if(!this.form.idBack){
					uni.showToast({
						title:'请上传身份证反面',
						icon:'none'
					})
					return
				}
				this.$Request.postT('/app/userCertification/saveUserCertification',this.form).then(res=>{
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
			// 上传营业执照
			uploudImg(type){
				if(this.checkCertification==0){
					return
				}
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
								if(type == true){//正面
									that.form.idFront = JSON.parse(uploadFileRes.data).data
								}else{//反面
									that.form.idBack = JSON.parse(uploadFileRes.data).data
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
			//选择详细地址
			selectAddress(){
				let that = this
				uni.chooseLocation({
					complete(res) {
						console.log(res)
						if(res.address){
							that.form.address = res.address
							// that.form.lat = res.latitude
							// that.form.lng = res.longitude
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F7F7F7;
	}
	/deep/.u-form-item{
		padding: 24rpx 0 !important;
	}
	.status{
		width: 100%;
		padding: 10rpx;
		text-align: center;
		background-color: #FFFFFF;
	}
	.from {
		width: 100%;
		height: auto;
		margin-top: 20rpx;
		.from-box {
			width: 720rpx;
			height: 100%;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 30rpx;
		}
	}
	.business{
		width: 100%;
		height: 420rpx;
		margin-top: 20rpx;
		.business-box{
			width: 720rpx;
			height: 100%;
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 30rpx;
		}
		.business-box-title{
			font-size: 32rpx;
			color: #333333;
			font-weight: bold;
		}
		.business-box-uploud{
			width: 530rpx;
			height: 300rpx;
			// background-color: red;
			margin: 0 auto;
			margin-top: 24rpx;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	.submit{
		width: 100%;
		height: 88rpx;
		margin-top: 20rpx;
		.submit-box{
			width: 710rpx;
			height: 100%;
			border-radius: 16rpx;
			background-color: #6696FF;
			font-size: 32rpx;
			color: #FFFFFF;
			font-weight: bold;
		}
	}
</style>