# 原来小程序接口
### 首页轮播图 
* 接口地址：/banner
* 功能位置：推荐tab下，顶部轮播图
* 触发行为：getBanner()
* 相关文件：pages/Recommend/index.vue
* 请求类型：GET

### 云村推荐歌单
* 接口地址：/personalized

### 歌单详情
* 接口地址：/playlist/detail

### 歌曲信息
* 接口地址：/song/url

### 歌词
* 接口地址：/lyric

### 搜索
* 接口地址：/search

### 热门搜索
* 接口地址：/search/hot

### 所有榜单
* 接口地址：/toplist

### 热歌榜
* 接口地址：/top/list



# 推荐系统接口
### 搜索
* 接口地址：/page/search_song_f_name.php
* 功能位置：输入框搜索，点击搜索按钮时请求
* 触发行为：search_track_onclick()
* 相关文件：search_track.js
* 请求类型：POST
* 参数列表：

参数|说明
--|--
track_name|歌曲名
limit|返回歌曲条目数

* 返回值：多首歌曲的信息

### 获取内容相同的歌曲(CNN推荐结果)
* 接口地址：/page/get_similar_content_track.php
* 功能位置：基于CNN的相似歌曲推荐表格内容
* 触发行为：
* 相关文件：content_similar_track.js
* 请求类型：POST
* 参数列表：

参数|说明
--|--
song_id|歌曲id

* 返回值：CNN推荐的5首结果歌曲的详细信息，详细内容如下:
```
 {
    "id": 177239,
    "parent_genre": "Dancehall/Ragga",
    "release_artist": "AVALANCHE/TURBULENCE/NATURE/GHANDI/REAL BETTA LIFE",
    "release_cat_num": "RBLR 4617",
    "release_date": "05 May 17",
    "release_genre": "Dancehall/Ragga",
    "release_label": "Real Betta Life",
    "release_title": "Betta Life Riddim",
    "track_name": "Nature - \"Nuh Gun\" - (3:27)",
    "track_url": "https://www.junodownload.com/MP3/SF3403464-02-01-03.mp3"
}
```

### 获取基于物品的协同过滤推荐结果
* 接口地址：/page/get_similar_song.php
* 功能位置：
* 触发行为：点击播放歌曲时请求
* 相关文件：similar_track.js
* 请求类型：POST
* 参数说明：

参数|说明
--|--
id|歌曲id

* 返回值：5首相似的歌曲信息

### 获取基于用户的协同过滤推荐结果
* 接口地址：get_user_recommendation.php
* 功能位置：
* 触发行为：首次加载index页面时触发
* 相关文件：get_user_cf_recommendation.js
* 请求类型：POST
* 参数说明：

参数|说明
--|--
user_id|用户id

* 返回值：5首相似的歌曲信息

### 获取本地播放的歌曲信息
* 接口地址：/page/get_playing_information_local.php
* 功能位置：
* 触发行为：点击播放歌曲时请求
* 相关文件：music_play_local.js
* 请求类型：POST
* 参数说明：

参数|说明值
--|--
song_id|歌曲id

* 返回值：单首歌曲的信息

### 获取某用户评分的所有歌曲
* 接口地址：get_user_rating_all.php
* 功能位置：
* 触发行为：首次加载index页面时触发
* 相关文件：user_rating.js
* 请求类型：POST
* 参数说明：

参数|说明
--|--
user_id|用户id

* 返回值：所有评分歌曲的信息和评分值

### 获取用户对某首歌曲的评分
* 接口地址：get_user_2_track_rating.php
* 功能位置：
* 触发行为：点击播放歌曲时请求 (其他待定)
* 相关文件：user_track_rating.js
* 请求类型：POST
* 参数说明：

参数|说明
--|--
track_id|歌曲id
user_id|用户id

* 返回值：评分值

### 用户对当前歌曲进行评分
* 接口地址：/page/add_rating.php
* 功能位置：
* 触发行为：对歌曲进行星级评分后点击确认按钮
* 相关文件：user_rating.js
* 请求类型：POST
* 参数说明：

参数|说明
--|--
track_id|歌曲id
user_id|用户id
rating|评分值

### 获取网易云新歌榜歌曲
* 接口地址：/page/get_new_music.php
* 功能位置：
* 触发行为：首次加载index页面时触发
* 相关文件：new_track.js
* 请求类型：POST
* 参数说明：

参数|说明
--|--
limit|返回的结果数量

* 返回值：网易云音乐新歌榜的歌曲详情信息

### 获取网易云热歌榜歌曲
* 接口地址：/page/get_hotest_music.php
* 功能位置：
* 触发行为：首次加载index页面时触发
* 相关文件：hot_track.js
* 请求类型：POST
* 参数说明：

参数|说明
--|--
limit|返回的结果数量

* 返回值：网易云音乐热歌榜的歌曲详情信息

### 注册时用户检测
* 接口地址：page/check_user_name.php
* 功能位置：注册登录页面的注册标签
* 触发行为：用户名输入框失去焦点时 和 点击注册按钮时
* 相关文件：login.html
* 请求类型：POST
* 参数说明：

参数|说明
--|--
user_name|输入的用户名

* 返回值：状态码

### 新用户注册
* 接口地址：page/register.php
* 功能位置：注册登录页面的注册按钮
* 触发行为：点击注册按钮时
* 相关文件：login.html
* 请求类型：POST
* 参数说明：form表单 action=register.php

参数|说明
--|--
to|reg (不明)
did|0 (不明)
user|注册的用户名
passwd|对应的密码

* 返回值：(⊙﹏⊙)  弹窗显示注册成功,请登录

### 获取用户信息
* 接口地址：page/_get_userinfor.php
* 功能位置：
* 触发行为：点击播放歌曲时请求 (其他待定)
* 相关文件：user_information.js
* 请求类型：POST
* 参数说明：无参数
* 返回值：username 和 userid

### 用户登录
* 接口地址：page/login.php
* 功能位置：注册登录页面的登录按钮
* 触发行为：点击登录按钮时
* 相关文件：login.html
* 请求类型：POST
* 参数说明：form表单 action=page/login.php

参数|说明
--|--
to|reg (不明)
did|0 (不明)
username|注册的用户名
password|对应的密码
submit|登 录 (不明)

* 返回值：(⊙﹏⊙)  弹窗显示注册成功,请登录

### 退出登录（注销）
* 接口地址：/page/logout.php?action=logout
* 功能位置：
* 触发行为：用户注销按钮
* 相关文件：index.html
* 请求类型：GET
* 参数说明：url拼接 action=logout