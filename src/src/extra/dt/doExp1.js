//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show()
        }
    },
    getRand: function() {
        var self = this
        var dataControl = self.dataControl
        var list = []
        var rand = getRand(15)
        var templist = [
            2, 4, 5, 7, 8,
            9, 10, 11, 12, 13,
            14, 15, 16, 17, 18
        ]
        dataControl.curRand = rand
        for (var i = 0; i < 15; i++) {
            list.push(sprintf("#dt_bg_%02d.png", templist[rand[i]]))
        }
        return list
    },
    dataControl: {},
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        var uilist = [
            "btn_answer",
            "btn_upload",
            "btn_retry",
        ]
        var judgeList = []
        for (var i = 0; i < 15; i++) {
            uilist[uilist.length] = sprintf("judge%d", i + 1)
            judgeList[i] = sprintf("judge%d", i + 1)
        }
        var bg = loadNode(res.do_json, uilist, "bg")
        bg.setPosition(getMiddle(0, 20))
        safeAdd(self.inside_node, bg)
        
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
                //item.setScale(0.75)
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
            createTouchEvent({
                item: item,
                autoMove: true,
                begin: function(data) {
                    var item = data.item
                    var pos = data.pos
                    item.setPosition(pos)
                    item.setLocalZOrder(9999)
                    safeAdd(self, item)
                        //item.setScale(1.2)
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
            scale: 1,
            list: self.getRand(),
            pos: getMiddle(320, -20),
            num: 3,
            size: cc.size(171, 502),
            mix: 20,
            arrow: "white",
            color: "yellow",
            imgScale: 1.0,
            modify: cc.p(0, -30),
            arrOff: cc.p(20, -20),
            ifPage: true,
            getFun: function(data) {
                var index = data.index
                var pos = data.pos
                var tex = data.tex
                var sp = new cc.Sprite(tex)
                sp.setPosition(bg.convertToNodeSpace(pos))
                sp.setScale(0.55)
                safeAdd(bg, sp)
                sp.index = index
                sp.judgeIndex = dataControl.curRand[index]
                return sp
            },
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
        dataControl.showList = showList
        self.showList = showList
        bg.btn_retry.setVisible(false)
        setOff(bg.btn_answer, cc.p(100, 0))
        bg.btn_answer.addClickEventListener(function() {
            self.nodebs.say({
                key: "result",
            })
        })
        setOff(bg.btn_upload, cc.p(100, 0))
        var judgeAns = function() {
            var ifNull = true
            var final = true
            for (var i = 0; i < judgeList.length; i++) {
                var judge = bg[judgeList[i]]
                if (judge && judge.item) {
                    ifNull = false
                    break
                }
            }
            if (ifNull) {
                final = false
            } else {
                for (var i = 0; i < judgeList.length; i++) {
                    var judge = bg[judgeList[i]]
                    if (judge && judge.item && judge.item.judgeIndex != i) {
                        final = false
                        break
                    }
                }
            }
            return final
        }
        bg.btn_upload.addClickEventListener(function() {
            var result = judgeAns()
            self.nodebs.say({
                key: result ? "right" : "fault",
                force: true,
            })
            AddDialog("Judge", {
                judge: result,
            })
        })
    },
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor({
                btnOff: cc.p(135, 1)
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        this.initScene()
        this.initPeople()
        return true
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do1_result,
            id: "result",
        })
        addContent({
            people: this.nodebs,
            key: "right",
            sound: res.sound_right,
        })
        addContent({
            people: this.nodebs,
            key: "fault",
            sound: res.sound_fault,
        })
        this.nodebs.setVisible(false)
    }
})