var ResList = [
    "flhhw",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeNames:[
      "扬谷",
      "筛沙",
    ],
    seeList: [
        res.img_see1,
        res.img_see2,
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
        ["seeExp2", function() {
            return new seeExp2()
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
        flhhw_seeExp1_json:"res/extra/flhhw/flhhw_seeExp1.json",
        flhhw_seeExp2_json:"res/extra/flhhw/flhhw_seeExp2.json",
        flhhw_tableNode1_json:"res/extra/flhhw/flhhw_tableNode1.json",
        flhhw_tableNode2_json:"res/extra/flhhw/flhhw_tableNode2.json",
        flhhw_tableNode3_json:"res/extra/flhhw/flhhw_tableNode3.json",
    }
}