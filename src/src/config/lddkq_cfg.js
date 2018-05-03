var ResList = [
	"lddkq",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	seeList: [
		res.img_see1,
		res.img_see2
	],
	doList: [
		res.img_do1,
		res.img_do2
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
	    ["seeExp1", function() {
			return new seeExp1()
		}],
		["seeExp2", function() {
			return new seeExp2()
		}],
		["doExp1", function() {
			return new doExp1()
		}],
		["doExp2", function() {
			return new doExp2()
		}]
	],
	addRes: {
	    seeJson2:"res/extra/lddkq/json/seeJson2.json",
	    doJson:"res/extra/lddkq/json/doJson.json",
	    biao1:"res/extra/lddkq/json/biao1.json",
	    biao2:"res/extra/lddkq/json/biao2.json",
	    biao3:"res/extra/lddkq/json/biao3.json"
	},
	addItems: [
	  // "watch",
	  // "ruler",
	  // "counter",
	]
}