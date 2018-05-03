//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("tools")
           loadPlist("yt_lt")
           loadPlist("yt_sg")
           loadPlist("cups")
           loadPlist("jiWater")
           loadPlist("waterUp")
           loadPlist("gc_movie")
        })
        this._super()
        var self = this
        this.expCtor()
        this.initData()
        this.initPeople()
        this.initUI()
        return true
    },
    initData:function(){
        var self = this
        self.info = [
            {   
                index:0,
                strpos:cc.p(200,160),
                str:"        液体药品通常盛在细口瓶里，取用时一般采用倾斜法。倾倒时\n取下的瓶塞应倒放在桌子上，拿起试剂瓶时标签应对着手心，一手\n斜持试管，使瓶口紧挨着容器口缓缓倒入；倾倒结束时，应使瓶口\n残余液滴也流入容器中。"  
            },
            {   
                index:1,
                strpos:cc.p(200,160),
                str:"        使用滴管取液时，用手指捏紧橡胶乳头，赶出滴管内的空气，\n再将滴管伸入试剂瓶中，放开手指，试剂即被吸入。取出滴管，把\n它悬空放在烧杯上方，然后用拇指和食指轻轻捏挤胶头，试剂滴下。"
            },
            {
                index:2,
                strpos:cc.p(250,160),
                str:"        量液时，量筒必须放平，视线要与量筒内液体的凹液面\n的最低处保持水平，再读出液体的体积。"
            }
        ]
    },
    initUI:function(){
        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.4, 1.2),
            itempos:cc.p(5, -9),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.85,
            itemScale:0.95,
            ifcircle: true,
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                item.nopos = true
                if(!self.first){
                    self.first = true
                    self.toolbtn.outItem(0)
                    self.toolbtn.listview.changeView(0, false)
                }
                for(var i in toolnode.getChildren()){
                    if(toolnode.getChildren()[i].forceBack){
                        toolnode.getChildren()[i].forceBack()
                    }
                }
                item.setVisible(false)
                item.setPosition(0,-600)
                self.createDetail(index)
                return true
            },
            movefun:function(){
            },
            backfun:function(data){
                var item = data.sp
                item.setPosition(0,-600)
                return false
            },
            counts:[1,1,1],
            father:toolnode,
            files:[res.item4,res.item5,res.item6],
            gets:[res.item4,res.item5,res.item6]
        })
        this.addChild(this.toolbtn,3)

        self.createDetail(0,true)
    },
    createDetail:function(index,fir){
        var self = this
        if(self.curShow){
            self.curShow.removeFromParent()
            self.curShow = null
        }
        
        if(!fir){
            self.curShow = self.createYao(self.info[index])
            self.addChild(self.curShow)
            self.nodebs.stopSay()
            self.nodebs.runAction(cc.sequence(
                cc.delayTime(1.5),
                cc.callFunc(function(){
                    self.speakeBykey(sprintf("wenzi%d",index+4))
                })
            ))
        }else{
            self.curShow = self.createYao(self.info[index],0.8)
            self.addChild(self.curShow)
        }
    },
    createYao:function(data,strTime){
        var self = this
        var str = data.str
        var strpos = data.strpos
        var index = data.index
        var node = new cc.Node()
        var strTime = strTime || 0

        var goods = self.createGoods(index)
        node.addChild(goods)

        node.runAction(cc.sequence(
            cc.delayTime(strTime),
            cc.callFunc(function(){
                var label = addTimerLabel({
                      str:str,
                      strSize:25,
                      strSpeed:0.25,
                      strPos:strpos,
                      startDelay:true
                    })
                node.addChild(label)
            })
        ))
        
        return node
    },
    createGoods:function(index){
        var self = this
        var node = new cc.Node()
        switch(index)
        {
            case 0:
                var sg = new cc.Sprite("#yt_sg00.png")
                sg.setPosition(380,360)
                node.addChild(sg)

                var sg_tou = new cc.Sprite(res.cupG)
                sg_tou.setPosition(130,280)
                sg_tou.setScale(1.3)
                sg_tou.setVisible(false)
                sg.addChild(sg_tou)

                sg.playAc = function(type){
                    sg.stopAllActions()
                    switch(type)
                    {
                        case 1:
                            var spAction = createAnimation({
                                                    frame:"yt_sg%02d.png",
                                                    start:0,
                                                    end: 8,
                                                    time: 0.03
                                                })
                            sg.runAction(spAction)
                        break
                        case 2:
                            var spAction = createAnimation({
                                                    frame:"yt_sg%02d.png",
                                                    start:8,
                                                    end: 35,
                                                    time: 0.2,
                                                    fun:function(){
                                                       sg.setRotation(-1.4) 
                                                    }
                                                })
                            sg.runAction(cc.sequence(
                                cc.delayTime(0.4),
                                cc.callFunc(function(){
                                    playEffect(res.daos)
                                }),
                                spAction))
                        break
                    }
                }

                var cupNode = self.createCup({
                                beginfun:function(data){
                                    if(!sg.first){
                                        sg.first = true
                                        sg.playAc(1)
                                    }       
                                },
                                movefun:function(data){
                                    var item = data.item
                                    if(judgeItemCrash({item1:sg_tou,item2:item.cup_tou}))
                                    {
                                        item.noMove = true
                                        item.setPosition(-202,177)
                                        sg.playAc(2)
                                        item.playAc(function(){
                                            item.runAction(cc.moveTo(0.2,cc.p(0,0)))
                                            item.removeListen()
                                        })
                                    }
                                }
                            })
                cupNode.setPosition(750,320)
                node.addChild(cupNode)
            break
            case 1:
                var jiWater = new cc.Sprite(res.jiwatermain)
                jiWater.setPosition(860,400)
                jiWater.setScale(1.1)
                node.addChild(jiWater)

                jiWater.createTip = function(data){
                    var angle = data.angle || 0
                    var src = data.src || cc.p(-10,0)
                    var des = data.des || cc.p(10,0)
                    var img = data.img
                    var imgpos = data.imgpos || cc.p(0,0)
                    var node = new cc.Node()
                    var yellow = new cc.Sprite("#jt.png")
                    yellow.setRotation(angle)
                    node.addChild(yellow)
                    var seq = cc.sequence(cc.moveTo(0.3,src),cc.moveTo(0.3,des))
                    yellow.runAction(cc.repeatForever(seq))

                    var sp = new cc.Sprite(img)
                    sp.setPosition(imgpos)
                    node.addChild(sp)
                    sp.setScale(0.5)
                    return node
                }
                var jt = jiWater.createTip({
                            img:res.jttip,
                            angle:-90,
                            src:cc.p(0,-10),
                            des:cc.p(0,0),
                            imgpos:cc.p(0,30)
                        })
                jt.setPosition(68,320)
                jiWater.addChild(jt)
                jt.setVisible(false)

                jiWater.createTipTouch = function(){
                    if(!jiWater.touch){
                        jiWater.touch = new cc.Sprite("#jt.png")
                        jiWater.touch.setScale(1.8,3.6)
                        jiWater.touch.setPosition(68,272)
                        jiWater.touch.setVisible(false)
                        jiWater.addChild(jiWater.touch)
                        createTouchEvent({
                            item:jiWater.touch,
                            begin:function(){
                                if(!jiWater.di){
                                    jiWater.di = true
                                    jt.setVisible(false)
                                    jiWater.playAc()
                                }
                                return true
                            }
                        })
                    }
                }
                jiWater.playAc = function(){
                    jiWater.stopAllActions()
                    jiWater.effcts = 0
                    var effectac = cc.repeatForever(cc.sequence(
                        cc.callFunc(function(){
                            stopEffect()
                            playEffect(res.dis)
                            jiWater.effcts++
                            if(jiWater.effcts == 3){
                                jiWater.stopActionByTag(666)
                                cc.log("zanting")
                            }
                        }),
                        cc.delayTime(0.4)
                    ))
                    effectac.tag = 666
                    jiWater.runAction(effectac)
                    var spAction = createAnimation({
                                frame:"jiWater%02d.png",
                                start:1,
                                end:28,
                                time: 0.05
                            })
                    jiWater.runAction(spAction)
                }

                var cupNode = self.createCup()
                cupNode.setPosition(568,300)
                node.addChild(cupNode)
                cupNode.setCupNoTouch(true)

                var diWater = new cc.Sprite("#waterup14.png")
                diWater.setPosition(360,330)
                //diWater.setScale(0.5)
                node.addChild(diWater)
                diWater.playXi = function(){
                    var diWater = this
                    if(!diWater.noWater){
                        diWater.noWater = true
                        diWater.stopAllActions()
                        var spAction = createAnimation({
                                    frame:"waterup%02d.png",
                                    start:1,
                                    end:14,
                                    rever:true,
                                    time: 0.01
                                })
                        diWater.runAction(spAction)
                    }
                }

                var dimaotouch = new cc.Sprite(res.cupG)
                dimaotouch.setPosition(105, 140)
                dimaotouch.setScale(2.13, 1.56)
                dimaotouch.setOpacity(0)
                diWater.addChild(dimaotouch)
                dimaotouch.father = diWater

                var cuptest = cc.rect(540,230,25,260)

                createTouchEvent({
                    item:dimaotouch,
                    begin:function(data){
                        if(cupNode.cupG.status == "up")
                        {
                            dialogControl.AddDialog("Tips", {
                                res: res.warn1,
                                face: 1,
                                confirmBtn: true,
                                father: node,
                            })
                            return false
                        }
                        return true
                    },
                    move:function(data){
                        var item = data.item
                        var delta = data.delta
                        if(!item.noMove){
                            var Tempx = item.father.x + delta.x
                            var Tempy = item.father.y + delta.y
                            var topos = cc.p(Tempx-15,Tempy)
                            if(cc.rectContainsPoint(cuptest,topos)){
                                item.father.x = 573
                                if(Tempy<=395){
                                    Tempy = 395
                                }
                                if(Tempy<=400 && !item.father.noWater){
                                    item.father.playXi()
                                }
                                item.father.y = Tempy
                            }else{
                                limteAngel90({
                                    item:item.father,
                                    delta:delta,
                                    pos:cc.p(440,490)
                                }) 
                            }
                            if(Tempx>=850 && item.father.noWater){
                                item.noMove = true
                            }
                        }
                        
                    },
                    end:function(data){
                        var item = data.item
                        if(item.noMove){
                            item.father.setPosition(500,-700)
                            item.father.setVisible(false)
                            jiWater.setSpriteFrame("jiWater00.png")
                            jt.setVisible(true)
                            jiWater.createTipTouch()
                            //jiWater.playAc()
                        }
                    }
                })
            break
            case 2:
                var sg = new cc.Sprite("#yt_lt00.png")
                sg.setPosition(350,350)
                node.addChild(sg)

                var eye = new cc.Sprite("#gc_movie00.png")
                eye.setPosition(132,104)
                sg.addChild(eye)
                eye.playAc = function(){
                    var spAction = createAnimation({
                                            frame:"gc_movie%02d.png",
                                            start:0,
                                            end: 9,
                                            time: 0.1
                                        })
                    eye.runAction(spAction)
                }

                var sg_tou = new cc.Sprite(res.cupG)
                sg_tou.setPosition(222,315)
                sg_tou.setScale(1.4)
                sg_tou.setVisible(false)
                sg.addChild(sg_tou)

                sg.playAc = function(type){
                    sg.stopAllActions()
                    switch(type)
                    {
                        case 1:
                            var spAction = createAnimation({
                                                    frame:"yt_lt%02d.png",
                                                    start:0,
                                                    end: 10,
                                                    time: 0.03
                                                })
                            sg.runAction(spAction)
                        break
                        case 2:
                            var spAction = createAnimation({
                                                    frame:"yt_lt%02d.png",
                                                    start:10,
                                                    end: 35,
                                                    time: 0.2,
                                                    fun:function(){
                                                       sg.setRotation(-1.4)
                                                       eye.playAc()
                                                    }
                                                })
                            sg.runAction(cc.sequence(
                                cc.delayTime(0.4),
                                cc.callFunc(function(){
                                    playEffect(res.daos)
                                }),
                                spAction))
                        break
                    }
                }

                var cupNode = self.createCup({
                                beginfun:function(data){
                                    if(!sg.first){
                                        sg.first = true
                                        sg.playAc(1)
                                    }       
                                },
                                movefun:function(data){
                                    var item = data.item
                                    if(judgeItemCrash({item1:sg_tou,item2:item.cup_tou}))
                                    {
                                        item.noMove = true
                                        item.setPosition(-185,183)
                                        sg.playAc(2)
                                        item.playAc(function(){
                                            item.runAction(cc.moveTo(0.2,cc.p(0,0)))
                                            item.removeListen()
                                        })
                                    }
                                }
                            })
                cupNode.setPosition(750,320)
                node.addChild(cupNode)
            break
        }
        return node
    },
    createCup:function(data){
        var data = data || {}
        var beginfun = data.beginfun
        var movefun = data.movefun
        var node = new cc.Node()
        var cup = new cc.Sprite("#cups00.png")
        node.addChild(cup,5)

        var cup_tou = new cc.Sprite(res.cupG)
        cup_tou.setPosition(88,182)
        cup_tou.setVisible(false)
        cup.addChild(cup_tou)
        cup.cup_tou = cup_tou

        cup.playAc = function(fun){
            cup.stopAllActions()
            var spAction = createAnimation({
                                    frame:"cups%02d.png",
                                    start:1,
                                    end: 34,
                                    time: 0.05,
                                    fun:function(){
                                        if(fun)fun()
                                    }
                                })
            cup.runAction(spAction)
        }

        var cupG = new cc.Sprite(res.cupG)
        cupG.setPosition(-16,82)
        node.addChild(cupG,10)
        cupG.doing = false
        cupG.status = "up"
        node.cupG = cupG
        cupG.playAC = function(){
            var cupG = this
            if(!this.doing){
                this.doing = true
                switch(cupG.status)
                {
                    case "up":
                        this.runAction(cc.sequence(
                            cc.moveTo(0.2,cc.p(-15,120)),
                            cc.spawn(
                                    cc.rotateTo(0.2,180),
                                    cc.moveTo(0.3,cc.p(60,100))
                                ),
                            cc.moveTo(0.2,cc.p(115,-50)),
                            cc.callFunc(function(){
                                cupG.doing = false
                                cupG.status = "down"
                                cup.disListen(false)
                                cupG.setLocalZOrder(1)
                            })
                        ))
                    break
                    case "down":
                        this.runAction(cc.sequence(
                            cc.moveTo(0.2,cc.p(60,100)),
                            cc.spawn(
                                    cc.rotateTo(0.2,0),
                                    cc.moveTo(0.3,cc.p(-15,120))
                                ),
                            cc.moveTo(0.2,cc.p(-16,82)),
                            cc.callFunc(function(){
                                cupG.doing = false
                                cupG.status = "up"
                                cup.disListen(true)
                                cupG.setLocalZOrder(10)
                            })
                        ))
                    break
                }
                
            }
        }
        node.setCupNoTouch = function(judge){
            cup.NoTouch = judge
        }

        createTouchEvent({
            item:cupG,
            begin:function(data){
                var item = data.item
                if(!item.noplay){
                    item.playAC()
                }
                return false
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var Tempx = item.x + delta.x
                var Tempy = item.y + delta.y
                if(Tempy<=83){
                    Tempy = 83
                }else if(Tempy>=117){
                    Tempy = 117
                    if(Tempx<=-15){
                        Tempx = -15
                    }else if(Tempx>=77){
                        Tempx = 77
                    }else{
                       if(Tempx>-10){
                            item.out = true 
                       }else{
                            item.out = false
                       }
                    }
                }
                if(Tempy>=83&& Tempy<117){
                    if(!item.out){
                        Tempx = - 15
                    }else{
                        if(Tempy<=117){
                            Tempy = 117
                        }
                    }
                }
                item.x = Tempx
                item.y = Tempy
            },
            end:function(){}
        })

        createTouchEvent({
            item:cup,
            begin:function(data){
                var item = data.item
                if(item.NoTouch){
                    return false
                }
                item.stopAllActions()
                item.setSpriteFrame("cups01.png")
                if(beginfun)beginfun()
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var Tempx = item.x + delta.x
                var Tempy = item.y + delta.y
                if(!item.noMove){
                    item.x = Tempx
                    item.y = Tempy
                    movefun(data)
                }
            },
            end:function(data){
                var item = data.item
                if(!item.noMove){
                    item.runAction(cc.sequence(
                        cc.moveTo(0.2,cc.p(0,0)),
                        cc.callFunc(function(){
                            item.setSpriteFrame("cups00.png")
                        })
                    )) 
                }    
            }
        })
        cup.disListen(true)

        return node
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
            self.toolbtn.show()
            self.toolbtn.inItem(0)
            self.nodebs.show(function() {
                self.speakeBykey("wenzi4")
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
            key: "wenzi4",
            sound: res.zimp4
        })

        addContent({
            people: this.nodebs,
            key: "wenzi5",
            sound: res.zimp5
        })

        addContent({
            people: this.nodebs,
            key: "wenzi6",
            sound: res.zimp6
        })
    }  
})