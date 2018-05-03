//@author mu @16/4/27
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
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
        this.expCtor() //实验模板
        this.dataControl = {}
        var self = this
        self.initPeople() //创建人物
        self.initScene()
        self.createTool()
        return true
    },
    createTool: function() {
        var self = this
        var penList = [
            "4b", "2b", "hb", "2h", "4h"
        ]

        var createPen = function(index) {
            var sp = new cc.Sprite(res.img_pen)
            sp.setLocalZOrder(2)
            sp.opJudge = true
            sp.setAnchorPoint(0, 0)
            var add = new cc.Sprite(sprintf("#img_%s.png", penList[index - 1]))
            safeAdd(sp, add)
            add.setPosition(151, 345)
            sp.index = index
            sp.drawPen = function() {
                var item = this
                var index = item.index
                var pen = new cc.Sprite(sprintf("#pen_%s.png", penList[index - 1]))
                var font = new cc.Sprite(sprintf("#font_%s.png", penList[index - 1]))
                var pos = item.getPosition()
                pen.setAnchorPoint(0, 0)
                font.setAnchorPoint(0, 0)

                font.setPosition(cc.p(pos.x + 350, pos.y - 14))
                font.setVisible(false)
                var par = item.getParent()

                safeAdd(par, font)
                var size = pen.getContentSize()
                var tempRect = createLayout({
                    size: size,
                    op: 0,
                    clip: true,
                })
                tempRect.setAnchorPoint(1, 0)
                tempRect.setPosition(cc.p(pos.x, pos.y - 14))
                pen.setPosition(size.width, 0)
                safeAdd(tempRect, pen)
                safeAdd(par, tempRect)

                var perX = size.width / 24
                var perY = -14 / 24
                tempRect.count = 0
                addTimer({
                    fun: function(key) {
                        pen.setVisible(false)
                        changeFather({
                            item: pen,
                            father: par,
                        })
                        tempRect.x += perX
                        item.x += perX
                        item.y += perY
                        tempRect.count += perX
                        changeFather({
                            item: pen,
                            father: tempRect,
                        })
                        pen.setVisible(true)
                        if (tempRect.count >= size.width) {
                            removeTimer(key)
                            item.setVisible(false)
                            item.finish = true
                            font.setVisible(true)
                        }
                    },
                    time: 1 / 24,
                    repeat: cc.REPEAT_FOREVER,
                    father: tempRect,
                })
            }

            safeAdd(self, sp)
            sp.setVisible(false)
            return sp
        }
        var finalPenList = []
        for (var i = 1; i < 6; i++) {
            finalPenList[i] = createPen(i)
        }

        var self = this
        var fileList = []
        for (var i = 0; i < 6; i++) {
            fileList[i] = sprintf("see_tool%d.png", i + 1)
        }
        
        var paperPos = getMiddle(-100, -150)

        var judgePen = function(data) {
            var item = data.item
            if (self.paperReady && item.isVisible() && !item.showing && !item.finish) {
                var paper = self.paper
                var result = judgeInside({
                    item: paper,
                    pos: getWorldPos(item),
                })
                if (result) {
                    item.showing = true
                    item.setPosition(paper.posList[paper.count])
                    item.setLocalZOrder(paper.count)
                    paper.count++;
                    safeAdd(paper, item)
                    removeMoving(item)
                    item.noMove = true
                    item.drawPen()
                }
            }
        }

        var outJudge = function(data) {
            var item = data.sp
            var index = data.index
            switch (index) {
                case 0:
                    item.setPosition(paperPos)
                    removeMoving(item)
                    self.paperReady = true
                    self.paper = item
                    item.count = 0
                    var start = cc.p(170, 184)
                    var devideY = -30
                    var devideX = -20
                    item.posList = []
                    for (var i = 0; i < 5; i++) {
                        item.posList[i] = cc.p(start.x + devideX * i, start.y + devideY * i)
                    }
                    break
                default:
                    judgePen({
                        item: item,
                        pos: data.pos
                    })
                    break
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            ifFrame: true,
            nums: 6,
            tri: "right",
            showTime: 0.3,
            itempos: [cc.p(0, -17), cc.p(0, -10), cc.p(0, -10), cc.p(0, -10), cc.p(0, -10), cc.p(0, -10)],
            circlepos: cc.p(0, 15),
            devide: cc.p(0.9, 1.2),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            itemScale: 0.8,
            files: fileList,
            gets: [res.img_bz, null, null, null, null, null],
            firstClick: function(data) {
                var index = data.index
                var sp = data.sp
                switch (index) {
                    case 0:
                        break
                    default:
                        sp = finalPenList[index]
                        sp.setVisible(true)
                        break
                }
                return sp
            },
            movefun: function(data) {
                var item = data.sp
                var delta = data.delta
                var index = data.index
                item.x += delta.x
                item.y += delta.y
                switch (index) {
                    case 0:
                        break
                    default:
                        judgePen({
                            item: item,
                            pos: data.pos,
                        })
                        break
                }
            },
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
    initScene: function() {
        var self = this
        var btnFind = new ccui.Button(res.btn_tips_normal, res.btn_tips_select)
        btnFind.setPosition(1000, 400)
        safeAdd(self, btnFind)
        btnFind.addClickEventListener(function() {
            if (!self.resultBg1) {
                var img = createShowImg({
                    img: res.do1_tips,
                    clsScale: 0.8,
                    closeOff: cc.p(10, 10)
                })
                img.setLocalZOrder(1)
                safeAdd(self, img)
                self.resultBg1 = img
            }
            self.resultBg1.show()
        })

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
                    "judge5",
                ]
                var bg = loadNode(res.do1xcs, uilist, "bg")
                self.xcsbg = bg
                bg.setScale(0)

                var splist = []

                var posList = []
                var start = cc.p(52, 40)
                var devide = 93
                for (var i = 0; i < 5; i++) {
                    posList[i] = cc.p(start.x + devide * i, start.y)
                }

                var judgeList = [
                    bg.judge1,
                    bg.judge2,
                    bg.judge3,
                    bg.judge4,
                    bg.judge5,
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
                        item.setSpriteFrame(sprintf("px_seecs_%02d.png", item.index * 2 + 2))
                        safeAdd(lay, item)
                    }
                    return result
                }

                for (var i = 0; i < 5; i++) {
                    var sp = new cc.Sprite(sprintf("#px_seecs_%02d.png", i * 2 + 1))
                    sp.index = i
                    splist[i] = sp
                    judgeList[i].judge = judge
                    sp.back = function() {
                        var item = this
                        if (item.rootPos) {
                            item.setSpriteFrame(sprintf("px_seecs_%02d.png", item.index * 2 + 1))
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
                                item.setSpriteFrame(sprintf("px_seecs_%02d.png", item.index * 2 + 1))
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
                    bg.curRand = getRand(5)
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
                        item.setSpriteFrame(sprintf("px_seecs_%02d.png", item.index * 2 + 1))
                        item.setPosition(posList[bg.curRand[i]])
                        item.rootPos = null
                        safeAdd(bg.img_bg, item)
                    }
                }

                bg.reinit()

                var answer = [
                    [0, 1, 2, 3, 4],
                    [4, 3, 2, 1, 0],
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
                            img: curShow ? res.img_final1 : res.img_final2,
                            bgInfo: {
                                noBg: true,
                            }
                        })
                        safeAdd(self, img)
                        self.xcsfinal = img
                    }
                    var final = self.xcsfinal
                    final.setTexture(curShow ? res.img_final1 : res.img_final2)
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
    }
})