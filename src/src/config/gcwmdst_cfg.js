var ResList = [
	"gcwmdst",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
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
		res.img_loop_3,
	],
	layerList: [
		["seeExp1", function() {
			return new seeExp1()
		}],
		["doExp1", function() {
			return new doExp1()
		}],
	],
	addRes: {
		gcst_tiaosheng: "res/extra/gcwmdst/json/gcst_tiaosheng.json",
		gcst_do1: "res/extra/gcwmdst/json/gcst_do1.json",
		gcst_see1: "res/extra/gcwmdst/json/gcst_see1.json",
		gcst_tiao: "res/extra/gcwmdst/json/gcst_tiao.json",
	}
}