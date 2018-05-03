var perTime = 1 / 24
var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer: "mainLayer",
    load: function() {
        loadPlist("dialog")
    },
    ctor: function() {
        this.load()
        this._super();
        return true
    },
    myEnter: function() {
        this._super()
        var self = this
        var btn = new ccui.Button(res.img_skip_normal, res.img_skip_select)
        btn.setPosition(1050, 50)
        btn.setLocalZOrder(99)
        safeAdd(self, btn)
        btn.addClickEventListener(function() {
            func.changeLayer({
                out: self,
                in : layerControl.getLayer(self.jumpTolayer)
            })
        })
        self.showBg1(function() { //两军对战
            self.showBg2(function() { //地道
                self.showBg3(1, function() { //地下挖
                    self.showBg4(1, function() { //据探子回报
                        self.showBg3(2, function() { //听觉灵敏
                            self.showBg4(2, function() { //判断方位
                                self.showBg3(3, function() { //挖破地道
                                    self.showBg3(4) //哈哈哈哈哈哈
                                })
                            })
                        })
                    })
                })
            })
        })  
    },
    showBg1: function(fun, disShow) {
        addKey("judgeBg1Start")
        disShow = disShow || false
        var self = this
        var uilist = [
            "sky",
            "shan1",
            "shan2",
            "item_jd1",
            "item_jd2",
            "img_cc",
            "gas"
        ]
        var bg = loadNode(res.action1, uilist, "bg1")
        bg.setCascadeOpacityEnabled(true)
        bg.sky.setLocalZOrder(-1)
        reAdd(bg.sky)
        safeAdd(self, bg)
        var sceneMove = 100
        var cq = bg.img_cc
        var gas = bg.gas
        var shan1 = bg.shan1
        var shan2 = bg.shan2
        var sky = bg.sky
        var jd1 = bg.item_jd1
        var jd2 = bg.item_jd2
        var aniList = [{
            item: sky,
            time: 104,
            show: "moveBy",
            buf: cc.p(0, sceneMove),
        }, {
            item: bg,
            time: 104,
            show: "moveBy",
            buf: cc.p(0, -sceneMove),
        }, {
            item: shan1,
            show: "scaleTo",
            buf: 1.2,
            time: 104,
        }, {
            item: shan2,
            show: "scaleTo",
            buf: 1.2,
            time: 104,
        }, {
            item: cq,
            show: "tintTo",
            time: 30,
            buf: cc.color(255, 255, 255),
        }, {
            item: gas,
            show: "moveBy",
            time: 74,
            delay: 30,
            buf: cc.p(800, 0),
        }, {
            item: gas,
            show: "scaleTo",
            time: 74,
            delay: 30,
            buf: 3,
        }, {
            item: cq,
            show: "scaleTo",
            time: 71,
            buf: 5,
        }, {
            item: cq,
            show: "moveBy",
            time: 71,
            buf: cc.p(0, -2000),
            fun: function() {
                self.showDialog(0)
            }
        }, {
            item: jd1,
            show: "scaleTo",
            time: 104,
            buf: 1.5,
        }, {
            item: jd2,
            show: "scaleTo",
            time: 104,
            buf: 1.5,
            fun: function() {
                if (fun) {
                    fun()
                }
                bg.removeFromParent(true)
            }
        }, {
            item: bg,
            show: "fadeOut",
            time: 14,
            delay: 104,
        }]
        if (!disShow) {
            bg.setVisible(true)
            for (var i = 0; i < aniList.length; i++) {
                var info = aniList[i]
                addShowType({
                    item: info.item,
                    show: info.show,
                    time: info.time * perTime,
                    delay: (info.delay ? info.delay : 0) * perTime,
                    buf: info.buf,
                    fun: info.fun,
                })
            }
        }else{
            bg.setVisible(false)
        }
        addKey("judgeBg1End")
    },
    showBg2: function(fun, disShow) {
        addKey("judgeBg2Start")
        var self = this
        disShow = disShow || false
        var uilist = [
            "act_dmfg",
            "army_dj",
            "think",
        ]
        var jdCount = 12
        for (var i = 1; i <= jdCount; i++) {
            uilist[uilist.length] = sprintf("jd%d", i)
        }
        var bg = loadNode(res.action2, uilist, "bg2")
        bg.setCascadeOpacityEnabled(true)
        var jdList = [
            "flag"
        ]
        var army_dj = bg.army_dj
        var dmfg = bg.act_dmfg
        for (var i = 1; i <= jdCount; i++) {
            var jd = bg[sprintf("jd%d", i)]
            if (jd) {
                cc.log(i)
                loadList(jd, jdList)
            }
        }
        var thinkList = [
            "think_qp1",
            "think_qp2",
            "think_qp3",
            "think_qp4",
            "army_dd",
        ]
        loadList(bg.think, thinkList)

        bg.init = function() {
            var bg = this
            var qpList = [
                bg.think.think_qp1,
                bg.think.think_qp2,
                bg.think.think_qp3,
                bg.think.think_qp4,
            ]
            var dd = bg.think.army_dd
            for (var i = 0; i < qpList.length; i++) {
                qpList[i].setVisible(false)
            }
            dmfg.runAction(cc.repeatForever(
                createAnimation({
                    frame: "dmfg_%02d.png",
                    end: 10,
                    time: perTime,
                })))
            bg.think.think_qp4.show = function() {
                var qp = this
                qp.setScale(0)
                addShowType({
                    item: qp,
                    show: "scale",
                    fun: function() {
                        self.showDialog(1, function() {
                            addShowType({
                                item: bg,
                                show: "moveBy",
                                buf: cc.p(-550, 0),
                                time: perTime * 40,
                                fun: function() {
                                    if (fun) {
                                        fun()
                                    }
                                    bg.removeFromParent(true)
                                }
                            })
                        })
                        addShowType({
                            item: bg,
                            show: "scaleTo",
                            buf: 3,
                            time: perTime * 12,
                        })
                        dd.runAction(createAnimation({
                            frame: "army_dd_%02d.png",
                            end: 30,
                            time: perTime * 4,
                            fun: function() {
                                bg.stopAllActions()
                                addShowType({
                                    item: bg,
                                    show: "scaleTo",
                                    buf: 1,
                                    time: perTime * 12,
                                    fun: function() {
                                        addShowType({
                                            item: qp,
                                            show: "zoom",
                                            time: perTime * 6,
                                            fun: function() {
                                                for (var i = 0; i < qpList.length; i++) {
                                                    qpList[i].setVisible(false)
                                                }
                                            }
                                        })
                                    }
                                })
                                army_dj.runAction(
                                    createAnimation({
                                        frame: "army_dj_%02d.png",
                                        end: 46,
                                        time: perTime,
                                    }))
                            }
                        }))
                    },
                    time: perTime * 6
                })
            }
            for (var i = 1; i <= jdCount; i++) {
                var jd = bg[sprintf("jd%d", i)]
                if (jd) {
                    jd.flag.runAction(cc.repeatForever(
                        createAnimation({
                            frame: "flag1_%02d.png",
                            end: 7,
                            time: perTime * (0.5 + Math.random() * 0.5) * 2,
                        })))
                }
            }
            bg.show = function() {
                var bg = this
                addShowType({
                    show: "fadeIn",
                    time: perTime * 14,
                    item: bg,
                })
                addShowType({
                    show: "moveBy",
                    time: perTime * 50,
                    item: bg,
                    buf: cc.p(0, -450),
                    fun: function() {
                        var count = 0
                        addTimer({
                            fun: function(key) {
                                if (count < qpList.length) {
                                    qpList[count].setVisible(true)
                                    if (qpList[count].show) {
                                        qpList[count].show()
                                    }
                                } else {
                                    removeTimer(key)
                                }
                                count++
                            },
                            time: perTime * 3,
                            repeat: cc.REPEAT_FOREVER,
                            father: self,
                        })
                    }
                })
            }
            bg.setOpacity(0)
            safeAdd(self, bg)
        }
        if(!disShow){
            bg.setVisible(true)
            bg.init()
            bg.show()
        }else{
            bg.setVisible(false)
        }
        addKey("judgeBg2End")
    },
    showBg3: function(index, fun, disShow) {
        var self = this
        addKey("judgeBg3Start")
        disShow = disShow || false
        if (!self.bg3) {
            var uilist = [
                "falls",
                "deco",
                "scene1",
                "scene2",
                "scene3",
                "scene4",
            ]
            var bg = loadNode(res.action3, uilist, "bg3")
            bg.setCascadeOpacityEnabled(true)
            bg.init = function() {
                var bg = this
                bg.ifInit = true
                var initDeco = function() {
                    bg.deco.setLocalZOrder(-1)
                    reAdd(bg.deco)
                }
                var initFalls = function() {
                    var fallList = []
                    var fallCount = 9
                    for (var i = 1; i <= fallCount; i++) {
                        fallList[fallList.length] = sprintf("fall%d", i)
                    }
                    loadList(bg.falls, fallList)
                    for (var i = 1; i <= fallCount; i++) {
                        var fall = bg.falls[sprintf("fall%d", i)]
                        var act = function() {
                            var fall = this
                            fall.runAction(
                                cc.sequence(
                                    createAnimation({
                                        frame: "fall_%02d.png",
                                        end: 10,
                                        time: perTime * 3,
                                    }),
                                    cc.delayTime(Math.random() * 1.0),
                                    cc.callFunc(function() {
                                        fall.act()
                                    })
                                )
                            )
                        }
                        fall.act = act
                        fall.act()
                    }
                }
                var initScene1 = function() {
                    var scene1List = [
                        "army1",
                        "army2",
                    ]
                    loadList(bg.scene1, scene1List)
                    var armyAct = function() {
                        var army = this
                        var dirt = army.getChildByName("dirt")
                        army.runAction(
                            cc.repeatForever(
                                createAnimation({
                                    frame: "army_down_%02d.png",
                                    end: 17,
                                    time: perTime,
                                })
                            )
                        )
                        dirt.runAction(
                            cc.repeatForever(
                                cc.sequence(
                                    cc.delayTime(perTime * 7),
                                    cc.callFunc(function() {
                                        if (bg.sounding) {
                                            playEffect(res.sydcb_action_sound_03)
                                        }
                                    }),
                                    createAnimation({
                                        frame: "dirt_%02d.png",
                                        end: 10,
                                        time: perTime,
                                    })
                                )
                            )
                        )
                    }
                    bg.scene1.army1.armyAct = armyAct
                    bg.scene1.army2.armyAct = armyAct
                    bg.scene1.army1.armyAct()
                    bg.scene1.army2.armyAct()
                }
                var initScene2 = function() {
                    var scene2List = [
                        "sound1",
                        "sound2",
                        "junshi",
                        "item_tz",
                    ]
                    loadList(bg.scene2, scene2List)
                    var sound_ani = function() {
                        var ani = cc.repeatForever(
                            createAnimation({
                                frame: "sound_%02d.png",
                                end: 29,
                                time: perTime,
                            })
                        )
                        return ani
                    }
                    var scene2 = bg.scene2
                    scene2.sound1.runAction(sound_ani())
                    scene2.sound2.runAction(sound_ani())

                    bg.actScene2 = function() {
                        var js = bg.scene2.junshi
                        js.runAction(createAnimation({
                            frame: "junshi5_%02d.png",
                            end: 15,
                            fun: function() {
                                js.runAction(createAnimation({
                                    frame: "junshi5_%02d.png",
                                    start: 16,
                                    end: 90,
                                    time: perTime,
                                }))
                                self.showDialog(5, function() {
                                    bg.sounding = false
                                    bg.setVisible(false)
                                    if (bg.curFun) {
                                        var fun = bg.curFun
                                        bg.curFun = null
                                        fun()
                                    }
                                })
                            },
                            time: perTime,
                        }))
                    }
                }
                var initScene3 = function() {
                    var scene3List = [
                        "we1",
                        "we2",
                    ]
                    loadList(bg.scene3, scene3List)
                    var weAct = function() {
                        var we = this
                        var dirt = we.getChildByName("dirt")
                        we.runAction(
                            cc.repeatForever(
                                createAnimation({
                                    frame: "we_down_%02d.png",
                                    end: 13,
                                    time: perTime,
                                })
                            )
                        )
                        dirt.runAction(
                            cc.repeatForever(
                                cc.sequence(
                                    cc.delayTime(perTime * 7),
                                    cc.callFunc(function() {
                                        if (bg.sounding2) {
                                            playEffect(res.sydcb_action_sound_03)
                                        }
                                    }),
                                    createAnimation({
                                        frame: "dirt_%02d.png",
                                        end: 10,
                                        time: perTime * 6 / 10,
                                    })
                                )
                            )
                        )
                    }
                    bg.scene3.we1.weAct = weAct
                    bg.scene3.we2.weAct = weAct
                    bg.scene3.we1.weAct()
                    bg.scene3.we2.weAct()
                }
                var initScene4 = function() {
                    var uilist = [
                        "we1",
                        "we2",
                        "army1",
                        "army2",
                    ]
                    loadList(bg.scene4, uilist)
                    bg.actScene4 = function() {
                        var ani = function() {
                            return cc.repeatForever(createAnimation({
                                frame: "army_fail_%02d.png",
                                end: 92,
                                time: perTime,
                            }))
                        }
                        bg.scene4.army1.runAction(ani())
                        bg.scene4.army2.runAction(ani())
                        bg.scene4.we2.runAction(cc.repeatForever(createAnimation({
                            frame: "we_pun_%02d.png",
                            end: 52,
                            time: perTime,
                        })))
                        bg.scene4.we1.runAction(createAnimation({
                            frame: "we_vic_%02d.png",
                            end: 24,
                            time: perTime,
                            fun: function() {
                                playMusic(res.sydcb_action_sound_11)
                                bg.scene4.we1.runAction(createAnimation({
                                    frame: "we_vic_%02d.png",
                                    start: 25,
                                    end: 92,
                                    time: perTime,
                                    fun: function() {
                                        func.changeLayer({
                                            out: self,
                                            in : layerControl.getLayer(self.jumpTolayer)
                                        })
                                    }
                                }))
                            }
                        }))
                    }
                }
                bg.showIndex = function(index, fun) {
                    var bg = this
                    bg.setOpacity(255)
                    bg.setVisible(true)
                    switch (index) {
                        case 1:
                            bg.sounding = true
                            bg.sounding2 = false
                            bg.scene1.setVisible(true)
                            bg.scene2.setVisible(false)
                            bg.scene3.setVisible(false)
                            bg.scene4.setVisible(false)
                            addShowType({
                                item: bg,
                                show: "moveBy",
                                buf: cc.p(400, 0),
                                time: perTime * 60,
                                delay: perTime * 20,
                                fun: function() {
                                    addTimer({
                                        fun: function(key) {
                                            removeTimer(key)
                                            bg.sounding = false
                                                // addShowType({
                                                //     item: bg,
                                                //     show: "fadeOut",
                                                //     time: perTime * 12,
                                                // })
                                            bg.setVisible(false)
                                            if (bg.curFun) {
                                                var fun = bg.curFun
                                                bg.curFun = null
                                                fun()
                                            }
                                        },
                                        time: perTime * 20,
                                    })
                                }
                            })
                            break
                        case 2:
                            bg.setPosition(-34, 10)
                            bg.sounding = true
                            bg.sounding2 = false
                            bg.scene1.setVisible(true)
                            bg.scene2.setVisible(true)
                            bg.scene3.setVisible(false)
                            bg.scene4.setVisible(false)
                            bg.actScene2()
                            break
                        case 3:
                            bg.setPosition(-585, -100)
                            bg.sounding = false
                            bg.sounding2 = true
                            bg.scene1.setVisible(true)
                            bg.scene2.setVisible(false)
                            bg.scene3.setVisible(true)
                            bg.scene4.setVisible(false)
                            self.showDialog(8, function() {
                                if (bg.curFun) {
                                    var fun = bg.curFun
                                    bg.curFun = null
                                    fun()
                                }
                            })
                            break
                        case 4:
                            bg.setScale(1.5)
                            bg.setPosition(-882, 2.7)
                            bg.actScene4()
                            bg.sounding = false
                            bg.sounding2 = false
                            bg.scene1.setVisible(false)
                            bg.scene2.setVisible(false)
                            bg.scene3.setVisible(false)
                            bg.scene4.setVisible(true)
                            break
                    }
                }
                safeAdd(self, bg)
                initDeco()
                initFalls()
                initScene1()
                initScene2()
                initScene3()
                initScene4()
            }
            if (!bg.ifInit) {
                bg.init()
            }
            self.bg3 = bg
        }
        var bg = self.bg3
        bg.curFun = fun
        if(!disShow){
            bg.setVisible(true)
            bg.showIndex(index, fun)
        }else{
            bg.setVisible(false)
        }
        addKey("judgeBg3End")
    },
    showBg4: function(index, fun, disShow) {
        var self = this
        addKey("judgeBg4Start")
        disShow = disShow || false
        if (!self.bg4) {
            var uilist = [
                "sky",
                "flag1",
                "flag2",
                "flag3",
                "junzhu",
                "junshi1",
                "junshi2",
                "junzhu2",
                "face",
            ]
            var bg = loadNode(res.action4, uilist, "bg4")
            bg.setCascadeOpacityEnabled(true)
            self.bg4 = bg
            bg.init = function() {
                var bg = this
                var initDeco = function() {
                    var sky = bg.sky
                    sky.setLocalZOrder(-1)
                    reAdd(sky)
                    var flagList = [
                        bg.flag1,
                        bg.flag2,
                        bg.flag3
                    ]
                    var flag_ani = function() {
                        var ani = cc.repeatForever(
                            createAnimation({
                                frame: "flag2_%02d.png",
                                end: 7,
                                time: perTime + perTime * Math.random(),
                            })
                        )
                        return ani
                    }
                    for (var i = 0; i < flagList.length; i++) {
                        flagList[i].runAction(flag_ani())
                    }
                }
                var initShadow = function() {
                    var shadowList = [
                        bg.junzhu,
                        bg.junshi1,
                        bg.junshi2,
                        bg.junzhu2,
                    ]
                    for (var i = 0; i < shadowList.length; i++) {
                        var shadow = shadowList[i].getChildByName("shadow")
                        shadow.setLocalZOrder(-1)
                        reAdd(shadow)
                    }
                }
                initShadow()
                initDeco()
            }
            bg.showIndex = function(index) {
                var j1 = bg.junshi1
                var j2 = bg.junshi2
                var jz = bg.junzhu
                var jz2 = bg.junzhu2
                var face = bg.face
                bg.setVisible(true)
                bg.setOpacity(255)
                bg.junzhu.setVisible(index == 1)
                bg.junzhu2.setVisible(index == 2)
                bg.junshi1.setVisible(index == 1)
                bg.junshi2.setVisible(index == 2)
                j2.stopAllActions()
                j1.stopAllActions()
                switch (index) {
                    case 1:
                        addShowType({
                            item: bg,
                            show: "fadeIn",
                            time: perTime * 12,
                            fun: function() {
                                j1.runAction(createAnimation({
                                    frame: "junshi1_%02d.png",
                                    end: 14,
                                    time: perTime,
                                    fun: function() {
                                        self.showDialog(2, function() {
                                            j1.stopAllActions()
                                            j1.runAction(cc.repeatForever(createAnimation({
                                                frame: "junshi1_%02d.png",
                                                end: 13,
                                                time: perTime * 2,
                                            })))
                                            jz.runAction(createAnimation({
                                                frame: "junzhu1_%02d.png",
                                                end: 51,
                                                time: perTime,
                                                fun: function() {
                                                    self.showDialog(3)
                                                    jz.runAction(createAnimation({
                                                        frame: "junzhu1_%02d.png",
                                                        start: 52,
                                                        end: 109,
                                                        time: perTime,
                                                        fun: function() {
                                                            jz.runAction(
                                                                createAnimation({
                                                                    frame: "junzhu1_%02d.png",
                                                                    start: 93,
                                                                    end: 100,
                                                                    rever: true,
                                                                    time: perTime,
                                                                    fun: function() {
                                                                        jz.runAction(
                                                                            cc.repeatForever(
                                                                                createAnimation({
                                                                                    frame: "junzhu1_%02d.png",
                                                                                    start: 57,
                                                                                    end: 62,
                                                                                    time: perTime,
                                                                                })
                                                                            )
                                                                        )
                                                                        self.showDialog(4, function() {
                                                                            jz.stopAllActions()
                                                                            jz.setSpriteFrame("junzhu1_56.png")
                                                                            bg.setVisible(false)
                                                                            if (bg.curFun) {
                                                                                var fun = bg.curFun
                                                                                bg.curFun = null
                                                                                fun()
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            )
                                                        }
                                                    }))
                                                }
                                            }))
                                        })
                                        j1.runAction(cc.repeatForever(createAnimation({
                                            frame: "junshi1_%02d.png",
                                            end: 21,
                                            start: 15,
                                            time: perTime * 2,
                                        })))
                                    }
                                }))
                            }
                        })
                        break
                    case 2:
                        j2.runAction(cc.repeatForever(createAnimation({
                            frame: "junshi3_%02d.png",
                            end: 4,
                            time: perTime * 2,
                        })))
                        face.runAction(
                            cc.sequence(
                                cc.delayTime(perTime * 16),
                                cc.callFunc(function() {
                                    self.showDialog(6, function() {
                                        face.stopAllActions()
                                        face.setSpriteFrame("junzhu2_07.png")
                                        self.showDialog(7, function() {
                                            // addShowType({
                                            //     item: bg,
                                            //     time: perTime * 12,
                                            //     show: "fadeOut",
                                            // })
                                            bg.setVisible(false)
                                            if (bg.curFun) {
                                                var fun = bg.curFun
                                                bg.curFun = null
                                                fun()
                                            }
                                        })
                                    })
                                    face.runAction(
                                        cc.repeatForever(
                                            createAnimation({
                                                frame: "junzhu2_%02d.png",
                                                start: 2,
                                                end: 7,
                                                time: perTime,
                                            })
                                        )
                                    )
                                })
                            )
                        )
                        break
                }
            }
            bg.init()
            safeAdd(self, bg)
        }
        var bg = self.bg4
        bg.curFun = fun
        if(!disShow){
            bg.setVisible(true)
            bg.showIndex(index)
        }else{
            bg.setVisible(false)
        }
        addKey("judgeBg4End")
    },
    showDialog: function(index, fun) {
        var self = this
        var dialogList = [{
            res: "#dialog_06.png",
            pos: "down",
            sound: res.sydcb_action_sound_01, //0
            skip: 12,
        }, {
            sound: res.sydcb_action_sound_02, //1
        }, {
            sound: res.sydcb_action_sound_04, //2
            res: "#dialog_02.png",
            pos: cc.p(703, 395),
        }, {
            sound: res.sydcb_action_sound_05, //3
            res: "#dialog_04.png",
            pos: cc.p(581, 392),
        }, {
            sound: res.sydcb_action_sound_06, //4
            res: "#dialog_05.png",
            pos: cc.p(581, 411),
        }, {
            sound: res.sydcb_action_sound_07, //5
            res: "#dialog_07.png",
            pos: "down",
        }, {
            sound: res.sydcb_action_sound_08, //6
            res: "#dialog_03.png",
            pos: cc.p(531, 434),
        }, {
            sound: res.sydcb_action_sound_09, //7
            res: "#dialog_08.png",
            pos: "down",
        }, {
            sound: res.sydcb_action_sound_10, //8
            res: "#dialog_09.png",
            pos: "down",
        }]
        var info = dialogList[index]
        var sp = null
        if (info.res) {
            sp = new cc.Sprite(info.res)
            if (info.pos != "down") {
                sp.setPosition(info.pos)
            } else {
                sp.setPosition(getMiddle(0, -250))
            }
            sp.setLocalZOrder(99)
            if (info.skip) {
                sp.setVisible(false)
                sp.runAction(cc.sequence(cc.delayTime(info.skip * perTime), cc.callFunc(function() {
                    sp.setVisible(true)
                })))
            }
            sp.setScale(info.scale || 1)
            safeAdd(self, sp)
        }
        playMusicLoopCall({
            music: info.sound,
            fun: function() {
                if (sp) {
                    sp.setVisible(false)
                }
                if (fun) {
                    fun()
                    fun = null
                }
            }
        })
    }
})