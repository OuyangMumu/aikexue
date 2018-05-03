var ResList = [
	"ydgc", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	doList: [
		res.do1,
	],
	seeList: [
		res.see1,
		res.see2,
		res.see3,
	],
	seeNames:[
		"叶的组成",
		"禾本科植物叶",
		"叶片结构",
	],
	helpFile: res.sysm, //帮助图片
	helpScale: 1.0, //帮助缩放值
	titleFile: res.title,
	soundFile: res.title_sound, //标题声音文件
	noShow: true,
	mainLoop: [ //主页轮播图片
		res.loop1,
		res.loop2,
		res.loop3,
	],
	layerList: [ //实验入口 必须严格按照格式定义 seeExp%d doExp%d
		["doExp1", function() {
			return new doExp1()
		}],
		["seeExp1", function() {
			return new seeExp1()
		}],
		["seeExp2", function() {
			return new seeExp2()
		}],
		["seeExp3", function() {
			return new seeExp3()
		}],
	],
	addRes: { //本实验需要引用的额外资源 一般不需要 
		learn_bg: "res/extra/ydgc/ydgc_learn.json",
		see1_json: "res/extra/ydgc/ydgc_see1.json",
		see2_json: "res/extra/ydgc/ydgc_see2.json",
		see3_json: "res/extra/ydgc/ydgc_see3.json",
		do_bg:"res/extra/ydgc/ydgc_bg.json"
		// cldrx_do: "res/extra/cldrx/cldrx_do.json",
	},
	addItems: [
		"testLoop"
		// "ruler",
	],
}