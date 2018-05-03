var speakTime = 0.04
var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer: "mainLayer",
    load: function() {
        loadPlist("img_gezi")
        loadPlist("img_boy")
        loadPlist("img_font")
    },
    ctor: function() {
        this._super();
        var self = this
        self.load()
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
        self.initScene()
        return true
    },
    showDrop: function(fun) {
        var self = this
        var uilist = [
            "drop1",
            "drop2",
            "drop3",
            "drop4",
            "drop5",
            "drop6",
        ]
        var fuList = [
            0, 1, 4, 5
        ]
        var dropList = [
            2, 3
        ]
        var runFu = function(data) {
            var item = data.item
            var buf = data.buf
            var time = data.time
            addShowType({
                item: item,
                show: "moveBackForever",
                buf: cc.p(0, buf),
                time: time,
            })
        }

        var runDrop = function(data) {
            var item = data.item
            var buf = data.buf
            var rotate = data.rotate
            var time1 = data.time1
            var time2 = data.time2
            var fun = data.fun
            addShowType({
                item: item,
                show: "rotateBy",
                buf: rotate,
                time: time1,
                fun: function(item) {
                    addShowType({
                        item: item,
                        show: "moveBy",
                        time: time2,
                        buf: buf,
                        fun: function() {
                            if (fun) {
                                fun()
                            }
                        }
                    })
                }
            })
        }
        var drop = loadNode(res.wtdcf_drop, uilist)
        drop.setPosition(getMiddle())
        for (var i = 0; i < fuList.length; i++) {
            var item = drop[uilist[fuList[i]]]
            var buf = -15 * Math.random() - 20
            var time = Math.abs(buf) / 30
            runFu({
                item: item,
                buf: buf,
                time: time,
            })
        }
        var rotateList = [-35, 30]
        var count = 0
        for (var i = 0; i < dropList.length; i++) {
            var item = drop[uilist[dropList[i]]]
            var buf = cc.p(0, -200)
            var rotate = rotateList[i]
            var time1 = Math.abs(rotate) / 60
            var time2 = 1
            runDrop({
                item: item,
                buf: buf,
                time1: time1,
                time2: time2,
                rotate: rotate,
                fun: function() {
                    count--
                    if (count == 0) {
                        if (self.drop) {
                            self.drop.setVisible(false)
                            if (fun) {
                                fun()
                            }
                        }
                    }
                }
            })
            count++
        }
        safeAdd(self, drop)
        self.drop = drop
    },
    say: function(index, fun) {
        var info = [{
            pos: cc.p(429, 428),
            sound: 1,
            key: 1,
            offset: cc.p(10, 0),
        }, {
            pos: cc.p(818, 466),
            sound: 2,
            key: 2,
            offset: cc.p(10, 0),
            scale: 0.8,
        }, {
            pos: cc.p(429, 428),
            sound: 3,
            key: 3,
            offset: cc.p(10, 0),
        }, {
            pos: cc.p(429, 428),
            sound: 5,
            key: 4,
            offset: cc.p(10, 0),
            scale: 0.7,
        }, {
            pos: cc.p(818, 466),
            sound: 6,
            key: 5,
            offset: cc.p(10, 0),
        }, ]
        var self = this
        if (!self.font_bg) {
            self.font_bg = new cc.Sprite("#img_kuang.png")
            safeAdd(self, self.font_bg)
            self.font_bg.addIndex = function(key, offset, scale) {
                var bg = this
                if (bg.img) {
                    bg.img.removeFromParent(true)
                }
                offset = offset || cc.p(0, 0)
                scale = scale || 1
                var img = new cc.Sprite(sprintf("#font%d.png", key))
                var size = bg.getContentSize()
                img.setPosition(size.width / 2 + offset.x, size.height / 2 + offset.y)
                img.setScale(scale)
                safeAdd(bg, img)
                bg.img = img
            }
        }
        var bg = self.font_bg
        var tempInfo = info[index]
        bg.addIndex(tempInfo.key, tempInfo.offset, tempInfo.scale)
        bg.setPosition(tempInfo.pos)
        bg.setVisible(true)
        playMusicLoopCall({
            music: res[sprintf("sound_act%d", tempInfo.sound)],
            fun: function() {
                bg.setVisible(false)
                if (fun) {
                    fun()
                }
            }
        })
    },
    initScene: function() {
        var self = this
        var img = new cc.Sprite(res.see_bg)
        img.setScale(0.8)
        img.setAnchorPoint(0, 1)
        safeAdd(self, img)
        var size = img.getContentSize()
        var dis = size.height - 1100
        var buf = cc.p(0, dis)
        var boat = createBoat()
            //boat.setScale(0.8)
        img.setPosition(-200, 640)
        boat.setPosition(getMiddle(0, -170 - dis))
        safeAdd(self, boat)
        boat.act({
            time: 1 / 24,
        })

        var boy = new cc.Sprite("#boy_24.png")
        boy.setPosition(168, 246)
        boat.addItem(boy)

        boy.upHead = function(fun) {
            var boy = this
            boy.runAction(createAnimation({
                frame: "boy_%02d.png",
                rever: true,
                start: 17,
                end: 24,
                time: 1 / 24,
                fun: function() {
                    if (fun) {
                        fun()
                    }
                }
            }))
        }

        boy.speak = function(judge) {
            var boy = this
            if (judge) {
                boy.runAction(cc.repeatForever(createAnimation({
                    frame: "boy_%02d.png",
                    end: 17,
                    time: 1 / 24,
                })))
            } else {
                boy.stopAllActions()
                boy.setSpriteFrame("boy_17.png")
            }
        }

        boy.actHand = function(judge) {
            var boy = this
            if (!boy.hand) {
                var hand = new cc.Sprite()
                hand.setPosition(179, -13)
                safeAdd(boy, hand)
                changeFather({
                    item: hand,
                    father: self,
                })
                boy.hand = hand
            }
            var hand = boy.hand
            if (judge) {
                hand.runAction(createAnimation({
                    frame: "boy_hand_%02d.png",
                    end: 22,
                    time: 1 / 24,
                }))
            }
            hand.setVisible(judge)
        }

        boy.headBack = function(fun) {
            var boy = this
            boy.runAction(createAnimation({
                frame: "boy_%02d.png",
                start: 50,
                end: 57,
                rever: true,
                time: 1 / 24,
                fun: function() {
                    boy.setSpriteFrame("boy_26.png")
                    boy.actHand(false)
                    boy.upHead(fun)
                }
            }))
        }

        var sb = new cc.Sprite(res.img_shubao)
        sb.setScale(0.28)
        sb.setRotation(200)
        sb.setPosition(240, 180)
        boat.addItem(sb)

        var createGezi = function() {
            var gezi = new cc.Sprite()
            gezi.runAction(cc.repeatForever(
                createAnimation({
                    frame: "img_gezi_%02d.png",
                    end: 8,
                    time: 1 / 24,
                })
            ))
            gezi.setRotation(60)
            return gezi
        }
        var geziPosList = [
            cc.p(400, 0),
            cc.p(500, 100),
            cc.p(600, -50),
        ]
        var count = 0
        var next = function() {
            addShowType({
                item: img,
                show: "moveBy",
                time: 2.0,
                buf: buf,
                fun: function(item) {
                    var dis = 1700 / 20
                    addShowType({
                        item: item,
                        show: "moveBy",
                        time: 4,
                        buf: cc.p(-dis * 4, 0),
                        fun: function() {
                            addShowType({
                                item: item,
                                show: "moveBy",
                                time: 10,
                                buf: cc.p(-dis * 10, 0),
                            })
                            boy.upHead(function() {
                                boy.speak(true)
                                self.say(0, function() {
                                    boy.speak(false)
                                    addTimer({
                                        fun: function(key) {
                                            removeTimer(key)
                                            boat.inPause()
                                            boat.say(true)
                                            self.say(1, function() {
                                                boat.say(false)
                                                boat.inResume()

                                                boy.speak(true)
                                                self.say(2, function() {
                                                    boy.speak(false)

                                                    boy.runAction(createAnimation({
                                                        frame: "boy_%02d.png",
                                                        time: 1 / 24,
                                                        callList: [{
                                                            start: 17,
                                                            end: 26,
                                                            fun: function() {
                                                                sb.setVisible(false)
                                                            }
                                                        }, {
                                                            start: 27,
                                                            end: 44,
                                                            fun: function() {
                                                                playMusic(res.sound_act4)
                                                                boy.actHand(true)
                                                            }
                                                        }, {
                                                            start: 45,
                                                            end: 66,
                                                            fun: function() {
                                                                self.showDrop(function() {
                                                                    boat.inStop()
                                                                    boy.headBack(function() {
                                                                        boy.speak(true)
                                                                        self.say(3, function() {
                                                                            boy.speak(false)
                                                                            boat.say(true)
                                                                            self.say(4, function() {
                                                                                boat.say(false)
                                                                                func.changeLayer({
                                                                                    out: self,
                                                                                    in : layerControl.getLayer(self.jumpTolayer)
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            }
                                                        }, ]
                                                    }))
                                                })
                                            })
                                        },
                                        time: 1.0,
                                        repeat: 1,
                                    })
                                })
                            })
                        }
                    })
                }
            })
            addShowType({
                item: boat,
                show: "moveBy",
                time: 2.0,
                buf: buf,
            })
        }
        for (var i = 0; i < 3; i++) {
            var gezi = createGezi()
            gezi.setPosition(geziPosList[i])
            addShowType({
                item: gezi,
                show: "moveBy",
                time: 3.0,
                buf: cc.p(900, 900),
                fun: function() {
                    count--
                    if (count == 0) {
                        next()
                    }
                }
            })
            safeAdd(self, gezi)
            count++
        }
    },
})