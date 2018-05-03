var ResList = [
	"gdzs",
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
	playMP4:true,
	mainLoop: [
		res.img_loop_1
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
	    do1:"res/extra/gdzs/json/do1.json",
	    startMv:"res/extra/gdzs/json/startMv.json",
	    biao1:"res/extra/gdzs/json/biao1.json",
	    heiye:"res/extra/gdzs/json/heiye.json",
	},
	addItems: [
	  // "watch",
	  // "ruler",
	  // "counter",
	]
}