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
                    if (!self.bgg) {
                        loadPlist("tableWz_plist")
                        var bg = createBiaoge({
                            json: res.cldfl_tableNode_json,
                            scale: 0.9,
                            judgeScale: 0.7,
                            downData: {
                                nums: 24,
                                scale: 1.5,
                                bufs: [
                                    [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                    [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                    [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                    [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                    [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                    [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                    [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                    [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                    [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                    [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                    [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                    [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"]
                                ],
                                keys: [
                                    1, 2, 1, 1,  1,1,1,1,  2,1,1,2,  2,1,2,1,    2,1,2,2,   2,1,1,2
                                ]
                            },
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
        loadPlist("someItem_plist")
        loadPlist("zhewan_plist")
        loadPlist("diguan_plist")
        loadPlist("dishui_plist")

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
        var finger = createSp("#zhijia.png",cc.p(600,-500),self)
        finger.setLocalZOrder(20)
        finger.setPosition(800,300)
        //第二部分
        var zhuozi = createSp("#zhuozi.png",cc.p(600,-500),self)//70
        var shuicao2 = createSp("#shuicao2.png",cc.p(600,-500),self)//210
        var shuimian = createSp("#shuimian.png",cc.p(600,-500),self)//250
        var shuicao = createSp("#shuicao.png",cc.p(600,-500),self)//210
        shuimian.setScaleX(1.2)
        //第三部分
        var hand1 = createSp("#hand.png",cc.p(300,-300),self)
        var hand2 = createSp("#hand.png",cc.p(900,-300),self)
        
        hand1.setScale(0.79)
        hand2.setScale(0.79)
        hand2.setScaleX(-0.79)

        var curItem = null
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
            counts: [99, 99, 99, 99, 99, 99],
            swallow: [true, true, true, true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3,res.do_tools4,
                    res.do_tools5,res.do_tools6],
            gets: ["#tools_1.png","#tools_2.png","#tools_3.png","#tools_4.png",
                    "#tools_5.png","#tools_6.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var index = data.index
                if(curItem)
                    curItem.forceBack()
                item.index = index
                curItem = item
                switch(curIndex){
                    case 0://刮指甲
                    if(finger.noMove)
                            finger.setPositionY(-1000)
                        finger.stopAllActions()
                        finger.noMove = false
                        finger.setSpriteFrame("zhijia.png")
                        //finger.setPosition(800,300)
                    break
                    case 1:
                        shuimian.setPositionY(250)
                    break
                    case 2:
                        if(index == 3)
                            item.setScale(0.79)
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
                if(item.noMove)
                    return false
                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                switch(curIndex){
                    case 0://指甲刮
                        curItem = item
                        item.noMove = true
                        item.setPosition(568,120)
                        finger.setPosition(800,300)
                    break
                    case 1:
                        if(!item.noMove && rectIntersectsRect(item,shuicao2)){
                            item.noMove = true
                            part2_fun()
                        }
                    break
                    case 2:
                        item.noMove = true
                        item.setPosition(600,250)
                        hand1.setPositionY(300)
                        hand2.setPositionY(300)
                    break
                    case 3:
                        item.noMove = true
                        item.setPosition(600,150)
                        item.over = false
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

        var part2_fun = function(){
            curItem.runAction(cc.sequence(
                cc.moveTo(0.3,600,390),
                cc.callFunc(function(){
                    safeAdd(self, shuimian)
                    safeAdd(self, shuicao)
                }),
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    fun()
                })
            ))

            var fun = function(){
                switch(curItem.index){//水面600，80，1.18，0.8
                    case 0:
                        curItem.runAction(cc.sequence(
                            cc.moveTo(0.3,600,260),
                            cc.moveTo(0.2,600,280),
                            cc.moveTo(0.2,600,270)
                        ))
                        shuimian.runAction(cc.sequence(
                            cc.delayTime(0.2),
                            cc.moveTo(0.2,600,260),
                            cc.moveTo(0.1,600,255)
                        ))
                    break
                    case 1:
                        curItem.runAction(cc.sequence(
                            cc.moveTo(0.3,600,250),
                            cc.moveTo(0.6,600,230),
                            cc.moveTo(1,600,140)
                        ))
                    break
                    case 2:
                        curItem.runAction(cc.sequence(
                            cc.moveTo(0.5,600,140)
                        ))
                        shuimian.runAction(cc.sequence(
                            cc.delayTime(0.2),
                            cc.moveTo(0.2,600,260)
                        ))
                    break
                    case 3:
                        curItem.runAction(cc.sequence(
                            cc.moveTo(0.3,600,170),
                            cc.callFunc(function(){
                                curItem.bubble = createSp("#bubble01.png",cc.p(140,150),curItem)
                                curItem.bubble.runAction(cc.sequence(
                                    ani("bubble%02d.png",1,4,0.2),
                                    ani("bubble%02d.png",1,4,0.2),
                                    cc.callFunc(function(){
                                        curItem.removeAllChildren(true)
                                    })
                                ))
                            })
                        ))
                        shuimian.runAction(cc.sequence(
                            cc.delayTime(0.2),
                            cc.moveTo(0.2,600,260)
                        ))
                    break
                    case 4:
                        curItem.runAction(cc.sequence(
                            cc.moveTo(0.3,600,170)
                        ))
                        shuimian.runAction(cc.sequence(
                            cc.delayTime(0.2),
                            cc.moveTo(0.2,600,260)
                        ))
                    break
                    case 5:
                        curItem.runAction(cc.sequence(
                            cc.moveTo(0.6,600,120)
                        ))
                    break
                }
            }
        }

        //手折弯
        var handList = [hand1,hand2]
        for(var i = 0 ; i < 2 ; i++){
            var hand = handList[i]
            createTouchEvent({
                item:hand,
                begin:function(data){
                    var item = data.item
                    hand1.setPositionY(-600)
                    hand2.setPositionY(-600)
                    curItem.setScale(0.79)
                    switch(curItem.index){
                        case 0:
                            curItem.runAction(ani("mutiao%02d.png",1,9,0.3))
                        break
                        case 1:
                            curItem.setPosition(curItem.x+15,curItem.y-20)
                            curItem.runAction(ani("kazhi%02d.png",1,8,0.3))
                        break
                        case 2:
                            curItem.setPosition(curItem.x,curItem.y-15)
                            curItem.runAction(ani("tiepian%02d.png",1,9,0.3))
                        break
                        case 3:
                            curItem.runAction(cc.sequence(
                                ani("zuan%02d.png",1,6,0.2),
                                ani("zuan%02d.png",1,6,0.2),
                                ani("zuan%02d.png",1,6,0.2)
                            ))
                        break
                        case 4:
                            curItem.runAction(cc.sequence(
                                ani("ci%02d.png",1,6,0.2),
                                ani("ci%02d.png",1,6,0.2),
                                ani("ci%02d.png",1,6,0.2)
                            ))
                        break
                        case 5:
                            curItem.setPosition(curItem.x,curItem.y-8)
                            curItem.runAction(ani("chi%02d.png",1,6,0.3))
                        break
                    }
                    return true
                }
            })
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
                    if(!item.noMove && rectIntersectsRect(item,curItem)){
                        item.noMove = true
                        item.setPosition(curItem.x+45,curItem.y+105)
                        item.runAction(cc.sequence(
                            ani("zhijia%02d.png",1,14,0.15),
                            cc.callFunc(function(){
                                item.setPositionY(-500)
                            })
                        ))
                        if(curItem.index == 0 || curItem.index == 1){
                            curItem.runAction(cc.sequence(
                                cc.delayTime(1.2),
                                cc.callFunc(function(){
                                    curItem.huahen = createSp("#huahen02.png",cc.p(164,47),curItem)
                                    curItem.huahen.runAction(ani("huahen%02d.png",2,10,0.05))
                                })
                            ))
                        }   
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

        var rectIntersectsRect = function( ra, rb ){
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x-rb.width/2 || maxbx < ra.x-ra.width/2 || maxay < rb.y-rb.height/2 || maxby < ra.y-ra.height/2);
        }

        var btnfun = function(res,res2,pos){
            var btn = new ccui.Button(res,res2)
            btn.setPosition(pos)
            self.addChild(btn)
            return btn
        }

        var cup = self.createDiguan({
            biaoqian:res.biaoqian,
            dgMoveFun:function(data){
                var dg = data.dg
                var digai = data.digai
                if(curItem){
                    if(dg.haveWater && !curItem.over && checkDistance_dg(dg,curItem)){
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
                                if(curItem.index == 4)
                                    pos = cc.p(curItem.width/1.8,curItem.height/3)
                                else if(curItem.index == 3)
                                    pos = cc.p(curItem.width/2,curItem.height/2)
                                curItem.water = createSp(part4_fun[curItem.index].img,pos,curItem)
                                curItem.water.runAction(ani(part4_fun[curItem.index].frame,1,part4_fun[curItem.index].end,0.2))
                            })
                        ))
                    }
                }
            }
        })

        var btnList = []
        btnList[0] = btnfun(res.btn_part1_select,res.btn_part1_normal,cc.p(120,450))
        btnList[1] = btnfun(res.btn_part2_normal,res.btn_part2_select,cc.p(120,350))
        btnList[2] = btnfun(res.btn_part3_normal,res.btn_part3_select,cc.p(120,250))
        btnList[3] = btnfun(res.btn_part4_normal,res.btn_part4_select,cc.p(120,150))
        var curIndex = 0
        for(var i = 0 ; i < 4 ; i++){
            btnList[i].index = i
            btnList[i].addClickEventListener(function(selector,type){
                var btn = selector
                //重置btn的位置，再重新打开
                toolbtn.dataControl.Moving = false
                toolbtn.dataControl.showing = false
                toolbtn.dataControl.toolbg.stopAllActions()
                toolbtn.dataControl.toolbg.setPosition(toolbtn.dataControl.moveModify)
                toolbtn.changeSort()
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
        var fsAni = function(){
            return cc.sequence(createAnimation({
                frame: "diWater%02d.png",
                start:2,
                end: 6,
                time:0.2,
                rever:true,
            }))
        }

        
        var dg = cup.dg
        var btn_fun_1 = function(){
            finger.stopAllActions()
            finger.noMove = false
            finger.setSpriteFrame("zhijia.png")
            finger.setPosition(800,300)
        }
        var btn_fun_2 = function(){
            zhuozi.setPositionY(70)
            shuicao2.setPositionY(210)
            shuimian.setPositionY(250)
            shuicao.setPositionY(210)
        }
        var btn_fun_4 = function(){
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
            hand1.setPositionY(-600)
            hand2.setPositionY(-600)
            finger.setPositionY(-600)
            zhuozi.setPositionY(-600)
            shuicao2.setPositionY(-600)
            shuimian.setPositionY(-600-600)
            shuicao.setPositionY(-600)
            dg.stopAllActions()
            cup.setPositionY(-600)
            if(curItem){
                curItem.forceBack()
                curItem = null
            }
        }

        var inf = [{
                normal:res.btn_part1_normal,select:res.btn_part1_select,
                fun:function(){
                    btn_fun_1()
                }
            },{
                normal:res.btn_part2_normal,select:res.btn_part2_select,
                fun:function(){
                    btn_fun_2()
                }
            },{
                normal:res.btn_part3_normal,select:res.btn_part3_select,
                fun:function(){
                    cc.log("this is part 3")
                }
            },{
                normal:res.btn_part4_normal,select:res.btn_part4_select,
                fun:function(){
                    btn_fun_4()
                }
            }
        ]
        var part4_fun = [{
                img: "#w_zuan01.png",
                frame: "w_zuan%02d.png",
                end: 11,
            },{
                img: "#w_zuan01.png",
                frame: "w_zuan%02d.png",
                end: 11,
            },{
                img: "#w_chi01.png",
                frame: "w_chi%02d.png",
                end: 6,
            },{
                img: "#w_zuan01.png",
                frame: "w_zuan%02d.png",
                end: 11,
            },{
                img: "#w_wa01.png",
                frame: "w_wa%02d.png",
                end: 12,
            },{
                img: "#w_chi01.png",
                frame: "w_chi%02d.png",
                end: 6,
        }]

        //创建表格
        cup.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(function(){
                if (!self.bgg) {
                    loadPlist("tableWz_plist")
                    var bg = createBiaoge({
                        json: res.cldfl_tableNode_json,
                        scale: 0.9,
                        judgeScale: 0.7,
                        downData: {
                            nums: 24,
                            scale: 1.5,
                            bufs: [
                                [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"]
                            ],
                            keys: [
                                1, 2, 1, 1,  1,1,1,1,  2,1,1,2,  2,1,2,1,    2,1,2,2,   2,1,1,2
                            ]
                        },
                    })
                    self.addChild(bg)
                    self.bgg = bg
                    bg.setPositionY(-1000)
                }
            })
        ))
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
        cup.setPosition(300,-600)//300,150
        self.addChild(cup)
        cup.setScale(1.1)
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