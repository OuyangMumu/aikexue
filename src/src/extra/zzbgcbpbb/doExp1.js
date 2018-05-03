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
        loadPlist("bolipian_plist")
        loadPlist("diguan_plist")
        loadPlist("gua_plist")
        loadPlist("dy_plist")
        loadPlist("xishui_plist")
        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })

        var sayFun = function(key){
            self.nodebs.say({key:key,force:true})
        }
        var judgeList = [true,false,false,false,false,false,false,false,false]
        var xwj = null //显微镜
        var slide = null //载玻片
        var waterCup = null //滴水
        var toolbtn = createTool({
            pos: cc.p(290, 550),
            nums: 4,
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
            counts: [1, 1, 1, 1, 1, 1, 1,  1, 1, 1],
            swallow: [true, true, true, true, true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4, res.do_tools5,
                    res.do_tools6, res.do_tools7, res.do_tools8, res.do_tools9, res.do_tools10],
            gets: ["#bolipian01.png",res.gauze,null,"#yang.png","#daopian.png","#niezi.png",
            "#gaitool.png",null,"#xishui.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp

                if(judgeList[0] && index > 1){
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[1] && index > 2){
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[2] && index > 4){ //取出洋葱和刀片
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[3] && index > 5){//取出镊子
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[4] && index > 6){//取出盖玻片
                    sayFun("do1_tip0")
                    return false
                }else if(judgeList[5] && index > 7){//碘液
                    sayFun("do1_tip0")
                    return false
                }else if(judgeList[6] && index > 8){
                    sayFun("do1_tip0")
                    return false
                }

                if(index == 0){//载玻片
                    item.over = false
                    slide = item
                }else if(index == 2){//滴管
                    item = self.createDiguan({
                        biaoqian:res.biaoqian,
                        dgMoveFun:function(data){
                            var dg = data.dg
                            if(dg.haveWater && checkDistance_dg(dg,slide)){
                                dg.haveWater = false 
                                dg.noMove = true 
                                dg.setPosition(dg.getParent().convertToNodeSpace(cc.p(slide.x+110,slide.y+100)))
                                dg.runAction(cc.sequence(
                                    fsAni(),
                                    cc.callFunc(function(){
                                        slide.setSpriteFrame("bolipian02.png")
                                        waterCup.setPositionY(-600)
                                        sayFun("do1_tip3")
                                        judgeList[1] = false 
                                        judgeList[2] = true
                                    })
                                ))

                            }
                        }
                    })
                    waterCup = item
                }else if(index == 5){
                    item.havecong = false //有葱片
                    item.havegai = false //盖玻片
                }else if(index == 7){
                    item = self.dy_Diguan({
                        dgMoveFun:function(data){
                            var dg = data.dg
                            if(dg.haveWater && checkDistance_dg(dg,slide)){
                                dg.haveWater = false 
                                dg.noMove = true 
                                dg.setPosition(dg.getParent().convertToNodeSpace(cc.p(slide.x+135,slide.y+100)))
                                dg.runAction(cc.sequence(
                                    cc.delayTime(0.8),
                                    cc.callFunc(function(){
                                        slide.runAction(ani("bolipian%02d.png",9,13,0.2))
                                        self.toolbtn.getindex(7).setPositionY(-600)
                                        //sayFun("do1_tip3")
                                    }),
                                    cc.delayTime(1.5),
                                    cc.callFunc(function(){
                                        //提示用吸水纸
                                        judgeList[5] = false 
                                        judgeList[6] = true
                                    })
                                ))

                            }
                        }
                    })
                }else if(index == 9){
                    XWJFun()
                    xwj.havezbp = false
                    xwj.ypj = false
                    xwj.zbp_OK = false
                    xwj.curCount = [false,false,false]
                    return xwj
                }
                return item
            },
            clickfun: function(data){
                var item = data.sp 
                var index = data.index
                if(item.noMove)
                    return false

                if(index == 0 && item.over){
                    if(xwj){//已有显微镜
                        if(!xwj.havezbp){//可以放入载玻片
                            sayFun("do1_tip9")
                            return false
                        }
                    item.setLocalZOrder(xwj.getLocalZOrder()+1)
                    }else{//没有拖出显微镜，提示取出显微镜
                        sayFun("do1_tip10")
                        return false 
                    }
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
                switch(index){
                    case 0:
                        if(item.over){
                            zbpFun(item)
                        }
                    break
                    case 1:
                        if(slide){
                            gauzeCall(item)
                        }
                    break
                    case 4://刀片 洋葱
                        if(!self.toolbtn.getindex(3))   return
                        yangcongFun(item)
                    break
                    case 5:
                        nieziFun(item)
                    break
                    case 8:
                        xishuiFun(item)
                    break
                }
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index
                switch(index){
                    case 0:
                    if(!item.over){
                        item.setPosition(630,70)
                        item.noMove = true 
                    }
                    break
                    case 2:
                    item.setPosition(300,80)
                    item.noMove = true 
                    break
                    case 3:
                    item.setPosition(360,180)
                    item.noMove = true
                    break
                    case 6:
                        item.setPosition(300,80)
                        item.noMove = true 
                    break
                    case 7:
                    item.setPosition(300,80)
                    item.noMove = true 
                    break
                    case 9:
                        item.showHand(false)
                        item.setPosition(750,250)
                        item.noMove = true 
                    break
                }
            },
            backfun: function(data){
                return false 
            }
        })
        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        //载玻片放入到显微镜上
        var zbpFun = function(item){
            if(item.over){//将载玻片放到显微镜上面
                if(!self.finishGet && xwj){
                    var result = xwj.addItem({
                        item: slide,
                        pos: cc.p(30, 30),//放在载物台上的位置
                        scale: 1.0,
                        fun:function(){
                            slide.noMove = true
                            var tex = null
                            switch(xwj.curKey){
                                case "db":
                                    tex = res.do1_db
                                    break
                                case "gb":
                                    tex = res.do1_gb
                                    break
                            }
                            xwj.setFile({
                                tex: tex,
                                scale: 0.6,
                            })
                        }
                    })
                    if(result){
                        xwj.zbp_OK = true
                        self.finishGet = true
                    }
                }
            }
        }

        //放大镜
        var XWJFun = function(){
            xwj = createXwj({
                radius: 100,
                zhqFun: function(key) {
                    var see = xwj.getSee({
                        ifMove: false,
                        pos: getMiddle(-300, 0),
                        scale: 0.6,
                    })
                    safeAdd(self, see)
                    xwj.curKey = key
                    var tex = null
                    switch(xwj.curKey){
                        case "db":
                            tex = res.do1_db
                            break
                        case "gb":
                            tex = res.do1_gb
                            break
                    }
                    if(xwj.ypj){
                        xwj.setFile({
                            tex: tex,
                            scale: 0.6,
                        })
                    }
                },
                fgjFun:function(){
                    //提示可以放入载玻片
                    cc.log("put zbp")
                    xwj.havezbp = true
                    sayFun("do1_tip8")
                },
                ypjFun:function(){
                    //判断压片夹是否已经盖住
                    cc.log("take over")
                    xwj.ypj = true
                },
                judgeLxFun:function(){//压片夹未盖住，旋转调用
                    if(!xwj.ypj && xwj.zbp_OK){
                        sayFun("do1_tip11")
                        return false
                    }
                    return true
                },
                judgeCountFun:function(data){//判断次数
                    var name = data.name
                    if(name == "czjlx"){
                        xwj.curCount[0] = true
                    }else if(name == "xzjlx"){
                        xwj.curCount[1] = true
                    }
                    if(xwj.ypj && xwj.curCount[0] && xwj.curCount[1] && !xwj.curCount[2]){
                        xwj.curCount[2] = true
                        //提示说话,创建按钮
                        sayFun("do1_tip6")
                        var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
                        btn_result.setPosition(1030,450)
                        self.addChild(btn_result)
                        btn_result.addClickEventListener(function(){
                            self.nodebs.say({key:"result"})
                        })
                    }
                    
                }
            })
        }
        //吸水纸
        var xishuiFun = function(item){
            if(!item.noMove && checkdistans(item,slide,100)){
                item.noMove = true
                item.setPosition(465,145)
                item.runAction(cc.sequence(
                    ani("xishui%02d.png",1,10,0.3),
                    cc.delayTime(0.3),
                    cc.callFunc(function(){
                        item.setPositionY(-500)
                        slide.runAction(cc.sequence(
                            ani("bolipian%02d.png",14,18,0.2),
                            cc.callFunc(function(){
                                slide.setPosition(465,100)
                                slide.setSpriteFrame("bolipian19.png")
                            }),
                            cc.delayTime(0.5),
                            cc.callFunc(function(){
                                //提示该放显微镜了
                                slide.noMove = false
                                slide.over = true
                                sayFun("do1_tip7")
                                judgeList[6] = false 
                                judgeList[7] = true
                            })
                        ))
                    })
                ))
            }
        }
        //镊子
        var nieziFun = function(item){
            if(!item.havecong && checkdistans2(self.toolbtn.getindex(3),item,40)){
                item.havecong = true 
                item.noMove = true 
                var sp = self.toolbtn.getindex(3)
                item.setPosition(sp.x+95,sp.y+75)
                item.setSpriteFrame("niezi2.png")
                var biaopi = createSp("#hua19.png",cc.p(0,0),item)
                item.runAction(cc.sequence(
                    cc.moveTo(0.8,sp.x+95,sp.y+90),
                    cc.callFunc(function(){
                        item.noMove = false
                        sp.setPositionY(-500)
                    })
                ))
            }else if(item.havecong && checkdistans2(slide,item,80)){
                item.noMove = true 
                item.havecong = false 
                item.setPosition(slide.x+110,slide.y+75)
                item.removeAllChildren()
                slide.runAction(ani("bolipian%02d.png",2,5,0.2))
                item.runAction(cc.sequence(
                    cc.moveTo(0.5,slide.x+120,slide.y+75),
                    cc.delayTime(0.5),
                    cc.callFunc(function(){
                        item.setPosition(slide.x+200,slide.y+200)
                        item.noMove = false
                        //取出盖玻片
                        sayFun("do1_tip4")
                        judgeList[3] = false 
                        judgeList[4] = true
                    })
                ))
            }
            if(self.toolbtn.getindex(6)){ //盖玻片,取盖玻片
                if(!item.havegai && checkdistans2(self.toolbtn.getindex(6),item,40)){
                    var sp = self.toolbtn.getindex(6)
                    item.havegai = true
                    item.noMove = true 
                    item.setPosition(sp.x+85,sp.y+75)
                    item.setLocalZOrder(sp.getLocalZOrder()+1)
                    var gai = createSp("#gai.png", cc.p(-14,-4), item)
                    item.runAction(cc.sequence(
                        cc.moveTo(0.6,sp.x+85,sp.y+100),
                        cc.callFunc(function(){
                            item.noMove = false
                            sp.setPositionY(-500)
                        })
                    ))
                }else if(item.havegai && checkdistans2(slide,item,40)){//放盖玻片
                    item.setPosition(slide.x+100,slide.y+80)
                    item.havegai = false
                    item.removeAllChildren()
                    item.runAction(cc.sequence(
                        cc.moveTo(0.8,slide.x+120,slide.y+70),
                        cc.callFunc(function(){
                            item.setPositionY(-500)
                            sayFun("do1_tip5")
                            judgeList[4] = false 
                            judgeList[5] = true
                        })
                    ))
                    slide.runAction(ani("bolipian%02d.png",6,8,0.3))
                }
            }
        }

        //刀片，洋葱
        var yangcongFun = function(item){
            if(!item.noMove && checkdistans(item,self.toolbtn.getindex(3),150)){
                var sp = self.toolbtn.getindex(3)
                item.noMove = true 
                item.setLocalZOrder(10)
                var hua = createSp("#hua01.png",cc.p(90,60),sp)
                hua.runAction(ani("hua%02d.png",1,18,0.3))
                item.runAction(cc.sequence(
                    cc.moveTo(0.3,sp.x+100,sp.y+55),
                    cc.moveTo(0.8,sp.x+105,sp.y+43),
                    cc.callFunc(function(){
                        item.setPosition(sp.x+100,sp.y+55)
                    }),
                    cc.moveTo(0.8,sp.x+120,sp.y+55),
                    cc.moveTo(0.8,sp.x+123,sp.y+43),
                    cc.callFunc(function(){
                        item.setPosition(sp.x+105,sp.y+43)
                    }),
                    cc.moveTo(0.8,sp.x+123,sp.y+43),
                    cc.callFunc(function(){
                        item.setPositionY(-500)
                        judgeList[2] = false 
                        judgeList[3] = true
                    })
                ))
            }
        }
        //纱布 载玻片
        var gauzeCall = function(item){
            var call = function(){
                item.runAction(cc.sequence(
                    cc.delayTime(0.1),
                    cc.moveTo(0.05,slide.x+130,slide.y+40),
                    cc.moveTo(0.3,slide.x+80,slide.y+40),
                    cc.delayTime(0.1),
                    cc.moveTo(0.2,slide.x+130,slide.y+60)
                ))
            }
            var fun = function(){
                item.runAction(cc.sequence(
                    cc.callFunc(function(){
                        call()
                    }),
                    cc.delayTime(0.8),
                    cc.callFunc(function(){
                        call()
                    }),
                    cc.delayTime(0.8),
                    cc.callFunc(function(){
                        call()
                    }),
                    cc.delayTime(0.8),
                    cc.callFunc(function(){
                        item.setPositionY(-600)
                        judgeList[0] = false 
                        judgeList[1] = true
                        sayFun("do1_tip2")
                    })
                ))
            }
            if(!item.noMove && checkdistans(item,slide,120)){
                item.setLocalZOrder(10)
                item.noMove = true 
                item.setPosition(slide.x+100,slide.y+40)
                fun()
            }
        }

        var ani = function(frame,start,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start:start,
                end: end,
                time: time,
            }))
        }

        var checkdistans = function(ra,rb,dis){
            var dx =  ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
                return false
        }
        var checkdistans2 = function(ra,rb,dis){
            var dx =  ra.x - (rb.x-rb.width/2)
            var dy = ra.y - (rb.y-rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis){
                return true
            }else
                return false
        }
        var checkDistance_dg = function(r1,r2,dis){
            var pos = getWorldPos(r1)
            var dx = pos.x-r1.width/2 - r2.x
            var dy = pos.y-r1.height/2 - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 80)
                return true
            else
                return false
        }
        var fsAni = function(){
            return cc.sequence(createAnimation({
                frame: "diWater%02d.png",
                start:2,
                end: 6,
                time:0.2,
                rever:true,
            }))
        }
    },

    dy_Diguan : function(data){
        var dgMoveFun = data.dgMoveFun
        var cupPos = data.cupPos
        var self = this
        var cupImg = "#dy_cup.png"
        var fullDg = "dy_diWater01.png"
        var startDg = "dy_diWater01.png"
        var endDg = "dy_diWater05.png"
        var xmsImg = "dy_diWater%02d.png"
        //var biaoqian = data.biaoqian

        var cup = new cc.Sprite(cupImg)
        cup.setPosition(0,0)
        self.addChild(cup)
        // var biaoqian = new cc.Sprite(biaoqian)
        // biaoqian.setPosition(38,32)
        // cup.addChild(biaoqian)

        var dg = new cc.Sprite("#dy_diWater01.png")
        dg.setPosition(100,120)
        cup.addChild(dg,-1)

        var digai = new cc.Sprite("#dy_digai.png")
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
                end: 5,
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
        biaoqian.setPosition(38,32)
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
            {key:"do1_tip0",img:res.do1_tip0,sound:res.do1_sound0},
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
            {key:"do1_tip3",img:res.do1_tip3,sound:res.do1_sound3},
            {key:"do1_tip4",img:res.do1_tip4,sound:res.do1_sound4},
            {key:"do1_tip5",img:res.do1_tip5,sound:res.do1_sound5},
            {key:"do1_tip6",img:res.do1_tip6,sound:res.do1_sound6},
            {key:"do1_tip7",img:res.do1_tip7,sound:res.do1_sound7},
            {key:"do1_tip8",img:res.do1_tip8,sound:res.do1_sound8},
            {key:"do1_tip9",img:res.do1_tip9,sound:res.do1_sound9},
            {key:"do1_tip10",img:res.do1_tip10,sound:res.do1_sound10},
            {key:"do1_tip11",img:res.do1_tip11,sound:res.do1_sound11},
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
            key: "result",
            img: res.do1_tip12,
            sound: res.do1_sound12,
            id: "result"
        })
    },
})