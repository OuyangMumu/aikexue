var ResList = [
    "jjddsy",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    doList: [
        res.img_do1,
    ],
    seeList: [
        res.img_see1,
        res.img_see2,
    ],
    seeNames: [
        "酒精灯的构造",
        "酒精灯的火焰",
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
        ["seeExp1", function() {
            return new seeExp1()
        }],
        ["seeExp2", function() {
            return new seeExp2()
        }],
    ],
    addRes: {
        jjddsy_learn_json:"res/extra/jjddsy/jjddsy_learnLayer.json",
        jjddsy_seeExp1_json:"res/extra/jjddsy/jjddsy_seeExp1.json",
        jjddsy_seeExp2_json:"res/extra/jjddsy/jjddsy_seeExp2.json",
    }
}