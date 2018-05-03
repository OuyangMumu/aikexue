var ResList = [
    "lzdrs",
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
        lzdrs_startMv_json:"res/extra/lzdrs/lzdrs_startMv.json",
        lzdrs_seeExp1_json:"res/extra/lzdrs/lzdrs_seeExp1.json",
    }
}