var ResList = [
    "wmds",
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
        ["seeExp1", function() {
            return new seeExp1()
        }],
        ["doExp1", function() {
            return new doExp1()
        }],
    ],
    addRes: {
        wmds_learnLayer_json:"res/extra/wmds/wmds_learnLayer.json",
        wmds_videoLayer_json:"res/extra/wmds/wmds_videoLayer.json",
        wmds_seeExp1_json:"res/extra/wmds/wmds_seeExp1.json",
    }
}