var speakTime = 0.04
var textList = [
    "不要碰它，小心它叮你喔！",
    "可是它在我耳边嗡嗡叫，好吵喔！",
    "嗡嗡嗡不是蜜蜂在叫，是蜜蜂飞的时候翅膀上下振动的声音！",
    "喔！原来是这样！那蚊子的嗡嗡声也是翅膀拍打的声音喽？",
    "是呀！宝贝真聪明！"
]
var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer: "mainLayer",
    load: function() {},
    ctor: function() {
        this._super();
        var self = this
        self.createBg1(function() {
            self.createBg2()
        })
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
        return true
    },
    showText:function(str){
        var self = this
        if(!self.textBg){
            var uilist = [
                "text_bg",
                "text"
            ]
            var bg = loadNode(res.action, uilist, "text_bg")
            self.textBg = bg
            bg.setLocalZOrder(99)
            safeAdd(self, bg)
        }
        var bg = self.textBg
        if(str){
            bg.text.setString(str)
            bg.setVisible(true)
        }else{
            bg.setVisible(false)
        }
    },
    createBg1: function(fun) {
        addKey("judgeBg1Start")
        var self = this
        var uiList = [
            "light",
            "bird_1",
            "bird_2",
            "son_father",
        ]
        var bg1 = loadNode(res.action, uiList, "bg1")

        bg1.init = function() {
            var bg1 = this
            var size = bg1.getContentSize()
            var dis = size.height
            var speedPerSec = 400
            var allTime = dis / speedPerSec
            var delay = 1.5


            bg1.birdInfo = [{
                buf: cc.p(-1200, 600),
                time: 3.0,
                per: 0.04,
                item: bg1.bird_1,
            }, {
                buf: cc.p(1000, 200),
                time: 3.0,
                per: 0.06,
                item: bg1.bird_2
            }, ]

            bg1.ani_bird = function(data) {
                var item = data.item
                var buf = data.buf
                var time = data.time
                var per = data.per
                var ani = cc.repeatForever(
                    createAnimation({
                        frame: "bird_move_%02d.png",
                        end: 12,
                        time: per,
                    }))
                item.runAction(ani)
                addShowType({
                    item: item,
                    buf: buf,
                    time: time,
                    show: "moveBy",
                    fun: function(item) {
                        item.stopAllActions()
                    }
                })
            }
            bg1.showLight = function() {
                addShowType({
                    item: bg1.light,
                    buf: 60,
                    time: 15.0,
                    show: "rotateBy",
                })
            }
            bg1.showBird = function() {
                for (var i = 0; i < bg1.birdInfo.length; i++) {
                    bg1.ani_bird(bg1.birdInfo[i])
                }
            }
            bg1.peopleIn = function() {
                var pers = bg1.son_father
                var uilist = [
                    "son",
                    "father",
                ]
                loadList(pers, uilist)
                var aniInfo = [{
                    frame: "son_move_%02d.png",
                    end: 24,
                    time: 1 / 24,
                    item: pers.son,
                }, {
                    frame: "father_move_%02d.png",
                    end: 24,
                    time: 1 / 24,
                    item: pers.father
                }, ]

                for (var i = 0; i < aniInfo.length; i++) {
                    aniInfo[i].item.runAction(cc.repeatForever(
                        createAnimation({
                            frame: aniInfo[i].frame,
                            end: aniInfo[i].end,
                            time: aniInfo[i].time,
                        })
                    ))
                }
                addShowType({
                    item: pers,
                    show: "moveBy",
                    buf: cc.p(-800, -70),
                    time: 5.0,
                    fun: function() {
                        cc.log("end bg1")
                        if (fun) {
                            fun()
                        }
                        bg1.removeFromParent(true)
                        bg1 = null
                    }
                })
            }

            bg1.moveDown = function() {
                bg1.showLight()
                bg1.showBird()
                bg1.showBees()
                addShowType({
                    item: bg1,
                    show: "moveTo",
                    buf: cc.p(0, dis),
                    time: allTime,
                    delay: delay,
                    fun: function() {
                        bg1.peopleIn()
                    }
                })
                addTimer({
                    fun: function() {
                        playEffect(res.sound_bee)
                    },
                    time: allTime * 0.7,
                    delay: delay,
                    father: self,
                })
            }
            bg1.showBees = function() {
                var stayBeeList = [
                    cc.p(60, 60),
                    cc.p(200, 100),
                    cc.p(400, 60),
                    cc.p(500, 200),
                    cc.p(700, 260)
                ]
                for (var i = 0; i < stayBeeList.length; i++) {
                    var bee = self.createBee({
                        type: "stay",
                        buf: stayBeeList[i],
                    })
                    safeAdd(bg1, bee)
                }

                var flyBeeList = [
                    [cc.p(Math.random() * 160 + 160, Math.random() * 60 + 60),
                        cc.p(Math.random() * 160 + 720, Math.random() * 100 + 200)
                    ],
                    [cc.p(Math.random() * 160 + 160, Math.random() * 60 + 60),
                        cc.p(Math.random() * 160 + 720, Math.random() * 100 + 200)
                    ],
                    [cc.p(Math.random() * 160 + 160, Math.random() * 60 + 60),
                        cc.p(Math.random() * 160 + 720, Math.random() * 100 + 200)
                    ],
                    [cc.p(Math.random() * 160 + 160, Math.random() * 60 + 60),
                        cc.p(Math.random() * 160 + 720, Math.random() * 100 + 200)
                    ],
                ]
                for (var i = 0; i < flyBeeList.length; i++) {
                    var bee = self.createBee({
                        type: "fly",
                        buf: flyBeeList[i],
                        judgeFun: function() {
                            if (!bg1) {
                                return false
                            }
                            return true
                        }
                    })
                    safeAdd(bg1, bee)
                }
            }
        }
        bg1.init()
        bg1.moveDown()
        safeAdd(self, bg1)
        addKey("judgeBg1End")
    },
    createBee: function(data) {
        var self = this
        var type = data.type
        var buf = data.buf
        var judgeFun = data.judgeFun
        var bee = null

        var aniStay = function() {
            var ani = cc.repeatForever(createAnimation({
                frame: "bee%02d.png",
                start: 2,
                end: 3,
                time: 0.02,
            }))
            return ani
        }

        var flyInRect = function(data) {
            var item = data.item
            var rect = data.rect
            var judgeFun = data.judgeFun
            var rootX = Math.random()
            var rootY = Math.random()
            item.modify = rect[0]
            item.rectWidth = rect[1].x - rect[0].x
            item.rectHeight = rect[1].y - rect[0].y
            var pos = cc.p(rootX * item.rectWidth, rootY * item.rectHeight)
            item.setPosition(item.modify.x + pos.x, item.modify.y + pos.y)
            var rotate = Math.random() * 360
                //item.setRotation(rotate)
            item.rotate = rotate
            item.setFlippedX(rotate > 90 && rotate < 270)
            item.speed = Math.random() * 5 + 10
            item.judge = function(delta) {
                delta = delta || cc.p(0, 0)
                if ((item.x + delta.x < item.modify.x || item.x + delta.x > item.modify.x + item.rectWidth) ||
                    (item.y + delta.y < item.modify.y || item.y + delta.y > item.modify.y + item.rectHeight)) {
                    return false
                }
                return true
            }
            item.getMixy = function(minus) {
                minus = minus || 1
                var miy = Math.sin(item.rotate / 180 * Math.PI) * item.speed
                var mix = Math.cos(item.rotate / 180 * Math.PI) * item.speed
                return {
                    x: mix * minus,
                    y: miy * minus
                }
            }
            addTimer({
                fun: function(key) {
                    if (judgeFun && !judgeFun()) {
                        removeTimer(key)
                        return
                    }
                    if (item.judge()) {
                        var mix = item.getMixy()
                        item.x += mix.x
                        item.y += mix.y
                    } else {
                        item.rotate = Math.random() * 360
                        while (!item.judge(item.getMixy(5))) {
                            item.rotate = Math.random() * 360
                        }
                        item.setFlippedX(item.rotate > 90 && item.rotate < 270)
                        item.setRotation(Math.random() * 20 - 10)
                        var mix = item.getMixy()
                        item.x += mix.x
                        item.y += mix.y
                    }
                },
                time: 0.05,
                repeat: cc.REPEAT_FOREVER,
                father: self,
            })
        }

        switch (type) {
            case "fly":
                bee = new cc.Sprite("#bee01.png")
                flyInRect({
                    item: bee,
                    rect: buf,
                    judgeFun: judgeFun,
                })
                bee.setScale(0.15 + Math.random() * 0.05)
                break
            case "stay":
                bee = new cc.Sprite()
                bee.setScale(0.15 + Math.random() * 0.05)
                bee.runAction(aniStay())
                bee.setPosition(buf)
                bee.setFlippedX(Math.random() > 0.5)
                break
        }

        return bee
    },
    createBg2: function(fun) {
        addKey("judgeBg2Start")
        var self = this
        var uiList = [
            "boy",
            "father",
        ]
        var bg2 = loadNode(res.action, uiList, "bg2")
        self.bg2 = bg2
        bg2.init = function() {
            var bg2 = this
            var boyList = [
                "hand1",
                "hand2",
                "hand3",
                "hand4",
                "hand5",
                "head1",
                "head2"
            ]
            var handList = [
                "hand1",
                "hand2",
                "hand3",
                "hand4",
                "hand5",
            ]
            var fatherList = [
                "eye",
                "mouse"
            ]
            var head1List = [
                "eye"
            ]
            var head2List = [
                "eye",
                "mouse"
            ]
            bg2.getBoy = function() {
                var boy = bg2.boy
                loadList(boy, boyList)
                for (var i = 0; i < handList.length; i++) {
                    var item = boy[handList[i]]
                    item.setLocalZOrder(-1)
                    reAdd(item)
                }
                boy.hand2.setVisible(false)
                boy.hand3.setVisible(false)
                boy.hand4.setVisible(false)
                boy.hand5.setVisible(false)
                var head1 = boy.head1
                var head2 = boy.head2
                loadList(head1, head1List)
                loadList(head2, head2List)
            }
            bg2.boyH1Blink = function() {
                bg2.boy.head1.setVisible(true)
                bg2.boy.head2.setVisible(false)
                var eye1 = bg2.boy.head1.eye
                var aniBoyEye1 = function(item) {
                    var ani = cc.sequence(
                        createAnimation({
                            frame: "boy_eye_%02d.png",
                            start: 1,
                            time: 0.05,
                            end: 4,
                        }),
                        createAnimation({
                            frame: "boy_eye_%02d.png",
                            start: 1,
                            end: 4,
                            time: 0.05,
                            rever: true,
                        }), cc.delayTime(Math.random() * 1.0 + 0.3),
                        cc.callFunc(function() {
                            item.runAction(aniBoyEye1(item))
                        })
                    )
                    return ani
                }
                eye1.runAction(aniBoyEye1(eye1))
            }
            bg2.boyH2Blink = function() {
                bg2.boy.head2.setVisible(true)
                bg2.boy.head1.setVisible(false)
                var eye2 = bg2.boy.head2.eye
                var aniBoyEye2 = function(item) {
                    var ani = cc.sequence(
                        createAnimation({
                            frame: "boy_eye_%02d.png",
                            start: 11,
                            time: 0.05,
                            end: 14,
                        }),
                        createAnimation({
                            frame: "boy_eye_%02d.png",
                            start: 11,
                            end: 14,
                            time: 0.05,
                            rever: true,
                        }), cc.delayTime(Math.random() * 1.0 + 0.3),
                        cc.callFunc(function() {
                            item.runAction(aniBoyEye2(item))
                        })
                    )
                    return ani
                }
                eye2.runAction(aniBoyEye2(eye2))
            }
            bg2.boyHandUp = function(delay, fun) {
                var boy = bg2.boy
                var curCount = 0
                var time = 0.15
                addTimer({
                    fun: function(key) {
                        if (curCount < handList.length) {
                            bg2.setHand(curCount)
                            curCount++
                        }
                        if (curCount >= handList.length) {
                            removeTimer(key)
                            if (fun) {
                                fun()
                                fun = null
                            }
                        }
                    },
                    time: time,
                    repeat: handList.length,
                    father: self,
                    delay: delay,
                })
            }
            bg2.setHand = function(index) {
                var boy = bg2.boy
                for (var i = 0; i < handList.length; i++) {
                    var hand = boy[handList[i]]
                    hand.setVisible(i == index)
                }
            }
            bg2.showBees = function() {
                var stayBeeList = [
                    cc.p(212, 143),
                    cc.p(482, 116),
                    cc.p(558, 355),
                    cc.p(653, 39),
                    cc.p(915, 234)
                ]
                for (var i = 0; i < stayBeeList.length; i++) {
                    var bee = self.createBee({
                        type: "stay",
                        buf: stayBeeList[i],
                    })
                    bee.setScale(0.3 + Math.random() * 0.1)
                    safeAdd(bg2, bee)
                }

                var flyBeeList = [
                    [cc.p(Math.random() * 10 + 10, Math.random() * 10 + 10),
                        cc.p(Math.random() * 360 + 720, Math.random() * 100 + 200)
                    ],
                    [cc.p(Math.random() * 10 + 10, Math.random() * 10 + 10),
                        cc.p(Math.random() * 360 + 720, Math.random() * 100 + 200)
                    ],
                    [cc.p(Math.random() * 10 + 10, Math.random() * 10 + 10),
                        cc.p(Math.random() * 360 + 720, Math.random() * 100 + 200)
                    ],
                    [cc.p(Math.random() * 10 + 10, Math.random() * 10 + 10),
                        cc.p(Math.random() * 360 + 720, Math.random() * 100 + 200)
                    ],
                ]
                for (var i = 0; i < flyBeeList.length; i++) {
                    var bee = self.createBee({
                        type: "fly",
                        buf: flyBeeList[i],
                        judgeFun: function() {
                            if (!self.bg2) {
                                return false
                            }
                            return true
                        }
                    })
                    bee.setScale(0.3 + Math.random() * 0.1)
                    safeAdd(bg2, bee)
                }
            }
            bg2.fatherBlink = function() {
                var eye = bg2.father.eye
                var aniFatherEye = function(item) {
                    var ani = cc.sequence(
                        createAnimation({
                            frame: "baba_eye_%02d.png",
                            start: 1,
                            time: 0.05,
                            end: 3,
                        }),
                        createAnimation({
                            frame: "baba_eye_%02d.png",
                            start: 1,
                            end: 3,
                            time: 0.05,
                            rever: true,
                        }), cc.delayTime(Math.random() * 1.5 + 0.3),
                        cc.callFunc(function() {
                            item.runAction(aniFatherEye(item))
                        })
                    )
                    return ani
                }
                eye.runAction(aniFatherEye(eye))
            }
            bg2.fatherSay = function(sound, fun) {
                var ani = cc.repeatForever(createAnimation({
                    frame: "baba_mouse_%02d.png",
                    end: 9,
                    time: speakTime,
                }))
                var mouse = bg2.father.mouse
                mouse.stopAllActions()
                mouse.runAction(ani)
                playMusicLoopCall({
                    music: sound,
                    fun: function() {
                        mouse.stopAllActions()
                        mouse.setSpriteFrame("baba_mouse_01.png")
                        if (fun) {
                            fun()
                        }
                    }
                })
            }
            bg2.boySay = function(sound, fun) {
                var ani = cc.repeatForever(createAnimation({
                    frame: "boy_mouse_%02d.png",
                    end: 9,
                    time: speakTime,
                }))
                var mouse = bg2.boy.head2.mouse
                mouse.stopAllActions()
                mouse.runAction(ani)
                playMusicLoopCall({
                    music: sound,
                    fun: function() {
                        mouse.stopAllActions()
                        mouse.setSpriteFrame("boy_mouse_01.png")
                        if (fun) {
                            fun()
                        }
                    }
                })
            }
            loadList(bg2.father, fatherList)
            playEffect(res.sound_bee, true)
            cc.audioEngine.setEffectsVolume(IF_SOUND_ON ? 0.5 : 0)
            bg2.getBoy()
            bg2.boyH1Blink()
            bg2.boyHandUp(1.5, function() {
                self.showText(textList[0])
                self.createBg3(res.action_sound1, function() {
                    bg2.setHand(0)
                    bg2.boyH2Blink()
                    self.showText(textList[1])
                    bg2.boySay(res.action_sound2, function() {
                        self.showText(textList[2])
                        self.createBg3(res.action_sound3, function() {
                            self.showText(textList[3])
                            bg2.boySay(res.action_sound4, function() {
                                self.showText(textList[4])
                                bg2.fatherSay(res.action_sound5, function() {
                                    self.bg1 = null
                                    self.bg2 = null
                                    self.bg3 = null
                                    stopEffect()
                                    func.changeLayer({
                                        out: self,
                                        in : layerControl.getLayer(self.jumpTolayer)
                                    })
                                })
                            })
                        })
                    })
                })
            })
            bg2.showBees()
            bg2.fatherBlink()
        }
        bg2.init()
        safeAdd(self, bg2)
        addKey("judgeBg2End")
    },
    createBg3: function(sound, fun) {
        addKey("judgeBg3Start")
        var self = this
        self.curFun = fun
        if (!self.bg3) {
            var uiList = [
                "father",
            ]
            var bg3 = loadNode(res.action, uiList, "bg3")
            var fatherList = [
                "eye",
                "mouse"
            ]
            loadList(bg3.father, fatherList)
            bg3.fatherBlink = function() {
                var eye = bg3.father.eye
                var aniFatherEye = function(item) {
                    var ani = cc.sequence(
                        createAnimation({
                            frame: "baba_eye_%02d.png",
                            start: 1,
                            time: 0.05,
                            end: 3,
                        }),
                        createAnimation({
                            frame: "baba_eye_%02d.png",
                            start: 1,
                            end: 3,
                            time: 0.05,
                            rever: true,
                        }), cc.delayTime(Math.random() * 1.5 + 0.3),
                        cc.callFunc(function() {
                            item.runAction(aniFatherEye(item))
                        })
                    )
                    return ani
                }
                eye.runAction(aniFatherEye(eye))
            }
            bg3.fatherSay = function(sound) {
                var ani = cc.repeatForever(createAnimation({
                    frame: "baba_mouse_%02d.png",
                    end: 9,
                    time: speakTime,
                }))
                bg3.setVisible(true)
                var mouse = bg3.father.mouse
                mouse.stopAllActions()
                mouse.runAction(ani)
                playMusicLoopCall({
                    music: sound,
                    fun: function() {
                        mouse.stopAllActions()
                        mouse.setSpriteFrame("baba_mouse_01.png")
                        bg3.setVisible(false)
                        if (self.curFun) {
                            var fun = self.curFun
                            self.curFun = null
                            fun()
                        }
                    }
                })
            }
            bg3.showBees = function() {
                var stayBeeList = [
                    cc.p(212, 80),
                    cc.p(335, 116),
                    cc.p(660, 212),
                    cc.p(456, 39),
                    cc.p(850, 156)
                ]
                for (var i = 0; i < stayBeeList.length; i++) {
                    var bee = self.createBee({
                        type: "stay",
                        buf: stayBeeList[i],
                    })
                    bee.setScale(0.3 + Math.random() * 0.1)
                    safeAdd(bg3, bee)
                }

                var flyBeeList = [
                    [cc.p(Math.random() * 10 + 10, Math.random() * 10 + 10),
                        cc.p(Math.random() * 360 + 720, Math.random() * 100 + 200)
                    ],
                    [cc.p(Math.random() * 10 + 10, Math.random() * 10 + 10),
                        cc.p(Math.random() * 360 + 720, Math.random() * 100 + 200)
                    ],
                    [cc.p(Math.random() * 10 + 10, Math.random() * 10 + 10),
                        cc.p(Math.random() * 360 + 720, Math.random() * 100 + 200)
                    ],
                    [cc.p(Math.random() * 10 + 10, Math.random() * 10 + 10),
                        cc.p(Math.random() * 360 + 720, Math.random() * 100 + 200)
                    ],
                ]
                for (var i = 0; i < flyBeeList.length; i++) {
                    var bee = self.createBee({
                        type: "fly",
                        buf: flyBeeList[i],
                        judgeFun: function() {
                            if (!self.bg3) {
                                return false
                            }
                            return true
                        }
                    })
                    bee.setScale(0.3 + Math.random() * 0.1)
                    safeAdd(bg3, bee)
                }
            }
            bg3.fatherBlink()
            bg3.setVisible(false)
            bg3.showBees()
            safeAdd(self, bg3)
            self.bg3 = bg3
        }
        self.bg3.fatherSay(sound)
        addKey("judgeBg3End")
    }
})