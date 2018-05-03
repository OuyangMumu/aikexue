//@author mu @16/4/27
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
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
        this.expCtor() //实验模板
        this.dataControl = {}
        var self = this
        self.initPeople() //创建人物
        self.createTool()
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var btntest = new ccui.Button(res.btn_xcs_normal, res.btn_xcs_select)
        btntest.setPosition(990, 480)
        safeAdd(self, btntest)
        btntest.addClickEventListener(function() {
            if (!self.xcsbg) {
                var uilist = [
                    "btn_close",
                    "btn_redo",
                    "btn_upload",
                    "btn_answer",
                    "img_bg",
                    "font1",
                    "font2",
                    "tri1",
                    "tri2",
                    "tri3",
                    "judge1",
                    "judge2",
                    "judge3",
                    "judge4",
                ]
                var bg = loadNode(res.do2xcs, uilist, "bg")
                self.xcsbg = bg
                bg.setScale(0)

                var splist = []

                var posList = []
                var start = cc.p(65, 53)
                var devide = 120
                for (var i = 0; i < 4; i++) {
                    posList[i] = cc.p(start.x + devide * i, start.y)
                }

                var judgeList = [
                    bg.judge1,
                    bg.judge2,
                    bg.judge3,
                    bg.judge4,
                ]

                var judgeAll = function(data) {
                    var final = false
                    for (var i = 0; i < judgeList.length; i++) {
                        var lay = judgeList[i]
                        var result = lay.judge(data)
                        if (result) {
                            final = true
                            break
                        }
                    }
                    return final
                }

                var judge = function(data) {
                    var lay = this
                    var size = lay.getContentSize()
                    var item = data.item
                    var result = judgeItemCrash({
                        item1: item,
                        item2: lay,
                    })
                    if (result) {
                        if (item.father) {
                            var inFather = item.father
                            var inItem = lay.item
                            if (inItem) {
                                safeAdd(inFather, inItem)
                                inFather.item = inItem
                                inItem.father = inFather
                            } else {
                                inFather.item = null
                            }
                        } else {
                            var inItem = lay.item
                            if (inItem) {
                                inItem.back()
                            }
                        }
                        item.father = lay
                        lay.item = item
                        item.setPosition(size.width / 2, size.height / 2)
                        safeAdd(lay, item)
                    }
                    return result
                }

                for (var i = 0; i < 4; i++) {
                    var sp = new cc.Sprite(res[sprintf("do2_chose%d", i + 1)])
                    sp.index = i
                    splist[i] = sp
                    judgeList[i].judge = judge
                    sp.back = function() {
                        var item = this
                        if (item.rootPos) {
                            item.setPosition(item.rootPos)
                            item.father = null
                            safeAdd(bg.img_bg, item)
                        }
                    }

                    createTouchEvent({
                        item: sp,
                        begin: function(data) {
                            var item = data.item
                            if (bg.ifShow) {
                                if (!item.rootPos) {
                                    item.rootPos = item.getPosition()
                                }
                                changeFather({
                                    item: item,
                                    father: bg,
                                })
                            }
                            return bg.ifShow
                        },
                        autoMove: true,
                        end: function(data) {
                            var item = data.item
                            var result = judgeAll(data)
                            if (result) {

                            } else {
                                if (item.father) {
                                    item.father.item = null
                                }
                                item.back()
                            }
                        }
                    })
                }
                var font1 = bg.font1
                var font2 = bg.font2

                font1.rootPos = font1.getPosition()
                font2.rootPos = font2.getPosition()

                var trilist = [
                    bg.tri1,
                    bg.tri2,
                    bg.tri3,
                ]

                bg.reinit = function() {
                    bg.curRand = getRand(4)
                    bg.curShow = (Math.random() > 0.5)

                    font1.setPosition(bg.curShow ? font1.rootPos : font2.rootPos)
                    font2.setPosition(bg.curShow ? font2.rootPos : font1.rootPos)

                    for (var i = 0; i < trilist.length; i++) {
                        var tri = trilist[i]
                        tri.setFlippedX(bg.curShow)
                    }

                    for (var i = 0; i < judgeList.length; i++) {
                        judgeList[i].item = null
                    }

                    for (var i = 0; i < splist.length; i++) {
                        var item = splist[i]
                        item.father = null
                        item.setPosition(posList[bg.curRand[i]])
                        item.rootPos = null
                        safeAdd(bg.img_bg, item)
                    }
                }

                bg.reinit()

                var answer = [
                    [3, 0, 1, 2],
                    [2, 1, 0, 3],
                ]

                bg.judgeAnswer = function() {
                    var bg = this
                    var curShow = bg.curShow
                    var judge = curShow ? answer[0] : answer[1]
                    var final = true
                    for (var i = 0; i < judgeList.length; i++) {
                        var lay = judgeList[i]
                        if (!(lay && lay.item && lay.item.index == judge[i])) {
                            final = false
                            break
                        }
                    }
                    if (!self.hasShowdia) {
                        self.hasShowdia = true
                        AddDialog("Judge", {
                            judge: final,
                            sound: "student",
                            fun: function() {
                                self.hasShowdia = false
                            }
                        })
                    }
                }

                bg.btn_upload.addClickEventListener(function() {
                    bg.judgeAnswer()
                })

                bg.btn_answer.addClickEventListener(function() {
                    var curShow = bg.curShow
                    if (!self.xcsfinal) {
                        var img = createShowImg({
                            img: res.do2_final,
                            bgInfo: {
                                noBg: true,
                            }
                        })
                        safeAdd(self, img)

                        var big = new cc.Sprite(res.img_da)
                        big.setPosition(180, 245)
                        big.rootPos = big.getPosition()
                        safeAdd(img, big)

                        var xiao = new cc.Sprite(res.img_xiao)
                        xiao.setPosition(240, 245)
                        xiao.rootPos = xiao.getPosition()
                        safeAdd(img, xiao)

                        var inPosList = []
                        var triPos = []
                        var inStart = cc.p(70, 130)
                        var devide = 142
                        var triStart = cc.p(140, 120)
                        var inItemList = []
                        for (var i = 0; i < 4; i++) {
                            inPosList[i] = cc.p(inStart.x + i * devide, inStart.y)
                        }

                        for (var i = 0; i < 3; i++) {
                            triPos[i] = cc.p(triStart.x + i * devide, triStart.y)
                        }

                        var triList = []
                        for (var i = 0; i < 3; i++) {
                            var sp = new cc.Sprite("#px_xcs_09.png")
                            sp.setPosition(triPos[i])
                            safeAdd(img, sp)
                            triList[i] = sp
                        }

                        for (var i = 0; i < 4; i++) {
                            var sp = new cc.Sprite(res[sprintf("do2_chose%d", i + 1)])
                            sp.setPosition(inPosList[i])
                            safeAdd(img, sp)
                            inItemList[i] = sp
                        }

                        var finalPosList = [
                            [1, 2, 3, 0],
                            [2, 1, 0, 3]
                        ]

                        img.changeshow = function(judge) {
                            big.setPosition(judge ? big.rootPos : xiao.rootPos)
                            xiao.setPosition(judge ? xiao.rootPos : big.rootPos)
                            for (var i = 0; i < triList.length; i++) {
                                triList[i].setFlippedX(!judge)
                            }
                            var cur = judge ? finalPosList[0] : finalPosList[1]
                            for (var i = 0; i < inItemList.length; i++) {
                                inItemList[i].setPosition(inPosList[cur[i]])
                            }
                        }

                        self.xcsfinal = img
                    }
                    var final = self.xcsfinal
                    final.changeshow(curShow)
                    final.show()
                })

                bg.btn_redo.addClickEventListener(function() {
                    bg.reinit()
                })

                bg.btn_close.addClickEventListener(function() {
                    bg.show()
                })
                bg.ifShow = false
                bg.show = function() {
                    var test = this
                    if (!test.showing) {
                        test.ifShow = !test.ifShow
                        test.showing = true
                        if (test.ifShow) {
                            test.setPosition(getMiddle())
                        }
                        addShowType({
                            item: test,
                            show: test.ifShow ? "scale" : "zoom",
                            time: 0.3,
                            fun: function(test) {
                                test.showing = false
                                if (test.ifShow) {
                                    addMoving(test)
                                } else {
                                    removeMoving(test)
                                }
                            }
                        })
                    }
                }
                bg.setLocalZOrder(1)
                safeAdd(self, bg)
            }
            var bg = self.xcsbg
            bg.show()
        })
    },
    createTool: function() {
        var self = this
        var fileList = []
        var getList = []
        for (var i = 0; i < 4; i++) {
            fileList[i] = res[sprintf("do2_tool%d", i + 1)]
            getList[i] = res[sprintf("do2_img%d", i + 1)]
        }

        var finalPos = getMiddle()
        var moveTime = 0.6
        var outJudge = function(data) {
            var item = data.sp
            removeMoving(item)
            addShowType({
                item: item,
                show: "scaleTo",
                buf: 1.0,
                time: moveTime,
            })
            addShowType({
                item: item,
                show: "moveTo",
                buf: finalPos,
                time: moveTime
            })
        }

        var toolbtn = createTool({
            pos: cc.p(70, 510),
            nums: 4,
            tri: "down",
            showTime: 0.3,
            itempos: cc.p(0, -5),
            circlepos: cc.p(0, 18),
            devide: cc.p(1.1, 1.0),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            itemScale: 0.8,
            files: fileList,
            gets: getList,
            firstClick: function(data) {
                var sp = data.sp
                var index = data.index
                sp.opJudge = true
                sp.setScale(0.3)
                if (self.pastSp) {
                    self.pastSp.forceBack()
                }
                self.pastSp = sp
                return sp
            },
            // movefun: function(data) {
            //     var item = data.sp
            //     var delta = data.delta
            //     var index = data.index
            //     item.x += delta.x
            //     item.y += delta.y
            //     switch (index) {
            //         case 0:
            //             break
            //         default:
            //             judgePen({
            //                 item: item,
            //                 pos: data.pos,
            //             })
            //             break
            //     }
            // },
            outfun: function(data) {
                outJudge(data)
            },
            backfun: function(data) {
                outJudge(data)
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
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
            img: res.do2_content1, //图片和声音文件
            sound: res.do2_sound1
        })
    }
})