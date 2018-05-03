var ResList = [
	"zdgc",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2,
		res.img_do3,
		res.img_do4,
		res.img_do5,
	],
	doNames:[
		"测量厚度",
		"测量质量",
		"观察纸的纤维",
		"吸水性",
		"可燃性"
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	noSee:true,
	mainLoop: [
		res.img_loop_1,
		res.img_loop_2,
		res.img_loop_3,
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
		["doExp4", function() {
			return new doExp4()
		}],
		["doExp5", function() {
			return new doExp5()
		}]
	],
	addRes: {
         fire:"res/extra/zdgc/json/zdgc_shaozhi.json",
         see1_bg:"res/extra/zdgc/json/see1_bg.json",
         see2_bg:"res/extra/zdgc/json/see2_bg.json",
         see3_bg:"res/extra/zdgc/json/see3_bg.json",
	},
	addItems: [
	     "tp",
		"ruler",
		"counter"
	]
}