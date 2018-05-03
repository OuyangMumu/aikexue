var ResList = [
	"hdgc",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1
	],
	seeList: [
		res.img_see1,
		res.img_see2
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
	],
	addRes: {
		hdgc_see1: "res/extra/hdgc/json/hdgc_see1.json",
		hdgc_see2: "res/extra/hdgc/json/hdgc_see2.json",
		hdgc_do1: "res/extra/hdgc/json/hdgc_do1.json",
		hdgc_jiepuo:"res/extra/hdgc/json/hdgc_jiepuo.json"
	}
}