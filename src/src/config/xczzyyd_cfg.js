var ResList = [
    "xczzyyd",
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
        xczzyyd_videoLayer_json:"res/extra/xczzyyd/xczzyyd_videoLayer.json",
        xczzyyd_doExp1_json:"res/extra/xczzyyd/xczzyyd_doExp1.json",
        xczzyyd_tableNode_json:"res/extra/xczzyyd/xczzyyd_tableNode.json",
    }
}