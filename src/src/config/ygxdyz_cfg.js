var ResList = [
    "ygxdyz",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeList: [
        res.img_see1,
    ],
    doList: [
        res.img_do1,
    ],
    playMP4:true,
    helpFile: res.sysm,
    titleFile: res.title,
    soundFile: res.title_sound,
    mainLoop: [
        res.loop_1,
    ],
    layerList: [
        ["doExp1", function() {
            return new doExp1()
        }],
        ["seeExp1", function() {
            return new seeExp1()
        }],
    ],
    addRes: {
        ygxdyz_learnLayer_json:"res/extra/ygxdyz/ygxdyz_learnLayer.json",
        ygxdyz_seeExp1_json:"res/extra/ygxdyz/ygxdyz_seeExp1.json",
        ygxdyz_doExp1_json:"res/extra/ygxdyz/ygxdyz_doExp1.json",
        ygxdyz_startMv_json:"res/extra/ygxdyz/ygxdyz_startMv.json",
        ygxdyz_tableNode_json:"res/extra/ygxdyz/ygxdyz_tableNode.json",
        ygxdyz_tubiaoNode_json:"res/extra/ygxdyz/ygxdyz_tubiaoNode.json",
    }
}