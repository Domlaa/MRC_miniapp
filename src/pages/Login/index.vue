<template>
	<view>
		<cmd-page-body type="top">
			<view class="login">
				<view class="login-title">使用账号密码登录</view>
				<!-- 账号表单登录 start -->
				<cmd-transition name="fade-up">
					<view class="login-username">
						<cmd-input v-model="account.username" type="text" focus maxlength="26" placeholder="请输入账号"></cmd-input>
					</view>
					<view class="login-password">
						<cmd-input v-model="account.password" type="password" displayable maxlength="26" placeholder="请输入密码"></cmd-input>
					</view>
					<button class="btn-login" :class="loginAccount ? 'btn-login-active':''" :disabled="!loginAccount" hover-class="btn-login-hover"
					 @tap="doLogin">登录</button>
				</cmd-transition>
				<!-- 账号表单登录 end -->
				<!-- 跳转到注册页面 -->
				<view class="link-text" @tap="gotoRegister">没有账号，点我注册</view>
			</view>
		</cmd-page-body>
	</view>
</template>

<script>
	import cmdNavBar from "../../components/cmd-nav-bar/cmd-nav-bar.vue"
	import cmdPageBody from "../../components/cmd-page-body/cmd-page-body.vue"
	import cmdTransition from "../../components/cmd-transition/cmd-transition.vue"
	import cmdInput from "../../components/cmd-input/cmd-input.vue"

	import {
		login,
		getUserInfo
	} from "../../api/index.js"

	export default {
		components: {
			cmdNavBar,
			cmdPageBody,
			cmdTransition,
			cmdInput
		},

		data() {
			return {
				// 账号登录部分数据
				account: {
					username: '',
					password: ''
				},
				usernameReg: /^[A-Za-z0-9]+$/,
				passwordReg: /^\w+$/,
				loginAccount: false,
			};
		},

		watch: {
			/**
			 * 监听账号登录数值
			 */
			account: {
				handler(newValue) {
					if ((this.usernameReg.test(newValue.username) && newValue.username.length >= 3) && (this.passwordReg.test(
							newValue.password) && newValue.password.length >= 3)) {
						this.loginAccount = true;
					} else {
						this.loginAccount = false
					}
				},
				deep: true
			}
		},

		methods: {
			/**
			 * 登录按钮点击执行
			 */
			doLogin() {
				// 加载动画
				uni.showLoading({
					title: "登录中..."
				});

				login({
					username: this.account.username,
					password: this.account.password
				}).then(res => {
					// 关闭加载动画
					uni.hideLoading()

					console.log('登录返回结果：', res)
					if (res.code == '200') {
						uni.showToast({
							title: res.msg,
							mask: true,
							duration: 2000
						})
						this.registerAccount = false;
						// 更改登陆状态为已登录并获取用户基本信息
						getApp().globalData.login_status = 1
						getUserInfo().then(res => {
							// 这里获取不到正确的状态📌📌📌
							console.log('获取登录用户返回结果✨✨✨：', res)
						})

						setTimeout(function() {
							// 跳转回用户中心
							uni.navigateBack({
								animationType: 'pop-out'
							})
						}, 2500) //延迟时间
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							mask: true,
							duration: 2500
						})
					}
				})

			},
			/**
			 * 跳转注册页面
			 */
			gotoRegister() {
				uni.navigateTo({
					url: "../Register/index"
				})
			}
		}
	}
</script>

<style>
	.login {
		margin-top: 16upx;
		margin-right: 72upx;
		margin-left: 72upx;
	}

	.login-title {
		font-size: 56upx;
		font-weight: 500;
	}

	.login-explain {
		font-size: 28upx;
		color: #ee0a24;
	}

	.login-username {
		margin-top: 56upx;
		margin-bottom: 40upx;
		border-bottom: 2upx #dedede solid;
	}

	.login-password {
		border-bottom: 2upx #dedede solid;
	}

	.btn-login {
		margin-top: 100upx;
		border-radius: 50upx;
		font-size: 16px;
		color: #fff;
		background: linear-gradient(to right, #F67175, #FF9494);
	}

	.btn-login-active {
		background: linear-gradient(to right, #C62F2F, #ee0a24);
	}

	.btn-login-hover {
		background: linear-gradient(to right, #C62F2F, #ee0a24);
	}

	button[disabled] {
		color: #fff;
	}

	.link-text {
		text-align: center;
		margin-top: 32upx;
	}
</style>
