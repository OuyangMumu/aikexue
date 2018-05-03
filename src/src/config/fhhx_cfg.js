var ResList = [
    "fhhx",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doNames:[
      "收集吸入的气体\n和呼出的气体",
      "蜡烛在吸入和呼出\n的气体中燃烧",
      "吸入和呼出的气体\n使石灰水的变化",
    ],
    seeList: [
        res.img_see1,
    ],
    doList: [
        res.img_do1,
        res.img_do2,
        res.img_do3,
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
        ["seeExp1", function() {
            return new seeExp1()
        }],
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
        fhhx_seeExp1_json:"res/extra/fhhx/fhhx_seeExp1.json",
    }
}