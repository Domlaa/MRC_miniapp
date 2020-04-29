<template>
	<View class="Recommend">
		<!-- CNN 推荐展示区 -->
		<View class="Hot SongList">
			<View class="coverBox">
				<View class="cover" />
				<Text class="time">根据歌曲 {{ base_track_name }} 的推荐</Text>
			</View>
			<View class="item" :key="index" v-for="(item, index) in CNNRecomList" @click="go(item)">
				<View class="left">{{ index + 1 }}</View>
				<View class="box">
					<View class="middle">
						<View class="ellipsis">{{ item.name }}</View>
						<Text class="ellipsis">
							{{
		                        item.ar
		                            .map(i => {
		                                return i.name;
		                            })
		                            .join(" / ") +
		                            " - " +
		                            item.name
		                    }}
						</Text>
					</View>
					<!-- 风格标签（待定） -->
					<!-- <View class="right" @click.stop="play(item)">
						<Image :src="
		                        !audio_paused && item.id == audio_id
		                            ? require('../../static/pause-item.png')
		                            : require('../../static/play-list.png')
		                    " />
					</View> -->
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
			<SongSheet v-for="(item, index) in SimilarList" :key="index" :Oid="item.song_id" :name="item.song_name" :picUrl="item.album_pic + '?imageView&thumbnail=250x0'" />
		</View>

		<!-- 基于用户的协同过滤推荐展示区 -->
		<View @click="go('排行榜')" class="cell-title">
			基于用户的协同过滤推荐
			<van-icon name="arrow" size="20px" color="#999" />
		</View>
		<View class="cell-SongSheet">
			<SongSheet v-for="(item, index) in toplist" :key="index" :Oid="item.id" :name="item.name" :picUrl="item.picUrl + '?imageView&thumbnail=250x0'"
			 :playCount="item.playCount" />
		</View>
	</View>
</template>

<script>
	import {
		getBanner,
		getSimilar,
		toplist
	} from "../../api/index";
	import VanIcon from "../../wxcomponents/vant-weapp/icon/index";
	import SongSheet from "../../components/SongSheet";

	export default {
		components: {
			SongSheet,
			VanIcon
		},
		data() {
			return {
				base_track_name: '测试歌曲', //根据推荐的歌曲
				banner: [], //轮播图
				CNNRecomList: [], //CNN推荐结果
				SimilarList: [], //基于物品推荐的歌曲
				UserRecomList: [], //基于用户推荐的歌曲
				current: 0,
				show: [0, 1] //表示已经显示过的banner
			};
		},
		created() {
			uni.showLoading({
				title: "loading"
			});

			Promise.all([
				this.getBanner(),
				this.getSimilar(),
				this.gettoplist()
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
			swiperChange(e) {
				if (this.show.includes(e.detail.current)) return;
				this.show = this.show.concat([e.detail.current]);
			},

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
			 * 请求banner图
			 * @method getBanner
			 * @return {Promise}
			 */
			getBanner() {
				return getBanner().then(res => {
					for (let item of res.banners) {
						this.banner.push(item.imageUrl);
					}
				});
			},
			/**
			 * 获取基于物品的推荐
			 * @method getBanner
			 * @return {Promise}
			 */
			getSimilar() {
				getSimilar({
					id: '1362573686' //歌曲：Lighter Than Air (Mixed)
				}).then(res => {
					// let random = Math.floor(
					// 	Math.random() * (res.result.length - 5)
					// );
					console.log("物品推荐结果：", res)
					// 推荐结果
					for (let item of res) {
						this.SimilarList.push({
							song_id: item.song_id,
							full_song_name: (item.artist_name + ' - ' + item.song_name),
							album_pic: item.album_picture,
						});
					}
				});
			},
			/**
			 * 获取榜单
			 * @method getBanner
			 * @return {Promise}
			 */
			gettoplist() {
				toplist().then(res => {
					let random = Math.floor(Math.random() * (res.list.length - 5));
					// 随机取5个
					for (let item of res.list.slice(random, random + 6)) {
						this.toplist.push({
							id: item.id,
							name: item.name,
							picUrl: item.coverImgUrl,
							playCount: item.playCount
						});
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
</style>
