<template>
	<view>
		<!-- 搜索 -->
		<view class="search flex justify-center align-center">
			<view class="search-box flex align-center justify-between">
				<view class="search-box-city flex align-center" @click="selectCity">
					{{city}}
					<u-icon name="arrow-down-fill" style="margin-left: 10rpx;" color="#333333" size="20"></u-icon>
				</view>
				<view class="search-box-name flex align-center" @click="gosearch()">
					<u-icon name="search" style="margin:0 10rpx 0 20rpx;" color="#333333" size="34"></u-icon>
					<view class="search-box-name-names">
						请输入求职信息
					</view>
				</view>
			</view>
		</view>
		<!-- 轮播图 -->
		<view v-if="swiperList.length>0" class="swipers flex justify-center align-center">
			<view class="swipers-box">
				<swiper :indicator-dots="false" :circular="true" class="swipers-box-swiper" :autoplay="true"
					:interval="3000" :duration="500">
					<swiper-item class="swipers-box-swiper-item" v-for="(item,index) in swiperList" :key="index">
						<image class="swipers-box-swiper-item" :src="item.imageUrl" mode=""></image>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 筛选 -->
		<!-- #ifdef H5 -->
		<u-sticky offset-top="-80" :enable="enable" @fixed="isTop = true" @unfixed="isTop = false"
			:bg-color="isTop?'#C4D5FA':'#F2F2F7'">
			<!-- #endif -->
			<!-- #ifndef H5 -->
			<u-sticky :enable="enable" @fixed="isTop = true" @unfixed="isTop = false"
				:bg-color="isTop?'#C4D5FA':'#F2F2F7'">
				<!-- #endif -->
				<view class="dropDown" :class="isTop?'active':''">
					<u-dropdown ref="uDropdown" menuIcon="arrow-down-fill">
						<u-dropdown-item v-model="value1" :title="title1">
							<view class="jixing">
								<scroll-view scroll-y="true"
									style="width: 100%;height: 100%;background-color: #ffffff;">
									<view class="jixing-item" v-for="(item,index) in classifyList" :key="index">
										<view class="jixing-item-title" v-if="item.ruleClassifyName">
											{{item.ruleClassifyName}}
										</view>
										<view class="jixing-item-select flex align-center justify-between flex-wrap">
											<view @click="selectClassiftyCurr(index,ind)"
												:class="selectCurrent==index && selectCurrents ==ind?'selectActive':''"
												class="jixing-item-select-i flex align-center justify-center"
												v-for="(ite,ind) in item.childrens" :key="ind">
												{{ite.ruleClassifyName}}
											</view>
											<view class="jixing-item-select-i" style="height: 0;border: none;"></view>
											<view class="jixing-item-select-i" style="height: 0;border: none;"></view>
										</view>
									</view>
								</scroll-view>
							</view>
						</u-dropdown-item>
						<u-dropdown-item @change="workTypeChange" v-model="value2" :title="title2"
							:options="options2"></u-dropdown-item>
						<!-- <u-dropdown-item v-model="value3" :title="title3" :options="options3"></u-dropdown-item> -->
					</u-dropdown>
				</view>
			</u-sticky>

			<!-- 列表数据 -->
			<view class="list flex align-center justify-center" v-for="(item,index) in list" :key="index">
				<view class="list-box">
					<view @click="goDetal(item.postPushId)" class="list-box-title flex justify-between">
						<view class="list-box-title-l flex align-center">
							<image :src="item.avatar?item.avatar:'../../static/logo.png'" mode=""></image>
							<view class="list-box-title-l-info">
								<view class="list-box-title-l-info-name">
									{{item.realName}}
								</view>
								<view class="list-box-title-l-info-name-label flex align-center">
									<view v-if="item.isTop == 1" class="list-box-title-l-info-name-label-item"
										style="background-color: #FF4D50;">
										置顶
									</view>
									<view class="list-box-title-l-info-name-label-item"
										style="background-color: #4498FF;">
										{{item.ruleClassifyName}}
									</view>
								</view>
							</view>
						</view>
						<view class="list-box-title-r">
							{{item.province}} / {{item.city}}
						</view>
					</view>
					<view @click="goDetal(item.postPushId)" class="list-box-content">
						{{item.content}}
					</view>
					<view class="list-box-line"></view>
					<view class="list-box-btn flex align-center justify-between">
						<!-- 微信分享 -->
						<!-- #ifdef MP-WEIXIN -->
						<view class="list-box-btn-l flex align-center justify-center">
							<button :id="item.postPushId" class="shareBtn" open-type="share">
								<image style="width: 46rpx;height: 46rpx;margin-right: 20rpx;"
									src="/static/image/index/fen.png" mode=""></image>
								分享好友
							</button>
						</view>
						<!-- #endif -->
						<!-- h5/app分享 -->
						<!-- #ifndef MP-WEIXIN -->
						<view @click.stop="shares(item.postPushId)"
							class="list-box-btn-l flex align-center justify-center">
							<image style="width: 46rpx;height: 46rpx;margin-right: 20rpx;"
								src="/static/image/index/fen.png" mode=""></image>
							分享好友
						</view>
						<!-- #endif -->
						<view @click.stop="callPhone(item.isBuy,item.postPushId,item.userId,item.phone)"
							class="list-box-btn-r flex align-center justify-center">
							<image style="width: 46rpx;height: 46rpx;margin-right: 20rpx;"
								src="/static/image/index/phone.png" mode=""></image>
							电话联系
						</view>
					</view>
				</view>
			</view>
			<u-empty v-if="list.length == 0" style="position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%);"
				text="暂无求职信息" mode="list"></u-empty>
			<u-loadmore v-if="list.length != 0" :status="status" />
			<u-tabbar :list="tabbarList" :mid-button="true" bg-color="#FFFFFF" active-color="#6696FF"
				inactive-color="#CCCCCC">
			</u-tabbar>
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
			<u-popup :mask-close-able="false" :closeable="true" v-model="showShare" mode="center" width="686"
				border-radius="24">
				<view style="margin-top: 30rpx;" class="payTitle">查看</view>
				<view class="list-box">
					<view class="list-box-title flex justify-between">
						<view class="list-box-title-l flex align-center">
							<image :src="shareInfo.avatar?shareInfo.avatar:'../../static/logo.png'" mode=""></image>
							<view class="list-box-title-l-info">
								<view class="list-box-title-l-info-name">
									{{shareInfo.realName}}
								</view>
								<view class="list-box-title-l-info-name-label flex align-center">
									<view v-if="shareInfo.isTop == 1" class="list-box-title-l-info-name-label-item"
										style="background-color: #FF4D50;">
										置顶
									</view>
									<view class="list-box-title-l-info-name-label-item"
										style="background-color: #4498FF;">
										{{shareInfo.ruleClassifyName}}
									</view>
								</view>
							</view>
						</view>
						<view class="list-box-title-r">
							{{shareInfo.province}} / {{shareInfo.city}}
						</view>
					</view>
					<view class="list-box-content">
						{{shareInfo.content}}
					</view>
					<view class="list-box-line"></view>
					<view class="list-box-btn flex align-center justify-between">
						<view
							@click.stop="callPhone(shareInfo.isBuy,shareInfo.postPushId,shareInfo.userId,shareInfo.phone)"
							style="width: 100%;" class="list-box-btn-r flex align-center justify-center">
							<image style="width: 46rpx;height: 46rpx;margin-right: 20rpx;"
								src="/static/image/index/phone.png" mode=""></image>
							电话联系
						</view>
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
				showShare: false,
				tabbarList: this.$store.state.list,
				payMoney: '',
				showPay: false,
				title1: '全部机型',
				title2: '工作类型',
				title3: '工作筛选',
				enable: true,
				status: 'loadmore',
				isTop: false, //筛选框是否触顶
				city: '', //城市名称
				swiperList: [],
				value1: '',
				value2: '',
				options2: [],
				value3: '',
				options3: [{
					label: '全部工作',
					value: 1,
				}, {
					label: '全部工作',
					value: 2,
				}, {
					label: '全部工作',
					value: 3,
				}, ],
				list: [],
				page: 1,
				pages: 1,
				limit: 10,
				postPushId: '',
				classifyList: [], //全部机型列表
				selectCurrent: 0, //机型筛选外层下标
				selectCurrents: 0, //机型筛选内层下标
				sharePostPushId: '',
				shareInfo: {},
				arr:[],
				showModal: true,
			}
		},
		//分享
		onShareAppMessage(res) {
			return {
				path: '/pages/jobhunt/index?invitation=' + uni.getStorageSync(
						'invitationCode') + '&sharePostPushId=' + this
					.sharePostPushId, //这是为了传参   onload(data){let id=data.id;} 
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
					.sharePostPushId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang,
				imageUrl: this.bgImg
			}
		},
		onLoad(e) {
			if(uni.getStorageSync('city')){
				this.city = uni.getStorageSync('city')
			}
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
			if (e.sharePostPushId) {
				this.sharePostPushId = e.sharePostPushId
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
			if (!this.city || this.city == '') {
				this.getLatOrLng()
			} else {
				this.getClassifyList()
			}

			this.getBannerList()
			this.getWorkType()

		},
		// 在对应的show和hide页面生命周期中打开或关闭监听
		onShow() {
			let that = this
			//获取电话需要的积分
			this.$Request.get('/app/common/type/342').then(res => {
				if (res.code == 0) {
					this.$queue.setData('payMoney', res.data.value);
				}
			});
			this.enable = true
			uni.$on('city', data => {
				that.city = data.city
				uni.setStorageSync('city',that.city)
			})
			if(uni.getStorageSync('city')){
				this.city = uni.getStorageSync('city')
			}
			if (this.classifyList.length > 0) {
				this.getDataList()
			}
			//处理app分享口令
			// #ifdef APP
			uni.getClipboardData({
				success(ret) {
					let str = 'sharePostPushId='
					if (ret.indexOf('sharePostPushId') != -1) { //查到链接中带有分享的id
						//获取参数的开始位置
						let args = parseInt(ret.indexOf('sharePostPushId=')) + parseInt(str.length)
						let sharePostPushId = ret.substring(args)
						that.sharePostPushId = sharePostPushId
						that.getShareInfo()
					}
				},
				fail(err) {}
			})
			// #endif
			if(uni.getStorageSync('token')){
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
			}
		},
		onHide() {
			this.enable = false
		},
		onPullDownRefresh() {
			this.page = 1
			this.getDataList()
		},
		//上拉加载更多
		onReachBottom() {
			if (this.page < this.pages) {
				this.page += 1
				this.status = 'loading'
				this.getDataList()
			} else {
				this.status = 'nomore'
			}
		},
		//分享前的操作
		onShareAppMessage(res) {
			let sharePostPushId = ''
			if (res.from === 'button') { // 来自页面内分享按钮
				sharePostPushId = res.target.id //设置分享id
			}
			//返回分享信息（分享打开的页面与参数、标题、图片）
			return {
				path: '/pages/jobhunt/index?invitation=' + uni.getStorageSync(
					'invitationCode') + '&sharePostPushId=' + sharePostPushId, //这是为了传参   onload(data){let id=data.id;} 
				title: this.tuiguang,
				imageUrl: this.bgImg
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
			//查看分享的卡片
			getShareInfo() {
				let data = {
					postPushId: this.sharePostPushId,
					loginUserId: uni.getStorageSync('userId')
				}
				this.$Request.getT('/app/postPush/selectPostPushDetails', data).then(res => {
					if (res.code == 0) {
						this.shareInfo = res.data
						this.showShare = true
					}
				})
			},
			//h5/app分享
			shares(postPushId) {
				let url = config.APIHOST2 + '/pages/jobhunt/index?invitation=' + uni.getStorageSync('invitationCode') +
					'&sharePostPushId=' + postPushId
				uni.setClipboardData({
					data: url,
					success() {
						uni.showToast({
							title: '分享链接已复制'
						})
					},
					fail() {
						uni.showToast({
							title: '分享失败，请重试',
							icon: 'none'
						})
					}
				})
			},
			/**
			 * 定位获取经纬度
			 */
			getLatOrLng() {
				let that = this
				uni.getLocation({
					type: 'gcj02', //wgs84  gcj02
					success: function(res) {
						console.log(res, '地理位置')
						that.latitude = res.latitude
						that.longitude = res.longitude

						// #ifdef MP-WEIXIN
						uni.request({
							url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + that.latitude +
								',' + that.longitude + '&key=O2PBZ-6J3CX-GWK44-TXGQL-QKC2T-2UBP6',
							success(re) {
								console.log(re)
								if (re.statusCode === 200) {
									let citydata = re.data.result.address_component.city
									// console.log("获取城市名称成功", citydata)
									that.city = citydata ? citydata : '未知'
									uni.setStorageSync('city',that.city)
									that.getClassifyList()
								} else {
									console.log("获取信息失败，请重试！")
								}
							}
						});
						// #endif
						// #ifdef APP-PLUS
						if (res.address) {
							that.city = res.address.city
							uni.setStorageSync('city',that.city)
							that.getClassifyList()
						} else {
							that.getSelectCity(that.longitude, that.latitude);
						}
						// #endif
						// #ifdef H5
						that.getSelectCity(that.longitude, that.latitude);
						// #endif
					},
					fail: function(err) {
						console.log('获取地址失败', err)
					}
				})
			},
			/**
			 * @param {Object} longitude
			 * @param {Object} latitude
			 * 使用经纬度获取城市
			 */
			getSelectCity(longitude, latitude) {
				console.log(longitude + '' + latitude, 'app请求经纬度');
				this.$Request.get('/app/Login/selectCity?lat=' + latitude + '&lng=' + longitude).then(res => {
					if (res.code == 0) {
						// console.log(res, 'app定位请求')
						this.city = res.data.city ? res.data.city : '未知'
						uni.setStorageSync('city',this.city)
						this.getClassifyList()
					}
				});
			},
			//去搜索
			gosearch() {
				uni.navigateTo({
					url: '/my/search/searchJob'
				})
			},
			//选择城市
			selectCity() {
				uni.navigateTo({
					url: '/my/city/city'
				})
			},
			//支付并查看
			selectPayCallPhone() {
				let data = {
					postPushId: this.postPushId
				}
				this.$Request.postT('/app/userGetPhoneRecord/buyPhone', data).then(res => {
					if (res.code == 0) {
						this.showPay = false
						this.page = 1
						this.getDataList()
						let that = this
						uni.showModal({
							title: '提示',
							content: '支付成功，是否立即电话联系？',
							confirmText: '立即联系',
							complete(ree) {
								if (ree.confirm) {
									setTimeout(() => {
										that.$Request.getT(
												'/app/userGetPhoneRecord/getPostPushPhone', data)
											.then(ret => {
												if (ret.code == 0) {
													uni.makePhoneCall({
														phoneNumber: ret.data
													})
												} else {
													uni.showToast({
														title: ret.msg,
														icon: 'none'
													})
												}
											})
									}, 1000)

								}
							}
						})

					} else if (res.code == 10001) {
						this.showPay = false
						uni.showModal({
							title: '提示',
							content: '积分不足，是否充值积分？',
							cancelText: '取消',
							confirmText: '去充值',
							complete(ret) {
								if (ret.confirm) {
									uni.navigateTo({
										url: '/my/wallet/wallet'
									})
								}
							}
						})
					} else if (res.code == 10007) {
						this.showPay = false
						uni.showModal({
							title: '提示',
							content: '请先进行实名认证',
							cancelText: '取消',
							confirmText: '去认证',
							complete(ret) {
								if (ret.confirm) {
									uni.navigateTo({
										url: '/my/renzheng/index'
									})
								}
							}
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//电话联系
			callPhone(isBuy, postPushId, byUserId, phone) {
				if (uni.getStorageSync('token')) {
					this.postPushId = postPushId
					let data = {
						postPushId: postPushId
					}
					let userId = uni.getStorageSync('userId')
					if (byUserId == userId) { //我自己发布的直接拨打
						uni.makePhoneCall({
							phoneNumber: phone
						})
					} else {
						if (isBuy == 1) { //购买过了
							//直接拉起电话
							this.$Request.getT('/app/userGetPhoneRecord/getPostPushPhone', data).then(res => {
								if (res.code == 0) {
									uni.makePhoneCall({
										phoneNumber: res.data
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
			//获取求职列表
			getDataList() {
				let name = this.classifyList[this.selectCurrent].childrens[this.selectCurrents].ruleClassifyName ==
					'全部机型' ? '' : this.classifyList[this.selectCurrent].childrens[this.selectCurrents].ruleClassifyName
				let data = {
					page: this.page,
					limit: this.limit,
					type: 2, //1:招聘 2:求职
					workType: this.value2 == '全部' ? '' : this.value2, //工作类型
					ruleClassifyName: name, //机器类型
					loginUserId: uni.getStorageSync('userId') ? uni.getStorageSync('userId') : '',
					city: this.city
				}
				this.$Request.get('/app/postPush/getAppPostPushList', data).then(res => {
					uni.stopPullDownRefresh()
					if (res.code == 0) {
						this.pages = res.data.pages
						if (this.page < this.pages) {
							this.status = 'loadmore'
						} else {
							this.status = 'nomore'
						}
						if (this.page == 1) {
							this.list = res.data.records
						} else {
							this.list = [...this.list, ...res.data.records]
						}
					}
				})
			},
			//根据工作类型筛选
			workTypeChange(e) {
				if (e == '全部') {
					this.title2 = '工作类型'
				} else {
					this.title2 = e
				}
				this.page = 1
				this.getDataList()
			},
			//筛选--获取工作类型
			getWorkType() {
				this.$Request.get('/app/dict/list', {
					type: '工作类型'
				}).then(res => {
					if (res.code == 0) {
						let obj = {
							value: '全部',
							label: '全部'
						}
						res.data.map(item => {
							item.label = item.value
						})
						this.options2 = [obj, ...res.data]
					}
				})
			},
			//根据机型筛选
			selectClassiftyCurr(index, ind) {
				this.selectCurrent = index
				this.selectCurrents = ind
				this.title1 = this.classifyList[this.selectCurrent].childrens[this.selectCurrents].ruleClassifyName
				this.$refs.uDropdown.close();
				this.page = 1
				this.getDataList()
			},
			//筛选--获取全部机型
			getClassifyList() {
				this.$Request.get('/app/rule/getClassifyList').then(res => {
					if (res.code == 0) {
						let obj = {
							childrens: [{
								ruleClassifyName: '全部机型'
							}]
						}
						this.classifyList = [obj, ...res.data]
						this.getDataList()
					}
				})
			},
			//获取求职页轮播图
			getBannerList() {
				this.$Request.getT('/app/banner/selectBannerList?state=1&classify=3').then(res => {
					if (res.code === 0) {
						this.swiperList = res.data;
					}
				});
			},
			//去登录
			noLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			//跳转详情
			goDetal(postPushId) {
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
					uni.navigateTo({
						url: '/pages/index/orderDet?postPushId=' + postPushId
					})
				} else {
					this.noLogin()
				}

			}
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

	.payContent {
		margin-top: 50rpx;
		width: 100%;
		padding: 0 20rpx;
		text-align: center;
	}

	.payBtn {
		margin-top: 100rpx;
		margin-bottom: 50rpx;

		.payBtn-l {
			width: 180rpx;
			height: 80rpx;
			background-color: #73c140;
			border-radius: 40rpx;
			color: #ffffff;
		}

		.payBtn-r {
			width: 180rpx;
			height: 80rpx;
			background-color: #5898f7;
			border-radius: 40rpx;
			color: #ffffff;
			margin-left: 100rpx;
		}
	}

	.selectActive {
		border: 1px solid #5898f7 !important;
		background-color: #5898f7 !important;
		color: #FFFFFF !important;
	}

	.jixing {
		width: 100%;
		height: 400rpx;
		background-color: #FFFFFF;
		padding: 30rpx;

		.jixing-all {
			width: 150rpx;
			height: 60rpx;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			border: 1px solid #000;
		}

		.jixing-item {
			margin-top: 10rpx;
		}

		.jixing-item-title {
			font-weight: bold;
		}

		.jixing-item-select {
			width: 100%;
			margin-top: 10rpx;

			.jixing-item-select-i {
				width: 150rpx;
				height: 60rpx;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				border: 1px solid #000;
			}
		}
	}

	.active {
		background: linear-gradient(to bottom, #C4D5FA 0%, #F2F2F7 100%) !important;
	}

	.search {
		width: 100%;
		height: auto;
		background: linear-gradient(to bottom, #C4D5FA 0%, #F2F2F7 100%);
		padding: 30rpx 0rpx;

		.search-box {
			width: 686rpx;
			height: 60rpx;

			.search-box-city {
				width: auto;
				height: 100%;
				white-space: nowrap;
				font-size: 28rpx;
				color: #333333;
				font-weight: bold;
			}

			.search-box-name {
				width: 570rpx;
				height: 100%;
				background-color: #F7F7F7;
				margin-left: 20rpx;
				border-radius: 8rpx;
			}

			.search-box-name-names {
				color: #CCCCCC;
				font-size: 24rpx;
				font-weight: 400;
			}
		}
	}

	.swipers {
		width: 100%;
		height: 200rpx;

		.swipers-box {
			width: 686rpx;
			height: 100%;
			border-radius: 24rpx;
		}

		.swipers-box-swiper {
			width: 100%;
			height: 100%;
			border-radius: 24rpx;

			.swipers-box-swiper-item {
				width: 100%;
				height: 100%;
				border-radius: 24rpx;
			}
		}
	}

	.dropDown {
		width: 100%;
		height: auto;
		background-color: #F2F2F7;
	}

	.list {
		width: 100%;
		height: auto;
		margin-bottom: 20rpx;


	}

	.list-box {
		width: 686rpx;
		height: 100%;
		background-color: #ffffff;
		border-radius: 24rpx;
		padding: 30rpx;
	}

	.list-box-title-l {
		height: 100rpx;

		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}

		.list-box-title-l-info {
			margin-left: 18rpx;

			.list-box-title-l-info-name {
				color: #333333;
				font-size: 32rpx;
				font-weight: bold;
			}

			.list-box-title-l-info-name-label-item {
				color: #FFFFFF;
				font-size: 24rpx;
				padding: 6rpx 10rpx;
				border-radius: 8rpx;
				margin-right: 10rpx;
			}
		}
	}

	.list-box-title-r {
		color: #333333;
		font-size: 28rpx;
	}

	.list-box-content {
		margin-top: 28rpx;
		font-size: 28rpx;
		color: #666666;
	}

	.list-box-line {
		width: 100%;
		height: 1px;
		background-color: #E6E6E6;
		margin-top: 30rpx;
	}

	.list-box-btn {
		width: 100%;
		height: 56rpx;
		margin-top: 12rpx;
		color: #333333;
		font-size: 26rpx;

		.list-box-btn-l {
			width: 50%;
			height: 100%;
			border-right: 1px solid #E6E6E6;
		}

		.list-box-btn-r {
			width: 50%;
			height: 100%;
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
	}
</style>