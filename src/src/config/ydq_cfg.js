var ResList = [
    "ydq",
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
        res.img_do2,
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
        ["seeExp1", function() {
            return new seeExp1()
        }],
    ],
    addRes: {
        ydq_seeExp1_json:"res/extra/ydq/ydq_seeExp1.json",
        ydq_doExp1_json:"res/extra/ydq/ydq_doExp1.json",
        ydq_doExp2_json:"res/extra/ydq/ydq_doExp2.json",
    }
}