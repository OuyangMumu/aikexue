var ResList = [
	"Gswfl", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	doList: [
		res.gswfl_do1, //做一做的图片列表 和实验的数量保持一致 后缀为csv文件中定义
		res.gswfl_do1, 
	],
	doNames:[
		"植物类",
		"动物类",
	],
	seeList: [
		res.gswfl_see1, //看一看的图片列表 定义同上
	],
	helpFile: res.gswfl_sysm, //帮助图片
	helpScale: 0.42, //帮助缩放值
	titleFile: res.gswfl_title, //标题图片
	soundFile: res.gswfl_title_sound, //标题声音文件
	mainLoop: [ //主页轮播图片
		res.gswfl_loop1,
		res.gswfl_loop2,
		res.gswfl_loop3,
	],
	layerList: [ //实验入口 必须严格按照格式定义 seeExp%d doExp%d
		["seeExp1", function() {
			return new seeExp1()
		}],
		["doExp1", function() {
			return new doExp1()
		}],
		["doExp2", function() {
			return new doExp2()
		}],
	],
	addRes: { //本实验需要引用的额外资源 一般不需要
		gswfl_do_json: "res/extra/gswfl/gswfl_do1.json",
		gswfl_see_json: "res/extra/gswfl/gswfl_btns.json",
	}
}