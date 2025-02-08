import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

var router = []
// #ifdef MP-WEIXIN
if (uni.getStorageSync('XCXIsSelect') == '是') {
	router = [{
			// pagePath(需以"/"开头)属性即可
			pagePath: "/pages/index/index",
			iconPath: "/static/tabbar/index.png",
			selectedIconPath: "/static/tabbar/index_.png",
			text: '首页',
		}, {
			// pagePath(需以"/"开头)属性即可
			pagePath: "/pages/jobhunt/index",
			iconPath: "/static/tabbar/qiuzhi.png",
			selectedIconPath: "/static/tabbar/qiuzhi_.png",
			text: '求职',
		},
		{
			pagePath: "/pages/fabu/index",
			// iconPath: "https://cdn.uviewui.com/uview/common/min_button.png",
			iconPath: "/static/tabbar/fabu.png",
			selectedIconPath: "/static/tabbar/fabu.png",
			text: '发布',
			// 在此配置midButton: true   在<u-tabbar 标签内配置  :mid-button="true"  表示此项为凸起按钮项
			midButton: true,
		},
		{
			pagePath: "/pages/blackBoss/index",
			iconPath: "/static/tabbar/backBoss.png",
			selectedIconPath: "/static/tabbar/backBoss_.png",
			text: '黑老板',
		},
		{
			pagePath: "/pages/my/index",
			iconPath: "/static/tabbar/my.png",
			selectedIconPath: "/static/tabbar/my_.png",
			text: '我的',
			count:0,
		}
	]
} else {
	router = [{
			// pagePath(需以"/"开头)属性即可
			pagePath: "/pages/index/index",
			iconPath: "/static/tabbar/index.png",
			selectedIconPath: "/static/tabbar/index_.png",
			text: '首页',
		},
		{
			pagePath: "/pages/my/index",
			iconPath: "/static/tabbar/my.png",
			selectedIconPath: "/static/tabbar/my_.png",
			text: '我的',
			count:0,
		}
	]
}

// #endif
// #ifndef MP-WEIXIN
router = [{
		// pagePath(需以"/"开头)属性即可
		pagePath: "/pages/index/index",
		iconPath: "/static/tabbar/index.png",
		selectedIconPath: "/static/tabbar/index_.png",
		text: '首页',
	}, {
		// pagePath(需以"/"开头)属性即可
		pagePath: "/pages/jobhunt/index",
		iconPath: "/static/tabbar/qiuzhi.png",
		selectedIconPath: "/static/tabbar/qiuzhi_.png",
		text: '求职',
	},
	{
		pagePath: "/pages/fabu/index",
		// iconPath: "https://cdn.uviewui.com/uview/common/min_button.png",
		iconPath: "/static/tabbar/fabu.png",
		selectedIconPath: "/static/tabbar/fabu.png",
		text: '发布',
		// 在此配置midButton: true   在<u-tabbar 标签内配置  :mid-button="true"  表示此项为凸起按钮项
		midButton: true,
	},
	{
		pagePath: "/pages/blackBoss/index",
		iconPath: "/static/tabbar/backBoss.png",
		selectedIconPath: "/static/tabbar/backBoss_.png",
		text: '黑老板',
	},
	{
		pagePath: "/pages/my/index",
		iconPath: "/static/tabbar/my.png",
		selectedIconPath: "/static/tabbar/my_.png",
		text: '我的',
		count:0,
	}
]
// #endif
const store = new Vuex.Store({
	state: {
		list: router
	},
	mutations: {
		setTagNum(val,num){
			val.list[val.list.length - 1].count = num
		},
	}
})

export default store