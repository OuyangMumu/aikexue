var ResList = [
    "gcds",
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
        gcds_videoLayer_json:"res/extra/gcds/videoLayer.json",
        gcds_doExp1_json:"res/extra/gcds/gcds_doExp1.json",
        gcds_tableNode_json:"res/extra/gcds/gcds_tableNode.json",
    }
}