var ResList = [
    "jdxx",
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
    playMP4:true,
    helpFile: res.sysm,
    titleFile: res.title,
    soundFile: res.title_sound,
    mainLoop: [
        res.loop_1,
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
        jdxx_startMv_json:"res/extra/jdxx/jdxx_startMv.json",
        jdxx_seeExp1_json:"res/extra/jdxx/jdxx_seeExp1.json",
        jdxx_doExp1_json:"res/extra/jdxx/jdxx_doExp1.json",
        jdxx_doExp2_json:"res/extra/jdxx/jdxx_doExp2.json",
    }
}