//@author mu @16/5/11
var Touch = true
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("gsrfires")
        })
        this._super()
        var self = this
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var pan = self.createPan()
        pan.setPosition(700,120)
        self.addChild(pan)

        var goldFather = self.createGuaGold({
                            moveFun:function(gold){
                                var h = 106 - gold.y
                                if(h >= 0){
                                    if(h>=2){
                                        if(gold.isRed){
                                            pan.playMaoAir(gold)
                                            gold.playMie() 
                                        }  
                                    }
                                    pan.changeWaterHigh(h)
                                }
                            },
                            endFun:function(gold){
                                if(gold.x<=220){
                                    goldFather.TouchTwo.canTouch = false
                                    goldFather.TouchOne.canTouch = false 
                                }else{
                                    goldFather.TouchTwo.canTouch = true
                                    goldFather.TouchOne.canTouch = true 
                                }
                            },
                            jjdFunOnOff:function(item){
                                self.jjd.setCanClick(item.ok)
                            }
                        })
        goldFather.setPosition(-180,280)
        pan.addSome.addChild(goldFather)

        var jjd = createJJD({
                    pos:cc.p(392,132),
                    father:self,
                    doSomeFun:function(node){
                        node.setVisible(false)
                    },
                    closeFireFun:function(){
                        self.jjd.curFire.setVisible(false)
                    },
                    judgeBeforeDgFun:function(){
                        self.wenzi8 = false
                        self.speakeBykey("wenzi8")
                    }
                })
        self.jjd = jjd
        jjd.setScale(-1,1)

        var curFire = new cc.Sprite("#gsrfire05.png")
        curFire.setPosition(64.5,166)
        curFire.setScale(-1,1)
        jjd.addChild(curFire)
        curFire.setVisible(false)
        jjd.curFire = curFire
        var ac = createAnimation({
                                frame:"gsrfire%02d.png",
                                start:5,
                                end:14,
                                time: 0.1
                            })
        curFire.runAction(cc.repeatForever(ac))

        jjd.setCanClick(false)
        jjd.setCallBack({
            up:function(){
                goldFather.TouchTwo.canTouch = true
                goldFather.TouchOne.canTouch = true 
            },
            fire:function(){
                curFire.setVisible(true)
                jjd.setCanClick(false)
                goldFather.goldTouch.disListen(true)
                goldFather.playRed(function(){
                    jjd.setCanClick(true)
                })
            },
            down:function(){
                goldFather.goldTouch.disListen(false)
                goldFather.TouchTwo.canTouch = false
                goldFather.TouchOne.canTouch = false 
            }
        })
    },
    createPan:function(){
        var pan = new cc.Sprite(res.pan1)
        pan.setCascadeOpacityEnabled(false)
        pan.setOpacity(0)

        var pan7 = new cc.Sprite(res.pan6)
        pan7.setPosition(173.5,202)
        pan.addChild(pan7)

        pan.addSome = new cc.Node()
        pan.addChild(pan.addSome)
        
        var waterDi = new cc.Sprite(res.pan5)
        waterDi.setPosition(173.5,28)
        pan.addChild(waterDi)

        pan.waterMid = new cc.Sprite(res.pan4)
        pan.waterMid.setAnchorPoint(0.5,0)
        pan.waterMid.setPosition(173.5,53.5)
        pan.addChild(pan.waterMid)

        pan.waterUp = new cc.Sprite(res.pan2)
        pan.waterUp.setAnchorPoint(0.5,0)
        pan.waterUp.setPosition(173.5,81.5)
        pan.addChild(pan.waterUp)

        var panpre = new cc.Sprite(res.pan3)
        panpre.setPosition(173.5,100)
        pan.addChild(panpre)

        pan.curH = 0
        pan.changeWaterHigh = function(h){
            if(h != pan.curH)
            {
                pan.curH = h
                var changeH = pan.curH/80
                pan.waterMid.setScaleY(1+changeH)
                pan.waterUp.y = 81.5 + changeH * 28
            }
        }
        pan.playMaoAir = function(item){
            var world = getWorldPos(item)
            var toPos = pan.addSome.convertToNodeSpace(world)
            var air1 = createWaterAir({
                            total: 17,
                            width: 5,
                            height: 20,
                            dis:250,
                            disvar:10,
                            timevar:0.3,
                            canOp:true
                        })
            air1.setScale(1.2,0.8)
            air1.setPosition(toPos.x,110)
            pan.addSome.addChild(air1)
            air1.runAction(cc.sequence(
                cc.fadeOut(4),
                cc.callFunc(function(){
                    air1.removeFromParent(true)
                    air1 = null 
                })
            ))
        }
        return pan
    },
    createGuaGold:function(data){
        var self = this
        var data = data || {}
        var moveFun = data.moveFun
        var endFun = data.endFun
        var jjdFunOnOff = data.jjdFunOnOff
        var goldTjt = new cc.Sprite(res.goldTjt)
        var tao3 = new cc.Sprite(res.tao3)
        tao3.setPosition(181,215)
        goldTjt.addChild(tao3)

        var gold = new cc.Sprite(res.gold)
        gold.setPosition(185,221)
        gold.setAnchorPoint(0.5,0)
        goldTjt.addChild(gold)
        goldTjt.gold = gold
        
        var shl = new cc.Sprite(res.shl)
        shl.setPosition(41,21)
        gold.addChild(shl)
        shl.setOpacity(0)

        goldTjt.createTip = function(data){
            var angle = data.angle || 0
            var src = data.src || cc.p(0,0)
            var des = data.des || cc.p(10,0)
            var img = data.img
            var imgpos = data.imgpos || cc.p(0,0)
            var node = new cc.Node()
            var yellow = new cc.Sprite(res.yellow)
            yellow.setRotation(angle)
            node.addChild(yellow)
            yellow.setScale(0.7)
            var seq = cc.sequence(cc.moveTo(0.4,src),cc.moveTo(0.4,des))
            yellow.runAction(cc.repeatForever(seq))

            var sp = new cc.Sprite(img)
            sp.setPosition(imgpos)
            node.addChild(sp)
            return node
        }
        var tip3 =  goldTjt.createTip({
                        angle:45,
                        des:cc.p(6,-6),
                        imgpos:cc.p(-28,28),
                        img:res.w3
                    })
        tip3.setPosition(170,490)
        goldTjt.addChild(tip3)
        tip3.setVisible(false)

        gold.isRed = false
        gold.playMie = function(){
            if(gold.isRed){
                gold.isRed = false
                self.speakeBykey("wenzi13")
                shl.runAction(cc.fadeOut(0.1))
            }
        }
        goldTjt.playRed = function(fun){
            shl.runAction(cc.sequence(
                cc.fadeIn(5),
                cc.callFunc(function(){
                    gold.isRed = true
                    self.wenzi10 = false
                    self.speakeBykey("wenzi10")
                    if(fun)fun()
                })
            ))
        }

        var tip1 =  goldTjt.createTip({
                        angle:-45,
                        des:cc.p(6,6),
                        imgpos:cc.p(-28,-28),
                        img:res.w1
                    })
        tip1.setPosition(20,180)
        goldTjt.addChild(tip1)

        var tip2 =  goldTjt.createTip({
                        angle:45,
                        des:cc.p(6,-6),
                        imgpos:cc.p(-50,40),
                        img:res.w2
                    })
        tip2.setPosition(-10,230)
        goldTjt.addChild(tip2)
        tip2.setVisible(false)

        var goldhand = new cc.Sprite(res.goldhand)
        goldhand.setPosition(75,265)
        gold.addChild(goldhand)
        gold.goldhand = goldhand
        goldhand.setVisible(false)
        goldhand.toShow = function(jude){
            goldhand.setVisible(jude)
            goldhand.disListen(!jude)
        }

        var goldTouch = new cc.Sprite(res.zhuline)
        goldTouch.setPosition(40,250)
        goldTouch.setScale(1.5,5)
        gold.addChild(goldTouch)
        goldTouch.setVisible(false)
        goldTjt.goldTouch = goldTouch

        createTouchEvent({
            item:goldTouch,
            begin:function(){
                if(Touch){
                    if(goldTjt.TouchTwo.canTouch){
                        Touch = true
                        return false
                    }
                    Touch = false
                    goldhand.toShow(true)
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var tempx = gold.x + delta.x
                var tempy = gold.y + delta.y
                tip3.setVisible(false)
                if(tempx<=181){
                    tempx = 181
                    tempy = 221
                }else if(tempx<=380){
                    tempy = 221
                }
                if(tempy>=221){
                    tempy = 221
                }
                if(tempy<=15){
                    tempy = 15
                }
                if(tempx<=610){
                    gold.x = tempx
                }
                if(moveFun){
                    moveFun(gold)
                }
                gold.y = tempy
            },
            end:function(data){
                Touch = true
                if(endFun)endFun(gold)
                if(gold.x<=220){
                    gold.x = 181
                    goldhand.toShow(false)
                }
            }
        })

        createTouchEvent({
            item:goldhand,
            begin:function(){
                if(Touch){
                    Touch = false
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var tempx = gold.x + delta.x
                var tempy = gold.y + delta.y
                if(tempx<=181){
                    tempx = 181
                    tempy = 221
                }else if(tempx<=380){
                    tempy = 221
                }
                if(tempy>=221){
                    tempy = 221
                }
                if(tempy<=15){
                    tempy = 15
                }
                if(tempx<=610){
                    gold.x = tempx
                }
                if(moveFun){
                    moveFun(gold)
                }
                gold.y = tempy
            },
            end:function(data){
                Touch = true
                if(endFun)endFun(gold)
                if(gold.x<=220){
                    gold.x = 181
                    goldhand.toShow(false)
                }
            }
        })
        goldhand.disListen(true)

        var tao = new cc.Sprite(res.tao2)
        tao.setPosition(116,225)
        goldTjt.addChild(tao)

        var TouchOne = new cc.Sprite(res.zhuline)
        TouchOne.setPosition(43,54)
        TouchOne.setScale(1.6,5.3)
        tao.addChild(TouchOne)
        TouchOne.setVisible(false)
        goldTjt.TouchOne = TouchOne

        var TouchTwo = new cc.Sprite(res.zhuline)
        TouchTwo.setPosition(5,54)
        TouchTwo.setScale(1.3,4.2)
        tao.addChild(TouchTwo)
        TouchTwo.setVisible(false)
        goldTjt.TouchTwo = TouchTwo

        createTouchEvent({
            item:TouchOne,
            begin:function(data){
                if(Touch){
                    var item = data.item
                    Touch = false
                    if(!item.canTouch){
                        if(TouchTwo.ok){
                            TouchTwo.ok = false
                            tao.setTexture(res.tao2)
                            TouchTwo.setPosition(5,54)
                            tao3.setVisible(true)
                            jjdFunOnOff(TouchTwo)
                        }
                        return true
                    }else{
                        Touch = true
                        return false
                    }
                }          
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var tempy = tao.y + delta.y
                tip1.setVisible(false)
                tip2.setVisible(false)
                if(tempy<=225){
                    tempy = 225
                }else if(tempy>=454){
                    tempy = 454
                }
                if(gold.isRed){
                    if(tempy>=260){
                       tempy = 260
                       tip3.setVisible(true)
                       self.speakeBykey("wenzi11")
                    }
                }
                if(tempy>=280){
                    self.speakeBykey("wenzi8")
                }
                tao.y =  tempy
                tao3.y = tao.y - 10
            },
            end:function(data){
                Touch = true
                if(tao.y<=270){
                    tao.y = 225
                    tao3.y = tao.y - 10
                    TouchTwo.canTouch = false
                    if(!gold.isRed){
                       tip2.setVisible(true) 
                   }                    
                }else{
                    TouchTwo.canTouch = true
                }
            }
        })

        createTouchEvent({
            item:TouchTwo,
            begin:function(data){
                var item = data.item
                if(Touch){
                    Touch = false
                    // if(gold.isRed && gold.x<=220){
                    //     self.wenzi10 = false
                    //     self.speakeBykey("wenzi10")
                    // }
                    tip2.setVisible(false)
                    if(!item.canTouch){
                        if(!item.ok){
                            item.ok = true
                            tao.setTexture(res.tao1)
                            item.setPosition(36,20)
                            tao3.setVisible(false)
                            self.wenzi9 = false
                            self.speakeBykey("wenzi9")
                        }else{
                            item.ok = false
                            tao.setTexture(res.tao2)
                            item.setPosition(5,54)
                            tao3.setVisible(true)
                        }
                        jjdFunOnOff(TouchTwo)
                        return true
                    }else{
                        Touch = true
                        return false
                    }
                }
            },
            end:function(){
                Touch = true
            }
        })

        return goldTjt
    },
    speakeBykey:function(key){
        var self = this
        if(!self[key]){
            self[key] = true
            self.nodebs.say({
                    key: key,
                    force: true
                })
        }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.speakeBykey("wenzi7")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi7",
            img:res.wenzi7,
            sound: res.zimp7
        })
        addContent({
            people: this.nodebs,
            key: "wenzi8",
            img:res.wenzi8,
            sound: res.zimp8
        })
        addContent({
            people: this.nodebs,
            key: "wenzi9",
            img:res.wenzi9,
            sound: res.zimp9,
            offset: cc.p(0,20),
            btnoffset:cc.p(0,-20)
        })
        addContent({
            people: this.nodebs,
            key: "wenzi10",
            img:res.wenzi10,
            sound: res.zimp10
        })
        addContent({
            people: this.nodebs,
            key: "wenzi11",
            img:res.wenzi11,
            sound: res.zimp11
        })
        addContent({
            people: this.nodebs,
            key: "wenzi12",
            img:res.wenzi12,
            sound: res.zimp12
        })
        addContent({
            people: this.nodebs,
            key: "wenzi13",
            img:res.wenzi13,
            sound: res.zimp13
        })
    }  
})