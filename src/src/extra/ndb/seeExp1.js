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
    initUI:function(){
        var self = this
        var uiname = ["pt","jzbtn"]
        var node = loadNode(res.seeJson,uiname)
        self.addChild(node)
        self.node = node
        var mid = node.pt.getChildByName("mid")

        var balls = []
        var vr_balls = []
        for (var i = 0; i < 5; i++) {
            var ponit = new cc.Sprite(res.pos)
            mid.addChild(ponit)
            ponit.setPosition(-107 + i*54,2)

            balls[i] = self.createTQ(true)
            balls[i].setPosition(-107 + i*54,0)
            balls[i].ball.index = i
            mid.addChild(balls[i])

            vr_balls[i] = self.createTQ(false)
            vr_balls[i].setPosition(-107 + i*54,0)
            vr_balls[i].ball.index = i
            vr_balls[i].setVisible(false)
            mid.addChild(vr_balls[i])
            balls[i].vr = vr_balls[i]
            vr_balls[i].ar = balls[i]
        }
        self.balls = balls
        self.vr_balls = vr_balls

        node.jzbtn.addClickEventListener(function(){
            self.allReset()
        })
        var jlbtn = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        jlbtn.setPosition(1040,400)
        self.addChild(jlbtn)
        jlbtn.setVisible(false)
        jlbtn.addClickEventListener(function(){
            self.nodebs.say({
                    key: "jl1"
                })
        })
        self.jlbtn = jlbtn
    },
    allReset:function(){
        var self = this
        //self.is6 = false
        self.is5 = false
        for (var i = 0; i < 5; i++) {
            self.balls[i].resetAll()
            self.balls[i].setVisible(true)
            self.vr_balls[i].resetAll()
            self.balls[i].ballNode.stopAllActions()
            self.vr_balls[i].ballNode.stopAllActions()
            self.vr_balls[i].setVisible(false)
        }
    },
    allYao:function(){
        var self = this
        for (var i = 0; i < 5; i++) {
            var par = self.balls[i].ballNode
            self.balls[i].ballNode.setRotation(0)
            par.stopAllActions()
            self.vr_balls[4-i].ballNode.stopAllActions()
            self.vr_balls[4-i].ballNode.setRotation(0)
            par.repeatAc1(self.vr_balls[4-i].ballNode,6)
        }
    },
    createTQ:function(canTouch){
        var self = this
        var parnode = new cc.Node()

        var node = new cc.Node()
        parnode.addChild(node)
        parnode.ballNode = node

        var xian1 = new cc.Sprite(res.xian)
        xian1.setAnchorPoint(0.5,1)
        node.addChild(xian1)

        var qiu = new cc.Sprite(res.tq)
        qiu.setAnchorPoint(0.5,1)
        qiu.setPosition(0,-320)
        node.addChild(qiu)
        parnode.ball = qiu
        qiu.grand = parnode
        node.dad = parnode

        node.repeatAc = function(other,Angel){
            var node = this
            var time = Math.abs(Angel/100)
            // cc.log("Angel",Angel)
            // if(Math.abs(Angel)<6 && !self.is6){
            //     self.allYao()
            //     self.is6 = true
            // }
            if(Math.abs(Angel)<4 && !self.is5){
                self.allReset()
                self.is5 = true
            }
            if(self.is5){
               self.allYao()
                return 
            }    
            node.stopAllActions()
            node.runAction(cc.sequence(
                cc.rotateTo(time,0).easing(cc.easeOut(time)),
                cc.callFunc(function(){
                    other.stopAllActions()

                    node.dad.setVisible(false)
                    node.dad.vr.setVisible(true)

                    other.dad.setVisible(true)
                    other.dad.ar.setVisible(false)
                    playEffect(res.zimp2)

                    other.runAction(cc.sequence(
                        cc.rotateTo(time,-Angel).easing(cc.easeIn(time)),
                        cc.rotateTo(time,0).easing(cc.easeOut(time)),
                        cc.callFunc(function(){
                            node.stopAllActions()

                            node.dad.setVisible(true)
                            node.dad.vr.setVisible(false)

                            other.dad.setVisible(false)
                            other.dad.ar.setVisible(true)
                            playEffect(res.zimp2)

                            node.runAction(cc.sequence(
                                cc.rotateTo(time,Angel),
                                cc.callFunc(function(){
                                    node.repeatAc(other,Angel*0.95)
                                }) 
                            ))
                        })
                    ))
                })
            ))
        }
        node.repeatAc1 = function(other,Angel){
            var node = this
            var time = Math.abs(Angel/100)
            node.stopAllActions()
            other.stopAllActions()
            if(Angel<1){
                node.runAction(cc.sequence(
                    cc.rotateTo(time,0).easing(cc.easeOut(time)),
                    cc.callFunc(function(){
                        other.stopAllActions()

                        node.dad.setVisible(false)
                        node.dad.vr.setVisible(true)

                        other.dad.setVisible(true)
                        other.dad.ar.setVisible(false)
                        playEffect(res.zimp2)

                        other.runAction(cc.sequence(
                            cc.rotateTo(time,-Angel).easing(cc.easeIn(time)),
                            cc.rotateTo(time,0).easing(cc.easeOut(time)),
                            cc.callFunc(function(){
                                node.stopAllActions()

                                node.dad.setVisible(true)
                                node.dad.vr.setVisible(false)

                                other.dad.setVisible(false)
                                other.dad.ar.setVisible(true)
                                playEffect(res.zimp2)

                                node.runAction(cc.sequence(
                                    cc.rotateTo(time,Angel),
                                    cc.callFunc(function(){
                                        node.repeatAc1(other,Angel*0.95)
                                    }) 
                                ))
                            })
                        ))
                    })
                ))
            }else{
                self.allReset()
            }       
        }

        var changeBalls = function(index,Angel){
            if(self.balls.length>0){
                var start = 0
                var end = 0
                var order = 1
                if(Angel<180){
                    start = 0
                    end = index
                    order = -1
                }else{
                    start = index + 1
                    end = 5
                    order = 1
                }
                for (var i = start; i < end; i++) {
                    var par = self.balls[i].ballNode
                    var ball = self.balls[i].ball
                    self.balls[i].setLocalZOrder(10 + order*i)
                    par.setRotation(Angel)
                    
                }
            }
        }
        var playAc = function(index,Angel){
            if(self.balls.length>0){
                var start = 0
                var end = 0
                if(Angel<180){
                    start = 0
                    end = index
                }else{
                    Angel = Angel - 360
                    start = index + 1
                    end = 5
                }
                for (var i = 0; i < 5; i++){
                    var ball = self.balls[i].ball
                    ball.disListen(true)
                }
                for (var i = start; i < end; i++) {
                    var par = self.balls[i].ballNode
                    par.repeatAc(self.vr_balls[4-i].ballNode,Angel)
                }
                cc.log("222222222")
                self.balls[index].ballNode.repeatAc(self.vr_balls[4-index].ballNode,Angel)             
            }
        }
        parnode.resetAll = function(){
            var parnode = this
            if(parnode.ball.disListen)
                parnode.ball.disListen(false)
            parnode.ballNode.stopAllActions()
            parnode.ball.Angel = 0
            parnode.ballNode.setRotation(0)
        }
        //drawLineFun(qiu)
        if(canTouch){
            createTouchEvent({
                item:qiu,
                begin:function(data){
                    var item = data.item
                    if(!self.jlbtn.isVisible()){
                        self.jlbtn.setVisible(true)
                    }
                    item.Angel = 0 
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    var pos = data.pos
                    var MovPos = parnode.convertToNodeSpace(pos)
                    var Angel = 180*(1+Math.atan2(MovPos.x,MovPos.y)/Math.PI)
                    if(Angel<=90 || Angel>=270){
                        item.Angel = Angel
                        node.setRotation(item.Angel)
                        changeBalls(item.index,item.Angel)
                    }
                },
                end:function(data){
                    var item = data.item
                    playAc(item.index,item.Angel)
                }
            })
        }
        return parnode
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
    myDelete:function(){
        var self = this
        self.node.unschedule(self.node.drawFun)
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
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })

        addContent({
           people: this.nodebs,
           key: "jl1",
           img:res.jl1,
           id:"result",
           sound: res.jlmp1,
           offset: cc.p(17,15),
           offbg: cc.p(0,10),
        })
    }
})