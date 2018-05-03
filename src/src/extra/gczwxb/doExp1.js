var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if(!self.bgg) {
                        var bg = createBiaoge({
                            json: res.gczwxb_tableNode_json,
                            scale: 0.9
                    })
                    var that = bg
                    createBgMoveSp({
                        father:that,
                        imgs:[
                            [res.draw_1,0],
                            [res.draw_2,1],
                            [res.draw_3,2],
                            [res.draw_4,3],
                        ],
                        pos:cc.p(150,120),
                        dis:170,
                        resultfather:self,
                        rectlist:[
                           cc.rect(265,365,200,150),
                           cc.rect(535,365,200,150),
                           cc.rect(265,210,200,150),
                           cc.rect(535,210,200,150),
                        ]
                    })
                    bg.upLoadFun = function(){
                        that.upResult()
                    }
                    bg.ClearFun = function(){
                        that.clearData()
                    }
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
        return true;
    },

    initUI: function () {
        var self = this
        loadPlist("diguan_plist")
        loadPlist("leaf_plist")
        loadPlist("biaopi_plist")
        loadPlist("gaibo_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        
        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        var sayFun = function(key){
            self.nodebs.say({key:key,force:true})
        }
        var judgeList = [true,false,false,false,false,false]
        
        var xwj = null //显微镜
        var slide = null //载玻片
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
            counts: [1, 1, 1, 1, 1, 1, 1],
            swallow: [true, true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3, res.do_tools4, res.do_tools5,
                    res.do_tools6, res.do_tools7],
            gets: [res.slide,res.gauze,null,"#leaf01.png","#niezi.png",res.gaitool,null],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp

                if(judgeList[0] && index > 1){
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[1] && index > 2){
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[2] && index > 4){
                    sayFun("do1_tip0")
                    return false 
                }else if(judgeList[3] && index > 5){
                    sayFun("do1_tip0")
                    return false 
                }

                if(index == 6){
                    xwj = createXwj({
                        radius: 100,
                        zhqFun: function(key) {
                            var see = xwj.getSee({
                                ifMove: false,
                                pos: getMiddle(-300, 0),
                                scale: 0.6,
                            })
                            safeAdd(self, see)
                            //切换的时候在这里换图 内部会自动计算
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
                            sayFun("do1_tip6")
                        },
                        ypjFun:function(){
                            //判断压片夹是否已经盖住
                            cc.log("take over")
                            xwj.ypj = true
                        },
                        judgeLxFun:function(){//压片夹未盖住，旋转调用
                            if(!xwj.ypj && xwj.zbp_OK){
                                sayFun("do1_tip9")
                                return false
                            }
                            return true
                        }
                    })
                    xwj.havezbp = false
                    xwj.ypj = false
                    xwj.zbp_OK = false
                    return xwj
                }
                if(index == 0){
                    slide = item
                    slide.over = false
                }
                if(index == 2){
                    item = self.createDiguan({
                        biaoqian:res.biaoqian,
                        dgMoveFun:function(data){
                            var dg = data.dg
                            if(dg.haveWater && checkDistance_dg(dg,slide)){
                                dg.haveWater = false 
                                dg.noMove = true 
                                dg.setPosition(dg.getParent().convertToNodeSpace(cc.p(slide.x+60,slide.y+100)))
                                dg.runAction(cc.sequence(
                                    fsAni(),
                                    cc.callFunc(function(){
                                        self.cup.setPositionY(-600)
                                        createSp(res.water,cc.p(55,11),slide)
                                        judgeList[1] = false
                                        judgeList[2] = true
                                        sayFun("do1_tip3")
                                    })
                                ))

                            }
                        }
                    })
                self.cup = item
                return item
                }
                if(index == 3)
                    item.over = false //用于判断是否可以提取表皮
                if(index == 4){
                    item.havebiao = false 
                    item.havegai = false 
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
                            sayFun("do1_tip7")
                            return false
                        }
                    item.setLocalZOrder(xwj.getLocalZOrder()+1)
                    }else{//没有拖出显微镜，提示取出显微镜
                        sayFun("do1_tip8")
                        return false 
                    }
                }
                return true 
            },
            movefun: function(data){
                var item = data.sp 
                var delta = data.delta
                var index = data.index
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y
                }
                if(index == 0){
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
                if(index == 1 && slide){
                    if(!item.noMove && checkdistans(item,slide,80)){
                        item.setLocalZOrder(10)
                        item.noMove = true 
                        item.setPosition(slide.x+100,slide.y+40)
                        gauzeCall(item)
                    }
                }else if(index == 4){
                    //取出表皮
                    if(!self.toolbtn.getindex(3)) return 
                    if(!item.havebiao && self.toolbtn.getindex(3).over && checkdistans2(self.toolbtn.getindex(3),item,120)){
                        item.noMove = true
                        item.havebiao = true
                        var leaf = self.toolbtn.getindex(3)
                        item.setLocalZOrder(leaf.getLocalZOrder()+1)
                        item.setPosition(leaf.x+100,leaf.y+90)
                        item.setSpriteFrame("niezi2.png")
                        item.runAction(cc.sequence(
                            cc.moveTo(1,leaf.x+100,leaf.y+100)
                        ))
                        var biaopi = createSp("#biaopi01.png", cc.p(4,0), item)
                        biaopi.runAction(cc.sequence(
                            ani("biaopi%02d.png",1,6,0.2),
                            cc.callFunc(function(){
                                leaf.setPositionY(-600)
                                item.noMove = false
                            })
                        ))
                    }
                    //将表皮放到载玻片
                    if(item.havebiao && checkdistans2(slide,item,60)){
                        item.havebiao = false 
                        item.noMove = true  
                        item.setPosition(570,180)
                        item.runAction(cc.sequence(
                            cc.moveTo(1,580,175),
                            cc.callFunc(function(){
                                slide.getChildren()[0].setTexture(res.water2)
                                item.setSpriteFrame("niezi.png")
                                item.setPosition(630,250)
                                item.removeAllChildren()
                                item.noMove = false 
                                judgeList[2] = false 
                                judgeList[3] = true
                                sayFun("do1_tip4")
                            })
                        ))
                    }
                    //拿出盖玻片
                    if(self.toolbtn.getindex(5)){
                        if(!item.havegai && checkdistans2(self.toolbtn.getindex(5),item,40)){
                            item.havegai = true
                            item.noMove = true 
                            item.setPosition(400,165)
                            var gai = createSp(res.gai, cc.p(-14,-4), item)
                            item.runAction(cc.sequence(
                                cc.moveTo(0.6,430,260),
                                cc.callFunc(function(){
                                    item.noMove = false
                                    self.toolbtn.getindex(5).setPositionY(-300)
                                })
                            ))
                        }
                    }
                    //将盖玻片放到载玻片上面
                    if(item.havegai && checkdistans2(slide,item,60)){
                        item.havegai = false 
                        item.setPosition(580,185)
                        slide.removeAllChildren()
                        item.removeAllChildren()
                        slide.setPosition(slide.x,slide.y-13)
                        slide.setScale(0.66)
                        slide.runAction(cc.sequence(
                            ani("gaibo%02d.png",1,7,0.25),
                            cc.delayTime(0.3),
                            cc.callFunc(function(){
                                slide.setSpriteFrame("gaibo08.png")
                                slide.noMove = false
                                slide.setScale(1)
                                item.setPositionY(-300)
                                slide.over = true
                                judgeList[3] = false
                                sayFun("do1_tip5")
                            })
                        ))
                        item.runAction(cc.sequence(
                            cc.delayTime(0.2),
                            cc.moveTo(0.5,600,185)
                        ))
                    }
                }    
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index 
                switch(index){
                    case 0:
                    if(!item.over){
                        item.setPosition(500,100)
                        item.noMove = true 
                    }
                    break
                    case 2:
                    item.setPosition(300,80)
                    item.noMove = true 
                    break
                    case 3:
                    item.setPosition(250,250)
                    item.noMove = true
                    item.runAction(cc.sequence(
                        ani("leaf%02d.png",1,13,0.2),
                        cc.callFunc(function(){
                            item.over = true
                        })
                    ))
                    break
                    case 5:
                    item.setPosition(300,80)
                    item.noMove = true 
                    break
                    case 6:
                    item.showHand(false)
                    item.setPosition(750,250)
                    cc.log(item.noMove)
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

        //纱布 载玻片
        var gauzeCall = function(item){
            var call = function(){
                item.runAction(cc.sequence(
                    cc.delayTime(0.1),
                    cc.moveTo(0.05,slide.x+100,slide.y+40),
                    cc.moveTo(0.3,slide.x+50,slide.y+40),
                    cc.delayTime(0.1),
                    cc.moveTo(0.2,slide.x+100,slide.y+60)
                ))
            }

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

        var ani = function(frame,start,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start:start,
                end: end,
                time: time,
            }))
        }
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


})