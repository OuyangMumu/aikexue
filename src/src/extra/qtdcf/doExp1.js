//@author mu @16/4/27
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("do1_tool")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        var self = this
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "sound1"
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
        var self = this
        this.expCtor() //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        createWaterPhy({
            layer: self,
            //showDebug: true,
        })
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        var btnFind = new ccui.Button(res.btn_get_normal, res.btn_get_select)
        btnFind.setPosition(1080, 500)
        btnFind.setVisible(false)
        safeAdd(self, btnFind)
        btnFind.addClickEventListener(function() {
            self.nodebs.say({
                key: "sound3"
            })
        })
        self.btnFind = btnFind
        return true
    },
    inHand: function(data) {
        var self = this
        var item = data.item
        var uilist = [
            "add"
        ]
        var hand = loadNode(res.qtdcf_hand, uilist, "bg")
        var pos = item.getPosition()
        hand.setPosition(pos.x - 50, pos.y)
        item.setPosition(0, 0)
        setOff(hand.add, cc.p(40, 0))
        item.pastParent = item.getParent()
        safeAdd(hand.add, item)
        safeAdd(self, hand)
        self.shuigang.addItem({
            item: hand,
        })
        hand.item = item
        hand.out = false
        if (!item.newUpdate) {
            item.update = function(dt) {
                var item = this
                var pos = getWorldPos(item)
                var result = (pos.y <= 240)
                if (result) {
                    item.createWater()
                }
            }
            item.scheduleUpdate()
            item.newUpdate = true
        }
        self.hand = hand

        hand.actFinal = function() {
            var hand = this
            hand.final = true
        }
        createTouchEvent({
            item: hand,
            begin: function(data) {
                return data.item.isVisible()
            },
            move: function(data) {
                var item = data.item
                judgeMove({
                    item: data.item,
                    delta: data.delta,
                    left: -129,
                    right: 106,
                    bottom: -151,
                    //show: true,
                })
                if (item.out) {
                    var result = judgeItemCrash({
                        item1: item,
                        item2: item.item,
                    })
                    if (result) {
                        self.pyActItem({
                            item: item.item,
                            act: false,
                        })
                        item.item.setPosition(0, 0)
                        safeAdd(item.add, item.item)
                        item.out = false
                    }
                }
            },
            end: function(data) {
                var hand = data.item
                var item = hand.item
                if (!item.out) {
                    item.setPosition(item.pastParent.convertToNodeSpace(getWorldPos(item)))
                    safeAdd(item.pastParent, item)
                    hand.setPosition(hand.getParent().convertToNodeSpace(getMiddle(0, 150)))
                    hand.out = true

                    self.pyActItem({
                        item: item,
                        act: true,
                    })
                    removeMoving(item)
                    if (hand.final) {
                        hand.setVisible(false)
                        createTouchEvent({
                            item: item,
                            begin: function(data) {
                                var item = data.item
                                self.pyActItem({
                                    item: item,
                                    act: false,
                                })
                                return true
                            },
                            move: function(data) {
                                var item = data.item
                                var delta = data.delta
                                judgeMove({
                                    item: item,
                                    delta: delta,
                                    left: 401,
                                    right: 735,
                                    bottom: 105,
                                    //show: true,
                                })
                            },
                            end: function(data) {
                                var item = data.item
                                self.pyActItem({
                                    item: item,
                                    act: true,
                                })
                            }
                        })
                    }
                }
            }
        })
        return hand
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 2; i++) {
            fileList[i] = sprintf("do1_tool%d.png", i + 1)
        }
        var judgeMove = function(data) {
            var item = data.item
            var delta = data.delta
            var tx = item.x + delta.x
            var ty = item.y + delta.y
            switch (item.index) {
                case 0:
                    if (tx < 400) {
                        tx = 400
                    }
                    if (tx > 735) {
                        tx = 735
                    }
                    if (ty < 350) {
                        ty = 350
                    }
                    break
            }
            item.x = tx
            item.y = ty
        }
        var playCut = function() {
            var ball = self.judgeItem
            var zhui = self.zhui
            ball.canTouch = false
            self.pyActItem({
                item: ball,
                act: false,
            })
            ball.setPosition(getMiddle(0, 50))
            zhui.setPosition(568, 396)

            removeMoving(zhui)
            var lay = createLayout({
                size: cc.size(100, 400),
                op: 0,
                clip: true,
            })
            lay.setPosition(519, 398)
            safeAdd(self, lay)
            addShowType({
                item: zhui,
                show: "rotateBy",
                buf: -65,
                time: 0.5,
                fun: function() {
                    changeFather({
                        item: zhui,
                        father: lay,
                    })
                    addShowType({
                        item: zhui,
                        show: "moveBy",
                        buf: cc.p(0, -40),
                        time: 0.5,
                        fun: function(item) {
                            addShowType({
                                item: zhui,
                                show: "moveBy",
                                buf: cc.p(0, 40),
                                time: 0.5,
                                fun: function(item) {
                                    item.setVisible(false)
                                    ball.add.setVisible(true)
                                    var hand = self.inHand({
                                        item: ball,
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        var outJudge = function(item) {
            switch (item.index) {
                case 0:
                    if (item.x > 399 && item.x < 734 && item.y > 102) {
                        self.pyActItem({
                            item: item,
                            act: true,
                        })
                        createTouchEvent({
                            item: item,
                            begin: function(data) {
                                var item = data.item
                                if (!item.canTouch) {
                                    return false
                                }
                                self.pyActItem({
                                    item: item,
                                    act: false,
                                })
                                return true
                            },
                            move: function(data) {
                                judgeMove(data)
                            },
                            end: function(data) {
                                var item = data.item
                                self.pyActItem({
                                    item: item,
                                    act: true,
                                })
                            }
                        })
                        item.update = function(dt) {
                            var hs = this
                            if (!hs.finishShow) {
                                var result = (hs.y <= 300)
                                if (result) {
                                    hs.finishShow = true
                                    hs.unscheduleUpdate()
                                    self.nodebs.say({
                                        key: "sound2",
                                        force: true,
                                    })
                                    self.getFirst = true
                                    self.judgeItem = hs
                                }
                            }
                        }
                        item.scheduleUpdate()
                    }
                    break
                case 1:
                    if (self.judgeItem && item.judge) {
                        var result = judgeItemCrash({
                            item1: item.judge,
                            item2: self.judgeItem,
                        })
                        if (result) {
                            self.zhui = item
                            playCut()
                        }
                    } else {
                        cc.log("something wrong")
                    }
                    break
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            ifFrame: true,
            nums: 2,
            tri: "down",
            showTime: 0.3,
            itempos: [cc.p(0, -60), cc.p(0, -55)],
            circlepos: cc.p(0, 15),
            devide: cc.p(1.5, 1),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            fileAnchor: cc.p(0.5, 0),
            itemScale: 0.8,
            files: fileList,
            gets: [null, null],
            judge: function(index) {
                if (index == 1 && !self.getFirst) {
                    return false
                }
                return true
            },
            firstClick: function(data) {
                var index = data.index
                var sp = null
                switch (index) {
                    case 0:
                        var sp = self.addItem({
                            tex: "#img_tool1.png",
                            mass: 0.1,
                            disAct: true,
                            type: "box",
                        })
                        self.pyActItem({
                            item: sp,
                            act: false,
                        })
                        sp.canTouch = true
                        sp.final = 0.565

                        var add = new cc.Sprite("#img_add.png")
                        add.setPosition(39.57, 68.67)
                        safeAdd(sp, add)
                        sp.add = add
                        sp.count = 0
                        add.setVisible(false)
                        sp.show = true

                        sp.createWater = function() {
                            var sp = this
                            var pos = getWorldPos(sp.add)
                            var dis = 270 - pos.y
                            if (dis > 0 && sp.count % 4 == 0 && sp.show) {
                                if (sp.getMass() < sp.final) {
                                    sp.setMass(sp.getMass() + 0.01)
                                } else {
                                    sp.setMass(sp.final)
                                    sp.show = false
                                    sp.unscheduleUpdate()
                                    self.btnFind.setVisible(true)
                                    self.hand.actFinal()
                                }
                                var water = new cc.Sprite(res.img_qp)
                                water.setPosition(pos)
                                    //water.setColor(127, 127, 127, 127)
                                safeAdd(self, water)
                                water.setOpacity(60)
                                water.setScale(0.1)
                                addShowType({
                                    item: water,
                                    show: "scaleTo",
                                    buf: cc.p(1.0, 0.5),
                                    time: 2.0,
                                })
                                var time = dis / 120
                                addShowType({
                                    item: water,
                                    show: "moveBy",
                                    buf: cc.p(0, dis),
                                    time: time,
                                    fun: function(item) {
                                        item.stopAllActions()
                                        addShowType({
                                            item: item,
                                            show: "fadeTo",
                                            time: 0.1,
                                            buf: 0,
                                            fun: function(item) {
                                                item.removeFromParent(true)
                                            }
                                        })
                                    }
                                })
                            }
                            sp.count++
                        }
                        addCrashRect({
                            item: sp,
                            list: [{
                                item: self.shuigang.judgeRect,
                            }]
                        })
                        break
                    case 1:
                        sp = new cc.Sprite("#img_tool2.png")
                        var judge = createLayout({
                            size: cc.size(10, 10),
                            op: 0,
                        })
                        judge.setPosition(-5, -5)
                        sp.judge = judge
                        sp.opJudge = true
                        sp.setAnchorPoint(0, 0)
                        safeAdd(sp, judge)
                        break
                }
                return sp
            },
            movefun: function(data) {
                var index = data.index
                var delta = data.delta
                var item = data.sp
                data.item = item
                switch (index) {
                    case 0:
                        item._judgeCrash({
                            delta: delta
                        })
                        break
                    case 1:
                        judgeMove(data)
                        break
                }
            },
            outfun: function(data) {
                var index = data.index
                var item = data.sp
                outJudge(item)
            },
            backfun: function(data) {
                var index = data.index
                var item = data.sp
                outJudge(item)
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    initScene: function() {
        var self = this
        var desk = new cc.Sprite(res.img_desk)
        desk.setPosition(getMiddle(0, -360))
        safeAdd(self, desk)
        var shuigang = createShuiGang()
        shuigang.setPosition(getMiddle(0, -120))
        safeAdd(self, shuigang)
        shuigang.setHeight(200)
        shuigang.clipNode.setLocalZOrder(1)
        shuigang.water_front.setLocalZOrder(1)
        shuigang.deco.setLocalZOrder(1)
        changeFather({
            item: shuigang.clipNode,
            father: self,
        })
        changeFather({
            item: shuigang.water_front,
            father: self,
            needScale: true,
        })

        changeFather({
            item: shuigang.deco,
            father: self,
            needScale: true,
        })
        self.shuigang = shuigang
        var water = self.addWater({
            item: shuigang.judgeWater,
            disHeight: 45,
        })
        self.actPys(true)
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        var imgList = [
            res.do1_conten1,
            res.do1_conten2,
            res.do1_find,
        ]
        for (var i = 0; i < 3; i++) {
            var offset = cc.p(0,0)
            var offbg = cc.p(0,0)
            var btnModify = cc.p(10, 10)
            if(i==2){
                offset = cc.p(35,30)
                offbg = cc.p(40,40)
                btnModify = cc.p(2,11)
            }
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: imgList[i], //图片和声音文件
                sound: res[sprintf("do1_sound%d", i + 1)],
                id: i == 2 ? "result" : "normal",
                btnModify: btnModify,
                btnScale: 0.8,
                offset:offset,
                offbg:offbg,
            })
        }
    }
})