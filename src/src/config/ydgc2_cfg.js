var ResList = [
	"ydgc2",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	seeList: [
		res.img_see1,
		res.img_see2,
	],
	seeNames:[
	  "云的观察",
	  "云的分类"
	],
	doList: [
		res.img_do1,
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
		["seeExp1", function() {
			return new seeExp1()
		}],
		["seeExp2", function() {
			return new seeExp2()
		}]
	],
	addRes: {
		 learn_csb:"res/extra/ydgc2/json/learn_csb.json",
		 see1:"res/extra/ydgc2/json/see1.json",
		 see2:"res/extra/ydgc2/json/see2.json",
		 gcnode:"res/extra/ydgc2/json/gcnode.json",
		 ydgc2_bg:"res/extra/ydgc2/json/ydgc2_bg.json"
	},
}