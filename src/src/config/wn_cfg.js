var ResList = [
    "wn",
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
        wn_seeExp1_json:"res/extra/wn/wn_seeExp1.json",
        wn_tableNode_json:"res/extra/wn/wn_tableNode.json",
    }
}