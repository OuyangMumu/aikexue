var ResList = [
	"zdxz",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
	],
	doNames:["吸水性","抗拉性"],
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
	],
	addRes: {
	   startMv: "res/extra/zdxz/json/startMv.json",
	   do1: "res/extra/zdxz/json/do1.json",
	   do2: "res/extra/zdxz/json/do2.json",
	   zhiAc: "res/extra/zdxz/json/zhiAc.json",
	   dbz: "res/extra/zdxz/json/dbz.json",
	   dyz: "res/extra/zdxz/json/dyz.json",
	   dnz: "res/extra/zdxz/json/dnz.json",
	   dtz: "res/extra/zdxz/json/dtz.json",
	   dxz: "res/extra/zdxz/json/dxz.json",
	   zdxz_bg: "res/extra/zdxz/json/zdxz_bg.json",
	}
}