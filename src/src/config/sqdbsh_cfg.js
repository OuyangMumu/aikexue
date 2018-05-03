/**
 * Created by Administrator on 2016/7/26.
 */
var ResList = [
    "sqdbsh",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeList: [
        res.sqdbsh_img_see1,
    ],
    doList: [
        res.sqdbsh_img_do1,
    ],
    helpFile: res.sqdbsh_sysm,
    titleFile: res.sqdbsh_title,
    soundFile: res.sqdbsh_title_sound,
    mainLoop: [
        res.sqdbsh_loop_1,
        res.sqdbsh_loop_2,
        res.sqdbsh_loop_3,
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
    },
}