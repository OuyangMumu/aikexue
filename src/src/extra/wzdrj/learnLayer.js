/**
 * Created by Administrator on 2016/7/13.
 */
//@author mu @16/5/19
var learnLayer = myLayer.extend({
    sprite: null,
    needSet:false,
    changeDelete: true, //是否退出删除
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.expCtor({
            noBtn:true,
        })
        this.bg.loadTexture(res.bg_green)
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        var dataControl = self.dataControl
        var uilist = [
            "btn_home", "btn_answer", "btn_upload", "btn_retry", "judge1", "judge2",
            "btn_help"
        ]
        var bg = loadNode(res.wzdrj_learn_json, uilist, "bg")
        bg.setPosition(getMiddle(0, 20))
        safeAdd(self.inside_node, bg)
        var judge1 = bg.judge1
        var judge2 = bg.judge2
        var wzdrj_Result = [
            [0, 1, 3, 5, 6, 8],
            [2, 4, 7],
        ]
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
        var sort = function() {
            var judge = this
            var info = [{
                judge: 3,
                devidex: 150,
            }, {
                judge: 4,
                devidex: 100,
            }, {
                judge: 5,
                devidex: 70,
            }, {
                judge: 6,
                devidex: 60,
            }, {
                judge: 7,
                devidex: 50,
            }, {
                judge: 8,
                devidex: 45,
            },  {
                judge: 9,
                devidex: 37,
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
                    var devidex = judgeInfo.devidex
                    var nums = judgeInfo.judge
                    for (var i = 0; i < list.length; i++) {
                        if (list[i]) {
                            var item = list[i]
                            list[i].setPosition(cc.p(100 + count % nums * devidex, 100))
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
        judge1.answer = wzdrj_Result[0]
        judge2.answer = wzdrj_Result[1]
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
            pos: getMiddle(335, -20),
            num: 3,
            size: cc.size(160, 502),
            mix: 20,
            arrow: "white",
            color: "yellow",
            imgScale: 0.9,
            modify: cc.p(0, -30),
            arrOff: cc.p(20, -20),
            ifPage: true,
            getFun: function(data) {
                var index = data.index
                var pos = data.pos
                var tex = data.tex
                var sp = new cc.Sprite(tex)
                sp.setPosition(bg.convertToNodeSpace(pos))
                sp.setScale(1.2)
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
        bg.btn_answer.addClickEventListener(function(){
            self.nodebs.say({
                key: "result",
            })
        })
        bg.btn_retry.addClickEventListener(function(){
            judge1.clear()
            judge2.clear()
            showList.reInit({
                list:self.getRand(),
            })
        })
        bg.btn_upload.addClickEventListener(function(){
            var one = judge1.judgeAnswer()
            var two = judge2.judgeAnswer()
            var result = ((one && two) || (one && two == null) || (one == null && two))
            self.nodebs.say({
                key: result ? "right" : "fault",
                force: true,
            })
             AddDialog("Judge", {
                judge: result,
                fun:function(){
                    if(judgeMusic()){
                        stopMusic()
                    }
                }
             })
        })
        bg.btn_home.addClickEventListener(function() {
            func.changeLayer({
                out: self,
                in : layerControl.getLayer("mainLayer")
            })
        })
        bg.btn_help.addClickEventListener(function() {
            func.changeLayer({
                out: self,
                in : layerControl.getLayer("helpLayer"),
                back: "learnLayer"
            })
        })
    },

    getRand: function() {
        loadPlist("wzdrj_learnBg")
        var self = this
        var dataControl = self.dataControl
        var list = []
        var rand = getRand(9)
        dataControl.curRand = rand
        for (var i = 0; i < 9; i++) {
            list.push(sprintf("#wzdrj_learnBg%02d.png", rand[i]))
        }
        return list
    },

    dataControl:{},

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.learn_anwerImg,
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