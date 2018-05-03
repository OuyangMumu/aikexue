var ResList = [
	"clbdkm",
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
        "观察我们的摆",
        "摆的研究"
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
		["doExp2", function() {
			return new doExp2()
		}],
		["seeExp1", function() {
			return new seeExp1()
		}]
	],
	addRes: {
		see1:"res/extra/clbdkm/json/see1.json",
		learnNode:"res/extra/clbdkm/json/learnNode.json",
	    startMv:"res/extra/clbdkm/json/cartoon.json",
	    biao1:"res/extra/clbdkm/json/biao1.json",
	    biao2:"res/extra/clbdkm/json/biao2.json",
	},
	addItems: [
	    "watch",
	  // "ruler",
	  // "counter",
	]
}