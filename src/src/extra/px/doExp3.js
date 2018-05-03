//@author mu @16/4/27

var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("px_hand1")
        loadPlist("px_hand2")
        loadPlist("px_hand3")
        loadPlist("px_ptsld")
        loadPlist("px_spbxd")
        loadPlist("px_ywsld")
        loadPlist("px2_ptsld")
        loadPlist("px2_spbxd")
        loadPlist("px2_ywsld")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        var self = this
        if (this.nodebs) {
            this.nodebs.show(function() {
                self.canSay = true
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: self.curKey,
                })
            })
        }
        if (self.toolbtn) {
            self.toolbtn.show()
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
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.px_bg,
                                downData: {
                                    nums: 9,
                                    bufs: [
                                        [null, "#px_bg_04.png", "#px_bg_05.png", "#px_bg_06.png"],
                                        [null, "#px_bg_04.png", "#px_bg_05.png", "#px_bg_06.png"],
                                        [null, "#px_bg_04.png", "#px_bg_05.png", "#px_bg_06.png"],
                                        [null, "#px_bg_04.png", "#px_bg_05.png", "#px_bg_06.png"],
                                        [null, "#px_bg_04.png", "#px_bg_05.png", "#px_bg_06.png"],
                                        [null, "#px_bg_04.png", "#px_bg_05.png", "#px_bg_06.png"],
                                        [null, "#px_bg_04.png", "#px_bg_05.png", "#px_bg_06.png"],
                                        [null, "#px_bg_04.png", "#px_bg_05.png", "#px_bg_06.png"],
                                        [null, "#px_bg_04.png", "#px_bg_05.png", "#px_bg_06.png"],
                                    ],
                                    keys: [3, 3, 3, 2, 2, 2, 1, 1, 1],
                                    scale: 1.3,
                                },
                            })
                            self.biaoge = bg

                            bg.linkAnswer = function() {
                                if (!self.resultBg1) {
                                    var img = createShowImg({
                                        img: "#px_bg_01.png",
                                    })
                                    safeAdd(self, img)
                                    self.resultBg1 = img
                                }
                                self.resultBg1.show()
                            }
                            safeAdd(self, bg)
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var btnList = []
        var funs = [
            function() {
                if (!self.bg1) {
                    var node = new cc.Node()
                    safeAdd(self, node)
                    self.bg1 = node
                    var infoList = [{
                        pos: getMiddle(-300, -250),
                        tex: "px_ptsld_%02d.png",
                        last: 43,
                        mix: cc.p(10, 30),
                        off: cc.p(179, 70),
                        off2: cc.p(179, 130),
                    }, {
                        pos: getMiddle(0, -50),
                        tex: "px_ywsld_%02d.png",
                        last: 43,
                        mix: cc.p(0, 40),
                        off: cc.p(179, 78),
                        off2: cc.p(179, 130),
                    }, {
                        pos: getMiddle(300, -250),
                        tex: "px_spbxd_%02d.png",
                        last: 48,
                        mix: cc.p(15, 0),
                        off: cc.p(157, 70),
                        off2: cc.p(179, 130),
                    }]
                    var mix = cc.p(-100, 0)

                    node.reinit = function() {
                        var node = this
                        var sldList = node.sldList
                        for (var i = 0; i < sldList.length; i++) {
                            var sld = sldList[i]
                            sld.reinit()
                        }
                        if (self.canSay) {
                            self.nodebs.say({
                                key: "sound1",
                                force: true,
                            })
                        }
                    }
                    node.sldList = []
                    for (var i = 0; i < infoList.length; i++) {
                        var info = infoList[i]
                        var img = new cc.Sprite(res[sprintf("img_deco%d", i + 1)])
                        var pos = cc.p(info.pos.x + mix.x, info.pos.y + mix.y)
                        img.setPosition(pos)
                        safeAdd(node, img)

                        var sld = new cc.Sprite("#" + sprintf(info.tex, 1))
                        sld.setPosition(pos.x + info.mix.x, pos.y + 100 + info.mix.y)
                        safeAdd(node, sld)
                        node.sldList[i] = sld

                        var item = sld
                        var hand1 = new cc.Sprite("#px_ss_01.png")
                        hand1.setLocalZOrder(-1)
                        safeAdd(item, hand1)
                        hand1.setPosition(0, 28.97)
                        var hand2 = new cc.Sprite("#px_sx_01.png")
                        safeAdd(item, hand2)
                        var hand3 = new cc.Sprite("#px_sp_01.png")
                        safeAdd(item, hand3)
                        item.hand1 = hand1
                        item.hand2 = hand2
                        item.hand3 = hand3

                        setOff(hand1, info.off)
                        setOff(hand2, info.off)
                        setOff(hand3, info.off2)
                        sld.info = info

                        sld.reinit = function() {
                            var sld = this
                            var hand1 = sld.hand1
                            var hand2 = sld.hand2
                            var hand3 = sld.hand3
                            sld.show = false
                            hand1.stopAllActions()
                            hand2.stopAllActions()
                            hand3.stopAllActions()
                            hand1.setSpriteFrame("px_ss_01.png")
                            hand2.setSpriteFrame("px_sx_01.png")
                            hand3.setSpriteFrame("px_sp_01.png")
                            hand1.setVisible(false)
                            hand2.setVisible(false)
                            hand3.setVisible(false)
                            sld.stopAllActions()
                            sld.setSpriteFrame(sprintf(sld.info.tex, 1))
                        }

                        createTouchEvent({
                            item: sld,
                            begin: function(data) {
                                return getLoopVis(data.item)
                            },
                            end: function(data) {
                                var item = data.item
                                var info = item.info
                                if (!item.show) {
                                    item.show = true
                                    var time = 2 / 24
                                    var hand1 = item.hand1
                                    var hand2 = item.hand2
                                    var hand3 = item.hand3

                                    hand1.setVisible(true)
                                    hand1.runAction(
                                        createAnimation({
                                            frame: "px_ss_%02d.png",
                                            end: 22,
                                            time: time,
                                        })
                                    )
                                    hand2.setVisible(true)
                                    hand2.runAction(
                                        createAnimation({
                                            frame: "px_sx_%02d.png",
                                            end: 22,
                                            time: time,
                                            fun: function() {
                                                hand3.setVisible(true)
                                                hand1.setVisible(false)
                                                hand2.setVisible(false)
                                                hand3.runAction(createAnimation({
                                                    frame: "px_sp_%02d.png",
                                                    end: 20,
                                                    time: time,
                                                    fun: function() {
                                                        hand3.setVisible(false)
                                                    }
                                                }))
                                            }
                                        })
                                    )
                                    item.runAction(
                                        createAnimation({
                                            frame: info.tex,
                                            end: info.last,
                                            time: time,
                                        })
                                    )
                                }
                            }
                        })
                    }
                }
                var bg1 = self.bg1
                bg1.reinit()
                bg1.setVisible(true)
                var bg2 = self.bg2
                var bg3 = self.bg3
                if (bg2) {
                    bg2.setVisible(false)
                }
                if (bg3) {
                    bg3.setVisible(false)
                }
                self.curKey = "sound1"
                btnList[1].change(false, false)
                btnList[2].change(false, false)
            },
            function() {
                if (!self.bg2) {
                    var node = new cc.Node()
                    safeAdd(self, node)
                    self.bg2 = node
                    var infoList = [{
                        pos: getMiddle(-300, -250),
                        tex: "px2_ptsld_%02d.png",
                        last: 25,
                        mix: cc.p(10, 30),
                        off: cc.p(-25, 50),
                        off2: cc.p(360, 50),
                        dis: 25,
                    }, {
                        pos: getMiddle(0, -50),
                        tex: "px2_ywsld_%02d.png",
                        last: 25,
                        mix: cc.p(0, 40),
                        off: cc.p(-30, 50),
                        off2: cc.p(350, 50),
                        dis: 20,
                    }, {
                        pos: getMiddle(300, -250),
                        tex: "px2_spbxd_%02d.png",
                        last: 25,
                        mix: cc.p(15, 0),
                        off: cc.p(50, 50),
                        off2: cc.p(450, 50),
                        dis: 120,
                    }]
                    var mix = cc.p(-100, 0)

                    node.reinit = function() {
                        var node = this
                        var sldList = node.sldList
                        for (var i = 0; i < sldList.length; i++) {
                            var sld = sldList[i]
                            sld.reinit()
                        }
                        if (self.canSay) {
                            self.nodebs.say({
                                key: "sound2",
                                force: true,
                            })
                        }
                    }
                    node.sldList = []
                    for (var i = 0; i < infoList.length; i++) {
                        var info = infoList[i]
                        var img = new cc.Sprite(res[sprintf("img_deco%d", i + 1)])
                        var pos = cc.p(info.pos.x + mix.x, info.pos.y + mix.y)
                        img.setPosition(pos)
                        safeAdd(node, img)

                        var sld = new cc.Sprite("#" + sprintf(info.tex, 1))
                        sld.setPosition(pos.x + info.mix.x, pos.y + 100 + info.mix.y)
                        safeAdd(node, sld)
                        node.sldList[i] = sld

                        var item = sld
                        var hand1 = new cc.Sprite("#px_s1_01.png")
                        hand1.setLocalZOrder(-1)
                        safeAdd(item, hand1)
                        hand1.setPosition(0, 28.97)
                        var hand2 = new cc.Sprite("#px_s2_01.png")
                        safeAdd(item, hand2)

                        var hand3 = new cc.Sprite("#px_s1_01.png")
                        hand3.setLocalZOrder(-1)
                        safeAdd(item, hand3)
                        hand3.setPosition(0, 28.97)
                        var hand4 = new cc.Sprite("#px_s2_01.png")
                        safeAdd(item, hand4)

                        hand3.setScaleX(-1)
                        hand4.setScaleX(-1)

                        item.hand1 = hand1
                        item.hand2 = hand2
                        item.hand3 = hand3
                        item.hand4 = hand4

                        setOff(hand1, info.off)
                        setOff(hand2, info.off)

                        setOff(hand3, info.off2)
                        setOff(hand4, info.off2)

                        hand1.rootPos = hand1.getPosition()
                        hand2.rootPos = hand2.getPosition()

                        hand3.rootPos = hand3.getPosition()
                        hand4.rootPos = hand4.getPosition()
                        sld.info = info

                        sld.reinit = function() {
                            var sld = this
                            var hand1 = sld.hand1
                            var hand2 = sld.hand2
                            var hand3 = sld.hand3
                            var hand4 = sld.hand4
                            sld.show = false
                            hand1.stopAllActions()
                            hand2.stopAllActions()
                            hand3.stopAllActions()
                            hand4.stopAllActions()
                            hand1.setPosition(hand1.rootPos)
                            hand2.setPosition(hand2.rootPos)
                            hand3.setPosition(hand3.rootPos)
                            hand4.setPosition(hand4.rootPos)
                            hand1.setSpriteFrame("px_s1_01.png")
                            hand2.setSpriteFrame("px_s2_01.png")
                            hand3.setSpriteFrame("px_s1_01.png")
                            hand4.setSpriteFrame("px_s2_01.png")
                            hand1.setVisible(false)
                            hand2.setVisible(false)
                            hand3.setVisible(false)
                            hand4.setVisible(false)
                            sld.stopAllActions()
                            sld.setSpriteFrame(sprintf(sld.info.tex, 1))
                        }

                        createTouchEvent({
                            item: sld,
                            begin: function(data) {
                                return getLoopVis(data.item)
                            },
                            end: function(data) {
                                var item = data.item
                                var info = item.info
                                if (!item.show) {
                                    item.show = true
                                    var time = 2 / 24
                                    var hand1 = item.hand1
                                    var hand2 = item.hand2
                                    var hand3 = item.hand3
                                    var hand4 = item.hand4

                                    var actTime = (info.last - 9) * time

                                    hand1.setVisible(true)
                                    hand1.runAction(
                                        createAnimation({
                                            frame: "px_s1_%02d.png",
                                            end: 8,
                                            time: time,
                                            fun: function() {
                                                addShowType({
                                                    item: hand1,
                                                    show: "moveBy",
                                                    time: actTime,
                                                    buf: cc.p(-info.dis, 0),
                                                    fun: function(item) {
                                                        item.setVisible(false)
                                                    }
                                                })
                                                addShowType({
                                                    item: hand2,
                                                    show: "moveBy",
                                                    time: actTime,
                                                    buf: cc.p(-info.dis, 0),
                                                    fun: function(item) {
                                                        item.setVisible(false)
                                                    }
                                                })
                                            }
                                        })
                                    )
                                    hand2.setVisible(true)
                                    hand2.runAction(
                                        createAnimation({
                                            frame: "px_s2_%02d.png",
                                            end: 8,
                                            time: time,
                                        })
                                    )

                                    hand3.setVisible(true)
                                    hand3.runAction(
                                        createAnimation({
                                            frame: "px_s1_%02d.png",
                                            end: 8,
                                            time: time,
                                            fun: function() {
                                                addShowType({
                                                    item: hand3,
                                                    show: "moveBy",
                                                    time: actTime,
                                                    buf: cc.p(info.dis, 0),
                                                    fun: function(item) {
                                                        item.setVisible(false)
                                                    }
                                                })
                                                addShowType({
                                                    item: hand4,
                                                    show: "moveBy",
                                                    time: actTime,
                                                    buf: cc.p(info.dis, 0),
                                                    fun: function(item) {
                                                        item.setVisible(false)
                                                    }
                                                })
                                            }
                                        })
                                    )
                                    hand4.setVisible(true)
                                    hand4.runAction(
                                        createAnimation({
                                            frame: "px_s2_%02d.png",
                                            end: 8,
                                            time: time,
                                        })
                                    )
                                    item.runAction(
                                        createAnimation({
                                            frame: info.tex,
                                            end: info.last,
                                            time: time,
                                        })
                                    )
                                }
                            }
                        })
                    }
                }
                var bg2 = self.bg2
                bg2.reinit()
                bg2.setVisible(true)
                var bg1 = self.bg1
                var bg3 = self.bg3
                if (bg1) {
                    bg1.setVisible(false)
                }
                if (bg3) {
                    bg3.setVisible(false)
                }
                self.curKey = "sound2"
                btnList[0].change(false, false)
                btnList[2].change(false, false)
            },
            function() {
                if (!self.bg3) {
                    var node = new cc.Node()
                    safeAdd(self, node)
                    self.bg3 = node

                    var nz = createClock({
                        ifsec: true,
                        type: "naozhong",
                    })
                    nz.newBg.setVisible(true)
                    nz.setScale(1.4)
                    nz.setPosition(getMiddle(-60, 60))
                    safeAdd(node, nz)
                    nz.start()

                    var list = [
                        "#px2_ptsld_01.png",
                        "#px2_ywsld_01.png",
                        "#px2_spbxd_01.png",
                    ]

                    node.sldList = []

                    for (var i = 0; i < 3; i++) {
                        var img = new cc.Sprite(res[sprintf("img_deco%d", i + 1)])
                        var pos = cc.p(230 + i * 280, 50)
                        img.setPosition(pos)
                        var item = new cc.Sprite(list[i])
                        item.setPosition(pos.x, pos.y + 70)
                        safeAdd(node, item)
                        item.setScale(0.6)
                        safeAdd(node, img)
                        item.index = i
                        node.sldList[i] = item

                        createTouchEvent({
                            item: item,
                            begin: function(data) {
                                var item = data.item
                                var result = getLoopVis(data.item)
                                if (result) {
                                    if (node.pastImg) {
                                        node.pastImg.setVisible(false)
                                        node.pastImg.father.setVisible(true)
                                    }
                                    if (!item.getImg) {
                                        var img = new cc.Sprite(res[sprintf("img_p%d", item.index + 1)])
                                        safeAdd(node, img)
                                        item.getImg = img
                                        img.father = item

                                        createTouchEvent({
                                            item: img,
                                            begin: function(data) {
                                                return getLoopVis(data.item)
                                            },
                                            autoMove: true,
                                        })
                                    }
                                    var img = item.getImg
                                    img.setVisible(true)
                                    img.setPosition(data.pos)
                                    item.setVisible(false)
                                    node.pastImg = img
                                }
                                return result
                            },
                            move: function(data) {
                                var item = data.item.getImg
                                var delta = data.delta
                                item.x += delta.x
                                item.y += delta.y
                            },
                        })
                    }

                    node.reinit = function() {
                        var node = this
                        var sldList = node.sldList
                        for (var i = 0; i < sldList.length; i++) {
                            var sld = sldList[i]
                            if (sld) {
                                sld.setVisible(true)
                                if (sld.getImg) {
                                    sld.getImg.setVisible(false)
                                }
                            }
                        }
                        if (self.canSay) {
                            self.nodebs.say({
                                key: "sound3",
                                force: true,
                            })
                        }
                    }
                }
                var bg3 = self.bg3
                bg3.setVisible(true)
                var bg1 = self.bg1
                var bg2 = self.bg2
                bg3.reinit()
                if (bg1) {
                    bg1.setVisible(false)
                }
                if (bg2) {
                    bg2.setVisible(false)
                }
                self.curKey = "sound3"
                btnList[0].change(false, false)
                btnList[1].change(false, false)
            }
        ]
        for (var i = 0; i < 3; i++) {
            var btn = createJudgeBtn({
                normal: res[sprintf("px%d_normal", i + 1)],
                select: res[sprintf("px%d_select", i + 1)],
                pos: getMiddle(-480, 180 - i * 60),
                fun: funs[i],
                onlyTrue: true,
            })
            btnList[i] = btn
            safeAdd(self, btn)
        }

        btnList[0].change(true, true)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 3; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: res[sprintf("do3_content%d", i + 1)], //图片和声音文件
                sound: res[sprintf("do3_sound%d", i + 1)]
            })
        }
    }
})