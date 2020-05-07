<template>
	<View class="Recommend">
		<!-- CNN 推荐展示区 -->
		<View class="Hot SongList">
			<View class="coverBox">
				<View class="cover" :style="{backgroundImage:'url(' + baseTrackInfo.base_pic + ')'}"></View>
				<Text class="time">以下推荐结果基于歌曲 {{ baseTrackInfo.base_name }} 推荐✨</Text>
			</View>
			<View class="cell-title">
				基于深度学习的推荐
				<van-icon name="arrow" size="20px" color="#999" />
			</View>
			<View class="item" v-if='isLoading'>
				<van-loading color="#dd001b" style="padding:0 20rpx;" />{{ tips }}
				<button v-show="btShow" type="warn" plain="true" size="mini" @click="retry">重试</button>
			</View>
			<View v-else class="item" :key="index" v-for="(item, index) in CNNRecomList">
				<View class="left">{{ index + 1 }}</View>
				<View class="box">
					<View class="middle">
						<View class="ellipsis">{{ item.name }}</View>
						<Text class="ellipsis"> {{ item.ar + " - " + item.name}} </Text>
					</View>
					<View class="right">
						<van-tag plain type="danger">{{ item.genre }}</van-tag>
					</View>
				</View>
			</View>
		</View>

		<!-- 基于物品的协同过滤推荐展示区 -->
		<View class="cell-title">
			基于项目的协同过滤推荐
			<van-icon name="arrow" size="20px" color="#999" />
		</View>
		<View class="cell-SongSheet">
			<SongSheet v-for="(item, index) in SimilarList" :key="index" :song_item="item" :name="item.full_song_name" :picUrl="item.album_pic + '?imageView&thumbnail=250x0'" />
		</View>

		<!-- 基于用户的协同过滤推荐展示区 -->
		<View class="cell-title">
			基于用户的协同过滤推荐
			<van-icon name="arrow" size="20px" color="#999" />
		</View>
		<View class="cell-SongSheet">
			<SongSheet v-for="(item, index) in UserRecomList" :key="index" :song_item="item" :name="item.full_song_name" :picUrl="item.album_pic + '?imageView&thumbnail=250x0'" />
		</View>
	</View>
</template>

<script>
	import {
		getCNNRecom,
		getSimilar,
		getUserRecom,
		getDetail
	} from "../../api/index";
	import SongSheet from "../../components/SongSheet";
	import VanIcon from "../../wxcomponents/vant-weapp/icon/index";
	import VanTag from "../../wxcomponents/vant-weapp/tag/index";
	import VanLoading from "../../wxcomponents/vant-weapp/loading/index";

	export default {
		components: {
			SongSheet,
			VanIcon,
			VanTag,
			VanLoading
		},
		data() {
			return {
				baseTrackInfo: {}, //根据推荐歌曲的基本信息
				CNNRecomList: [], //CNN推荐结果
				SimilarList: [], //基于物品推荐的歌曲
				UserRecomList: [], //基于用户推荐的歌曲
				isLoading: true, //加载状态
				tips: "歌曲分析推荐中......",
				btShow: false
			};
		},
		created() {
			getDetail({
				id: getApp().globalData.base_track_id //获取全局变量
			}).then(res => {
				console.log("基本歌曲的详情信息：", res)
				this.baseTrackInfo.base_name = res.song_name
				this.baseTrackInfo.base_pic = res.album_picture
			})

			this.getCNNRecom()

			uni.showLoading({
				title: "Loading"
			});
			Promise.all([
				this.getSimilar(),
				this.getUserRecom()
			]).then(() => {
				uni.hideLoading();
			});

		},
		methods: {
			/**
			 * 跳转到歌曲详情页
			 * @method go
			 * @param {Object} item 当前歌曲的详细信息
			 * @return {undefined}
			 */
			go(item) {
				//如歌没有播放歌曲 或者 播放的不是当前歌曲,则播放当前歌曲
				if (
					!this.$store.state.song ||
					this.$store.state.song.id !== item.id
				) {
					this.$store.dispatch("setGlobalData", {
						key: "song",
						value: item
					});
				}
				//改变播放列表
				this.insert_list(item);
				uni.navigateTo({
					url: `/pages/Song/index?id=${item.id}`
				});
			},

			// 重新请求CNN推荐
			retry() {
				console.log("重新请求CNN推荐......")
				this.tips = "尝试重新分析中......"
				this.btShow = false
				this.getCNNRecom()
			},

			/**
			 * 获取基于CNN的推荐
			 * @method getCNNRecom
			 * @return {Promise}
			 */
			getCNNRecom() {
				return getCNNRecom({
					song_id: getApp().globalData.base_track_id //获取全局变量
				}).then(res => {
					console.log("CNN推荐结果：", res)
					this.isLoading = true
					if (res['code'] !== '200' || res['recommendations'] == null) {
						this.tips = "Oops...分析出现了点小问题。"
						this.btShow = true
					} else {
						this.isLoading = false
						let recom_song = res['recommendations']
						for (let i = 0, len = recom_song.length; i < len; i++) {
							let recom_genre = 'unknow'
							switch (recom_song[i][0]["parent_genre"]) {
								case 'Breakbeat':
									recom_genre = "碎拍"
									break;

								case 'Dancehall/Ragga':
									recom_genre = "雷鬼"
									break;

								case 'Downtempo':
									recom_genre = "缓拍"
									break;

								case 'Drum And Bass':
									recom_genre = "鼓打贝斯"
									break;

								case 'Funky House':
									recom_genre = "放克/电子"
									break;

								case 'Hip Hop/R&B':
									recom_genre = "嘻哈说唱"
									break;

								case 'Minimal House':
									recom_genre = "极简电子"
									break;

								case 'Rock/Indie':
									recom_genre = "独立摇滚"
									break;

								case 'Trance':
									recom_genre = "迷幻舞曲"
									break;

								default:
									recom_genre = "其他类型"
									break;
							}
							this.CNNRecomList.push({
								ar: recom_song[i][0]["release_artist"],
								name: recom_song[i][0]["track_name"].split('-')[0],
								genre: recom_genre
							})
						}
					}
				}).catch(e => {
					console.log('CNN请求错误：', e)
				});
			},
			/**
			 * 获取基于物品的推荐
			 * @method getSimilar
			 * @return {Promise}
			 */
			getSimilar() {
				getSimilar({
					id: getApp().globalData.base_track_id //获取全局变量
				}).then(res => {
					console.log("物品推荐结果：", res)
					// 推荐结果
					for (let key in res) {
						if (key == 'code') continue
						let item = res[key]
						this.SimilarList.push({
							song_id: item.song_id,
							full_song_name: (item.artist_name + ' - ' + item.song_name),
							album_pic: item.album_picture,
						});
					}
				});
			},
			/**
			 * 获取基于用户的推荐
			 * @method getBanner
			 * @return {Promise}
			 */
			getUserRecom() {
				getUserRecom({
					user_id: getApp().globalData.user_id // 全局用户id
				}).then(res => {
					console.log("用户推荐歌曲id结果：", res)
					if (res['code'] == '200') {
						// 推荐结果
						let recommendations = res['recommendations']
						for (let key in recommendations) {
							let recommend_track_id = recommendations[key];
							// 根据id查询歌曲详情
							getDetail({
								id: recommend_track_id
							}).then(data => {
								// 解析数据到响应式数组中
								console.log('用户推荐歌曲详情：', data)
								if (data.hasOwnProperty('0')) {
									let temp = data[0]
									this.UserRecomList.push({
										song_id: temp.song_id,
										full_song_name: (temp.artist_name + ' - ' + temp.song_name),
										album_pic: temp.album_picture,
									});
								} else {
									this.UserRecomList.push({
										song_id: data.song_id,
										full_song_name: (data.artist_name + ' - ' + data.song_name),
										album_pic: data.album_picture,
									})
								}
							})
						}
					}
				});
			}
		}
	};
</script>

<style lang='scss' scoped>
	// /deep/ .van-tab--active {
	//     color: #dd001b;
	// }
	image {
		width: 100%;
		height: 200px;
	}

	swiper {
		height: 200px;
	}

	.cell-title {
		font-size: 32rpx;
		margin-top: 20rpx;
		margin-bottom: 10rpx;
		padding: 0 15px;
	}

	.cell-SongSheet {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0 8px;
	}

	van-icon {
		position: relative;
		top: 5px;
	}

	.coverBox {
		position: relative;
		background: url(//s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg?f01a252…=) no-repeat;
		background-size: cover;
		height: 146px;
		display: flex;
		justify-content: center;
		flex-direction: column;
		padding-left: 15px;

		.cover {
			background: url(../../static/defaultMusicAvatar.jpg) no-repeat;
			background-size: 100px 100px;
			width: 100px;
			height: 100px;
			border-radius: 10rpx;
		}

		.time {
			color: hsla(0, 0%, 100%, 0.8);
			font-size: 12px;
			transform: scale(0.91);
			transform-origin: left top;
			margin-top: 10px;
		}
	}

	.SongList {
		.header {
			display: flex;
			border-radius: 13px 13px 0 0;
			height: 45px;
			line-height: 45px;
			background-color: #fff;
			align-items: center;
			font-size: 30rpx;
			border-bottom: 1px solid #eee;
			overflow: hidden;

			image {
				width: 20px;
				height: 20px;
				margin-right: 15px;
				margin-left: 15px;
			}

			.left {
				margin-right: auto;
				color: #333;

				Text {
					color: #999;
				}
			}

			.right {
				height: 100%;
				margin: 0 10px;
				background-color: red;
				color: #fff;
				text-align: center;
				min-width: 150px;
			}
		}

		.item {
			display: flex;
			align-items: center;
			padding: 0 15px;
			font-size: 30rpx;
			color: #333;
			height: 50px;

			.left {
				margin-right: 20px;
				color: #888;
			}

			.box {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #eee;
				padding-right: 15px;
				height: 100%;
				overflow: hidden;

				.middle {
					display: flex;
					flex-direction: column;
					flex: 0 0 90%;
					overflow: hidden;

					text {
						font-size: 24rpx;
						color: #888;
						margin-top: 1px;
					}

					.ellipsis {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}

				/* .right {
					image {
						width: 25px;
						height: 25px;
						margin-top: 3px;
					}
				} */
			}
		}
	}
</style>
