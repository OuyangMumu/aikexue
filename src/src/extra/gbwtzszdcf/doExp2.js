//@author mu @16/4/27
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("ygplist")
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
            addWide: 50,
        })
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        return true
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 2; i++) {
            fileList[i] = sprintf("do2_tool%d.png", i + 1)
        }
        var judgeAll = function() {
            var cqt = self.cqt
            var yg = self.yg
            if (cqt && yg && !yg.status && !yg.finish) {
                var result = judgeItemCrash({
                    item1: cqt.judge,
                    item2: yg.judge
                })
                if (result) {
                    var pos = yg.getPosition()
                    cqt.setPosition(pos.x - (623 - 356), pos.y + 4)
                    yg.setLocalZOrder(2)
                    reAdd(yg)
                    cqt.start()
                    self.cqing = true
                    removeMoving(cqt)
                }
            }
        }
        var outJudge = function(item) {
            // data.left = 522
            // data.right = 623
            // data.bottom = 90
            if (item.x > 522 && item.x < 623 && item.y > 89) {
                self.pyActItem({
                    item: item,
                    act: true,
                })
                removeMoving(item)
                item.update = function(dt) {
                    var hs = this
                    var result = (hs.y <= 254)
                    if (result) {
                        self.nodebs.say({
                            key: "sound2",
                            force: "true",
                        })
                        hs.canUp = true
                        self.showNext = true
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
                        return !self.cqing
                    },
                    move: function(data) {
                        data.left = 522
                        data.right = 623
                        data.bottom = 90
                            //data.show = true
                        judgeMove(data)
                        judgeAll()
                    },
                    end: function(data) {
                        var item = data.item
                        if (item.finish && item.status) {
                            self.pyActItem({
                                item: item,
                                act: true,
                            })
                        } else {
                            if (!(item.canUp && item.y > 350)) {
                                if (item.status) {
                                    self.pyActItem({
                                        item: item,
                                        act: true,
                                    })
                                }
                                item.canOut = false
                            } else {
                                item.canOut = true
                            }
                        }
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
            itempos: [cc.p(0, -50), cc.p(0, -50)],
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
                            tex: "#yg_01.png",
                            mass: 3,
                            disAct: true,
                            type: "box",
                        })

                        var front = new cc.Sprite("#yg_front_01.png")
                        front.setPosition(10, 30)

                        var back = new cc.Sprite("#yg_back.png")
                        back.setLocalZOrder(-1)
                        back.setPosition(38.4, 15.1)
                        safeAdd(front, back)
                        back.setVisible(false)
                        front.status = true
                        front.canClick = true

                        var judge = createLayout({
                            size: cc.size(25, 25),
                            op: 0,
                        })
                        judge.setPosition(2, 18)
                        safeAdd(sp, judge)
                        addMoving(judge, true, true)
                        sp.status = true

                        createTouchEvent({
                            item: front,
                            begin: function() {
                                return sp.canUp && sp.canOut && !self.cqing
                            },
                            end: function(data) {
                                var item = data.item
                                if (item.canClick) {
                                    if (!item.status) {
                                        setOff(item, cc.p(-30, -50))
                                        if (sp.finish) {
                                            setOff(item, cc.p(0, 5))
                                        }
                                        item.setRotation(0)
                                    }
                                    item.runAction(cc.repeat(createAnimation({
                                        frame: "yg_front_%02d.png",
                                        end: 10,
                                        time: 1 / 24,
                                    }), 3))
                                    var buf = null
                                    if (item.status) {
                                        buf = cc.p(-40, 0)
                                    } else {
                                        buf = cc.p(40, 0)
                                    }
                                    back.setVisible(false)
                                    addShowType({
                                        item: item,
                                        show: "moveBy",
                                        time: 30 / 24,
                                        buf: buf,
                                        fun: function(item) {
                                            item.status = !item.status
                                            sp.status = item.status
                                            item.canClick = true
                                            back.setVisible(!item.status)
                                            if (!item.status) {
                                                item.setRotation(90)
                                                setOff(item, cc.p(30, 50))
                                            }
                                            if (sp.finish && item.status) {
                                                removeMoving(item)
                                            }
                                        }
                                    })
                                    item.canClick = false
                                }
                            }
                        })
                        safeAdd(sp, front)
                        self.pyActItem({
                            item: sp,
                            act: false,
                        })
                        sp.judge = judge
                        self.yg = sp
                        addCrashRect({
                            item: sp,
                            list: [{
                                item: self.shuigang.judgeRect,
                            }]
                        })
                        break
                    case 1:
                        var count = 1
                        sp = createCqt({
                            flip: true,
                            noFont: true,
                            scale: 1.5,
                            fun: function() {
                                if (self.yg) {
                                    count++
                                    if (count <= 6) {
                                        self.yg.setSpriteFrame(sprintf("yg_%02d.png", count))
                                        if (count == 6) {
                                            self.yg.finish = true
                                            self.cqing = false
                                            removeMoving(self.cqt)
                                            self.cqt.removeFromParent(true)
                                            AddDialog("Tips", {
                                                res: res.img_tip2,
                                                face: 1,
                                            })
                                            self.yg.setLocalZOrder(0)
                                            self.yg.setMass(1)
                                            reAdd(self.yg)
                                        }
                                    }
                                }
                            }
                        })
                        sp.setLocalZOrder(1)
                        self.cqt = sp
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
                        //data.bottom = 90
                        break
                    case 1:
                        judgeMove(data)
                        break
                }
                judgeAll()
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
                img: res[sprintf("do2_content%d", i + 1)], //图片和声音文件
                sound: res[sprintf("do2_sound%d", i + 1)],
            })
        }
    }
})