//@author mu @16/4/27

var cldrx_Result = [
    [0, 1, 2, 6, 7, 8, 9],
    [3, 4, 5, 10, 11],
]

var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {})
        }
    },
    getRand: function() {
        var self = this
        var dataControl = self.dataControl
        var list = []
        var rand = getRand(12)
        dataControl.curRand = rand
        for (var i = 0; i <= 11; i++) {
            list.push(sprintf("#cldrx_seebg_%02d.png", rand[i]))
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
            "judge1",
            "judge2",
        ]
        var bg = loadNode(res.see_biaoge, uilist, "bg")
        bg.setPosition(getMiddle(0, 20))
        safeAdd(self.inside_node, bg)
        var judge1 = bg.judge1
        var judge2 = bg.judge2
        var judgeItem = function(data) {
            var judge = this
            var pos = data.pos
            var item = data.item
            var result = judgeInside({
                item: judge,
                pos: pos,
            })
            if (!result) {
                return false
            }
            var index = data.index
            if (!judge.list) {
                judge.list = []
            }
            if (result) {
                item.father = judge
                judge.list.push(item)
                judge.sort()
                return true
            }
        }
        var clear = function() {
            var judge = this
            if (judge.list) {
                var list = judge.list
                for (var i = 0; i < list.length; i++) {
                    list[i].removeFromParent(true)
                    list[i] = null
                }
                judge.list = null
            }
        }
        var del = function(item) {
            var judge = this
            if (judge.list) {
                var list = judge.list
                for (var i = 0; i < list.length; i++) {
                    if (list[i].index == item.index) {
                        list.splice(i, 1)
                        judge.sort()
                        return
                    }
                }
            }
        }
        var judgeAnswer = function() {
            var judge = this
            if (judge.list) {
                var list = judge.list
                var temp = []
                for (var i = 0; i < list.length; i++) {
                    temp.push(list[i].judgeIndex)
                }
                var contain = function(src) {
                    var answer = judge.answer
                    for (var i = 0; i < answer.length; i++) {
                        if (answer[i] == src) {
                            return true
                        }
                    }
                    return false
                }
                temp = listOrder(temp)
                if (temp.length > 0) {
                    for (var i = 0; i < temp.length; i++) {
                        if (!contain(temp[i])) {
                            return false
                        }
                    }
                    return true
                } else {
                    return null
                }
            }
            return null
        }
        var sort = function() {
            var judge = this
            var info = [{
                judge: 6,
                start: cc.p(70, 380),
                devidex: 180,
                devidey: 150,
                nums: 2,
            }, {
                judge: 9,
                start: cc.p(70, 380),
                devidex: 100,
                devidey: 150,
                nums: 3,
            }, {
                judge: 12,
                start: cc.p(70, 380),
                devidex: 70,
                devidey: 150,
                nums: 4,
            }]
            if (judge.list) {
                var count = 0
                var list = judge.list
                var judgeInfo = null
                for (var i = 0; i < info.length; i++) {
                    if (list.length <= info[i].judge) {
                        judgeInfo = info[i]
                        break
                    }
                }
                if (judgeInfo) {
                    var start = judgeInfo.start
                    var devidex = judgeInfo.devidex
                    var devidey = judgeInfo.devidey
                    var nums = judgeInfo.nums
                    for (var i = 0; i < list.length; i++) {
                        if (list[i]) {
                            var item = list[i]
                            list[i].setPosition(cc.p(start.x + count % nums * devidex, start.y - Math.floor(count / nums) * devidey))
                            safeAdd(judge, item)
                            count++
                        }
                    }
                }
            } else {
                return
            }
        }
        judge1.judgeItem = judgeItem
        judge2.judgeItem = judgeItem
        judge1.sort = sort
        judge2.sort = sort
        judge1.del = del
        judge2.del = del
        judge1.answer = cldrx_Result[0]
        judge2.answer = cldrx_Result[1]
        judge1.clear = clear
        judge2.clear = clear
        judge1.judgeAnswer = judgeAnswer
        judge2.judgeAnswer = judgeAnswer

        var judgeAll = function(data) {
            var pos = data.pos
            var item = data.item
            var index = data.index
            var judgeList = [
                judge1,
                judge2
            ]
            var temp = false
            for (var i = 0; i < judgeList.length; i++) {
                var result = judgeList[i].judgeItem({
                    pos: pos,
                    item: item,
                    index: item.judgeIndex,
                })
                if (result) {
                    temp = true
                    createTouchEvent({
                        item: item,
                        autoMove: true,
                        begin: function(data) {
                            var item = data.item
                            var pos = data.pos
                            if (item.father) {
                                item.father.del(item)
                            }
                            item.setPosition(bg.convertToNodeSpace(pos))
                            safeAdd(bg, item)
                            return true
                        },
                        end: function(data) {
                            var item = data.item
                            var pos = data.pos
                            judgeAll({
                                item: item,
                                pos: pos,
                                index: item.index,
                            })
                        }
                    })
                    break
                }
            }
            if (!temp) {
                dataControl.showList.judgeIndex(index, false)
                item.removeFromParent(true)
            }
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
            imgScale: 1.5,
            modify: cc.p(0, -30),
            arrOff: cc.p(20, -20),
            ifPage: true,
            getFun: function(data) {
                var index = data.index
                var pos = data.pos
                var tex = data.tex
                var sp = new cc.Sprite(tex)
                sp.setPosition(bg.convertToNodeSpace(pos))
                sp.setScale(1.5)
                safeAdd(bg, sp)
                sp.index = index
                sp.judgeIndex = dataControl.curRand[index]
                return sp
            },
            outFun: function(data) {
                var item = data.item
                var pos = data.pos
                var index = data.index
                judgeAll({
                    item: item,
                    pos: pos,
                    index: index,
                })
            }
        })
        bg.addChild(showList)
        dataControl.showList = showList
        bg.btn_retry.setVisible(false)
        bg.btn_retry.addClickEventListener(function() {
            judge1.clear()
            judge2.clear()
            showList.reInit({
                list: self.getRand(),
            })
        })
        setOff(bg.btn_answer, cc.p(100, 0))
        bg.btn_answer.addClickEventListener(function() {
            self.nodebs.say({
                key: "result",
            })
        })
        setOff(bg.btn_upload, cc.p(100, 0))
        bg.btn_upload.addClickEventListener(function() {
            var one = judge1.judgeAnswer()
            var two = judge2.judgeAnswer()
            var result = ((one && two) || (one && two == null) || (one == null && two))
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
            img: res.cldrx_see2_result,
            id: "result",
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
        this.nodebs.setVisible(false)
    }
})