var ResList = [
    "hlfd",
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
    ],
    addRes: {
        hlfd_seeExp1_json:"res/extra/hlfd/hlfd_seeExp1.json",
    }
}