var ResList = [
    "shsyydbj",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doList: [
        res.shsyydbj_img_do1,
        res.shsyydbj_img_do2,
    ],
    seeList: [
        res.shsyydbj_img_see1,
    ],
    helpFile: res.shsyydbj_sysm,
    titleFile: res.shsyydbj_title,
    soundFile: res.shsyydbj_title_sound,
    mainLoop: [
         res.shsyydbj_loop_1,
         res.shsyydbj_loop_2,
         res.shsyydbj_loop_3,
    ],
    layerList: [
        ["seeExp1", function() {
            return new seeExp1()
        }],
        ["doExp1", function() {
            return new doExp1()
        }],
        ["doExp2", function() {
            return new doExp2()
        }],
    ],
    addRes: {
        shsyydbj_learn_json:"res/extra/shsyydbj/shsyydbj_learnExp.json",
        shsyydbj_see1_json:"res/extra/shsyydbj/shsyydbj_seeExp.json",
        shsyydbj_do1_json:"res/extra/shsyydbj/shsyydbj_doExp1.json",
        shsyydbj_do2_json:"res/extra/shsyydbj/shsyydbj_doExp2.json",
        shsyydbj_tableNode_json:"res/extra/shsyydbj/shsyydbj_tableNode.json",
    },
}

for (var i in mainInfo.addRes) {
    res[i] = mainInfo.addRes[i]
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}