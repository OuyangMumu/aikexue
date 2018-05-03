var ResList = [
	"zzfy",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs1, ResList[i])
}

var mainInfo = {
	seeList: [
	],
	doList: [
	   res.title
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	noStudy:true,
	noSee:true,
	mainLoop: [
		res.img_loop_1,
		res.img_loop_2,
		res.img_loop_3
	],
	layerList: [
		["doExp1", function() {
			return new doExp1()
		}]
	],
	addRes: {
       zzfy_do1:"res/extra/zzfy/json/zzfy_do1.json",
	},
}