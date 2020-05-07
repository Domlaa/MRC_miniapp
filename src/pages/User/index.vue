<template>
	<view>
		<view class="person-head">
			<cmd-avatar src="https://avatar.bbs.miui.com/images/noavatar_small.gif" @click="fnInfoWin" size="lg" :make="{'background-color': '#fff'}"></cmd-avatar>
			<view v-if="isLogin" class="person-head-box">
				<view class="person-head-nickname">Jason</view>
				<view class="person-head-username">ID：1600300626wangjiecheng</view>
			</view>
			<view v-else class="person-head-box">
				<view class="person-head-username">你好，请登录以获取您的个人数据。</view>
				<button class="person-head-nickname btn-login" type="warn" size="mini" @click="login">登录</button>
			</view>
		</view>
		<view class="person-list">
			<cmd-cell-item @tap="gotoItem(1)" title="听歌记录" slot-left arrow>
				<cmd-icon type="bullet-list" size="24" color="#C62F2F"></cmd-icon>
			</cmd-cell-item>
			<cmd-cell-item @click="gotoItem(2)" title="我的评分" slot-left arrow>
				<cmd-icon type="star" size="24" color="#C62F2F"></cmd-icon>
			</cmd-cell-item>
			<cmd-cell-item @click="gotoItem(3)" title="音乐口味" slot-left arrow>
				<cmd-icon type="streaming" size="24" color="#C62F2F"></cmd-icon>
			</cmd-cell-item>
			<cmd-cell-item @tap="gotoItem(0)" title="关于" addon="v1.0" slot-left arrow>
				<cmd-icon type="alert-circle" size="24" color="#C62F2F"></cmd-icon>
			</cmd-cell-item>
			<button v-show="isLogin" class="btn-logout" @click="isLogin = !isLogin">退出登录</button>
		</view>
	</view>
</template>

<script>
	import cmdAvatar from "@/components/cmd-avatar/cmd-avatar.vue"
	import cmdIcon from "@/components/cmd-icon/cmd-icon.vue"
	import cmdCellItem from "@/components/cmd-cell-item/cmd-cell-item.vue"

	import {
		getUserInfo
	} from "../../api/index"

	export default {
		components: {
			cmdAvatar,
			cmdCellItem,
			cmdIcon
		},
		data() {
			return {
				isLogin: false //登录状态
			};
		},
		onBackPress() {
			console.log('8888888888888888888888888888888')
		},
		create() {
			getUserInfo().then(res => {
				console.log("用户信息2222222222222222222222222222222：", res)
			})
		},
		methods: {
			//登录
			login() {
				uni.navigateTo({
					url:"../Login/index"
				})
				// this.isLogin = !this.isLogin
			},
			// 跳转到对应子页面
			gotoItem(item) {
				console.log("跳转到：", item)
				if (this.isLogin == false && item !== 0) {
					item = '未登录'
				}
				switch (item) {
					case 1:
						uni.navigateTo({
							url: '/pages/History/index'
						})
						break;

					case 2:
						uni.navigateTo({
							url: '/pages/MyRating/index'
						})
						break;

					case 3:
						uni.navigateTo({
							url: '/pages/ForMe/index'
						})
						break;

					case 0:
						uni.navigateTo({
							url: '/pages/About/index'
						})
						break;

					default:
						console.log("item值为：", item)
						uni.showToast({
							title: "请先登录！",
							icon: "none"
						})
						break;
				}
			}
		}
	}
</script>

<style>
	.person-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 150px;
		padding-left: 20px;
		background: url(//s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg?f01a252…=) no-repeat;
		background-size: cover;
	}

	.person-head-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		margin-left: 10px;
	}

	.person-head-nickname {
		font-size: 18px;
		font-weight: 500;
		color: #fff;
	}

	.person-head-username {
		font-size: 14px;
		font-weight: 500;
		color: #fff;
	}

	.person-list {
		line-height: 0;
	}

	.btn-login {
		width: 30%;
		margin-top: 10rpx;
		border-radius: 50upx;
		font-size: 16px;
	}

	.btn-logout {
		margin-top: 100upx;
		width: 80%;
		border-radius: 50upx;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(to right, #C62F2F, #ee0a24);
	}
</style>
