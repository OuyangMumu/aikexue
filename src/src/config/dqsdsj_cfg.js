var ResList = [
    "dqsdsj",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    noDo:true,
    seeList: [
        res.img_see1,
    ],
    helpFile: res.sysm,
    titleFile: res.title,
    playMP4:true,
    soundFile: res.title_sound,
    mainLoop: [
        res.loop_1,
    ],
    layerList: [
        ["seeExp1", function() {
            return new seeExp1()
        }],
    ],
    addRes: {
        dqsdsj_startMv_json:"res/extra/dqsdsj/dqsdsj_startMv.json",
    },
    addItems: [
        "match",
    ],
}