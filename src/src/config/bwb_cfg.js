/**
 * Created by Administrator on 2016/7/26.
 */
var ResList = [
    "bwb",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noShow:true,
    seeList: [
        res.bwb_img_see1,
    ],
    doList: [
        res.bwb_img_do1,
        res.bwb_img_do2,
    ],
    helpFile: res.bwb_sysm,
    titleFile: res.bwb_title,
    soundFile: res.bwb_title_sound,
    mainLoop: [
        res.bwb_loop_1,
        res.bwb_loop_2,
        res.bwb_loop_3,
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
        bwb_see1_json:"res/extra/bwb/bwb_seeExp1.json",
        bwb_do1_json:"res/extra/bwb/bwb_doExp1.json",
        bwb_tableNode1_json:"res/extra/bwb/bwb_tableNode1.json",
        bwb_tableNode2_json:"res/extra/bwb/bwb_tableNode2.json",
    },
    addItems: [ 
        "watch"
    ],
}