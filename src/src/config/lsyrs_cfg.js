var ResList = [
	"Lsyrs",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(ccjJs, ResList[i])
}

var mainInfo = {
	//exp:"lsyrs",
	doList: [
		res.img_do1,
		res.img_do2
	],
	seeList: [
		res.img_see1,
		res.img_see2
	],
	helpFile: res.lsyrs_sysm,
	titleFile: res.lsyrs_title,
	soundFile: res.lsyrs_title_sound,
	mainLoop: [
		res.img_loop_1,
		res.img_loop_2,
		res.img_loop_3,
	],
	noShow: true,
	layerList: [
		["seeExp1", function() {
			return new seeExp1()
		}],
		["seeExp2", function() {
			return new seeExp2()
		}],
		["doExp2", function() {
			return new doExp2()
		}],
		["doExp1", function() {
			return new doExp1()
		}],
	],
	addRes: {
		nodesg: "res/extra/lshrs/nodesg.json",
		nodefront: "res/extra/lshrs/nodefront.json",
		lsyrs_do2: "res/extra/lshrs/lsyrs_do2.json",
		nodebg: "res/extra/lshrs/lsyrs_biaoge.json"
	},
	addItems: [
		"tp",
	],
}