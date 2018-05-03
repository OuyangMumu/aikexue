var ResList = [
	"gxdll",
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
		["seeExp1", function() {
			return new seeExp1()
		}],
		["doExp2", function() {
			return new doExp2()
		}]
	],
	addRes: {
	    seeJson:"res/extra/gxdll/json/seeJson.json",
	    learncsb:"res/extra/gxdll/json/learncsb.json",
	    biao1:"res/extra/gxdll/json/biao1.json",
	    biao2:"res/extra/gxdll/json/biao2.json",
	},
	addItems: [
	  // "watch",
	  // "ruler",
	  // "counter",
	]
}