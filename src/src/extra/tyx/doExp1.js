//@author mu @16/4/27

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("tyx_do_btn")
    },
    myEnter: function() { //进场时调用 未删除不会重复调用
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {})
        }
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor()
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        self.itemList = [
            "Sun",
            "Jupiter",
            "Saturn",
            "Uranus",
            "Neptune",
            "Earth",
            "Venus",
            "Mars",
            "Mercury",
            "Moon",
        ]
        self.answer1 = [
            [0],
            [1, 2, 3, 4, 5, 6, 7, 8],
            [9],
        ]
        self.answer2 = [8, 6, 5, 7, 1, 2, 3, 4]
        self.answer3 = [1, 2, 3, 4, 5, 6, 7, 8]
        return true
    },
    getList: function(index) {
        var list = []
        var max = null
        var add = 0
        var judge = index == 0
        if (judge) {
            max = 10
        } else {
            max = 8
            add = 1
        }
        var rand = getRand(max)
        for (var i = 0; i < max; i++) {
            list.push(sprintf("#tyx_do_btn%02d.png", rand[i] + 1 + add))
        }
        var self = this
        var dataControl = self.dataControl
        if (!dataControl.curList) {
            dataControl.curList = []
        }
        dataControl.curList[index] = list
        if (!dataControl.curRand) {
            dataControl.curRand = []
        }
        dataControl.curRand[index] = rand
        if (!dataControl.curAdd) {
            dataControl.curAdd = []
        }
        dataControl.curAdd[index] = add
            //cc.log(rand, list, add)
        return list
    },
    getShowList: function(index) {
        var self = this
        var dataControl = self.dataControl
        if (!dataControl.allShowList) {
            dataControl.allShowList = []
        }
        if (!dataControl.allShowList[index]) {
            dataControl.allShowList[index] = self.getList(index)
        }
        return dataControl.allShowList[index]
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        var back = new ccui.ImageView(res.tyx_see_bg)
        back.setPosition(getMiddle())
        self.inside_node.addChild(back)

        var getShow = function(showIndex, list, judge) {
            if (!dataControl.showList) {
                dataControl.showList = []
            }
            if (!dataControl.showList[showIndex]) {
                var showList = createList({
                    scale: 0.7,
                    list: list,
                    swallow: false,
                    pos: getMiddle(320, -30),
                    getFun: function(data) {
                        var index = data.index
                        var pos = data.pos
                        var sp = new cc.Sprite(dataControl.curList[showIndex][index])
                        sp.setPosition(back.convertToNodeSpace(pos))
                        back.addChild(sp)
                        return sp
                    },
                    init: function(data) {
                        var item = data.item
                        var index = data.index
                        var pos = data.pos
                        var temp = dataControl.curRand[showIndex][index] + dataControl.curAdd[showIndex]
                        item.judgeIndex = temp
                        item.judgeNmae = self.itemList[temp]
                    },
                    outFun: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var index = data.index
                        if (dataControl.curBg.judgeItem({
                                pos: pos,
                                item: item,
                                index: index,
                            })) {} else {
                            dataControl.showList[showIndex].judgeIndex(index, false)
                        }
                    }
                })
                dataControl.showList[showIndex] = showList
                back.addChild(showList)
            }
            for (var i = 0; i < dataControl.showList.length; i++) {
                var show = dataControl.showList[i]
                if (i == showIndex) {
                    show.setVisible(true)
                    if (judge) {
                        show.reInit({
                            list: list,
                        })
                    }
                } else {
                    show.setVisible(false)
                }
            }
        }

        var uilist = [
            "bg1",
            "bg2",
            "bg3",
            "btn_pageUp",
            "btn_pageDown",
            "btn_upload",
            "btn_redo",
        ]
        var bg = loadNode(res.tyx_do, uilist)
        bg.setPosition(getMiddle(-80, -30))
        bg.setScale(0.7)
        back.addChild(bg)
        bg.showIndex = function(judge) {
            var bg = this
            var index = bg.page
            var bg1 = bg.bg1
            var bg2 = bg.bg2
            var bg3 = bg.bg3
            var bgList = [
                bg1,
                bg2,
                bg3
            ]
            for (var i = 0; i < bgList.length; i++) {
                bgList[i].setVisible(index == i)
                if (index == i) {
                    dataControl.curBg = bgList[i]
                }
            }
            if (judge) {
                dataControl.curBg.clear()
            }
            // if (bg1.clear) {
            //     bg1.clear()
            // }
            // if (bg2.clear) {
            //     bg2.clear()
            // }
            // if (index != 0) {
            //     bg2.init(index)
            // }
            bg.judgePage()
            var mark = self.getShowList(index)
            getShow(index, mark, judge)
        }
        bg.judgePage = function() {
            var bg = this
            bg.btn_pageUp.setVisible(bg.page > 0)
            bg.btn_pageDown.setVisible(bg.page < bg.maxPage)
        }
        bg.init = function() {
            var bg = this
            bg.page = 0
            bg.maxPage = 2
            bg.showIndex()
            var bg1 = bg.bg1
            var bg2 = bg.bg2
            var bg3 = bg.bg3
            var list = [
                "judge1",
                "judge2",
                "judge3",
                "show1",
                "show2",
                "show3",
                "lay1",
                "lay2",
                "lay3",
            ]
            loadList(bg1, list)
            var list = [
                "font",
                "lay",
            ]
            loadList(bg2, list)
            loadList(bg3, list)
            bg.btn_pageUp.addClickEventListener(function() {
                bg.page--
                    bg.showIndex()
            })
            bg.btn_pageDown.addClickEventListener(function() {
                bg.page++
                    bg.showIndex()
            })
            bg.btn_redo.addClickEventListener(function() {
                bg.showIndex(true)
            })
            bg.btn_upload.addClickEventListener(function() {
                if (!dataControl.canAnswer) {
                    dataControl.canAnswer = true
                    var answer = dataControl.curBg.judgeAnswer()
                    self.nodebs.say({
                        key: answer ? "right" : "fault",
                        force: true,
                    })
                    AddDialog("Judge", {
                        judge: answer,
                        fun: function() {
                            dataControl.canAnswer = false
                            self.nodebs.stopSay()
                        }
                    })
                }
            })
            bg1.showIndex = function(index) {
                var bg1 = this
                for (var i = 0; i < 3; i++) {
                    var show = bg1[sprintf("show%d", i + 1)]
                    show.setVisible(index == i)
                    if (index == i) {
                        self.nodebs.say({
                            key: sprintf("do%d", index),
                            force: true,
                        })
                    }
                }
            }
            bg1.judgeAnswer = function() {
                var bg1 = this
                var answers = []
                for (var i = 0; i < 3; i++) {
                    var list = bg1[sprintf("lay%d", i + 1)].getList()
                    var judgeList = self.answer1[i]
                    if(list.length == 0){
                        answers[i] = null
                    }else{
                        var allJudge = true
                        for (var j = 0; j < list.length; j++) {
                            var tempJudge = false
                            for (var k = 0; k < judgeList.length; k++) {
                                if(judgeList[k] == list[j]){
                                    tempJudge = true
                                }
                            }
                            if(!tempJudge){
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
            var judgeAnswer = function() {
                var bg2 = this
                var curIndex = bg2.curIndex
                for (var i = 0; i < 8; i++) {
                    var index = bg2[sprintf("lay%d", i + 1)].getIndex()
                    var judgeIndex = self[sprintf("answer%d", curIndex + 1)][i]
                    if (index != judgeIndex) {
                        return false
                    }
                }
                return true
            }
            bg2.curIndex = 1
            bg3.curIndex = 2
            bg2.judgeAnswer = judgeAnswer
            bg3.judgeAnswer = judgeAnswer
            bg1.clear = function() {
                var bg1 = this
                for (var i = 0; i < 3; i++) {
                    bg1[sprintf("lay%d", i + 1)].clear()
                }
            }
            bg1.init = function() {
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
                    lay.itemSize = cc.size(164, 170)
                    lay.max = lay.getContentSize().width
                    lay.devide = 170
                    if (lay.list) {
                        var nums = lay.list.length
                        var all = nums * lay.itemSize.width
                        if (all > lay.max) {
                            lay.devide = (lay.max - lay.itemSize.width) / (nums - 1)
                        }
                        for (var i = 0; i < nums; i++) {
                            var sp = lay.list[i]
                            sp.setPosition(cc.p(82 + i * lay.devide, 97))
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
                    bg1[sprintf("show%d", i + 1)].setVisible(false)
                    bg1[sprintf("lay%d", i + 1)].addItem = addItem
                    bg1[sprintf("lay%d", i + 1)].reSort = reSort
                    bg1[sprintf("lay%d", i + 1)].del = del
                    bg1[sprintf("lay%d", i + 1)].clear = clear
                    bg1[sprintf("lay%d", i + 1)].getList = getList
                    var normal = bg1[sprintf("judge%d", i + 1)].getChildByName("normal")
                    var select = bg1[sprintf("judge%d", i + 1)].getChildByName("select")
                    normal.setVisible(true)
                    select.setVisible(false)
                    normal.link = select
                    normal.index = i
                    createTouchEvent({
                        item: normal,
                        begin: function(data) {
                            var item = data.item
                            item.setVisible(false)
                            item.link.setVisible(true)
                            return true
                        },
                        end: function(data) {
                            var item = data.item
                            item.setVisible(true)
                            item.link.setVisible(false)
                            bg1.showIndex(item.index)
                        }
                    })
                }
            }
            var clear = function() {
                var bg2 = this
                for (var i = 0; i < 8; i++) {
                    bg2[sprintf("lay%d", i + 1)].clear()
                }
            }
            bg2.clear = clear
            bg3.clear = clear
            var init = function() {
                var bg2 = this
                bg2.font.setVisible(true)

                var addItem = function(item) {
                    var lay = this
                    item.setPosition(82, 97)
                    if (lay.item) {
                        var temp = lay.item
                        dataControl.showList[bg.page].judgeIndex(temp.index, false)
                        lay.clear()
                    }
                    safeAdd(lay, item)
                    lay.item = item
                    item.mylay = lay
                }
                var changeItem = function(item) {
                    var lay = this
                    lay.item = item
                    item.mylay = lay
                    item.setPosition(82, 97)
                    safeAdd(lay, item)
                }
                var del = function() {
                    var lay = this
                    lay.item = null
                    return true
                }
                var clear = function() {
                    var lay = this
                    if (lay.item) {
                        var item = lay.item
                        if (item.removeListen) {
                            item.removeListen()
                        }
                        item.removeFromParent(true)
                    }
                    lay.item = null
                }
                var getIndex = function() {
                    var lay = this
                    if (lay.item) {
                        return lay.item.judgeIndex
                    }
                    return null
                }
                if (!bg2.create) {
                    bg2.create = true
                    var item = bg2.lay
                    for (var i = 0; i < 2; i++) {
                        for (var j = 0; j < 4; j++) {
                            var temp = item.clone()
                            temp.setPosition(cc.p(110 + 234 * j + i * 45, 500 - i * 275))
                            var judge = i * 4 + j
                            temp.getChildByName("decoright").setVisible(false)
                            temp.getChildByName("decoleft").setVisible(judge != 0)
                            bg2.addChild(temp)
                            bg2[sprintf("lay%d", judge + 1)] = temp
                            temp.addItem = addItem
                            temp.del = del
                            temp.clear = clear
                            temp.getIndex = getIndex
                            temp.changeItem = changeItem
                        }
                    }
                    item.setVisible(false)
                }
            }
            bg2.init = init
            bg3.init = init
            var packageItem = function(item) {
                createTouchEvent({
                    item: item,
                    begin: function(data) {
                        var item = data.item
                        var pos = data.pos
                        var lay = item.getParent()
                        if (lay.del(item)) {
                            item.retain()
                            item.removeFromParent(false)
                            item.setPosition(back.convertToNodeSpace(pos))
                            back.addChild(item)
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
                        if (!(dataControl.curBg.judgeItem(data))) {
                            dataControl.showList[bg.page].judgeIndex(item.index, false)
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
                    var lay = bg1[sprintf("lay%d", i + 1)]
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
            var judgeItem = function(data) {
                var item = data.item
                var pos = data.pos
                var bg2 = this
                for (var i = 0; i < 8; i++) {
                    var lay = bg2[sprintf("lay%d", i + 1)]
                    if (judgeInside({
                            item: lay,
                            pos: pos,
                        })) {
                        if (item.removeListen) {
                            item.removeListen()
                        }
                        packageItem(item)
                        if (lay.item && item.mylay) {
                            item.mylay.changeItem(lay.item)
                            lay.changeItem(item)
                        } else {
                            lay.addItem(item)
                        }
                        return true
                    }
                }
                return false
            }
            bg2.judgeItem = judgeItem
            bg3.judgeItem = judgeItem
            bg1.init()
            bg2.init()
            bg3.init()
        }
        bg.init()
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.loadUI.addChild(this.nodebs) //添加人物对话
        for (var i = 0; i < 3; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("do%d", i), //对话标签 之后让人物说话需要用到的参数
                sound: res[sprintf("tyx_do_sound%d", i + 1)]
            })
        }
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
    }
})