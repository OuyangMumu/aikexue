var ResList = [
	"fzcl", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	doList: [
		res.fzcl_do1,
		res.fzcl_do2,
		res.fzcl_do3,
	],
	doNames:[
		"比较结实程度",
		"比较燃烧现象",
		"比较吸水性",
	],
	seeList: [
		res.fzcl_see1,
	],
	helpFile: res.fzcl_sysm, //帮助图片
	helpScale: 1.0, //帮助缩放值
	titleFile: res.fzcl_title,
	soundFile: res.fzcl_title_sound, //标题声音文件
	noShow: true,
	mainLoop: [ //主页轮播图片
		res.fzcl_loop1,
		res.fzcl_loop2,
		res.fzcl_loop3,
	],
	layerList: [ //实验入口 必须严格按照格式定义 seeExp%d doExp%d
		["doExp1", function() {
			return new doExp1()
		}],
		["doExp2", function() {
			return new doExp2()
		}],
		["doExp3", function() {
			return new doExp3()
		}],
		["seeExp1", function() {
			return new seeExp1()
		}],
	],
	addRes: { //本实验需要引用的额外资源 一般不需要 
		fzcl_see: "res/extra/fzcl/fzcl_see.json",
		fzcl_do1_json: "res/extra/fzcl/fzcl_do1.json",
		fzcl_biaoge: "res/extra/fzcl/fzcl_bg.json"
	},
	addItems: [
		"hand",
		"smell",
	],
}