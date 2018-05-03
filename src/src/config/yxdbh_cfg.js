var ResList = [
	"yxdbh", //csv文件中定义的实验标签
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i]) //读取指定开发者资源集中的指定实验资源
}

var mainInfo = { // 命名必须为mainInfo
	//exp:"lsyrs",
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
		["seeExp1", function() {
			return new seeExp1()
		}],
	],
	addRes: { //本实验需要引用的额外资源 一般不需要 
		action:"res/extra/yxdbh/action.json"
	},
	addItems: [
	],
	playMP4: true,
	noDo:true,
}