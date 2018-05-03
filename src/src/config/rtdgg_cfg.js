var ResList = [
    "rtdgg",
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
    helpFile: res.sysm,
    titleFile: res.title,
    playMP4:true,
    soundFile: res.title_sound,
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
    ],
    addRes: {
        rtdgg_startMv_json:"res/extra/rtdgg/rtdgg_startMv.json",
        rtdgg_seeExp1_json:"res/extra/rtdgg/rtdgg_seeExp1.json",
        rtdgg_doExp1_json:"res/extra/rtdgg/rtdgg_doExp.json",
    }
}