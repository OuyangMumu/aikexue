//@author mu @16/4/27

var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("seedeco")
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
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor() //实验模板
        var self = this
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    getRandList: function() {
        var self = this
        var max = 12
        var rand = getRand(max)
        var list = []
        for (var i = 0; i < rand.length; i++) {
            list[i] = sprintf("#item%d.png", rand[i] + 1)
        }
        self.curRand = rand
        self.curList = list
        return list
    },
    showBg3: function() {
        var self = this
        if (!self.bg3) {
            self.answer1 = [
                [5, 7, 8, 9, ],
                [1, 2, 4, 6, ],
                [0, 3, 10, 11],
            ]
            var uilist = [
                "judge1",
                "judge2",
                "judge3",
                "btn_upload",
                "btn_answer",
                "btn_redo",
            ]
            var bg = loadNode(res.seebg, uilist, "bg")
            bg.setPosition(getMiddle(-140))
            safeAdd(self, bg)

            bg.btn_upload.addClickEventListener(function() {
                if (!self.canAnswer) {
                    self.canAnswer = true
                    var answer = bg.judgeAnswer()
                    self.nodebs.say({
                        key: answer ? "right" : "fault",
                        force: true,
                    })
                    AddDialog("Judge", {
                        judge: answer,
                        fun: function() {
                            self.canAnswer = false
                            self.nodebs.stopSay()
                        }
                    })
                }
            })

            bg.btn_answer.addClickEventListener(function() {
                if (!self.resultBg1) {
                    var img = createShowImg({
                        img: res.see_content3,
                        bgInfo: {
                            posOff: cc.p(-10, 0)
                        },
                        clsScale: 0.8,
                    })
                    safeAdd(self, img)
                    self.resultBg1 = img
                }
                self.resultBg1.show()
            })
            bg.btn_redo.addClickEventListener(function() {
                bg.clear()
                self.showList.reInit({
                    list: self.getRandList()
                })
            })

            bg.init = function() {
                var bg1 = this
                var addItem = function(item) {
                    var lay = this
                    if (!lay.list) {
                        lay.list = []
                    }
                    lay.list.push(item)
                    item.rootScale = item.getScale()
                    safeAdd(lay, item)
                    lay.reSort()
                }
                var reSort = function() {
                    var lay = this
                    lay.itemSize = cc.size(93, 88)
                    lay.max = lay.getContentSize().width
                    lay.devide = 108
                    if (lay.list) {
                        var nums = lay.list.length
                        var all = nums * lay.devide
                        if (all > lay.max) {
                            lay.devide = (lay.max - lay.devide) / (nums - 1)
                        }
                        for (var i = 0; i < nums; i++) {
                            var sp = lay.list[i]
                            sp.setPosition(cc.p(50 + i * lay.devide, 60))
                        }
                    }
                }
                var del = function(item) {
                    var lay = this
                    if (lay.list) {
                        for (var i = 0; i < lay.list.length; i++) {
                            if (lay.list[i] == item) {
                                lay.list.splice(i, 1)
                                lay.reSort()
                                return true
                            }
                        }
                    }
                    return false
                }
                var clear = function() {
                    var lay = this
                    if (lay.list) {
                        for (var i = lay.list.length - 1; i >= 0; i--) {
                            var item = lay.list[i]
                            if (item.removeListen) {
                                item.removeListen()
                            }
                            item.removeFromParent(true)
                        }
                    }
                    lay.list = []
                }
                var getList = function() {
                    var result = []
                    var lay = this
                    if (!lay.list) {
                        lay.list = []
                    }
                    for (var i = 0; i < lay.list.length; i++) {
                        result.push(lay.list[i].judgeIndex)
                    }
                    result = listOrder(result)
                    return result
                }
                for (var i = 0; i < 3; i++) {
                    var inlay = bg1[sprintf("judge%d", i + 1)]
                    inlay.addItem = addItem
                    inlay.reSort = reSort
                    inlay.del = del
                    inlay.clear = clear
                    inlay.getList = getList
                }
                var packageItem = function(item) {
                    createTouchEvent({
                        item: item,
                        begin: function(data) {
                            if(!getLoopVis(data.item)){
                                return false
                            }
                            var item = data.item
                            var pos = data.pos
                            var lay = item.getParent()
                            if (lay.del(item)) {
                                item.retain()
                                item.removeFromParent(false)
                                item.setPosition(self.convertToNodeSpace(pos))
                                safeAdd(self, item)
                                item.release()
                                return true
                            }
                            return false
                        },
                        move: function(data) {
                            var item = data.item
                            var pos = data.pos
                            var delta = data.delta
                            item.x += (delta.x / getLoopScale(item))
                            item.y += (delta.y / getLoopScale(item))
                        },
                        end: function(data) {
                            var item = data.item
                            if (!(bg1.judgeItem(data))) {
                                self.showList.judgeIndex(item.index, false)
                                if (item.mylay) {
                                    item.mylay.clear()
                                }
                                item.removeListen()
                                item.removeFromParent(true)
                            }
                        },
                    })
                }
                bg1.judgeItem = function(data) {
                    var item = data.item
                    var pos = data.pos
                    var bg1 = this
                    for (var i = 0; i < 3; i++) {
                        var lay = bg1[sprintf("judge%d", i + 1)]
                        if (judgeInside({
                                item: lay,
                                pos: pos,
                            })) {
                            if (item.removeListen) {
                                item.removeListen()
                            }
                            packageItem(item)
                            lay.addItem(item)
                            return true
                        }
                    }
                    return false
                }
                bg1.clear = function() {
                    var bg1 = this
                    for (var i = 0; i < 3; i++) {
                        bg1[sprintf("judge%d", i + 1)].clear()
                    }
                }
                bg1.judgeAnswer = function() {
                    var bg1 = this
                    var answers = []
                    for (var i = 0; i < 3; i++) {
                        var list = bg1[sprintf("judge%d", i + 1)].getList()
                        var judgeList = self.answer1[i]
                        if (list.length == 0) {
                            answers[i] = null
                        } else {
                            var allJudge = true
                            for (var j = 0; j < list.length; j++) {
                                var tempJudge = false
                                for (var k = 0; k < judgeList.length; k++) {
                                    if (judgeList[k] == list[j]) {
                                        tempJudge = true
                                    }
                                }
                                if (!tempJudge) {
                                    allJudge = false
                                    break
                                }
                            }
                            answers[i] = allJudge
                        }
                    }
                    var one = answers[0]
                    var two = answers[1]
                    var three = answers[2]
                    var result = !((one == null && two == null && three == null) || one == false || two == false || three == false)
                    return result
                }
            }
            bg.init()

            var showList = createList({
                list: self.getRandList(),
                swallow: false,
                pos: getMiddle(220, 0),
                size: cc.size(95, 360),
                scale: 1.2,
                btnScale: 0.8,
                arrOff: cc.p(0, -20),
                moveTime: 0.3,
                getFun: function(data) {
                    var index = data.index
                    var pos = data.pos
                    var sp = new cc.Sprite(self.curList[index])
                    sp.setPosition(self.convertToNodeSpace(pos))
                    safeAdd(self, sp)
                    sp.setScale(1.2)
                    return sp
                },
                init: function(data) {
                    var item = data.item
                    var index = data.index
                    var pos = data.pos
                    var temp = self.curRand[index]
                    item.judgeIndex = temp
                        //item.judgeNmae = self.itemList[temp]
                },
                outFun: function(data) {
                    var item = data.item
                    var pos = data.pos
                    var index = data.index
                    if (bg.judgeItem({
                            pos: pos,
                            item: item,
                            index: index,
                        })) {} else {
                        self.showList.judgeIndex(index, false)
                    }
                }
            })
            safeAdd(self, showList)
            changeFather({
                item: showList,
                father: bg,
            })
            self.showList = showList

            var btn_return = new ccui.Button(res.btn_back_normal, res.btn_back_select)
            btn_return.setPosition(70, 70)
            safeAdd(self, btn_return)
            changeFather({
                item: btn_return,
                father: bg,
            })

            btn_return.addClickEventListener(function() {
                bg.setVisible(false)
                self.bg2.setVisible(true)
            })
            self.bg3 = bg
        }
        self.bg3.setVisible(true)
    },
    showBg2: function() {
        var self = this
        if (!self.bg2) {
            var list = []
            var node = new cc.Node()
            safeAdd(self, node)
            var font = new cc.Sprite("#img_font0.png")
            font.setPosition(491, 579)
            safeAdd(node, font)
            var bg = new cc.Scale9Sprite(res.bg_biaoge_blue, cc.rect(0, 0, 78, 76), cc.rect(20, 20, 20, 20))
            bg.width = 620
            bg.height = 100
            bg.setPosition(getMiddle(-60, -250))
            node.addChild(bg)
            var start = cc.p(85, 50)
            var devide = 150
            var btnList = []
            var showIndex = function(index) {
                if (!node.inFont) {
                    var inFont = new cc.Sprite()
                    inFont.setPosition(getMiddle(-60, -180))
                    safeAdd(node, inFont)
                    node.inFont = inFont
                }
                var inFont = node.inFont
                inFont.setSpriteFrame(sprintf("img_font%d.png", index))
                if (!node.img) {
                    var img = new cc.Sprite()
                    img.setPosition(getMiddle(-60, 30))
                    safeAdd(node, img)
                    node.img = img
                }
                var img = node.img
                img.setTexture(res[sprintf("img_big%d", index)])
            }
            for (var i = 0; i < 4; i++) {
                var btn = createJudgeBtn({
                    normal: sprintf("see_chose%d_normal.png", i + 1),
                    select: sprintf("see_chose%d_select.png", i + 1),
                    frame: true,
                    judge:function(item){
                        return getLoopVis(item)
                    },
                    onlyTrue: true,
                    fun: function(item) {
                        if (btnList) {
                            for (var i = 0; i < btnList.length; i++) {
                                var inBtn = btnList[i]
                                if (inBtn != item) {
                                    inBtn.change(false, false)
                                }
                            }
                        }
                        showIndex(item.index)
                    }
                })
                btn.index = i + 1
                btn.setPosition(start.x + i * devide, start.y)
                safeAdd(bg, btn)
                btnList[i] = btn
            }
            btnList[0].change(true, true)

            var btn_test = new ccui.Button(res.btn_xcs_normal, res.btn_xcs_select)
            btn_test.setPosition(910, 508)
            safeAdd(node, btn_test)
            btn_test.addClickEventListener(function() {
                node.setVisible(false)
                    //node.removeFromParent(true)
                self.showBg3()
            })

            var btn_return = new ccui.Button(res.btn_back_normal, res.btn_back_select)
            btn_return.setPosition(70, 70)
            safeAdd(self, btn_return)

            changeFather({
                item: btn_return,
                father: node,
            })

            btn_return.addClickEventListener(function() {
                node.setVisible(false)
                self.bg1.setVisible(true)
            })
            self.bg2 = node
        }
        self.bg2.setVisible(true)
    },
    initScene: function() {
        var self = this
        var bg = loadNode(res.seejson)
        bg.setPosition(getMiddle())
        safeAdd(self.inside_node, bg)
        var size = cc.director.getWinSize()
        var lay = createLayout({
            size: size,
            op: 255,
            color: cc.color(0, 0, 0, 255),
        })
        lay.setPosition(-size.width / 2, -size.height / 2)
        safeAdd(bg, lay)
        self.cover = lay
        lay.setVisible(false)

        var font = new cc.Sprite("#see_deco3.png")

        var btn = createJudgeBtn({
            normal: "see_deco1.png",
            select: "see_deco2.png",
            frame: true,
            fun: function() {
                font.setSpriteFrame("see_deco4.png")
                var cover = self.cover
                cover.stopAllActions()
                cover.setVisible(true)
                cover.setOpacity(255)
            },
            back: function() {
                font.setSpriteFrame("see_deco3.png")
                var perTime = 0.125
                var cover = self.cover
                cover.stopAllActions()
                cover.setVisible(true)
                cover.setOpacity(255)
                cover.runAction(
                    cc.sequence(
                        cc.repeat(
                            cc.sequence(
                                cc.delayTime(perTime),
                                cc.callFunc(function() {
                                    cover.setOpacity(127)
                                }),
                                cc.delayTime(perTime),
                                cc.callFunc(function() {
                                    cover.setOpacity(255)
                                })
                            ), 4),
                        cc.delayTime(perTime),
                        cc.callFunc(function() {
                            cover.setVisible(false)
                            if (!self.showNext) {
                                self.showNext = true
                                self.nodebs.say({
                                        key: "result",
                                    })
                                    //var btn_light = new ccui.Button("#see_deco5.png", "#see_deco6.png", ccui.Widget.PLIST_TEXTURE)
                                var btn_light = createJudgeBtn({
                                        normal: "see_deco5.png",
                                        select: "see_deco6.png",
                                        frame: true,
                                        fun: function() {
                                            bg.setVisible(false)
                                                //bg.removeFromParent(true)
                                            self.showBg2()
                                        },
                                        onlyTrue: true,
                                    })
                                    // btn_light.addClickEventListener(function() {
                                    //     bg.setVisible(false)
                                    //     self.showBg2()
                                    // })
                                btn_light.setPosition(-450, 180)
                                safeAdd(bg, btn_light)
                            }
                        })
                    )
                )
            }
        })
        btn.setPosition(200, 100)
        safeAdd(btn, font)
        font.setPosition(36, 79)
        addShowType({
            item: font,
            show: "moveBackForever",
            time: 0.25,
            buf: cc.p(0, -5),
        })
        safeAdd(bg, btn)
        self.bg1 = bg
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
            img: res.see_content1, //图片和声音文件
            sound: res.see_sound1
        })
        addContent({
            people: this.nodebs,
            key: "result", //对话标签 之后让人物说话需要用到的参数
            img: res.see_content2, //图片和声音文件
            sound: res.see_sound2,
            id: "result",
            btnModify: cc.p(2, 10),
            btnScale: 0.8,
        })
        addContent({
            people: this.nodebs,
            key: "right",
            sound: res.sound_right_bs,
        })
        addContent({
            people: this.nodebs,
            key: "fault",
            sound: res.sound_fault_bs,
        })
    }
})