//@author mu @14/5/10

var situation = {
    NOTHING: 0,
    NEW: 1,
    SWAPOUT: 2,
    CHANGE: 3,
    SWAPIN: 4,
}

var answer = [
    [1, 4],
    [1, 4],
    [2, 5],
    [2, 5],
    [3, 6],
    [3, 6],
]

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    getRand: function() {
        var self = this
        var list = []
        var max = 6
        var rand = getRand(max)
        for (var i = 0; i < max; i++) {
            list.push(sprintf("#sydcb_small_%02d.png", rand[i] + 2))
        }
        for (var i = 0; i < 3; i++) {
            list.push(sprintf("#sydcb_small_%02d.png", 1))
        }
        self.curRand = rand
        return list
    },
    judgeAll: function(data) {
        var self = this
        var bg = self.second.biaoge
        var list = [
            bg.judge1,
            bg.judge2,
            bg.judge3,
            bg.judge4,
            bg.judge5,
            bg.judge6,
        ]
        for (var i = 0; i < list.length; i++) {
            if (list[i] && judgeInside({
                    item: list[i],
                    pos: data.pos,
                })) {
                var item = data.item
                var result = list[i].addImg(item)
                self.refresh()
                return result
            }
        }
        return false
    },
    refresh: function(judge) {
        var self = this
        var bg = self.second.biaoge
        var list = [
            bg.judge1,
            bg.judge2,
            bg.judge3,
            bg.judge4,
            bg.judge5,
            bg.judge6,
        ]
        for (var i = 0; i < list.length; i++) {
            if (judge) {
                list[i].inside = null
            }
            list[i].changeInside()
        }
    },
    judgeNew: function(pos) {
        var self = this
        var imgList = self.imgList
        for (var i = 0; i < imgList.length; i++) {
            var img = imgList[i]
            if (!img.isVisible() && img.x == pos.x && img.y == pos.y) {
                img.setVisible(true)
                return
            }
        }
    },
    judgeAnswer: function() {
        var self = this
        var bg = self.second.biaoge
        var list = [
            bg.judge1,
            bg.judge2,
            bg.judge3,
            bg.judge4,
            bg.judge5,
            bg.judge6,
        ]
        for (var i = 0; i < list.length; i++) {
            var rect = list[i]
            var result = false
            if (rect.inside) {
                var index = self.curRand[rect.inside.index] + 1
                var curAnswer = answer[i]
                for (var j = 0; j < curAnswer.length; j++) {
                    if (curAnswer[j] == index) {
                        result = true
                        break
                    }
                }
            }
            rect.showResult(result)
        }
    },
    clearAnswer: function() {
        var self = this
        var bg = self.second.biaoge
        var list = [
            bg.judge1,
            bg.judge2,
            bg.judge3,
            bg.judge4,
            bg.judge5,
            bg.judge6,
        ]
        for (var i = 0; i < list.length; i++) {
            var rect = list[i]
            if (rect.answerImg) {
                rect.answerImg.setVisible(false)
            }
        }
    },
    reInitImg: function() {
        var self = this
        if (self.imgList) {
            var imgList = self.imgList
            for (var i = 0; i < imgList.length; i++) {
                imgList[i].removeFromParent(true)
            }
        }
        self.refresh(true)
        self.clearAnswer()
        self.imgList = []
        var imgList = self.imgList
        self.texList = self.getRand()
        var texList = self.texList
        var startPos = cc.p(300, 90)
        var devide = cc.p(0, -125)
        var bg = self.second
        for (var i = 0; i < texList.length; i++) {
            var img = new cc.Sprite(texList[i])
            img.tex = texList[i]
            img.rootPos = cc.p(startPos.x + devide.x * (i % 3), startPos.y + devide.y * (i % 3))
            if (i >= 3) {
                img.setVisible(false)
            }
            img.index = i
            img.setPosition(img.rootPos)
            imgList[imgList.length] = img
            img.showBig = function() {
                var img = this
                var index = self.curRand[img.index]
                if (!bg.big) {
                    var big = new cc.Sprite("#sydcb_big_bg.png")
                    big.setPosition(getMiddle())
                    safeAdd(self, big)
                    changeFather({
                        item: big,
                        father: bg,
                    })
                    bg.big = big
                }
                var big = bg.big
                if (big.inside) {
                    big.inside.setSpriteFrame(sprintf("sydcb_big_%02d.png", index + 1))
                } else {
                    var inside = new cc.Sprite(sprintf("#sydcb_big_%02d.png", index + 1))
                    big.inside = inside
                    inside.setPosition(288, 221)
                    safeAdd(big, inside)
                    createTouchEvent({
                        item: big,
                        begin: function(data) {
                            var item = data.item
                            return item.isVisible()
                        },
                        end: function(data) {
                            var item = data.item
                            item.setVisible(false)
                        }
                    })
                }
                big.setVisible(true)
            }
            safeAdd(bg, img)
            if (i < 6) {
                createTouchEvent({
                    item: img,
                    begin: function(data) {
                        var item = data.item
                        var pos = data.pos
                        if (!item.isVisible()) {
                            return false
                        }
                        self.clearAnswer()
                        if (!item.select) {
                            var select = new cc.Sprite(item.tex)
                            item.select = select
                            safeAdd(self, select)
                        }
                        var select = item.select
                        select.setPosition(pos)
                        if (!item.father) {
                            item.setOpacity(127)
                        } else {
                            select.setPosition(getWorldPos(item))
                            select.setScale(0.9)
                        }
                        select.setOpacity(127)
                        select.setVisible(true)
                        item.ifMove = false
                        return true
                    },
                    move: function(data) {
                        var item = data.item.select
                        var delta = data.delta
                        item.x += delta.x
                        item.y += delta.y
                        data.item.ifMove = true
                    },
                    end: function(data) {
                        var item = data.item
                        if (!item.ifMove && item.father) {
                            item.showBig()
                            item.select.setVisible(false)
                        } else {
                            var result = self.judgeAll({
                                item: item,
                                pos: data.pos,
                            })
                            if (!result) {
                                item.select.setVisible(false)
                                item.setOpacity(255)
                            } else {
                                switch (result) {
                                    case situation.NEW:
                                        self.judgeNew(item.rootPos)
                                        break
                                }
                            }
                        }
                    }
                })
            }
        }
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        var node = self.initPages({
            changeFun:function(){
                stopMusic()
            },
            imgs: [
                function() {
                    var bg = new cc.Node()
                    var img = new cc.Sprite(res.learn_font1)
                    img.setPosition(0, 120)
                    safeAdd(bg, img)
                    var list = [{
                        type: "red",
                        pos: cc.p(-170, -100),
                        music: res.learn_sound1
                    }, {
                        type: "green",
                        pos: cc.p(170, -100),
                        music: res.learn_sound2
                    }, ]
                    for (var i = 0; i < list.length; i++) {
                        var syj = createSYJ(list[i])
                        safeAdd(bg, syj)
                    }
                    return bg
                },
                function() {
                    loadPlist("sydcb_small_big")
                    var bg = new cc.Node()
                    self.second = bg
                    var img = new cc.Sprite(res.learn_font2)
                    img.setPosition(0, 185)
                    safeAdd(bg, img)

                    var uilist = [
                        "btn_upload",
                        "btn_redo",
                    ]

                    var judgeList = [
                        "judge1",
                        "judge2",
                        "judge3",
                        "judge4",
                        "judge5",
                        "judge6",
                    ]

                    var addImg = function(item) {
                        var rect = this
                        var size = rect.getContentSize()
                        var father = null
                        var pos = cc.p(size.width / 2, size.height / 2)
                        var result = situation.NOTHING
                        if (item) {
                            if (!rect.inside) {
                                rect.inside = item
                                result = situation.NEW
                                if (item.father) {
                                    result = situation.CHANGE
                                    item.father.inside = null
                                }
                            } else {
                                if (item.father) {
                                    father = item.father
                                    father.inside = rect.inside
                                    rect.inside = item
                                    result = situation.SWAPIN
                                } else {
                                    var inside = rect.inside
                                    inside.father = null
                                    inside.rootPos = item.rootPos
                                    inside.setPosition(item.rootPos)
                                    safeAdd(bg, inside)
                                    rect.inside = item
                                    result = situation.SWAPOUT
                                }
                            }
                        } else {
                            if (!rect.question) {
                                var question = new cc.Sprite("#sydcb_learn_bg03.png")
                                question.setPosition(pos)
                                safeAdd(rect, question)
                                rect.question = question
                            }
                        }
                        return result
                    }

                    var changeInside = function() {
                        var rect = this
                        if (rect.inside) {
                            var size = rect.getContentSize()
                            var pos = cc.p(size.width / 2, size.height / 2)
                            var inside = rect.inside
                            inside.father = rect
                            inside.setPosition(pos)
                            safeAdd(rect, inside)
                            if (rect.question) {
                                rect.question.setVisible(false)
                            }
                            rect.inside.setOpacity(255)
                            if (rect.inside.select) {
                                rect.inside.select.setVisible(false)
                            }
                        } else {
                            if (rect.question) {
                                rect.question.setVisible(true)
                            }
                        }
                    }

                    var showResult = function(judge) {
                        var rect = this
                        if (!rect.answerImg) {
                            var size = rect.getContentSize()
                            var pos = cc.p(size.width / 2, size.height / 2)
                            var img = new cc.Sprite(sprintf("#img_%s.png", judge ? "correct" : "fault"))
                            img.setLocalZOrder(10)
                            img.setPosition(pos)
                            safeAdd(rect, img)
                            rect.answerImg = img
                        } else {
                            var answerImg = rect.answerImg
                            answerImg.setSpriteFrame(sprintf("img_%s.png", judge ? "correct" : "fault"))
                        }
                        var answerImg = rect.answerImg
                        answerImg.setVisible(true)
                        answerImg.stopAllActions()
                        addShowType({
                            item: answerImg,
                            show: "scale",
                            time: 0.2,
                        })
                    }

                    var biaoge = loadNode(res.sydcb_learn_bg, uilist, "bg")
                    loadList(biaoge, judgeList)

                    biaoge.btn_redo.addClickEventListener(function() {
                        self.reInitImg()
                    })

                    biaoge.btn_upload.addClickEventListener(function(){
                        self.judgeAnswer()
                    })

                    for (var i = 0; i < judgeList.length; i++) {
                        var rect = biaoge[judgeList[i]]
                        rect.addImg = addImg
                        rect.changeInside = changeInside
                        rect.showResult = showResult
                        rect.addImg()
                    }

                    biaoge.setScale(0.9)
                    biaoge.setPosition(-80, -35)
                    bg.biaoge = biaoge
                    safeAdd(bg, biaoge)

                    self.reInitImg()

                    return bg
                },
            ],
            titles: [
                res.title1,
                res.title2,
            ],
            titleModify: cc.p(0, 7)
        })
        self.addChild(node)
        return true
    },
    dataControl: {},
})