var ResList = [
	"shszq",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
	],
	seeList: [
		res.img_see1,
		res.img_see2
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
		["seeExp2", function() {
			return new seeExp2()
		}],
		["doExp1", function() {
			return new doExp1()
		}],
		["doExp2", function() {
			return new doExp2()
		}],
	],
	addRes: {
		see1:"res/extra/shszq/json/shszq_see1.json",
		see2:"res/extra/shszq/json/shszq_see2.json",
		do1:"res/extra/shszq/json/shszq_do1.json",
		do2:"res/extra/shszq/json/shszq_do2.json",	
		wenac:"res/extra/shszq/json/shszq_wenac.json",
		fenzi:"res/extra/shszq/json/shszq_fenziParent.json",
		fenziac:"res/extra/shszq/json/shszq_fenziac.json",
		shuiwuac:"res/extra/shszq/json/shszq_shuiwu.json",
		hotac:"res/extra/shszq/json/shszq_hotAni.json",
		diguanac:"res/extra/shszq/json/shszq_diguanac.json",
		shuiqiac:"res/extra/shszq/json/shszq_shuiqiac.json",
		denggai:"res/extra/shszq/json/shszq_denggai.json",
		dishuiac:"res/extra/shszq/json/shszq_dishui.json",
		dishuiac:"res/extra/shszq/json/shszq_dishui.json",
		biaoge:"res/extra/shszq/json/shszq_bg.json"
	}
}