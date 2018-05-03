var ResList = [
	"gdss",
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
		["doExp2", function() {
			return new doExp2()
		}],
		["seeExp1", function() {
			return new seeExp1()
		}]
	],
	addRes: {
		// do1:"res/extra/gdfs/json/do1.json",
	 //    do2:"res/extra/gdfs/json/do2.json",
	 //    see1:"res/extra/gdfs/json/see1.json",
	 //    biao1:"res/extra/gdfs/json/biao1.json"
	},
	addItems: [
	  // "watch",
	  // "ruler",
	  // "counter",
	]
}