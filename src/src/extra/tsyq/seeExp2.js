//@author mu @16/4/27

var tsyq_Result = [
    [0, 3, 6, 8],
    [2, 4, 5, 7],
    [1, 9]
]

var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "seeLayer", //必要！ 用来判定返回的上一个页面
    load: function() {},
    myEnter: function() { //进场时调用 未删除不会重复调用
        var self = this
        var dataControl = self.dataControl
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({
                    key: "show1",
                    fun: function() {
                        dataControl.canSay = true
                    }
                })
            })
        }
    },
    getRand: function() {
        var self = this
        var dataControl = self.dataControl
        var list = []
        var rand = getRand(10)
        for (var i = 0; i < 10; i++) {
            list.push(sprintf("#tsyq_bg_%02d.png", rand[i] + 3))
        }
        dataControl.curRand = rand
        return list
    },
    dataControl: {},
    judgeAll: function(data) {
        var self = this
        var dataControl = self.dataControl
        if (!self.biaoge) {
            return
        }
        var bg = self.biaoge
        var pos = data.pos
        var item = data.item
        var index = data.index
        var judgeList = [
            bg.judge1,
            bg.judge2,
            bg.judge3,
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
                        self.judgeAll({
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
    },
    ctor: function() { //创建时调用 未删除不会重复调用
        var self = this
        var dataControl = self.dataControl
        this._super();
        this.load()
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        if (!self.biaoge) {
                            var bg = createBiaoge({
                                json: res.tsyq_bg_json,
                                scale: 0.9,
                            })
                            self.biaoge = bg

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
                                var perLine = judge.perLine

                                if (judge.list) {
                                    var count = 0
                                    var list = judge.list
                                    var nums = perLine
                                    var start = null
                                    var devidex = null
                                    var devidey = null
                                    var len = list.length
                                    switch (nums) {
                                        case 1:
                                            start = cc.p(100, 340)
                                            devidex = 0
                                            devidey = 40
                                            break
                                        case 2:
                                            start = cc.p(70, 155)
                                            devidex = 110
                                            devidey = 40
                                            break
                                    }
                                    if (len > 8) {
                                        devidey = 30
                                    }

                                    for (var i = 0; i < list.length; i++) {
                                        if (list[i]) {
                                            var item = list[i]
                                            item.setScale(1)
                                            item.setAnchorPoint(0.5, 0.5)
                                            list[i].setPosition(cc.p(start.x + count % nums * devidex, start.y - Math.floor(count / nums) * devidey))
                                            safeAdd(judge, item)
                                            count++
                                        }
                                    }
                                } else {
                                    return
                                }
                            }

                            var list = [
                                "judge1",
                                "judge2",
                                "judge3"
                            ]
                            loadList(bg, list)

                            for (var i = 0; i < list.length; i++) {
                                bg[list[i]].judgeItem = judgeItem
                                bg[list[i]].clear = clear
                                bg[list[i]].del = del
                                bg[list[i]].judgeAnswer = judgeAnswer
                                bg[list[i]].sort = sort
                            }

                            bg.judge1.perLine = 2
                            bg.judge2.perLine = 2
                            bg.judge3.perLine = 1
                            bg.judge1.answer = tsyq_Result[0]
                            bg.judge2.answer = tsyq_Result[1]
                            bg.judge3.answer = tsyq_Result[2]

                            bg.setClear(function() {
                                for (var i = 0; i < list.length; i++) {
                                    bg[list[i]].clear()
                                }
                                dataControl.showList.reInit({
                                    list: self.getRand(),
                                })
                            })

                            bg.setUpLoad(function() {
                                var one = bg.judge1.judgeAnswer()
                                var two = bg.judge2.judgeAnswer()
                                var three = bg.judge3.judgeAnswer()
                                var result = !((one == null && two == null && three == null) || one == false || two == false || three == false)
                                self.nodebs.say({
                                    key: result ? "right" : "fault",
                                    force: true,
                                })
                                AddDialog("Judge", {
                                    judge: result,
                                })
                            })

                            var showList = createList({
                                scale: 1,
                                noBg: true,
                                noArrow: true,
                                list: self.getRand(),
                                pos: cc.p(700, 310),
                                num: 10,
                                disTri: true,
                                size: cc.size(150, 500),
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
                                    self.judgeAll({
                                        item: item,
                                        pos: pos,
                                        index: index,
                                    })
                                }
                            })
                            bg.addChild(showList)
                            dataControl.showList = showList
                        }
                        safeAdd(self, self.biaoge)
                        self.biaoge.show()
                    }
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        var uilist = [
            "earth",
            "moon",
            "earth2",
            "moon2",
            "font1",
            "font2",
            "font3",
            "tri",
        ]
        var list = [
            "add",
        ]
        var cat = [
            "earth",
            "moon",
        ]

        var node = loadNode(res.tsyq_see2_json, uilist)
        for (var i = 0; i < uilist.length; i++) {
            loadList(node[cat[i]], list)
        }
        var item1 = {
            select: node.earth,
            normal: node.earth2,
        }
        var item2 = {
            select: node.moon,
            normal: node.moon2,
        }

        var judgeList = [
            ["tsyq_see2_07.png", "tsyq_see2_08.png"],
            ["tsyq_see2_09.png", "tsyq_see2_10.png"],
            ["tsyq_see2_11.png", "tsyq_see2_12.png"],
        ]
        for (var i = 0; i < judgeList.length; i++) {
            var item = createJudgeBtn({
                frame: true,
                normal: judgeList[i][0],
                select: judgeList[i][1],
                pos: cc.p(700 + i * 100, 570),
                father: self.inside_node,
                fun: function(item) {
                    if (node.showIndex) {
                        node.showIndex(item.index)
                    }
                }
            })
            item.index = i
            node[sprintf("judge%d", i + 1)] = item
        }
        node.init = function() {
            var node = this
            node.tri.rootPos = node.tri.getPosition()
            node.tri.setScale(0.55)
            var touchs = ["touch1", "touch2", "normal"]
            var shows = ["select", "show", "font"]
            var node = this
            var judges = [
                "font1",
                "font2",
                "font3",
            ]
            for (var i = 0; i < judges.length; i++) {
                node[judges[i]].index = i
                node[judges[i]].act = function(ifshow) {
                    var item = this
                    item.setVisible(ifshow)
                    node[sprintf("judge%d", item.index + 1)].change(ifshow, false)
                    if (ifshow) {
                        var showPeople = false
                        var showLine = false
                        var showFade = false
                        switch (item.index) {
                            case 0:
                                showLine = true
                                break
                            case 1:
                                showFade = true
                                break
                            case 2:
                                showPeople = true
                                break
                        }
                        var tempList = [
                            node.earth,
                            node.moon
                        ]
                        var fadeList = [
                            item1,
                            item2
                        ]
                        for (var i = 0; i < tempList.length; i++) {
                            tempList[i].add.setVisible(showPeople)
                        }
                        node.tri.stopAllActions()
                        if (showLine) {
                            node.tri.setPosition(node.tri.rootPos)
                            node.tri.setVisible(true)
                            var dis = 125
                            var ro = node.tri.getRotationX()
                            addShowType({
                                item: node.tri,
                                show: "moveBy",
                                buf: cc.p(-Math.cos(ro / 180 * Math.PI) * dis, Math.sin(ro / 180 * Math.PI) * dis),
                                time: 1.0,
                                fun: function(item) {
                                    addShowType({
                                        item: item,
                                        show: "blink",
                                        time: 0.6,
                                        count: 3,
                                    })
                                }
                            })
                        } else {
                            node.tri.setVisible(false)
                        }
                        if (showFade) {
                            for (var i = 0; i < fadeList.length; i++) {
                                blink({
                                    item: fadeList[i],
                                    count: 6,
                                    time: 0.3,
                                    after: function() {
                                        node.earth.setVisible(false)
                                        node.moon.setVisible(false)
                                        node.earth2.setVisible(true)
                                        node.moon2.setVisible(true)
                                    }
                                })
                            }
                        } else {
                            disTimer(item1)
                            disTimer(item2)
                            node.earth.setVisible(true)
                            node.earth2.setVisible(false)
                            node.moon.setVisible(true)
                            node.moon2.setVisible(false)
                        }
                    }
                }
            }
            node.showIndex = function(index) {
                var node = this
                for (var i = 0; i < judges.length; i++) {
                    var item = node[judges[i]]
                    if (index == i) {
                        if (node.pastIndex != index) {
                            node.pastIndex = i
                            if (dataControl.canSay) {
                                self.nodebs.say({
                                    key: sprintf("show%d", i + 1),
                                    force: true,
                                })
                            }
                            item.act(true)
                        }
                    } else {
                        item.act(false)
                    }
                }
            }
            node.showIndex(0)
        }
        node.init()
        var line = drawEllipse({
            buf: getEllipsePoint({
                a: 380.54,
                b: 162.59,
                devide: 3,
            }),
            color: cc.color(0, 0, 0, 255),
            seg: 1,
        })
        line.setPosition(cc.p(560.43, 313.65))
        self.addChild(line)
        self.addChild(node)
    },
    initPeople: function() {
        var self = this
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs) //添加人物对话
        var list = [
            "tsyq_see2_sound1",
            "tsyq_see2_sound2",
            "tsyq_see2_sound3",
        ]
        for (var i = 0; i < list.length; i++) {
            addContent({
                people: self.nodebs,
                key: sprintf("show%d", i + 1),
                sound: res[list[i]],
            })
        }
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