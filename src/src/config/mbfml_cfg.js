/**
 * Created by Administrator on 2016/6/12.
 */
/**
 * Created by Administrator on 2016/5/31.
 */
var ResList = [
    "mbfml",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noSee:true,
    noShow:true,
    doList: [
        res.mbfml_img_do1,
    ],
    //seeList: [
    //    res.img_see1,
    //],
    helpFile: res.mbfml_sysm,
    //helpScale: 0.42,
    titleFile: res.mbfml_title,
    soundFile: res.mbfml_title_sound,
    mainLoop: [
        res.mbfml_loop_1,
        res.mbfml_loop_2,
        res.mbfml_loop_3,
    ],
    layerList: [
        ["doExp1", function() {
            return new doExp1()
        }],
    ],
    addRes: {
        dgdsAni: "res/extra/mbfml/mbfml_dgdsAni.json",
        putMouldAni: "res/extra/mbfml/mbfml_putMouldAni.json",
        bagAni: "res/extra/mbfml/mbfml_bagAni.json",
        mirrorBox: "res/extra/mbfml/mbfml_mirrorBox.json",
        mbfml_table: "res/extra/mbfml/mbfml_tableNode.json",
    }
}