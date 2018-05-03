var ResList = [
	"tsysbhdyy",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	seeList: [
		res.img_see1
	],
	doList: [
		res.img_do1,
		res.img_do2,
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	mainLoop: [
		res.img_loop_1,
		res.img_loop_2,
		res.img_loop_3,
	],
	doNames:[
	   "温度对岩石的影响",
	   "植物根对岩石的影响"
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
		see1:"res/extra/tsysbhdyy/json/see1.json",
	},
}