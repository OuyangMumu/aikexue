var ResList = [
    "rndgn",
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
        rndgn_learnLayer_json:"res/extra/rndgn/rndgn_learnLayer.json",
        rndgn_startMv_json:"res/extra/rndgn/rndgn_startMv.json",
        rndgn_seeExp1_json:"res/extra/rndgn/rndgn_seeExp1.json",
        rndgn_doExp1_json:"res/extra/rndgn/rndgn_doExp1.json",
    }
}