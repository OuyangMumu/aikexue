var ResList = [
	"ljdtmmnsy",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	seeList: [
		res.img_see1,
		res.img_see2
	],
	seeNames:[
	  "垃圾分类",
	  "新型垃圾场"
	],
	doList: [
		res.img_do1
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
	    ["seeExp1", function() {
			return new seeExp1()
		}],
		["seeExp2", function() {
			return new seeExp2()
		}],
		["doExp1", function() {
			return new doExp1()
		}]
	],
	addRes: {
		see1:"res/extra/ljdtmmnsy/json/see1.json",
		see2:"res/extra/ljdtmmnsy/json/see2.json",
	    bg_biao1:"res/extra/ljdtmmnsy/json/bg_biao1.json",
		// bg_biao2:"res/extra/zzsjzsj/json/bg_biao2.json",
	},
	addItems: [
	
	],
}