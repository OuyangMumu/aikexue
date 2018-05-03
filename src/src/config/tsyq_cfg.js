var ResList = [
	"tsyq", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
	noDo: true,
	seeList: [
		res.tsyq_see1,
		res.tsyq_see2,
	],
	seeNames:[
		"月球",
		"月球与地球的比较",
	],
	helpFile: res.tsyq_sysm, //帮助图片
	helpScale: 1.0, //帮助缩放值
	titleFile: res.tsyq_title,
	soundFile: res.tsyq_title_sound, //标题声音文件
	noShow: true,
	mainLoop: [ //主页轮播图片
		res.tsyq_loop1,
		res.tsyq_loop2,
		res.tsyq_loop3,
	],
	layerList: [ //实验入口 必须严格按照格式定义 seeExp%d doExp%d
		["seeExp1", function() {
			return new seeExp1()
		}],
		["seeExp2", function() {
			return new seeExp2()
		}],
	],
	addRes: { //本实验需要引用的额外资源 一般不需要 
		tsyq_see1_json: "res/extra/tsyqdmm/tsyq_see1_json.json",
		tsyq_see2_json: "res/extra/tsyqdmm/tsyq_see2_json.json",
		tsyq_bg_json: "res/extra/tsyqdmm/tsyq_bg.json",
	},
	addItems: [],
}