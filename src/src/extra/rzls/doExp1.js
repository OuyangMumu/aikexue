//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           
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
        var fabtn = new ccui.Button(res.btn_result_normal,res.btn_result_select)
        fabtn.setPosition(1040,400)
        self.addChild(fabtn)
        fabtn.setVisible(false)
        fabtn.addClickEventListener(function(){
            self.nodebs.say({
                    key: "jl1",
                })
        })

        var pan = self.createPan()
        pan.setPosition(480,160)
        self.addChild(pan)

        var WaterColor = self.createWaterColor()
        WaterColor.setPosition(530,180)
        pan.addSome.addChild(WaterColor)

        safeAdd(self,WaterColor.Fdj)
        WaterColor.Fdj.setPosition(190,380)
        
        var changeWendu = function(node){
            var father = node.father
            if(father.y<=250 && node.inflag)
            {   
                pan.changeWaterHigh(250 - father.y)
                father.changeTemperture("up",function(){
                    self.speakeBykey("wenzi4")
                })
            }else{
                pan.changeWaterHigh(0)
                father.changeTemperture("down")
            }
        }
        createTouchEvent({
            item:WaterColor.waterP,
            begin:function(data){
                var result = judgeOpInPos(data)
                return result
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                tempx = item.father.x + delta.x
                tempy = item.father.y + delta.y
                if(tempy<=365){
                    if(!item.inflag){
                        if(tempx<=419){
                            tempx = 419
                        } 
                    }else{
                        tempx = 170
                        if(tempy<=170){
                            tempy = 170
                        }
                    }  
                }else{
                    if(tempx<=419){
                        item.inflag = true
                    }else{
                        item.inflag = false
                    }
                    if(tempx<=93){
                        tempx = 93
                    }
                }
                item.father.x = tempx
                item.father.y = tempy
                changeWendu(item)
            },
            end:function(data){
                var item = data.item
                if(item.inflag){
                    fabtn.setVisible(true)
                    item.father.setPosition(170,170)
                }else{
                    item.father.setPosition(538,180)
                }
                changeWendu(item)
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

        var air1 = createWaterAir({
                            total: 15,
                            width: 5,
                            height: 20,
                            dis:200,
                            disvar:10,
                            timevar:0.3,
                            canOp:true
                        })
        air1.setPosition(140,100)
        pan.addSome.addChild(air1)

        var air2 = createWaterAir({
                            total: 15,
                            width: 5,
                            height: 20,
                            dis:200,
                            disvar:10,
                            timevar:0.3,
                            canOp:true
                        })
        air2.setPosition(195,100)
        pan.addSome.addChild(air2)

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
        return pan
    },
    createWaterFdj:function(){

        var fatherNode = new cc.Node()
        var node = new cc.Node()

        var jjm = createClip({
                          toShowimg:res.waterfdj,
                          ShowimgPos:cc.p(0,0),
                          toSencilimg:res.waterfdj,
                          sencilPos:cc.p(0,0),
                          father:node,
                       })
        jjm.setOpacity(0)
        var waterZhu = new cc.Sprite(res.waterZhu1)
        waterZhu.setPosition(130,-136)
        jjm.addChild(waterZhu)
        fatherNode.waterZhu = waterZhu

        var zhuline = new cc.Sprite(res.zhuline)
        zhuline.setPosition(129,58)
        jjm.addChild(zhuline)
        fatherNode.zhuline = zhuline

        var waterTop = new cc.Sprite(res.watertop)
        waterTop.setPosition(130,153)
        jjm.addChild(waterTop)
        fatherNode.addChild(node)

        var jm = new cc.Sprite(res.waterfdj)
        jm.setScale(1.015)
        node.addChild(jm)
        return fatherNode
    },
    createWaterColor:function(){
        var self = this
        var fatherNode =  new cc.Node()

        var waterP = new cc.Sprite(res.waters)
        fatherNode.addChild(waterP,3)
        fatherNode.waterP = waterP
        waterP.father = fatherNode

        var Fdj = self.createWaterFdj()
        Fdj.setPosition(290,380)
        fatherNode.addChild(Fdj)
        fatherNode.Fdj = Fdj

        var lay = createLayout({
                    size:cc.size(50,220),
                    pos:cc.p(-27,69),
                    clip:true
                })
        fatherNode.addChild(lay,1)

        var node =  new cc.Node()
        node.setScale(0.45)
        node.setPosition(25,12)

        var waterI = new cc.Sprite(res.waterZhu1)
        waterI.setPosition(-0.5,0)
        node.addChild(waterI)

        var waterT = new cc.Sprite(res.watertop)
        waterT.setPosition(0,285)
        node.addChild(waterT)

        lay.addChild(node,1)
        fatherNode.canchange = "down"
        fatherNode.changeTemperture = function(status,fun){
            if(fatherNode.canchange != status){
                fatherNode.canchange = status
                switch(status){
                    case "up":
                        waterI.stopAllActions()
                        var time = (120 - waterI.getPositionY())/6
                        waterI.runAction(cc.moveTo(time,cc.p(0,120)))
                        Fdj.waterZhu.stopAllActions()
                        Fdj.zhuline.y = 58 + (Fdj.waterZhu.y + 136)
                        Fdj.waterZhu.runAction(cc.sequence(
                            cc.moveTo(time,cc.p(130,-16)),
                            cc.callFunc(function(){
                                if(fun)fun()
                            })
                        ))
                    break 
                    case "down":
                        waterI.stopAllActions()
                        var time = waterI.getPositionY()/4
                        waterI.runAction(cc.moveTo(time,cc.p(0,0)))
                        Fdj.waterZhu.stopAllActions()
                        Fdj.zhuline.y = 58 + (Fdj.waterZhu.y + 136)
                        Fdj.waterZhu.runAction(cc.moveTo(time,cc.p(130,-136)))
                    break
                }
            }
        }

        return fatherNode
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.speakeBykey("wenzi3")
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
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })

        addContent({
           people: this.nodebs,
           key: "jl1",
           img:res.jl1,
           id:"result",
           sound: res.jlmp1,
           offset: cc.p(30, 30),
           offbg: cc.p(0,50),
       })
    }  
})