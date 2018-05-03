var ResList = [
    "hc",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeList: [
        res.img_see1,
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
        ["seeExp1", function() {
            return new seeExp1()
        }],
        ["doExp1", function() {
            return new doExp1()
        }],
    ],
    addRes: {
        hc_seeExp1_json:"res/extra/hc/hc_seeExp1.json",
        hc_doExp1_json:"res/extra/hc/hc_doExp1.json",
        hc_tableNode_json:"res/extra/hc/hc_tableNode.json",
    },
    addItems:[
        "counter",
    ]
}