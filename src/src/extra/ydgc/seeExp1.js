//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("seeplist1")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "s1sound0"
                })
            })
        }
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor() //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var list = [38, 32, 18, 33, 19, 34, 35, 30, 36, 29, 37, 28, 17, 31]
        var imgList = []
        var posList = []
        for (var i = 0; i < list.length; i++) {
            imgList[i] = sprintf("see1_%02d.png", list[i])
        }
        var startPos = cc.p(110, 350)
        var i = 0
        for (; i < 3; i++) {
            posList[i] = cc.p(startPos.x, startPos.y - i * 100)
        }
        startPos = cc.p(590, 500)
        for (; i < 7; i++) {
            posList[i] = cc.p(startPos.x, startPos.y - (i - 3) * 100)
        }
        var node = createNewLink({
            imgList: imgList,
            posList: posList,
            failBack: false,
            init: function() {
                var uilist = [
                    "font0",
                    "font1",
                    "font2",
                    "font3",
                    "font4",
                    "font5",
                    "font6",
                    "font7",
                    "item1",
                    "item2",
                    "item3",
                    "item4",
                    "item5",
                    "item6",
                    "item7",
                ]
                var ye = loadNode(res.see1_json, uilist, "bg")
                ye.setPosition(30, 0)
                safeAdd(self, ye)

                var drawList = [
                    [
                        [cc.p(120, 30), cc.p(240, -40)]
                    ],
                    [
                        [cc.p(120, 30), cc.p(180, -30)]
                    ],
                    [
                        [cc.p(120, 30), cc.p(145, 60)],
                        [cc.p(120, 30), cc.p(185, 30)]
                    ],
                    [
                        [cc.p(0, 30), cc.p(-80, 50)]
                    ],
                    [
                        [cc.p(0, 30), cc.p(-30, 30)]
                    ],
                    [
                        [cc.p(0, 30), cc.p(-100, 35)]
                    ],
                    [
                        [cc.p(0, 30), cc.p(-150, 100)]
                    ],
                ]

                ye.showIndex = function(index) {
                    for (var i = 0; i < 8; i++) {
                        var font = ye[sprintf("font%d", i)]
                        var item = ye[sprintf("item%d", i)]
                        var btn = null
                        if (self.imgList) {
                            btn = self.imgList.btnList[i - 1]
                        }
                        if (font) {
                            font.setVisible(index == i)
                        }
                        if (btn) {
                            btn.change(index == i, false)

                            if (!btn.showLine) {
                                btn.showLine = function(judge) {
                                    var btn = this
                                    if (!btn.line) {
                                        btn.line = createDrawLines({
                                            buf: drawList[i - 1],
                                            pos: cc.p(0,0),
                                            father: btn,
                                            line: 1.5,
                                        })
                                    }
                                    btn.line.setVisible(judge)
                                }
                            }
                            btn.showLine(index == i)
                        }
                        if (item) {
                            switch (index) {
                                case 4:
                                case 1:
                                    if (i == 4 || i == 1) {
                                        item.setVisible(true)
                                    }
                                    break
                                default:
                                    if (i == 4 || i == 1) {
                                        item.setVisible(false)
                                    }
                                    break
                            }
                            item.red.setVisible(index == i)
                        }
                    }
                    if (index != 0) {
                        self.nodebs.say({ //当存在key为show的对话ID才调用
                            key: sprintf("s1sound%d", index),
                            force: true,
                            sameStop: true,
                        })
                    }
                }
                ye.init = function() {
                    for (var i = 1; i < 8; i++) {
                        var item = ye[sprintf("item%d", i)]
                        var red = item.getChildByName("red")
                        item.red = red
                        item.index = i
                        createTouchEvent({
                            item: item,
                            begin: function(data) {
                                var item = data.item
                                var result = judgeOpInPos(data)
                                if (result) {
                                    ye.showIndex(item.index)
                                }
                                return result
                            },
                            move: function(data) {
                                //judgeOpInPos(data)
                            }
                        })
                    }
                    ye.showIndex(0)
                }
                self.ye = ye
                ye.init()
            },
            linkFun: function(index) {
                if (self.ye) {
                    self.ye.showIndex(index + 1)
                }
            },
        })
        self.imgList = node
        safeAdd(self, node)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 8; i++) {
            var key = sprintf("s1sound%d", i)
            addContent({
                people: this.nodebs,
                key: key, //对话标签 之后让人物说话需要用到的参数
                sound: res[key]
            })
        }
    }
})