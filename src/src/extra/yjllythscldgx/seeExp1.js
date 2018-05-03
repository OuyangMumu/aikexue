var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
        
        })
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.speakeBykey("wenzi1")
            })
        }
    },
    speakeBykey:function(key){
        var self = this
        self.nodebs.say({
                    key: key,
                    force: true,
                    fun:function(){
                    }
                })
    },
    initUI:function(){
        var self = this
        var seetitle1 = new cc.Sprite(res.seetitle1)
        seetitle1.setPosition(getMiddle(-260,150))
        self.addChild(seetitle1)

        var tjt = self.createThDev()
        tjt.setPosition(getMiddle(0,0))
        self.addChild(tjt)
        
    },
    createThDev:function(){
        var self = this
        var tjt = new cc.Sprite(res.tjt)

        var th1 = new cc.Sprite(res.th1)
        th1.setPosition(352.22,510.22)
        tjt.addChild(th1)

        var seeresult = new cc.Sprite(res.seeresult)
        seeresult.setPosition(-56,240)
        tjt.addChild(seeresult)
        seeresult.setVisible(false)

        var mainTh = new cc.Sprite(res.th2)
        mainTh.setPosition(351.2,501)
        mainTh.setAnchorPoint(0.5,1)
        tjt.addChild(mainTh)
        mainTh.doing = false
        mainTh.playAc = function(){
            var curScale = mainTh.getScaleY()
            if(curScale!=1){
                mainTh.doing = true
                if(curScale>1){
                    mainTh.max = curScale
                    mainTh.min = 2-curScale
                }else if(curScale<1){
                    mainTh.min = curScale
                    mainTh.max = 2-curScale
                }else if(curScale==1){
                    mainTh.min = curScale
                    mainTh.max = curScale
                }
                mainTh.cur = curScale
                mainTh.runAction(cc.repeatForever(cc.sequence(
                    cc.callFunc(function(){
                        if(mainTh.max!=1){
                            if(mainTh.cur>1){
                                mainTh.min = mainTh.min + 0.05
                                mainTh.cur = mainTh.min
                            }else if(mainTh.cur<1){
                                mainTh.max = mainTh.max - 0.05
                                mainTh.cur = mainTh.max
                            }else if(mainTh.cur==1){
                                mainTh.min = 1
                                mainTh.max = 1
                                mainTh.cur = 1
                            }
                            mainTh.runAction(cc.scaleTo(0.18,1,mainTh.cur))
                            if(Math.abs(mainTh.max-mainTh.min)<0.02 || mainTh.min>1 || mainTh.max<1){
                                mainTh.stopAllActions()
                                mainTh.setScaleY(1)
                                mainTh.min = 1
                                mainTh.max = 1
                                mainTh.cur = 1
                                mainTh.doing = false
                                seeresult.setVisible(true)
                                self.speakeBykey("wenzi2")
                            }
                        }
                    }),
                    cc.delayTime(0.2)
                )))
            }
        }

        var ThGou = new cc.Sprite(res.gou)
        ThGou.setPosition(21,4)
        ThGou.setAnchorPoint(0.5,1)
        mainTh.addChild(ThGou)

        var hand = new cc.Sprite(res.hand2)
        hand.setPosition(495,246)
        tjt.addChild(hand)
        hand.srcpos = cc.p(495,246)
        hand.despos = cc.p(391.8,246)

        var handGou = new cc.Sprite(res.gou)
        handGou.setPosition(11.7,73)
        hand.addChild(handGou)
        handGou.setVisible(false)

        var handpre = new cc.Sprite(res.hand1)
        handpre.setPosition(62,9)
        hand.addChild(handpre)


        createTouchEvent({
            item:handpre,
            begin:function(){
                if(mainTh.doing){
                    return false
                }
                hand.setPosition(hand.despos)
                handGou.setVisible(true)
                ThGou.setVisible(false)
                return true
            },
            move:function(data){
                var delta = data.delta
                var tempy = hand.y + delta.y
                if(tempy>=300){
                    tempy = 300
                }else if(tempy<=140){
                    tempy = 140
                }
                hand.y = tempy
                //ThGou.y = hand.y + 48
                var zenH = 246 - hand.y
                mainTh.setScaleY(1+0.0048*zenH)
            },
            end:function(){
                hand.setPosition(hand.srcpos)
                handGou.setVisible(false)
                ThGou.setVisible(true)
                mainTh.playAc()
            }
        })

        return tjt
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)

        addContent({
                    people: this.nodebs,
                    key: "wenzi1",
                    sound:res.zimp1
                })
        addContent({
                    people: this.nodebs,
                    key: "wenzi2",
                    sound:res.zimp2
                })
    }
})