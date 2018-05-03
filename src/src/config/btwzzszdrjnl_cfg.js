var ResList = [
	"btwzzszdrjnl",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
	],
	doNames:[
	  "食盐和小苏打在水中\n的溶解能力",
	  "气体在水中的溶解能力"
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	noSee:true,
	mainLoop: [
		res.img_loop_1,
		res.img_loop_2,
		res.img_loop_3
	],
	layerList: [
		["doExp1", function() {
			return new doExp1()
		}],
		["doExp2", function() {
			return new doExp2()
		}],
	],
	addRes: {
        do_yao:"res/extra/btwzzszdrjnl/json/do_yao.json",
        do_xi:"res/extra/btwzzszdrjnl/json/do_xi.json",
        do1:"res/extra/btwzzszdrjnl/json/do1.json",
        do_rong:"res/extra/btwzzszdrjnl/json/do_rong.json",
        bg:"res/extra/btwzzszdrjnl/json/bg.json",
	},
	addItems: [
		"counter"
	]
}