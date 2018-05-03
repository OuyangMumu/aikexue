var ResList = [
	"cldrx", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	doList: [
		res.cldrx_do1,
	],
	seeList: [
		res.cldrx_see1,
		res.cldrx_see2,
	],
	seeNames:[
		"认识韧性",
		"认识塑料",
	],
	helpFile: res.cldrx_sysm, //帮助图片
	helpScale: 1.0, //帮助缩放值
	titleFile: res.cldrx_title,
	soundFile: res.cldrx_title_sound, //标题声音文件
	noShow: true,
	mainLoop: [ //主页轮播图片
		res.cldrx_loop1,
		res.cldrx_loop2,
		res.cldrx_loop3,
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
		}]
	],
	addRes: { //本实验需要引用的额外资源 一般不需要 
		see_btns: "res/extra/cldrx/cldrx_btns.json",
		see_biaoge: "res/extra/cldrx/cldrx_see.json",
		cldrx_do: "res/extra/cldrx/cldrx_do.json",
	},
	addItems: [
		"ruler",
	],
}