var ResList = [
	"zglzz",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1,
		res.img_do2
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	noSee:true,
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
	],
	addRes: {
		zglzz_huoxin: "res/extra/zglzz/json/zglzz_huoxin.json",
		zglzz_xue: "res/extra/zglzz/json/zglzz_xue.json",
		zglzz_do2:"res/extra/zglzz/json/zglzz_do2.json",
		zglzz_do1:"res/extra/zglzz/json/zglzz_do1.json",
		zglzz_chuimie:"res/extra/zglzz/json/zglzz_chuimie.json",
		zglzz_duanxian:"res/extra/zglzz/json/zglzz_duanxian.json",
		zglzz_biaoge:"res/extra/zglzz/json/zglzz_biaoge.json"
	},
	addItems: [
		"ruler",
		"counter",
	]
}