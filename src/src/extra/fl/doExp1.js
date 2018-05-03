//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("seeJson")
        loadPlist("do1json")
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
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.fl_bg1,
                                inputNum: 13,
                                downData: {
                                    nums: 6,
                                    bufs: [
                                        [null, "#fl_bg_02.png", "#fl_bg_04.png", "#fl_bg_06.png"],
                                        [null, "#fl_bg_02.png", "#fl_bg_04.png", "#fl_bg_06.png"],
                                        [null, "#fl_bg_02.png", "#fl_bg_04.png", "#fl_bg_06.png"],
                                        [null, "#fl_bg_02.png", "#fl_bg_04.png", "#fl_bg_06.png"],
                                        [null, "#fl_bg_02.png", "#fl_bg_04.png", "#fl_bg_06.png"],
                                        [null, "#fl_bg_02.png", "#fl_bg_04.png", "#fl_bg_06.png"],
                                    ],
                                },
                                resultFun: function() {
                                    var bg = self.biaoge
                                    var index = bg._newIndex
                                    bg[sprintf("img_result%d", index)].setVisible(true)
                                }
                            })
                            var list = [
                                "img_result1",
                                "img_result2",
                                "img_bg1",
                                "img_bg2",
                                "btn_b1",
                                "btn_b2",
                            ]
                            loadList(bg, list)
                            bg.img_result2.setVisible(false)
                            bg.img_result1.setVisible(false)
                            bg._newShowBg = function(index) {
                                var bg = this
                                bg.img_bg1.setVisible(index == 1)
                                bg.img_bg2.setVisible(index == 2)
                                if (index == 1) {
                                    bg.img_result2.setVisible(false)
                                }
                                if (index == 2) {
                                    bg.img_result1.setVisible(false)
                                }
                                bg._newIndex = index
                            }
                            bg._newShowBg(1)
                            bg.btn_b1.showImg = "#bg_new_02.png"
                            bg.btn_b2.showImg = "#bg_new_06.png"

                            var showNew = function(judge) {
                                var btn = this
                                judge = judge || false
                                if (!btn.newImg) {
                                    var img = new cc.Sprite(btn.showImg)
                                    safeAdd(btn, img)
                                    var size = btn.getContentSize()
                                    img.setPosition(size.width / 2, size.height / 2)
                                    btn.newImg = img
                                }
                                var img = btn.newImg
                                img.setVisible(judge)
                            }
                            bg.btn_b1.showNew = showNew
                            bg.btn_b2.showNew = showNew

                            bg.btn_b1.addClickEventListener(function() {
                                bg._newShowBg(1)
                                bg.btn_b1.showNew(true)
                                bg.btn_b2.showNew(false)
                            })
                            bg.btn_b2.addClickEventListener(function() {
                                bg._newShowBg(2)
                                bg.btn_b1.showNew(false)
                                bg.btn_b2.showNew(true)
                            })
                            bg.ClearFun = function() {
                                bg.img_result2.setVisible(false)
                                bg.img_result1.setVisible(false)
                            }
                            bg.btn_b1.showNew(true)
                            self.biaoge = bg
                            safeAdd(self, bg)
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        return true
    },
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 3; i++) {
            fileList[i] = sprintf("do1_tool%d.png", i + 1)
        }

        var outJudge = function(item) {
            var hl = self.hl
            if (hl) {
                var result = judgeItemCrash({
                    item1: item,
                    item2: hl.judge,
                })
                if (result) {
                    switch (item.index) {
                        case 0:
                        case 1:
                            self.th.setLimit([500, null])
                            break
                        case 2:
                            self.th.setLimit([520, null])
                            break
                    }
                    hl.addItem({
                            item: item,
                            height: item.inH,
                            modify: cc.p(item.modify, 0),
                            limit: item.limit,
                        })
                        //hl.setLimit(item.limit)
                    hl.showHand(false)
                    removeMoving(item)
                    hl.draw()
                }
            }

        }
        var toolbtn = createTool({
            pos: cc.p(70, 500),
            ifFrame: true,
            nums: 3,
            tri: "down",
            showTime: 0.3,
            itempos: [cc.p(0, -80), cc.p(0, -80), cc.p(0, -73)],
            circlepos: [cc.p(0, 15), cc.p(0, 15), cc.p(0, 25)],
            devide: cc.p(1.4, 1.0),
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
                var hl = self.hl
                if (self.pastItem) {
                    self.pastItem.forceBack()
                }
                hl.item = null
                hl.showHand(true)
                var th = self.th
                th.reSet()
                th.follow()
                hl.draw()
                var sp = new cc.Sprite(sprintf("#do1_img%d.png", index + 1))

                var judge = createLayout({
                    size: cc.size(10, 10),
                    op: 0,
                })
                switch (index) {
                    case 0:
                        sp.modify = 5
                        sp.inH = 160
                        sp.limit = [null, 30]
                        judge.setPosition(28, 0)
                        break
                    case 1:
                        sp.modify = 5
                        sp.inH = 165
                        sp.limit = [null, 30]
                        judge.setPosition(36, 0)
                        break
                    case 2:
                        sp.modify = 5
                        sp.inH = 170
                        sp.limit = [null, 30]
                        judge.setPosition(42, 0)
                        break
                }
                safeAdd(sp, judge)
                    //addMoving(judge, true, true)
                sp.judge = judge
                self.pastItem = sp
                addCrashRect({
                    item: sp,
                    list: [{
                        item: self.judgeRect,
                    }]
                })
                return sp
            },
            movefun: function(data) {
                var item = data.sp
                var delta = data.delta
                item._judgeCrash({
                    delta: delta
                })
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

        var node = craeteThclj({
            pos: getMiddle(-31, 20),
            layer: self,
            scale: 0.2,
            fdjRoot: 0.17,
            hand: true,
            follow: true,
            judgeFun: function() {
                var hl = self.hl
                if (hl && hl.item) {
                    return true
                } else {
                    if (!self.hasShow) {
                        AddDialog("Tips", {
                            res: res.img_tip1,
                            face: 2,
                            closeBack: function() {
                                self.hasShow = false
                            }
                        })
                        self.hasShow = true
                    }
                }
                return false
            },
            move: function() {
                var th = self.th
                var hl = self.hl
                if (th && hl) {
                    th.follow()
                    hl.draw()
                }
            },
            type: "5N",
        })

        self.th = node.th



        var desk = new cc.Sprite("#img_desk.png")
        desk.setPosition(getMiddle(0, -400))
        safeAdd(self, desk)

        var shuigang = createShuiGang()
        shuigang.setPosition(getMiddle(0, -180))
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
        self.judgeRect = shuigang.judgeRect

        var limit = [0.4, 0.6, 0.7]
        var power = [0.9, 1.5, 2.4]
        var hl = createHL({
            pos: getMiddle(0, -260),
            length: 340,
            nums: 100,
            getLeft: function() {
                return {
                    pos: self.th.getAddPoint(),
                    type: "curve",
                }
            },
            getRight: function(hl) {
                if (!hl.item) {
                    return {
                        pos: hl.getHandPos(),
                        type: "line",
                    }
                } else {
                    return {
                        pos: getWorldPos(hl.item.judge),
                        type: "line",
                    }
                }
            },
            fun: function(per) {
                var hl = self.hl
                var th = self.th
                if (hl && hl.item) {
                    var item = hl.item
                    var max = limit[item.index]
                    var pow = power[item.index]
                    if (per > max) {
                        th.setForce(pow)
                        if (!self.hasShowNext) {
                            self.hasShowNext = true
                            self.nodebs.say({
                                key: "Next",
                                force: true,
                            })
                        }
                    } else {
                        th.setForce(per / max * pow)
                    }
                }
            },
            father: self,
        })
        hl.showHand(true)
        self.hl = hl
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
            img: res.do1_content1, //图片和声音文件
            sound: res.do1_sound1
        })
        addContent({
            people: this.nodebs,
            key: "Next", //对话标签 之后让人物说话需要用到的参数
            img: res.do1_content2, //图片和声音文件
            sound: res.do1_sound2
        })
    }
})