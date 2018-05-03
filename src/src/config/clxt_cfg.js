/**
 * Created by Administrator on 2016/7/24.
 */
/**
 * Created by Administrator on 2016/7/23.
 */
var ResList = [
    "clxt",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doList: [
        res.clxt_img_do1,
    ],
    seeList: [
        res.clxt_img_see1,
    ],
    playMP4:true,
    helpFile: res.clxt_sysm,
    titleFile: res.clxt_title,
    soundFile: res.clxt_title_sound,
    mainLoop: [
         res.clxt_loop_1
    ],
    layerList: [
        ["seeExp1", function() {
            return new seeExp1()
        }],
        ["doExp1", function() {
            return new doExp1()
        }],
    ],
    addRes: {
        clxt_startMv_json:"res/extra/clxt/clxt_startMv.json",
        clxt_learnExp_json:"res/extra/clxt/clxt_learnExp.json",
        clxt_seeExp1_json:"res/extra/clxt/clxt_seeExp1.json",
        clxt_table_json:"res/extra/clxt/clxt_tableNode.json",
        clxt_doExp1_json:"res/extra/clxt/clxt_doExp1.json",
    },
    addItems: [ 
        "watch"
    ],
}

for (var i in mainInfo.addRes) {
    res[i] = mainInfo.addRes[i]
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}