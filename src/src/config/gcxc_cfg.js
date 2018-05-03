var ResList = [
    "gcxc",
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
    seeNames: [
        "小草构造",
        "认一认小草",
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
        ["seeExp1", function() {
            return new seeExp1()
        }],
        ["seeExp2", function() {
            return new seeExp2()
        }],
        ["doExp1", function() {
            return new doExp1()
        }],
    ],
    addRes: {
        gcxc_seeExp1_json:"res/extra/gcxc/gcxc_seeExp1.json",
        gcxc_seeExp2_json:"res/extra/gcxc/gcxc_seeExp2.json",
        gcxc_doExp1_json:"res/extra/gcxc/gcxc_doExp1.json",
        gcxc_tableNode_json:"res/extra/gcxc/gcxc_tableNode.json",
    }
}