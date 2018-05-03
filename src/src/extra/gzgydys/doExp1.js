var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.gzgydys_tableNode_json,
                            scale:0.9,
                            inputNum: 30,
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
        var self = this
        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var judgeSay = [false,false,false]
        var fdj = createFDJ({
            father: self,
            type:3,
            getPos: cc.p(0,-50),
            hidebtn:true,
        })

        fdj.get[0].setVisible(true)//小放大镜
        fdj.see[0].setVisible(false)//大放大镜
        fdj.see[0].setPosition(100,200)
        var smallFdj = fdj.get[0]
        createTouchEvent({
            item:fdj.see[0],
            begin:function(data){
                var item = data.item 
                if(!item.isVisible())
                    return false
                return true
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta 
                item.x += delta.x
                item.y += delta.y
            }
            //autoMove:true
        })
        
        var createKnife = function(data){
            var pos = data.pos
            var knife = new cc.Sprite(res.item_dao)
            knife.setScale(0.45)
            knife.setPosition(pos)
            return knife
        }
        var createRock = function(data){
            var pos = data.pos
            var img = data.img
            var rock = new cc.Sprite(img)
            rock.setScale(0.45)
            rock.setPosition(pos)
            return rock
        }

        var createRockBg = function(data){
            var pos = data.pos
            var img = data.img
            var rock = new cc.Sprite(img)
            rock.setScale(0.45)
            rock.setPosition(pos)
            return rock
        }

        fdj.createNew({
            key: "rockBg",
            fun: createRockBg,
            buf:{
                pos:cc.p(700,80),
                img: res.rockBg,
            }
        })

        var rockBgFun = function(flag){
            fdj.runData({
                key:"rockBg",
                fun:function(data){
                    var item = data.item
                    if(flag == 1)
                        item.setVisible(false)
                    else
                        item.setVisible(true)
                }
            })
        }
        rockBgFun(1)

        var knifeReadd = function(){
            if(!self.knife)  return 
            reAdd(fdj.getOut("knife"))
            reAdd(fdj.getIn("knife"))
        }
        self.fdj = fdj

        loadPlist("diguan_plist")
        loadPlist("waterAni_plist")
        loadPlist("huahen_plist")
        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        } 

        var rockImg = [res.rock1,res.rock2,res.rock3,res.rock4,res.rock5,res.rock6]

        var curRock = null
        var temp = null

        createTouchEvent({
            item: smallFdj,
            begin:function(){
                return true
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta
                // item.x += delta.x 
                // item.y += delta.y 
                fdj.move(delta)
                if(curRock){
                    if(checkDistance(item,curRock,200)){
                        fdj.see[0].setVisible(true)
                        if(!judgeSay[0]){
                            judgeSay[0] = true
                            self.nodebs.say({key:"do1_tip2",force:true})
                        }
                    }
                    else
                        fdj.see[0].setVisible(false)
                }
            },
            end:function(data){
                var item = data.item
                if(self.toolbtn && self.toolbtn.listview && self.toolbtn.getStatus()){
                    var result = judgeItemCrash({
                        item1:item,
                        item2:self.toolbtn.listview,
                    })
                    if(result){
                        self.judgeItem.forceBack()
                        fdj.setGet(cc.p(0,-200))
                    }
                }
            }
        })
       
        var toolbtn = createTool({
            pos: cc.p(260, 510),
            nums: 5,
            scale:0.7,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [1, 1, 1, 99, 99, 99, 99, 99, 99],
            swallow: [true, true, true, true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4, res.do_tools5,
                    res.do_tools6, res.do_tools7, res.do_tools8, res.do_tools9],
            gets: [res.do_tools1,null,null,null,null,null,null,null,null],//res.rock1,res.rock2,res.rock3,
                    //res.rock4,res.rock5,res.rock6
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(index == 0){
                    fdj.setGet(pos)
                    item.setPositionY(-300)
                    item.setVisible(false)
                    self.judgeItem = item
                    //fdj.get[0].nopos = true
                    //temp = createSp(res.do_tools1,cc.p(0,-300),self)
                    //return fdj.get[0]
                }
                if(index == 1){
                    fdj.createNew({
                        key: "knife",
                        fun: createKnife,
                        buf:{
                            pos:data.pos,
                        }
                    })

                    item = fdj.getOut("knife")
                    item.nopos = true
                    self.knife = item
                }else if(index == 2){
                    item = self.createDiguan({
                        biaoqian:res.biaoqian,
                        dgMoveFun:function(data){
                            var dg = data.dg
                            var digai = data.digai
                            if(dg.haveWater && curRock && checkDistance_dg(dg,curRock)){
                                if(curRock.haveWater)   return false
                                dg.haveWater = false
                                dg.noMove = true
                                curRock.noMove = true
                                curRock.haveWater = true
                                dg.setPosition(dg.getParent().convertToNodeSpace(cc.p(750,380)))
                                createWater()
                                dg.runAction(cc.sequence(
                                    fsAni(),
                                    cc.delayTime(0.8),
                                    cc.callFunc(function(){
                                        digai.setPosition(37,150)
                                        digai.noMove = false
                                        dg.noMove = false
                                        curRock.noMove = false
                                        dg.setPosition(100,120)
                                        dg.dgOut = false
                                        item.noMove = false
                                        dg.setSpriteFrame("dg.png")
                                    })
                                ))
                            }
                        }
                    })
                    self.cup = item
                    return item
                }
                if(index > 2){
                    if(curRock){
                        if(curRock.noMove)  return false
                        rockBgFun(1)
                        curRock.removeFromParent(true)
                        fdj.getIn(sprintf("rock",curRock.index-2)).removeFromParent(true)
                        curRock = null
                    }
                    var key = sprintf("rock",index-2)
                    fdj.createNew({
                        key: key,
                        fun: createRock,
                        buf:{
                            pos:data.pos,
                            img:rockImg[index-3],
                        }
                    })
                    item = fdj.getOut(key)
                    item.nopos = true

                    item.draw = true   //判断是否可划
                    item.haveWater = false  //判断是否有水
                    item.index = index
                    curRock = item
                    knifeReadd()
                }
                return item
            },
            clickfun: function(data){
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(index > 2)
                    rockBgFun(1)
                return true
            },
            movefun: function(data){
                var item = data.sp 
                var index = data.index
                var delta = data.delta
                switch(index){
                    case 0:
                    if(curRock){
                        if(checkDistance(smallFdj,curRock,200)){
                            fdj.see[0].setVisible(true)
                            if(!judgeSay[0]){
                                judgeSay[0] = true
                                self.nodebs.say({key:"do1_tip2",force:true})
                            }
                        }
                        else
                            fdj.see[0].setVisible(false)
                    }

                    item.setPositionY(-200)
                    fdj.move(delta)
                    break
                    case 1: //刀子刮
                        var actItem = function(item){
                            item.noMove = true
                            item.setPosition(768,235)
                            item.runAction(cc.sequence(
                                cc.delayTime(0.3),
                                cc.callFunc(function(){
                                    if(curRock.index > 3){
                                        if(curRock.index != 8)
                                        createHuahen("huahen_bai%02d.png")
                                    else
                                        createHuahen("huahen_hei%02d.png")
                                    }
                                }),
                                cc.moveTo(0.92,845,195),
                                cc.callFunc(function(){
                                    item.setPosition(950,400)
                                    item.noMove = false
                                    curRock.noMove = false
                                    if(!judgeSay[1]){
                                        judgeSay[1] = true
                                        self.nodebs.say({key:"do1_tip3",force:true})
                                    }
                                })
                            ))
                        }

                        fdj.runData({
                            key:"knife",
                            fun:function(data){
                                var item = data.item
                                data.delta = delta
                                if(!item.noMove){
                                    item.x += delta.x
                                    item.y += delta.y
                                }
                            }
                        })
                        if(!curRock)  return false
                        if(curRock.draw && checkDistance(item,curRock,150)){
                            var key = sprintf("rock",curRock.index-2)
                            fdj.runData({
                                key:key,
                                fun:function(data){
                                    var item = data.item
                                    item.draw = false
                                    item.noMove = true
                                }
                            })
                            fdj.runData({
                                key:"knife",
                                fun:function(data){
                                    var item = data.item
                                    actItem(item)
                                }
                            })
                        }
                    break
                    case 2:
                    item.x += delta.x 
                    item.y += delta.y
                    break
                }
                if(index > 2){
                    fdj.runData({
                        key:sprintf("rock",index-2),
                        fun:function(data){
                            var item = data.item
                            data.delta = delta
                            item.x += delta.x
                            item.y += delta.y
                        }
                    })
                }
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index
                if(index == 2)
                    item.setPosition(300,100)
                if(index > 2){
                    fdj.runData({
                        key:sprintf("rock",index-2),
                        fun:function(data){
                            var item = data.item
                            item.setPosition(730,130)
                        }
                    })
                    rockBgFun(0)
                }
            },
            backfun: function(data){
                var item = data.sp 
                var index = data.index
                if(item.noMove){
                    return false
                }
                if(index == 0){
                    return false
                }
                if(index == 1){
                    fdj.deleteInside("knife")
                    self.knife = null
                }
                if(index > 2){
                    curRock.removeFromParent(true)
                    fdj.deleteInside(sprintf("rock",curRock.index-2))
                    curRock = null
                    return false
                }
                return true
            }
        })
        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()


        var createWater = function(){
            fdj.runData({
                key:sprintf("rock",curRock.index-2),
                fun:function(data){
                    var item = data.item
                    var bigRock = item
                    var shuidi = createSp("#shuidi01.png", cc.p(458,770), bigRock)
                    shuidi.runAction(cc.sequence(
                        ani("shuidi%02d.png",6,0.2),
                        ani("shuidi%02d.png",6,0.2),
                        cc.callFunc(function(){
                            shuidi.removeFromParent(true)
                        })
                    ))
                    var kuosan = createSp("#kuosan01.png", cc.p(450,580), bigRock)
                    kuosan.runAction(ani("kuosan%02d.png",10,0.25))
                    if(curRock.index == 4 || curRock.index == 5){
                        var qipao = createSp("#qipao01.png", cc.p(450,610), bigRock)
                        qipao.runAction(cc.sequence(
                            ani("qipao%02d.png",8,0.2),
                            ani("qipao%02d.png",8,0.2),
                            ani("qipao%02d.png",8,0.2),
                            cc.callFunc(function(){
                                qipao.removeFromParent(true)
                            })
                        ))
                    }
                }
            }) 
        }

        var createHuahen = function(frame){
            fdj.runData({
                key:sprintf("rock",curRock.index-2),
                fun:function(data){
                    var item = data.item
                    var huahen = createSp("#huahen_bai01.png", cc.p(400,550), item)
                    huahen.runAction(ani(frame,20,0.052))
                }
            })
        }

        var checkDistance = function(r1,r2,dis){
            var dx = r1.x - r2.x
            var dy = r1.y - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }

        var checkDistance_dg = function(r1,r2,dis){
            var pos = getWorldPos(r1)
            var dx = pos.x-r1.width/2 - r2.x
            var dy = pos.y-r1.height/2 - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 150)
                return true
            else
                return false
        }

        var fsAni = function(){
            return cc.sequence(createAnimation({
                frame: "diWater%02d.png",
                start:2,
                end: 6,
                time:0.35,
                rever:true,
            }))
        }
        var ani = function(frame,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: end,
                time: time,
            }))
        }

       
    },

    createDiguan : function(data){
        var dgMoveFun = data.dgMoveFun
        var cupPos = data.cupPos
        var self = this
        var cupImg = "#waterCup.png"
        var fullDg = "dgWater.png"
        var startDg = "diWater01.png"
        var endDg = "diWater06.png"
        var xmsImg = "diWater%02d.png"
        var biaoqian = data.biaoqian

        var cup = new cc.Sprite(cupImg)
        cup.setPosition(0,0)
        self.addChild(cup)
        var biaoqian = new cc.Sprite(biaoqian)
        biaoqian.setPosition(38,27)
        cup.addChild(biaoqian)

        var dg = new cc.Sprite("#dg.png")
        dg.setPosition(100,120)
        cup.addChild(dg)
        var digai = new cc.Sprite("#digai.png")
        digai.setPosition(37,150)
        cup.addChild(digai)
        digai.setLocalZOrder(10)
        digai.setVisible(false)


        digai.digai = true
        dg.dg = true
        dg.dgOut = false  //判断滴管是否出了瓶子
        dg.haveWater = false //判断滴管是否有水
        dg.dgMove = true  //判断滴管在瓶内不能移动
        dg.noMove = false //判断滴管不能移动
        digai.noMove = false
        cup.noMove = false //判断玻璃瓶不能移动

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize()
                var rect = cc.rect(0, 0, s.width, s.height)
                if(target.dg)
                    rect = cc.rect(0, s.height/2, s.width, s.height/2)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    if(target.dg && !dg.dgOut){
                        return false
                    }
                    if(target.digai) {
                        reAdd(cup)
                        if(!dg.dgOut && !dg.haveWater){
                            dg.dgMove = false
                            dg.runAction(anixms())
                        }else if(!dg.dgOut && dg.haveWater){
                            digai.noMove = false
                            dg.setSpriteFrame(endDg)
                        }
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                var target = event.getCurrentTarget()
                var delta = touch.getDelta()
                if(target.digai && !digai.noMove) {
                    if (!dg.dgOut) {
                        if (digai.y+delta.y < 150 || !dg.dgMove)   return
                            digai.y += delta.y
                            dg.y += delta.y
                            if (digai.y > 225){
                                dg.dgOut = true
                                cup.noMove = true
                            }
                    }else if(dg.dgOut && !dg.noMove){
                        digai.y += delta.y
                        digai.x += delta.x
                        dg.y += delta.y
                        dg.x += delta.x
                        //自定义滴管移动方法
                        if(dgMoveFun)
                            dgMoveFun({
                                dg:dg,
                                digai:digai,
                            })
                    }
                }

                if(target.dg && dg.dgOut && !dg.noMove){
                    dg.x += delta.x
                    dg.y += delta.y
                    if(dg.dgOut && checkDistance(dg,cup)) {
                        digai.setPosition(37,150)
                        dg.setPosition(100,120)
                        dg.dgOut = false
                        cup.noMove = false
                        digai.noMove = false
                        if(!dg.haveWater)
                            dg.setSpriteFrame("dg.png")
                        else if(dg.haveWater)
                            dg.setSpriteFrame(fullDg)
                    }

                    //自定义滴管移动方法
                    if(dgMoveFun)
                        dgMoveFun({
                            dg:dg,
                            digai:digai,
                        })
                }
            },
            onTouchEnded: function(touch, event) {
                var target = event.getCurrentTarget()
                if(target.digai){
                    if(!dg.dgOut){
                        digai.setPosition(37,150)
                        dg.setPosition(100,120)
                        if(dg.haveWater)
                            dg.setSpriteFrame(fullDg)
                        else
                            dg.setSpriteFrame(startDg)
                        digai.noMove = false
                    }else if(dg.dgOut) {
                        digai.setPosition(cc.p(37,150))
                        digai.noMove = true
                    }
                    // if(!dg.dgOut && dg.haveWater){
                    //     dg.setSpriteFrame(fullDg)
                    // }
                }else if(target.dg){
                    
                }
            }
        })
        cc.eventManager.addListener(listener, digai)
        cc.eventManager.addListener(listener.clone(), dg)

        var anixms = function() {
            return cc.sequence(createAnimation({
                frame: xmsImg,
                end: 6,
                time:0.01
            }), cc.callFunc(function() {
                dg.dgMove = true
                dg.haveWater = true
            }))
        }

        var checkDistance = function(ra,rb){
            var pos = rb.convertToWorldSpace(ra.getPosition())
            var dx = (pos.x-ra.width/2-10) - rb.x
            var dy = (pos.y-ra.height/2) - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 50){
                return true
            }else{
                return false
            }
        }

        return cup
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
            {key:"do1_tip3",img:res.do1_tip3,sound:res.do1_sound3},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})