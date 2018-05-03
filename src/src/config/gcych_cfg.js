var ResList = [
	"gcych",
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
		res.img_do1,
		res.img_do2
	],
	seeNames:["观察油菜","油菜花的组成"],
	doNames:["放大镜观察油菜花","观察油菜花"],
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
		}],
		["doExp2", function() {
			return new doExp2()
		}],
	],
	addRes: {
		see1: "res/extra/gcych/json/see1.json",
		see2: "res/extra/gcych/json/see2.json",
		do1: "res/extra/gcych/json/do1.json",
		gcych_bg: "res/extra/gcych/json/gcych_bg.json",
		gcych_bg1: "res/extra/gcych/json/gcych_bg1.json",
	}
}