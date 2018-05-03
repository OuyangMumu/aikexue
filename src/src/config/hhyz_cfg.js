var ResList = [
	"hhyz", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(lhJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	noShow:true,
	doList: [
		res.img_do1, //做一做的图片列表 和实验的数量保持一致 后缀为csv文件中定义
	],
	seeList: [
		res.img_see1, //看一看的图片列表 定义同上
	],
	helpFile: res.hhyz_sysm, //帮助图片
	//helpScale: 0.42, //帮助缩放值
	titleFile: res.hhyz_title, //标题图片
	soundFile: res.hhyz_title_sound, //标题声音文件
	mainLoop: [ //主页轮播图片
		res.img_loop_1,
		res.img_loop_2,
		res.img_loop_3,
	],
	layerList: [ //实验入口 必须严格按照格式定义 seeExp%d doExp%d
		["seeExp1", function() {
			return new seeExp1()
		}],
		["doExp1", function() {
			return new doExp1()
		}],
	],
	addRes: { //本实验需要引用的额外资源 一般不需要
		hhyz_see1: "res/extra/hhyz/hhyz_seeExp1.json",
		hhyz_do1: "res/extra/hhyz/hhyz_doExp1.json",
	}
}