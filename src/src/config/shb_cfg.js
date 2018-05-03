var ResList = [
	"shb",
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
	addRes:{
		see1:"res/extra/shb/json/shb_see1.json",
		daoshuiac:"res/extra/shb/json/shb_daoshuinode.json",
		wenac:"res/extra/shb/json/shb_wenac.json",
		wenduji_res:"res/common/wenduji.json",
		miaobiao_res:"res/common/miaobiao.json",
		daoshui : "res/extra/shb/json/shb_daoshuiAc.json",
        daoyan : "res/extra/shb/json/shb_daoyanAc.json",
        jiaoban : "res/extra/shb/json/shb_jiaobanAc.json",
        jiebing : "res/extra/shb/json/shb_jiebing.json",
        baowenac : "res/extra/shb/json/shb_baowenbei.json",
        biaoge1: "res/extra/shb/json/shb_bg1.json",
        biaoge2: "res/extra/shb/json/shb_bg2.json",
        ice_ture:"res/extra/shb/json/shb_ice.json"
	},
	addItems:[
		"tubiao"
	]
}