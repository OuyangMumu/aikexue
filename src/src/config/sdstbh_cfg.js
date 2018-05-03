var ResList = [
	"sdstbh",
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
	playMP4:true,
	helpFile: res.sysm,
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
		see1:"res/extra/sdstbh/json/sdstbh_see1.json",
		do1:"res/extra/sdstbh/json/sdstbh_do1.json",
		do2:"res/extra/sdstbh/json/sdstbh_do2.json",
		seeac:"res/extra/sdstbh/json/sdstbh_seenodeAc.json",
		shuidinode:"res/extra/sdstbh/json/sdstbh_shuidinode.json",
		ronghua:"res/extra/sdstbh/json/sdstbh_ranhuaAcnode.json",
		chuiac:"res/extra/sdstbh/json/sdstbh_chuifengjiAcnode.json",
		fengac:"res/extra/sdstbh/json/sdstbh_fengnode.json",
		shaoziac:"res/extra/sdstbh/json/sdstbh_shaoziAcnode.json",
		glassnode:"res/extra/sdstbh/json/sdstbh_glassaction.json",
		bjac:"res/extra/sdstbh/json/sdstbh_bjac.json",
		shizhi:"res/extra/sdstbh/json/sdstbh_shizhiAcnode.json",
		startMv:"res/extra/sdstbh/json/startMV.json"
	}
}