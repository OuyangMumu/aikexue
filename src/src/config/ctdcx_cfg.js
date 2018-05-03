var ResList = [
	"ctdcx",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
	],
	seeList: [
		res.img_see1
	],
	helpFile: res.sysm,
	playMP4:true,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	mainLoop: [
        res.img_loop_1,
	],
	layerList: [
		["seeExp1", function() {
			return new seeExp1()
		}],
		["doExp1", function() {
			return new doExp1()
		}],
		["doExp2", function() {
			return new doExp2()
		}],
	],
	addRes: {
		see1:"res/extra/ctdcx/json/ctdcx_see1.json",
		do1:"res/extra/ctdcx/json/ctdcx_do1.json",
		do2:"res/extra/ctdcx/json/ctdcx_do2.json",
		startMV:"res/extra/ctdcx/json/ctdcx_startMV.json",
		xingfenNode:"res/extra/ctdcx/json/ctdcx_xinfenNode.json"
	}
}