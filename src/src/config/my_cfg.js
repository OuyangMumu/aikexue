/**
 * Created by Administrator on 2016/6/21.
 */
var ResList = [
    "my",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noShow:true,
    doList: [
        res.my_img_do1,
        res.my_img_do2,
    ],
    seeList: [
        res.my_img_see1,
    ],
    helpFile: res.my_sysm,
    titleFile: res.my_title,
    soundFile: res.my_title_sound,
    mainLoop: [
        res.my_loop_1,
        res.my_loop_2,
        res.my_loop_3,
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
        my_see1_json:"res/extra/my/my_seeExp1.json",
        my_do1_json:"res/extra/my/my_doExp1.json",
        my_tableNode_json:"res/extra/my/my_tableNode.json"
    }
}