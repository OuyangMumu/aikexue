//CONFIG
var TEST_FLAG = false
//第二行为测试标签 true则不跑底层特殊整合逻辑
var GAMEKEY = null
//弃用参数start
var RESKEY = "res"
var NEEDCHANGEPATH = false
//弃用参数end

//PATH
// var COMMONPATH = "/mnt/sdcard/Android/data"
// var EXPPATH = "/mnt/sdcard/data/exp"
var funcName = "GetKey"
var funcIos = "GetKey:and:"

//Android config
//var activity = "com/dy/sdk/cocos/CocosActivity"
var activity = "com/dy/aikexue/src/cocos/AbsCocosActivity"
var funType = "(Ljava/lang/String;)Ljava/lang/String;"
var funType2 = "()Ljava/lang/String;"
var ANDROID_RETURN_FUNC = "finishAct"
var ANDROID_RETURN_TYPE = "()V"
var ANDROID_CANCEL_FUNC = "cancelLoading"
var ANDROID_CANCEL_TYPE = "()V"
var TOKEN = "5DA023D6A3350536CB0C0F64F2833DF0" //全局token
var CURURL = "https://akxs.dev.gdy.io" //当前服务器url前缀
// var devUrl = "https://akxs.dev.gdy.io"             //dev地址
// var chkUrl = "https://akxs.chk.gdy.io"             //chk地址
// var chk2Url = "https://akxs.dyfchk2.aikexue.com/"  //chk2地址
// var onLineUrrl = "https://akxs.aikexue.com"        //对外地址

//IOS CONFIG
var IOS_CONTROLLER = "AppController"
var IOS_RETURN_FUNC = "CloseCocos2d"
var UNZIPPATH = ""

function str_repeat(i, m) {
    for (var o = []; m > 0; o[--m] = i);
    return o.join('');
}

function sprintf() {
    var i = 0,
        a, f = arguments[i++],
        o = [],
        m, p, c, x, s = '';
    while (f) {
        if (m = /^[^\x25]+/.exec(f)) {
            o.push(m[0]);
        } else if (m = /^\x25{2}/.exec(f)) {
            o.push('%');
        } else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
            if (((a = arguments[m[1] || i++]) == null) || (a == undefined)) {
                throw ('Too few arguments.');
            }
            if (/[^s]/.test(m[7]) && (typeof(a) != 'number')) {
                throw ('Expecting number but found ' + typeof(a));
            }
            switch (m[7]) {
                case 'b':
                    a = a.toString(2);
                    break;
                case 'c':
                    a = String.fromCharCode(a);
                    break;
                case 'd':
                    a = parseInt(a);
                    break;
                case 'e':
                    a = m[6] ? a.toExponential(m[6]) : a.toExponential();
                    break;
                case 'f':
                    a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a);
                    break;
                case 'o':
                    a = a.toString(8);
                    break;
                case 's':
                    a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a);
                    break;
                case 'u':
                    a = Math.abs(a);
                    break;
                case 'x':
                    a = a.toString(16);
                    break;
                case 'X':
                    a = a.toString(16).toUpperCase();
                    break;
            }
            a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
            c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
            x = m[5] - String(a).length - s.length;
            p = m[5] ? str_repeat(c, x) : '';
            o.push(s + (m[4] ? a + p : p + a));
        } else {
            throw ('Huh ?!');
        }
        f = f.substring(m[0].length);
    }
    return o.join('');
}

var g_resources = [];

var ResKeyChange = function(data) {
    var src = data.src || {}
    var before = data.before
    var after = data.after
    for (var i in src) {
        src[i] = src[i].replace(before, after)
    }
    return src
}

var preInit = function() {
    //读取额外资源
    if(resInitFunc){
        resInitFunc()
    }
    if (mainInfo.addRes) {
        for (var i in mainInfo.addRes) {
            res[i] = mainInfo.addRes[i]
        }
    }
    if (mainInfo.addItems) {
        for (var i = 0; i < mainInfo.addItems.length; i++) {
            var temp = mainInfo.addItems[i]
            var judge = itemsJson[temp]
            for (var j in judge) {
                res[j] = judge[j]
            }
        }
    }
    if (!NEEDCHANGEPATH) {
        res = ResKeyChange({
            src: res,
            before: "res",
            after: RESKEY,
        })
    }

    for (var i in res) {
        g_resources.push(res[i]);
    }
}

var getJavaAC = function(type) {
    var result = null
    switch (type) {
        case 1:
            result = activity
            break
        case 2:
            result = ANDROID_RETURN_FUNC
            break
    }
    return result
}
var PrintViewInfo = function() {
    cc.log("**********PRINT VIEW INFO**********")
    cc.log("CANVAS    SIZE: ", "w: ", cc.view.getCanvasSize().width, " h: ", cc.view.getCanvasSize().height)
    cc.log("FRAME     SIZE:", "w: ", cc.view.getFrameSize().width, " h: ", cc.view.getFrameSize().height)
    cc.log("VISIBLE   SIZE:", "w: ", cc.view.getVisibleSize().width, " h: ", cc.view.getVisibleSize().height)
    cc.log("VISIBLE ORIGIN:", "x: ", cc.view.getVisibleOrigin().x, " y: ", cc.view.getVisibleOrigin().y)
    cc.log("DesignResolutionSize", "w: ", cc.view.getDesignResolutionSize().width, " h: ", cc.view.getDesignResolutionSize().height)
    cc.log("**********END VIEW INFO**********")
}

cc.game.onStart = function() {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));
    // Pass true to enable retina display, on Android disabled by default to improve performance
    cc.view.enableRetina(cc.sys.os === cc.sys.OS_IOS ? true : false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size
    //cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.EXACT_FIT);
    if(cc.sys.isNative){
        if(cc.sys.os == cc.sys.OS_WINDOWS){
            cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.EXACT_FIT)
        }else{
            cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.SHOW_ALL)
        }
    }else{
        if(cc.sys.isMobile){
            cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.SHOW_ALL)
        }else{
            cc.view.setDesignResolutionSize(1136, 640, cc.ResolutionPolicy.EXACT_FIT)
        }
    }
    // Instead of set design resolution, you can also set the real pixel resolution size
    // Uncomment the following line and delete the previous line.
    // cc.view.setRealPixelResolution(960, 640, cc.ResolutionPolicy.SHOW_ALL);
    // The game will be resized when browser size change
    cc.view.resizeWithBrowserSize(true);
    
    //load resourcess
    cc.game.setFrameRate(15)
    if (!TEST_FLAG) {
        //判断平台
        if (cc.sys.isNative) {
            //安卓
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                GAMEKEY = jsb.reflection.callStaticMethod(activity, funcName, funType, "GAMEKEY")
                COMMONPATH = jsb.reflection.callStaticMethod(activity, funcName, funType, "COMMONPATH")
                EXPPATH = jsb.reflection.callStaticMethod(activity, funcName, funType, "EXPPATH")
                TOKEN = jsb.reflection.callStaticMethod(activity, funcName, funType, "TOKEN")
                CURURL = jsb.reflection.callStaticMethod(activity, funcName, funType, "CURURL")
                jsb.fileUtils.addSearchPath(COMMONPATH)
                jsb.fileUtils.addSearchPath(EXPPATH)
                //ios
            } else if (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX) {
                GAMEKEY = jsb.reflection.callStaticMethod(IOS_CONTROLLER, funcIos, "GAMEKEY")
                TOKEN = jsb.reflection.callStaticMethod(IOS_CONTROLLER, funcIos, "TOKEN")
                CURURL = jsb.reflection.callStaticMethod(IOS_CONTROLLER, funcIos, "CURURL")
                var UNZIP_FUNC = function(path, dir) {
                    var FAIL_TIME = 10
                    while (FAIL_TIME > 0) {
                        if (jsb.fileUtils.unzip(path, dir, "")) {
                            return true
                        } else {
                            FAIL_TIME--
                        }
                    }
                    return false
                }
                UNZIPPATH = jsb.reflection.callStaticMethod(IOS_CONTROLLER, funcIos, "GET_UNZIP_PATH")
                cc.log("********************UNZIPPATH", UNZIPPATH)
                var LOOP_UNZIP = function() {
                    var JUDGE_PATH = jsb.reflection.callStaticMethod(IOS_CONTROLLER, funcIos, "GET_ZIP")
                    cc.log("******************************JUDGE_PATH:", JUDGE_PATH)
                    if (JUDGE_PATH && JUDGE_PATH != "") {
                        if (UNZIP_FUNC(JUDGE_PATH, UNZIPPATH)) {
                            //finish unzip
                            jsb.reflection.callStaticMethod(IOS_CONTROLLER, funcIos, "FINISH_UNZIP", JUDGE_PATH)
                            LOOP_UNZIP()
                        } else {
                            //fail unzip 解压失败 直接返回上级页面
                            cc.log("*****************fail unzip**************", JUDGE_PATH)
                            jsb.reflection.callStaticMethod(IOS_CONTROLLER, IOS_RETURN_FUNC)
                        }
                    } else {
                        cc.log("finish unzip!")
                    }
                }
                LOOP_UNZIP()
                jsb.fileUtils.addSearchPath(UNZIPPATH)
            }
        } else {
            //web网页 浏览器
        }
    }
    
    PrintViewInfo()
    /* 
       总游戏界面
       var scene = new main_Scene()
       scene.loadGame()
    */
    if (GAMEKEY == null)
        //HappyGameRes //答题模式简称
        GAMEKEY = "HappyGameRes" //实验名字简称
    if(cc.sys.os == cc.sys.OS_WINDOWS){
        if(cc.sys.isNative){
            try{
                GAMEKEY = cc.director.getCmdLine()
                cc.log("GAMEKEY",GAMEKEY) 
            }catch(e){
                cc.log("need to print game name")
            }
       }
    }
    var scene = new AssetsManagerLoaderScene();
    scene.run()
};
cc.game.run();