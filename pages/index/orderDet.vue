<template>
	<view>
		<view class="box margin-top-sm margin-lr ">
			<view class="flex align-center">
				<image :src="info.avatar?info.avatar:'../../static/logo.png'" style="width: 100rpx;height: 100rpx;border-radius: 50%;"></image>
				<view class="margin-left-xs " style="width: 85%;">
					<view class="flex align-center justify-between">
						<view style="font-size: 32rpx;font-weight: 500;">{{info.realName}}</view>
						<view>{{info.province}} / {{info.city}}</view>
					</view>
					<view class=" flex align-center" style="margin-top:6rpx">
						<view v-if="info.isTop == 1" class="label-item" style="background-color: #FF4D50;">
							置顶
						</view>
						<view class="label-item" style="background-color: #4498FF;">
							{{info.ruleClassifyName}}
						</view>
					</view>

				</view>
			</view>
			<view style="color: #666666;">
				{{info.content}}
			</view>
		</view>

		<view class="box margin-top-sm margin-lr ">
			<view class="flex align-center justify-between">
				<view class="titname">期望薪资</view>
				<view>¥{{info.hopeSalary}}</view>
			</view>
			<view class="flex align-center justify-between margin-top">
				<view class="titname">工作类型</view>
				<view>{{info.workType}}</view>
			</view>
			<view class="flex align-center justify-between margin-top">
				<view class="titname">年龄</view>
				<view>{{info.age}}</view>
			</view>
			<view class="flex align-center justify-between margin-top">
				<view class="titname">是否兼职</view>
				<view v-if="info.isConcurrent">是</view>
				<view v-else>是</view>
			</view>
		</view>

		<view class="flex align-center justify-between margin">
			<view class="boxleft">
				<!-- 微信分享 -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="list-box-btn-l flex align-center justify-center">
					<button :id="postPushId" class="shareBtn" open-type="share">
						<image style="width: 46rpx;height: 46rpx;margin-right: 20rpx;"
							src="/static/image/index/fen.png" mode=""></image>
						分享好友
					</button>
				</view>
				<!-- #endif -->
				<!-- h5/app分享 -->
				<!-- #ifndef MP-WEIXIN -->
				<view @click.stop="shares()" class="list-box-btn-l flex align-center justify-center">
					<image style="width: 46rpx;height: 46rpx;margin-right: 20rpx;"
						src="/static/image/index/fen.png" mode=""></image>
					分享好友
				</view>
				<!-- #endif -->
			</view>
			<view class="boxright"  @click="callPhone()">
				<view class="flex align-center">
					<image style="width: 46rpx;height: 46rpx;margin-right: 20rpx;" src="/static/image/index/phone.png"
						mode=""></image>
					电话联系
				</view>
			</view>
		</view>
		<!-- 支付弹窗 -->
		<u-popup v-model="showPay" mode="bottom" border-radius="24">
			<view class="payTitle">提示</view>
			<view class="payContent">获取电话需要：{{payMoney}}积分</view>
			<view class="payBtn flex align-center justify-center">
				<view @click="showPay = false" class="payBtn-l flex align-center justify-center">
					取消
				</view>
				<view @click="selectPayCallPhone()" class="payBtn-r flex align-center justify-center">
					查看
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import config from '../../common/config.js'
	export default {
		data() {
			return {
				payMoney:0,
				showPay:false,
				postPushId:'',
				info:{
					avatar:'',
					realName:'',
					isTop:'',
					ruleClassifyName:'',
					content:'',
					province:'',
					city:'',
					age:'',
					hopeSalary:'',
					workType:'',
					isConcurrent:''
				},
				isBuy:0,
				bgImg:'',
				tuiguang:'',
				byUserId:'',
			}
		},
		//分享
		onShareAppMessage(res) {
			return {
				path: '/pages/jobhunt/index?invitation=' + uni.getStorageSync(
					'invitationCode') + '&sharePostPushId=' + this
				.postPushId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang,
				imageUrl: this.bgImg
			}
		},
		/*
		 * uniapp微信小程序分享页面到微信朋友圈
		 */
		onShareTimeline(res) {
			return {
				path: '/pages/jobhunt/index?invitation=' + uni.getStorageSync(
					'invitationCode') + '&sharePostPushId=' + this
				.postPushId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang,
				imageUrl: this.bgImg
			}
		},
		onLoad(option) {
			if(option.postPushId){
				this.postPushId = option.postPushId
				this.getInfo()
			}
			this.$Request.getT('/app/common/type/255').then(res => {
				if (res.code === 0) {
					if (res.data && res.data.value) {
						this.tuiguang = res.data.value;
					}
				}
			});
			this.$Request.getT('/app/banner/selectBannerList?state=-1&classify=5').then(res => {
				if (res.code === 0) {
					this.bgImg = res.data[0].imageUrl;
				}
			});
		},
		//分享前的操作
		onShareAppMessage(res) {
			let sharePostPushId = ''
			if (res.from === 'button') { // 来自页面内分享按钮
				sharePostPushId = res.target.id  //设置分享id
			}
			//返回分享信息（分享打开的页面与参数、标题、图片）
			return {
				path: '/pages/jobhunt/index?invitation=' + uni.getStorageSync(
					'invitationCode') + '&sharePostPushId=' + sharePostPushId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang,
				imageUrl: this.bgImg
			}
		},
		methods:{
			//h5/app分享
			shares() {
				let url = config.APIHOST2+'/pages/index/index?invitation='+uni.getStorageSync('invitationCode')+'&sharePostPushId='+this.postPushId
				uni.setClipboardData({
					data:url,
					success() {
						uni.showToast({
							title:'分享链接已复制'
						})
					},
					fail() {
						uni.showToast({
							title:'分享失败，请重试',
							icon:'none'
						})
					}
				})
			},
			//支付并查看
			selectPayCallPhone(){
				let data = {
					postPushId:this.postPushId
				}
				this.$Request.postT('/app/userGetPhoneRecord/buyPhone',data).then(res=>{
					if(res.code == 0){
						this.showPay = false
						this.getInfo()
						let that = this
						uni.showModal({
							title:'提示',
							content:'支付成功，是否立即电话联系？',
							confirmText:'立即联系',
							complete(ree) {
								if(ree.confirm){
									setTimeout(()=>{
										that.$Request.getT('/app/userGetPhoneRecord/getPostPushPhone', data).then(ret => {
											if (ret.code == 0) {
												uni.makePhoneCall({
													phoneNumber:ret.data
												})
											} else {
												uni.showToast({
													title: ret.msg,
													icon: 'none'
												})
											}
										})
									},1000)
								}
							}
						})
						
					}else if(res.code == 10001){
						this.showPay = false
						uni.showModal({
							title:'提示',
							content:'积分不足，是否充值积分？',
							cancelText:'取消',
							confirmText:'去充值',
							complete(ret) {
								if(ret.confirm){
									uni.navigateTo({
										url:'/my/wallet/wallet'
									})
								}
							}
						})
					} else if(res.code == 10007){
						this.showPay = false
						uni.showModal({
							title:'提示',
							content:'请先进行实名认证',
							cancelText:'取消',
							confirmText:'去认证',
							complete(ret) {
								if(ret.confirm){
									uni.navigateTo({
										url:'/my/renzheng/index'
									})
								}
							}
						})
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			//电话联系
			callPhone() {
				if (uni.getStorageSync('token')) {
					let data = {
						postPushId: this.postPushId
					}
					let userId = uni.getStorageSync('userId')
					if(this.byUserId==userId){ //我自己发布的直接拨打
						uni.makePhoneCall({
							phoneNumber: this.info.phone
						})
					}else{
						if (this.isBuy == 1) { //购买过了
							//直接拉起电话
							this.$Request.getT('/app/userGetPhoneRecord/getPostPushPhone', data).then(res => {
								if (res.code == 0) {
									uni.makePhoneCall({
										phoneNumber:res.data
									})
								} else {
									uni.showToast({
										title: res.msg,
										icon: 'none'
									})
								}
							})
						} else { //未购买
							//先购买
							this.payMoney = uni.getStorageSync('payMoney')
							this.showPay = true
						}
					}
					
				} else {
					this.noLogin()
				}
			},
			//获取求职详情
			getInfo(){
				let data = {
					postPushId:this.postPushId,
					loginUserId:uni.getStorageSync('userId')
				}
				this.$Request.getT('/app/postPush/selectPostPushDetails',data).then(res=>{
					if(res.code == 0){
						this.info = {
							avatar:res.data.avatar,
							realName:res.data.realName,
							isTop:res.data.isTop,
							ruleClassifyName:res.data.ruleClassifyName,
							content:res.data.content,
							province:res.data.province,
							city:res.data.city,
							age:res.data.age,
							hopeSalary:res.data.hopeSalary,
							workType:res.data.workType,
							isConcurrent:res.data.isConcurrent,
							phone:res.data.phone
						}
						this.byUserId = res.data.userId
						this.isBuy = res.data.isBuy
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F7;
	}
	.shareBtn:after {
		border: none !important;
	}
	
	.shareBtn {
		display: inline-block;
		width: 100%;
		height: 100%;
		display: flex;
		font-size: 26rpx;
		align-items: center;
		justify-content: center;
		background-color: #FFFFFF;
		border-color: #FFFFFF;
	}
	.payTitle{
		font-weight: bold;
		width: 100%;
		text-align: center;
		margin-top: 50rpx;
	}
	.payContent{
		margin-top: 50rpx;
		width: 100%;
		padding: 0 20rpx;
		text-align: center;
	}
	.payBtn{
		margin-top: 100rpx;
		margin-bottom: 50rpx;
		.payBtn-l{
			width: 180rpx;
			height: 80rpx;
			background-color: #73c140;
			border-radius: 40rpx;
			color: #ffffff;
		}
		.payBtn-r{
			width: 180rpx;
			height: 80rpx;
			background-color: #5898f7;
			border-radius: 40rpx;
			color: #ffffff;
			margin-left: 100rpx;
		}
	}
	.box {
		background: #FFFFFF;
		border-radius: 24rpx;
		padding: 30rpx;
	}

	.label-item {
		color: #FFFFFF;
		font-size: 24rpx;
		padding: 4rpx 10rpx;
		border-radius: 8rpx;
		margin-right: 10rpx;
	}

	.titname {
		font-size: 30rpx;
		font-family: PingFang SC;
		font-weight: 500;
		color: #333333;
	}

	.boxleft {
		width: 333rpx;
		height: 100rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.boxright {
		width: 333rpx;
		height: 100rpx;
		background: #FFFFFF;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>