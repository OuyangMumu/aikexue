var ResList = [
	"wdjldzzs",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
	],
	doNames:[
	"观察豌豆花",
	"数豌豆种子数"
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
		["doExp2", function() {
			return new doExp2()
		}],
	],
	addRes: {
		see1:"res/extra/wdjldzzs/json/see1.json",
		do1:"res/extra/wdjldzzs/json/wdjldzzs_do1.json",
		bg1:"res/extra/wdjldzzs/json/wdjldzzs_bg.json",
		bg2:"res/extra/wdjldzzs/json/wdjldzzs_bg2.json"
	}
}