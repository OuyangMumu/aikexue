//@author mu @16/4/27
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("do1plist")
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
        self.canShow = true
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        return true
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 2; i++) {
            fileList[i] = sprintf("do1_tool%d.png", i + 1)
        }
        var outJudge = function(item) {
            // data.left = 384
            // data.right = 751
            // data.bottom = 105
            item.pastX = item.x
            if (item.x > 384 && item.x < 751 && item.y > 102) {
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
                        item.setRotation(0)
                        if (item.pastX) {
                            item.setPositionX(item.x)
                        }
                        self.pyActItem({
                            item: item,
                            act: false,
                        })
                        return true
                    },
                    move: function(data) {
                        data.left = 384
                        data.right = 751
                        data.bottom = 105
                            //data.show = true
                        judgeMove(data)
                            //judgeAll()
                    },
                    end: function(data) {
                        var item = data.item
                        if (item.canUp && item.y > 320) {
                            self.canUpPg = true
                        } else {
                            if (item.gzReady) {
                                self.pyActItem({
                                    item: item,
                                    act: true,
                                })
                                self.canUpPg = false
                            }
                        }
                        item.pastX = item.x
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
            itempos: [cc.p(0, -50), cc.p(0, -80)],
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
                            tex: "#bottle1_01.png",
                            mass: 0.2,
                            disAct: true,
                            type: "poly",
                            buf: [0, 92 - 92, 0, 92 - 10, 50, 92 - 10, 50, 92 - 92],
                            offset: cc.p(-25, -41),
                        })
                        self.pyActItem({
                            item: sp,
                            act: false,
                        })
                        sp.setOpacity(0)
                        var pz = new cc.Sprite("#bottle1_01.png")
                        var pg = new cc.Sprite("#gai.png")

                        var deco = new cc.Sprite("#bottle_back.png")
                        deco.setPosition(24, 79)
                        deco.setLocalZOrder(-1)
                        deco.setScale(0.9)
                        pg.setLocalZOrder(-1)
                        sp.posList = [
                            cc.p(104, 80),
                            cc.p(106, 83),
                            cc.p(112, 89),
                            cc.p(70, 113),
                            cc.p(74, 119),
                        ]
                        pz.setPosition(sp.posList[0])
                        pg.setPosition(25, 81)
                        pg.rootPos = pg.getPosition()
                            //addMoving(pg, true, true)
                            //addMoving(deco, true, true)
                            //addMoving(pz, true, true)
                        safeAdd(sp, pz)
                        safeAdd(pz, deco)
                        safeAdd(pz, pg)

                        var lay = createLayout({
                            size: cc.size(50, 82),
                            op: 0
                        })
                        safeAdd(sp, lay)


                        sp.gzReady = true
                        self.bottle = sp
                        sp.act = pz
                        sp.judge = lay
                        sp.curCount = 1
                        sp.deco = deco

                        createTouchEvent({
                            item: pg,
                            end: function(data) {
                                var item = data.item
                                if (self.bottle && self.canUpPg) {
                                    var bot = self.bottle
                                    item.setRotation(bot.gzReady ? 180 : 0)
                                    item.setPosition(bot.gzReady ? cc.p(93, 10) : item.rootPos)
                                    bot.gzReady = !bot.gzReady
                                }
                            }
                        })
                        break
                    case 1:
                        sp = new cc.Sprite("#sand1.png")
                        sp.setLocalZOrder(1)
                        var shaozi = new cc.Sprite("#drop_23.png")
                        shaozi.setPosition(203, 2)
                        safeAdd(sp, shaozi)
                        shaozi.rootPos = shaozi.getPosition()

                        var lay = createLayout({
                            size: cc.size(60, 80),
                            op: 0,
                        })
                        lay.setPosition(47, 116)
                        sp.sandCount = 1
                        shaozi.judge = lay
                        safeAdd(shaozi, lay)
                        sp.shaozi = shaozi
                        createTouchEvent({
                            item: shaozi.judge,
                            begin: function(data) {
                                return true
                            },
                            move: function(data) {
                                var item = data.item.getParent()
                                if (!item.showIng) {
                                    data.item = item
                                    judgeMove(data)
                                    var result = judgeItemCrash({
                                        item1: item.judge,
                                        item2: self.sand,
                                        //showTest: true,
                                    })
                                    if (result) {
                                        if (!item.getSand && !item.showIng && self.sand) {
                                            item.showIng = true
                                            var roteTime = 0.4
                                            var downTime = 0.3
                                            var sand = self.sand
                                            changeFather({
                                                item: item,
                                                father: self,
                                            })
                                            addShowType({
                                                item: sand,
                                                show: "rotateBy",
                                                buf: 45,
                                                time: roteTime,
                                                fun: function() {
                                                    addShowType({
                                                        item: item,
                                                        show: "moveBy",
                                                        time: downTime,
                                                        buf: cc.p(-100, -100),
                                                        fun: function() {
                                                            item.setSpriteFrame("drop_01.png")
                                                            sand.sandCount = sand.sandCount + 1
                                                            if (sand.sandCount > 6) {
                                                                sand.sandCount = 6
                                                            }
                                                            sand.setSpriteFrame(sprintf("sand%d.png", sand.sandCount))
                                                            addShowType({
                                                                item: item,
                                                                show: "moveBy",
                                                                time: downTime,
                                                                buf: cc.p(100, 100),
                                                                fun: function() {
                                                                    addShowType({
                                                                        item: sand,
                                                                        show: "rotateBy",
                                                                        time: roteTime,
                                                                        buf: -45,
                                                                        fun: function() {
                                                                            item.setPosition(item.rootPos)
                                                                            safeAdd(sand, item)
                                                                            item.showIng = false
                                                                            item.getSand = true
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                            var pos = sand.getPosition()
                                            item.setRotation(10)
                                            item.setPosition(pos.x + 80, pos.y + 50)
                                        }
                                    }
                                }
                                var bottle = self.bottle
                                if (!item.downIng && item.getSand && !bottle.gzReady) {
                                    var result = judgeItemCrash({
                                        item1: item.judge,
                                        item2: bottle.judge,
                                    })
                                    if (result) {
                                        if (bottle.curCount == 6) {
                                            if (self.canShow) {
                                                self.canShow = false
                                                AddDialog("Tips", {
                                                    res: res.img_tip1,
                                                    face: 1,
                                                    closeBack: function() {
                                                        self.canShow = true
                                                    }
                                                })
                                            }
                                        } else {
                                            item.downIng = true
                                            item.setVisible(false)
                                            bottle.deco.setVisible(false)
                                            bottle.act.setPosition(bottle.posList[bottle.curCount - 1])
                                            bottle.act.runAction(createAnimation({
                                                frame: sprintf("bottle%d_%s.png", bottle.curCount, "%02d"),
                                                end: 16,
                                                time: 2 / 24,
                                                fun: function() {
                                                    bottle.curCount++
                                                        item.downIng = false
                                                    item.setVisible(true)
                                                    bottle.deco.setVisible(true)
                                                    item.getSand = false
                                                    item.setSpriteFrame("drop_23.png")
                                                    item.setPosition(item.rootPos)
                                                    bottle.setMass(bottle.getMass() + 0.06)
                                                }
                                            }))
                                        }
                                    }
                                }
                            }
                        })
                        self.sand = sp
                        break
                }
                addCrashRect({
                    item: sp,
                    list: [{
                        item: self.shuigang.judgeRect,
                    }]
                })
                return sp
            },
            clickfun: function(data) {
                var index = data.index
                var item = data.sp
                switch (index) {
                    case 1:
                        var shaozi = item.shaozi
                        shaozi.setPosition(shaozi.rootPos)
                        break
                }
                return true
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
                img: res[sprintf("do1_content%d", i + 1)], //图片和声音文件
                sound: res[sprintf("do1_sound%d", i + 1)],
            })
        }
    }
})