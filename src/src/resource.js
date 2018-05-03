var res = {
    mainLayer: "res/layers/mainLayer.json",
    expLayer: "res/layers/expLayer.json",
    learnLayer: "res/layers/learnLayer.json",
    helpLayer: "res/layers/helpLayer.json",
    exitNode: "res/common/exitNode.json",
    quitExp: "res/common/otherExitNode.json",
    seeExp: "res/layers/seeExpLayer.json",
    showLayer: "res/layers/showLayer.json",
    showScore: "res/common/show/showScore.json",
    showsuccess: "res/common/show/showsuccess.json",
    startgo: "res/common/show/startgo.json",
    tips: "res/common/nodeTips.json",
    nums: "res/fnt/nums.fnt",
    hudie: "res/common/show/hudie.json",
    listNum: "res/fnt/listNums.fnt",
    biaoge_down: "res/common/bg_down.json",
    playBtns: "res/common/playBtns.json",
    blur_v: "res/Shaders/blur.vsh",
    blur_f: "res/Shaders/blur.fsh",
    blur_v_native: "res/Shaders/blur_native.vsh",
    blur_f_native: "res/Shaders/blur_native.fsh",
    outLine_v_native: "res/Shaders/outLine_native.vsh",
    outLine_v: "res/Shaders/outLine.vsh",
    outLine_f: "res/Shaders/outLine.fsh"
}

var itemsJson = {
    tubiao: {
        tubiao: "res/common/Tubiao.json",
        rulerfnt: "res/img/ruler/ruler.fnt",
    },
    clock: {
        clock: "res/common/clock.json",
    },
    zkz: {
        item_zkz: "res/common/zkz.json",
    },
    cqt: {
        item_cqt: "res/common/item_cqt.json",
    },
    naozhong: {
        naozhong: "res/common/naozhong.json",
    },
    match: {
        match: "res/common/matchEll.json",
    },
    ruler: {
        rulerfnt: "res/img/ruler/ruler.fnt",
    },
    counter: {
        counter: "res/common/counter.json",
        counterfnt: "res/img/jsq/counter.fnt",
    },
    watch: {
        watch: "res/common/watch.json",
    },
    car: {
        car: "res/common/car.json",
    },
    tp: {
        nodetp: "res/common/nodetp.json",
        nodefm: "res/common/nodefama.json",
    },
    hand: {
        hand: "res/common/hand.json",
    },
    smell: {
        smell: "res/common/smell.json",
    },
    testLoop: {
        testLoop: "res/common/testLoop.json"
    },
    zswd: {
        zswd: "res/common/zswd.json"
    },
    niezi: {
        item_niezi: "res/common/niezi.json"
    },
    water: {
        item_water: "res/common/item_water.json",
    },
    jxmb: {
        item_jxmb: "res/common/jxmb.json",
        counterfnt: "res/img/jsq/counter.fnt",
    },
    shaobei: {
        item_shaobei: "res/common/shaobei.json"
    },
    syj: {
        item_syj: "res/common/syj.json",
        syj_musicimg: "res/img/syj/syj_music.png",
        syj_music: "res/img/syj/syj_music.plist"
    },
    shuigang: {
        item_shuigang: "res/common/item_sg.json"
    },
    boat: {
        item_boat: "res/common/boat.json",
    },
    thclj: {
        item_thclj: "res/common/thclj.json",
    },
    thclj2: {
        item_thclj2: "res/common/item_thclj2.json",
    },
    hl: {
        item_hl: "res/common/item_hl.json",
    },
    xwj: {
        item_xwj: "res/common/item_xwj.json",
        xwj_teach: "res/common/xwj_teach.json",
        xwj_bg1: "res/img/xwj/xwj_bg1.png",
        xwj_bg2: "res/img/xwj/xwj_bg2.png",
    }
}

function getRes(list, name) {
    if (list[name]) {
        var data = list[name]
        for (index in data) {
            var temp = data[index]
            if (NEEDCHANGEPATH) {
                temp.Src = temp.Src.replace("res", RESKEY)
            }
            switch (temp.Type) {
                case "img":
                    res[index] = temp.Src + ".png" //以后可能会出现多个实验图片名冲突 在这里改
                    break
                case "plist":
                    res[index] = temp.Src + ".plist"
                    res[index + 'img'] = temp.Src + ".png"
                    break
                case "mp3":
                    res[index] = temp.Src + ".mp3"
                    break
                case "mp4":
                    res[index] = temp.Src + ".mp4"
                    break
                case "jpg":
                    res[index] = temp.Src + ".jpg"
                    break
                case "ogg":
                    res[index] = temp.Src + ".ogg"
                    break
                case "content":
                    res[index] = temp.Src + ".png"
                    res[index + '_sound'] = temp.Src + ".mp3"
                    break
                case "tool":
                    res[index + "_normal"] = temp.Src + "_normal.png"
                    res[index + '_gray'] = temp.Src + "_gray.png"
                    break
                case "json":
                    res[index] = temp.Src + ".json"
                    break
                case "loop":
                    var pars = temp.Pars
                    pars = pars.split(";")
                    var start = Number(pars[0])
                    var end = Number(pars[1])
                    for (var i = start; i <= end; i++) {
                        res[sprintf(index, i)] = sprintf(temp.Src, i)
                    }
                    break
            }
        }
    } else {
        cc.log("no this exp name", name)
    }
}

var judge = function(str, match) {
    var len = str.length
    var lenMatch = match.length
    for (var i = len - lenMatch, j = 0; j < lenMatch; j++, i++) {
        if (str[i] != match[j]) {
            return false
        }
    }
    return true
}

var resInitFunc = function() {
    for (var i = 0; i < 26; i++) {
        itemsJson.boat[sprintf("boat1_%02d", i + 1)] = sprintf("res/img/boat/boat1/boat1_%02d.png", i + 1)
        itemsJson.boat[sprintf("boat2_%02d", i + 1)] = sprintf("res/img/boat/boat2/boat2_%02d.png", i + 1)
    }
    var ResList = [
        "Common",
    ]

    for (var i = 0; i < ResList.length; i++) {
        getRes(commonJs, ResList[i])
    }
}