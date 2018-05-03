var ResList = [
	"hwsmhxm",
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
		}],
		["doExp3", function() {
			return new doExp3()
		}]
	],
	addRes: {
	    seeJson:"res/extra/hwsmhxm/json/seeJson.json",
	    doJson2:"res/extra/hwsmhxm/json/doJson2.json",
	    learncsb:"res/extra/hwsmhxm/json/learncsb.json",
	    ruWater:"res/extra/hwsmhxm/json/ruWater.json",
	    biao1:"res/extra/hwsmhxm/json/biao1.json",
	    biao2:"res/extra/hwsmhxm/json/biao2.json",
	},
	addItems: [
	  // "watch",
	  // "ruler",
	  // "counter",
	]
}