var ResList = [
	"dplxy",
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
		res.img_do1
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
		}]
	],
	addRes: {
	    //seeJson:"res/extra/gg/json/seeJson.json",
	    // cartoonJson:"res/extra/ctdlj/json/cartoonJson.json",
	    // biao1:"res/extra/ctdlj/json/biao1.json",
	    // biao2:"res/extra/lddkq/json/biao2.json",
	    // biao3:"res/extra/lddkq/json/biao3.json"
	},
	addItems: [
	  // "watch",
	  // "ruler",
	  // "counter",
	]
}