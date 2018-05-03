var ResList = [
	"wswdgyg",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1
	],
	seeList: [
		res.img_see1,
		res.img_see2
	],
	seeNames:[
        "认识微生物",
        "微生物分类"
	],
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
		["doExp1", function() {
			return new doExp1()
		}],
		["seeExp1", function() {
			return new seeExp1()
		}],
		["seeExp2", function() {
			return new seeExp2()
		}]
	],
	addRes: {
	    see1:"res/extra/wswdgyg/json/see1.json",
	    see2:"res/extra/wswdgyg/json/see2.json",
	    do1:"res/extra/wswdgyg/json/do1.json",
	},
	addItems: [
	
	]
}