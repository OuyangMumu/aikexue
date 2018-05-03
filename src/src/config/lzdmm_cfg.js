var ResList = [
    "lzdmm",
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
        res.img_see2,
    ],
    helpFile: res.sysm,
    titleFile: res.title,
    soundFile: res.title_sound,
    seeNames: [
        "轮轴的构造",
        "比一比力气",
    ],
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
        ["seeExp2", function() {
            return new seeExp2()
        }],
    ],
    addRes: {
        lzdmm_seeExp1_json:"res/extra/lzdmm/lzdmm_seeExp1.json",
        lzdmm_seeExp2_json:"res/extra/lzdmm/lzdmm_seeExp2.json",
        lzdmm_doExp1_json:"res/extra/lzdmm/lzdmm_doExp1.json",
        lzdmm_tableNode_json:"res/extra/lzdmm/lzdmm_tableNode.json",
    }
}