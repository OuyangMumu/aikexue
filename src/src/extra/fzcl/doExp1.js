//@author mu @16/4/27
var FZCL_BG = null
var fzcl_biaoge = function() {
    if (!FZCL_BG) {
        var bg = createBiaoge({
            json: res.fzcl_biaoge,
            inputNum: 2,
            scale: 0.9,
            rootColor: [
                cc.color(255, 0, 0, 255),
                cc.color(255, 0, 0, 255),
            ],
            downData: {
                nums: 8,
                bufs: [
                    [null, "#fzcl_bg_06.png", "#fzcl_bg_07.png"],
                    [null, "#fzcl_bg_06.png", "#fzcl_bg_07.png"],
                    [null, "#fzcl_bg_08.png", "#fzcl_bg_09.png"],
                    [null, "#fzcl_bg_08.png", "#fzcl_bg_09.png"],
                    [null, "#fzcl_bg_10.png", "#fzcl_bg_11.png", "#fzcl_bg_02.png"],
                    [null, "#fzcl_bg_10.png", "#fzcl_bg_11.png", "#fzcl_bg_02.png"],
                    [null, "#fzcl_bg_03.png", "#fzcl_bg_04.png"],
                    [null, "#fzcl_bg_03.png", "#fzcl_bg_04.png"],
                ],
                keys: [
                    1, 2, 1, 2, 2, 3, 1, 2,
                ]
            },
            inputKeys: ["2", "4"],
        })
        bg.bg_final.retain()
        bg.retain()
        FZCL_BG = bg
    }
    FZCL_BG.close = true//二次修改，避免第二次点击答案，答案不显示,表格点不开
    if(FZCL_BG.bg_final)
        FZCL_BG.bg_final.close = true
    return FZCL_BG
}

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("fzcl_xian")
    },
    myDelete: function() { //删除时调用
        var self = this
        this._super()
        if(self.biaoge){
            self.biaoge.removeFromParent(false)
        }
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
    initScene: function() {
        var self = this
        var uilist = [
            "line1",
            "line2",
            "item",
            "copy",
        ]
        var node = loadNode(res.fzcl_do1_json, uilist)
        node.copy.setVisible(false)
        self.addChild(node)
        var line1 = new cc.Sprite("#fzcl_mx1_01.png")
        line1.setPosition(cc.p(447.2, 329.2))
        self.addChild(line1)
        var line2 = new cc.Sprite("#fzcl_nl1_01.png")
        line2.setPosition(688.9, 329.2)
        self.addChild(line2)
        var count = function() {

            count = 0
            temp = line2.last
            while (temp) {
                temp = temp.pre
                count++
            }
            cc.log("line2", count)
        }
        var judgeLoop = function(pos) {
            var line = this
            if (judgeInside({
                    item: line,
                    pos: pos,
                })) {
                return true
            } else {
                if (line.last) {
                    return line.last.judge(pos)
                } else {
                    return false
                }
            }
        }
        var action = function() {
            var line = this
            var seq = cc.repeatForever(cc.sequence(createAnimation({
                frame: sprintf("fzcl_%s1_%%02d.png", line.lineType),
                end: 8,
                time: 0.03,
            })))
            return seq
        }
        var judgeLine = function() {
            var line = this
            if (!line.drop) {
                var count = 0
                var temp = line.last
                while (temp) {
                    temp = temp.pre
                    count++
                }
                if (count >= line.max) {
                    line.drop = true
                    var temp = line.last
                    while (temp) {
                        if (temp.removeListen) {
                            temp.removeListen()
                            temp.removeListen = null
                        }
                        temp = temp.pre
                    }
                    line.runAction(line.action())
                    addShowType({
                        item: line,
                        show: "moveBy",
                        time: 1.5,
                        buf: cc.p(0, -1000),
                        fun: function(item) {
                            item.stopAllActions()
                            item.removeAllChildren(true)
                            item.removeFromParent(true)
                        }
                    })
                }
            }
        }
        var addItem = function(item) {
            var line = this
            if (!line.drop) {
                item.pre = null
                if (!line.last) {
                    //cc.log("add first")
                    item.father = line
                    line.last = item.getLast()
                    var size = line.getContentSize()
                    item.setPosition(size.width / 2, 0)
                    if (item.sz) {
                        item.sz.removeFromParent(true)
                        item.sz = null
                    }
                    var itemsize = item.getContentSize()
                    var sz = new cc.Sprite(line.sz)
                    sz.setAnchorPoint(0.5, 0.5)
                    sz.setPosition(itemsize.width / 2, itemsize.height + 2)
                    item.addChild(sz)
                    item.sz = sz
                    safeAdd(line, item)
                } else {
                    //cc.log("add last")
                    var size = line.last.getContentSize()
                    item.setPosition(size.width / 2, 0)
                    line.last.next = item
                    item.pre = line.last
                    safeAdd(line.last, item)
                    line.last = item.getLast()
                }
                line.last.next = null
                var size = item.getContentSize()
                var mix = 0.2
                var rect = cc.rect(0, size.height * mix, size.width, size.height * (1 - mix))
                createTouchEvent({
                    item: item,
                    rect: rect,
                    begin: function(data) {
                        var item = data.item
                        var pos = data.pos
                        if (item.sz) {
                            item.sz.setVisible(false)
                        }
                        item.getFirst().last = item.pre
                        if (item.pre) {
                            item.pre.next = null
                        }
                        item.pre = null
                        return true
                    },
                    move: function(data) {
                        var item = data.item
                        var delta = data.delta
                        item.x += delta.x
                        item.y += delta.y
                    },
                    end: function(data) {
                        var pos = data.pos
                        var item = data.item
                        pos = item.getTruePos(pos)
                        judgeTouch({
                            item: item,
                            pos: pos,
                        })
                    }
                })
            }
            line.judgeLine()
        }

        line1.addItem = addItem
        line2.addItem = addItem
        line1.max = 3
        line2.max = 5
        line1.sz = res.fzcl_back1
        line2.sz = res.fzcl_back2
        line1.judgeLoop = judgeLoop
        line2.judgeLoop = judgeLoop
        line1.lineType = "mx"
        line2.lineType = "nl"
        line1.action = action
        line2.action = action
        line1.judgeLine = judgeLine
        line2.judgeLine = judgeLine
        var judgeTouch = function(data) {
            var item = data.item
            var pos = data.pos
            var list = [
                line1,
                line2,
            ]
            var judge = true
            for (var i = 0; i < list.length; i++) {
                var line = list[i]
                if (!line.drop) {
                    if (list[i].judgeLoop(pos)) {
                        list[i].addItem(item)
                        judge = false
                        break
                    }
                }
            }
            if (judge) {
                item.removeFromParent(true)
            }
        }
        createTouchEvent({
            item: node.item,
            begin: function(data) {
                var item = data.item
                var pos = data.pos
                if (!item.item) {
                    var sp = node.copy.clone()
                    var size = sp.getContentSize()
                    sp.setVisible(true)
                    sp.setAnchorPoint(0.5, 0.9)
                    sp.setPosition(cc.p(pos.x, pos.y + size.height * 0.4))
                    safeAdd(self, sp)
                    item.item = sp
                    sp.getTruePos = function(pos) {
                        var item = this
                        var size = item.getContentSize()
                        var target = cc.p(size.width / 2, size.height)
                        var mix = item.convertToNodeSpace(pos)
                        var dis = cc.p(target.x - mix.x, target.y - mix.y)
                        pos = cc.p(pos.x + dis.x, pos.y + dis.y)
                        return pos
                    }
                    sp.getLast = function() {
                        var sp = this
                        if (sp.next) {
                            return sp.next.getLast()
                        } else {
                            return sp
                        }
                    }
                    sp.judge = function(pos) {
                        var sp = this
                        if (judgeInside({
                                item: sp,
                                pos: pos,
                            })) {
                            return true
                        } else {
                            if (sp.pre) {
                                return sp.pre.judge(pos)
                            }
                        }
                        return false
                    }
                    sp.getFirst = function(father) {
                        var sp = this
                        if (sp.pre) {
                            return sp.pre.getFirst()
                        } else {
                            return sp.father
                        }
                    }
                    return true
                } else {
                    cc.log("something wrong")
                    return false
                }
            },
            move: function(data) {
                var item = data.item
                var delta = data.delta
                if (item.item) {
                    var sp = item.item
                    sp.x += delta.x
                    sp.y += delta.y
                }
            },
            end: function(data) {
                var item = data.item
                var pos = data.pos
                var sp = item.item
                pos = sp.getTruePos(pos)
                if (sp) {
                    judgeTouch({
                        item: sp,
                        pos: pos,
                    })
                    item.item = null
                }
            },
        })
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        var self = this
        this._super();
        this.load()
        this.expCtor({
                vis: false,
                settingData: {
                    pos: cc.p(1080, 580),
                    biaogeFun: function() {
                        var bg = fzcl_biaoge()
                        safeAdd(self, bg)
                        self.biaoge = bg
                        bg.show()
                    },
                }
            }) //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initScene()
        self.initPeople() //创建人物
        return true
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.fzcl_do1_content, //图片和声音文件
            sound: res.fzcl_do1_sound1,
        })
    }
})