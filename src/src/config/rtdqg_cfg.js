var ResList = [
    "rtdqg",
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
        rtdqg_startMv_json:"res/extra/rtdqg/rtdqg_startMv.json",
        rtdqg_seeExp1_json:"res/extra/rtdqg/rtdqg_seeExp1.json",
        rtdqg_doExp1_json:"res/extra/rtdqg/rtdqg_doExp1.json",
    }
}