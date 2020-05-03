import {
	UPDATE,
	SETGLOBALDATA,
	PREVSONG,
	NEXTSONG
} from './constants.js'
import {
	getSongDetail
} from '../api/index'

const actions = {
	update({
		commit
	}, payload) {
		let {
			item
		} = payload
		getSongDetail({
			song_id: item.id
		}).then(res => {
			console.log("获取的歌曲的详情:", res)
			if (!res.song_url) {
				console.log('该首歌曲无法播放')
				uni.showModal({
					title: '抱歉',
					content: '该首歌曲无法播放'
				})
			}
			commit(UPDATE, {
				src: res.song_url,
				coverImgUrl: item.al.picUrl,
				singer: item.ar
					.map(i => {
						return i.name
					})
					.join(' / '),
				title: item.name,
				id: item.id,
				_name: item.name,
				_singer: item.ar
					.map(i => {
						return i.name
					})
					.join(' / '),
				_picUrl: item.al.picUrl,
				song: item,
				callback: payload.callback
			})
		})
	},
	setGlobalData({
		commit
	}, payload) {
		commit(SETGLOBALDATA, payload)
	},
	prev({
		commit
	}, payload) {
		commit(PREVSONG, payload)
	},
	next({
		commit
	}, payload) {
		commit(NEXTSONG, payload)
	}
}

export default actions
