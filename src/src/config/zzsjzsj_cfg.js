var ResList = [
	"zzsjzsj",
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
	doNames:[
        "自制紫甘蓝水",
        "紫甘蓝水与酸碱性\n物质的变化",
        "用紫甘蓝水检测常见\n物质的酸碱性"
	],
	helpFile: res.sysm,
	titleFile: res.title,
	soundFile:res.sound_title,
	noShow:true,
	noSee:true,
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
		}]
	],
	addRes: {
		changeColor:"res/extra/zzsjzsj/json/changeColor.json",
		bg_biao1:"res/extra/zzsjzsj/json/bg_biao1.json",
		bg_biao2:"res/extra/zzsjzsj/json/bg_biao2.json",
	},
	addItems: [
	
	],
}