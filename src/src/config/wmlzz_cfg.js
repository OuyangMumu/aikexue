/**
 * Created by Administrator on 2016/7/26.
 */
var ResList = [
    "wmlzz",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noShow:true,
    noSee:true,
    doList: [
        res.wmlzz_img_do1,
    ],
    helpFile: res.wmlzz_sysm,
    titleFile: res.wmlzz_title,
    soundFile: res.wmlzz_title_sound,
    mainLoop: [
        res.wmlzz_loop_1,
        res.wmlzz_loop_2,
        res.wmlzz_loop_3,
    ],
    layerList: [
        ["doExp1", function() {
            return new doExp1()
        }],
    ],
    addRes: {
        
    }
}