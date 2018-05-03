/**
 * Created by Administrator on 2016/7/26.
 */
var ResList = [
    "gl",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeList: [
        res.gl_img_see1,
    ],
    doList: [
        res.gl_img_do1,
    ],
    helpFile: res.gl_sysm,
    titleFile: res.gl_title,
    soundFile: res.gl_title_sound,
    mainLoop: [
        res.gl_loop_1,
        res.gl_loop_2,
        res.gl_loop_3,
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
        gl_see1_json:"res/extra/gl/gl_seeExp1.json",
        gl_do1_json:"res/extra/gl/gl_doExp1.json",
    },
}