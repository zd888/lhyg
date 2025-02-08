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
					<u-form-item :right-icon-style="rightIconStyle" label="工作地址" right-icon="arrow-right">
						<u-input v-model="form.address" @click="selectAddress" disabled placeholder="请选择工作地址" />
					</u-form-item>
					<u-form-item label="联系电话">
						<u-input v-model="form.phone" type="number" maxlength="11" placeholder="请输入联系电话" />
					</u-form-item>
					<u-form-item :border-bottom="false" label-position="top" label="招聘内容">
						<u-input style="background: #F5F5F5;height: 180rpx;border-radius: 12rpx;"
							v-model="form.content" type="textarea" maxlength="-1" placeholder="如:全职" :auto-height="true"
							inputAlign="left" :clearable="true" />
					</u-form-item>
				</u-form>
			</view>
		</view>

		<view @click="submit" class="btn">提交</view>
		<!-- 选择机械类型 -->
		<u-select v-model="show" @confirm="confirm" child-name="childrens" mode="mutil-column-auto"
			:list="classifyList"></u-select>
		<!-- 工作类型 -->
		<u-select v-model="showWork" @confirm="confirmWork" :list="workList"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
					type: 1, //1招聘 2求职
					ruleClassifyName: '', //机器类型
					ruleClassifyParentId: '', //机器类型所属上级id
					workType: '', //工作类型
					province: '', //省
					city: '', //市
					county: '', //区
					address: '', //详细地址
					lng: '', //经度
					lat: '', //纬度
					phone:'',//联系电话
					content:'',//招聘内容
				},
				classifyList: [], //机器类型
				postPushId:'',
			};
		},
		onLoad(option) {
			if(option.postPushId){
				this.postPushId = option.postPushId
				this.getPostPushInfo()
				uni.setNavigationBarTitle({
					title:'修改招聘'
				})
				
				
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
						this.form.county = res.data.county //区
						this.form.address = res.data.address //详细地址
						this.form.lng = res.data.lng //经度
						this.form.lat = res.data.lat //纬度
						this.form.phone = res.data.phone//联系电话
						this.form.content = res.data.content//招聘内容
						this.form.postPushId = res.data.postPushId
					}else{
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					}
				})
				
			},
			//发布招聘信息
			submit(){
				if(!this.form.ruleClassifyName){
					uni.showToast({
						title:'请选择机器类型',
						icon:'none'
					})
					return
				}
				if(!this.form.workType){
					uni.showToast({
						title:'请选择工作类型',
						icon:'none'
					})
					return
				}
				if(!this.form.address){
					uni.showToast({
						title:'请选择工作地址',
						icon:'none'
					})
					return
				}
				if(!this.form.phone){
					uni.showToast({
						title:'请输入联系电话',
						icon:'none'
					})
					return
				}
				if(!this.form.content){
					uni.showToast({
						title:'请输入招聘内容',
						icon:'none'
					})
					return
				}
				if(this.postPushId){
					let that = this
					uni.showModal({
						title:'提示',
						content:'修改后将会重新审核，是否继续？',
						confirmText:'继续',
						complete(ree) {
							if(ree.confirm){
								that.$Request.postT('/app/postPush/savePostPush',that.form).then(res=>{
									if(res.code == 0){
										uni.showToast({
											title:'提交成功'
										})
										setTimeout(()=>{
											uni.navigateTo({
												url:'/my/order/order'
											})
										},1000)
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
				}else{
					this.$Request.postT('/app/postPush/savePostPush',this.form).then(res=>{
						if(res.code == 0){
							uni.showToast({
								title:'提交成功'
							})
							setTimeout(()=>{
								uni.navigateTo({
									url:'/my/order/order'
								})
							},1000)
						}else{
							uni.showToast({
								title:res.msg,
								icon:'none'
							})
						}
					})
				}
				
			},
			//选择工作地址
			selectAddress() {
				let that = this
				uni.chooseLocation({
					complete(res) {
						if (res.address) {
							that.form.lat = res.latitude
							that.form.lng = res.longitude
							that.form.address = res.address
							// 提取地址中的省市区
							var reg = /.+?(省|市|自治区|自治州|县|区)/g;
							that.form.province = res.address.match(reg)[0]
							that.form.city = res.address.match(reg)[1]
							that.form.county = res.address.match(reg)[2]
						}
					}
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
		padding:  0 10rpx;
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
		position: fixed;
		bottom: 80rpx;
		left: 50%;
		transform: translate(-50%, 0);
	}
</style>