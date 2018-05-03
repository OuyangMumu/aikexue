var ResList = [
	"gckwdtz",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2,
		res.img_do3
	],
	doNames:[
	  "颜色和条痕",
	  "比较硬度",
	  "透明度、光泽和现象"
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
		["doExp3", function() {
			return new doExp3()
		}]
	],
	addRes: {
	   bg_biao1:"res/extra/gckwdtz/json/bg_biao1.json",
	   bg_biao2:"res/extra/gckwdtz/json/bg_biao2.json",
	   bg_biao3:"res/extra/gckwdtz/json/bg_biao3.json"
	},
	addItems: [
	
	],
}