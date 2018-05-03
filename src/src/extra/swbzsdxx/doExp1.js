//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
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
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
                })
            })
        }
    },
    getRand: function() {
        var self = this
        var dataControl = self.dataControl
        var list = []
        var rand = getRand(5)
        self.curRand = rand
        for (var i = 0; i < 5; i++) {
            list.push(sprintf("#swbz_bg_%02d.png", rand[i] + 1))
        }
        return list
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor() //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        var judgeList = [
            "judge1",
            "judge2",
            "judge3",
            "judge4",
            "judge5",
        ]
        var resultList = [13, 16, 19, 7, 10]
        var bg = createBiaoge({
            json: res.swbz_bg,
            inputNum: 15,
            disJudgeInput: true,
            strlen: 2,
            inputSize: 20,
            downData: {
                nums: 10,
                bufs: [
                    [null, "#swbz_bg_06.png", "#swbz_bg_09.png", "#swbz_bg_11.png", "#swbz_bg_15.png", "#swbz_bg_18.png"],
                    [null, "#swbz_bg_17.png", "#swbz_bg_20.png", "#swbz_bg_21.png"],
                    [null, "#swbz_bg_06.png", "#swbz_bg_09.png", "#swbz_bg_11.png", "#swbz_bg_15.png", "#swbz_bg_18.png"],
                    [null, "#swbz_bg_17.png", "#swbz_bg_20.png", "#swbz_bg_21.png"],
                    [null, "#swbz_bg_06.png", "#swbz_bg_09.png", "#swbz_bg_11.png", "#swbz_bg_15.png", "#swbz_bg_18.png"],
                    [null, "#swbz_bg_17.png", "#swbz_bg_20.png", "#swbz_bg_21.png"],
                    [null, "#swbz_bg_06.png", "#swbz_bg_09.png", "#swbz_bg_11.png", "#swbz_bg_15.png", "#swbz_bg_18.png"],
                    [null, "#swbz_bg_17.png", "#swbz_bg_20.png", "#swbz_bg_21.png"],
                    [null, "#swbz_bg_06.png", "#swbz_bg_09.png", "#swbz_bg_11.png", "#swbz_bg_15.png", "#swbz_bg_18.png"],
                    [null, "#swbz_bg_17.png", "#swbz_bg_20.png", "#swbz_bg_21.png"],
                ],
            },
            resultFun: function() {
                if (!self.resultBg) {
                    var img = createShowImg({
                        img: "#swbz_bg_12.png",
                        bgInfo: {
                            posOff: cc.p(-10, 0)
                        }
                    })
                    safeAdd(self, img)
                    self.resultBg = img
                }
                self.resultBg.show()
            },
            initFinal: function(final) {
                if (final.inside) {
                    var inside = final.inside
                    inside.removeFromParent(true)
                }
                var bg = self.bg
                if (bg) {
                    var start = cc.p(136, 207)
                    var inside = new cc.Node()
                    var indexList = [0, 1, 2, 3, 4]

                    var tempList = []
                    for (var i = 0; i < judgeList.length; i++) {
                        var judge = bg[judgeList[i]]
                        if (judge && judge.item) {
                            tempList[i] = judge.item.index
                            for (var j = 0; j < indexList.length; j++) {
                                if (indexList[j] == judge.item.index) {
                                    indexList.splice(j, 1)
                                    break
                                }
                            }
                        } else {
                            tempList[i] = null
                        }
                    }
                    var count = 0
                    for (var i = 0; i < tempList.length; i++) {
                        if (tempList[i] == null) {
                            tempList[i] = indexList[count]
                            count++
                        }
                    }
                    for (var i = 0; i < tempList.length; i++) {
                        var sp = new cc.Sprite(sprintf("#swbz_bg_%02d.png", resultList[self.curRand[tempList[i]]]))
                        sp.setPosition(start.x + i * 113, start.y)
                        safeAdd(inside, sp)
                    }
                    final.inside = inside
                    safeAdd(final, inside)
                }
            },
            scale: 0.9,
        })
        var inputKeys = [
            ["3", "12", "18"],
            ["4", "5", "21"],
            ["4", "6", "5"],
            ["4", "6", "28"],
            ["4", "4", "26"],
        ]
        var downAnswerList = [
            [1, 1],
            [4, 2],
            [2, 1],
            [5, 3],
            [3, 1],
        ]
        bg.setUpLoad(function() {
            if (!self.showNext) {
                self.nodebs.say({
                    key: "Next",
                    force: true,
                })
                self.showNext = true
            }
            for (var i = 0; i < judgeList.length; i++) {
                var judge = bg[judgeList[i]]
                var down1 = bg[sprintf("down%d", i * 2 + 1)]
                var down2 = bg[sprintf("down%d", i * 2 + 2)]
                if (judge && judge.item) {
                    down1.key = downAnswerList[self.curRand[judge.item.index]][0]
                    down2.key = downAnswerList[self.curRand[judge.item.index]][1]
                } else {
                    down1.key = null
                    down2.key = null
                }
            }
            if (!self.correctList) {
                self.correctList = []
                var start = cc.p(230, 200)
                for (var i = 0; i < 5; i++) {
                    var sp = new cc.Sprite("#img_correct.png")
                    sp.setPosition(start.x + i * 125, start.y)
                    safeAdd(bg, sp)
                    self.correctList[self.correctList.length] = sp
                    sp.setVisible(false)
                }
            }
            for (var i = 0; i < judgeList.length; i++) {
                var judge = bg[judgeList[i]]
                var input1 = bg[sprintf("input%d", i * 3 + 1)].getStr()
                var input2 = bg[sprintf("input%d", i * 3 + 2)].getStr()
                var input3 = bg[sprintf("input%d", i * 3 + 3)].getStr()
                if (input1 != "" || input2 != "" || input3 != "") {
                    self.correctList[i].setVisible(true)
                    if (judge && judge.item) {
                        var info = inputKeys[self.curRand[judge.item.index]]
                        if ((input1 != "" && input1 != info[0]) ||
                            (input2 != "" && input2 != info[1]) ||
                            (input3 != "" && input3 != info[2])) {
                            self.correctList[i].setSpriteFrame("img_fault.png")
                        } else {
                            self.correctList[i].setSpriteFrame("img_correct.png")
                        }
                    } else {
                        self.correctList[i].setSpriteFrame("img_fault.png")
                    }
                } else {
                    self.correctList[i].setVisible(false)
                }
            }
        })
        setOff(bg, cc.p(-100, -20))
        self.bg = bg
        loadList(bg, judgeList)
        var judgeAll = function(data) {
            for (var i = 0; i < judgeList.length; i++) {
                var judge = bg[judgeList[i]]
                var result = judgeInside({
                    item: judge,
                    pos: data.pos
                })
                if (result) {
                    var item = data.item
                    if (!judge.addItem) {
                        judge.addItem = addItem
                    }
                    judge.addItem(item)
                    return true
                }
            }
            return false
        }
        var addItem = function(item, disNeed) {
            var judge = this
            disNeed = disNeed || false
            var size = judge.getContentSize()
            item.setPosition(size.width / 2, size.height / 2)
            item.setScale(0.75)
            if (!disNeed) {
                if (judge.item) {
                    if (item.father) {
                        //交换位置
                        var pastFather = item.father
                        item.father.addItem(judge.item, true)
                    } else {
                        //原有的返回 替换新的
                        var itemInside = judge.item
                        self.showList.judgeIndex(itemInside.index, false)
                        itemInside.removeFromParent(true)
                    }
                } else {
                    if (item.father) {
                        item.father.item = null
                    }
                }
            }
            item.father = judge
            judge.item = item
            if (!item.bigBtn) {
                var btn = new ccui.Button(res.btn_add_normal, res.btn_add_select)
                var size = item.getContentSize()
                btn.setPosition(size.width, 0)
                btn.setAnchorPoint(1, 0)
                btn.setScale(0.9)
                safeAdd(item, btn)
                btn.index = item.index
                item.bigBtn = btn
                btn.addClickEventListener(function() {
                    if (!btn.img) {
                        var img = createShowImg({
                            img: res[sprintf("img_big%d", self.curRand[btn.index] + 1)]
                        })
                        safeAdd(self, img)
                        btn.img = img
                    }
                    btn.img.show()
                })
            } else {
                item.bigBtn.setVisible(true)
            }
            createTouchEvent({
                item: item,
                autoMove: true,
                begin: function(data) {
                    var item = data.item
                    var pos = data.pos
                    item.setPosition(pos)
                    item.setLocalZOrder(9999)
                    safeAdd(self, item)
                    item.setScale(1.2)
                    if (item.bigBtn) {
                        item.bigBtn.setVisible(false)
                    }
                    return true
                },
                end: function(data) {
                    var item = data.item
                    var pos = data.pos
                    var index = item.index
                    var result = judgeAll({
                        item: item,
                        pos: pos,
                        index: index,
                    })
                    if (!result) {
                        if (judgeInside({
                                item: self.showList,
                                pos: pos,
                            })) {
                            item.father.item = null
                            item.removeFromParent(true)
                            self.showList.judgeIndex(index, false)
                        } else {
                            item.father.addItem(item)
                        }
                    }
                }
            })
            safeAdd(judge, item)
        }

        var showList = createList({
            scale: 1.2,
            type: "H",
            list: self.getRand(),
            pos: getMiddle(-160, 120),
            num: 3,
            size: cc.size(600, 100),
            mix: 20,
            arrOff: cc.p(20, 0),
            color: "orange",
            arrow: "yellow",
            outFun: function(data) {
                var item = data.item
                var pos = data.pos
                var index = data.index
                var result = judgeAll({
                    item: item,
                    pos: pos,
                    index: index,
                })
                if (!result) {
                    self.showList.judgeIndex(index, false)
                }
            }
        })
        bg.addChild(showList)
        self.showList = showList
        safeAdd(self, bg)
        return true
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
            key: "Show",
            img: res.do_content1,
            sound: res.do_sound1
        })
        addContent({
            people: this.nodebs,
            key: "Next",
            img: res.do_content2,
            sound: res.do_sound2
        })
    }
})