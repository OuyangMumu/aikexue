var ResList = [
	"zgsz",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
	],
	seeList: [
		res.img_see1
	],
	doNames:[
        "滴漏实验",
        "做个水钟"
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
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
		["seeExp1", function() {
			return new seeExp1()
		}]
	],
	addRes: {
	   see1:"res/extra/zgsz/json/see1.json",
	   bg_biao1:"res/extra/zgsz/json/bg_biao1.json",
	   bg_biao2:"res/extra/zgsz/json/bg_biao2.json",
	},
	addItems: [
	  "watch",
	  "ruler",
	  "counter",
	]
}