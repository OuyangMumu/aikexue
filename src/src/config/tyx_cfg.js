var ResList = [
	"tyx", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	doList: [
		res.tyx_do1, //做一做的图片列表 和实验的数量保持一致 后缀为csv文件中定义
	],
	seeList: [
		res.tyx_see1, //做一做的图片列表 和实验的数量保持一致 后缀为csv文件中定义
	],
	helpFile: res.tyx_sysm, //帮助图片
	helpScale: 0.7, //帮助缩放值
	titleFile: res.tyx_title, //标题图片
	soundFile: res.tyx_title_sound, //标题声音文件
	noShow: true,
	mainLoop: [ //主页轮播图片
		res.tyx_loop1,
		res.tyx_loop2,
		res.tyx_loop3,
	],
	layerList: [ //实验入口 必须严格按照格式定义 seeExp%d doExp%d
		["doExp1", function() {
			return new doExp1()
		}],
		["seeExp1", function() {
			return new seeExp1()
		}],
	],
	addRes: { //本实验需要引用的额外资源 一般不需要
		tyx_see1: "res/extra/tyx/tyx_see.json",
		tyx_see_btn: "res/extra/tyx/tyx_see_btns.json",
		tyx_earth: "res/extra/tyx/tyx_earth.json",
		tyx_do: "res/extra/tyx/tyx_do.json"
	}
}