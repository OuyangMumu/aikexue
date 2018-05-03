var ResList = [
	"jzhyd",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1
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
		}]
	],
	addRes: {
	    see1:"res/extra/jzhyd/json/see1.json",
	    do1:"res/extra/jzhyd/json/do1.json",
	    biao1:"res/extra/jzhyd/json/biao1.json",
	},
	addItems: [
	  // "watch",
	  // "ruler",
	  // "counter",
	]
}