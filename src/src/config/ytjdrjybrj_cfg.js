var ResList = [
    "ytjdrjybrj",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeList: [
        res.ytjdrjybrj_img_see1,
    ],
    doList: [
        res.ytjdrjybrj_img_do1,
    ],
    helpFile: res.ytjdrjybrj_sysm,
    titleFile: res.ytjdrjybrj_title,
    soundFile: res.ytjdrjybrj_title_sound,
    mainLoop: [
        res.ytjdrjybrj_loop_1,
        res.ytjdrjybrj_loop_2,
        res.ytjdrjybrj_loop_3,
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
        ytjdrjybrj_learn_json:"res/extra/ytjdrjybrj/ytjdrjybrj_learnExp.json",
        ytjdrjybrj_table_json:"res/extra/ytjdrjybrj/ytjdrjybrj_tableNode.json",
    },
}