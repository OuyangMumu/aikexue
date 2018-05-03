var ResList = [
	"clfhl",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
	],
	doNames:[
	   "制作简易肺活量测量计",
	   "肺活量的测量"
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
		do1:"res/extra/clfhl/json/do1.json",
		do2:"res/extra/clfhl/json/do2.json",
		bg_biao1:"res/extra/clfhl/json/bg_biao1.json"
	},
	addItems: [
	   "ruler",
	   "counter",
	],
}