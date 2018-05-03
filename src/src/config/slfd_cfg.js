var ResList = [
    "slfd",
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
        slfd_seeExp1_json:"res/extra/slfd/slfd_seeExp1.json",
        slfd_doExp1_json:"res/extra/slfd/slfd_doExp1.json",
        slfd_tableNode_json:"res/extra/slfd/slfd_tableNode.json",
    }
}