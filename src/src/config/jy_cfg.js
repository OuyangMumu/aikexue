/**
 * Created by Administrator on 2016/6/28.
 */
/**
 * Created by Administrator on 2016/6/21.
 */
var ResList = [
    "jy",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noShow:true,
    doList: [
        res.jy_img_do1,
        res.jy_img_do2,
    ],
    seeList: [
        res.jy_img_see1,
    ],
    helpFile: res.jy_sysm,
    titleFile: res.jy_title,
    soundFile: res.jy_title_sound,
    mainLoop: [
        res.jy_loop_1,
        res.jy_loop_2,
        res.jy_loop_3,
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
        jy_see1_json:"res/extra/jy/jy_seeExp1.json",
        jy_do1table_json:"res/extra/jy/jy_do1table.json",
    }
}