var ResList = [
	"hlyhlz",
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
	doNames:[
        "定滑轮",
        "动滑轮",
        "滑轮组"
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	noSee:true,
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
		["doExp3", function() {
			return new doExp3()
		}]
	],
	addRes: {
		startMv:"res/extra/hlyhlz/json/startMv.json",
		doJson:"res/extra/hlyhlz/json/doJson.json",
		biao1:"res/extra/hlyhlz/json/biao1.json",
		biao2:"res/extra/hlyhlz/json/biao2.json",
		biao3:"res/extra/hlyhlz/json/biao3.json"
	},
	addItems: [
	  // "ruler",
	  // "counter",
	]
}