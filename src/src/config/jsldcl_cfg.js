var ResList = [
    "jsldcl",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeNames:[
      "降水形式",
      "测量工具",
    ],
    doNames:[
      "制作雨量器",
      "模拟测量",
    ],
    doList: [
        res.jsldcl_img_do1,
        res.jsldcl_img_do2,
    ],
    seeList: [
        res.jsldcl_img_see1,
        res.jsldcl_img_see2,
    ],
    helpFile: res.jsldcl_sysm,
    titleFile: res.jsldcl_title,
    soundFile: res.jsldcl_title_sound,
    mainLoop: [
         res.jsldcl_loop_1,
         res.jsldcl_loop_2,
         res.jsldcl_loop_3,
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
        }],
        ["doExp2", function() {
            return new doExp2()
        }],
    ],
    addRes: {
        jsldcl_learn_json:"res/extra/jsldcl/jsldcl_learnExp.json",
        jsldcl_seeExp2_json:"res/extra/jsldcl/jsldcl_seeExp2.json",
        jsldcl_doExp1_json:"res/extra/jsldcl/jsldcl_doExp1.json",
        jsldcl_doExp2_json:"res/extra/jsldcl/jsldcl_doExp2.json",
        jsldcl_table_json:"res/extra/jsldcl/jsldcl_tableNode.json",
    },
}

for (var i in mainInfo.addRes) {
    res[i] = mainInfo.addRes[i]
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}