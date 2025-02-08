<template>
	<view>
		<!-- 中间主体内容 -->
		<view class="content">
			<scroll-view scroll-y="true" style="width: 100%;height: 100%;padding-bottom: 100rpx;" :scroll-into-view="toView"
				scroll-with-animation="true">
				<view class="content-title">
					选择城市
				</view>
				<view class="content-search">
					<u-search placeholder="搜索城市名" v-model="keyword" @change="goSearch()"
						:show-action="false"></u-search>
				</view>
				<view class="content-map flex flex-wrap">
					<view class="flex align-center justify-between" style="width: 100%;" @click="getLatOrLng">
						定位城市
						<view class="" style="font-size: 24rpx;font-weight: 500;color: #999999;">
							<u-icon name="map" color="#999999" style="margin-right: 10rpx;" size="24"></u-icon>重新定位
						</view>
					</view>
					<view class="content-map-address" @click="selectCity(city)">
						{{city}}
					</view>
				</view>
				<!-- <view class="content-map flex justify-between flex-wrap" v-if="rmCity.length>0">
					<view class="" style="width: 100%;">
						热门城市
					</view>
					<view class="content-map-address flex justify-center align-center" @click="selectCity(item)"
						v-for="(item,index) in rmCity" :key="index">
						{{item}}
					</view>
					<view class="content-map-address flex justify-center align-center" style="height: 0;">

					</view>
				</view> -->
				<view :id="item.latter" class="content-map flex flex-wrap" v-for="(item,index) in cityList"
					v-if="item.citys.length>0" :key="index">
					<view class="" style="width: 100%;">
						{{item.latter.toUpperCase()}}
					</view>
					<view class="content-map-address " @click="selectCity(ite.label)" v-for="(ite,ind) in item.citys"
						:key="ind">
						{{ite.label}}
					</view>
				</view>
			</scroll-view>

		</view>
		<view class="left flex justify-center flex-wrap">
			<view :data-id="item" class="left-item" v-for="(item,index) in cityList" @tap="bindToView">
				{{item.latter.toUpperCase()}}
			</view>
		</view>



	</view>
</template>

<script>
	import citys from '../../pages/index/citys/citys.js'
	export default {
		data() {
			return {
				searchList: [],
				cityList: citys,
				cityss:citys,
				rmCity: [],
				keyword: '',
				list: [],
				toView: '',
				city: '',
				latitude: '',
				longitude: '',
			}
		},
		onLoad() {
			this.getLatOrLng()
		},
		methods: {
			//搜索
			goSearch(){
				if(this.keyword){
					this.cityList = this.searchByLabel(this.keyword)
					// console.log(this.cityList)
				}else{
					this.cityList = citys
				}
				
			},
			//根据label模糊搜索，并过滤掉其他无用的数据，只保留带关键词的数据，返回一个新数组
			searchByLabel(keyword) {
			  return this.cityss.reduce((result, item) => {
			    const filteredCities = item.citys.filter(city => {
			      return city.label.includes(keyword);
			    })
			    if (filteredCities.length > 0) {
			      result.push({
			        latter: item.latter,
			        citys: filteredCities
			      })
			    }
			    return result;
			  }, [])
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
								} else {
									console.log("获取信息失败，请重试！")
								}
							}
						});
						// #endif
						// #ifdef APP-PLUS
						if (res.address) {
							that.city = res.address.city
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
					}
				});
			},
			/**
			 * @param {Object} city
			 * 选择城市
			 */
			selectCity(city) {
				uni.$emit('city', {
					city: city
				})
				uni.navigateBack()
			},

			bindToView(event) {
				var id = event.currentTarget.dataset.id;
				// console.log(id, '1111')
				this.toView = id.latter;
			}
		}
	}
</script>

<style lang="scss">
	.content {
		width: 686rpx;
		height: 100vh;
		position: fixed;
		right: 40rpx;
		/* #ifdef MP-WEIXIN */
		top: 0;
		/* #endif */
		/* #ifndef MP-WEIXIN */
		top: 76;
		/* #endif */

		.content-title {
			width: 100%;
			font-size: 38rpx;
			font-weight: bold;
			margin-top: 30rpx;
		}

		.content-search {
			width: 100%;
			height: 60rpx;
			border-radius: 24rpx;
			background-color: #F2F2F7;
			margin-top: 30rpx;
		}

		.content-map {
			width: 100%;
			margin-top: 30rpx;
			font-size: 30rpx;
			font-weight: bold;

			.content-map-address {
				margin-top: 20rpx;
				// width: 200rpx;
				// height: 70rpx;
				padding: 20rpx 30rpx;
				margin-right: 20rpx;
				background-color: #F2F2F7;
				font-size: 26rpx;
				font-weight: 500;
				// overflow: hidden;
				// white-space: nowrap;
				// text-overflow: ellipsis;
				// -o-text-overflow: ellipsis;
			}
		}
	}

	.left {
		position: fixed;
		right: 0;
		top: 50%;
		transform: translate(0, -50%);
		width: 30rpx;

		.left-item {
			margin-top: 10rpx;
			padding-left: 10rpx;
			padding-right: 10rpx;
			color: #6696FF;
		}
	}
</style>