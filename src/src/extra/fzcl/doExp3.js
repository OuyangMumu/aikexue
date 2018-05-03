//@author mu @16/4/27

var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3", //必要！ 用于判定各种按钮的返回和进入
    preLayer: "doLayer", //必要！ 用来判定返回的上一个页面
    load: function() {
        loadPlist("fzcl_act1")
        loadPlist("fzcl_act2")
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
        if (self.toolbtn) {
            self.toolbtn.show()
        }
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
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
        self.createTool()
        self.initPeople() //创建人物
        return true
    },
    createTool: function() {
        var self = this
        var dataControl = self.dataControl
        var judgeTouch = function(item) {
            var poslist = item.getPos()
            var items = dataControl.item
            if (!dataControl.act) {
                dataControl.act = []
            }
            for (var i = 0; i < items.length; i++) {
                if (!dataControl.act[i]) {
                    for (var j = 0; j < poslist.length; j++) {
                        var result = judgeInside({
                            item: items[i][0],
                            pos: poslist[j],
                            mix: cc.p(1, 0.5),
                            off: cc.p(0, -0.25),
                        })
                        if (result) {
                            for (var k = 0; k < 2; k++) {
                                if (k == item.index) {
                                    items[i][item.index].setVisible(true)
                                    items[i][item.index].act()
                                    item.removeListen()
                                    item.setVisible(false)
                                    dataControl.act[i] = true
                                } else {
                                    items[i][k].setVisible(false)
                                }
                            }
                            return
                        }
                    }
                }
            }
        }
        var toolbtn = createTool({
            pos: cc.p(70, 480),
            nums: 2,
            tri: "right",
            showTime: 0.3,
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 10),
            devide: cc.p(1, 1.1),
            moveTime: 0.2,
            father: self,
            ifcircle: true,
            circleScale: 0.7,
            itemScale: 1.3,
            files: [res.fzcl_tool1, res.fzcl_tool2],
            gets: [res.fzcl_hand1, res.fzcl_hand2],
            judge: function() {
                if (dataControl.firing) {
                    return false
                }
                return true
            },
            firstClick: function(data) {
                var index = data.index
                var sp = data.sp
                var pos = data.pos
                sp.setAnchorPoint(0.5, 0.8)
                sp.setPosition(pos)
                sp.getPos = function() {
                    var sp = this
                    var poslist = [
                        cc.p(0, 0),
                        cc.p(55, 0),
                    ]
                    for (var i = 0; i < poslist.length; i++) {
                        poslist[i] = sp.convertToWorldSpace(poslist[i])
                    }
                    return poslist
                }
                return sp
            },
            outfun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var index = data.index
                judgeTouch(sp)
            },
            movefun: function(data) {
                var sp = data.sp
                var pos = data.pos
                var delta = data.delta
                var index = data.index
                sp.x += delta.x
                sp.y += delta.y
                judgeTouch(sp)
                return true
            },
            backfun: function(data) {
                return false
            }
        })
        this.toolbtn = toolbtn
        this.addChild(toolbtn)
    },
    initScene: function() {
        var self = this
        var dataControl = self.dataControl
        var mix = 180
        var dis = [130, 140]
        var poss = [
            cc.p(105, 360),
            cc.p(105, 370)
        ]
        dataControl.item = []
        var act = function() {
            var item = this
            var time = item.time
            var list = item.list
            var action = cc.sequence(
                createAnimation({
                    frame: sprintf("fzcl_act%d_%%02d.png", item.index + 1),
                    start: 1,
                    end: list[0],
                    time: time,
                }),
                cc.callFunc(function() {
                    hand.move({
                        time: (list[1] - list[0]) * time,
                        buf: cc.p(0, -dis[item.index]),
                    })
                }),
                createAnimation({
                    frame: sprintf("fzcl_act%d_%%02d.png", item.index + 1),
                    start: list[0] + 1,
                    end: list[2],
                    time: time,
                }),
                cc.callFunc(function() {
                    hand.move({
                        time: (list[3] - list[2]) * time,
                        buf: cc.p(0, dis[item.index]),
                    })
                }),
                createAnimation({
                    frame: sprintf("fzcl_act%d_%%02d.png", item.index + 1),
                    start: list[2] + 1,
                    end: item.max,
                    time: time,
                }),
                cc.callFunc(function() {
                    hand.dis()
                    item.hand = null
                })
            )
            item.runAction(action)
            var key = getRandKey()
            item.key = key
            var hand = createHand()
            item.hand = hand
            hand.back.setLocalZOrder(-1)
            hand.front.setRotation(-48)
            hand.back.setRotation(-48)
            safeAdd(item, hand.front)
            safeAdd(item, hand.back)
            safeAdd(item, hand)
            hand.judgePos = function() {
                var hand = this
                var par = hand.getParent()
                var pos = poss[item.index]
                var list = [
                    hand.back,
                    hand.front
                ]
                for (var i = 0; i < list.length; i++) {
                    list[i].x += pos.x
                    list[i].y += pos.y
                }
            }
            hand.move = function(data) {
                var hand = this
                var time = data.time
                var buf = data.buf
                var list = [
                    hand.back,
                    hand.front
                ]
                for (var i = 0; i < list.length; i++) {
                    var item = list[i]
                    addShowType({
                        item: item,
                        show: "moveBy",
                        time: time,
                        buf: buf,
                    })
                }
            }
            hand.dis = function() {
                var hand = this
                var list = [
                    hand.back,
                    hand.front
                ]
                for (var i = 0; i < list.length; i++) {
                    var item = list[i]
                    item.removeFromParent(true)
                }
            }
            item.hand.judgePos()
        }
        var list = [
            [2, 10, 34, 45],
            [2, 10, 44, 56],
        ]
        for (var i = 0; i < 2; i++) {
            dataControl.item[i] = []
            for (var j = 0; j < 2; j++) {
                var temp = new cc.Sprite(sprintf("#fzcl_act%d_01.png", j + 1))
                temp.setPosition(getMiddle(i == 0 ? -mix : mix, -80 + (j == 0 ? -5 : 0)))
                self.addChild(temp)
                dataControl.item[i].push(temp)
                temp.setVisible(i == j)
                temp.index = j
                temp.time = 0.03
                temp.max = (j == 0 ? 46 : 57)
                temp.act = act
                temp.list = list[j]
            }
        }
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
            img: res.fzcl_do3_content, //图片和声音文件
            sound: res.fzcl_do3_sound1
        })
    }
})