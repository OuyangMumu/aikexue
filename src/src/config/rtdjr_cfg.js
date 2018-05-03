var ResList = [
    "rtdjr",
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
        rtdjr_startMv_json:"res/extra/rtdjr/rtdjr_startMv.json",
        rtdjr_seeExp1_json:"res/extra/rtdjr/rtdjr_seeExp1.json",
        rtdjr_doExp1_json:"res/extra/rtdjr/rtdjr_doExp1.json",
    }
}