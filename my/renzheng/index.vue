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
					<u-form-item label="法人姓名">
						<u-input input-align="left" :disabled="checkCertification==0" placeholder="请输入法人姓名" v-model="form.companyRealName" />
					</u-form-item>
					<u-form-item label="法人身份证">
						<u-input input-align="left" :disabled="checkCertification==0" placeholder="请输入法人身份证" v-model="form.companyCard" />
					</u-form-item>
					<u-form-item label="联系电话">
						<u-input input-align="left" :disabled="checkCertification==0" placeholder="请输入联系电话" type="number" v-model="form.companyPhone" />
					</u-form-item>
					<u-form-item label="企业名称">
						<u-input input-align="left" :disabled="checkCertification==0" placeholder="请输入企业名称" v-model="form.companyName" />
					</u-form-item>
					<u-form-item label="营业执照注册号">
						<u-input input-align="left" :disabled="checkCertification==0" placeholder="请输入营业执照注册号" v-model="form.registrationNo" />
					</u-form-item>
					<u-form-item label="详细地址" right-icon="arrow-right" :right-icon-style="rightIconStyle">
						<u-input @click="checkCertification!=0?selectAddress():''" input-align="left" disabled placeholder="请选择详细地址" v-model="form.address" />
					</u-form-item>
					
				</u-form>
			</view>
		</view>
		<!-- 上传营业执照 -->
		<view class="business flex justify-center align-center">
			<view class="business-box">
				<view class="business-box-title">
					上传营业执照
				</view>
				<view class="business-box-uploud" @click="uploudImg" v-if="form.businessLicense">
					<image :src="form.businessLicense" style="border-radius: 20rpx;" mode=""></image>
				</view>
				<view class="business-box-uploud" @click="uploudImg" v-else>
					<image src="../../static/image/my/uploud.png" mode=""></image>
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
					userType:2,//认证类型1个人 2企业
					companyRealName:'',//法人姓名
					companyCard:'',//法人身份证
					companyPhone:'',//联系电话
					companyName:'',//企业名称
					registrationNo:'',//营业执照注册号
					address:'',//详细地址
					businessLicense:'',//营业执照
				},
				checkCertification:null,
				examineDetails:'',//审核说明
			}
		},
		onLoad(optipn) {
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
						this.form.companyRealName = res.data.companyRealName
						this.form.companyCard = res.data.companyCard
						this.form.companyPhone = res.data.companyPhone
						this.form.companyName = res.data.companyName
						this.form.registrationNo = res.data.registrationNo
						this.form.address = res.data.address
						this.form.businessLicense = res.data.businessLicense
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
				if(!this.form.companyRealName){
					uni.showToast({
						title:'请输入法人姓名',
						icon:'none'
					})
					return
				}
				if(!this.form.companyCard){
					uni.showToast({
						title:'请输入法人身份证号码',
						icon:'none'
					})
					return
				}
				if(!this.form.companyPhone){
					uni.showToast({
						title:'请输入联系电话',
						icon:'none'
					})
					return
				}
				if(!this.form.companyName){
					uni.showToast({
						title:'请输入企业名称',
						icon:'none'
					})
					return
				}
				if(!this.form.registrationNo){
					uni.showToast({
						title:'请输入营业执照注册号',
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
				if(!this.form.businessLicense){
					uni.showToast({
						title:'请上传营业执照',
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
			uploudImg(){
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
								that.form.businessLicense = JSON.parse(uploadFileRes.data).data
								
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