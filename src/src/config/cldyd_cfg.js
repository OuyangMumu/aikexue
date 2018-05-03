var ResList = [
	"cldyd",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do,
		res.img_do1,
		res.img_do2,
		res.img_do3,
		res.img_do4
	],
	doNames:[
	  "比较硬度",
	  "光泽度",
	  "导热性",
	  "延展性",
	  "比较轻重"
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
         see1:"res/extra/cldyd/json/cldyd_see1.json",
		 do1:"res/extra/cldyd/json/cldyd_do1.json",
         do3:"res/extra/cldyd/json/cldyd_do3.json",
         do4:"res/extra/cldyd/json/cldyd_do4.json",
         moca:"res/extra/cldyd/json/cldyd_moca.json",
		 bgnode:"res/extra/cldyd/json/cldyd_bg.json"
	},
	addItems: [
		"tp"
	],
}