var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer:"mainLayer",
    ctor: function() {
        this._super();
        var self = this
        loadPlist("jrs")
        loadPlist("bys")
        self.initUI()
        var skipbtn = new ccui.Button(res.img_skip_normal,res.img_skip_select)
        skipbtn.setPosition(1050,40)
        this.addChild(skipbtn)
        skipbtn.addClickEventListener(function(){
            func.changeLayer({
                out: self,
                in : layerControl.getLayer(self.jumpTolayer)
            })
            getLoopOp(self) 
        })
       
        return true
    },
    skipFun:function(){
        var self = this
        func.changeLayer({
            out: self,
            in : layerControl.getLayer(self.jumpTolayer)
        })
        getLoopOp(self)
    },
    initUI:function(){
        var self = this
        var UI = ["bg1","bg2","clouds"]
        var node = loadNode(res.startMv,UI)
        self.addChild(node)

        node.jr = node.bg1.getChildByName("jr")
        node.gq1 = node.bg1.getChildByName("gq1")
        node.by = node.bg1.getChildByName("by")
        node.bb = node.bg1.getChildByName("bb")
        node.ztboy = node.bg1.getChildByName("ztboy")
        node.tip1 = node.ztboy.getChildByName("tip1")
        node.renwb = node.bg1.getChildByName("renwb")
        node.renyb = node.bg1.getChildByName("renyb")
        node.upGuoqi = function(){
            var jrac = createAnimation({
                                frame:"jr%d.png",
                                start:1,
                                end: 7,
                                time: 0.15
                            })
            node.jr.runAction(cc.repeatForever(jrac))

            var gqac = createAnimation({
                                    frame:"gq%d.png",
                                    start:1,
                                    end: 7,
                                    time: 0.1
                                })
            node.gq1.runAction(cc.repeatForever(gqac))
            var seq1 = cc.sequence(
                cc.moveBy(19,cc.p(0,217)),
                cc.callFunc(function(){
                    node.jr.stopAllActions()
                    node.jr.setSpriteFrame("jr1.png")
                    node.gq1.stopActionByTag(555)
                })
            )
            seq1.tag = 555
            node.gq1.runAction(seq1)
        }
        node.upGuoqi()

        node.clouds.runAction(cc.moveTo(80,cc.p(1136*2,0)))
        
        var playSp = function(data){
            var sp = data.sp
            var name = data.name
            var fun = data.fun
            var time = data.time || 0.4
            var last = data.last || 10
            var dis = data.dis || cc.p(5.5,800)
            var ac = cc.repeatForever(createAnimation({
                            frame:name,
                            start:1,
                            end: 7,
                            time: 0.1
                        }))
            ac.tag = 666
            sp.runAction(ac)
            sp.runAction(cc.sequence(
                cc.delayTime(2),
                cc.moveBy(dis.x,cc.p(dis.y,0)),
                cc.callFunc(function(){
                    sp.stopActionByTag(666)
                    sp.setSpriteFrame(sprintf(name,8))
                }),
                cc.delayTime(0.5),
                cc.callFunc(function(){
                    sp.setSpriteFrame(sprintf(name,9))
                }),
                cc.delayTime(time),
                cc.callFunc(function(){
                    sp.stopAllActions()
                    sp.setSpriteFrame(sprintf(name,last))
                    if(fun)fun()
                })
            ))
        }
        playSp({
            sp:node.by,
            name:"by%d.png",
            time:0.4,
            last:9,
            fun:function(){
                node.tip1.setVisible(true)
                playMusic(res.timp1)
                node.by.setVisible(false)
                node.ztboy.setVisible(true)
                var hazi = createAnimation({
                                frame:"zt%d.png",
                                start:3,
                                end: 8,
                                time: 0.4
                            })
                var ht = createAnimation({
                                frame:"zt%d.png",
                                start:8,
                                end: 10,
                                time: 0.4
                            })
                var hazi1 = createAnimation({
                                rever:true,
                                frame:"zt%d.png",
                                start:3,
                                end: 7,
                                time: 0.4
                            })
                var seq = cc.sequence(hazi,cc.delayTime(1.5),ht,hazi1,cc.callFunc(function(){
                    node.ztboy.setSpriteFrame(sprintf("zt%d.png",11))
                }),cc.delayTime(0.7),cc.callFunc(function(){
                    node.bg2.playAc()
                }))
                node.ztboy.runAction(seq)
            }
        })
        playSp({
            sp:node.bb,
            name:"bb%d.png",
            time:1,
            dis:cc.p(6.5,800),
            fun:function(){}
        })
        node.bg1.playAc2 = function(){
            node.bg1.setVisible(true)
            node.bg2.setVisible(false)
            node.renwb.setVisible(true)
            node.renyb.setVisible(true)
            var rens = this.getChildByName("doubs")
            rens.setVisible(false)

            node.renwb.runEye = function(){
                var eye = node.renwb.getChildByName("renwb_t").getChildByName("alleye")
                var eyeAc = cc.sequence(
                    createAnimation({
                                frame:"alleye%d.png",
                                start:1,
                                end: 4,
                                time: 0.1
                            }),
                    cc.delayTime(0.1),
                    createAnimation({
                                frame:"alleye%d.png",
                                start:1,
                                end: 4,
                                time: 0.1,
                                rever:true
                            })
                )
                eye.runAction(eyeAc)
            }
            node.renwb.runHead = function(){
                var head = node.renwb.getChildByName("renwb_t")
                var headAc = cc.rotateTo(0.3,0)
                head.runAction(headAc)
            }
            node.renwb.runHand = function(){
                var hand = node.renwb.getChildByName("renwb_s")
                var handAc = cc.sequence(cc.rotateTo(0.2,-4),cc.rotateTo(0.2,13))
                hand.runAction(handAc)
            }
            node.renwb.runSpeak = function(){
                var tip4 = node.renwb.getChildByName("tip4")
                tip4.setVisible(true)
                playMusic(res.timp4)
                var zui = node.renwb.getChildByName("renwb_t").getChildByName("azui")
                var zuiA = createAnimation({
                                frame:"azui%d.png",
                                start:1,
                                end: 2,
                                time: 0.1
                            })
                var zuiAc = cc.repeatForever(zuiA)
                zuiAc.tag = 777
                zui.runAction(zuiAc)
                zui.runAction(cc.sequence(cc.delayTime(7.2),cc.callFunc(function(){
                    zui.stopActionByTag(777)
                    zui.setSpriteFrame("azui1.png")
                }),cc.delayTime(2),cc.callFunc(function(){
                    self.skipFun()
                })))
            }
            node.renyb.runEye = function(){
                var eye = node.renyb.getChildByName("renyb_t").getChildByName("alleye")
                var eyeAc = cc.sequence(
                    createAnimation({
                                frame:"alleye%d.png",
                                start:1,
                                end: 4,
                                time: 0.1
                            }),
                    cc.delayTime(0.1),
                    createAnimation({
                                frame:"alleye%d.png",
                                start:1,
                                end: 4,
                                time: 0.1,
                                rever:true
                            })
                )
                eye.runAction(eyeAc)
            }
            node.renyb.runHead = function(){
                var head = node.renyb.getChildByName("renyb_t")
                var headAc = cc.sequence(cc.rotateTo(0.3,-12),cc.rotateTo(0.3,0))
                head.runAction(cc.repeat(headAc,2))
            }
            node.renwb.runAction(cc.sequence(
                cc.callFunc(node.renwb.runHead),
                cc.delayTime(0.8),
                cc.callFunc(node.renwb.runEye),
                cc.delayTime(1.4),
                cc.callFunc(node.renwb.runSpeak),
                cc.delayTime(2),
                cc.callFunc(node.renwb.runHand),
                cc.delayTime(1),
                cc.callFunc(node.renyb.runHead),
                cc.delayTime(1),
                cc.callFunc(node.renyb.runEye)
            ))
        }
        node.bg1.playAc1 = function(){
            node.bg1.setVisible(true)
            node.bg2.setVisible(false)
            node.bb.setVisible(false)
            node.ztboy.setVisible(false)
            node.gq1.resume()
            var rens = this.getChildByName("doubs")
            rens.setVisible(true)

            rens.jlplay = function(fun){
                var jls = createAnimation({
                        frame:"doubs%d.png",
                        start:1,
                        end: 8,
                        time: 0.2,
                        fun:fun
                    })
                rens.runAction(jls)
            }

            rens.runAction(cc.sequence(
                cc.delayTime(3),
                cc.callFunc(function(){
                    rens.jlplay(function(){
                        node.bg2.playAc1()
                    })
                })
            ))
        }
        node.bg2.playAc1 = function(){
            var boyBlue = node.bg2.getChildByName("bbg")
            var boyBlue_yizi = node.bg2.getChildByName("yzi2")
            var boyRed = node.bg2.getChildByName("byy")
            var boyRed_yizi = node.bg2.getChildByName("yzi1")
            var renby = node.bg2.getChildByName("renby")
            var renbb = node.bg2.getChildByName("renbb")
            node.bg1.setVisible(false)
            node.bg2.setVisible(true)
            boyBlue.setVisible(false)
            boyBlue_yizi.setVisible(false)
            boyRed.setVisible(false)
            boyRed_yizi.setVisible(false)
            renby.setVisible(true)
            renbb.setVisible(true)

            renby.speak = function(time,fun){
                var tip3 = renby.getChildByName("tip3")
                tip3.setVisible(true)
                playMusic(res.timp3)
                var m = renby.getChildByName("m")

                var ttac = createAnimation({
                    frame:"m%d.png",
                    start:1,
                    end: 4,
                    time: 0.06
                })
                var ttac1 = createAnimation({
                    frame:"m%d.png",
                    start:1,
                    end: 4,
                    time: 0.06,
                    rever:true
                })
                var seq = cc.repeatForever(cc.sequence(ttac,ttac1))
                seq.tag = 999
                m.runAction(seq)
                m.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
                    m.stopActionByTag(999)
                }),cc.delayTime(0.5),cc.callFunc(function(){
                    tip3.setVisible(false)
                    if(fun)fun()
                })))
            }
            renby.runEye = function(start,end){
                var start = start || 7
                var end = end || 9
                var ttac = createAnimation({
                    frame:"renTwo%d.png",
                    start:start,
                    end: end,
                    time: 0.05
                })
                var ttac1 = createAnimation({
                    frame:"renTwo%d.png",
                    start:start-1,
                    end: end,
                    time: 0.05,
                    rever:true
                })
                var seq = cc.sequence(ttac,cc.delayTime(0.5),ttac1)
                renby.runAction(seq)
            }

            renbb.runEye = function(start,end){
                var start = start || 11
                var end = end || 13
                var ttac = createAnimation({
                    frame:"renTwo%d.png",
                    start:start,
                    end: end,
                    time: 0.05
                })
                var ttac1 = createAnimation({
                    frame:"renTwo%d.png",
                    start:start-1,
                    end: end,
                    time: 0.05,
                    rever:true
                })
                var seq = cc.sequence(ttac,cc.delayTime(0.5),ttac1)
                renbb.runAction(seq)
            }
            renbb.runBozi = function(){
                var seq = cc.sequence(
                    cc.delayTime(1.5),
                    cc.callFunc(function(){
                        renbb.setSpriteFrame("renTwo14.png")
                    }),
                    cc.delayTime(0.6),
                    cc.callFunc(function(){
                        renbb.runEye(15,17)
                    })
                )
                renbb.runAction(seq)
            }

            var ttac = createAnimation({
                        frame:"renTwo%d.png",
                        start:1,
                        end: 5,
                        time: 0.2,
                        fun:function(){
                            renby.setSpriteFrame("renTwo6.png")
                            var m = renby.getChildByName("m")
                            m.setVisible(true) 
                        }
                    })
            renby.runAction(cc.sequence(
                cc.delayTime(1),
                ttac,
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    renbb.runEye()
                    renbb.runBozi()
                    renby.speak(4.4,function(){
                        node.bg1.playAc2()
                    })
                }),
                cc.delayTime(3),
                cc.callFunc(renby.runEye)
            ))
        }
        node.bg2.playAc = function(){
            node.bg1.setVisible(false)
            node.bg2.setVisible(true)
            node.gq1.pause()
            var boyBlue = node.bg2.getChildByName("bbg")
            var boyBlue_eye1 = boyBlue.getChildByName("eyea")
            var boyBlue_eye2 = boyBlue.getChildByName("eyec")
            var boyBlue_zui = boyBlue.getChildByName("za")
            var boyBlue_yizi = node.bg2.getChildByName("yzi2")
            var boyBlue_tip = boyBlue.getChildByName("tip2")

            var boyRed = node.bg2.getChildByName("byy")
            var boyRed_eye1 = boyRed.getChildByName("eyea")
            var boyRed_eye2 = boyRed.getChildByName("eyeb")
            var boyRed_yizi = node.bg2.getChildByName("yzi1")

            boyBlue.runEye = function(){
                var eyeAc = cc.sequence(
                    createAnimation({
                                frame:"eyea%d.png",
                                start:1,
                                end: 4,
                                time: 0.1
                            }),
                    cc.delayTime(0.1),
                    createAnimation({
                                frame:"eyea%d.png",
                                start:1,
                                end: 4,
                                time: 0.1,
                                rever:true
                            })
                )
                var eyeAc1 = cc.sequence(
                    createAnimation({
                                frame:"eyea%d.png",
                                start:1,
                                end: 4,
                                time: 0.1
                            }),
                    cc.delayTime(0.1),
                    createAnimation({
                                frame:"eyea%d.png",
                                start:1,
                                end: 4,
                                time: 0.1,
                                rever:true
                            })
                )
                boyBlue_eye1.runAction(eyeAc)
                boyBlue_eye2.runAction(eyeAc1)
            }
            boyBlue.runZui = function(time){
                var zuiAc = cc.sequence(
                    createAnimation({
                                frame:"za%d.png",
                                start:1,
                                end: 4,
                                time: 0.05
                            }),
                    createAnimation({
                                frame:"za%d.png",
                                start:1,
                                end: 4,
                                time: 0.05,
                                rever:true
                            })
                )
                boyBlue_zui.runAction(cc.repeatForever(zuiAc))
                boyBlue_zui.runAction(cc.sequence(
                    cc.delayTime(time),
                    cc.callFunc(function(){
                        boyBlue_zui.stopAllActions()
                        boyBlue_zui.setSpriteFrame("za1.png")
                        boyBlue_tip.setVisible(false)
                    })
                ))
            }
            boyBlue.runJl = function(){
                boyBlue_eye1.setVisible(false)
                boyBlue_eye2.setVisible(false)
                boyBlue_zui.setVisible(false)
                boyBlue_yizi.setVisible(false)
                var jlAc = cc.sequence(
                    createAnimation({
                        frame:"bbg%d.png",
                        start:2,
                        end: 6,
                        time: 0.2
                    }),
                    cc.delayTime(0.3),
                    createAnimation({
                                frame:"bbg%d.png",
                                start:6,
                                end: 9,
                                time: 0.2,
                                fun:function(){
                                    boyBlue.setSpriteFrame("bbg6.png")
                                }
                            })
                )
                boyBlue.runAction(jlAc)
            }

            boyRed.runEye = function(){
                var eyeAc = cc.sequence(
                    createAnimation({
                                frame:"eyea%d.png",
                                start:1,
                                end: 4,
                                time: 0.1
                            }),
                    cc.delayTime(0.1),
                    createAnimation({
                                frame:"eyea%d.png",
                                start:1,
                                end: 4,
                                time: 0.1,
                                rever:true
                            })
                )
                var eyeAc1 = cc.sequence(
                    createAnimation({
                                frame:"eyeb%d.png",
                                start:1,
                                end: 4,
                                time: 0.1
                            }),
                    cc.delayTime(0.1),
                    createAnimation({
                                frame:"eyeb%d.png",
                                start:1,
                                end: 4,
                                time: 0.1,
                                rever:true
                            })
                )
                boyRed_eye1.runAction(eyeAc)
                boyRed_eye2.runAction(eyeAc1)
            }
            boyRed.runJl = function(){
                var jlAc = cc.sequence(
                    cc.delayTime(0.2),
                    cc.callFunc(function(){
                        boyRed_eye1.setVisible(false)
                        boyRed_eye2.setVisible(false)
                        boyRed_yizi.setVisible(false)
                    }),
                    createAnimation({
                                frame:"byy%d.png",
                                start:2,
                                end: 6,
                                time: 0.2
                            }),
                    cc.delayTime(0.4),
                    createAnimation({
                                frame:"byy%d.png",
                                start:6,
                                end: 10,
                                time: 0.2,
                                fun:function(){
                                    boyRed.setSpriteFrame("byy6.png")
                                }
                            })
                )
                boyRed.runAction(jlAc)
            }

            boyBlue.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.callFunc(boyBlue.runEye),
                cc.delayTime(1),
                cc.callFunc(function(){
                    boyBlue_tip.setVisible(true)
                    playMusic(res.timp2)
                    boyBlue.runZui(2)
                }),
                cc.delayTime(1.5),
                cc.callFunc(function(){
                    boyBlue.runEye()
                }),
                cc.delayTime(1.5),
                cc.callFunc(function(){
                    boyBlue.runJl()
                    boyRed.runJl()
                }),
                cc.delayTime(4),
                cc.callFunc(function(){
                    node.bg1.playAc1()
                })

            ))

            boyRed.runAction(cc.sequence(
                cc.delayTime(0.8),
                cc.callFunc(boyRed.runEye)
            ))
        }
    }
})