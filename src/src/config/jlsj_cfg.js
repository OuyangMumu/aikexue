var ResList = [
	"jlsj", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	doList: [
		res.jlsj_do1, //做一做的图片列表 和实验的数量保持一致 后缀为csv文件中定义
	],
	seeList: null,
	helpFile: res.jlsj_sysm, //帮助图片
	titleFile: res.jlsj_title, //标题图片
	soundFile: res.jlsj_title_sound, //标题声音文件
	noShow: true,
	noSee:true,
	mainLoop: [ //主页轮播图片
		res.jlsj_loop1,
		res.jlsj_loop2,
		res.jlsj_loop3,
	],
	layerList: [ //实验入口 必须严格按照格式定义 seeExp%d doExp%d
		["doExp1", function() {
			return new doExp1()
		}],
	],
	addRes: { //本实验需要引用的额外资源 一般不需要
		jlsj_biaoge: "res/extra/jlhsj/jlsj_biaoge.json"
	},
	addItems:[
		"ruler",
		"watch",
		"car",
		"tubiao",
		"counter",
	]
}