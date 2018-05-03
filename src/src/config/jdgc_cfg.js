/**
 * Created by Administrator on 2016/7/23.
 */
/**
 * Created by Administrator on 2016/7/21.
 */
var ResList = [
    "jdgc",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doList: [
        res.jdgc_img_do1,
    ],
    seeList: [
        res.jdgc_img_see1,
        res.jdgc_img_see2,
    ],
    helpFile: res.jdgc_sysm,
    titleFile: res.jdgc_title,
    soundFile: res.jdgc_title_sound,
    mainLoop: [
        res.jdgc_loop_1,
        res.jdgc_loop_2,
        res.jdgc_loop_3,
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
    ],
    addRes: {
        jdgc_see1_json:"res/extra/jdgc/jdgc_seeExp1.json",
        jdgc_see2_json:"res/extra/jdgc/jdgc_seeExp2.json",
        jdgc_do1_json:"res/extra/jdgc/jdgc_doExp1.json",
        jdgc_doAni1:"res/extra/jdgc/jdgc_doAni1.json",
        jdgc_doAni2:"res/extra/jdgc/jdgc_doAni2.json",
        jdgc_doAni3:"res/extra/jdgc/jdgc_doAni3.json",
    }
}

for (var i in mainInfo.addRes) {
    res[i] = mainInfo.addRes[i]
}

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}