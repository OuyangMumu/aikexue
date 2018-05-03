var ResList = [
    "zgx",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doList: [
        res.img_do1,
    ],
    seeList: [
        res.img_see1,
    ],
    helpFile: res.sysm,
    titleFile: res.title,
    soundFile: res.title_sound,
    mainLoop: [
        res.loop_1,
        res.loop_2,
        res.loop_3,
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
        zgx_seeExp1_json:"res/extra/zgx/zgx_seeExp1.json",
        zgx_tableNode_json:"res/extra/zgx/zgx_tableNode.json",
    }
}