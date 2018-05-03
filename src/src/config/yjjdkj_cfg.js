var ResList = [
    "yjjdkj",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeList: [
        res.img_see1,
        res.img_see2,
    ],
    doList: [
        res.img_do1,
    ],
    helpFile: res.sysm,
    titleFile: res.title,
    soundFile: res.title_sound,
    mainLoop: [
        res.loop_1,
        res.loop_2,
        res.loop_3,
    ],
    layerList: [
        ["doExp1", function() {
            return new doExp1()
        }],
        ["seeExp2", function() {
            return new seeExp2()
        }],
        ["seeExp1", function() {
            return new seeExp1()
        }],
    ],
    addRes: {
        yjjdkj_seeExp2_json:"res/extra/yjjdkj/yjjdkj_seeExp2.json",
        yjjdkj_doAni_json:"res/extra/yjjdkj/yjjdkj_doAni.json",
        yjjdkj_tableNode_json:"res/extra/yjjdkj/yjjdkj_tableNode.json",
    }
}