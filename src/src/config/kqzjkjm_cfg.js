var ResList = [
    "kqzjkjm",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeList: [
        res.img_see1,
        res.img_see2
    ],
    doList: [
        res.img_do1
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
        ["seeExp1", function() {
            return new seeExp1()
        }],
        ["seeExp2", function() {
            return new seeExp2()
        }],
        ["doExp1", function() {
            return new doExp1()
        }]
    ],
    addRes: {
        kqzjkjm_seeExp2_json:"res/extra/kqzjkjm/kqzjkjm_seeExp2.json",
        kqzjkjm_doExp1_json:"res/extra/kqzjkjm/kqzjkjm_doExp1.json",
        kqzjkjm_tableNode_json:"res/extra/kqzjkjm/kqzjkjm_tableNode.json",
    }
}