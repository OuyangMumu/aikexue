var ResList = [
    "dxbjsdds",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    noSee:true,
    doNames:[
        "用小杯子量水的多少",
        "用大杯子量水的多少",
        "用简易天平“量”水的多少"
    ],
    doList: [
        res.img_do1,
        res.img_do2,
        res.img_do3
    ],
    helpFile: res.sysm,
    titleFile: res.title,
    soundFile: res.title_sound,
    mainLoop: [
        res.loop_1,
        res.loop_2,
        res.loop_3,
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
        }],
    ],
    addRes: {
        dxbjsdds_doExp3_json:"res/extra/dxbjsdds/dxbjsdds_doExp3.json",
    }
}