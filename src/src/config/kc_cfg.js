var ResList = [
    "kc",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    seeList: [
        res.img_see1,
        res.img_see2,
        res.img_see3,
        res.img_see4,
    ],
    doList: [
        res.img_do1
    ],
    helpFile: res.sysm,
    titleFile: res.title,
    soundFile: res.title_sound,
    seeNames: [
        "蚕蛾",
        "蝗虫",
        "蚂蚁",
        "蜻蜓"
    ],
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
        ["seeExp3", function() {
            return new seeExp3()
        }],
        ["seeExp4", function() {
            return new seeExp4()
        }],
    ],
    addRes: {
        kc_doExp1_json:"res/extra/kc/kc_doExp1.json",
        kc_seeExp1_json:"res/extra/kc/kc_seeExp1.json",
        kc_seeExp2_json:"res/extra/kc/kc_seeExp2.json",
        kc_seeExp3_json:"res/extra/kc/kc_seeExp3.json",
        kc_seeExp4_json:"res/extra/kc/kc_seeExp4.json",
    }
}