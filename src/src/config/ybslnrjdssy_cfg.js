var ResList = [
	"ybslnrjdssy",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	seeList: [
		res.img_see1
	],
	doList:[
		res.img_do1,
		res.img_do2,
		res.img_do3
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
		["doExp2", function() {
			return new doExp2()
		}],
		["doExp3", function() {
			return new doExp3()
		}],
		["seeExp1", function() {
			return new seeExp1()
		}]
	],
	addRes: {
		  seeAc:"res/extra/ybslnrjdssy/json/seeAc.json",
		  rongDo:"res/extra/ybslnrjdssy/json/rongDo.json",
		  bg_biao:"res/extra/ybslnrjdssy/json/bg_biao.json",
		  bg_biao2:"res/extra/ybslnrjdssy/json/bg_biao2.json",
	},
	addItems: [
	     "tp",
		"counter"
	]
}