var ResList = [
	"jsgj", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	doList: [
		res.jsgj_do2, //做一做的图片列表 和实验的数量保持一致 后缀为csv文件中定义
		res.jsgj_do1,
	],
	seeList: [
		res.jsgj_see2, //做一做的图片列表 和实验的数量保持一致 后缀为csv文件中定义
		res.jsgj_see1,
	],
	doNames: [
		"时钟",
		"秒表"
	],
	seeNames: [
		"时钟",
		"秒表"
	],
	helpFile: res.jsgj_sysm, //帮助图片
	titleFile: res.jsgj_title, //标题图片
	soundFile: res.jsgj_title_sound, //标题声音文件
	noShow: true,
	//noSee:true,
	mainLoop: [ //主页轮播图片
		res.jsgj_loop1,
		res.jsgj_loop2,
		res.jsgj_loop3,
	],
	layerList: [ //实验入口 必须严格按照格式定义 seeExp%d doExp%d
		["doExp1", function() {
			return new doExp1()
		}],
		["doExp2", function() {
			return new doExp2()
		}],
		["seeExp1", function() {
			return new seeExp1()
		}],
		["seeExp2", function() {
			return new seeExp2()
		}],
	],
	addRes: { //本实验需要引用的额外资源 一般不需要
		jsgj_see1_json: "res/extra/jsgj/jsgj_see1.json",
		jsgj_see2_json: "res/extra/jsgj/jsgj_see2.json",
		jsgj_do1_json: "res/extra/jsgj/jsgj_do1.json",
		jsgj_do2_json: "res/extra/jsgj/jsgj_do2.json",
		jsgj_learn_json: "res/extra/jsgj/jsgj_learn.json",
	},
	addItems: [
		"clock",
		"watch",
		"tp",
	],
}