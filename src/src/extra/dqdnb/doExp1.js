//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("dqdnb_hand")
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
                    key: "sound1"
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
        self.curIndex = 1
        return true
    },
    initScene: function() {
        var self = this
        var ballInfo = [{
            pos: cc.p(300, 110),
            color: cc.color(255, 255, 0, 255),
            scale: 0.45,
            order: 10,
        }, {
            pos: cc.p(500, 130),
            color: cc.color(255, 0, 0, 255),
            scale: 0.7,
            order: 4,
        }, {
            pos: cc.p(716, 161),
            color: cc.color(255, 255, 255, 255),
            scale: 1.0,
            order: 7,
        }, ]
        var ballList = []
        var createHand = function(flip) {
            var item = this
            flip = flip || false
            var hand1 = new cc.Sprite("#act_down1.png")
            hand1.setFlippedX(flip)
            hand1.setLocalZOrder(item.getLocalZOrder() + 1)
            var hand2 = new cc.Sprite("#act_up1.png")
            hand2.setFlippedX(flip)
            hand2.setLocalZOrder(item.getLocalZOrder() - 1)
            var hand = {
                hand1: hand1,
                hand2: hand2,
                mix: flip ? cc.p(3, -26) : cc.p(-2.5357, -26)
            }
            hand.setPosition = function(x, y) {
                var hand = this
                hand.hand2.setPosition(x, y)
                hand.hand1.setPosition(x + hand.mix.x, y + hand.mix.y)
            }
            hand.setVisible = function(judge) {
                var hand = this
                hand.hand1.setVisible(judge)
                hand.hand2.setVisible(judge)
            }
            hand.setOpacity = function(op) {
                var hand = this
                hand.hand1.setOpacity(op)
                hand.hand2.setOpacity(op)
            }
            hand.run = function(fun) {
                var hand = this
                hand.setOpacity(0)
                hand.setVisible(true)
                var disl = 10
                var disr = 10
                var time = 8 / 24
                var timeFade = 2 / 24
                var upX = 30
                var upy = 20
                addShowType({
                    item: hand.hand1,
                    show: "moveBy",
                    buf: flip ? cc.p(-disl, 0) : cc.p(disr, 0),
                    time: time,
                    fun: function(item) {
                        item.runAction(cc.repeat(createAnimation({
                            frame: "act_down%d.png",
                            end: 6,
                            time: 1 / 24,
                        }), 11))
                        addShowType({
                            item: item,
                            show: "moveBy",
                            time: 66 / 24,
                            buf: flip ? cc.p(-upX, upy) : cc.p(upX, upy),
                            fun: function(item) {
                                addShowType({
                                    item: item,
                                    show: "fadeOut",
                                    time: timeFade,
                                })
                            }
                        })
                    }
                })
                addShowType({
                    item: hand.hand2,
                    show: "moveBy",
                    buf: flip ? cc.p(-disl, 0) : cc.p(disr, 0),
                    time: time,
                    fun: function(item) {
                        item.runAction(cc.repeat(createAnimation({
                            frame: "act_up%d.png",
                            end: 6,
                            time: 1 / 24,
                        }), 11))
                        addShowType({
                            item: item,
                            show: "moveBy",
                            time: 66 / 24,
                            buf: flip ? cc.p(-upX, upy) : cc.p(upX, upy),
                            fun: function(item) {
                                addShowType({
                                    item: item,
                                    show: "fadeOut",
                                    time: timeFade,
                                    fun: function() {
                                        if (fun) {
                                            fun()
                                        }
                                    }
                                })
                            }
                        })
                    }
                })
                addShowType({
                    item: hand.hand1,
                    show: "fadeIn",
                    time: timeFade,
                })
                addShowType({
                    item: hand.hand2,
                    show: "fadeIn",
                    time: timeFade,
                })
            }
            safeAdd(item.getParent(), hand1)
            safeAdd(item.getParent(), hand2)
            var pos = item.getPosition()
            if (flip) {
                hand.setPosition(pos.x + 160, pos.y - 50)
            } else {
                hand.setPosition(pos.x - 160, pos.y - 50)
            }
            return hand
        }
        var actHand = function() {
            var item = this
            item.runAction(createAnimation({
                ifFile: true,
                frame: "dqdnb_bq_%03d",
                start: 80,
                end: 154,
                time: 1 / 24,
            }))
            item.hand1.run()
            item.hand2.run(function() {
                var img = new cc.Sprite("#img_hand2.png")
                img.setPosition(150, 220)
                var outItem = item
                safeAdd(item, img)
                changeFather({
                    item: img,
                    father: self,
                })
                img.setLocalZOrder(100)
                img.setScale(item.getParent().getScale() + 0.2)
                addShowType({
                    item: img,
                    show: "fadeIn",
                    time: 0.3,
                })
                var xmix = 20
                var pertime = 0.15
                var lmix = 15
                var counts = 8
                var actSeq = function(time, mix) {
                    return cc.sequence(
                        cc.moveBy(time, cc.p(-mix, -10)),
                        cc.moveBy(time, cc.p(-mix, 10)),
                        cc.moveBy(time, cc.p(mix, 10)),
                        cc.moveBy(time, cc.p(mix, -10))
                    )
                }
                addShowType({
                    item: img,
                    show: "moveBy",
                    time: 0.5,
                    buf: cc.p(0, -20),
                    fun: function(item) {
                        var newball = null
                        item.runAction(cc.sequence(
                            cc.repeat(actSeq(pertime, xmix), counts - 2),
                            cc.callFunc(function() {
                                addShowType({
                                    item: item,
                                    show: "fadeOut",
                                    time: 0.1,
                                    fun: function() {
                                        if (newball) {
                                            newball.setLocalZOrder(100)
                                            reAdd(newball)
                                            self.finalBall = newball
                                            if (self.curIndex == 5) {
                                                addShowType({
                                                    item: newball,
                                                    show: "moveTo",
                                                    buf: self.fianlPos,
                                                    time: 0.3,
                                                    fun: function() {
                                                        self.showFinal()
                                                    }
                                                })
                                                addShowType({
                                                    item: newball,
                                                    show: "scaleTo",
                                                    buf: cc.p(1.6, 1.6),
                                                    time: 0.3,
                                                })
                                            }
                                        }
                                    }
                                })
                            })
                        ))
                        outItem.runAction(
                            cc.sequence(cc.repeat(
                                    actSeq(pertime, lmix), counts / 2),
                                cc.callFunc(function() {
                                    addShowType({
                                        item: outItem,
                                        show: "fadeOut",
                                        time: pertime * 4 * counts / 4,
                                        fun: function() {
                                            if (self.curIndex == 3) {
                                                self.curIndex = 2
                                                self.nodebs.say({
                                                    key: "sound2",
                                                    force: true,
                                                })
                                            }
                                        }
                                    })
                                    var index = outItem.index
                                    var info = ballInfo[index]
                                    newball = new cc.Sprite(res.dqdnb_bq_001)
                                    newball.setColor(info.color)
                                    newball.setPosition(info.pos)
                                    newball.setScale(info.scale + 0.1)
                                    safeAdd(self, newball)
                                    newball.runAction(cc.repeat(actSeq(pertime, lmix), counts / 4))
                                    addShowType({
                                        item: newball,
                                        show: "fadeIn",
                                        time: pertime * 4 * counts / 4,
                                    })
                                    if (self.curIndex != 5) {
                                        createTouchEvent({
                                            item: newball,
                                            autoMove: true,
                                            end: function(data) {
                                                var item = data.item
                                                if (self.curIndex == 4) {
                                                    var result = judgeItemCrash({
                                                        item1: item,
                                                        item2: ballList[2],
                                                    })
                                                    var item2 = ballList[2]
                                                    if (result) {
                                                        removeMoving(item)
                                                        removeMoving(item2)
                                                        item.setPosition(697, 135)
                                                        item2.actHand()
                                                        addShowType({
                                                            item: item,
                                                            show: "fadeOut",
                                                            time: 1,
                                                            delay: 1,
                                                        })
                                                        self.curIndex = 5
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }), cc.repeat(
                                    actSeq(pertime, lmix), counts / 4))
                        )
                    }
                })
            })
        }

        for (var i = 0; i < ballInfo.length; i++) {
            var info = ballInfo[i]
            var node = new cc.Node()
            var sp = new cc.Sprite(res.dqdnb_bq_001)
            sp.createHand = createHand
            sp.actHand = actHand
            sp.index = i
            sp.setColor(info.color)
            node.setScale(info.scale)
            node.setPosition(info.pos)
            sp.setLocalZOrder(info.order)
            node.setLocalZOrder(info.order)
            ballList[ballList.length] = sp
            safeAdd(node, sp)
            safeAdd(self, node)
            sp.index = i
            createTouchEvent({
                item: sp,
                autoMove: sp.index == 0,
                end: function(data) {
                    var outItem = data.item
                    var item = data.item
                    switch (item.index) {
                        case 0:
                            if (self.curIndex == 3) {
                                var result = judgeItemCrash({
                                    item1: item,
                                    item2: ballList[1],
                                })
                                var item2 = ballList[1]
                                if (result) {
                                    removeMoving(item)
                                    removeMoving(item2)
                                    item.setPosition(417, 0)
                                    addShowType({
                                        item: item,
                                        show: "fadeOut",
                                        time: 1,
                                        delay: 1,
                                    })
                                    item2.actHand()
                                }
                            }
                            break
                        default:
                            if (item.index == self.curIndex) {
                                if (!item.hand1) {
                                    item.hand1 = item.createHand()
                                    item.hand1.setVisible(false)
                                }
                                if (!item.hand2) {
                                    item.hand2 = item.createHand(true)
                                    item.hand2.setVisible(false)
                                }
                                if (!item.hand) {
                                    var sp = new cc.Sprite("#img_hand1.png")
                                    sp.setOpacity(0)
                                    sp.setPosition(140, 277)
                                    safeAdd(item, sp)
                                    addShowType({
                                        item: sp,
                                        show: "fadeIn",
                                        time: 0.3,
                                    })
                                    var disx = 20
                                    var disy = 30
                                    var perCount = 6
                                    addShowType({
                                        item: sp,
                                        show: "moveBy",
                                        buf: cc.p(0, -150),
                                        time: 25 / 24,
                                        fun: function(item) {
                                            item.runAction(cc.sequence(
                                                cc.moveBy(perCount / 24, cc.p(disx, disy)),
                                                cc.moveBy(perCount / 24, cc.p(disx, -disy)),
                                                cc.moveBy(perCount / 24, cc.p(disx, disy)),
                                                cc.moveBy(perCount / 24, cc.p(disx, -disy)),
                                                cc.moveBy(perCount / 24, cc.p(-disx, disy)),
                                                cc.moveBy(perCount / 24, cc.p(-disx, -disy)),
                                                cc.moveBy(perCount / 24, cc.p(-disx, disy)),
                                                cc.moveBy(perCount / 24, cc.p(-disx, -disy)),
                                                cc.callFunc(function() {
                                                    addShowType({
                                                        item: item,
                                                        show: "fadeOut",
                                                        time: 6 / 24,
                                                    })
                                                    addShowType({
                                                        item: item,
                                                        show: "moveBy",
                                                        time: 6 / 24,
                                                        buf: cc.p(0, 100),
                                                        fun: function() {
                                                            if (self.curIndex == 1) {
                                                                self.curIndex = 3
                                                            }
                                                            if (self.curIndex == 2) {
                                                                self.curIndex = 4
                                                            }
                                                        }
                                                    })
                                                })
                                            ))
                                        }
                                    })
                                    item.runAction(createAnimation({
                                        ifFile: true,
                                        frame: "dqdnb_bq_%03d",
                                        end: 79,
                                        time: 1 / 24,
                                    }))
                                    item.hand = sp
                                }
                            }
                            break
                    }
                }
            })
        }

        var uilist = [
            "btn_cut",
            "item1",
            "item2",
            "item3",
            "judge1",
            "judge2",
            "judge3",
            "img_deco",
            "img_knife",
            "font"
        ]
        var templist = [
            "item1",
            "item2",
            "item3",
            "judge1",
            "judge2",
            "judge3",
            "font"
        ]
        var bg = loadNode(res.do_json, uilist)
        safeAdd(self, bg)
        bg.setVisible(false)
        bg.img_knife.setVisible(false)
        for (var i = 0; i < templist.length; i++) {
            bg[templist[i]].setVisible(false)
        }
        self.fianlPos = cc.p(209.6964, 361.8578)
        self.showFinal = function() {
            bg.setVisible(true)
            addShowType({
                item: bg,
                show: "fadeIn",
                time: 0.5,
            })
            self.nodebs.say({
                key: "sound3",
                force: true,
            })
        }
        var dix = 40
        var diy = 20
        var perTime = 0.2
        var count = 7
        var allTime = perTime * 2 * count
        var init = function() {
            var itemList = [
                "item1",
                "item2",
                "item3",
            ]
            var judgeList = [
                "judge1",
                "judge2",
                "judge3",
            ]
            var judgeAll = function(item) {
                var injudge = false
                for (var i = 0; i < judgeItemList.length; i++) {
                    var judge = judgeItemList[i]
                    var result = judgeItemCrash({
                        item1: item,
                        item2: judge
                    })
                    if (result) {
                        if (item.index == judge.index) {
                            var cont = judge.getContentSize()
                            item.setPosition(cont.width / 2 + 2, cont.height / 2 - 2)
                            safeAdd(judge, item)
                            removeMoving(item)
                            judge.correct = true
                        } else {
                            item.setPosition(item.rootPos)
                            playEffect(res.zswd_wrong)
                        }
                        injudge = true
                        break
                    }
                }
                if (!injudge) {
                    item.setPosition(item.rootPos)
                }
                var allRight = true
                for (var i = 0; i < judgeItemList.length; i++) {
                    var judge = judgeItemList[i]
                    if (!judge.correct) {
                        allRight = false
                        break
                    }
                }
                if (allRight) {
                    AddDialog("Judge", {
                        judge: true,
                    })
                    self.nodebs.say({
                        key: "right",
                        force: true,
                    })
                }
            }
            var judgeItemList = []
            for (var i = 0; i < judgeList.length; i++) {
                var judge = bg[judgeList[i]].getChildByName("judge")
                judge.index = i
                judgeItemList[i] = judge
            }
            for (var i = 0; i < itemList.length; i++) {
                var item = bg[itemList[i]]
                item.index = i
                item.rootPos = item.getPosition()
                createTouchEvent({
                    item: item,
                    autoMove: true,
                    end: function(data) {
                        var item = data.item
                        judgeAll(item)
                    }
                })
            }
        }
        bg.btn_cut.addClickEventListener(function() {
            if (!self.hasCut) {
                bg.btn_cut.setVisible(false)
                var knife = bg.img_knife
                knife.setVisible(true)
                knife.runAction(cc.repeat(cc.sequence(
                    cc.moveBy(perTime, cc.p(-dix, -diy)), cc.moveBy(perTime, cc.p(dix, -diy))
                ), count))
                var ball = self.finalBall
                addShowType({
                    item: ball,
                    show: "moveBy",
                    buf: cc.p(0, -15),
                    time: allTime * 0.6,
                    delay: allTime * 0.2,
                    fun: function(item) {
                        addShowType({
                            item: item,
                            show: "fadeOut",
                            time: allTime * 0.2,
                        })
                        addShowType({
                            item: knife,
                            show: "fadeOut",
                            time: allTime * 0.2,
                            fun: function() {
                                for (var i = 0; i < templist.length; i++) {
                                    bg[templist[i]].setVisible(true)
                                }
                                init()
                            }
                        })
                    }
                })
            }
            self.hasCut = true
        })
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 1; i <= 3; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i), //对话标签 之后让人物说话需要用到的参数
                img: res[sprintf("do_content%d", i)], //图片和声音文件
                sound: res[sprintf("do_sound%d", i)]
            })
        }
        addContent({
            people: this.nodebs,
            key: "right",
            sound: res.sound_right,
        })
    }
})