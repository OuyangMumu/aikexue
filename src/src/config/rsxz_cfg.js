var ResList = [
	"rsxz",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1
	],
	seeList: [
		res.img_see1
	],
	helpFile: res.rsxz_sysm,
	titleFile: res.rsxz_title,
	soundFile:res.rsxz_title_sound,
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
		["doExp1", function() {
			return new doExp1()
		}],
	],
	addRes: {
		allxingzuo: "res/extra/rsxz/json/rsxz_xingzuonode.json",
		rsxz_see1: "res/extra/rsxz/json/rsxz_see1.json",
		rsxz_star: "res/extra/rsxz/json/rsxz_star.json",
		rsxz_do1: "res/extra/rsxz/json/rsxz_do1.json"
	}
}