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
        addKey("1")
        self.showBg1()
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
    showBg1: function(fun) {
        var self = this
        var uilist = [
            "tree",
            "chan",
            "tltc",
            "tanglang",
            "tlyj",
            "tlzl",
            "tree2",
            "hq",
            "tlkx",
            "bird_wing",
        ]
        playMusic(res.sound_bg, true)
        var bg = loadNode(res.swl_act, uilist, "bg")
        safeAdd(self, bg)

        var layBlack = createLayout({
            size: cc.director.getWinSize(),
            op: 255,
            color: cc.color(0, 0, 0, 255)
        })
        safeAdd(self, layBlack)

        bg.tree2.setVisible(false)
        bg.tlkx.setVisible(false)

        bg.tlkx.actLaugh = function() {
            var item = this
            playEffect(res.sound_haha)
            item.runAction(cc.repeatForever(
                createAnimation({
                    frame: "act_tlkx_%02d",
                    end: 23,
                    time: 2 / 24,
                    ifFile: true,
                })
            ))
        }

        bg.tlkx.actZt = function(fun) {
            var item = this
            item.stopAllActions()
            item.runAction(createAnimation({
                frame: "act_tlkx_%02d",
                start: 24,
                end: 25,
                time: 2 / 24,
                ifFile: true,
                fun: function() {
                    if (fun) {
                        fun()
                    }
                }
            }))
        }

        var layWhite = createLayout({
            size: cc.director.getWinSize(),
            op: 255,
            color: cc.color(255, 255, 255, 255)
        })
        safeAdd(self, layWhite)
        layWhite.setOpacity(0)


        bg.tanglang.setVisible(false)
        bg.tlzl.setVisible(false)

        bg.bird_wing.setVisible(false)
        bg.bird_wing.show = function(fun) {
            var item = this
            item.setVisible(true)
            setOff(item, cc.p(300, 0))
            addShowType({
                item: item,
                show: "moveBy",
                buf: cc.p(-300, 0),
                time: 1.0,
                fun: function(item) {
                    addShowType({
                        item: item,
                        show: "moveBackLoop",
                        time: 0.2,
                        buf: cc.p(0, -15),
                        count: 3,
                        fun: function() {
                            if (fun) {
                                fun()
                            }
                        }
                    })
                }
            })
        }

        var chan = bg.chan
        chan.runAction(cc.repeatForever(
            createAnimation({
                frame: "act_chan_%02d.png",
                end: 20,
                time: 2 / 24,
            })
        ))

        playEffect(res.sound_chan, true)

        var changeJx = function(item, fun) {
            item.stopAllActions()
            item.setSpriteFrame("act_tljx_01.png")
            item.runAction(
                createAnimation({
                    frame: "act_tljx_%02d.png",
                    end: 13,
                    time: 1 / 24,
                    fun: function(item) {
                        item.runAction(cc.sequence(
                            cc.delayTime(1),
                            cc.callFunc(function() {
                                item.setSpriteFrame("act_tlzl_01.png")
                                if (fun) {
                                    fun()
                                }
                            })
                        ))
                    }
                })
            )
        }

        var whiteFadeIn = function(data) {
            data = data || {}
            var time = data.time || 10 / 24
            var delay = data.delay
            var fun = data.fun
            addShowType({
                item: layWhite,
                time: time,
                delay: delay,
                show: "fadeIn",
                fun: function() {
                    if (fun) {
                        fun()
                    }
                }
            })
        }

        var whiteFadeOut = function(data) {
            data = data || {}
            var time = data.time || 10 / 24
            var delay = data.delay
            var fun = data.fun
            addShowType({
                item: layWhite,
                time: time,
                delay: delay,
                show: "fadeOut",
                fun: function() {
                    if (fun) {
                        fun()
                    }
                }
            })
        }

        var hq = bg.hq
        hq.actFly = function() {
            var hq = this
            hq.runAction(cc.repeatForever(createAnimation({
                frame: "act_hqf_%02d.png",
                time: 1 / 24,
                end: 5,
            })))
        }

        hq.actTing = function(fun) {
            var item = this
            item.stopAllActions()
            item.setSpriteFrame("act_hqt_01.png")
            item.runAction(createAnimation({
                frame: "act_hqt_%02d.png",
                end: 10,
                time: 1 / 24,
                delay: 18 / 24,
                fun: function() {
                    item.runAction(
                        cc.sequence(
                            cc.repeat(
                                createAnimation({
                                    frame: "act_hqt_%02d.png",
                                    end: 15,
                                    start: 11,
                                    time: 1 / 24,
                                }), 2
                            ),
                            cc.callFunc(function() {
                                item.setSpriteFrame("act_hqt_11.png")
                            }),
                            cc.delayTime(12 / 24),
                            cc.callFunc(function() {
                                setOff(item, cc.p(-11, 0))
                            }),
                            createAnimation({
                                frame: "act_hqzs_%02d.png",
                                end: 6,
                                time: 1 / 24,
                            }),
                            cc.callFunc(function() {
                                setOff(item, cc.p(-16, -12))
                            }),
                            cc.repeat(
                                createAnimation({
                                    frame: "act_hqzy_%02d.png",
                                    end: 11,
                                    time: 1 / 24,
                                }), 3
                            ),
                            cc.callFunc(function() {
                                if (fun) {
                                    fun()
                                }
                            })
                        )
                    )
                }
            }))
        }

        var getRandColor = function() {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    return cc.color(255, 0, 0, 255)
                    break
                case 1:
                    return cc.color(0, 255, 0, 255)
                    break
                case 2:
                case 3:
                    return cc.color(255, 255, 0, 255)
                    break
            }
        }

        var showTLTQ = function(data) {
            data = data || {}
            stopEffect()
            var tqTime = data.tqTime || 1.0
            var paTime = data.paTime || 2.0
            var fun = data.fun
            var node = new cc.SpriteBatchNode(res.swl_line)
            var size = cc.director.getWinSize()
            layBlack.setVisible(true)
            layBlack.setOpacity(255)
            for (var i = 0; i < 100; i++) {
                var item = new cc.Sprite(res.swl_line)
                item.setColor(getRandColor())
                item.setScale(Math.random() * 0.6 + 0.7)
                item.setPosition(Math.random() * size.width, Math.random() * size.height)
                item.size = item.getContentSize()
                safeAdd(node, item)
                item.update = function(dt) {
                    var item = this
                    if (item.y > size.height + item.size.height * item.scaleY / 2) {
                        item.speedY = null
                        item.setColor(getRandColor())
                        item.setPosition(Math.random() * size.width, -200)
                        item.setScale(Math.random() * 0.6 + 0.7)
                    }
                    if (!item.speedY) {
                        item.speedY = Math.random() * 50 + 50
                    }
                    item.y += item.speedY
                }
                item.scheduleUpdate()
            }
            safeAdd(self, node)

            var tltq = new cc.Sprite(res.swl_tltq)
            tltq.setPosition(getMiddle(0, -100))
            addShowType({
                item: tltq,
                show: "moveBy",
                time: tqTime,
                buf: cc.p(0, 100),
                fun: function(item) {
                    item.removeFromParent(true)
                    node.removeFromParent(true)
                    var delay = 0
                    var per = 0.2
                    var count = 6
                    for (var i = 0; i < count; i++) {
                        var pa = new cc.Sprite(res.swl_pa)
                        pa.setPosition(Math.random() * size.width / 2 + size.width / 4, Math.random() * size.height / 2 + size.height / 4)
                        pa.setScale(0)
                        pa.index = i
                        addShowType({
                            item: pa,
                            show: "scaleTo",
                            buf: Math.random() * 0.6 + 0.7,
                            time: per,
                            delay: delay,
                            preFun: function() {
                                playEffect(res.sound_pa)
                            },
                            fun: function(item) {
                                item.setVisible(false)
                                if (item.index == count - 1) {
                                    if (fun) {
                                        fun()
                                    }
                                }
                            }
                        })
                        delay = delay + Math.random() * 0.1 + per
                        safeAdd(self, pa)
                    }
                }
            })
            safeAdd(self, tltq)
        }

        var show3 = function() {
            bg.tree.setVisible(false)
            var uilist2 = [
                "bird",
                "birdeye",
                "tanglang",
                "tleye",
                "font",
                "swl_a",
            ]
            var bg2 = loadNode(res.swl_act2, uilist2)
            var bird = bg2.bird
            var tanglang = bg2.tanglang
            tanglang.setVisible(false)
            var birdeye = bg2.birdeye
            var tleye = bg2.tleye
            var font = bg2.font
            var swl_a = bg2.swl_a
            font.setVisible(false)
            swl_a.setVisible(false)
            safeAdd(self, bg2)

            addShowType({
                item: bird,
                show: "moveBy",
                time: 2.0,
                buf: cc.p(0, -1100),
                fun: function() {
                    birdeye.runAction(
                        cc.sequence(
                            cc.repeat(
                                createAnimation({
                                    frame: "swl_bird_eye%d",
                                    end: 3,
                                    time: 2 / 24,
                                    ifFile: true,
                                }), 3
                            ),
                            cc.callFunc(function() {
                                birdeye.setTexture(res.swl_bird_eye1)
                            }),
                            cc.delayTime(0.5),
                            cc.callFunc(function() {
                                bird.setVisible(false)
                                tanglang.setVisible(true)
                                playEffect(res.sound_a1)
                                addShowType({
                                    item: tleye,
                                    show: "moveBackForever",
                                    time: 0.1,
                                    buf: cc.p(50, 0),
                                })
                            }),
                            cc.delayTime(2.0),
                            cc.callFunc(function() {
                                reAdd(layBlack)
                                layBlack.setVisible(true)
                                layBlack.setOpacity(0)
                                addShowType({
                                    item: layBlack,
                                    show: "fadeIn",
                                    time: 0.5,
                                    fun: function() {
                                        safeAdd(self, swl_a)
                                        swl_a.setVisible(true)
                                        playEffect(res.sound_a2)
                                        addShowType({
                                            item: swl_a,
                                            show: "shakeF",
                                            buf: cc.p(30, 30),
                                            time: 0.1,
                                        })

                                        addShowType({
                                            item: swl_a,
                                            show: "scaleTo",
                                            buf: 0.01,
                                            time: 0.3,
                                            delay: 1.7,
                                            fun: function() {
                                                swl_a.setVisible(false)
                                            }
                                        })

                                        safeAdd(self, font)
                                        font.setVisible(true)
                                        font.setOpacity(0)
                                        addShowType({
                                            item: font,
                                            show: "fadeIn",
                                            time: 0.5,
                                            delay: 2.0,
                                            fun: function() {
                                                playMusicLoopCall({
                                                    music: res.sound_final,
                                                    fun: function() {
                                                        func.changeLayer({
                                                            out: self,
                                                            in : layerControl.getLayer(self.jumpTolayer)
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            })
                        )
                    )
                }
            })
        }

        var show2 = function() {
            whiteFadeIn({
                delay: 50 / 24,
                fun: function() {
                    var item = layWhite
                    bg.tree.setVisible(false)
                    bg.tree2.setVisible(true)
                    whiteFadeOut({
                        fun: function() {
                            hq.actFly()
                            addShowType({
                                item: hq,
                                show: "moveBy",
                                buf: cc.p(-350, -300),
                                time: 15 / 24,
                                fun: function(item) {
                                    hq.actTing(function() {
                                        whiteFadeIn({
                                            fun: function() {
                                                bg.tree2.setVisible(false)
                                                bg.tree.setVisible(true)
                                                bg.tree.setPosition(bg.tree.rootPos)
                                                whiteFadeOut({
                                                    fun: function() {
                                                        addShowType({
                                                            item: bg.tlzl,
                                                            show: "moveBy",
                                                            time: 2,
                                                            buf: cc.p(-400, 15),
                                                            preFun: function() {
                                                                bg.tree.setPosition(bg.tree.finalPos)
                                                                addShowType({
                                                                    item: bg.tree,
                                                                    show: "moveBy",
                                                                    time: 2,
                                                                    buf: cc.p(400, 0),
                                                                })
                                                                addShowType({
                                                                    item: layWhite,
                                                                    show: "fadeIn",
                                                                    time: 5 / 24,
                                                                    delay: 43 / 23,
                                                                    fun: function() {
                                                                        bg.tree.setVisible(false)
                                                                        bg.tree2.setVisible(true)
                                                                        addShowType({
                                                                            item: layWhite,
                                                                            show: "fadeOut",
                                                                            time: 5 / 24,
                                                                            fun: function() {
                                                                                hq.actFly()
                                                                                hq.setRotation(-30)
                                                                                addShowType({
                                                                                    item: hq,
                                                                                    show: "moveBy",
                                                                                    time: 1,
                                                                                    buf: cc.p(-900, -500),
                                                                                    fun: function() {
                                                                                        bg.tree.setVisible(true)
                                                                                        bg.tree2.setVisible(false)
                                                                                        setOff(bg.tree, cc.p(350, 0))
                                                                                        addShowType({
                                                                                            item: bg.tlzl,
                                                                                            show: "moveBy",
                                                                                            time: 1,
                                                                                            buf: cc.p(-200, -15),
                                                                                            fun: function(item) {
                                                                                                changeJx(item, function() {
                                                                                                    showTLTQ({
                                                                                                        fun: function() {
                                                                                                            bg.tlkx.setVisible(true)
                                                                                                            bg.chan.setVisible(false)
                                                                                                            bg.tlzl.setVisible(false)
                                                                                                            layBlack.setVisible(false)
                                                                                                            bg.tree.setScale(2.0)
                                                                                                            setOff(bg.tree, cc.p(-200, 0))
                                                                                                            bg.tlkx.actLaugh()
                                                                                                            addShowType({
                                                                                                                item: bg.tree,
                                                                                                                time: 3.0,
                                                                                                                show: "scaleTo",
                                                                                                                buf: 1.5,
                                                                                                                fun: function() {
                                                                                                                    bg.bird_wing.show(function() {
                                                                                                                        bg.tlkx.actZt(function() {
                                                                                                                            show3()
                                                                                                                        })
                                                                                                                    })
                                                                                                                }
                                                                                                            })
                                                                                                            addShowType({
                                                                                                                item: bg.tree,
                                                                                                                time: 3.0,
                                                                                                                show: "moveBy",
                                                                                                                buf: cc.p(200, 0),
                                                                                                            })
                                                                                                        }
                                                                                                    })
                                                                                                })
                                                                                            }
                                                                                        })
                                                                                        addShowType({
                                                                                            item: bg.tree,
                                                                                            show: "moveBy",
                                                                                            time: 1,
                                                                                            buf: cc.p(150, 0),
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                    }
                                                                })
                                                            },
                                                            delay: 2,
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }

        addShowType({
            item: layBlack,
            show: "fadeOut",
            time: 0.5,
            fun: function() {
                addShowType({
                    item: bg.tree,
                    time: 40 / 24,
                    show: "moveBy",
                    buf: cc.p(-45, 45),
                    fun: function(item) {
                        bg.tree.rootPos = bg.tree.getPosition()
                        addShowType({
                            item: item,
                            time: 40 / 24,
                            show: "scaleTo",
                            buf: 1,
                            delay: 48 / 24,
                            fun: function(item) {
                                addShowType({
                                    item: item,
                                    show: "moveBy",
                                    time: 72 / 24,
                                    buf: cc.p(-900, 0),
                                    fun: function() {
                                        bg.tree.finalPos = bg.tree.getPosition()
                                        bg.tltc.runAction(createAnimation({
                                            frame: "act_tltc_%02d.png",
                                            end: 32,
                                            time: 2 / 24,
                                            fun: function() {
                                                bg.tltc.setSpriteFrame("act_tltc_01.png")
                                                bg.tanglang.setVisible(true)
                                                bg.tlyj.runAction(createAnimation({
                                                    frame: "act_tlyj_%02d.png",
                                                    end: 25,
                                                    time: 1 / 24,
                                                    fun: function() {
                                                        bg.tlzl.setVisible(true)
                                                        bg.tanglang.setVisible(false)
                                                        bg.tlzl.runAction(cc.repeatForever(
                                                            createAnimation({
                                                                frame: "act_tlzl_%02d.png",
                                                                time: 1 / 24,
                                                                end: 4,
                                                            })
                                                        ))
                                                        addShowType({
                                                            item: bg.tlzl,
                                                            time: 60 / 24,
                                                            show: "moveBy",
                                                            buf: cc.p(-260, 20),
                                                        })
                                                        show2()
                                                    }
                                                }))
                                            }
                                        }))
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
})