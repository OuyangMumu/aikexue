var ResList = [
    "wtdysyxr",
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
        wtdysyxr_learnLayer_json:"res/extra/wtdysyxr/wtdysyxr_learnLayer.json",
        wtdysyxr_startMv_json:"res/extra/wtdysyxr/wtdysyxr_startMv.json",
        wtdysyxr_tableNode_json:"res/extra/wtdysyxr/wtdysyxr_tableNode.json",
    }
}