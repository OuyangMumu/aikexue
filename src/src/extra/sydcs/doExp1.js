//@author mu @16/4/27
var SYDCS_BG = null
var sydcs_biaoge = function() {
    if (!SYDCS_BG) {
        var bg = createBiaoge({
            json: res.sydcs_bg,
            inputNum: 8,
            scale: 0.9,
            rootColor: [cc.color(153, 0, 255), cc.color(153, 0, 255), cc.color(153, 0, 255), cc.color(153, 0, 255),
                cc.color(153, 0, 255), cc.color(153, 0, 255), cc.color(153, 0, 255), cc.color(153, 0, 255),
            ]
        })
        bg.retain()
        SYDCS_BG = bg
    }
    return SYDCS_BG
}

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        var self = this
        this._super()
        if (self.biaoge) {
            self.biaoge.removeFromParent(false)
        }
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
                })
            })
        }
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        var bg = sydcs_biaoge()
                        safeAdd(self, bg)
                        self.biaoge = bg
                        bg.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var item_do = loadDo({
            key: "do1",
        })
        safeAdd(self, item_do)

        var uilist = [
            "item_gu",
            "item_gc"
        ]
        loadList(item_do, uilist)
        var gu = item_do.item_gu
        var gc = item_do.item_gc
        gc.setLocalZOrder(2)
        reAdd(gc)
        gc.rootPos = gc.getPosition()
        createTouchEvent({
            item: gc,
            begin: function(data) {
                var item = data.item
                item.pastY = item.getPositionY()
                return true
            },
            move: function(data) {
                var item = data.item
                var delta = data.delta
                var pos = data.pos
                pos = gu.convertToNodeSpace(pos)

                if (pos.y < item.rootPos.y) {
                    pos.y = item.rootPos.y
                    gu.shake(item.pastY - pos.y)
                }
                item.y = pos.y
                item.pastY = item.y
            }
        })
        gu.init = function() {
            var posList = [
                cc.p(93, 286),
                cc.p(123, 265),
                cc.p(136, 296),
                cc.p(181, 337),
                cc.p(201, 266),
                cc.p(152, 300),
                cc.p(256, 265),
                cc.p(320, 277),
                cc.p(375, 300),
                cc.p(400, 322),
            ]
            gu.miList = []
            for (var i = 0; i < posList.length; i++) {
                var mi = new cc.Sprite("#sydcs_do_08.png")
                mi.setPosition(posList[i])
                mi.setLocalZOrder(1)
                safeAdd(gu, mi)
                gu.miList[gu.miList.length] = mi
                var rate = 3//cc.sys.isNative ? 3 : 1
                mi.shake = function(buf) {
                    var mi = this
                    if (!mi.shaking) {
                        mi.shaking = true
                        var rand = (Math.random() * 0.3 + 0.7) * buf * 0.5 * rate
                        addShowType({
                            item: mi,
                            show: "jumpBy",
                            buf: cc.p(0, rand),
                            time: rand / 80,
                            fun: function(item) {
                                item.shaking = false
                            }
                        })
                    }
                }
            }
        }
        gu.init()
        gu.shake = function(buf) {
            if (buf != 0) {
                playEffect(res.do1_sound)
                var miList = gu.miList
                for (var i = 0; i < miList.length; i++) {
                    miList[i].shake(buf)
                }
            }
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.do_content1, //图片和声音文件
            sound: res.sound_do1
        })
    }
})