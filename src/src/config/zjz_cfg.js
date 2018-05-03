var ResList = [
	"zjz",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
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
		}]
	],
	addRes: {
		doJson1:"res/extra/zjz/json/doJson1.json",
		biao1:"res/extra/zjz/json/biao1.json",
		biao2:"res/extra/zjz/json/biao2.json"
	},
	addItems: [
	  // "ruler",
	  // "counter",
	]
}