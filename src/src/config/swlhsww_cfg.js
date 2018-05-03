var ResList = [
	"swlhsww", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	doList: [
		res.do1,
		res.do2,
	],
	seeList: [
		res.see1,
	],
	helpFile: res.sysm, //帮助图片
	helpScale: 1.0, //帮助缩放值
	titleFile: res.title,
	soundFile: res.title_sound, //标题声音文件
	noShow: true,
	mainLoop: [ //主页轮播图片
		res.loop1,
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
	],
	addRes: { //本实验需要引用的额外资源 一般不需要 
		swl_see: "res/extra/swlhsww/swl_see.json",
		swl_do: "res/extra/swlhsww/swl_do.json",
		swl_dahai: "res/extra/swlhsww/swl_haiyang.json",
		swl_caoyuan: "res/extra/swlhsww/swl_caoyuan.json",
		swl_chitang: "res/extra/swlhsww/swl_chitang.json",
		swl_shulin: "res/extra/swlhsww/swl_shulin.json",
		swl_shamo: "res/extra/swlhsww/swl_shamo.json",
		swl_daotian: "res/extra/swlhsww/swl_daotian.json",
		swl_act: "res/extra/swlhsww/swl_act.json",
		swl_act2: "res/extra/swlhsww/swl_act2.json",
	},
	addItems: [],
	playMP4: true,
}