//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("balls")
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                   var bg = createBiaoge({
                      json: res.biao1,
                      scale: 0.9,
                      inputNum:1,
                      inputLineChange:[true],
                      downData:{
                        nums:5,
                        scale:1.3,
                        bufs:[
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2],
                          [null,res.bg_cs1,res.bg_cs2]
                        ],
                        keys:[
                           1,1,1,1,1
                        ]
                      }
                  })
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initPeople()
        this.initUI()    
        return true
    },
    initUI:function(){
        var self = this
        var desk = self.createTjT()
        desk.setPosition(580,315)
        self.addChild(desk)
        var guaChi = desk.guaChi
        var leftline = guaChi.leftline
        var rightline = guaChi.rightline


        var firstBall = self.createBall()
        firstBall.setPosition(400,-910)
        self.addChild(firstBall)
        firstBall.setVisible(false)

        var secondBall = self.createBall()
        secondBall.setPosition(400,-910)
        self.addChild(secondBall)
        firstBall.setVisible(true)
        

        var ballCount = 0
        var createHand = function(){
            if(ballCount == 2){
                self.speakeBykey("wenzi2")
                var hand = new cc.Sprite(res.handZhen)
                hand.setPosition(120,300)
                self.addChild(hand)

                createTouchEvent({
                    item:hand,
                    begin:function(data){
                        return true
                    },
                    move:function(data){
                        var item = data.item
                        var delta = data.delta
                        if(!item.onMove){
                            item.x += delta.x
                            item.y += delta.y
                            var curpos = cc.p(item.x+item.width/2,item.y-item.height/2)
                            if(!firstBall.po && judgeInside({item:firstBall.ball,pos:curpos})){
                                //item.onMove = true
                                firstBall.po = true
                                guaChi.addWeight(-10,firstBall.guaName)
                                playMusic(res.pudong)
                                firstBall.playPo(function(){
                                    //item.onMove =  false
                                })
                            }else if(!secondBall.po && judgeInside({item:secondBall.ball,pos:curpos})){
                                //item.onMove = true
                                secondBall.po = true
                                guaChi.addWeight(-10,secondBall.guaName)
                                playMusic(res.pudong)
                                secondBall.playPo(function(){
                                   // item.onMove =  false
                                })
                            }
                        }
                    },
                    end:function(){}
                })
            }
        }

        var Touches = true
        createTouchEvent({
           item:firstBall,
           rect:cc.rect(-20,-20,firstBall.width+40,firstBall.height+40),
           begin:function(data){
                if(Touches){
                   Touches = false
                   var item = data.item
                   var pos = data.pos
                   return true
                }
           },
           move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.onMove){
                    item.x += delta.x
                    item.y += delta.y
                    if(judgeItemCrash({item1:item,item2:leftline}) && !leftline.noChild){
                        item.onMove = true
                        safeAdd(guaChi.leftNode,item)
                        item.setPosition(0,0)
                        item.setOpacity(0)
                        item.guaName = "left"
                        guaChi.addWeight(10,"left")
                        leftline.noChild = true
                        ballCount++
                        createHand()
                        guaChi.hideTo(item.guaName)
                    }else if(judgeItemCrash({item1:item,item2:rightline}) && !rightline.noChild){
                        item.onMove = true
                        safeAdd(guaChi.rightNode,item)
                        item.setPosition(0,0)
                        item.setOpacity(0)
                        item.guaName = "right"
                        guaChi.addWeight(10,"right")
                        rightline.noChild = true
                        ballCount++
                        createHand()
                        guaChi.hideTo(item.guaName)
                    }
                }
           },
           end: function(data) {
                var item = data.item
                Touches = true
                if(item.onMove){
                    item.removeListen()
                }
           }
        })
        createTouchEvent({
           item:secondBall,
           rect:cc.rect(-20,-20,firstBall.width+40,firstBall.height+40),
           begin:function(data){
                if(Touches){
                   Touches = false
                   var item = data.item
                   var pos = data.pos
                   return true
                }
           },
           move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.onMove){
                    item.x += delta.x
                    item.y += delta.y

                    if(judgeItemCrash({item1:item,item2:leftline}) && !leftline.noChild){
                        item.onMove = true
                        safeAdd(guaChi.leftNode,item)
                        item.setPosition(0,0)
                        item.setOpacity(0)
                        item.guaName = "left"
                        guaChi.addWeight(10,"left")
                        leftline.noChild = true
                        ballCount++
                        createHand()
                        guaChi.hideTo(item.guaName)
                    }else if(judgeItemCrash({item1:item,item2:rightline}) &&　!rightline.noChild){
                        item.onMove = true
                        safeAdd(guaChi.rightNode,item)
                        item.setPosition(0,0)
                        item.setOpacity(0)
                        item.guaName = "right"
                        guaChi.addWeight(10,"right")
                        rightline.noChild = true
                        ballCount++
                        createHand()
                        guaChi.hideTo(item.guaName)
                    }
                }
           },
           end: function(data) {
                var item = data.item
                Touches = true
                if(item.onMove){
                    item.removeListen()
                }
           }
        })

        var ball1 = self.createSingleBall(cc.p(213,230))
        self.addChild(ball1)

        var ball2 = self.createSingleBall(cc.p(240,330))
        self.addChild(ball2)
        
        var nodeHideCount = 0
        var line1 = self.createOneLine({
                        moveFun:function(node){
                            if(judgeItemCrash({item1:node.po1,item2:ball1.touch}) || judgeItemCrash({item1:node.po2,item2:ball1.touch})){
                                ball1.setVisible(false)
                                ball1.setPosition(300,-800)
                                node.noMove = true
                            }
                            if(judgeItemCrash({item1:node.po1,item2:ball2.touch}) || judgeItemCrash({item1:node.po2,item2:ball2.touch})){
                                ball2.setVisible(false)
                                ball2.setPosition(300,-800)
                                node.noMove = true
                            }
                            if(node.noMove){
                                node.setVisible(false)
                                firstBall.setPosition(node.getPosition())
                                firstBall.setVisible(true)
                                node.setPosition(0,-900)
                                nodeHideCount++
                                if(nodeHideCount>=2){
                                    guaChi.showTo()
                                }
                            }
                        }
                    })
        line1.setPosition(450,300)
        self.addChild(line1)

        var line2 = self.createOneLine({
                        moveFun:function(node){
                            if(judgeItemCrash({item1:node.po1,item2:ball1.touch}) || judgeItemCrash({item1:node.po2,item2:ball1.touch})){
                                ball1.setVisible(false)
                                ball1.setPosition(300,-800)
                                node.noMove = true
                            }
                            if(judgeItemCrash({item1:node.po1,item2:ball2.touch}) || judgeItemCrash({item1:node.po2,item2:ball2.touch})){
                                ball2.setVisible(false)
                                ball2.setPosition(300,-800)
                                node.noMove = true
                            }
                            if(node.noMove){
                                node.setVisible(false)
                                secondBall.setPosition(node.getPosition())
                                secondBall.setVisible(true)
                                node.setPosition(0,-900)
                                nodeHideCount++
                                if(nodeHideCount>=2){
                                    guaChi.showTo()
                                }
                            }
                        }
                    })
        line2.setPosition(450,200)
        self.addChild(line2)
    },
    createSingleBall:function(pos){
        var ball1 = new cc.Sprite("#ball00.png")
        ball1.setPosition(pos)
        ball1.setRotation(125)

        var hjt = new cc.Sprite(res.hjt)
        hjt.setPosition(35,145)
        ball1.addChild(hjt)
        hjt.runAction(cc.repeatForever(cc.blink(1,1)))

        ball1.touch = new cc.Sprite(res.hjt)
        ball1.touch.setPosition(52,126)
        ball1.addChild(ball1.touch)
        ball1.touch.setVisible(false)

        return ball1
    },
    createOneLine:function(data){
        var moveFun = data.moveFun
        var nodeAll = new cc.Node()
        nodeAll.canTouch = true

        var node = new cc.Sprite("#linePoint.png")
        nodeAll.addChild(node)
        nodeAll.po1 = node

        var line = new cc.Sprite("#line.png")
        line.setPosition(83,6.5)
        line.setRotation(90)
        node.addChild(line)

        var node2 = new cc.Sprite("#linePoint.png")
        node2.setPosition(160,6.5)
        node.addChild(node2)
        nodeAll.po2 = node2

        createTouchEvent({
            item:node,
            rect:cc.rect(-25,-25,node.width+50,node.height+50),
            begin:function(){
                if(nodeAll.canTouch){
                    nodeAll.canTouch = false
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!nodeAll.noMove)
                {
                    nodeAll.x += delta.x
                    nodeAll.y += delta.y
                    if(moveFun){
                        moveFun(nodeAll)
                    }
                }
            },
            end:function(){
                nodeAll.canTouch = true
            }
        })

        createTouchEvent({
            item:node2,
            rect:cc.rect(-25,-25,node.width+50,node.height+50),
            begin:function(){
                if(nodeAll.canTouch){
                    nodeAll.canTouch = false
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!nodeAll.noMove)
                {
                    nodeAll.x += delta.x
                    nodeAll.y += delta.y
                    if(moveFun){
                        moveFun(nodeAll)
                    }
                }
            },
            end:function(){
                nodeAll.canTouch = true
            }
        })

        return nodeAll
    },
    createBall:function(){
        var movePoint = new cc.Sprite("#linePoint.png")
        movePoint.setCascadeOpacityEnabled(false)

        var line = new cc.Sprite("#line.png")
        line.setPosition(7,-69)
        movePoint.addChild(line)

        var ball = new cc.Sprite("#ball00.png")
        ball.setPosition(28.5,-200)
        movePoint.addChild(ball)
        
        var balltu = new cc.Sprite(res.balltu)
        balltu.setPosition(ball.width/3,ball.height/2)
        ball.addChild(balltu)
        movePoint.ball = balltu
        
        movePoint.playPo = function(func){
            var ac = createAnimation({
                                frame:"ball%02d.png",
                                start:0,
                                end:10,
                                time: 0.04,
                                fun:function(){
                                    if(func){
                                        func()
                                    }
                                }
                            })
            ball.stopAllActions()
            ball.runAction(ac)
        }
        return movePoint
    },
    createTjT:function(){
        var desk = new cc.Sprite("#desk.png")

        var lineGua = new cc.Sprite("#lineGua.png")
        lineGua.setPosition(89.58,421.52)
        desk.addChild(lineGua)

        var lineXu = new cc.Sprite("#lineXu.png")
        lineXu.setPosition(90,391.1)
        desk.addChild(lineXu)

        desk.guaChi = new cc.Sprite("#chi.png")
        desk.guaChi.setPosition(90,394)
        desk.addChild(desk.guaChi)
        var guaChi = desk.guaChi

        guaChi.leftWeight = 0
        guaChi.leftline = new cc.Sprite("#lineJie.png")
        guaChi.leftline.setPosition(7.4,6.3)
        guaChi.addChild(guaChi.leftline,20)
        
        guaChi.rightWeight = 0
        guaChi.rightline = new cc.Sprite("#lineJie.png")
        guaChi.rightline.setPosition(313.5,6.3)
        guaChi.rightline.setScale(-1,1)
        guaChi.addChild(guaChi.rightline,20)

        //  添加左右节点来放气球 旋转
        guaChi.leftNode = new cc.Node()
        guaChi.leftNode.setPosition(9,6.7)
        guaChi.addChild(guaChi.leftNode,10)
    
        var leftTo = new cc.Sprite(res.hjt)
        leftTo.setPosition(0,-30)
        leftTo.setRotation(-140)
        guaChi.leftNode.addChild(leftTo)
        guaChi.leftNode.To = leftTo
        leftTo.setVisible(false)


        guaChi.rightNode = new cc.Node()
        guaChi.rightNode.setPosition(311,7)
        guaChi.addChild(guaChi.rightNode,10)

        var rightTo = new cc.Sprite(res.hjt)
        rightTo.setPosition(0,-30)
        rightTo.setRotation(-140)
        guaChi.rightNode.addChild(rightTo)
        guaChi.rightNode.To = rightTo
        rightTo.setVisible(false)

        guaChi.showTo = function(){
            leftTo.runAction(cc.repeatForever(cc.blink(1,1)))
            rightTo.runAction(cc.repeatForever(cc.blink(1,1)))
        }
        guaChi.hideTo = function(tri){
            if(tri == "right"){
                rightTo.setVisible(false)
                rightTo.stopAllActions()
            }else{
                leftTo.setVisible(false)
                leftTo.stopAllActions()
            }
        }
        guaChi.addWeight = function(weight,tri){
            var tri = tri || "left" 
            switch(tri){
                case "left":
                    guaChi.leftWeight += weight
                break
                case "right":
                    guaChi.rightWeight += weight
                break
            }
            guaChi.UpBalance()
        }

        guaChi.UpBalance = function(){
            var weight = guaChi.rightWeight - guaChi.leftWeight
            guaChi.stopAllActions()
            var curangel = weight*2
            guaChi.stopAllActions()
            guaChi.runAction(cc.rotateTo(1,curangel))
            if(guaChi.leftNode){
                guaChi.leftNode.stopAllActions()
                guaChi.leftNode.runAction(cc.rotateTo(1,-curangel))
            }
            if(guaChi.rightNode){
                guaChi.rightNode.stopAllActions()
                guaChi.rightNode.runAction(cc.rotateTo(1,-curangel))
            }
        }

        return desk
    },
    speakeBykey:function(key){
        var self = this
        self.nodebs.say({
                    key: key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
               self.speakeBykey("wenzi1")
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
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })
    }  
})