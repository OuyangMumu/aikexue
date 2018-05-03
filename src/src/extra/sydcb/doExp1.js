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
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({ //当存在key为show的对话ID才调用
                    key: "Show"
                })
            })
        }
    },
    dataControl: {},
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.load()
        this.expCtor() //实验模板
        this.dataControl = {}
        var self = this
        var dataControl = this.dataControl
        self.initPeople() //创建人物
        self.initScene()
        return true
    },
    showTest: function() {
        var self = this
        var boy = self.boy
        if (boy && boy.img_test) {
            var test = boy.img_test
            if (!test.ifInit) {
                test.ifInit = true
                var list = [
                    "btn_upload",
                    "btn_close",
                    "judge1",
                    "judge2",
                    "judge3",
                ]
                loadList(test, list)
                safeAdd(self, test)
                test.setPosition(getMiddle())
                var judgeList = [
                    test.judge1,
                    test.judge2,
                    test.judge3,
                ]
                var answerList = [
                    "sand",
                    "water",
                    "air"
                ]
                test.btn_upload.addClickEventListener(function() {
                    var judge = true
                    for (var i = 0; i < judgeList.length; i++) {
                        if (!judgeList[i].inside) {
                            AddDialog("Tips", {
                                res: res.do1_tip1,
                                face: 2,
                                modify: cc.p(20, 0)
                            })
                            return
                        } else {
                            if (judgeList[i].inside.key != answerList[i]) {
                                judge = false
                            }
                        }
                    }
                    self.nodebs.say({
                        key: judge ? "right" : "fault",
                        force: true,
                    })
                    AddDialog("Judge", {
                        judge: judge,
                        fun: function() {
                            if (judgeMusic()) {
                                stopMusic()
                            }
                        }
                    })
                })
                test.btn_close.addClickEventListener(function() {
                    test.show()
                })
                var list = [
                    "water",
                    "air",
                    "sand",
                ]
                var judgeAll = function(data) {
                    var item = data.item

                    for (var i = 0; i < judgeList.length; i++) {
                        var rect = judgeList[i]
                        if (judgeInside({
                                item: rect,
                                pos: data.pos
                            })) {
                            if (rect.inside) {
                                if (item.father) {
                                    var pastFather = item.father
                                    pastFather.inside = rect.inside
                                    rect.inside.father = pastFather
                                    rect.inside.setPosition(pastFather.inPos)
                                } else {
                                    rect.inside.father = null
                                    rect.inside.setPosition(rect.inside.rootPos)
                                    rect.inside = null
                                }
                            } else {
                                if (item.father) {
                                    item.father.inside = null
                                }
                            }
                            rect.inside = item
                            item.father = rect
                            item.setPosition(rect.inPos)
                            return true
                        }
                    }
                    return false
                }
                var pack = function(item) {
                    createTouchEvent({
                        item: item,
                        autoMove: true,
                        end: function(data) {
                            var item = data.item
                            if (judgeAll(data)) {

                            } else {
                                if (item.father) {
                                    item.father.inside = null
                                    item.father = null
                                }
                                item.setPosition(item.rootPos)
                            }
                        }
                    })
                }
                for (var i = 0; i < judgeList.length; i++) {
                    var rect = judgeList[i]
                    var size = rect.getContentSize()
                    var pos = cc.p(size.width / 2, size.height / 2)
                    var curPos = rect.getPosition()
                    rect.inPos = cc.p(curPos.x + pos.x, curPos.y + pos.y)
                }
                for (var i = 0; i < list.length; i++) {
                    var item = new cc.Sprite(res[sprintf("bag_%02d", i + 1)])
                    var pos = cc.p(135 + i * 165, 135)
                    item.setPosition(pos)
                    item.rootPos = pos
                    item.key = list[i]
                    item.setScale(0.5)
                    pack(item)
                    safeAdd(test, item)
                }
                test.show = function() {
                    if (!test.showing) {
                        test.ifShow = !test.ifShow
                        test.showing = true
                        if (test.ifShow) {
                            test.setPosition(getMiddle())
                        }
                        addShowType({
                            item: test,
                            show: test.ifShow ? "scale" : "zoom",
                            time: 0.3,
                            fun: function(test) {
                                test.showing = false
                                if (test.ifShow) {
                                    addMoving(test)
                                } else {
                                    removeMoving(test)
                                }
                            }
                        })
                    }
                }
                test.ifShow = false
                test.setScale(0)
                test.setVisible(true)
            }
            test.show()
        }
    },
    initScene: function() {
        var self = this
        var uilist = [
            "desk",
            "head",
            "eye",
            "zs",
            "ys",
            "judge",
            "btn_test",
            "img_test",
            "move",
        ]
        var boy = loadNode(res.sydcb_do1, uilist, "bg")

        boy.btn_test.addClickEventListener(function() {
            self.showTest()
        })
        boy.img_test.setVisible(false)
        setOff(boy, cc.p(50, 0))
        safeAdd(self, boy)
        self.boy = boy
        self.blink(true)
        var list = [
            "water",
            "air",
            "sand",
        ]
        var posList = [
            cc.p(170, 173),
            cc.p(280, 130),
            cc.p(131, 89)
        ]
        var pack = function(item) {
            createTouchEvent({
                item: item,
                begin: function(data) {
                    if (self.falling) {
                        return false
                    }
                    return true
                },
                move: function(data) {
                    var item = data.item
                    var tempPos = item.getPosition()
                    var delta = data.delta
                    tempPos.x += delta.x
                    tempPos.y += delta.y
                    var judge = judgeInside({
                        item: boy.move,
                        pos: tempPos,
                    })
                    if (!judge) {
                        var backPos = getBackPos({
                            item: boy.move,
                            pos: tempPos,
                        })
                        delta.x += backPos.x
                        delta.y += backPos.y
                    }
                    item.x += delta.x
                    item.y += delta.y
                },
                end: function(data) {
                    var pos = data.pos
                    var item = data.item
                    if (judgeInside({
                            item: boy.judge,
                            pos: pos,
                        })) {
                        if (self.current) {
                            self.current.setPosition(self.current.rootPos)
                        }
                        item.setPosition(cc.p(536, 177))
                        self.current = item
                        self.fall()
                    } else {
                        item.setPosition(item.rootPos)
                    }
                }
            })
        }
        for (var i = 0; i < list.length; i++) {
            var item = new cc.Sprite(res[sprintf("bag_%02d", i + 1)])
            item.setPosition(posList[i])
            item.rootPos = posList[i]
            item.key = list[i]
            item.setScale(0.8)
            safeAdd(boy.desk, item)
            pack(item)
        }
    },
    blink: function(judge) {
        var self = this
        var boy = self.boy
        if (boy) {
            boy.eye.setVisible(judge)
            if (judge) {
                boy.eye.stopAllActions()
                var randBlink = function() {
                    var time = Math.random() * 3 + 2
                    var loop = Math.random() > 0.5 ? 1 : 2
                    var ani = cc.sequence(cc.delayTime(time), cc.repeat(createAnimation({
                        frame: "boy_eye_%02d.png",
                        end: 2,
                        time: 0.1,
                        origin: true,
                    }), loop), cc.callFunc(randBlink))
                    boy.eye.runAction(ani)
                }
                randBlink()
            }
        }
    },
    fall: function() {
        var self = this
        var boy = self.boy
        if (boy) {
            self.blink(false)
            self.falling = true
            boy.head.setSpriteFrame("boy_head_01.png")
            var aniHead = createAnimation({
                frame: "boy_head_%02d.png",
                start: 2,
                end: 11,
                time: 0.1,
                fun: function() {
                    self.click()
                }
            })
            var aniBody = createAnimation({
                frame: "boy_st_%02d.png",
                end: 9,
                time: 0.1,
            })
            boy.head.runAction(aniHead)
            boy.runAction(aniBody)
        }
    },
    click: function() {
        var self = this
        var boy = self.boy
        if (boy) {
            var music = null
            var delay = null
            var time = null
            if (self.current) {
                switch (self.current.key) {
                    case "water":
                        music = res.lis_01
                        delay = 0.3
                        time = 0.1
                        break
                    case "air":
                        music = res.lis_02
                        delay = 0.4
                        time = 0.15
                        break
                    case "sand":
                        music = res.lis_03
                        delay = 0.6
                        time = 0.15
                        break
                }
            }

            playMusicLoopCall({
                music: music,
                times: 3,
                fun: function() {
                    boy.ys.stopAllActions()
                    self.back()
                }
            })
            var aniYs = cc.repeat(cc.sequence(cc.delayTime(delay), cc.repeat(createAnimation({
                frame: "boy_yh_%02d.png",
                end: 2,
                time: time,
                origin: true,
            }), 2)), 3)
            boy.ys.runAction(aniYs)
        }
    },
    back: function() {
        var self = this
        var boy = self.boy
        if (boy) {
            boy.setSpriteFrame("boy_st_01.png")
            boy.head.setSpriteFrame("boy_head_01.png")
            boy.eye.setSpriteFrame("boy_eye_01.png")
            boy.ys.setSpriteFrame("boy_yh_01.png")
            self.blink(true)
            self.falling = false
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.nodebs.setLocalZOrder(9999)
        this.addChild(this.nodebs) //添加人物对话
        addContent({
            people: this.nodebs,
            key: "Show", //对话标签 之后让人物说话需要用到的参数
            img: res.sydcb_do1_content, //图片和声音文件
            sound: res.sydcb_do1_sound1
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
    }
})