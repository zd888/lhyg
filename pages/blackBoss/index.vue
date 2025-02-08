<template>
	<view>
		<!-- 搜索 -->
		<!-- #ifdef H5 -->
		<u-sticky offset-top="-80" :enable='enable'>
		<!-- #endif -->
		<!-- #ifndef H5 -->
		<u-sticky :enable='enable'>
		<!-- #endif -->
			<view class="search flex align-center justify-center">
				<view class="search-box flex align-center">
					<!-- <u-icon name="search" style="margin:0 10rpx 0 20rpx;" color="#333333" size="34"></u-icon>
					<view class="search-box-name">
						
					</view> -->
					<u-search style="width: 100%;" @search='getBlackList()' @clear="getBlackList()" height="60" :show-action="false" bg-color="#F7F7F7" placeholder="输入手机号搜索黑老板" v-model="reportPhone"></u-search>
				</view>
			</view>
		</u-sticky>
		
		<!-- 数据列表 -->
		<view class="list flex align-center justify-center" v-for="(item,index) in list" :key="index">
			<view class="list-box">
				<view class="list-box-title flex align-center justify-between">
					<view class="list-box-title-l flex align-center">
						<text>
							{{(item.reportName).substring(0,1)}}**
						</text>
						<view style="margin-left: 20rpx;color: #ffffff;background-color: #FF4D50;border-radius: 8rpx;font-size: 24rpx;font-weight: 400;padding: 10rpx 20rpx;">
							{{item.reportType}}
						</view>
						
						
					</view>
					<view class="list-box-title-r">
						{{item.createTime}}
					</view>
				</view>
				<view class="list-box-content">
					{{item.reportReason}}
				</view>
				<view class="list-box-info flex align-center justify-between">
					<view class="list-box-info-l">
						{{item.reportProvince}} / {{item.reportCity}}
					</view>
					<view class="list-box-info-r">
						{{getNewPhone(item.reportPhone)}}
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="list-box-btn flex align-center justify-center">
					<button :id="item.reportId" class="shareBtn" open-type="share">
						<image src="../../static/image/my/fengB.png" mode=""></image>
						分享好友
					</button>
				</view>
				
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view @click.stop="shares(item.reportId)" class="list-box-btn flex align-center justify-center">
					<image src="../../static/image/my/fengB.png" mode=""></image>
					分享好友
				</view>
				<!-- #endif -->
				
			</view>
		</view>
		<u-loadmore v-if="list.length>0" :status="status" />
		<u-empty v-if="list.length == 0" style="position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%);"
			text="暂无数据" mode="list"></u-empty>
		<u-tabbar :list="tabbarList" :mid-button="true" bg-color="#FFFFFF" active-color="#6696FF"
			inactive-color="#CCCCCC">
		</u-tabbar>
		<u-popup :mask-close-able="false" :closeable="true" v-model="showShare" mode="center" width="686"
			border-radius="24">
			<view style="margin-top: 30rpx;" class="payTitle">查看</view>
			<view class="list-box" style="padding:30rpx;">
				<view class="list-box-title flex align-center justify-between">
					<view class="list-box-title-l flex align-center">
						<text>
							{{(shareInfo.reportName).substring(0,1)}}**
						</text>
						<view style="margin-left: 20rpx;color: #ffffff;background-color: #FF4D50;border-radius: 8rpx;font-size: 24rpx;font-weight: 400;padding: 10rpx 20rpx;">
							{{shareInfo.reportType}}
						</view>
						
						
					</view>
					<view class="list-box-title-r">
						{{shareInfo.createTime}}
					</view>
				</view>
				<view class="list-box-content">
					{{shareInfo.reportReason}}
				</view>
				<view class="list-box-info flex align-center justify-between">
					<view class="list-box-info-l">
						{{shareInfo.reportProvince}} / {{shareInfo.reportCity}}
					</view>
					<view class="list-box-info-r">
						{{getNewPhone(shareInfo.reportPhone)}}
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import config from '../../common/config.js'
	export default{
		data(){
			return{
				tabbarList: this.$store.state.list,
				enable:true,
				list:[],
				status: 'loadmore',
				reportPhone:'',
				page:1,
				pages:1,
				limit:10,
				reportId:'',
				tuiguang:'',
				bgImg:'',
				showShare:false,
				shareInfo:{
					reportName:'',
					reportPhone:'',
				},
			}
		},
		//分享
		onShareAppMessage(res) {
			return {
				path: '/pages/jobhunt/index?invitation=' + uni.getStorageSync(
					'invitationCode')+ '&reportId=' + this
				.reportId, //这是为了传参   onload(data){let id=data.id;} 
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
					'invitationCode')+ '&reportId=' + this
				.reportId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang,
				imageUrl: this.bgImg
			}
		},
		onLoad(e) {
			// #ifdef MP-WEIXIN
			if (e.scene) {
				const scene = decodeURIComponent(e.scene);
				this.$queue.setData('inviterCode', scene.split(',')[0]);
			}
			// #endif
			// 获取邀请码保存到本地
			if (e.invitation) {
				this.$queue.setData('inviterCode', e.invitation);
			}
			//获取分享卡片id
			if (e.reportId) {
				this.reportId = e.reportId
				this.getShareInfo()
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
		// 在对应的show和hide页面生命周期中打开或关闭监听
		onShow() {
			this.enable = true
			this.getBlackList()
			//处理app分享口令
			// #ifdef APP
			let that = this
			uni.getClipboardData({
				success(ret) {
					let str = 'reportId='
					if(ret.indexOf('reportId')!=-1){ //查到链接中带有分享的id
						//获取参数的开始位置
						let args = parseInt(ret.indexOf('reportId=')) + parseInt(str.length)
						let reportId = ret.substring(args)
						that.reportId = reportId
						that.getShareInfo()
					}
				},
				fail(err) {
				}
			})
			// #endif
		},
		onHide() {
			this.enable = false
		},
		onPullDownRefresh() {
			this.page = 1
			this.getBlackList()
		},
		onReachBottom() {
			if (this.page < this.pages) {
				this.page += 1
				this.status = 'loading'
				this.getBlackList()
			} else {
				this.status = 'nomore'
			}
		},
		//分享前的操作
		onShareAppMessage(res) {
			let reportId = ''
			if (res.from === 'button') { // 来自页面内分享按钮
				reportId = res.target.id  //设置分享id
			}
			//返回分享信息（分享打开的页面与参数、标题、图片）
			return {
				path: '/pages/blackBoss/index?invitation=' + uni.getStorageSync(
					'invitationCode') + '&reportId=' + reportId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang,
				imageUrl: this.bgImg
			}
		},
		methods:{
			//查看分享的卡片
			getShareInfo() {
				let data = {
					reportId: this.reportId,
				}
				this.$Request.getT('/app/reportBoss/getReportInfo', data).then(res => {
					if (res.code == 0) {
						this.shareInfo = res.data
						this.showShare = true
					}
				})
			},
			//h5/app分享
			shares(reportId) {
				let url = config.APIHOST2+'/pages/blackBoss/index?invitation='+uni.getStorageSync('invitationCode')+'&reportId='+reportId
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
			//设置手机号码中间变为*
			getNewPhone(phone){
				return phone.replace(phone.substring(3,7), "****")
			},
			//获取数据
			getBlackList(){
				let data = {
					page:this.page,
					limit:this.limit,
					reportPhone:this.reportPhone,
					examineStatus:1
				}
				this.$Request.get('/app/reportBoss/getReportBossList',data).then(res=>{
					uni.stopPullDownRefresh()
					if(res.code == 0){
						this.pages = res.data.pages
						if (this.page < this.pages) {
							this.status = 'loadmore'
						} else {
							this.status = 'nomore'
						}
						if(this.page == 1){
							this.list = res.data.records
						}else{
							this.list = [...this.list,...res.data.records]
						}
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
	.payTitle {
		font-weight: bold;
		width: 100%;
		text-align: center;
		margin-top: 50rpx;
	}
	.search{
		width: 100%;
		background: linear-gradient(to bottom, #C4D5FA 0%, #F2F2F7 100%);
		padding: 30rpx 0 40rpx 0;
		.search-box{
			width: 686rpx;
			height: 60rpx;
			background-color: #F7F7F7;
			border-radius: 8rpx;
		}
		.search-box-name{
			color: #CCCCCC;
			font-size: 24rpx;
		}
	}
	.list{
		width: 100%;
		height: auto;
		margin-bottom: 20rpx;
		
	}
	.list-box{
		width: 686rpx;
		height: 100%;
		background-color: #FFFFFF;
		border-radius: 24rpx;
		padding: 30rpx 0 0 0;
	}
	.list-box-title{
		padding: 0 30rpx;
	}
	.list-box-title-l{
		color: #333333;
		font-size: 34rpx;
		font-weight: bold;
	}
	.list-box-title-r{
		color: #666666;
		font-size: 24rpx;
	}
	.list-box-content{
		width: calc(100% - 60rpx);
		height: auto;
		margin: 0 auto;
		background-color: #F6F6F6;
		border-radius: 12rpx;
		margin-top: 24rpx;
		padding: 30rpx 20rpx;
		color: #666666;
		font-size: 24rpx;
	}
	.list-box-info{
		width: 100%;
		padding: 0 30rpx;
		margin-top: 30rpx;
		.list-box-info-l{
			color: #333333;
			font-size: 26rpx;
		}
		.list-box-info-r{
			color: #333333;
			font-size: 28rpx;
		}
	}
	.list-box-btn{
		margin-top: 20rpx;
		width: 100%;
		height: 80rpx;
		color: #4498FF;
		font-size: 26rpx;
		image{
			width: 46rpx;
			height: 46rpx;
			margin-right: 20rpx;
		}
		background: #D4E7FF;
		border-radius: 0rpx 0rpx 24rpx 24rpx;
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
			background-color: #D4E7FF;
			color: #4498FF;
			border-radius: 0 0 24rpx 24rpx;
		}
	}
</style>