var ResList = [
    "rtdxz",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    noDo:true,
    seeList: [
        res.img_see1,
        res.img_see2,
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
    ],
    addRes: {
        rtdxz_seeExp1_json:"res/extra/rtdxz/rtdxz_seeExp1.json",
        rtdxz_seeExp1_2_json:"res/extra/rtdxz/rtdxz_seeExp1_2.json",
        rtdxz_seeExp2_json:"res/extra/rtdxz/rtdxz_seeExp2.json",
    }
}