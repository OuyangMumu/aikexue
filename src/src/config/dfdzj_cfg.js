var ResList = [
	"dfdzj",
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
		res.img_do2,
		res.img_do3,
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	playMP4:true,
	mainLoop: [
		res.img_loop_1,
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
		}],
		["seeExp1", function() {
			return new seeExp1()
		}],
	],
	addRes: {
        startMv:"res/extra/dfdzj/json/startMv.json",
        learn_csb:"res/extra/dfdzj/json/learn_csb.json",
        dfdzj_see1:"res/extra/dfdzj/json/dfdzj_see1.json",
        dfdzj_bg:"res/extra/dfdzj/json/dfdzj_bg.json"
	},
}