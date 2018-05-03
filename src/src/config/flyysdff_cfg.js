var ResList = [
	"flyysdff",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	seeList: [
		res.img_see1,
	],
	doList: [
		res.img_do1,
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
		["doExp1", function() {
			return new doExp1()
		}],
		["seeExp1", function() {
			return new seeExp1()
		}],
	],
	addRes: {
        expSee1:"res/extra/flyysdff/json/see1.json",
        learn_csb:"res/extra/flyysdff/json/learn_csb.json",
        // flyysdff_see1:"res/extra/flyysdff/json/flyysdff_see1.json",
        flyysdff_bg:"res/extra/flyysdff/json/flyysdff_bg.json"
	},
}