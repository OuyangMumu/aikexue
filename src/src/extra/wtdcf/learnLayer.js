//@author mu @16/5/19

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "learnLayer",
    load: function() {
        loadPlist("learn_nums")
        loadPlist("learn_json")
    },
    getRand: function() {
        var self = this
        var list = []
        var rand = getRand(17)
        self.curRand = rand
        for (var i = 0; i < 17; i++) {
            list.push(sprintf("#wtdcf_learn_%02d.png", rand[i] + 2))
        }
        return list
    },
    ctor: function() {
        this._super()
        this.load()
        this.learnCtor()
        var self = this
        self.img_title.loadTexture(res.img_learn_title)
        self.img_title.setContentSize(getSize(res.img_learn_title))
        setOff(self.img_title, cc.p(0, 5))
        self.img_page.setVisible(false)
        var bg = createBiaoge({
            json: res.learn_json_bg,
        })
        bg.setPosition(getMiddle(-110, -30))
        bg.setScale(1.0)
        safeAdd(self, bg)

        self.answer = [
            [3, 5, 6, 8, 11, 12, 13, 14, 15, 16, ], //沉
            [2, 4, 7, 9, 10, 17, 18], //浮
        ]

        var showList = createList({
            scale: 1,
            list: self.getRand(),
            pos: getMiddle(400, -70),
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
                safeAdd(bg, sp)
                sp.index = index
                sp.judgeIndex = self.curRand[index] + 2
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
        bg.linkAnswer = function() {
            if (!self.resultBg) {
                var img = createShowImg({
                    img: "#wtdcf_learn_01.png",
                    bgInfo: {
                        posOff: cc.p(-10, 0)
                    }
                })
                safeAdd(self, img)
                self.resultBg = img
            }
            self.resultBg.show()
        }

        bg.linkRetry = function() {
            if (self.refreshCall) {
                self.refreshCall()
            }
        }

        var list = [
            "judge1",
            "judge2"
        ]

        loadList(bg, list)

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
                judge: 12,
                start: cc.p(50, 150),
                devidex: 102,
                devidey: 100,
                nums: 6,
            }, {
                judge: 14,
                start: cc.p(50, 150),
                devidex: 85,
                devidey: 100,
                nums: 7,
            }, {
                judge: 16,
                start: cc.p(50, 150),
                devidex: 73,
                devidey: 100,
                nums: 8,
            }, {
                judge: 18,
                start: cc.p(50, 150),
                devidex: 64,
                devidey: 100,
                nums: 9,
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
        judge1.answer = self.answer[0]
        judge2.answer = self.answer[1]
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
                self.showList.judgeIndex(index, false)
                item.removeFromParent(true)
            }
        }
        self.showList = showList
        bg.btn_upload.addClickEventListener(function() {
            var one = judge1.judgeAnswer()
            var two = judge2.judgeAnswer()
            var result = ((one && two) || (one && two == null) || (one == null && two))
            playMusic(result ? res.sound_right_bs : res.sound_fault_bs)
            AddDialog("Judge", {
                judge: result,
            })
        })
        return true
    },
})