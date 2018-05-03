/**
 * Created by Administrator on 2016/6/24.
 */

var ResList = [
    "dlbjsdds",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noShow:true,
    noSee:true,
    doNames:[
      "用量筒测量水的多少",
      "用天平称量水的多少",
    ],
    doList: [
        res.dlbjsdds_img_do1,
        res.dlbjsdds_img_do2,
    ],
    //seeList: [
    //    res.my_img_see1,
    //],
    helpFile: res.dlbjsdds_sysm,
    titleFile: res.dlbjsdds_title,
    soundFile: res.dlbjsdds_title_sound,
    mainLoop: [
        res.dlbjsdds_loop_1,
        res.dlbjsdds_loop_2,
        res.dlbjsdds_loop_3,
    ],
    layerList: [
        ["doExp1", function() {
            return new doExp1()
        }],
        ["doExp2", function() {
            return new doExp2()
        }],
    ],
    addRes: {
        jsdds_do1table: "res/extra/dlbjsdds/dlbjsdds_do1table.json",
        jsdds_do2table: "res/extra/dlbjsdds/dlbjsdds_do2table.json",
        jsdds_doExp1: "res/extra/dlbjsdds/dlbjsdds_doExp1.json",
    },
    addItems:[
        "tp",
    ]
}