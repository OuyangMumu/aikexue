var ResList = [
    "nbswdg",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    noSee:true,
    doList: [
        res.img_do1,
        res.img_do2,
        res.img_do3,
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
        ["doExp2", function() {
            return new doExp2()
        }],
        ["doExp3", function() {
            return new doExp3()
        }]
    ],
    addRes: {
        wenduji_res:"res/common/wenduji.json",
        nbswdg_tableNode_1_json:"res/extra/nbswdg/nbswdg_tableNode_1.json",
        nbswdg_tableNode_2_json:"res/extra/nbswdg/nbswdg_tableNode_2.json",
        nbswdg_tableNode_3_json:"res/extra/nbswdg/nbswdg_tableNode_3.json",
    },
    addItems:[
        "counter",
    ]
}