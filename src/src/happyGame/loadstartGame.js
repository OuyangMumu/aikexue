/**
 * 统一命名空间定义文件，防止重复定义。
 * 禁用game和server关键字，game和server命名空间已被框架使用。
 */
var tools = tools || {};	//工具类

var model = model || {};	//数据模型

var allGamejsList = [       //读取所用js文件
    "src/common/funcs.js",
    "src/common/timerControl.js",
    "src/common/extra.js",
    "src/happyGame/gameImgJs.js",
    "src/happyGame/models/baseModel.js",
    "src/happyGame/models/GuanQiaData.js",
    "src/happyGame/models/TimuData.js",
    "src/happyGame/utils/common.js",
    "src/happyGame/utils/cartoon.js",
	"src/happyGame/views/baseView.js",
	"src/happyGame/views/sences/mainSence.js",
	"src/happyGame/views/layers/mainLayer.js",
	"src/happyGame/views/layers/choseLayer.js",
	"src/happyGame/views/layers/selectLayer.js",
	"src/happyGame/views/layers/answerLayer.js",
    "src/happyGame/views/layers/passLayer.js",
	"src/happyGame/controls/layerControl.js",
	"src/happyGame/controls/senceControl.js"
]


var res = {
    "img_load_1":"res/HappyGameRes/cartoon/img_load_1.png",
    "img_load_2":"res/HappyGameRes/cartoon/img_load_2.png",
    "img_load_3":"res/HappyGameRes/cartoon/img_load_3.png",
    "img_load_4":"res/HappyGameRes/cartoon/img_load_4.png",
    "img_load_5":"res/HappyGameRes/cartoon/img_load_5.png",
    "ziti":"res/HappyGameRes/cartoon/ziti.TTF"
}

var gameRes = []

var getStartRes = function(){
    for (var i in res) {
        gameRes.push(res[i])
    }
}

var getAllRes = function(){
    gameRes = []
    getRes(gameImgJs,"gameImgs")
	for (var i in res) {
		gameRes.push(res[i])
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
