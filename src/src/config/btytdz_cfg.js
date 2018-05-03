/**
 * Created by Administrator on 2016/5/31.
 */
var ResList = [
    "btytdz",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noSee:true,
    noShow:true,
    doNames:[
      "吸水性能",
      "拉伸性能",
      "弯曲性能",
      "透明度",
    ],
    doList: [
        res.btytdz_img_do1,
        res.btytdz_img_do2,
        res.btytdz_img_do3,
        res.btytdz_img_do4,
    ],
    seeList: [
        res.img_see1,
    ],
    helpFile: res.btytdz_sysm,
    //helpScale: 0.42,
    titleFile: res.btytdz_title,
    soundFile: res.btytdz_title_sound,
    mainLoop: [
        res.btytdz_img_loop_1,
        res.btytdz_img_loop_2,
        res.btytdz_img_loop_3,
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
        ["doExp3", function() {
            return new doExp3()
        }],
        ["doExp4", function() {
            return new doExp4()
        }],
    ],
    addRes: {
        btytdz_do4: "res/extra/btytdz/btytdz_doExp4.json",
        btytdz_table: "res/extra/btytdz/btytdz_tableNode.json",
    }
}