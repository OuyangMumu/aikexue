var curMusic = null
var seeExp2 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp2",
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
    initUI:function(){
        var self = this
        
        var tip = new cc.Sprite(res.tip1)
        tip.setPosition(565,545)
        self.addChild(tip)
        tip.num = 1
        tip.changeTure = function(num){
            if(tip.num!=num){
                tip.num = num
                tip.setTexture(res[sprintf("tip%d",num)])
            }
        }

        var boy = new cc.Sprite(res.boy1)
        boy.setPosition(573,110)
        self.addChild(boy)
        boy.num = 1
        boy.changeTure = function(num){
            if(boy.num!=num){
                boy.num = num
                boy.setTexture(res[sprintf("boy%d",num)])
            }
        }

        var airPlane = new cc.Sprite(res.airplane)
        airPlane.setPosition(306,374)
        airPlane.initPos = airPlane.getPosition()
        airPlane.setAnchorPoint(1,0.28)
        self.addChild(airPlane)

        var bowen = self.createBoWen()
        bowen.setPosition(airPlane.width,airPlane.height*0.28)
        airPlane.addChild(bowen)

        airPlane.speed = 6
        airPlane.right = 1
        airPlane.playAc = function(){
            bowen.changeBowen(cc.p(0.5 + airPlane.speed*0.042,0.5))
            if(!airPlane.doing){
                airPlane.doing = true
                airPlane.runAction(cc.repeatForever(cc.sequence(
                    cc.callFunc(function(){
                        if(airPlane.x>=1400){
                            airPlane.right = -1
                            airPlane.setScaleX(airPlane.right)
                        }else if(airPlane.x<=-250){
                            airPlane.right = 1
                            airPlane.setScaleX(airPlane.right)
                        }
                        if(airPlane.right==1){
                            if(airPlane.x<=730){
                                tip.changeTure(2)
                            }else{
                                tip.changeTure(3)
                            }
                        }else{
                            if(airPlane.x>480){
                                tip.changeTure(2)
                            }else{
                                tip.changeTure(3)
                            }
                        }
                        if(airPlane.x<500){
                            boy.changeTure(1)
                        }else if(airPlane.x>730){
                            boy.changeTure(3)
                        }else{
                            boy.changeTure(2)
                        }
                        airPlane.x = airPlane.x + airPlane.speed * airPlane.right
                    }),
                    cc.delayTime(0.001)
                )))
            }else{
                airPlane.resume() 
            }
        }
        airPlane.pauseAc = function(){
            airPlane.pause()
            tip.changeTure(1)
            bowen.changeBowen(cc.p(0.5,0.5))
        }
        
        var airspeed = new cc.Sprite(res.airspeed)
        airspeed.setPosition(188,50)
        self.addChild(airspeed)

        var tospeed = new cc.Sprite(res.tospeed)
        tospeed.setPosition(249,66)
        airspeed.addChild(tospeed)

        airPlane.initSome = function(){
            airPlane.stopAllActions()
            airPlane.setPosition(airPlane.initPos)
            airPlane.doing =  false
            airPlane.speed = 6
            airPlane.right = 1
            airPlane.setScaleX(airPlane.right)
            tospeed.setPosition(249,66)
            tip.changeTure(1)
            boy.changeTure(1)
        }

        createTouchEvent({
            item:tospeed,
            begin:function(){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var tempx = item.x + delta.x
                if(tempx<=177){
                    tempx = 177
                }else if(tempx>=357){
                    tempx = 357
                }
                item.x = tempx
                airPlane.speed = (item.x - 177)/12
                if(airPlane.doing){
                   bowen.changeBowen(cc.p(0.5 + airPlane.speed*0.042,0.5)) 
                }  
            },
            end:function(data){
                var item = data.item
                if(airPlane.speed==0){
                   tip.changeTure(1)  
                }
            }
        })

        var startBtn = new ccui.Button(res.startbtn,res.startbtn1)
        var stopBtn = new ccui.Button(res.stopbtn,res.stopbtn1)
        startBtn.setPosition(140,200)
        self.addChild(startBtn)
        startBtn.addClickEventListener(function(){
            airPlane.playAc()
            startBtn.setVisible(false)
            stopBtn.setVisible(true)
        })

        //var stopBtn = new ccui.Button(res.stopbtn,res.stopbtn1)
        stopBtn.setPosition(140,200)
        self.addChild(stopBtn)
        stopBtn.setVisible(false)
        stopBtn.addClickEventListener(function(){
            airPlane.pauseAc()
            stopBtn.setVisible(false)
            startBtn.setVisible(true)
        })

        var resetBtn = new ccui.Button(res.resetbtn,res.resetbtn1)
        resetBtn.setPosition(140,140)
        self.addChild(resetBtn)
        resetBtn.addClickEventListener(function(){
            airPlane.initSome()
            stopBtn.setVisible(false)
            startBtn.setVisible(true)
        })
    },
    createBoWen:function(){
        var node = new cc.Node()
        var list = []
        list[0] = new cc.Sprite(res.bo0)
        node.addChild(list[0])
        list[0].setScale(0)
        list[0].runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.7,1),
            cc.callFunc(function(){
                list[0].setScale(0)
            })
        )))

        list[1] = new cc.Sprite(res.bo1)
        node.addChild(list[1])
        list[1].setScale(0.5)
        list[1].setVisible(false)
        node.runAction(cc.sequence(
            cc.delayTime(0.7),
            cc.callFunc(function(){
                list[1].setVisible(true)
                list[1].runAction(cc.repeatForever(cc.sequence(
                    cc.scaleTo(0.7,1),
                    cc.callFunc(function(){
                        list[1].setScale(0.5)
                    })
                )))
            })
        ))

        list[2] = new cc.Sprite(res.bo2)
        node.addChild(list[2])
        list[2].setScale(0.66)
        list[2].setVisible(false)
        node.runAction(cc.sequence(
            cc.delayTime(1.4),
            cc.callFunc(function(){
                list[2].setVisible(true)
                list[2].runAction(cc.repeatForever(cc.sequence(
                    cc.scaleTo(0.7,1),
                    cc.callFunc(function(){
                        list[2].setScale(0.66)
                    })
                )))
            })
        ))

        list[3] = new cc.Sprite(res.bo3)
        node.addChild(list[3])
        list[3].setScale(0.75)
        list[3].setVisible(false)
        node.runAction(cc.sequence(
            cc.delayTime(2.1),
            cc.callFunc(function(){
                list[3].setVisible(true)
                list[3].runAction(cc.repeatForever(cc.sequence(
                    cc.spawn(
                        cc.scaleTo(0.7,1),
                        cc.fadeOut(0.7)
                    ),
                    cc.callFunc(function(){
                        list[3].setScale(0.75)
                        list[3].setOpacity(255)
                    })
                )))
            })
        ))

        node.changeBowen = function(anpos){
            for (var i = 0; i < list.length; i++) {
                list[i].setAnchorPoint(anpos)
            }
        }
        return node
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.speakeBykey("wenzi2")
            })
        }
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })
    }
})