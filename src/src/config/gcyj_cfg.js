var ResList = [
	"gcyj",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	seeList: [
		res.img_see1
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
		["doExp1", function() {
			return new doExp1()
		}]
	],
	addRes: {
	    seeJson:"res/extra/gcyj/json/seeJson.json",
	    doJson:"res/extra/gcyj/json/doJson.json"
	},
	addItems: [
	  // "watch",
	  // "ruler",
	  // "counter",
	]
}