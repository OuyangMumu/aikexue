//@author mu @16/4/27
var doExp4 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp4", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("do4plist")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
        var self = this
        if (self.biaoge) {
            self.biaoge.removeFromParent(false)
        }
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
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        var bg = gb_biaoge()
                        safeAdd(self, bg)
                        self.biaoge = bg
                        bg.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        createInPy({
            layer: self,
            //show: true,
        })
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        self.canShow = true
        return true
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 2; i++) {
            fileList[i] = sprintf("do4_tool%d.png", i + 1)
        }
        var outJudge = function(item) {
            // data.left = 410
            // data.right = 723
            // 
            if (item.x > 410 && item.x < 723 && item.y > 99) {
                self.pyActItem({
                    item: item,
                    act: true,
                })
                removeMoving(item)
                item.update = function(dt) {
                    var hs = this
                    var result = (hs.y <= 280)
                    if (result) {
                        self.showNext = true
                        self.nodebs.say({
                            key: "sound2",
                            force: true,
                        })
                        hs.canUp = true
                        hs.unscheduleUpdate()
                    }
                }
                item.scheduleUpdate()
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
                        data.left = 410
                        data.right = 723
                        data.bottom = 103
                            //data.show = true
                        judgeMove(data)
                            //judgeAll()
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
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            ifFrame: true,
            nums: 2,
            tri: "down",
            showTime: 0.3,
            itempos: [cc.p(-3, -50), cc.p(0, -80)],
            circlepos: cc.p(0, 30),
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
                if (index == 1 && !self.showNext) {
                    return false
                }
                return true
            },
            firstClick: function(data) {
                var index = data.index
                var sp = null
                switch (index) {
                    case 0:
                        sp = self.addItem({
                            tex: "#img_egg.png",
                            mass: 0.85,
                            disAct: true,
                            type: "box",
                        })
                        self.pyActItem({
                            item: sp,
                            act: false,
                        })
                        self.egg = sp
                        addCrashRect({
                            item: sp,
                            list: [{
                                item: self.shuigang.judgeRect,
                            }]
                        })
                        break
                    case 1:
                        sp = new cc.Sprite("#salt1.png")
                        sp.setLocalZOrder(1)
                        var shaozi = new cc.Sprite("#img_empty.png")
                        shaozi.setPosition(203, 60)
                        safeAdd(sp, shaozi)
                        shaozi.rootPos = shaozi.getPosition()

                        sp.saltCount = 1
                        sp.shaozi = shaozi
                        self.salt = sp

                        createTouchEvent({
                            item: shaozi,
                            begin: function(data) {
                                return true
                            },
                            move: function(data) {
                                var item = data.item
                                if (!item.showIng && !item.downSalt) {
                                    judgeMove(data)
                                    var result = judgeItemCrash({
                                        item1: item,
                                        item2: self.salt,
                                        //showTest: true,
                                    })
                                    if (result) {
                                        if (!item.getSalt && !item.showIng && self.salt) {
                                            if (self.salt.saltCount >= 10) {
                                                if (self.canShow) {
                                                    self.canShow = false
                                                    AddDialog("Tips", {
                                                        res: res.img_tip3,
                                                        face: 1,
                                                        closeBack: function() {
                                                            self.canShow = true
                                                        }
                                                    })
                                                }
                                            } else {
                                                item.showIng = true
                                                var roteTime = 0.4
                                                var downTime = 0.3
                                                var salt = self.salt
                                                changeFather({
                                                    item: item,
                                                    father: self,
                                                })
                                                addShowType({
                                                    item: salt,
                                                    show: "rotateBy",
                                                    buf: 45,
                                                    time: roteTime,
                                                    fun: function() {
                                                        var buf = 70 + salt.saltCount * 4
                                                        addShowType({
                                                            item: item,
                                                            show: "moveBy",
                                                            time: downTime,
                                                            buf: cc.p(-buf, -buf),
                                                            fun: function() {
                                                                item.setSpriteFrame("img_full.png")
                                                                salt.saltCount = salt.saltCount + 1
                                                                if (salt.saltCount > 10) {
                                                                    salt.saltCount = 10
                                                                }
                                                                salt.setSpriteFrame(sprintf("salt%d.png", salt.saltCount))
                                                                addShowType({
                                                                    item: item,
                                                                    show: "moveBy",
                                                                    time: downTime,
                                                                    buf: cc.p(buf, buf),
                                                                    fun: function() {
                                                                        addShowType({
                                                                            item: salt,
                                                                            show: "rotateBy",
                                                                            time: roteTime,
                                                                            buf: -45,
                                                                            fun: function() {
                                                                                item.setPosition(item.rootPos)
                                                                                safeAdd(salt, item)
                                                                                item.showIng = false
                                                                                item.getSalt = true
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                                var pos = salt.getPosition()
                                                item.setRotation(-10)
                                                item.setPosition(pos.x + 120, pos.y + 100)
                                            }

                                        }
                                    }
                                }
                                if (item.getSalt && !item.downSalt) {
                                    var result = judgeItemCrash({
                                        item1: item,
                                        item2: self.shuigang,
                                    })
                                    if (result) {
                                        item.downSalt = true
                                        item.setVisible(false)
                                        if (!self.actDwon) {
                                            var sp = new cc.Sprite()
                                            sp.setPosition(getMiddle(40, -30))
                                            safeAdd(self, sp)
                                            self.actDwon = sp
                                        }
                                        var act = self.actDwon
                                        act.setVisible(true)
                                        if (!self.actSalt) {
                                            var actS = new cc.Sprite()
                                            actS.setPosition(getMiddle(0, -220))
                                            safeAdd(self, actS)
                                            self.actSalt = actS
                                        }
                                        var limit = 2 / 24
                                        var perTime = 28 / 4 * limit / 4
                                        var actS = self.actSalt
                                        actS.setVisible(true)
                                        actS.runAction(createAnimation({
                                            frame: "salt_down_%02d.png",
                                            end: 20,
                                            time: 1 / 24,
                                            fun: function() {
                                                addShowType({
                                                    item: actS,
                                                    show: "fadeOut",
                                                    time: perTime * 16,
                                                    fun: function() {
                                                        actS.setOpacity(255)
                                                        actS.setVisible(false)
                                                    }
                                                })
                                            }
                                        }))
                                        act.runAction(createAnimation({
                                            frame: "salt_drop_%02d.png",
                                            end: 10,
                                            time: 2 / 24,
                                            fun: function() {
                                                act.setVisible(false)
                                                if (!self.hand) {
                                                    var hand = new cc.Sprite("#img_hand.png")
                                                    hand.setPosition(getMiddle(100, 0))
                                                    safeAdd(self, hand)
                                                    self.hand = hand
                                                }
                                                var hand = self.hand
                                                hand.setVisible(true)


                                                var disX = 50
                                                var disY = 20
                                                hand.runAction(cc.repeat(
                                                    cc.sequence(
                                                        cc.moveBy(perTime, cc.p(-disX, -disY)),
                                                        cc.moveBy(perTime, cc.p(disX, -disY)),
                                                        cc.moveBy(perTime, cc.p(disX, disY)),
                                                        cc.moveBy(perTime, cc.p(-disX, disY))
                                                    ), 4))
                                                if (!self.jb) {
                                                    var jb = new cc.Sprite()
                                                    jb.setPosition(getMiddle(-20, -160))
                                                    safeAdd(self, jb)
                                                    self.jb = jb
                                                }
                                                var jb = self.jb
                                                jb.setVisible(true)
                                                jb.runAction(createAnimation({
                                                    frame: "act_jiaoban_%02d.png",
                                                    end: 28,
                                                    time: limit,
                                                    fun: function() {
                                                        jb.setVisible(false)
                                                        hand.setVisible(false)
                                                        item.downSalt = false
                                                        item.getSalt = false
                                                        item.setSpriteFrame("img_empty.png")
                                                        item.setVisible(true)
                                                        self.egg.setMass(self.egg.getMass() - 0.04)
                                                        self.pyActItem({
                                                            item: self.egg,
                                                            act: false,
                                                        })
                                                        self.pyActItem({
                                                            item: self.egg,
                                                            act: true,
                                                        })
                                                    }
                                                }))
                                            }
                                        }))
                                    }
                                }
                            }
                        })
                        break
                }
                return sp
            },
            movefun: function(data) {
                var index = data.index
                var delta = data.delta
                var item = data.sp
                data.item = item
                switch (data.index) {
                    case 0:
                        //data.bottom = 103
                        //data.show = true
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
                switch (index) {
                    case 0:
                        outJudge(item)
                        break
                }
            },
            backfun: function(data) {
                var index = data.index
                var item = data.sp
                switch (index) {
                    case 0:
                        outJudge(item)
                        break
                }
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    initScene: function() {
        var self = this
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 2; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: res[sprintf("do4_content%d", i + 1)], //图片和声音文件
                sound: res[sprintf("do4_sound%d", i + 1)],
            })
        }
    }
})