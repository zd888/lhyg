<template>
	<view style="padding-bottom: 230rpx;">
		<view class="list flex justify-center align-center" @click="selectResume(item)" v-for="(item,index) in list" :key="index">
			<view class="list-box">
				<view class="list-box-info flex align-center justify-between">
					<view class="list-box-info-l">
						<image v-if="item.userEntity && item.userEntity.avatar" :src="item.userEntity.avatar" mode=""></image>
						<image v-else src="../../static/logo.png" mode=""></image>
					</view>
					<view class="list-box-info-r">
						<view class="list-box-info-r-t flex align-center justify-between">
							<view class="">
								<text>{{item.resumesName}}—{{item.realName}}</text>
							</view>
							
							<text>{{item.workCity}} / {{item.workDistrict}}</text>
						</view>
						<view class="list-box-info-r-b">
							 {{item.age}}岁 / {{item.isConcurrent==1?'全职':'兼职'}} / {{item.marriageStatus==1?'已婚':'未婚'}} / 期望¥{{item.hopeSalary}}
						</view>
					</view>
				</view>
				<view class="list-box-btn flex align-center justify-between">
					<view @click.stop="deleteResume(item.resumesId)" class="list-box-btn-l flex align-center justify-center">
						删除
					</view>
					<view @click.stop="upDataResume(item.resumesId)" class="list-box-btn-r flex align-center justify-center">
						修改
					</view>
				</view>
			</view>
		</view>
		<u-empty v-if="list.length == 0" style="position: fixed;top: 50%;left: 50%;transform: translate(-50%,-50%);" text="暂无简历" mode="list"></u-empty>
		<view v-if="list.length<resumeNum" class="add flex align-center justify-center">
			<view @click="addResume" class="add-con flex align-center justify-center">
				添加简历
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				page:1,
				limit:10,
				pages:1,
				resumeNum:1,//最大简历数
			};
		},
		onShow() {
			this.resumeNum = uni.getStorageSync('resumeNum')
			this.getResumeList()
		},
		onPullDownRefresh() {
			this.page = 1
			this.getResumeList()
		},
		//加载更多
		onReachBottom() {
			if(this.page < this.pages){
				this.page += 1
				this.getResumeList()
			}
		},
		methods:{
			//去修改简历
			upDataResume(resumesId){
				uni.navigateTo({
					url:'/my/resume/add?resumesId='+resumesId
				})
			},
			//获取简历列表
			getResumeList(){
				let data = {
					page:this.page,
					limit:this.limit,
				}
				this.$Request.getT('/app/resumes/getMyResumesList',data).then(res=>{
					uni.stopPullDownRefresh()
					if(res.code == 0){
						this.pages = res.data.pages
						if(this.page == 1){
							this.list = res.data.records
						}else{
							this.list = [...this.list,...res.data.records]
						}
					}
				})
			},
			//添加简历
			addResume(){
				uni.navigateTo({
					url:'/my/resume/add'
				})
			},
			// 选择简历
			selectResume(info){
				uni.$emit('selectResume',info)
				uni.navigateBack()
			},
			//删除简历
			deleteResume(resumesId){
				let that = this
				uni.showModal({
					title:'提示',
					content:'确认删除简历吗？',
					confirmText:'确认',
					complete(ret) {
						if(ret.confirm){
							let data = {
								resumesId:resumesId
							}
							that.$Request.postT('/app/resumes/deleteResumes',data).then(res=>{
								if(res.code == 0){
									uni.showToast({
										title:'已删除'
									})
									that.page = 1
									that.getResumeList()
								}else{
									uni.showToast({
										title:res.msg,
										icon:'none'
									})
								}
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #F2F2F7;
	}
	.list{
		width: 100%;
		height: auto;
		.list-box{
			width: 686rpx;
			height: 100%;
			background-color: #FFFFFF;
			border-radius: 24rpx;
			padding: 30rpx;
			margin-top: 30rpx;
		}
		.list-box-info{
			width: 100%;
			height: 100rpx;
			.list-box-info-l{
				width: 100rpx;
				height: 100rpx;
				image{
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.list-box-info-r{
				width: calc(100% - 118rpx);
				height: 100%;
				.list-box-info-r-t{
					text{
						color: #333333;
						
					}
					view{
						width: 60%;
						overflow: hidden;
						text-overflow: ellipsis; //溢出用省略号显示
						white-space: nowrap;  // 默认不换行；
						text:nth-of-type(1){
							font-size: 32rpx;
							font-weight: bold;
						}
					}
					
					text:nth-of-type(1){
						font-size: 28rpx;
					}
				}
				.list-box-info-r-b{
					color: #999999;
					font-size: 26rpx;
					margin-top: 20rpx;
				}
			}
		}
		.list-box-btn{
			width: 100%;
			height: 70rpx;
			margin-top: 30rpx;
			.list-box-btn-l{
				width: 300rpx;
				height: 100%;
				border: 1px solid #A0A0A0;
				border-radius: 35rpx;
				color: #333333;
				font-size: 26rpx;
			}
			.list-box-btn-r{
				width: 300rpx;
				height: 100%;
				border: 1px solid #6696FF;
				border-radius: 35rpx;
				color: #4498FF;
				font-size: 26rpx;
			}
		}
	}
	
	.add{
		width: 100%;
		height: 200rpx;
		background-color: #F2F2F7;
		position: fixed;
		bottom: 0;
		.add-con{
			width: 686rpx;
			height: 100rpx;
			background-color: #4498FF;
			border-radius: 50rpx;
			color: #FFFFFF;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
</style>