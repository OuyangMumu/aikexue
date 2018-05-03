var speakTime = 0.04
var textList = [{
    str: "你们看！",
    pos: cc.p(353, 512),
    sound: res.action_sound1,
    size: 30,
    flip: true,
}, {
    str: "月亮看起来很\n像一把弓啊！",
    pos: cc.p(353, 512),
    sound: res.action_sound2,
    size: 30,
    flip: true,
}, {
    str: "月亮真的很像\n一把弓喔！",
    pos: cc.p(628, 506),
    sound: res.action_sound3,
    size: 30,
    flip: true,
}, {
    str: "中秋节的时候，我\n们看到的月亮明\n明就是圆圆的。",
    pos: cc.p(478, 471),
    sound: res.action_sound4,
    size: 30,
    flip: true,
}, {
    str: "为什么现在看到的\n却像一把弓呢？",
    pos: cc.p(478, 471),
    sound: res.action_sound5,
    size: 30,
    flip: true,
}, {
    str: "我也不知道为什么\n喔！我们明天一起\n去问问老师吧！",
    pos: cc.p(353, 512),
    sound: res.action_sound6,
    size: 30,
    flip: true,
}, ]
var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer: "mainLayer",
    load: function() {},
    ctor: function() {
        this._super()
        return true
    },
    onEnter: function() {
        this._super();
        var self = this
        self.createBg()

        var btn = new ccui.Button(res.img_skip_normal, res.img_skip_select)
        btn.setLocalZOrder(99)
        btn.setPosition(1050, 50)
        safeAdd(self, btn)
        btn.addClickEventListener(function() {
            func.changeLayer({
                out: self,
                in : layerControl.getLayer(self.jumpTolayer)
            })
        })
    },
    showText: function(index, fun) {
        var self = this
        if (!self.textBg) {
            var text = new cc.Sprite("#img_dhk.png")
            self.textBg = text
            safeAdd(self, text)
            text.setVisible(false)
            var size = text.getContentSize()
            text.addStr = function(str, tsize) {
                var text = this
                text.removeAllChildren(true)
                var label = new cc.LabelTTF(str, null, tsize)
                label.setColor(cc.color(0, 0, 0, 255))
                label.setPosition(size.width / 2, size.height / 2)
                safeAdd(text, label)
            }
            addMoving(text, true, true)
        }
        var bg = self.textBg
        var info = textList[index]
        var str = info.str
        var pos = info.pos
        var sound = info.sound
        var flip = info.flip
        var tsize = info.size
        bg.setVisible(true)
        bg.setPosition(pos)
        bg.setFlippedX(flip)
        bg.addStr(str, tsize)
        playMusicLoopCall({
            music: sound,
            times: 1,
            fun: function() {
                bg.setVisible(false)
                if (fun) {
                    fun()
                }
            }
        })
    },
    createBg: function() {
        var self = this
        var perTime = 1 / 24
        var uilist = [
            "girl",
            "boy1",
            "boy2",
            "cover"
        ]
        var bg = loadNode(res.action, uilist, "bg")
        bg.setPosition(getMiddle(0, 20))
        safeAdd(self, bg)
        var initShadow = function() {
            for (var i = 0; i < uilist.length; i++) {
                var shadow = bg[uilist[i]].getChildByName("shadow")
                if (shadow) {
                    shadow.setLocalZOrder(-1)
                    reAdd(shadow)
                }
            }
        }
        var girl = bg.girl
        var boy1 = bg.boy1
        var boy2 = bg.boy2
            //745 260  736 262
        var init = function() {
            girl.handUp = function(fun) {
                var girl = this
                girl.runAction(createAnimation({
                    frame: "yxbh_nh_%02d.png",
                    end: 25,
                    time: perTime,
                    fun: function() {
                        if (fun) {
                            fun()
                        }
                    }
                }))
            }
            girl.handDown = function(fun) {
                var girl = this
                girl.runAction(createAnimation({
                    frame: "yxbh_nh_%02d.png",
                    start: 26,
                    end: 50,
                    time: perTime,
                    fun: function() {
                        if (fun) {
                            fun()
                        }
                    }
                }))
            }
            girl.speak = function() {
                var girl = this
                girl.runAction(cc.repeatForever(createAnimation({
                    frame: "yxbh_nh_%02d.png",
                    start: 51,
                    end: 59,
                    time: perTime,
                })))
            }
            girl.stopSpeak = function() {
                var girl = this
                girl.stopAllActions()
                girl.setSpriteFrame("yxbh_nh_50.png")
            }
            boy1.uphand = function(fun) {
                var boy = this
                boy.runAction(createAnimation({
                    frame: "yxbh_b1_%02d.png",
                    end: 17,
                    time: perTime,
                    fun: function() {
                        if (fun) {
                            fun()
                        }
                    }
                }))
            }
            boy1.naotou = function() {
                var boy = this
                boy.runAction(cc.repeatForever(createAnimation({
                    frame: "yxbh_b1_%02d.png",
                    start: 17,
                    end: 18,
                    time: perTime * 4,
                })))
            }
            boy1.downHand = function() {
                var boy = this
                boy.stopAllActions()
                boy.runAction(createAnimation({
                    frame: "yxbh_b1_%02d.png",
                    start: 27,
                    end: 35,
                    time: perTime,
                }))
            }
            boy1.uphead = function() {
                var boy = this
                boy.setPositionX(606)
                boy.setSpriteFrame("yxbh_b1_35.png")
            }
            boy2.uphead = function() {
                var boy = this
                boy.setSpriteFrame("yxbh_b2_01.png")
                boy.setPosition(736, 262)
            }
            boy2.speak = function() {
                var boy = this
                boy.setPosition(745, 260)
                boy.runAction(cc.repeatForever(createAnimation({
                    frame: "yxbh_b2_%02d.png",
                    start: 10,
                    end: 11,
                    time: perTime * 4,
                })))
            }
            boy1.shakeHead = function() {
                var boy = this
                boy.runAction(cc.repeatForever(createAnimation({
                    frame: "yxbh_b12_%02d.png",
                    start: 1,
                    end: 8,
                    time: perTime,
                })))
            }
            boy2.shakeHead = function() {
                var boy = this
                boy.runAction(cc.repeatForever(createAnimation({
                    frame: "yxbh_b2_%02d.png",
                    start: 2,
                    end: 9,
                    time: perTime,
                })))
            }
            boy2.stopSpeak = function() {
                var boy = this
                boy.stopAllActions()
                boy.setSpriteFrame("yxbh_b2_10.png")
            }
        }
        init()
        initShadow()
        addShowType({
            item: bg.cover,
            show: "fadeOut",
            time: 1.0,
            fun: function() {
                girl.handUp(function() {
                    addTimer({
                        fun: function(key) {
                            removeTimer(key)
                            self.showText(0, function() {
                                girl.handDown(function() {
                                    girl.speak()
                                    self.showText(1, function() {
                                        girl.stopSpeak()
                                        boy2.speak()
                                        self.showText(2, function() {
                                            boy2.stopSpeak()
                                            boy1.uphand(function() {
                                                boy1.naotou()
                                                self.showText(3, function() {
                                                    boy1.downHand()
                                                    self.showText(4, function() {
                                                        girl.speak()
                                                        self.showText(5, function() {
                                                            girl.stopSpeak()
                                                            boy1.shakeHead()
                                                            boy2.shakeHead()
                                                            addShowType({
                                                                item: bg.cover,
                                                                show: "fadeIn",
                                                                time: 1.0,
                                                                fun: function() {
                                                                    func.changeLayer({
                                                                        out: self,
                                                                        in : layerControl.getLayer(self.jumpTolayer)
                                                                    })
                                                                }
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                            boy1.uphead()
                            boy2.uphead()
                        },
                        time: perTime * 8,
                    })
                })
            }
        })
    }
})