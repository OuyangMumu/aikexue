var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
        var self = this
        loadPlist("fish_plist")
        loadPlist("do_plist")
        loadPlist("dao_plist")
        loadPlist("cao_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var ping = null

        var list = [] //存储杂物
        var toolbtn = createTool({
            pos: cc.p(290, 550),
            nums: 5,
            scale:0.7,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            //arrow:true,
            father: self,
            counts: [1, 1, 1, 1, 1],
            swallow: [true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4, res.do_tools5],
            gets: [null,null,null,null,null],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                switch(index){
                    case 0:
                        var ping2 = createSp("#ping2.png",cc.p(293,188),self)//593
                        ping = createSp("#pingzidown.png",cc.p(293,118),self)
                        var pingUp = createSp("#pingziup.png",cc.p(293,283.7),self)
                        ping.pingUp = pingUp
                        ping.ping2 = ping2
                        list.push(pingUp)
                        ping.setLocalZOrder(5)
                        pingUp.setLocalZOrder(7)
                        ping.noMove = true
                        ping.noEvent = true
                        ping.nopos = true
                        ping.candao = false
                        ping.havesha = false
                        ping.haveshui = false
                        ping.setVisible(false)
                        pingUp.setVisible(false)
                        ping2.setLocalZOrder(5)
                        return ping
                    break
                    case 1:
                        var hand1 = createSp("#handhou.png",cc.p(220,150),self)
                        var hand2 = createSp("#handqian.png",cc.p(238,100),self)
                        list.push(hand1)
                        list.push(hand2)
                        hand1.setLocalZOrder(4)
                        hand2.setLocalZOrder(6)
                        var dao = createSp("#dao.png",cc.p(470,140),self)
                        dao.setLocalZOrder(6)
                        dao.noMove = true
                        dao.nopos = true
                        dao.over = false
                        return dao
                    break
                    case 2:
                        var shazi = createSp("#shazi.png",cc.p(660,100),self)
                        shazi.noMove = true
                        shazi.nopos = true
                        shazi.over = false
                        return shazi
                    break
                    case 3:
                        var water = createSp("#water.png",cc.p(780,100),self)
                        water.noMove = true 
                        water.nopos = true
                        water.over = false
                        water.dialog = false
                        //小鱼
                        fishFun(cc.p(68,38),cc.p(22,38),cc.p(22,28),cc.p(68,28),cc.p(22,38),cc.p(40,28),water)
                        return water
                    break
                    case 4:
                        var shuicao = createSp("#shuicao.png",cc.p(870,100),self)
                        shuicao.noMove = true 
                        shuicao.nopos = true 
                        shuicao.over = false 
                        shuicao.dialog = false
                        return shuicao
                    break
                }
                return item
            },
            clickfun: function(data){
                var item = data.sp 
                var index = data.index
                if(index == 1 && !item.over && ping){
                    item.over = true
                    ping.setVisible(true)
                    ping.pingUp.setVisible(true)
                    ping.ping2.setVisible(false)
                    item.runAction(cc.sequence(
                        cc.moveTo(0.5,430,150),cc.moveTo(0.5,420,130),
                        cc.moveTo(0.5,380,150),cc.moveTo(0.5,370,120),
                        cc.moveTo(0.5,300,150),cc.moveTo(0.5,270,145),
                        cc.callFunc(function(){
                            ping.candao = true
                            item.setPositionY(-500)
                            ping.setSpriteFrame("ping.png")
                            ping.setPosition(293,125)
                            for(var i = 0 ; i < 3 ; i++){
                                list[i].removeFromParent()
                            }
                        })
                    ))
                    return true
                }
                if(item.noMove){
                    return false
                }
                return true
            },
            movefun: function(data){
                var item = data.sp 
                var index = data.index
                var delta = data.delta 
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }

                if(!ping)   return 
                switch(index){
                    case 2:
                    if(!item.over && ping.candao && checkdistans(item,ping,100)){
                        item.over = false
                        item.noMove = true
                        item.setPosition(ping.x+100,ping.y+80)
                        item.runAction(cc.sequence(
                            ani("daosha%02d.png",1,14,0.2),
                            cc.callFunc(function(){
                                item.setPositionY(-500)
                                ping.havesha = true
                            })
                        ))
                        var sha = createSp("#shazi01.png",cc.p(71,40),ping)
                        sha.setScale(0.6)
                        sha.runAction(cc.sequence(
                            cc.delayTime(1.5),
                            ani("shazi%02d.png",1,7,0.2)
                        ))
                    }
                    break
                    case 3:
                        if(!item.over && ping.candao && checkdistans(item,ping,100)){
                            if(!ping.havesha && !item.dialog){
                                createDialog(res.do1_tip2)
                                item.dialog = true
                                return
                            }
                            if(!ping.havesha) return
                            item.over = false
                            item.noMove = true
                            item.removeAllChildren()
                            item.setPosition(ping.x+60,ping.y+80)
                            item.runAction(cc.sequence(
                                ani("daoshui%02d.png",1,9,0.2),
                                cc.callFunc(function(){
                                    var yemian = createSp("#yemian.png",cc.p(70,35),ping)
                                    yemian.setScale(0.62)
                                    yemian.runAction(cc.moveTo(0.5,70,100))
                                    item.setPositionY(-500)
                                    ping.haveshui = true
                                    fishFun(cc.p(128,60),cc.p(12,60), cc.p(12,40), cc.p(128,40), cc.p(40,60), cc.p(100,40), ping)
                                })
                            ))
                        }
                    break
                    case 4:
                        if(!item.over && ping.candao && checkdistans(item,ping,100)){
                            if(!ping.havesha && !item.dialog){
                                createDialog(res.do1_tip2)
                                item.dialog = true
                                return
                            }else if(!ping.haveshui && !item.dialog){
                                createDialog(res.do1_tip3)
                                item.dialog = true
                                return
                            }
                            if(!ping.haveshui) return
                            item.over = false
                            item.noMove = true
                            item.setPosition(ping.x,ping.y+100)
                            item.runAction(cc.sequence(
                                cc.moveTo(0.5,ping.x,ping.y-20),
                                cc.callFunc(function(){
                                    caoFun()
                                })
                            ))
                        }
                    break
                }
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index
                backFun(item,index)
            },
            backfun: function(data){
                var item = data.sp 
                var index = data.index
                backFun(item,index)
                return false 
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
                return false
        }
        var ani = function(frame,start,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start:start,
                end: end,
                time: time,
            }))
        }

        var backFun = function(item,index){
            switch(index){
                case 2:
                    if(!item.over){
                        item.noMove = false
                    }
                break
                case 3:
                    if(item.dialog)
                        item.dialog = false
                    if(!item.over){
                        item.noMove = false
                    }
                break
                case 4:
                    if(item.dialog)
                        item.dialog = false
                    if(!item.over){
                        item.noMove = false
                    }
                break
            }
        }

        var fishFun = function(pos1,pos2,pos3,pos4,pos5,pos6,father){
            var yu1 = createSp("#fish1_01.png",pos5,father)
            yu1.runAction(ani_yu("fish1_%02d.png"))
            yu1.runAction(cc.repeatForever(cc.sequence(
                cc.moveTo(2.5,pos1),
                cc.scaleTo(0.1,-1,1),
                cc.moveTo(2.5,pos2),
                cc.delayTime(1),
                cc.scaleTo(0.1,1,1)
            )))
            var yu2 = createSp("#fish2_01.png",pos6,father)
            yu2.runAction(ani_yu("fish2_%02d.png"))
            yu2.runAction(cc.repeatForever(cc.sequence(
                cc.moveTo(2.5,pos3),
                cc.scaleTo(0.1,1,1),
                cc.delayTime(1),
                cc.moveTo(2.5,pos4),
                cc.scaleTo(0.1,-1,1)
            )))
            yu2.setScaleX(-1)
        }
                    
        var caoFun = function(){
            var wenzi = "      通过观察，在没有添加任何其他物质\n的情况下，生态瓶中的生物经过数天后\n还能好好地生活着，这是为什么呢？"
            var label = new cc.LabelTTF("","Arial",30)
            label.setPosition(270,470)
            label.setAnchorPoint(0,1)
            self.addChild(label)
            label.runAction(cc.sequence(
                cc.delayTime(1),
                cc.callFunc(function(){
                    self.nodebs.say({key:"do1_tip2",force:true})
                })
            ))
            var count = 0
            var call = function(){
                if(count < wenzi.length+1){
                    label.setString(wenzi.substring(0,count))
                    count++
                }else{
                    removeTimer("stop")
                    var btn = new ccui.Button(res.btn_cause_normal,res.btn_cause_select)
                    btn.setPosition(780,350)
                    self.addChild(btn)
                    btn.setColor(cc.color(255,100,100,255))
                    btn.addClickEventListener(function(){
                        self.nodebs.say({key:"result"})
                    })
                }
            }
            addTimer({
                fun: function(){
                    call()
                },
                time: 0.2,
                repeat: cc.REPEAT_FOREVER,
                key:"stop",
            })
            var no1 = createSp("#cao13.png",cc.p(38,100),ping)
            var no2 = createSp("#cao13.png",cc.p(100,105),ping)
            var no3 = createSp("#cao13.png",cc.p(72,80),ping)
            no2.setScale(0.6)
            no3.setScale(0.5)
            var no4 = createSp("#cao14.png",cc.p(40,30),ping)
            no4.setScale(0.5)
            no4.setAnchorPoint(0.5,0)
            no4.runAction(cc.repeatForever(cc.sequence(
                cc.rotateTo(2,5),
                cc.delayTime(1),
                cc.rotateTo(2,-5)
            )))
            var no5 = createSp("#cao15.png",cc.p(80,60),ping)
            no5.setScale(0.5)
            var no6 = createSp("#cao12.png",cc.p(105,50),ping)
            var no7 = createSp("#cao01.png",cc.p(70,45),ping)
            no7.setScale(0.7)
            no7.runAction(cc.repeatForever(
                ani("cao%02d.png",1,11,0.3)
            ))
        }
        var ani_yu = function(frame){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame: frame,
                end: 3,
                time: 0.15
            })))
        }

        var createDialog = function(img){
            dialogControl.AddDialog("Tips", {
                res: img,
                face: 2,
                father: self
            })
        }

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "do1_tip2",
            sound: res.do1_sound2,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do1_tip4,
            id: "result"
        })
    },
})