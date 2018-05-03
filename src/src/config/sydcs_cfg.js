var ResList = [
	"sydcs", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	doList: [
		res.do1,
		res.do2,
		res.do3,
		res.do4,
	],
	seeList: [
		res.see1,
		res.see2,
		res.see3,
	],
	seeNames:[
		"固体",
		"液体",
		"气体",
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
		["doExp3", function() {
			return new doExp3()
		}],
		["doExp4", function() {
			return new doExp4()
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
		action: "res/extra/sydcs/action.json",
		sydcs_see:"res/extra/sydcs/sydcs_see.json",
		sydcs_do:"res/extra/sydcs/sydcs_do.json",
		sydcs_bg:"res/extra/sydcs/sydcs_bg.json"
	},
	addItems: [
	],
	playMP4: true,
}