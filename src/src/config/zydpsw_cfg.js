/**
 * Created by Administrator on 2016/7/4.
 */
/**
 * Created by Administrator on 2016/6/28.
 */
var ResList = [
    "zydpsw",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noShow:true,
    doList: [
        res.zydpsw_img_do1,
    ],
    seeList: [
        res.zydpsw_img_see1,
    ],
    helpFile: res.zydpsw_sysm,
    titleFile: res.zydpsw_title,
    soundFile: res.zydpsw_title_sound,
    mainLoop: [
        res.zydpsw_loop_1,
        res.zydpsw_loop_2,
        res.zydpsw_loop_3,
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
        zydpsw_see1_json:"res/extra/zydpsw/zydpsw_seeExp1.json",
        zydpsw_do1_json:"res/extra/zydpsw/zydpsw_doExp1.json",
        font_fnt:"res/extra/zydpsw/font.fnt",
        zydpsw_table_json:"res/extra/zydpsw/zydpsw_tableNode.json",
    },
    addItems:[
        "counter",
    ]
}