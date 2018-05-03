//@author mu @16/4/27
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("do_tool")
        loadPlist("wtdcf_sh")
    },
    myExit: function() { //退出时调用
        this._super()
    },
    myDelete: function() { //删除时调用
        this._super()
    },
    showBw: function(pos) {
        var self = this
        var node = new cc.Sprite()
        node.setPosition(cc.p(pos.x, 300))
        node.runAction(
            createAnimation({
                frame: "water_fire_%02d.png",
                end: 15,
                time: 1 / 24,
                fun: function() {
                    node.removeFromParent(true)
                }
            })
        )
        safeAdd(self, node)
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
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.wtdcf_bg4,
                                inputNum: 4,
                                downData: {
                                    nums: 12,
                                    bufs: [
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                        [null, "#wtdcf_bg_02.png", "#wtdcf_bg_04.png"],
                                    ],
                                },
                            })
                            self.biaoge = bg
                            safeAdd(self, bg)
                            var list = [
                                "bg1",
                                "bg2",
                                "btn_b1",
                                "btn_b2",
                                // "btn_r1",
                                // "btn_r2",
                            ]
                            var resultList = []
                            for (var i = 0; i < 12; i++) {
                                resultList[i] = sprintf("result%d", i + 1)
                            }
                            loadList(bg, resultList)
                            loadList(bg, list)

                            var initControl = function() {
                                bg.btn_b1.addClickEventListener(function() {
                                    bg.showIndex(1)
                                })
                                bg.btn_b2.addClickEventListener(function() {
                                    bg.showIndex(2)
                                })
                                bg.bg1.getChildByName("result").setVisible(false)
                                bg.bg2.getChildByName("result").setVisible(false)
                                // bg.btn_r1.addClickEventListener(function() {
                                //     bg.bg1.getChildByName("result").setVisible(true)
                                // })
                                // bg.btn_r2.addClickEventListener(function() {
                                //     bg.bg2.getChildByName("result").setVisible(true)
                                // })
                                bg.linkAnswer = function() {
                                    var list = [1, 2, 3, 4, 5, 6]
                                    var add = bg.curIndex == 1 ? 0 : 6
                                    var final = [2, 2, 2, 4, 4, 4, 2, 2, 2, 4, 4, 4]
                                    for (var i = 0; i < list.length; i++) {
                                        var item = bg[sprintf("result%d", list[i] + add)]
                                        if (!item.hasItem) {
                                            var sp = new cc.Sprite(sprintf("#wtdcf_bg_%02d.png", final[i + add]))
                                            sp.setScale(1.3)
                                            sp.setPosition(70, 20)
                                            safeAdd(item, sp)
                                            item.hasItem = true
                                            item.insp = sp
                                        } else {
                                            item.insp.setVisible(true)
                                        }
                                    }
                                    var result = bg[sprintf("bg%d", bg.curIndex)].getChildByName("result")
                                    if(result){
                                        result.setVisible(true)
                                    }
                                }
                                bg.ClearFun = function(){
                                    var list = [1, 2, 3, 4, 5, 6]
                                    var add = bg.curIndex == 1 ? 0 : 6
                                    for (var i = 0; i < list.length; i++) {
                                        var item = bg[sprintf("result%d", list[i] + add)]
                                        if (item.insp) {
                                            item.insp.setVisible(false)
                                        }
                                    }
                                    var result = bg[sprintf("bg%d", bg.curIndex)].getChildByName("result")
                                    if(result){
                                        result.setVisible(false)
                                    }
                                }
                            }

                            initControl()

                            bg.showIndex = function(index) {
                                bg.bg1.setVisible(index == 1)
                                bg.bg2.setVisible(index == 2)
                                bg.btn_b1.setBright(true)
                                bg.btn_b1.setTouchEnabled(true)
                                bg.btn_b2.setBright(true)
                                bg.btn_b2.setTouchEnabled(true)
                                switch(index){
                                    case 1:
                                        bg.btn_b1.setBright(false)
                                        bg.btn_b1.setTouchEnabled(false)
                                    break
                                    case 2:
                                        bg.btn_b2.setBright(false)
                                        bg.btn_b2.setTouchEnabled(false)
                                    break
                                }
                                bg.curIndex = index
                            }
                            bg.showIndex(1)
                        }
                        self.biaoge.show()
                    },
                }
            }) //实验模板
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
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 12; i++) {
            fileList[i] = sprintf("do3_img%d.png", i + 1)
        }
        var infoList = [{
            type: "poly",
            buf: [1, 39 - 24, 8, 39 - 1, 34, 39 - 1, 37, 39 - 17, 31, 39 - 38, 5, 39 - 38],
            offset: cc.p(-19, -19.5),
            mass: 0.12,
        }, {
            type: "poly",
            buf: [0, 39 - 23, 6, 39 - 1, 21, 39 - 1, 23, 39 - 17, 18, 39 - 38, 3, 39 - 38],
            offset: cc.p(-12, -19.5),
            mass: 0.08,
        }, {
            type: "poly",
            buf: [1, 39 - 24, 5, 39 - 1, 14, 39 - 1, 18, 39 - 17, 12, 39 - 37, 3, 39 - 37],
            offset: cc.p(-17 / 2, -39 / 2),
            mass: 0.05,
        }, {
            type: "poly",
            buf: [16, 58 - 51, 2, 58 - 34, 1, 58 - 29, 5, 58 - 20, 23, 58 - 8,
                38, 58 - 3, 50, 58 - 3,
                79, 58 - 10, 79, 58 - 30, 66, 58 - 48, 49, 58 - 57, 36, 58 - 58, 23, 58 - 55
            ],
            offset: cc.p(-80 / 2, -58 / 2),
            mass: 0.2,
        }, {
            type: "poly",
            buf: [0, 57 - 43, 37, 57 - 11, 60, 57 - 10, 64, 57 - 24, 51, 57 - 46, 31, 57 - 56, 20, 57 - 57, 6, 57 - 54, ],
            offset: cc.p(-64 / 2, -57 / 2),
            mass: 0.1,
        }, {
            type: "poly",
            buf: [0, 49 - 40, 59, 49 - 0, 60, 49 - 16, 50, 49 - 35, 41, 49 - 43, 25, 49 - 49, 17, 49 - 49, 8, 49 - 46, ],
            offset: cc.p(-60 / 2, -49 / 2),
            mass: 0.07,
        }, null, null, null, {
            type: "poly",
            buf: [1, 74 - 64, 1, 74 - 7, 26, 74 - 1, 43, 74 - 10, 43, 74 - 67, 18, 74 - 73],
            offset: cc.p(-44 / 2, -74 / 2),
            mass: 0.1,
        }, {
            type: "poly",
            buf: [1, 102 - 92, 1, 102 - 7, 26, 102 - 1, 43, 102 - 10, 43, 102 - 96, 18, 102 - 101, ],
            offset: cc.p(-44 / 2, -102 / 2),
            mass: 0.15,
        }, {
            type: "poly",
            buf: [1, 131 - 120, 1, 131 - 7, 26, 131 - 1, 43, 131 - 10, 43, 131 - 124, 18, 131 - 130],
            offset: cc.p(-44 / 2, -131 / 2),
            mass: 0.2,
        }, ]
        var hxzInfo = {
            type: "poly",
            buf: [1, 30 - 29, 0, 30 - 27, 1, 30 - 3, 5, 30 - 0, 7, 30 - 2, 9, 30 - 11, 9, 30 - 27, 4, 30 - 30],
            offset: cc.p(-9 / 2, -30 / 2),
            mass: 0.05,
        }
        var judgePos = function(item, delta, add) {
            var tx = item.x + delta.x
            var ty = item.y + delta.y
            var judgeL = 140
            var judgeR = 790
            var judgeDown = 290
            add = add || 0
            if (tx < judgeL) {
                tx = judgeL
            }
            if (tx > judgeR) {
                tx = judgeR
            }
            if (ty < judgeDown + add) {
                ty = judgeDown + add
            }
            item.x = tx
            item.y = ty
        }
        var outJudge = function(item) {
            if (!item.noJudge) {
                self.pyActItem({
                    item: item,
                    act: true,
                })
                removeMoving(item)
                item.update = function(dt) {
                    var hs = this
                    if (!hs.finishShow) {
                        var result = judgeItemCrash({
                            item1: hs,
                            item2: self.shuigang.judgeWater,
                        })
                        if (result) {
                            self.showBw(hs.getPosition())
                            hs.finishShow = true
                            hs.unscheduleUpdate()
                        }
                    }
                }
                item.scheduleUpdate()
            } else {
                var items = item.items
                for (var i = 0; i < items.length; i++) {
                    var initem = items[i]
                    self.pyActItem({
                        item: initem,
                        act: true,
                    })
                }
                for (var i = 0; i < items.length - 1; i++) {
                    var sp = items[i]
                    var sp2 = items[i + 1]
                    var pos1 = sp.getPosition()
                    var pos2 = sp2.getPosition()
                    self.addJoint({
                        type: "pivot",
                        buf: {
                            item1: sp,
                            item2: sp2,
                            anchor: cc.p((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2),
                        }
                    })
                }
                item = items[items.length - 1]
                item.update = function(dt) {
                    var hs = this
                    if (!hs.finishShow) {
                        var result = (hs.y <= 230)
                        if (result) {
                            self.showBw(hs.getPosition())
                            hs.finishShow = true
                            hs.unscheduleUpdate()
                        }
                    }
                }
                item.scheduleUpdate()
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            ifFrame: true,
            nums: 3,
            tri: "right",
            showTime: 0.3,
            itempos: cc.p(0, -60),
            circlepos: cc.p(0, 15),
            devide: cc.p(1, 1.3),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            fileAnchor: cc.p(0.5, 0),
            itemScale: 0.8,
            files: fileList,
            gets: [null, null, null, null, null],
            firstClick: function(data) {
                var index = data.index
                var info = infoList[index]
                var pos = data.pos
                var sp = null
                if (info) {
                    sp = self.addItem({
                        tex: sprintf("#do3_tool%d.png", index + 1),
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
                } else {
                    var sp = new cc.Node()
                    sp.items = []
                    sp.nopos = true
                    sp.noJudge = true
                    var info = hxzInfo
                    for (var i = 0; i < index - 6 + 2; i++) {
                        var insp = self.addItem({
                            tex: sprintf("#img_tool_hxz.png"),
                            mass: info.mass,
                            disAct: true,
                            type: info.type,
                            buf: info.buf,
                            offset: info.offset,
                        })
                        self.pyActItem({
                            item: insp,
                            act: false,
                        })
                        insp.setPosition(cc.p(pos.x, pos.y - 30 * i))
                        sp.items[sp.items.length] = insp
                        safeAdd(sp, insp)
                    }
                }
                //sp.setOpacity(100)
                return sp
            },
            movefun: function(data) {
                var item = data.sp
                var delta = data.delta
                if (!item.noJudge) {
                    judgePos(item, delta)
                } else {
                    var items = item.items
                    for (var i = 0; i < items.length; i++) {
                        judgePos(items[i], delta, (items.length - i - 1) * 30)
                    }
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
        var shuigang = createShuiGang({
            addWide: 250,
        })
        shuigang.setPosition(getMiddle(-100, -160))
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
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.do3_conten1, //图片和声音文件
            sound: res.do3_sound1
        })
    }
})