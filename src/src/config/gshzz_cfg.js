var ResList = [
    "gshzz",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doList: [
        res.gshzz_img_do1,
        res.gshzz_img_do2,
    ],
    seeList: [
        res.gshzz_img_see1,
    ],
    helpFile: res.gshzz_sysm,
    titleFile: res.gshzz_title,
    soundFile: res.gshzz_title_sound,
    mainLoop: [
         res.gshzz_loop_1,
         res.gshzz_loop_2,
         res.gshzz_loop_3,
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
        gshzz_see1_json:"res/extra/gshzz/gshzz_seeExp1.json",
        gshzz_tableNode_json:"res/extra/gshzz/gshzz_tableNode.json",
    },
}

for (var i in mainInfo.addRes) {
    res[i] = mainInfo.addRes[i]
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}