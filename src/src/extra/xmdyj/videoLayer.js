var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer: "mainLayer",
    load: function() {
        loadPlist("act_font")
    },
    showQuestion: function() {
        var item = this
        var posList = item.posList
        var rotateList = item.rotateList
        var mix = item.mix || cc.p(0, 0)
        if (!posList) {
            return
        }
        var questionList = []
        for (var i = 0; i < posList.length; i++) {
            var pos = posList[i]
            var inItem = new cc.Sprite(res.xm_wh)
            inItem.setPosition(pos.x + mix.x, pos.y + mix.y)
            inItem.setRotation(rotateList[i])
            inItem.setAnchorPoint(0.5, 0)
            safeAdd(item, inItem)
            inItem.setVisible(false)
            addShowType({
                item: inItem,
                show: "scaleLoop",
                buf: {
                    from: 0.4,
                    to: 0.45,
                },
                time: 0.1,
                repeat: 99,
                preFun: function(item) {
                    item.setVisible(true)
                }
            })
            questionList[i] = inItem
        }
        item.questionList = questionList
    },
    disQuestion: function() {
        var item = this
        if (item.questionList) {
            var questionList = item.questionList
            for (var i = 0; i < questionList.length; i++) {
                var inItem = questionList[i]
                inItem.stopAllActions()
                inItem.removeFromParent(true)
            }
        }
    },
    ctor: function() {
        this._super();
        var self = this
        self.load()
        var btn = new ccui.Button(res.img_skip_normal, res.img_skip_select)
        btn.setLocalZOrder(99)
        btn.setPosition(1050, 50)
        addKey("1")

        var white = createLayout({
            size: cc.director.getWinSize(),
            op: 255,
            color: cc.color(255, 255, 255, 255),
        })
        white.setLocalZOrder(9)
        safeAdd(self, white)
        self.white = white

        var bg1 = self.showBg1(function() {
            self.showBg2(function() {
                self.bg1 && self.bg1.next()
            })
        })
        self.bg1 = bg1
        addKey("2")
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
    showFont: function(index, fun) {
        var infos = [{
            bg: true,
            pos: cc.p(300, 420),
        }, {
            bg: true,
            pos: cc.p(400, 520),
        }, {
            bg: false,
        }, {
            bg: false,
        }, {
            bg: false,
        }, {
            bg: false,
        }, {
            bg: true,
            pos: cc.p(400, 520),
        }]
        var self = this
        if (!self.fontBg) {
            var bg = new cc.Sprite("#xm_fontbg.png")
            bg.setLocalZOrder(4)
            safeAdd(self, bg)
            self.fontBg = bg
        }
        var info = infos[index]
        var final = null
        if (info) {
            var bg = self.fontBg
            if (info.bg) {
                bg.setVisible(true)
                if (!bg.item) {
                    var item = new cc.Sprite()
                    var size = bg.getContentSize()
                    item.setPosition(size.width / 2, size.height / 2)
                    item.rootPos = item.getPosition()
                    safeAdd(bg, item)
                    bg.item = item
                }
                var item = bg.item
                item.setSpriteFrame(sprintf("xm_act_font%d.png", index + 1))
                bg.setPosition(info.pos)
                final = bg
            } else {
                bg.setVisible(false)
                if (!self.downFont) {
                    var font = new cc.Sprite()
                    font.setLocalZOrder(3)
                    safeAdd(self, font)
                    font.setPosition(getMiddle(0, -280))
                    self.downFont = font
                }
                var font = self.downFont
                font.setSpriteFrame(sprintf("xm_act_font%d.png", index + 1))
                font.setVisible(true)
                final = font
            }
            playMusicLoopCall({
                music: res[sprintf("xm_sound%d", index + 1)],
                fun: function() {
                    final.setVisible(false);
                    fun && fun();
                }
            })
        }
    },
    showBg1: function(fun) {
        var self = this
        var uilist = [
            "item_per",
            "item_boy",
            "item_mom",
            "mom_mouth",
            "item_ht",
            "act_ht",
        ]
        var bg = loadNode(res.xm_act, uilist, "bg")
        bg.setPosition(getMiddle())
        safeAdd(self, bg)
        self.showWhite()
        var per = bg.item_per
        per.setLocalZOrder(2)
        reAdd(per)
        var mom = bg.item_mom
        var boy = bg.item_boy
        mom.mouth = bg.mom_mouth
        var item_ht = bg.item_ht
        item_ht.setVisible(false)
        item_ht.setScale(0)

        var show = function(type, fun) {
            var item = this
            var key = item.key
            item.stopAllActions()
            if (!item.shadow) {
                item.shadow = item.getChildByName("shadow")
                item.shadow.setLocalZOrder(-1)
                reAdd(item.shadow)
            }
            var shadow = item.shadow
            shadow.stopAllActions()
            var mouth = item.mouth
            mouth && mouth.setVisible(false);
            mouth && mouth.stopAllActions();
            switch (type) {
                case "walk":
                    item.setSpriteFrame(sprintf("xm_%swalk_01.png", key))
                    item.runAction(cc.repeatForever(createAnimation({
                        frame: sprintf("xm_%swalk_%%02d.png", key),
                        end: 8,
                        time: 4 / 24,
                    })))
                    shadow.setSpriteFrame(sprintf("xm_%sshadow_01.png", key))
                    shadow.runAction(cc.repeatForever(createAnimation({
                        frame: sprintf("xm_%sshadow_%%02d.png", key),
                        end: 8,
                        time: 4 / 24,
                    })))
                    break
                case "step":
                    shadow.setSpriteFrame(sprintf("xm_%sshadow_01.png", key))
                        //item.setSpriteFrame(sprintf("xm_%sstep_01.png", key))
                    item.runAction(createAnimation({
                        frame: sprintf("xm_%sstep_%%02d.png", key),
                        start: 2,
                        end: 11,
                        time: 4 / 24,
                        fun: function() {
                            fun && fun();
                        }
                    }))
                    break
                case "point":
                    shadow.setSpriteFrame(sprintf("xm_%sshadow_01.png", key))
                        //item.setSpriteFrame(sprintf("xm_%spoint_01.png", key))
                    item.runAction(createAnimation({
                        frame: sprintf("xm_%spoint_%%02d.png", key),
                        end: 10,
                        time: 4 / 24,
                        fun: function() {
                            fun && fun();
                        }
                    }))
                    break
                case "act2":
                    shadow.setScale(getLoopScale(shadow))
                    shadow.setLocalZOrder(1)
                    changeFather({
                        item: shadow,
                        father: self,
                    })

                    item.setSpriteFrame(sprintf("xm_%s2_01.png", key))
                    item.setScale(1)
                    setOff(item, cc.p(0, 31))
                    item.setFlippedX(false)
                    item.runAction(createAnimation({
                        frame: sprintf("xm_%s2_%%02d.png", key),
                        end: 5,
                        time: 4 / 24,
                        fun: function() {
                            fun && fun();
                        }
                    }))
                    break
                case "boySpeak":
                    item.runAction(cc.repeatForever(createAnimation({
                        frame: "xm_boy2_%02d.png",
                        time: 2 / 24,
                        start: 6,
                        end: 10,
                    })))
                    break
                case "boyStop":
                    item.setSpriteFrame("xm_boy2_06.png")
                    break
                case "momSpeak":
                    mouth && mouth.setVisible(true);
                    mouth && mouth.runAction(cc.repeatForever(
                        createAnimation({
                            frame: "xm_mouth%d.png",
                            end: 4,
                            time: 2 / 24,
                        })
                    ))
                    break
                case "momStop":
                    item.setSpriteFrame("xm_momstep_11.png")
                    break
            }
        }

        mom.show = show
        boy.show = show
        mom.key = "mom"
        boy.key = "boy"

        var walkTime = 3

        addShowType({
            item: per,
            show: "moveBy",
            time: walkTime,
            buf: cc.p(-140, -160),
        })

        boy.showHt = function() {

        }

        addShowType({
            item: per,
            show: "scaleTo",
            buf: 0.9,
            time: walkTime,
            fun: function(item) {
                addShowType({
                    item: item,
                    show: "moveBy",
                    time: 24 / 24,
                    buf: cc.p(0, -30),
                })
                mom.show("step")
                boy.show("point", function() {
                    boy.show("act2", function() {
                        boy.show("boySpeak")
                        self.showFont(0, function() {
                            boy.show("boyStop")
                            mom.show("momSpeak")
                            self.showFont(1, function() {
                                mom.show("momStop");
                                fun && fun();
                            })
                        })
                    })
                })
            }
        })

        bg.next = function() {
            boy.show("boySpeak")
            item_ht.setVisible(true)
            addShowType({
                item: item_ht,
                show: "scale",
                time: 0.5,
                fun: function() {
                    var ht_act = bg.act_ht
                    ht_act.runAction(createAnimation({
                        frame: "xm_boyht_%02d.png",
                        end: 12,
                        time: 4 / 24,
                        fun: function() {
                            addShowType({
                                item: item_ht,
                                show: "fadeOut",
                                time: 0.5,
                            })
                        }
                    }))
                }
            })
            self.showFont(5, function() {
                boy.show("boyStop")
                mom.show("momSpeak")
                self.showFont(6, function() {
                    mom.show("momStop")
                    stopEffect()

                    boy.showQuestion = self.showQuestion
                    boy.posList = [
                        cc.p(230, 430),
                        cc.p(200, 400),
                        cc.p(260, 430),
                    ]
                    boy.rotateList = [-40, -80, 0]
                    boy.showQuestion()

                    delayFun(1.0, function() {
                        func.changeLayer({
                            out: self,
                            in : layerControl.getLayer(self.jumpTolayer)
                        })
                    })
                })
            })
        }

        mom.show("walk")
        boy.show("walk")

        return bg
    },
    showWhite: function() {
        var self = this
        self.white.setVisible(true)
        addShowType({
            item: self.white,
            show: "fadeOut",
            time: 1.0,
            fun: function(item) {
                item.setVisible(false)
                item.setOpacity(255)
            }
        })
    },
    showBg2: function(fun) {
        var self = this
        self.showWhite()
        var uilist = [
            "in",
            "clip",
            "toadd",
            "item_xm",
            "item_tc",
        ]
        var bg = loadNode(res.xm_act2, uilist, "bg")
        bg.setLocalZOrder(2)
        bg.setPosition(getMiddle())
        safeAdd(self, bg)
        bg.clip.removeFromParent(false)
        var clip = new cc.ClippingNode(bg.clip)
        clip.setAlphaThreshold(0)
        safeAdd(bg.in, clip)
            //safeAdd(clip, bg.toadd)

        var xm = bg.item_xm
        var tc = bg.item_tc

        xm.setVisible(false)

        changeFather({
            item: bg.toadd,
            father: clip,
        })

        setOff(bg.toadd, cc.p(0, -80))

        tc.walk = function() {
            var tc = this
            tc.stopAllActions()
            tc.runAction(cc.repeatForever(createAnimation({
                frame: "xm_boytc2_%02d.png",
                start: 2,
                end: 7,
                time: 4 / 24,
            })))
        }

        tc.stop = function() {
            var tc = this
            tc.stopAllActions()
            tc.setSpriteFrame("xm_boytc2_01.png")
        }

        tc.walk()

        addShowType({
            item: tc,
            show: "moveBy",
            time: 2.0,
            buf: cc.p(-250, 0),
            fun: function() {
                tc.stop()
            }
        })

        self.showFont(2, function() {

            tc.showQuestion = self.showQuestion
            tc.posList = [
                cc.p(240, 420),
                cc.p(200, 430),
                cc.p(260, 380),
            ]
            tc.rotateList = [
                40, -10, 90
            ]
            tc.mix = cc.p(-30, -30)
            tc.showQuestion()
            self.showFont(3, function() {
                tc.disQuestion = self.disQuestion
                tc.disQuestion()
                addShowType({
                    item: xm,
                    show: "blink",
                    time: 1.0,
                    count: 3,
                    fun: function(item) {
                        item.setVisible(true)
                        tc.walk()
                        addShowType({
                            item: tc,
                            show: "moveBy",
                            time: 0.6,
                            buf: cc.p(-100, 0),
                            fun: function(item) {
                                addShowType({
                                    item: tc,
                                    show: "rotateTo",
                                    time: 1.0,
                                    buf: 15,
                                    fun: function(item) {
                                        addShowType({
                                            item: item,
                                            show: "rotateTo",
                                            time: 1.0,
                                            buf: 0,
                                        })
                                    }
                                })
                                addShowType({
                                    item: tc,
                                    show: "moveBy",
                                    time: 2.0,
                                    buf: cc.p(-260, 170),
                                    fun: function() {
                                        tc.stop()
                                    }
                                })
                            }
                        })
                        self.showFont(4, function() {
                            bg.setVisible(false)
                            self.showWhite();
                            fun && fun();
                        })
                    }
                })
            })
        })
    }
})