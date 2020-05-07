import config from '../config/index';

function Api(path, data = {}) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.serverUrl + path,
			data: data,
			header: {
				// 'content-type': 'application/json'
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'POST',
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
//歌曲详情(自己写的)
const getSongDetail = (data = {}) => new Api('/page/play_music.php', data);
//歌曲详情(原接口，用于用户CF推荐)
const getDetail = (data = {}) => new Api('/page/get_music_detail.php', data);
//热歌榜
const getHot = (data = {}) => new Api('/page/get_new_music.php', data);
//获取用户信息
const getUserInfo = (data = {}) => new Api('/page/_get_userinfor.php', data);
//用户评分记录
const getRating = (data = {}) => Api('/page/get_user_rating_all.php', data);
//注册
const register = (data = {}) => Api('/page/register.php', data);
//登录
const login = (data = {}) => Api('/page/login.php', data);
//退出登录
const logout = (data = {}) => Api('/page/logout.php', data);
//输入时用户冲突检测
const checkUser = (data = {}) => Api('/page/check_user_name.php', data);

//原接口列表
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
// const getHot = (data = {}) => new Api('/top/list', data);

export {
	getCNNRecom,
	getSimilar,
	getUserRecom,
	search,
	getHot,
	getSongDetail,
	getDetail,
	getUserInfo,
	getRating,
	register,
	login,
	logout,
	checkUser
};
