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
        var self = this
        if (this.nodebs) {
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "do1_sound1",
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
        var self = this
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    showNext: function() {
        var self = this
        var start = cc.p(100, 420)
        var devide = 60

        for (var i = 0; i < 3; i++) {
            var tex = sprintf("#swl_do_%02d.png", 23 + i)
            var img = new cc.Sprite(tex)
            img.tex = tex
            img.index = i
            img.setPosition(start.x, start.y - devide * i)
            safeAdd(self, img)
            createTouchEvent({
                item: img,
                begin: function(data) {
                    var item = data.item
                    if (!self.finalJudge) {
                        var cur = new cc.Sprite(item.tex)
                        cur.setPosition(data.pos)
                        safeAdd(self, cur)
                        item.cur = cur
                        cur.index = item.index
                        return true
                    }
                    return false
                },
                move: function(data) {
                    var item = data.item.cur
                    var delta = data.delta
                    if (item) {
                        item.x += delta.x
                        item.y += delta.y
                    }
                },
                end: function(data) {
                    var item = data.item.cur
                    self.judgeAll(item)
                    item.cur = null
                }
            })
        }
    },
    initScene: function() {
        var self = this

        var resultbtn = new ccui.Button(res.btn_jielun_normal, res.btn_jielun_select)
        this.addChild(resultbtn)
        resultbtn.setPosition(1010, 450)
        resultbtn.addClickEventListener(function() {
            self.nodebs.say({
                key: "do1_sound4",
                force: true,
            })
        })

        var uilist = [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
        ]

        var finalList = [
            "item0",
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
        ]


        var bg = loadNode(res.swl_do, finalList, "bg")
        safeAdd(self, bg)

        var finalAnswer = [2, 0, 1, 1, 1, 1, 1]

        self.judgeAll = function(add) {
            var judgeAdd = false
            for (var i = 0; i < finalList.length; i++) {
                var item = bg[finalList[i]]
                if (!item.add) {
                    item.add = function(initem) {
                        var item = this
                        var result = judgeItemCrash({
                            item1: initem,
                            item2: item
                        })
                        if (result) {
                            if (item.item) {
                                item.item.removeFromParent(true)
                            }
                            item.item = initem
                            initem.father = item
                            var size = item.getContentSize()
                            initem.setPosition(size.width / 2, size.height / 2)
                            safeAdd(item, initem)

                            createTouchEvent({
                                item: initem,
                                begin: function(data) {
                                    if (!self.finalJudge) {
                                        var item = data.item
                                        item.father.item = null
                                        item.father = null
                                        changeFather({
                                            item: item,
                                            father: self,
                                        })
                                        return true
                                    }
                                    return false
                                },
                                autoMove: true,
                                end: function(data) {
                                    self.judgeAll(data.item)
                                }
                            })
                        }
                        return result
                    }
                }
                if (item.add(add)) {
                    judgeAdd = true
                    break
                }
            }
            if (!judgeAdd) {
                add.removeFromParent(true)
            }
            var finalJudge = true
            for (var i = 0; i < finalList.length; i++) {
                var item = bg[finalList[i]]
                if (item.item) {
                    if (item.item.index != finalAnswer[i]) {
                        finalJudge = false
                        break
                    }
                } else {
                    finalJudge = false
                    break
                }
            }
            if (finalJudge) {
                self.finalJudge = true
                if (!self.hasShowdia) {
                    self.hasShowdia = true
                    AddDialog("Judge", {
                        judge: finalJudge,
                        sound: "student",
                        fun: function() {
                            self.hasShowdia = false
                        }
                    })
                }
            }
        }

        var answerList = [
            12, 13, 24, 25, 26, 34, 36, 56,
        ]
        var judgeList = [
            false, false, false, false, false, false, false, false,
        ]

        for (var i = 10; i < 70; i++) {
            var img = bg.getChildByName(sprintf("img%d", i))
            if (img) {
                img.setVisible(false)
            }
        }
        var judge1 = null
        var judge2 = null
        var addLink = function(index) {
            if (!judge1) {
                judge1 = index
            } else {
                if (!judge2) {
                    judge2 = index
                }
            }
            if (judge1 && judge2) {
                bg.clear()
                if (judge1 != judge2) {
                    var final = judge1 * 10 + judge2
                    var inJudge = false
                    var img = bg.getChildByName(sprintf("img%d", final))
                    for (var i = 0; i < answerList.length; i++) {
                        if (answerList[i] == final) {
                            inJudge = true
                            if (!img.isVisible()) {
                                img.setVisible(true)
                                judgeList[i] = true
                                playEffect(res.zswd_right)
                            }
                            break
                        }
                    }
                    if (!inJudge && img) {
                        playEffect(res.zswd_wrong)
                        addShowType({
                            item: img,
                            show: "blink",
                            time: 1.0,
                            count: 3,
                        })
                        var item1 = bg[sprintf("item%d", judge1)].show
                        var item2 = bg[sprintf("item%d", judge2)].show
                        addShowType({
                            item: item1,
                            show: "blink",
                            time: 1.0,
                            count: 3,
                        })

                        addShowType({
                            item: item2,
                            show: "blink",
                            time: 1.0,
                            count: 3,
                        })
                    }
                    judge1 = null
                    judge2 = null
                    var inJudge = true
                    for (var i = 0; i < judgeList.length; i++) {
                        if (!judgeList[i]) {
                            inJudge = false
                            break
                        }
                    }
                    if (inJudge) {
                        self.finishLink = true
                        self.nodebs.say({
                            key: "do1_sound3",
                            force: true,
                        })
                        AddDialog("Tips", {
                            res: res.do1_content3,
                            face: 1,
                            closeBack: function() {
                                self.nodebs.say({
                                    key: "do1_sound2",
                                    force: true,
                                })
                                self.showNext()
                            }
                        })
                    }
                } else {
                    judge1 = null
                    judge2 = null
                }
            }
        }

        for (var i = 0; i < uilist.length; i++) {
            var item = bg[uilist[i]]
            item.show = item.getChildByName("show")
            item.show.setVisible(false)
            item.index = i + 1
            createTouchEvent({
                item: item,
                begin: function() {
                    return !self.finishLink
                },
                end: function(data) {
                    var item = data.item
                    item.show.setVisible(true)
                    addLink(item.index)
                }
            })
        }
        bg.clear = function() {
            var bg = this
            for (var i = 0; i < uilist.length; i++) {
                var item = bg[uilist[i]]
                item.show.setVisible(false)
            }
        }
        self.finishLink = false
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 4; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("do1_sound%d", i + 1), //对话标签 之后让人物说话需要用到的参数
                img: i == 2 ? null : res[sprintf("do1_content%d", i + 1)], //图片和声音文件
                sound: res[sprintf("do1_sound%d", i + 1)],
                id: i == 3 ? "result" : "normal",
            })
        }
    }
})