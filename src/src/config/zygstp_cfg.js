var ResList = [
    "zygstp",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    noSee:true,
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
    ],
    addRes: {
        zygstp_learnLayer_json:"res/extra/zygstp/zygstp_learnLayer.json",
        zygstp_startMv_json:"res/extra/zygstp/zygstp_startMv.json",
    }
}