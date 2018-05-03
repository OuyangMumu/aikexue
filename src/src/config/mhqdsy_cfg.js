var ResList = [
	"mhqdsy",
]

for (var i = 0; i < ResList.length; i++) {
	getRes(gsrJs, ResList[i])
}

var mainInfo = {
	doList: [
		res.img_do1
	],
	seeList: [
		res.img_see1,
		res.img_see2,
		res.img_see3
	],
	seeNames:[
	  "干粉灭火器",
	  "二氧化碳灭火器",
	  "泡沫灭火器"
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
		["seeExp3", function() {
			return new seeExp3()
		}],
		["doExp1", function() {
			return new doExp1()
		}]
	],
	addRes:{
       see1:"res/extra/mhqdsy/json/mhq_see1.json",
       see2:"res/extra/mhqdsy/json/mhq_see2.json",
       see3:"res/extra/mhqdsy/json/mhq_see3.json",
       do1:"res/extra/mhqdsy/json/mhq_do1.json",
       ranshao:"res/extra/mhqdsy/json/mhq_ranshao.json",
       baoxian:"res/extra/mhqdsy/json/mhq_baoxian.json",
       penfen:"res/extra/mhqdsy/json/mhq_pen.json",
	   cco2:"res/extra/mhqdsy/json/mhq_co2.json",
	   paomoAc:"res/extra/mhqdsy/json/mhq_paomo.json"
	}
}