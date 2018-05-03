var ResList = [
    "czhsz",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    noSee:true,
    doList: [
        res.img_do1,
        res.img_do2,
    ],
    doNames: [
        "称体重",
        "坐电梯"
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
        ["doExp2", function() {
            return new doExp2()
        }],
        ["doExp1", function() {
            return new doExp1()
        }],
    ],
    addRes: {
        czhsz_tableNode1_json:"res/extra/czhsz/czhsz_tableNode1.json",
        czhsz_tableNode2_json:"res/extra/czhsz/czhsz_tableNode2.json",
        czhsz_doExp2_json:"res/extra/czhsz/czhsz_doExp2.json",
    }
}