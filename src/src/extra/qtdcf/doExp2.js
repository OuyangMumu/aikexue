//@author mu @16/4/27
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("do2_tool")
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
                    key: "sound1",
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
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        var btnFind = new ccui.Button(res.btn_get_normal, res.btn_get_select)
        btnFind.setPosition(1050, 500)
        btnFind.setVisible(false)
        safeAdd(self, btnFind)
        btnFind.addClickEventListener(function() {
            self.nodebs.say({
                key: "sound3",
                force: true,
            })
            if (!self.resultBg1) {
                var img = createShowImg({
                    img: res.do2_find,
                    bgInfo: {
                        posOff: cc.p(-10, 0)
                    },
                    closeOff: cc.p(15, 0),
                    clsScale: 0.8,
                    outFun: function() {
                        self.nodebs.stopSay({
                            im: true,
                            key: "sound3",
                        })
                    }
                })
                safeAdd(self, img)
                self.resultBg1 = img
            }
            self.resultBg1.show()
        })
        self.btnFind = btnFind

        var btnFind2 = new ccui.Button(res.btn_result2_normal, res.btn_result2_select)
        btnFind2.setPosition(1050, 400)
        btnFind2.setVisible(false)
        safeAdd(self, btnFind2)
        btnFind2.addClickEventListener(function() {
            self.nodebs.say({
                key: "sound4",
                force: true,
            })
            if (!self.resultBg2) {
                var img = createShowImg({
                    img: res.do2_result,
                    bgInfo: {
                        posOff: cc.p(-10, 0)
                    },
                    outFun: function() {
                        self.nodebs.stopSay({
                            im: true,
                            key: "sound4",
                        })
                    }
                })
                safeAdd(self, img)
                self.resultBg2 = img
            }
            self.resultBg2.show()
        })
        self.btnFind2 = btnFind2
        return true
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 3; i++) {
            fileList[i] = sprintf("do2_tool%d.png", i + 1)
        }
        var judgeAllCrash = function() {
            var bm = self.bm
            var bottle = self.bottle
            var pg = self.pg
            if (bm && bottle) {
                if (!self.finishBm) {
                    var result = judgeItemCrash({
                        item1: bm,
                        item2: bottle,
                    })
                    if (result) {
                        removeMoving(bm)
                        bm.setVisible(false)
                        bottle.showBm()
                        self.finishBm = true
                    }
                }
            }
            if (bottle && pg) {
                if (!self.finishPg) {
                    var result = judgeItemCrash({
                        item1: pg,
                        item2: bottle,
                    })
                    if (result) {
                        if (!self.finishBm) {
                            if (!self.hasShow) {
                                AddDialog("Tips", {
                                    res: res.img_tips,
                                    face: 1,
                                    closeBack: function() {
                                        self.hasShow = false
                                    }
                                })
                                self.hasShow = true
                            }
                        } else {
                            pg.setVisible(false)
                            removeMoving(pg)
                            bottle.showPg(function() {
                                bottle.showHand1()
                            })
                            self.finishPg = true
                        }
                    }
                }
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 510),
            ifFrame: true,
            nums: 3,
            tri: "down",
            showTime: 0.3,
            itempos: [cc.p(0, -70), cc.p(0, -96), cc.p(0, -70)],
            circlepos: cc.p(0, 15),
            devide: cc.p(1.4, 1),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            fileAnchor: cc.p(0.5, 0),
            itemScale: 0.8,
            files: fileList,
            gets: [null, null, null],
            // judge: function(index) {
            //     if (index == 1 && !self.getFirst) {
            //         return false
            //     }
            //     return true
            // },
            firstClick: function(data) {
                var index = data.index
                var sp = null
                switch (index) {
                    case 0:
                        sp = new cc.Sprite("#img_bm.png")
                        self.bm = sp
                        break
                    case 1:
                        sp = self.getBottle()
                        self.bottle = sp
                        break
                    case 2:
                        sp = new cc.Sprite("#pg_act_01.png")
                        self.pg = sp
                        break
                }
                return sp
            },
            movefun: function(data) {
                var item = data.sp
                var delta = data.delta
                item.x += delta.x
                item.y += delta.y
                judgeAllCrash()
            },
            outfun: function(data) {
                judgeAllCrash()
            },
            backfun: function(data) {
                judgeAllCrash()
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    getBottle: function() {
        var self = this
        var uiList = [
            "hand1_back",
            "hand2_back",
            "hand1_front",
            "hand2_front",
            "item_bm",
            "item_pg",
        ]
        var bottle = loadNode(res.qtdcf_do, uiList, "bottle")
        for (var i = 0; i < uiList.length; i++) {
            var item = bottle[uiList[i]]
            item.setVisible(false)
        }
        bottle.hand1_back.setLocalZOrder(-2)
        reAdd(bottle.hand1_back)
        bottle.hand2_back.setLocalZOrder(-2)
        reAdd(bottle.hand2_back)
        bottle.item_bm.setLocalZOrder(-1)
        reAdd(bottle.item_bm)

        bottle.ani = createControlAni({
            frame: "bottle%d.png",
            end: 6,
            time: 1 / 24,
            item: bottle,
        })
        var bm = bottle.item_bm
        var pg = bottle.item_pg
        bottle.showBm = function() {
            var bottle = this
            bm.setVisible(true)
            addShowType({
                item: bm,
                show: "moveBy",
                buf: cc.p(0, -20),
                time: 1.0,
                fun: function() {
                    self.nodebs.say({
                        key: "sound2",
                        force: true,
                    })
                }
            })
        }
        bottle.showPg = function(fun) {
                var bottle = this
                pg.setVisible(true)
                pg.runAction(cc.repeat(createAnimation({
                    frame: "pg_act_%02d.png",
                    end: 10,
                    time: 0.02,
                }), 3))
                addShowType({
                    item: pg,
                    show: "moveBy",
                    time: 0.6,
                    buf: cc.p(0, -10),
                    fun: function() {
                        if (fun) {
                            fun()
                        }
                    }
                })
            }
            // 230 49
        var hand1F = bottle.hand1_front
        var hand1B = bottle.hand1_back
        var hand2F = bottle.hand2_front
        var hand2B = bottle.hand2_back
        var devide = 10
        var time = 0.1
        bottle.showHand1 = function() {
            var bottle = this
            hand1F.setVisible(true)
            hand1B.setVisible(true)
            hand2F.setVisible(false)
            hand2B.setVisible(false)
            bottle.ani.changeStatus("back")
            removeMoving(bottle)
                //addMoving(bm, true, true)
            bm.stopAllActions()
            var dis = Math.abs(bm.getPositionY() - 230)
            addShowType({
                item: bm,
                show: "moveTo",
                buf: cc.p(44, 230),
                time: dis / devide * time,
                fun: function() {
                    if (dis > 30) {
                        addShowType({
                            item: bm,
                            show: "moveTo",
                            buf: cc.p(44, 205),
                            time: 25 / devide * time * 1.5,
                            fun: function() {
                                addShowType({
                                    item: bm,
                                    show: "moveTo",
                                    buf: cc.p(44, 225),
                                    time: 20 / devide * time * 1.5,
                                })
                            }
                        })
                    }
                }
            })
        }
        bottle.showHand2 = function() {
            var bottle = this
            hand1F.setVisible(false)
            hand1B.setVisible(false)
            hand2F.setVisible(true)
            hand2B.setVisible(true)
            bottle.ani.changeStatus("forward")
            bm.stopAllActions()
            var dis = Math.abs(bm.getPositionY() - 49)
            addShowType({
                item: bm,
                show: "moveTo",
                buf: cc.p(44, 49),
                time: dis / devide * time,
            })
        }
        var initControl = function() {
            createTouchEvent({
                item: hand1F,
                begin: function(data) {
                    var item = data.item
                    return item.isVisible()
                },
                end: function() {
                    bottle.showHand2()
                }
            })
            createTouchEvent({
                item: hand1B,
                begin: function(data) {
                    var item = data.item
                    return item.isVisible()
                },
                end: function() {
                    bottle.showHand2()
                }
            })
            createTouchEvent({
                item: hand2F,
                begin: function(data) {
                    var item = data.item
                    return item.isVisible()
                },
                end: function() {
                    bottle.showHand1()
                    self.btnFind2.setVisible(true)
                    self.btnFind.setVisible(true)
                }
            })
            createTouchEvent({
                item: hand2B,
                begin: function(data) {
                    var item = data.item
                    return item.isVisible()
                },
                end: function() {
                    bottle.showHand1()
                    self.btnFind2.setVisible(true)
                    self.btnFind.setVisible(true)
                }
            })
        }
        initControl()
        return bottle
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
        var imgList = [
            res.do2_conten1,
            res.do2_conten2,
            null,
            null,
        ]
        for (var i = 0; i < 4; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: imgList[i], //图片和声音文件
                sound: res[sprintf("do2_sound%d", i + 1)],
            })
        }
    }
})