<template>
	<view style="padding-top: 30rpx;">
		<view class="forms flex align-center justify-center ">
			<view class="forms-box">
				<u-form :label-style="labelStyle" :model="form" ref="uForm">
					<u-form-item :right-icon-style="rightIconStyle" right-icon="arrow-right" label="机器类型">
						<u-input @click="getClassifyList()" v-model="form.ruleClassifyName" disabled
							placeholder="请选择机器类型" />
					</u-form-item>
					<u-form-item :right-icon-style="rightIconStyle" right-icon="arrow-right" label="工作类型">
						<u-input v-model="form.workType" @click="getWorkList()" disabled placeholder="请选择工作类型" />
					</u-form-item>
					<u-form-item :right-icon-style="rightIconStyle" label="工作范围" right-icon="arrow-right">
						<u-input v-model="form.dizhi" @click="showFanwei = true" disabled placeholder="请选择工作范围" />
					</u-form-item>
					<u-form-item label="联系电话">
						<u-input v-model="form.phone" type="number" maxlength="11" placeholder="请输入联系电话" />
					</u-form-item>
					<u-form-item :border-bottom="false" label-position="top" label="求职内容">
						<u-input style="background: #F5F5F5;height: 180rpx;border-radius: 12rpx;"
							v-model="form.content" type="textarea" maxlength="-1" placeholder="如:全职" :auto-height="false"
							inputAlign="left" :clearable="true" />
					</u-form-item>
				</u-form>
			</view>
		</view>
		<view v-if="resumeInfo.resumesId" class="box" @click="gotoResume">
			<view>
				<view class="name">{{resumeInfo.resumesName}}</view>
				<view class="margin-top-xs text-26" style="color: #999999;">{{resumeInfo.realName}}</view>
			</view>
			<image src="../static/right.png" style="width: 50rpx;height: 50rpx;"></image>
		</view>
		<view v-else class="box" @click="gotoResume">
			<view>
				<view class="name">添加简历</view>
				<view class="margin-top-xs text-26" style="color: #999999;">暂无简历，点此添加</view>
			</view>
			<image src="../static/right.png" style="width: 50rpx;height: 50rpx;"></image>
		</view>
		<view @click="submit" class="btn">提交</view>
		<!-- 选择机械类型 -->
		<u-select v-model="show" @confirm="confirm" child-name="childrens" mode="mutil-column-auto"
			:list="classifyList"></u-select>
		<!-- 工作类型 -->
		<u-select v-model="showWork" @confirm="confirmWork" :list="workList"></u-select>
		<!-- 工作范围 -->
		<u-picker v-model="showFanwei" @confirm="confirmFanwei" mode="region" :params="params"></u-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				params: {
					province: true,
					city: true,
					area: false
				},
				showFanwei: false,
				showWork: false,
				workList: [], //工作类型
				show: false,
				labelStyle: {
					color: '#333333',
					fontSize: '30rpx',
					fontWeight: 'bold',
				},
				rightIconStyle: {
					color: '#999999'
				},
				form: {
					type: 2, //1招聘 2求职
					ruleClassifyName: '', //机器类型
					ruleClassifyParentId: '', //机器类型所属上级id
					workType: '', //工作类型
					province: '', //省
					city: '', //市
					dizhi:'',//地址
					phone: '', //联系电话
					content: '', //求职内容
				},
				resumeInfo: {}, //简历信息
				classifyList: [], //机器类型
			};
		},
		onShow() {
			let that = this
			uni.$on('selectResume', (data) => {
				that.resumeInfo = data
				console.log(data)
			})
		},
		onLoad(option) {
			if(option.postPushId){
				this.postPushId = option.postPushId
				this.getPostPushInfo()
			}
		},
		methods: {
			//获取招聘详情
			getPostPushInfo(){
				let data = {
					postPushId:this.postPushId,
					loginUserId:uni.getStorageSync('userId')
				}
				this.$Request.getT('/app/postPush/selectPostPushDetails',data).then(res=>{
					if(res.code == 0){
						this.form.ruleClassifyName = res.data.ruleClassifyName //机器类型
						this.form.ruleClassifyParentId = res.data.ruleClassifyParentId //机器类型所属上级id
						this.form.workType = res.data.workType //工作类型
						this.form.province = res.data.province //省
						this.form.city = res.data.city //市
						this.form.dizhi = res.data.province+''+res.data.city
						this.form.phone = res.data.phone//联系电话
						this.form.content = res.data.content//招聘内容
						this.form.postPushId = res.data.postPushId
						this.getResumeInfo(res.data.resumesId)
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
				
			},
			//获取简历详情
			getResumeInfo(resumesId){
				let data = {
					resumesId:resumesId
				}
				this.$Request.getT('/app/resumes/getResumes',data).then(res=>{
					if(res.code == 0){
						this.resumeInfo = res.data
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
			},
			//发布求职信息
			submit() {
				if (!this.form.ruleClassifyName) {
					uni.showToast({
						title: '请选择机器类型',
						icon: 'none'
					})
					return
				}
				if (!this.form.workType) {
					uni.showToast({
						title: '请选择工作类型',
						icon: 'none'
					})
					return
				}
				if (!this.form.dizhi) {
					uni.showToast({
						title: '请选择工作范围',
						icon: 'none'
					})
					return
				}
				if (!this.form.phone) {
					uni.showToast({
						title: '请输入联系电话',
						icon: 'none'
					})
					return
				}
				if (!this.form.content) {
					uni.showToast({
						title: '请输入求职内容',
						icon: 'none'
					})
					return
				}
				if (!this.resumeInfo.resumesId) {
					uni.showToast({
						title: '请选择简历',
						icon: 'none'
					})
					return
				}
				this.form.resumesId = this.resumeInfo.resumesId
				if (this.postPushId) {
					let that = this
					uni.showModal({
						title: '提示',
						content: '修改后将会重新审核，是否继续？',
						confirmText: '继续',
						complete(ree) {
							if (ree.confirm) {
								that.$Request.postT('/app/postPush/savePostPush', that.form).then(res => {
									if (res.code == 0) {
										uni.showToast({
											title: '提交成功'
										})
										setTimeout(() => {
											uni.navigateTo({
												url: '/my/order/order'
											})
										}, 1000)
									} else {
										uni.showToast({
											title: res.msg,
											icon: 'none'
										})
									}
								})
							}
						}
					})
				} else {
					this.$Request.postT('/app/postPush/savePostPush', this.form).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: '提交成功'
							})
							setTimeout(() => {
								uni.navigateTo({
									url: '/my/order/order'
								})
							}, 1000)
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							})
						}
					})
				}

			},
			//选择工作范围
			confirmFanwei(e){
				this.form.dizhi = e.province.label+''+e.city.label
				this.form.province = e.province.label
				this.form.city = e.city.label
			},
			//选择简历
			gotoResume() {
				uni.navigateTo({
					url: '/my/resume/resume'
				})
			},
			//选择工作类型
			confirmWork(e) {
				this.form.workType = e[0].value
			},
			//获取工作类型
			getWorkList() {
				this.$Request.get("/app/dict/list", {
					type: '工作类型'
				}).then(res => {
					if (res.code == 0) {
						if (res.data && res.data.length > 0) {
							res.data.map(item => {
								item.label = item.value
							})
							this.workList = res.data
							this.showWork = true
						} else {
							uni.showToast({
								title: '暂无工作类型',
								icon: 'none'
							})
						}
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
			//选择机器类型
			confirm(e) {
				this.form.ruleClassifyParentId = e[0].value
				this.form.ruleClassifyName = e[1].label
			},
			//获取机器类型
			getClassifyList() {
				this.$Request.get('/app/rule/getClassifyList').then(res => {
					if (res.code == 0) {
						if (res.data && res.data.length > 0) {
							res.data.map(item => {
								item.value = item.ruleClassifyId
								item.label = item.ruleClassifyName
								item.childrens.map(ite => {
									ite.value = ite.ruleClassifyId
									ite.label = ite.ruleClassifyName
									delete ite.childrens
								})
							})
							this.classifyList = res.data
							this.show = true
						} else {
							uni.showToast({
								title: '暂无机器类型',
								icon: 'none'
							})
						}

					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #F2F2F7;
	}
	/deep/.u-form-item{
		padding: 24rpx 0 !important;
	}
	textarea{
		background-color: #F5F5F5;
		
		border-radius: 12rpx;
		height: 180rpx;
	}
	.forms {
		width: 100%;
		height: auto;

		.forms-box {
			width: 686rpx;
			height: 100%;
			background-color: #ffffff;
			border-radius: 24rpx;
			padding: 0 30rpx;
		}
	}

	.btn {
		width: 690rpx;
		height: 100rpx;
		background: #4498FF;
		border-radius: 50rpx;
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: bold;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		margin-top: 66rpx;
	}

	.box {
		background: #FFFFFF;
		border-radius: 24rpx;
		margin: 30rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 70rpx;
	}

	.name {
		font-size: 32rpx;
		font-family: PingFang SC;
		font-weight: 800;
		color: #333333;
	}
</style>