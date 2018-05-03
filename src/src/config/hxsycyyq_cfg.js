var ResList = [
    "hxsycyyq",
]

for (var i = 0; i < ResList.length; i++) {
    getRes(lhJs, ResList[i])
}

var mainInfo = {
    noShow:true,
    noSee:true,
    noStudy:true,
    doList: [
        res.img_do1
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
        }]
    ],
    addRes: {
        //bbyt_tableNode_json:"res/extra/bbyt/bbyt_tableNode.json",
    }
}