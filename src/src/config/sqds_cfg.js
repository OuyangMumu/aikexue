var ResList = [
    "sqds",
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
        res.img_do3
    ],
    doNames:[
        "会喷射的水",
        "会拖举的水",
        "会溶解物质的水"
    ],
    playMP4:true,
    helpFile: res.sysm,
    titleFile: res.title,
    soundFile: res.title_sound,
    mainLoop: [
        res.loop_1
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
        ["doExp3", function() {
            return new doExp3()
        }],
    ],
    addRes: {
        sqds_doExp2_json:"res/extra/sqds/sqds_doExp2.json",
        sqds_startMv_json:"res/extra/sqds/sqds_startMv.json",
        sqds_tableNode_json:"res/extra/sqds/sqds_tableNode.json",
    }
}