<template>
	<View class="Recommend">
		<!-- CNN 推荐展示区 -->
		<View class="Hot SongList">
			<View class="coverBox">
				<View class="cover"></View>
				<Text class="time">以下推荐结果基于歌曲 {{ base_track_name }} 的推荐</Text>
			</View>
			<View @click="go('推荐歌单')" class="cell-title">
				基于深度学习的推荐
				<van-icon name="arrow" size="20px" color="#999" />
			</View>
			<View class="item" :key="index" v-for="(item, index) in SimilarList" @click="go(item)">
				<View class="left">{{ index + 1 }}</View>
				<View class="box">
					<View class="middle">
						<View class="ellipsis">{{ item.name }}</View>
						<Text class="ellipsis">22222
							<!-- {{
		                        item.ar
		                            .map(i => {
		                                return i.name;
		                            })
		                            .join(" / ") +
		                            " - " +
		                            item.name
		                    }} -->
						</Text>
					</View>
					<View class="right">
						<van-tag mark type="primary">风格名</van-tag>
					</View>
				</View>
			</View>
		</View>

		<!-- 基于物品的协同过滤推荐展示区 -->
		<View @click="go('推荐歌单')" class="cell-title">
			基于物品的协同过滤推荐
			<van-icon name="arrow" size="20px" color="#999" />
		</View>
		<View class="cell-SongSheet">
			<SongSheet v-for="(item, index) in SimilarList" :key="index" :song_item="item" :name="item.full_song_name" :picUrl="item.album_pic + '?imageView&thumbnail=250x0'" />
		</View>

		<!-- 基于用户的协同过滤推荐展示区 -->
		<View @click="go('排行榜')" class="cell-title">
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
		getUserRecom
	} from "../../api/index";
	import VanIcon from "../../wxcomponents/vant-weapp/icon/index";
	import VanTag from "../../wxcomponents/vant-weapp/tag/index";
	import SongSheet from "../../components/SongSheet";

	export default {
		components: {
			SongSheet,
			VanIcon,
			VanTag
		},
		data() {
			return {
				base_track_name: '测试歌曲', //根据推荐的歌曲
				CNNRecomList: [], //CNN推荐结果
				SimilarList: [], //基于物品推荐的歌曲
				UserRecomList: [], //基于用户推荐的歌曲
				// banner: [], //轮播图
				// current: 0,
				// show: [0, 1] //表示已经显示过的banner
			};
		},
		created() {
			uni.showLoading({
				title: "loading"
			});

			Promise.all([
				this.getCNNRecom(),
				this.getSimilar(),
				this.getUserRecom()
			]).then(() => {
				uni.hideLoading();
			});
		},
		methods: {
			/**
			 * 轮播图切换
			 * @method getBanner
			 * @return {Promise}
			 */
			// swiperChange(e) {
			// 	if (this.show.includes(e.detail.current)) return;
			// 	this.show = this.show.concat([e.detail.current]);
			// },

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

			// go(title) {
			// 	uni.navigateTo({
			// 		url: `/pages/SimilarList/index?name=${title}`
			// 	});
			// },
			/**
			 * 获取基于CNN的推荐
			 * @method getCNNRecom
			 * @return {Promise}
			 */
			getCNNRecom() {
				return getCNNRecom({
					song_id: '1367114879' //歌曲：Lighter Than Air (Extended Mix)
				}).then(res => {
					console.log("CNN推荐结果：", res)
					// for (let item of res.banners) {
					// 	this.banner.push(item.imageUrl);
					// }
				});
			},
			/**
			 * 获取基于物品的推荐
			 * @method getSimilar
			 * @return {Promise}
			 */
			getSimilar() {
				getSimilar({
					id: '1367114879' //歌曲：Lighter Than Air (Extended Mix)
				}).then(res => {
					console.log("物品推荐结果：", res)
					// 推荐结果
					for (let key in res) {
						if (key == 'code') continue
						let item = res[key]
						this.SimilarList.push({
							song_id: item.song_id,
							full_song_name: (item.artist_name + ' - ' + item.album_name),
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
					user_id: 'b64cdd1a0bd907e5e00b39e345194768e330d652' // root用户id
				}).then(res => {
					console.log("用户推荐结果：", res)
					// 推荐结果
					// for (let key in res) {
					// 	console.log("输出key：", key)
					// 	if (key == 'code') continue
					// 	let item = res[key]
					// 	this.SimilarList.push({
					// 		song_id: item.song_id,
					// 		full_song_name: (item.artist_name + ' - ' + item.album_name),
					// 		album_pic: item.album_picture,
					// 	});
					// }
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
			background: url(//s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28…=) no-repeat;
			background-size: 166px 97px;
			width: 142px;
			height: 67px;
			background-position: -24px -30px;
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
				padding: 0 8px;
				background-color: red;
				color: #fff;
				text-align: center;
				min-width: 110px;
			}
		}

		.item {
			display: flex;
			align-items: center;
			padding-left: 20px;
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

				.right {
					image {
						width: 25px;
						height: 25px;
						margin-top: 3px;
					}
				}
			}
		}
	}
</style>
