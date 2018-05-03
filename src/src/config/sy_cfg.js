var ResList = [
    "sy",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    noDo:true,
    seeList: [
        res.img_see1,
        res.img_see2,
    ],
    seeNames: [
        "石油提炼物",
        "石油的形成",
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
        ["seeExp2", function() {
            return new seeExp2()
        }],
        ["seeExp1", function() {
            return new seeExp1()
        }],
    ],
    addRes: {
        sy_tableNode_json:"res/extra/sy/sy_tableNode.json",
        sy_seeExp2_json:"res/extra/sy/sy_seeExp2.json",
    }
}