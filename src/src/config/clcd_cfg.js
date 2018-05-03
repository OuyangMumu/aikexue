var ResList = [
	"clcd",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1
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
		["seeExp1", function() {
			return new seeExp1()
		}]
	],
	addRes: {
	    seeJson:"res/extra/clcd/json/seeJson.json",
	    biao1:"res/extra/clcd/json/biao1.json",
	    // choseNode:"res/extra/clcd/json/choseNode.json",
	    // choseNode1:"res/extra/clcd/json/choseNode1.json",
	    // choseNode2:"res/extra/clcd/json/choseNode2.json",
	    // choseNode3:"res/extra/clcd/json/choseNode3.json",
	    
	    // biao2:"res/extra/clcd/json/biao2.json"
	},
	addItems: [
	  // "watch",
	  // "ruler",
	  // "counter",
	]
}