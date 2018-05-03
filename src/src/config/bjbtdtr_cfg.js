/**
 * Created by Administrator on 2016/7/22.
 */
/**
 * Created by Administrator on 2016/7/21.
 */
var ResList = [
    "bjbtdtr",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noShow:true,
    doList: [
        res.bjbtdtr_img_do1,
        res.bjbtdtr_img_do2,
    ],
    seeList: [
        res.bjbtdtr_img_see1,
    ],
    helpFile: res.bjbtdtr_sysm,
    titleFile: res.bjbtdtr_title,
    soundFile: res.bjbtdtr_title_sound,
    mainLoop: [
        res.bjbtdtr_loop_1,
        res.bjbtdtr_loop_2,
        res.bjbtdtr_loop_3,
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
        bjbtdtr_see1_json:"res/extra/bjbtdtr/bjbtdtr_seeExp1.json",
        bjbtdtr_do1_json:"res/extra/bjbtdtr/bjbtdtr_doExp1.json",
        bjbtdtr_do2_json:"res/extra/bjbtdtr/bjbtdtr_doExp2.json",
        bjbtdtr_rtlsAni:"res/extra/bjbtdtr/bjbtdtr_rtlsAni.json",
        bjbtdtr_rtrbAni:"res/extra/bjbtdtr/bjbtdtr_rtrbAni.json",
        bjbtdtr_dsAni:"res/extra/bjbtdtr/bjbtdtr_sdsAni.json",
        bjbtdtr_sfewDayAni:"res/extra/bjbtdtr/bjbtdtr_sfewDayAni.json",
        bjbtdtr_sntAni:"res/extra/bjbtdtr/bjbtdtr_sntAni.json",
        bjbtdtr_sntAni2:"res/extra/bjbtdtr/bjbtdtr_sntAni2.json",
        bjbtdtr_sntGrowAni:"res/extra/bjbtdtr/bjbtdtr_sntGrowAni.json",
        bjbtdtr_sntlsAni:"res/extra/bjbtdtr/bjbtdtr_sntlsAni.json",
        bjbtdtr_sntrbAni:"res/extra/bjbtdtr/bjbtdtr_sntrbAni.json",
        bjbtdtr_srtAni:"res/extra/bjbtdtr/bjbtdtr_srtAni.json",
        bjbtdtr_srtAni2:"res/extra/bjbtdtr/bjbtdtr_srtAni2.json",
        bjbtdtr_srtGrowAni:"res/extra/bjbtdtr/bjbtdtr_srtGrowAni.json",
        bjbtdtr_ssAni:"res/extra/bjbtdtr/bjbtdtr_ssAni.json",
        bjbtdtr_stAni:"res/extra/bjbtdtr/bjbtdtr_stAni.json",
        bjbtdtr_stAni2:"res/extra/bjbtdtr/bjbtdtr_stAni2.json",
        bjbtdtr_stGrowAni:"res/extra/bjbtdtr/bjbtdtr_stGrowAni.json",
        bjbtdtr_stlsAni:"res/extra/bjbtdtr/bjbtdtr_stlsAni.json",
        bjbtdtr_strbAni:"res/extra/bjbtdtr/bjbtdtr_strbAni.json",
        bjbtdtr_tableNode:"res/extra/bjbtdtr/bjbtdtr_tableNode.json",
    }
}