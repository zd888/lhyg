<template>
	<view>
		<!-- 上方信息 -->
		<view class="info flex align-center justify-center">
			<view class="info-box">
				<!-- 头像信息 -->
				<view v-if="token" class="info-box-info flex align-center justify-between">
					<view @click="goNav('/pages/my/userinfo')" class="info-box-info-l flex align-center">
						<image :src="avatar?avatar:'../../static/logo.png'" mode=""></image>
						<view class="info-box-info-l-i">
							<view class="info-box-info-l-i-name">
								{{userName}}
							</view>
							<view class="info-box-info-l-i-phone">
								{{getNewPhone(phone)}}
							</view>
						</view>
					</view>
					<view class="info-box-info-r" v-if="userType && isShowType" @click="goNavRz()">
						实名认证
					</view>
				</view>
				<view v-else class="info-box-info flex align-center justify-between">
					<view class="info-box-info-l flex align-center" @click="noLogin()">
						<image src="../../static/logo.png" mode=""></image>
						<view class="info-box-info-l-i">
							<view class="info-box-info-l-i-name">
								登录
							</view>
						</view>
					</view>
				</view>
				<!-- 积分信息 -->
				<view v-if="XCXIsSelect=='是'" class="info-box-integral flex align-center justify-between" @click="goNav('/my/wallet/wallet')">
					<view class="info-box-integral-l">
						<view class="info-box-integral-l-name">
							个人积分
						</view>
						<view class="info-box-integral-l-num">
							{{money}}
						</view>
					</view>
					<view class="info-box-integral-r">
						获取积分
					</view>
				</view>
				<!-- 我的招聘 -->
				<view v-if="XCXIsSelect=='是'" class="info-box-job" @click="goNav('/my/order/order')">
					<view class="info-box-job-title flex justify-between align-center">
						我的招聘
						<u-icon name="arrow-right" color="#272727" size="28"></u-icon>
					</view>
					<view class="info-box-job-icon flex align-center justify-between">
						<view class="info-box-job-icon-item flex align-center justify-center flex-wrap">
							<image src="/static/image/my/daishenhe.png" mode=""></image>
							<view class="info-box-job-icon-item-name">
								待审核
							</view>
						</view>
						<view class="info-box-job-icon-item flex align-center justify-center flex-wrap">
							<image src="/static/image/my/jinxinzhong.png" mode=""></image>
							<view class="info-box-job-icon-item-name">
								进行中
							</view>
						</view>
						<view class="info-box-job-icon-item flex align-center justify-center flex-wrap">
							<image src="/static/image/my/success.png" mode=""></image>
							<view class="info-box-job-icon-item-name">
								已找到
							</view>
						</view>
						<view class="info-box-job-icon-item flex align-center justify-center flex-wrap">
							<image src="/static/image/my/error.png" mode=""></image>
							<view class="info-box-job-icon-item-name">
								已拒绝
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 推荐工具 -->
		<view  v-if="XCXIsSelect=='是'" class="util flex align-center justify-center">
			<view class="util-box">
				<view class="util-box-title">
					推荐工具
				</view>
				<view class="util-box-content flex align-center justify-between flex-wrap">
					<view v-if="item.isShow" @click="goNav(item.url)"
						class="util-box-content-item flex align-center flex-wrap justify-center"
						v-for="(item,index) in tabList" :key="index">
						<image :src="item.img" mode=""></image>
						<view v-if="messageCount &&  Number(messageCount) > 0 && index==1" class="util-box-content-item-tag">
							{{Number(messageCount)>99?'99+':messageCount}}
							
						</view>
						<view class="util-box-content-item-name">
							{{item.name}}
						</view>
					</view>
					<view
						class="util-box-content-item" style="height: 0;">
					</view>
					<view
						class="util-box-content-item" style="height: 0;">
					</view>
				</view>
			</view>
		</view>
		<u-tabbar :list="tabbarList" :mid-button="true" bg-color="#FFFFFF" active-color="#6696FF"
			inactive-color="#CCCCCC">
		</u-tabbar>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabbarList: this.$store.state.list,
				tabList: [{
						img: '/static/image/my/kefu.png',
						name: '客服中心',
						url: 'kefu',
						isShow:true
					},
					{
						img: '/static/image/my/message.png',
						name: '消息中心',
						url: '/my/message/message',
						isShow:true,
					},
					// {
					// 	img: '/static/image/my/fenxiao.png',
					// 	name: '我的分销',
					// 	url: '',
					// },
					{
						img: '/static/image/my/tuandui.png',
						name: '我的团队',
						url: '/my/team/team',
						isShow:false
					},
					{
						img: '/static/image/my/fenxiang.png',
						name: '分享好友',
						url: '/pages/my/invitationUser',
						isShow:true
					},
					{
						img: '/static/image/my/jubao.png',
						name: '举报黑老板',
						url: '/my/report/report',
						isShow:true
					},
					{
						img: '/static/image/my/bangzhu.png',
						name: '帮助中心',
						url: '/my/seting/feedbackIndex',
						isShow:true
					},
					{
						img: '/static/image/my/yijian.png',
						name: '意见反馈',
						url: '/my/seting/index',
						isShow:true
					},
					{
						img: '/static/image/my/seeting.png',
						name: '设置中心',
						url: '/my/seting/seting',
						isShow:true
					}
				],
				token: '', //用户认证token
				avatar: '', //头像
				userName: '', //昵称
				phone: '', //手机号
				isRenzheng: false,
				checkCertification: '',
				isShowType:false,
				userType: null, //null:未认证，1:个人认证 2:企业认证
				money:0,//我的积分
				zhiRate:0,//分成比例
				XCXIsSelect:'是',
				arr:[],
				showModal: true,
				messageCount:0,
			}
		},
		onLoad() {
			this.token = uni.getStorageSync('token')
		},
		onShow() {
			
			// #ifdef MP-WEIXIN
			this.XCXIsSelect = uni.getStorageSync('XCXIsSelect')
			// #endif
			
			this.token = uni.getStorageSync('token')
			if (this.token) {
				this.messageCount = uni.getStorageSync('messageCount')
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
				this.getUserInfo()
				this.getRenzhengInfo()
			}else{
				this.money = 0
			}
			
		},
		methods: {
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
			// 在线客服
			goChat(){
				let that = this
				// #ifdef MP-WEIXIN
				wx.openCustomerServiceChat({
					extInfo: {
						url: that.$queue.getData('kefuq')
					},
					corpId: that.$queue.getData('kefuAppidq'),
					success(res) {
						console.log(res)
					},
				})
				// #endif
				// #ifdef H5
				window.location.href = that.$queue.getData('kefuq');
				// #endif
				// #ifdef APP
				let kefu = that.$queue.getData('kefuq')
				console.log(kefu)
				plus.runtime.openURL(kefu, function(res) {});
				// #endif
			},
			//获取认证信息
			getRenzhengInfo() {
				this.$Request.postT('/app/userCertification/getMyCertification').then(res => {
					if (res.code == 0) {
						if(Number(res.data.userType)){
							uni.setStorageSync('userType', res.data.userType)
							this.userType = Number(res.data.userType)
							this.isShowType = true
						}else{
							this.isShowType = false
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			goNavRz() {
				if (uni.getStorageSync('token')) {
					console.log(uni.getStorageSync('checkCertification'))
					if (uni.getStorageSync('checkCertification') != null) { //有认证
						if (uni.getStorageSync('userType') == 1) { //个人认证
							uni.navigateTo({
								url: '/my/renzheng/user?isUpdate=true&checkCertification=' + uni.getStorageSync(
									'checkCertification')
							})
						} else { //企业认证
							uni.navigateTo({
								url: '/my/renzheng/index?isUpdate=true&checkCertification=' + uni.getStorageSync(
									'checkCertification')
							})
						}

					}
				} else {
					this.noLogin()
				}
			},
			//设置手机号码中间变为*
			getNewPhone(phone) {
				return phone.replace(phone.substring(3, 7), "****")
			},
			/**
			 * 我的钻石
			 */
			getMyMoney() {
				this.$Request.get("/app/userMoney/selectMyMoney").then(res => {
					if (res.code == 0) {
						this.money = res.data.money
					}
				})
			},
			//获取个人信息
			getUserInfo() {
				this.$Request.get("/app/user/selectUserById").then(res => {
					if (res.code == 0) {
						if (res.data) { // 有个人信息
							this.avatar = res.data.avatar //头像
							this.userName = res.data.userName //昵称
							this.phone = res.data.phone //手机号
							//(null:未认证；0:待审核:1审核通过；2:审核不通过）
							uni.setStorageSync('checkCertification', res.data.checkCertification)
							this.checkCertification = res.data.checkCertification
							if(res.data.zhiRate && res.data.zhiRate>0){
								this.tabList[2].isShow = true
								this.zhiRate = res.data.zhiRate
								uni.setStorageSync('zhiRate',res.data.zhiRate)
							}else{
								this.zhiRate = 0
								this.tabList[2].isShow = false
								uni.setStorageSync('zhiRate',0)
							}
							this.getMyMoney()
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//去登录
			noLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			//跳转
			goNav(url) {
				if (uni.getStorageSync('token')) {
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
					if(url=='kefu'){
						this.goChat()
					}else{
						uni.navigateTo({
							url: url
						})
					}
				} else {
					this.noLogin()
				}

			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F2F7;
	}

	.info {
		width: 100%;
		height: auto;
		background: linear-gradient(to bottom, #C4D5FA 0%, #F2F2F7 100%);
		padding-top: 30rpx;

		.info-box {
			width: 686rpx;
			height: 100%;
		}

		.info-box-info {
			width: 100%;
			height: 90rpx;
		}

		.info-box-info-l {
			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.info-box-info-l-i-name {
				color: #1D1D1D;
				font-size: 32rpx;
				font-weight: bold;
			}

			.info-box-info-l-i-phone {
				font-size: 24rpx;
				color: #1D1D1D;
				margin-top: 8rpx;
			}
		}

		.info-box-info-r {
			background-color: #FFFFFF;
			border-radius: 28rpx;
			padding: 15rpx 15rpx;
			color: #3975F9;
			font-size: 24rpx;

		}

		.info-box-integral {
			width: 100%;
			height: 136rpx;
			background-color: #131E4A;
			border-radius: 24rpx 24rpx 0px 0px;
			margin-top: 32rpx;
			padding: 0 30rpx;

			.info-box-integral-l-name {
				color: #FFF8ED;
				font-size: 28rpx;
			}

			.info-box-integral-l-num {
				color: #FFFFFF;
				font-size: 38rpx;
				font-weight: bold;
				margin-top: 10rpx;
			}

			.info-box-integral-r {
				padding: 20rpx;
				border-radius: 40rpx;
				background: linear-gradient(130deg, #F8E9CC 0%, #FFC880 100%);
				color: #8A4C0B;
				font-size: 28rpx;
				font-weight: bold;
			}
		}

		.info-box-job {
			width: 100%;
			height: auto;
			padding: 36rpx 30rpx;
			background: #FFFFFF;
			border-radius: 16rpx;
			margin-top: 30rpx;

			.info-box-job-title {
				color: #272727;
				font-size: 28rpx;
				font-weight: bold;
			}

			.info-box-job-icon {
				margin-top: 30rpx;
			}

			.info-box-job-icon-item {
				width: 80rpx;

				image {
					width: 52rpx;
					height: 52rpx;
				}
			}

			.info-box-job-icon-item-name {
				color: #000000;
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}

	}

	.util {
		width: 100%;
		height: auto;
		margin-top: 20rpx;

		.util-box {
			width: 686rpx;
			height: 100%;
			border-radius: 24rpx;
			background-color: #FFFFFF;
			padding: 40rpx 30rpx;
		}

		.util-box-title {
			width: 100%;
			color: #333333;
			font-size: 32rpx;
			font-weight: bold;
		}

		.util-box-content {
			width: 100%;
			.util-box-content-item {
				width: 130rpx;
				margin-top: 70rpx;
				position: relative;
				.util-box-content-item-tag{
					position: absolute;
					right: 0;
					top: 0;
					background-color: red;
					color: #FFFFFF;
					border-radius: 24rpx;
					padding: 2rpx 6rpx;
					font-size: 24rpx;
				}
				image {
					width: 48rpx;
					height: 48rpx;
				}
			}

			.util-box-content-item-name {
				color: #333333;
				font-size: 24rpx;
				margin-top: 20rpx;
			}
		}
	}
</style>