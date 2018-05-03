//@author mu @16/4/27
var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("seeJson")
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
                    key: "Show"
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
        return true
    },
    showHand: function(judge) {
        var self = this
        if (!self.hand) {

            var hand1 = self.addItem({
                tex: "#img_hand.png",
                disAct: true,
                type: "poly",
                buf: [17, 108 - 90, 4, 108 - 90, 1, 108 - 82, 123, 108 - 2, 133, 108 - 28],
                offset: cc.p(-137 / 2, -108 / 2),
                static: true,
                pos: getMiddle(0, 100),
                ela: 0,
                fri: 0,
            })

            self.pyActItem({
                item: hand1,
                act: false,
            })

            hand1.setLocalZOrder(1)

            var hand2 = self.addItem({
                //tex: "#img_hand.png",
                disAct: true,
                type: "poly",
                buf: [57, 108 - 108, 54, 108 - 101, 54, 108 - 76, 126, 108 - 32, 67, 108 - 107],
                offset: cc.p(-137 / 2, -108 / 2),
                static: true,
                pos: getMiddle(0, 100),
                ela: 0,
                fri: 0,
            })

            hand2.setLocalZOrder(1)

            self.pyActItem({
                item: hand2,
                act: false,
            })
            var hand = {
                hand1: hand1,
                hand2: hand2,
            }
            self.hand = hand

            hand.setPosition = function(pos) {
                var hand = this
                hand.hand1.setPosition(pos)
                hand.hand2.setPosition(pos)
            }

            hand.setVisible = function(judge) {
                var hand = this
                if (judge != hand.hand1.isVisible()) {
                    hand.hand1.setVisible(judge)
                    hand.hand2.setVisible(judge)
                    if (judge) {
                        hand.pyAct(false)
                        hand.setPosition(getMiddle(0, 100))
                    }
                    hand.pyAct(judge)
                }
            }

            hand.pyAct = function(judge) {
                var hand = this
                self.pyActItem({
                    item: hand.hand1,
                    act: judge,
                })
                self.pyActItem({
                    item: hand.hand2,
                    act: judge,
                })
            }

            createTouchEvent({
                item: hand1,
                begin: function(data) {
                    var item = data.item
                    return item.isVisible()
                },
                move: function(data) {
                    var item = data.item
                        //data.show = true
                    data.left = 429
                    data.right = 708
                    data.bottom = 220
                    judgeMove(data)
                    data.item = hand2
                    judgeMove(data)

                    self.pyActItem({
                        item: hand1,
                        act: false,
                    })
                    self.pyActItem({
                        item: hand1,
                        act: true,
                    })

                    self.pyActItem({
                        item: hand2,
                        act: false,
                    })
                    self.pyActItem({
                        item: hand2,
                        act: true,
                    })
                }
            })
        }

        var hand = self.hand
        hand.setVisible(judge)
    },
    showForce: function() {
        var self = this
        if (!self.forceNode) {
            var node = new cc.Sprite(res.see_ball)
            self.forceNode = node
            safeAdd(self, node)
            node.setLocalZOrder(3)

            node.createForce = function(data) {
                var node = this
                var size = node.getContentSize()
                var name = data.name
                var angle = data.angle || 0
                var color = data.color
                var anchor = data.anchor
                var anchor2 = data.anchor2 || anchor
                var font = new cc.LabelTTF(data.font, null, 24)
                font.setColor(color)

                //var fl = new cc.Sprite(res.see_line)
                var fl = new cc.Scale9Sprite(res.see_line, cc.rect(0, 0, 13, 16), cc.rect(2, 2, 2, 2))
                fl.setPosition(size.width / 2, size.height / 2)
                fl.setColor(color)
                fl.setAnchorPoint(anchor)
                safeAdd(node, fl)
                var flb = new cc.Sprite(res.see_angle)
                flb.setColor(color)
                flb.setAnchorPoint(anchor2)
                flb.setRotation(angle)

                font.setRotation(angle)
                fl.angle = angle
                if (angle) {
                    flb.setPosition(6.5, fl.height)
                    fl.needChange = true
                    font.setPosition(-30, 0)
                } else {
                    flb.setPosition(6.5, 0)
                    font.setPosition(53, 0)
                }

                safeAdd(fl, flb)
                safeAdd(flb, font)
                fl.flb = flb

                node[name] = fl
            }

            node.createForce({
                name: "fl",
                angle: 180,
                color: cc.color(255, 0, 0, 255),
                anchor: cc.p(0.5, 0),
                anchor2: cc.p(0.5, 1),
                font: "浮力",
            })

            node.createForce({
                name: "yl",
                color: cc.color(0, 0, 255, 255),
                anchor: cc.p(0.5, 1),
                font: "压力",
            })

            node.createForce({
                name: "zl",
                color: cc.color(255, 0, 0, 255),
                anchor: cc.p(0.5, 1),
                font: "重力",
            })

            node.setForce = function(data) {
                var node = this
                var pos = data.pos
                var fl = data.fl
                var zl = data.zl
                var yl = data.yl
                var flNode = node.fl
                var zlNode = node.zl
                var ylNode = node.yl
                var list = [
                    [fl, flNode],
                    [zl, zlNode],
                    [yl, ylNode],
                ]
                node.setPosition(pos)
                for (var i = 0; i < list.length; i++) {
                    var force = list[i][0]
                    var item = list[i][1]
                    if (force) {
                        item.setVisible(true)
                        item.height = force
                        if (item.needChange) {
                            item.flb.setPositionY(force)
                        }
                    } else {
                        item.setVisible(false)
                    }
                }
            }
        }
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 3; i++) {
            fileList[i] = sprintf("tool%d.png", i + 1)
        }
        var infoList = [{
            type: "poly",
            buf: [1, 86 - 66, 1, 86 - 13, 49, 86 - 1, 82, 86 - 18, 82, 86 - 72, 33, 86 - 86],
            offset: cc.p(-41.5, -43),
            mass: 0.2,
        }, {
            type: "poly",
            buf: [1, 86 - 66, 1, 86 - 13, 49, 86 - 1, 82, 86 - 18, 82, 86 - 72, 33, 86 - 86],
            offset: cc.p(-41.5, -43),
            mass: 0.25,
        }, {
            type: "box",
            mass: 0.2,
        }]
        var outJudge = function(item) {
            item.pastX = item.x
            var result = (item.x > 400 && item.x < 736 && item.y > 110)
                //data.left = 400
                //data.right = 736
                //data.bottom = 116
            if (item.hasMove && result) {
                self.pyActItem({
                    item: item,
                    act: true,
                })
                item.update = function(dt) {
                    var item = this
                    var result = (item.y <= 330)
                    if (result) {
                        item.unscheduleUpdate()
                        if (!self.finishNext) {
                            self.finishNext = true
                            self.nodebs.say({
                                key: "next",
                                force: true,
                            })
                            self.btn_final.setVisible(true)
                            self.btn_judge.setVisible(true)
                        }
                        self.showHand(true)
                        item.update = function(dt) {
                            var item = this
                            if (self.hand && self.hand.hand1.isVisible()) {
                                var inResult = judgeItemCrash({
                                        item1: self.hand.hand1,
                                        item2: item,
                                        //showTest: true,
                                    })
                                    //cc.log(item._body._damping)
                                var result = (item.y <= 330)
                                var force = self.forceNode
                                self.touching = inResult
                                if (force) {
                                    if (result) {
                                        self.forceNode.setVisible(true && self.ifJudge)
                                        var max = null
                                        var weight = null
                                        var body = item._body
                                        if (body && body._damping) {
                                            var fl = body._damping
                                            switch (item.index) {
                                                case 0:
                                                    max = 290
                                                    weight = 50
                                                    break
                                                case 1:
                                                    max = 350
                                                    weight = 40
                                                    break
                                                case 2:
                                                    max = 387
                                                    weight = 30
                                                    break
                                            }
                                            var inFl = fl / max * weight
                                            force.setForce({
                                                pos: item.getPosition(),
                                                zl: weight,
                                                fl: inFl,
                                                yl: inResult ? inFl : null,
                                            })
                                        }
                                    } else {
                                        self.forceNode.setVisible(false)
                                            // 290 350 387
                                    }
                                }
                            }
                        }
                        item.scheduleUpdate()
                    }
                }
                item.scheduleUpdate()
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            ifFrame: true,
            nums: 3,
            tri: "down",
            showTime: 0.3,
            itempos: [cc.p(0, -60), cc.p(0, -57), cc.p(-1, -60)],
            circlepos: cc.p(0, 15),
            devide: cc.p(1.2, 1.0),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            fileAnchor: cc.p(0.5, 0),
            itemScale: 0.8,
            files: fileList,
            gets: [null, null, null],
            firstClick: function(data) {
                var index = data.index
                var info = infoList[index]
                var sp = self.addItem({
                    tex: sprintf("#img%d.png", index + 1),
                    mass: info.mass,
                    disAct: true,
                    type: info.type,
                    buf: info.buf,
                    offset: info.offset,
                })
                self.pyActItem({
                    item: sp,
                    act: false,
                })
                if (self.current) {
                    var insp = self.current
                    self.pyActItem({
                        item: insp,
                        act: false,
                    })
                    insp.forceBack()
                }
                if (self.hand) {
                    self.hand.setVisible(false)
                }
                self.current = sp
                if (self.btn_judge) {
                    self.btn_judge.change(false, true)
                }
                addCrashRect({
                    item: sp,
                    list: [{
                        item: self.judgeRect,
                    }]
                })
                return sp
            },
            clickfun: function(data) {
                var item = data.sp
                item.setRotation(0)
                if(item.pastX){
                    item.setPositionX(item.pastX)
                }
                self.pyActItem({
                    item: item,
                    act: false,
                })
                if (self.hand) {
                    self.hand.setVisible(false)
                }
                if (self.forceNode) {
                    self.forceNode.setVisible(false)
                }
                if (self.btn_judge) {
                    self.btn_judge.change(false, true)
                }
                return true
            },
            movefun: function(data) {
                var item = data.sp
                var delta = data.delta
                data.item = item
                    //data.show = true
                    //judgeMove(data)
                item._judgeCrash({
                    delta: delta
                })
                item.hasMove = true
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
        var desk = new cc.Sprite("#img_desk.png")
        desk.setPosition(getMiddle(0, -350))
        safeAdd(self, desk)

        var shuigang = createShuiGang()
        shuigang.setPosition(getMiddle(0, -110))
        safeAdd(self, shuigang)
        shuigang.setHeight(200)
        shuigang.clipNode.setLocalZOrder(2)
        shuigang.water_front.setLocalZOrder(2)
        shuigang.deco.setLocalZOrder(2)
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
            addWall: 600,
        })
        self.judgeRect = shuigang.judgeRect

        self.actPys(true)

        var btn_final = new ccui.Button(res.btn_jielun_normal, res.btn_jielun_select)
        self.addChild(btn_final)
        btn_final.setPosition(950, 480)
        btn_final.setVisible(false)
        btn_final.addClickEventListener(function() {
            self.nodebs.say({
                key: "final",
                force: true,
            })
        })
        self.btn_final = btn_final

        self.showAct = function(judge) {
            self.showIng = judge
            if (!self.font1) {
                var font1 = new cc.Sprite("#img_font1.png")
                font1.setPosition(getMiddle(0, 200))
                safeAdd(self, font1)
                self.font1 = font1
            }
            if (!self.font2) {
                var font2 = new cc.Sprite("#img_font2.png")
                font2.setPosition(getMiddle(0, 150))
                safeAdd(self, font2)
                self.font2 = font2
                font2.update = function(dt) {
                    var font = this
                    font.setVisible(self.showIng && self.touching)
                }
                font2.scheduleUpdate()
            }
            var font1 = self.font1
            font1.setVisible(judge)
            if (!self.forceNode) {
                self.showForce()
            }
            self.ifJudge = judge
            if (!judge) {
                var force = self.forceNode
                force.setVisible(judge)
            }
        }

        var btn_judge = createJudgeBtn({
            normal: "btn_sl_normal.png",
            select: "btn_sl_select.png",
            frame: true,
            pos: cc.p(950, 400),
            fun: function() {
                self.showAct(true)
            },
            back: function() {
                self.showAct(false)
            }
        })
        safeAdd(self, btn_judge)
        btn_judge.setVisible(false)
        self.btn_judge = btn_judge
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.see1_content1, //图片和声音文件
            sound: res.see1_sound1
        })
        addContent({
            people: this.nodebs,
            key: "next", //对话标签 之后让人物说话需要用到的参数
            img: res.see1_content2, //图片和声音文件
            sound: res.see1_sound2
        })
        addContent({
            people: this.nodebs,
            key: "final", //对话标签 之后让人物说话需要用到的参数
            img: res.see1_content3, //图片和声音文件
            sound: res.see1_sound3,
            id: "result",
        })
    }
})