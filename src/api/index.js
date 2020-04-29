import config from '../config/index';

function Api(path, data = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			method: "POST",
			url: config.serverUrl + path,
			data: data,
			header: {
				'content-type': 'application/json'
			},
			success: res => {
				if (res.statusCode >= 200 && res.statusCode <= 300) {
					resolve(res.data);
				} else {
					if (res.errMsg) {
						uni.showToast({
							title: res.errMsg,
							icon: 'none',
							duration: 1000
						});
					} else {
						uni.showToast({
							title: '出错了',
							icon: 'none',
							duration: 1000
						});
						uni.hideLoading();
					}
				}
			},
			fail: err => {
				uni.showToast({
					title: err.errMsg,
					icon: 'none',
					duration: 1000
				});
				uni.hideLoading();
				reject(err);
			}
		});
	});
}
//CNN推荐
const getCNNRecom = (data = {}) => new Api('/page/get_similar_content_track.php', data)
//基于物品的协同过滤推荐
const getSimilar = (data = {}) => new Api('/page/get_similar_song.php', data)
//基于用户的协同过滤推荐
const getUserRecom = (data = {}) => new Api('/page/get_user_recommendation.php', data)
//搜索
const search = (data = {}) => new Api('/page/search_song_f_name.php', data);
//歌曲详情
const getSongDetail = (data = {}) => new Api('/page/play_music.php', data);

//首页轮播图
const getBanner = (data = {}) => new Api('/banner', data);
//推荐歌单
const getPersonalized = (data = {}) => new Api('/personalized', data);
//歌单详情
const getSongList = (data = {}) => new Api('/playlist/detail', data);
//歌曲详情
const getSong = (data = {}) => new Api('/song/url', data);
//获取歌词
const getLyric = (data = {}) => new Api('/lyric', data);
//热搜
const searchHot = (data = {}) => new Api('/search/hot', data);
//所有榜单--这个用歌单详情获取数据
const toplist = (data = {}) => new Api('/toplist', data);
//获取榜单---1热歌榜,
const getHot = (data = {}) => new Api('/top/list', data);

export {
	getCNNRecom,
	getSimilar,
	getUserRecom,
	search,
	getSongDetail,

	getBanner,
	getPersonalized,
	getSongList,
	getSong,
	getLyric,
	searchHot,
	toplist,
	getHot
};
