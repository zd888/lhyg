<template>
	<view class="fabu">
		<image src="../../static/image/fabu/bg.png" class="bg" mode=""></image>
		<view class="title flex align-center justify-center">
			<view class="title-box">
				<view class="title-box-hi">
					hi,很高兴见到你
				</view>
				<view class="title-box-you">
					请问你想？
				</view>
			</view>
		</view>
		<view class="card flex align-center justify-center">
			<view class="card-box">
				<view class="card-box-job flex align-center" @click="goQiuzhi">
					<view class="card-box-job-c flex align-center">
						<image src="../../static/image/fabu/job.png" mode=""></image>
						<view class="card-box-job-c-con">
							<view class="card-box-job-c-con-title">
								我要找工作
							</view>
							<view class="card-box-job-c-con-name">
								766万+企业，任你选
							</view>
						</view>
					</view>
				</view>
				<view class="card-box-job flex align-center" @click="getRenzhengInfo()">
					<view class="card-box-job-c flex align-center">
						<image src="../../static/image/fabu/people.png" mode=""></image>
						<view class="card-box-job-c-con">
							<view class="card-box-job-c-con-title">
								我要招人
							</view>
							<view class="card-box-job-c-con-name">
								2.6亿人才库，等你挑
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		
		
		<u-popup v-model="show" mode="bottom" border-radius="40">
			<view class="fabuPopup flex justify-center align-center flex-wrap">
				<view @click="renzheng(2)" class="fabuPopup-card flex align-center">
					<image src="../../static/image/fabu/job.png" mode=""></image>
					<view class="fabuPopup-card-con">
						<view class="fabuPopup-card-con-title">
							企业认证
						</view>
						<view class="fabuPopup-card-con-txt">
							点击进入企业认证
						</view>
					</view>
				</view>
				<view @click="renzheng(1)" class="fabuPopup-card flex align-center">
					<image src="../../static/image/fabu/people.png" mode=""></image>
					<view class="fabuPopup-card-con">
						<view class="fabuPopup-card-con-title">
							个人认证
						</view>
						<view class="fabuPopup-card-con-txt">
							点击进入个人认证
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		<u-tabbar :list="tabbarList" :mid-button="true" bg-color="#FFFFFF" active-color="#6696FF"
			inactive-color="#CCCCCC">
		</u-tabbar>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				tabbarList: this.$store.state.list,
				show:false,
				token:'',
				arr:[],
				showModal: true,
			}
		},
		onShow() {
			this.token = uni.getStorageSync('token')
			if (this.token) {
				this.getUserInfo()
				this.$Request.getT('/app/common/type/67').then(res => { //订单状态通知
					if (res.code == 0) {
						if (res.data && res.data.value) {
							this.arr.push(res.data.value)
						}
					}
				})
				// #ifdef MP-WEIXIN
				if (this.showModal) {
					this.openMsg()
				}
				// #endif
				// this.getRenzhengInfo()
			}
		},
		methods:{
			// 开启订阅消息
			openMsg() {
				console.log('订阅消息')
				var that = this
				uni.getSetting({
					withSubscriptions: true, //是否获取用户订阅消息的订阅状态，默认false不返回
					success(ret) {
						console.log(ret.subscriptionsSetting.itemSettings, '*************************************')
						// if (ret.subscriptionsSetting.itemSettings && Object.keys(ret.subscriptionsSetting.itemSettings).length == 2) {
						if (ret.subscriptionsSetting.itemSettings) {
							uni.setStorageSync('sendMsg', true)
							uni.openSetting({ // 打开设置页 
								success(rea) {
									console.log(rea.authSetting)
								}
							});
						} else { // 用户没有点击“总是保持以上，不再询问”则每次都会调起订阅消息
							uni.setStorageSync('sendMsg', false)
							uni.showModal({
								title: '提示',
								content: '为了更好的体验,请绑定消息推送',
								confirmText: '确定',
								cancelText: '取消',
								success: function(res) {
									if (res.confirm) {
										wx.requestSubscribeMessage({
											tmplIds: that.arr,
											success(re) {
												console.log(JSON.stringify(re),
													'++++++++++++++')
												var datas = JSON.stringify(re);
												if (datas.indexOf("accept") != -1) {
													console.log(re)
													// uni.setStorageSync('sendMsg', true)
												}
											},
											fail: (res) => {
												console.log(res)
											}
										})
										// uni.setStorageSync('sendMsg', true)
										console.log('确认')
										that.showModal = false
									} else if (res.cancel) {
										console.log('取消')
										// uni.setStorageSync('sendMsg', false)
										that.showModal = true
									}
								}
							})
						}
					}
				})
			},
			renzheng(type){
				if(type == 2){//企业认证
					uni.navigateTo({
						url:'/my/renzheng/index'
					})
				}else{ //个人认证
					uni.navigateTo({
						url:'/my/renzheng/user'
					})
				}
				this.show = false
			},
			//获取个人信息
			getUserInfo() {
				this.$Request.get("/app/user/selectUserById").then(res => {
					if (res.code == 0) {
						if (res.data) { // 有个人信息
							//(null:未认证；0:待审核:1审核通过；2:审核不通过）
							uni.setStorageSync('checkCertification',res.data.checkCertification)
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//获取认证信息
			getRenzhengInfo(){
				if(uni.getStorageSync('token')){
					this.$Request.postT('/app/userCertification/getMyCertification').then(res=>{
						if(res.code == 0){
							if(res.data){ //有认证信息
								uni.setStorageSync('userType',res.data.userType)
								if(uni.getStorageSync('checkCertification')==0){//审核中
									uni.showToast({
										title:'认证信息审核中',
										icon:'none'
									})
								}else if(uni.getStorageSync('checkCertification')==1){ //已通过,直接去发布
									// #ifdef MP-WEIXIN
									if (uni.getStorageSync('sendMsg')) {
										// console.log('授权+1')
										wx.requestSubscribeMessage({
											tmplIds: this.arr,
											success(re) {
												// console.log(JSON.stringify(re), 111111111111)
												var datas = JSON.stringify(re);
												if (datas.indexOf("accept") != -1) {
													// console.log(re)
												}
											},
											fail: (res) => {
												// console.log(res)
											}
										})
									}
									// #endif
									uni.navigateTo({
										url:'/my/fabu/fabu'
									})
								}else if(uni.getStorageSync('checkCertification')==2){
									uni.showModal({
										title:'实名认证审核拒绝',
										content:'拒绝原因:'+res.data.examineDetails,
										confirmText:'去修改',
										complete(ree) {
											if(ree.confirm){
												if(res.data.userType==1){ //个人认证
													uni.navigateTo({
														url:'/my/renzheng/user?isUpdate=true&checkCertification='+uni.getStorageSync('checkCertification')
													})
												}else{//企业认证
													uni.navigateTo({
														url:'/my/renzheng/index?isUpdate=true&checkCertification='+uni.getStorageSync('checkCertification')
													})
												}
											}
										}
									})
								}
								
							}else{ //没有认证信息
								this.show = true
							}
						}else{
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
						}
					})
				}else{
					this.noLogin()
				}
				
			},
			//去登录
			noLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			//发布求职信息
			goQiuzhi(){
				if(uni.getStorageSync('token')){
					this.$Request.postT('/app/userCertification/getMyCertification').then(res=>{
						if(res.code == 0){
							if(res.data){ //有认证信息
								uni.setStorageSync('userType',res.data.userType)
								if(uni.getStorageSync('checkCertification')==0){//审核中
									uni.showToast({
										title:'认证信息审核中',
										icon:'none'
									})
								}else if(uni.getStorageSync('checkCertification')==1){ //已通过,直接去发布
									// #ifdef MP-WEIXIN
									if (uni.getStorageSync('sendMsg')) {
										// console.log('授权+1')
										wx.requestSubscribeMessage({
											tmplIds: this.arr,
											success(re) {
												// console.log(JSON.stringify(re), 111111111111)
												var datas = JSON.stringify(re);
												if (datas.indexOf("accept") != -1) {
													// console.log(re)
												}
											},
											fail: (res) => {
												// console.log(res)
											}
										})
									}
									// #endif
									uni.navigateTo({
										url:'/my/fabu/qiuzhi'
									})
								}else if(uni.getStorageSync('checkCertification')==2){
									uni.showModal({
										title:'实名认证审核拒绝',
										content:'拒绝原因:'+res.data.examineDetails,
										confirmText:'去修改',
										complete(ree) {
											if(ree.confirm){
												if(res.data.userType==1){ //个人认证
													uni.navigateTo({
														url:'/my/renzheng/user?isUpdate=true&checkCertification='+uni.getStorageSync('checkCertification')
													})
												}else{//企业认证
													uni.navigateTo({
														url:'/my/renzheng/index?isUpdate=true&checkCertification='+uni.getStorageSync('checkCertification')
													})
												}
											}
										}
									})
								}
								
							}else{ //没有认证信息
								this.show = true
							}
						}else{
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
						}
					})
				}else{
					this.noLogin()
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.fabu{
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;
	}
	.bg{
		width: 100%;
		height: 100%;
		
	}
	.title{
		width: 100%;
		position: absolute;
		top: 500rpx;
		left: 0;
		.title-box{
			width: 686rpx;
			padding-left: 46rpx;
			.title-box-hi{
				color: #303C78;
				font-size: 28rpx;
			}
			.title-box-you{
				color: #303C78;
				font-size: 50rpx;
				font-weight: bold;
				margin-top: 10rpx;
			}
		}
	}
	.card{
		width: 100%;
		position: absolute;
		top: 730rpx;
		left: 0;
		.card-box{
			width: 686rpx;
			height: auto;
			.card-box-job{
				width: 100%;
				height: 220rpx;
				background-color: #F6F8FE;
				border-radius: 24rpx;
				margin-bottom: 24rpx;
			}
			.card-box-job-c{
				padding-left: 66rpx;
				image{
					width: 72rpx;
					height: 72rpx;
					margin-right: 37rpx;
				}
				.card-box-job-c-con-title{
					color: #333333;
					font-size: 40rpx;
					font-weight: bold;
				}
				.card-box-job-c-con-name{
					color: #999999;
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}
		}
	}
	.fabuPopup{
		width: 100%;
		padding: 50rpx 0 70rpx 0;
		background-color: #EAEEFD;
		.fabuPopup-card{
			width: 686rpx;
			height: 150rpx;
			margin-bottom: 20rpx;
			background-color: #ffffff;
			border-radius: 24rpx;
			padding-left: 40rpx;
			image{
				width: 58rpx;
				height: 58rpx;
			}
			.fabuPopup-card-con{
				margin-left: 50rpx;
				.fabuPopup-card-con-title{
					color: #333333;
					font-size: 32rpx;
					font-weight: bold;
				}
				.fabuPopup-card-con-txt{
					color: #999999;
					font-size: 24rpx;
					margin-top: 10rpx;
				}
			}
		}
	}


</style>