/**
 * Created by Administrator on 2016/7/24.
 */
/**
 * Created by Administrator on 2016/7/23.
 */
var ResList = [
    "wdhwdj",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doNames:[
      "温度计的结构",
      "温度计的使用",
    ],
    doList: [
        res.wdhwdj_img_do1,
        res.wdhwdj_img_do2,
    ],
    seeList: [
        res.wdhwdj_img_see1,
    ],
    playMP4:true,
    helpFile: res.wdhwdj_sysm,
    titleFile: res.wdhwdj_title,
    soundFile: res.wdhwdj_title_sound,
    mainLoop: [
         res.wdhwdj_loop_1
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
        wdhwdj_startMv:"res/extra/wdhwdj/wdhwdj_startMv.json",
        wdhwdj_do1_json:"res/extra/wdhwdj/wdhwdj_doExp1.json",
        wdhwdj_do2_json:"res/extra/wdhwdj/wdhwdj_doExp2.json",
        wdhwdj_tabelNode:"res/extra/wdhwdj/wdhwdj_tabelNode.json",
    }
}

for (var i in mainInfo.addRes) {
    res[i] = mainInfo.addRes[i]
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}