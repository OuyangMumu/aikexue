var ResList = [
	"xzykwqnl",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2,
		res.img_do3
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
		res.img_loop_3
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
	    see1:"res/extra/xzykwqnl/json/see1.json",
	    biao1:"res/extra/xzykwqnl/json/biao1.json",
	    biao2:"res/extra/xzykwqnl/json/biao2.json",
	    biao3:"res/extra/xzykwqnl/json/biao3.json",
	},
	addItems: [
	    "tubiao"
	]
}