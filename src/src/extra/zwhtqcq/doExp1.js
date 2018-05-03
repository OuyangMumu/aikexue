var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    self.table()
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
        loadPlist("gua_plist")
        loadPlist("liu_plist")
        loadPlist("diguan_plist")
        loadPlist("zhe_plist")
        loadPlist("water_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        //第一部分
        var finger = createSp("#finger.png",cc.p(880,350),self)
        finger.setLocalZOrder(20)
        //第二部分

        //第二部分
        var zhuozi = createSp("#zhuozi.png",cc.p(600,-600),self)//20
        var shuicao2 = createSp("#shuicao2.png",cc.p(600,-600),self)//160
        var shuimian = createSp("#shuimian.png",cc.p(600,-600),self)//200
        var shuicao = createSp("#shuicao.png",cc.p(600,-600),self)//160
        shuimian.setScaleX(1.2)


        var curItem = null
        var curIndex = 0
        var toolbtn = createTool({
            pos: cc.p(280, 530),
            nums: 4,
            scale:0.85,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -20),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [99, 99, 99, 99],
            swallow: [true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3,res.do_tools4],
            gets: ["#tools_1.png","#tools_2.png","#tools_3.png","#tools_4.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var index = data.index
                if(curItem)
                    curItem.forceBack()
                item.index = index
                item.over = false
                curItem = item
                switch(curIndex){
                    case 0:
                        if(finger.noMove)
                            finger.setPosition(880,350)
                        finger.stopAllActions()
                        finger.noMove = false
                    break
                    case 1:
                    break
                    case 2:
                        shuimian.setPositionY(200)
                        item.setScale(0.4)
                    break
                    case 3:
                    break
                }
                return item
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(curIndex == 3){
                    if(!curItem.over){
                        curItem.over = true 
                        curItem.runAction(cc.sequence(
                            ani(inf[curItem.index].zheFrame,1,6,0.08),
                            aniRever(inf[curItem.index].zheFrame,2,6,0.08),
                            ani(inf[curItem.index].zheFrame,1,6,0.08),
                            aniRever(inf[curItem.index].zheFrame,2,6,0.08),
                            ani(inf[curItem.index].zheFrame,1,6,0.08),
                            aniRever(inf[curItem.index].zheFrame,2,6,0.08),
                            cc.callFunc(function(){
                                curItem.over = false
                            })
                        ))
                    }
                }
                if(item.noMove)
                    return false
                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                
                if(!item.noMove){
                    if(curIndex != 2){
                        item.x += delta.x
                        item.y += delta.y
                    }else{//y330,110  460,730
                        var posx = item.x + delta.x 
                        var posy = item.y + delta.y 
                        if((posx < 460 || posx > 730) && posy > 330){
                            item.x += delta.x 
                            item.y += delta.y 
                        }else if(posy > 100 && posx > 460 && posx < 730){
                            item.x += delta.x 
                            item.y += delta.y 
                        }
                    }
                }
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                switch(curIndex){
                    case 0:
                        curItem = item
                        item.noMove = true
                        item.setPosition(550,200)
                        finger.setPosition(880,350)
                    break
                    case 1:
                        item.noMove = true
                        item.setPosition(650,150)
                    break
                    case 2:
                        if(item.x > 460 && item.x < 730){
                            var fun = function(){
                                item.noMove = true
                                safeAdd(self, shuicao)
                                shuimian.runAction(cc.sequence(
                                    cc.delayTime(0.2),
                                    cc.moveTo(0.3,shuimian.x,shuimian.y+20)
                                ))
                                item.runAction(cc.sequence(
                                    cc.moveTo(0.5,item.x,100),
                                    cc.callFunc(function(){
                                        //冒气泡
                                        if(item.index == 0 || item.index == 1){
                                            var pos = cc.p(item.width/2,item.height/2+50)
                                            item.qipao = createSp(inf[item.index].qipaoImg,pos,item)
                                            item.qipao.setScale(2)
                                            item.qipao.runAction(aniRepeat(inf[item.index].qipaoFrame,inf[item.index].qipaoEnd,0.15))
                                            item.qipao.runAction(cc.sequence(
                                                cc.delayTime(10),
                                                cc.callFunc(function(){
                                                    item.qipao.stopAllActions()
                                                    item.qipao.setVisible(false)
                                                })
                                            ))
                                        }
                                    })
                                ))
                            }
                            if(item.y < 340){
                                item.runAction(cc.sequence(
                                    cc.moveTo(0.2,item.x,340),
                                    cc.callFunc(function(){
                                        fun()
                                    })
                                ))
                            }else{
                                fun()
                            }
                        }
                    break
                    case 3:
                        item.noMove = true
                        item.setPosition(550,200)
                        item.over = false
                        item.setSpriteFrame(inf[item.index].zheImg)
                        item.setScale(1.35)
                    break
                }
            },
            backfun:function(data){
                curItem = null
                return true
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        var btnfun = function(res,res2,pos){
            var btn = new ccui.Button(res,res2)
            btn.setPosition(pos)
            self.addChild(btn)
            return btn
        }
        var btnList = []
        btnList[0] = btnfun(res.btn_part1_select,res.btn_part1_normal,cc.p(120,400))
        btnList[1] = btnfun(res.btn_part2_normal,res.btn_part2_select,cc.p(120,330))
        btnList[2] = btnfun(res.btn_part3_normal,res.btn_part3_select,cc.p(120,260))
        btnList[3] = btnfun(res.btn_part4_normal,res.btn_part4_select,cc.p(120,190))
        
        for(var i = 0 ; i < 4 ; i++){
            btnList[i].index = i
            btnList[i].addClickEventListener(function(selector,type){
                var btn = selector
                //重置btn的位置，再重新打开
                toolbtn.dataControl.Moving = false
                toolbtn.dataControl.showing = false
                toolbtn.dataControl.toolbg.stopAllActions()
                toolbtn.dataControl.toolbg.setPosition(toolbtn.dataControl.moveModify)
                toolbtn.show()
                btn_fun()
                for(var j = 0 ; j < 4 ; j++){
                    if(j == btn.index){
                        btnList[j].loadTextures(inf[j].select,inf[j].normal)
                        inf[j].fun()
                        self.nodebs.say({key:self.addList[j].key,force:true})
                    }else{
                        btnList[j].loadTextures(inf[j].normal,inf[j].select)
                    }
                }
                curIndex = btn.index
                cc.log(curIndex)
            })
        }

        var btn_fun_1 = function(){
            finger.stopAllActions()
            finger.noMove = false
            finger.setPosition(880,350)
        }
        var btn_fun_3 = function(){
            zhuozi.setPositionY(20)
            shuicao2.setPositionY(160)
            shuimian.setPositionY(200)
            shuicao.setPositionY(160)
        }
        
        var btn_fun_2 = function(){
            var digai = cup.digai
            dg.stopAllActions()
            cup.setPositionY(150)
            digai.setPosition(37,150)
            dg.noMove = false
            dg.setPosition(100,120)
            dg.dgOut = false
            digai.noMove = false
            dg.setSpriteFrame("dg.png")
        }

        var btn_fun = function(){
            finger.stopAllActions()
            finger.setPositionY(-600)
            zhuozi.setPositionY(-600)
            shuicao2.setPositionY(-600)
            shuimian.setPositionY(-600)
            shuicao.setPositionY(-600)
            dg.stopAllActions()
            cup.setPositionY(-600)
            if(curItem){
                curItem.forceBack()
                curItem = null
            }
        }

        //手事件
        createTouchEvent({
            item:finger,
            begin:function(data){
                return true 
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(curItem){
                    if(!curItem.over && rectIntersectsRect(item,curItem)){
                        item.noMove = true
                        curItem.over = true
                        item.setPosition(curItem.x+105,curItem.y+105)
                        if(curItem.index != 3){
                            curItem.gua = createSp(inf[curItem.index].guaImg,cc.p(curItem.width/2,curItem.height/2),curItem)
                            curItem.gua.runAction(ani(inf[curItem.index].guaFrame,2,14,0.15))
                        }
                        item.runAction(cc.sequence(
                            cc.moveTo(2,curItem.x+170,curItem.y+30),
                            cc.callFunc(function(){
                                item.noMove = false
                                item.setPosition(880,350)
                            })
                        ))
                    }
                }
                
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }
            }
        })

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time
            }))
        }
        var aniRever = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time: time,
                rever: true,
            }))
        }

        var rectIntersectsRect = function(ra,rb){
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x-rb.width/2 || maxbx < ra.x-ra.width/2 || maxay < rb.y-rb.height/2 || maxby < ra.y-ra.height/2);
        }

        var inf = [
            {
                guaImg: "#gua_zhuan01.png",
                guaFrame: "gua_zhuan%02d.png",
                liuImg: "#liu_zhuan01.png",
                liuFrame: "liu_zhuan%02d.png",
                liuEnd: 13,
                zheImg: "zhe_zhuan01.png",
                zheFrame: "zhe_zhuan%02d.png",
                normal:res.btn_part1_normal,
                select:res.btn_part1_select,
                qipaoImg: "#qipao1_01.png",
                qipaoFrame: "qipao1_%02d.png",
                qipaoEnd: 14,
                fun:function(){
                    btn_fun_1()
                }
            },{
                guaImg: "#gua_wa01.png",
                guaFrame: "gua_wa%02d.png",
                liuImg: "#liu_wa01.png",
                liuFrame: "liu_wa%02d.png",
                liuEnd: 20,
                zheImg: "zhe_wa01.png",
                zheFrame: "zhe_wa%02d.png",
                normal:res.btn_part2_normal,
                select:res.btn_part2_select,
                qipaoImg: "#qipao2_01.png",
                qipaoFrame: "qipao2_%02d.png",
                qipaoEnd: 8,
                fun:function(){
                    btn_fun_2()
                }
            },{
                guaImg: "#gua_tao01.png",
                guaFrame: "gua_tao%02d.png",
                liuImg: "#liu_tao01.png",
                liuFrame: "liu_tao%02d.png",
                liuEnd: 24,
                zheImg: "zhe_tao01.png",
                zheFrame: "zhe_tao%02d.png",
                normal:res.btn_part3_normal,
                select:res.btn_part3_select,
                fun:function(){
                    btn_fun_3()
                }
            },{
                guaImg: null,
                guaFrame: null,
                liuImg: "#liu_ci01.png",
                liuFrame: "liu_ci%02d.png",
                liuEnd: 24,
                zheImg: "zhe_ci01.png",
                zheFrame: "zhe_ci%02d.png",
                normal:res.btn_part4_normal,
                select:res.btn_part4_select,
                fun:function(){
                    cc.log("btn_fun_4")
                }
            },
        ]

        var cup = self.createDiguan({
            biaoqian:res.biaoqian,
            dgMoveFun:function(data){
                var dg = data.dg
                var digai = data.digai
                if(curItem){
                    if(dg.haveWater && !curItem.over && checkDistance_dg(dg,curItem)){
                        safeAdd(self, cup)
                        dg.haveWater = false 
                        dg.noMove = true
                        curItem.over = true
                        dg.setPosition(dg.getParent().convertToNodeSpace(cc.p(curItem.x+60,curItem.y+curItem.height/2+80)))
                        dg.runAction(cc.sequence(
                            fsAni(),
                            cc.callFunc(function(){ 
                                digai.setPosition(37,150)
                                dg.noMove = false
                                dg.setPosition(100,120)
                                dg.dgOut = false
                                digai.noMove = false
                                dg.setSpriteFrame("dg.png")
                            })
                        ))
                        dg.runAction(cc.sequence(
                            cc.delayTime(0.5),
                            cc.callFunc(function(){
                                var pos = cc.p(curItem.width/2,curItem.height/2)
                                curItem.water = createSp(inf[curItem.index].liuImg,pos,curItem)
                                curItem.water.runAction(ani(inf[curItem.index].liuFrame,1,inf[curItem.index].liuEnd,0.2))
                            })
                        ))
                    }
                }
            }
        })
        var dg = cup.dg
        var fsAni = function(){
            return cc.sequence(createAnimation({
                frame: "diWater%02d.png",
                start:2,
                end: 6,
                time:0.2,
                rever:true,
            }))
        }

        var checkDistance_dg = function(r1,r2){
            var pos = getWorldPos(r1)
            var dx = pos.x-r1.width/2 - r2.x
            var dy = pos.y-r1.height/2 - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 100)
                return true
            else
                return false
        }

        var aniRepeat = function(frame,end,time){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                end: end,
                time: time
            })))
        }

        cup.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(function(){
                self.table()
            })
        ))
    },

    table:function(){
        var self = this
        if (!self.bgg) {
            loadPlist("tableWz_plist")
            var bg = createBiaoge({
                json: res.zwhtqcq_tableNode_json,
                scale: 0.9,
                judgeScale: 0.7,
                downData: {
                    nums: 16,
                    scale: 2,
                    bufs: [
                        [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz1.png","#table_wz2.png"],
                        [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz1.png","#table_wz2.png"],
                        [null,"#table_wz3.png","#table_wz4.png"],[null,"#table_wz3.png","#table_wz4.png"],
                        [null,"#table_wz3.png","#table_wz4.png"],[null,"#table_wz3.png","#table_wz4.png"],
                        [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                        [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                        [null,"#table_wz7.png","#table_wz8.png"],[null,"#table_wz7.png","#table_wz8.png"],
                        [null,"#table_wz7.png","#table_wz8.png"],[null,"#table_wz7.png","#table_wz8.png"]
                    ],
                    keys: [
                        1, 1, 2, 2,  1,1,2,2,  1,1,1,1,  2,2,2,2
                    ]
                },
            })
            self.addChild(bg)
            bg.setPositionY(-1000)
            self.bgg = bg
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
        cup.setPosition(300,-500)//300,150
        self.addChild(cup)
        cup.setScale(1.2)
        var biaoqian = new cc.Sprite(biaoqian)
        biaoqian.setPosition(38,32)
        cup.addChild(biaoqian)

        var dg = new cc.Sprite("#dg.png")
        dg.setPosition(100,120)
        cup.addChild(dg)
        cup.dg = dg
        var digai = new cc.Sprite("#digai.png")
        digai.setPosition(37,150)
        cup.addChild(digai)
        digai.setLocalZOrder(10)
        digai.setVisible(false)

        cup.digai = digai
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
            {key:"do_tip1",img: res.do_tip1,sound:res.do_sound1},
            {key:"do_tip2",img: res.do_tip2,sound:res.do_sound2},
            {key:"do_tip3",img: res.do_tip3,sound:res.do_sound3},
            {key:"do_tip4",img: res.do_tip4,sound:res.do_sound4},
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})