/**
 * Created by Administrator on 2016/7/26.
 */
var ResList = [
    "zgtyz",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeNames:[
      "时辰",
      "日晷",
      "圭表"
    ],
    doNames:[
      "制作日晷",
      "日晷计时",
    ],
    seeList: [
        res.zgtyz_img_see1,
        res.zgtyz_img_see2,
        res.zgtyz_img_see3,
    ],
    doList: [
        res.zgtyz_img_do1,
        res.zgtyz_img_do2,
    ],
    helpFile: res.zgtyz_sysm,
    titleFile: res.zgtyz_title,
    soundFile: res.zgtyz_title_sound,
    mainLoop: [
        res.zgtyz_loop_1,
        res.zgtyz_loop_2,
        res.zgtyz_loop_3,
    ],
    layerList: [
        ["seeExp1", function() {
            return new seeExp1()
        }],
        ["seeExp2", function() {
            return new seeExp2()
        }],
        ["seeExp3", function() {
            return new seeExp3()
        }],
        ["doExp1", function() {
            return new doExp1()
        }],
        ["doExp2", function() {
            return new doExp2()
        }],
    ],
    addRes: {
        zgtyz_learnExp_json:"res/extra/zgtyz/zgtyz_learnExp.json",
        zgtyz_seeExp1_json:"res/extra/zgtyz/zgtyz_seeExp1.json",
        zgtyz_seeExp2_json:"res/extra/zgtyz/zgtyz_seeExp2.json",
        zgtyz_seeExp3_json:"res/extra/zgtyz/zgtyz_seeExp3.json",
        zgtyz_doExp1_json:"res/extra/zgtyz/zgtyz_doExp1.json",
        zgtyz_doExp2_json:"res/extra/zgtyz/zgtyz_doExp2.json",
    },
}