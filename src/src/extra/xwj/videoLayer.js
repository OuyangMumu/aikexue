var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer: "mainLayer",
    load: function() {},
    ctor: function() {
        this._super();
        var self = this
        var btn = new ccui.Button(res.img_skip_normal, res.img_skip_select)
        btn.setLocalZOrder(99)
        btn.setPosition(1050, 50)
        safeAdd(self, btn)
        btn.addClickEventListener(function() {
            stopEffect()
            func.changeLayer({
                out: self,
                in : layerControl.getLayer(self.jumpTolayer)
            })
        })
        self.createBg1(function() {
            self.createBg2()
        })
        return true
    },
    createBg1: function(fun) {
        var self = this
        var uiList = [
            "boy",
            "item_eye",
            "img_zw",
        ]
        var bg = loadNode(res.xwj_act1, uiList)
        bg.setPosition(getMiddle())
        safeAdd(self, bg)
        bg.img_zw.run = function() {
            var item = this
            var action = cc.repeatForever(createAnimation({
                frame: "img_zw%d.png",
                end: 2,
                time: 5 / 24,
            }))
            item.runAction(action)
        }
        bg.img_zw.run()

        var boy = bg.boy
        var eye = bg.item_eye
        boy.rootPos = boy.getPosition()
        setOff(boy, cc.p(-700, 0))
        boy.in = function() {
            var time = 10 / 24
            var boy = this
            addShowType({
                item: boy,
                show: "moveTo",
                buf: boy.rootPos,
                time: time,
                fun: function() {
                    eye.blink(2, function() {
                        if (fun) {
                            fun()
                        }
                        // var black = createLayout({
                        //     size: cc.director.getWinSize(),
                        //     color: cc.color(0, 0, 0, 255),
                        //     op: 255,
                        //     pos: cc.p(-1136 / 2, -640 / 2)
                        // })
                        // safeAdd(bg, black)
                        addShowType({
                            item: bg,
                            show: "fadeOut",
                            time: 0.5,
                        })
                    })
                }
            })
        }
        eye.blink = function(counts, fun) {
            var eye = this

            var first = 0
            var outCount = counts
            addTimer({
                fun: function(key) {
                    eye.showIndex(first)
                    first++;
                    if (first == 4) {
                        outCount--;
                        if (outCount == 0) {
                            removeTimer(key)
                            if (fun) {
                                fun()
                            }
                        }
                    }
                    first = first % 4
                },
                time: 1.5 / 24,
                repeat: cc.REPEAT_FOREVER,
                father: eye,
            })
        }
        var eyeList = [
            "eye1",
            "eye2",
            "eye3",
            "eye4",
        ]
        loadList(eye, eyeList)
        eye.showIndex = function(index) {
            for (var i = 0; i < eyeList.length; i++) {
                eye[eyeList[i]].setVisible(index == i)
            }
        }
        eye.showIndex(0)
        boy.in()
    },
    createBg2: function(fun) {
        var self = this
        var uiList = [
            "boy",
            "girl",
            "item_zw",
            "text_bg",
        ]
        var boyList = [
            "head",
            "eye",
            "mouse",
            "hand",
        ]
        var girlList = [
            "eye",
            "mouse",
        ]
        var bg = loadNode(res.xwj_act2, uiList)
        bg.text_bg.removeFromParent(true)
        var boy = bg.boy
        var girl = bg.girl
        var zw = bg.item_zw
        loadList(boy, boyList)
        loadList(girl, girlList)
        bg.setPosition(getMiddle())
        safeAdd(self, bg)
        girl.blink = function() {
            var boy = this
            var eye = boy.eye
            eye.stopAllActions()
            var count = Math.random() > 0.5 ? 1 : 2
            var action = cc.sequence(cc.delayTime(Math.random() * 1.0 + 0.5), cc.repeat(createAnimation({
                frame: "girl_eye_%02d.png",
                end: 8,
                time: 1 / 24,
            }), count), cc.callFunc(function() {
                boy.blink()
            }))
            eye.runAction(action)
        }
        boy.blink = function() {
            var boy = this
            var eye = boy.eye
            eye.stopAllActions()
            var count = Math.random() > 0.5 ? 1 : 2
            var action = cc.sequence(cc.delayTime(Math.random() * 1.0 + 0.5), cc.repeat(createAnimation({
                frame: "boy_eye_%02d.png",
                start: 8,
                end: 14,
                time: 1 / 24,
            }), count), cc.callFunc(function() {
                boy.blink()
            }))
            eye.runAction(action)
        }
        boy.handAct = function(key, fun) {
            var boy = this
            var hand = boy.hand
            var list = [
                [1, 4],
                [4, 12],
            ]
            var action = createAnimation({
                frame: "boy_hand_%02d.png",
                start: list[key][0],
                end: list[key][1],
                time: 1 / 24,
                fun: function() {
                    if (fun) {
                        fun()
                    }
                }
            })
            hand.runAction(action)
        }
        boy.say = function(judge) {
            var boy = this
            var mouse = boy.mouse
            mouse.stopAllActions()
            mouse.setSpriteFrame("boy_mouse_01.png")
            if (judge) {
                var action = cc.repeatForever(createAnimation({
                    frame: "boy_mouse_%02d.png",
                    end: 10,
                    time: 1 / 24,
                }))
                mouse.runAction(action)
            }
        }
        boy.headDown = function() {
            var boy = this
            var head = boy.head
            var buf = 5
            var time = 2 / 24
            addShowType({
                item: head,
                show: "rotateBy",
                buf: buf,
                time: time,
                fun: function() {
                    addShowType({
                        item: head,
                        show: "rotateBy",
                        buf: -buf,
                        time: time,
                        fun: function() {
                            addShowType({
                                item: head,
                                show: "rotateBy",
                                buf: buf,
                                time: time,
                                fun: function() {
                                    addShowType({
                                        item: head,
                                        show: "rotateBy",
                                        buf: -buf,
                                        time: time,
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        girl.say = function(judge) {
            var girl = this
            var mouse = girl.mouse
            mouse.stopAllActions()
            mouse.setSpriteFrame("girl_mouse_01.png")
            if (judge) {
                var action = cc.repeatForever(createAnimation({
                    frame: "girl_mouse_%02d.png",
                    end: 5,
                    time: 1 / 24,
                }))
                mouse.runAction(action)
            }
        }
        bg.setOpacity(0)
        addShowType({
            item: bg,
            show: "fadeIn",
            time: 0.5,
            fun: function() {

                zw.run = function() {
                    var item = this
                    var action = cc.repeatForever(createAnimation({
                        frame: "zw_%02d.png",
                        end: 2,
                        time: 10 / 24,
                    }))
                    item.runAction(action)
                }
                zw.run()
                boy.blink()
                girl.blink()
                boy.handAct(0)
                boy.say(true)
                self.showText(0, function() {
                    boy.say(false)
                    girl.say(true)
                    self.showText(1, function() {
                        girl.say(false)
                        boy.say(true)
                        boy.handAct(1)
                        addTimer({
                            fun: function(key) {
                                self.showXwj(true)
                                self.showText(4, null, true)
                                removeTimer(key)
                            },
                            time: 130 / 24,
                        })
                        self.showText(2, function() {
                            boy.say(false)
                            self.showXwj(false)
                            girl.say(true)
                            addTimer({
                                fun: function(key) {
                                    boy.headDown()
                                    removeTimer(key)
                                },
                                time: 5,
                            })
                            self.showText(3, function() {
                                girl.say(false)
                                func.changeLayer({
                                    out: self,
                                    in : layerControl.getLayer(self.jumpTolayer)
                                })
                            })
                        })
                    })
                })
            }
        })
    },
    showXwj: function(judge) {
        var self = this
        if (!self.xwj) {
            var item = new cc.Sprite("#img_xwj.png")
            item.setPosition(getMiddle(-200, 100))
            safeAdd(self, item)
            item.setScale(0)
            addShowType({
                item: item,
                show: "scaleTo",
                time: 0.5,
                buf: 0.6,
            })
            addShowType({
                item: item,
                show: "moveTo",
                time: 0.5,
                buf: getMiddle(-400, 200),
            })
            self.xwj = item
        }
        self.xwj.setVisible(judge)
    },
    showText: function(index, fun, nosound) {
        var self = this
        var textList = [
            "我妈妈告诉我土壤里面有很多微生物。",
            "有吗？我怎么都没有看到？",
            "那些微生物很小很小的，我们用肉眼看是看不见的。",
            "那显微镜就是能把很小很小的微生物放大的咯！",
            "要用显微镜才能看到的。"
        ]
        if (!self.textBg) {
            var uilist = [
                "text"
            ]
            var bg = loadNode(res.xwj_act2, uilist, "text_bg")
            self.textBg = bg
            bg.setPosition(getMiddle(-1136 / 2, -640 / 2))
            bg.setLocalZOrder(999)
            //bg.text.setTextColor(cc.color(255, 255, 255, 255))
            safeAdd(self, bg)
        }
        var bg = self.textBg
        var str = textList[index]
        var sound = res[sprintf("act%d", index + 1)]
        if (str) {
            bg.text.setString(str)
            bg.setVisible(true)
            if (sound && !nosound) {
                playMusicLoopCall({
                    music: sound,
                    fun: function() {
                        bg.setVisible(false)
                        if (fun) {
                            fun()
                        }
                    }
                })
            }
        } else {
            bg.setVisible(false)
        }
    },
})