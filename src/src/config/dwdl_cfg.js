var ResList = [
	"dwdl",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	seeList: [
		res.img_see1,
		res.img_see2
	],
	seeNames:[
	 "认一认",
	 "鸡蛋的结构"
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	noDo:true,
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
		}]
	],
	addRes: {
	    learn:"res/extra/dwdl/json/dwdl_learn.json",
	    see1:"res/extra/dwdl/json/dwdl_see1.json",
	    see2:"res/extra/dwdl/json/dwdl_see2.json"
	}
}