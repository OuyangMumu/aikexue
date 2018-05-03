/**
 * Created by Administrator on 2016/7/21.
 */
var ResList = [
    "rstr",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    //exp:"lsyrs",
    noShow:true,
    doNames:[
      "观察土壤",
      "放入水中",
      "加热土壤"
    ],
    doList: [
        res.rstr_img_do1,
        res.rstr_img_do2,
        res.rstr_img_do3,
    ],
    seeList: [
        res.rstr_img_see1,
    ],
    helpFile: res.rstr_sysm,
    titleFile: res.rstr_title,
    soundFile: res.rstr_title_sound,
    mainLoop: [
        res.rstr_loop_1,
        res.rstr_loop_2,
        res.rstr_loop_3,
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
        ["doExp3", function() {
            return new doExp3()
        }],
    ],
    addRes: {
        rstr_see1_json:"res/extra/rstr/rstr_seeExp1.json",
        rstr_do1_json:"res/extra/rstr/rstr_doExp1.json",
        rstr_do2_json:"res/extra/rstr/rstr_doExp2.json",
        rstr_do3_json:"res/extra/rstr/rstr_doExp3.json",
        rstr_sandAni_json:"res/extra/rstr/rstr_sandAni.json",
        //rstr_putSoilAni_json:"res/extra/rstr/rstr_putSoilAni.json",
        rstr_tableNode_json:"res/extra/rstr/rstr_tableNode.json",
        rstr_cupAni_json:"res/extra/rstr/rstr_cupAni.json",
        rstr_cupAni2_json:"res/extra/rstr/rstr_cupAni2.json",
        rstr_bubbleAni_json:"res/extra/rstr/rstr_bubbleAni.json",
        rstr_coverAni_json:"res/extra/rstr/rstr_coverAni.json",
        rstr_lampFireAni_json:"res/extra/rstr/rstr_lampFireAni.json",
        rstr_waterAni_json:"res/extra/rstr/rstr_waterAni.json",
        rstr_fireAni_json:"res/extra/rstr/rstr_fireAni.json",
        rstr_childAni_json:"res/extra/rstr/rstr_childAni.json",
    }
}