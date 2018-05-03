//@author mu @16/4/27
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
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
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.wtdcf_bg2,
                                downData: {
                                    nums: 5,
                                    bufs: [
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
                            var resultList = []
                            var finalList = [2, 2, 4, 4, 4]

                            for (var i = 0; i < 5; i++) {
                                resultList[i] = sprintf("result%d", i + 1)
                            }
                            loadList(bg, resultList)
                            bg.ClearFun = function(){
                                for (var i = 0; i < resultList.length; i++) {
                                    var result = bg[resultList[i]]
                                    if (result.insp) {
                                        result.insp.setVisible(false)
                                    }
                                }
                            }
                            bg.linkAnswer = function() {
                                for (var i = 0; i < resultList.length; i++) {
                                    var result = bg[resultList[i]]
                                    if (!result.insp) {
                                        var size = result.getContentSize()
                                        var insp = new cc.Sprite(sprintf("#wtdcf_bg_%02d.png", finalList[i]))
                                        insp.setScale(1.5)
                                        insp.setPosition(size.width / 2, size.height / 2)
                                        safeAdd(result, insp)
                                        result.insp = insp
                                    }else{
                                        result.insp.setVisible(true)
                                    }
                                }
                            }
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
    createTool: function() {
        var self = this
        var fileList = []
        for (var i = 0; i < 5; i++) {
            fileList[i] = sprintf("do1_img%d.png", i + 1)
        }
        var infoList = [{
            type: "poly",
            buf: [1, 86 - 66, 1, 86 - 13, 49, 86 - 1, 82, 86 - 18, 82, 86 - 72, 33, 86 - 86],
            offset: cc.p(-41.5, -43),
            mass: 1,
        }, {
            type: "poly",
            buf: [1, 86 - 66, 1, 86 - 13, 49, 86 - 1, 82, 86 - 18, 82, 86 - 72, 33, 86 - 86],
            offset: cc.p(-41.5, -43),
            mass: 0.8,
        }, {
            type: "poly",
            buf: [1, 86 - 66, 1, 86 - 13, 49, 86 - 1, 82, 86 - 18, 82, 86 - 72, 33, 86 - 86],
            offset: cc.p(-41.5, -43),
            mass: 0.4,
        }, {
            type: "poly",
            buf: [1, 86 - 66, 1, 86 - 13, 49, 86 - 1, 82, 86 - 18, 82, 86 - 72, 33, 86 - 86],
            offset: cc.p(-41.5, -43),
            mass: 0.3,
        }, {
            type: "poly",
            buf: [1, 86 - 66, 1, 86 - 13, 49, 86 - 1, 82, 86 - 18, 82, 86 - 72, 33, 86 - 86],
            offset: cc.p(-41.5, -43),
            mass: 0.2,
        }, ]
        var outJudge = function(item) {
            self.pyActItem({
                item: item,
                act: true,
            })
            removeMoving(item)
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
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            ifFrame: true,
            nums: 3,
            tri: "right",
            showTime: 0.3,
            itempos: cc.p(0, -55),
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
                var sp = self.addItem({
                    tex: sprintf("#do1_tool%d.png", index + 1),
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
                return sp
            },
            movefun: function(data) {
                var item = data.sp
                var delta = data.delta
                var tx = item.x + delta.x
                var ty = item.y + delta.y
                if (tx < 280) {
                    tx = 280
                }
                if (tx > 580) {
                    tx = 580
                }
                if (ty < 290) {
                    ty = 290
                }
                item.x = tx
                item.y = ty
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
        var shuigang = createShuiGang()
        shuigang.setPosition(getMiddle(-120, -160))
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
        self.addRock()
        self.actPys(true)
    },
    addRock: function() {
        var self = this
        var rockInfo = [{
            type: "poly",
            buf: [2, 35 - 16, 3, 35 - 12, 12, 35 - 5, 26, 35 - 1,
                43, 35 - 1, 54, 35 - 9, 55, 35 - 17,
                54, 35 - 24, 46, 35 - 32, 39, 35 - 33,
                26, 35 - 33, 14, 35 - 29, 3, 35 - 20,
            ],
            mass: 2,
            offset: cc.p(-30, -17.5),
            tex: "#img_rock1.png",
            pos: cc.p(300, 52),
        }, {
            type: "poly",
            buf: [2, 35 - 16, 3, 35 - 12, 12, 35 - 5, 26, 35 - 1,
                43, 35 - 1, 54, 35 - 9, 55, 35 - 17,
                54, 35 - 24, 46, 35 - 32, 39, 35 - 33,
                26, 35 - 33, 14, 35 - 29, 3, 35 - 20,
            ],
            mass: 2,
            offset: cc.p(-30, -17.5),
            tex: "#img_rock1.png",
            pos: cc.p(580, 52),
        }, {
            type: "poly",
            buf: [18, 61 - 44, 12, 61 - 32, 9, 61 - 21, 12, 61 - 13, 21, 61 - 8, 31, 61 - 10, 46, 61 - 21, 53, 61 - 33, 51, 61 - 42, 43, 61 - 50, 28, 61 - 49],
            mass: 2,
            offset: cc.p(-31, -30.5),
            tex: "#img_rock2.png",
            pos: cc.p(400, 60),
        }, {
            type: "poly",
            buf: [12, 42 - 39, 1, 42 - 29, 2, 42 - 19, 12, 42 - 10, 26, 42 - 3, 39, 42 - 3, 50, 42 - 14, 50, 42 - 22, 33, 42 - 41, 19, 42 - 40],
            mass: 2,
            offset: cc.p(-25.5, -21),
            tex: "#img_rock3.png",
            pos: cc.p(480, 50),
        }, ]
        for (var i = 0; i < rockInfo.length; i++) {
            var info = rockInfo[i]
            var sp = self.addItem({
                mass: info.mass,
                type: info.type,
                buf: info.buf,
                offset: info.offset,
                static: true,
                pos: info.pos,
            })
            var item = new cc.Sprite(info.tex)
            item.setPosition(info.pos)
            safeAdd(self, item)
        }
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
            img: res.do1_conten1, //图片和声音文件
            sound: res.do1_sound1
        })
    }
})