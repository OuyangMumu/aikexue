var ResList = [
    "rszycdd",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doNames:[
      "热传导",
      "热对流",
      "热辐射",
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
    playMP4:true,
    mainLoop: [
        res.loop_1,
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
        rszycdd_learnExp1_json:"res/extra/rszycdd/rszycdd_learnExp.json",
        rszycdd_startMv_json:"res/extra/rszycdd/rszycdd_startMv.json",
        rszycdd_seeExp1_json:"res/extra/rszycdd/rszycdd_seeExp1.json",
        rszycdd_doExp1_json:"res/extra/rszycdd/rszycdd_doExp1.json",
        rszycdd_doExp1_1_json:"res/extra/rszycdd/rszycdd_doExp1_1.json",
        rszycdd_doExp2_json:"res/extra/rszycdd/rszycdd_doExp2.json",
        rszycdd_doExp3_json:"res/extra/rszycdd/rszycdd_doExp3.json",
        muxieAni_json:"res/extra/rszycdd/muxieAni.json",
        rszycdd_tableNode_json:"res/extra/rszycdd/rszycdd_tableNode.json",
    }
}