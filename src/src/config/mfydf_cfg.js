var ResList = [
	"mfydf",
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
	doNames:[
	  "观察大米",
	  "米粒和米饭",
	  "滴碘酒"
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
        mfydf_learn:"res/extra/mfydf/json/mfydf_learn.json",
        mfydf_bg:"res/extra/mfydf/json/mfydf_bg.json",
        mfydf_bg1:"res/extra/mfydf/json/mfydf_bg1.json",
        Mv:"res/extra/mfydf/json/mfydf_see.json",
        startMv:"res/extra/mfydf/json/startMv.json",
	},
}