var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        loadPlist("di_plist")
        loadPlist("dianjiu_plist")
        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })

        var btn_result = new ccui.Button("res/btn/btn_jielun_normal.png","res/btn/btn_jielun_select.png")
        btn_result.setPosition(1060,460)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"do1_tip3"})
        })
        self.curItem = null //当前物品
        self.haveItem = false  //是否可以拖动
        self.createTool()

        var checkDistance = function(ra,rb){
            var dx = (ra.x-ra.width/2) - rb.x
            var dy = (ra.y-ra.height/2) - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 150){
                return true
            }else{
                return false
            }
        }

        var dianjiuAni = function(){
            return cc.sequence(createAnimation({
                frame: "dianjiu%02d.png",
                start:1,
                end: 15,
                time:0.4
            }))
        }
        var fdjAni = function(){
            return cc.sequence(createAnimation({
                frame: "diWater%02d.png",
                start:2,
                end: 9,
                time:0.2,
                rever:true,
            }))
        }

        var judgeOver = [false,false,false]
        var dgPosList = [cc.p(550,310),cc.p(540,430),cc.p(540,390)]
        self.createDiguan({
            self:self,
            cupImg:"#waterCup.png",
            fullDg:"diWater10.png",
            startDg:"diWater01.png",
            endDg:"diWater09.png",
            xmsImg:"diWater%02d.png",
            cupPos:cc.p(850,100),
            dgMoveFun:function(data){
                var dg = data.dg
                var digai = data.digai
                var cup = data.cup
                if(self.haveItem){

                    if(dg.haveWater && checkDistance(dg, self.curItem)){
                        dg.noMove = true
                        dg.haveWater = false
                        dg.runAction(cc.sequence(
                            cc.moveTo(0.2,dgPosList[self.curItem.index]),
                            cc.callFunc(function(){
                                self.curItem.spot.runAction(dianjiuAni())
                            }),
                            fdjAni(),
                            cc.callFunc(function(){
                                dg.noMove = false
                                self.haveItem = false
                                judgeOver[self.curItem.index] = true
                                if(judgeOver[0] && judgeOver[1] && judgeOver[2])
                                    self.nodebs.say({key:"do1_tip2",force:true})
                            })
                        ))
                    }

                }
                
            }
        })
        
    },

    createTool:function(){
        var self = this
        var itemPosList = [cc.p(450,100),cc.p(470,140),cc.p(440,140)]
        var spotPosList = [cc.p(190,110),cc.p(170,260),cc.p(170,190)]
        var spotScaleList = [1.3,0.9,1]

        var toolbtn = createTool({
            pos: cc.p(350, 540),
            nums: 3,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [1, 1, 1],
            swallow: [true, true, true],
            files: [res.do1_tools1, res.do1_tools2, res.do1_tools3],
            gets: [res.do1_item1,res.do1_item2,res.do1_item3],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(!self.haveItem){
                    if(self.curItem)
                        self.curItem.setPositionY(-600)
                    item.index = index
                    self.curItem = null
                    self.curItem = item
                    self.haveItem = true
                    item.spot = new cc.Sprite("#dianjiu01.png")
                    item.spot.setPosition(spotPosList[index])
                    item.addChild(item.spot)
                    item.spot.setScale(spotScaleList[index])
                    return item
                }   
                else
                    return false
            },
            clickfun : function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                
                if(item.noMove)
                    return false
                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                 }
            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                item.setPosition(itemPosList[index])
                item.noMove = true
            },
            backfun:function(data){
                var item = data.sp
                var index = data.index
                item.setPosition(itemPosList[index])
                item.noMove = true
                return false
            }
        });
        this.addChild(toolbtn)
        toolbtn.show()
        self.toolbtn = toolbtn
    },

    createDiguan : function(data){
        var dgMoveFun = data.dgMoveFun
        var self = data.self
        var cupImg = data.cupImg  //瓶子图片
        var fullDg = data.fullDg //无手拿着吸满
        var startDg = data.startDg   //无手 滴管无水
        var endDg = data.endDg     //有手滴管有水
        var xmsImg = data.xmsImg //滴管吸水动画
        var cupPos = data.cupPos

        var cup = new cc.Sprite(cupImg)
        cup.setPosition(cupPos)
        self.addChild(cup,10)
        var dg = new cc.Sprite("#diWater01.png")
        dg.setPosition(cup.x+80,cup.y+100)
        self.addChild(dg,9)
        var digai = new cc.Sprite("#digai.png")
        digai.setPosition(cup.x,cup.y+155)
        self.addChild(digai,10)
        digai.setVisible(false)

        digai.digai = true
        dg.dg = true
        dg.dgOut = false  //判断滴管是否出了瓶子
        dg.haveWater = false //判断滴管是否有水
        dg.dgMove = true  //判断滴管在瓶内不能移动
        dg.noMove = false //判断滴管不能移动
        digai.noMove = false
        dg.cup = cup
        dg.di = digai

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
                    if(target.digai) {
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
                        if((digai.y+delta.y > cup.y+154) || !dg.dgMove){
                            digai.y += delta.y
                            dg.y += delta.y
                            if (digai.y > cup.y+265)
                                dg.dgOut = true
                        }
                            
                    }else if(dg.dgOut && !dg.noMove){
                        digai.y += delta.y
                        digai.x += delta.x
                        dg.y += delta.y
                        dg.x += delta.x
                        //自定义滴管移动方法
                        if(dgMoveFun)
                            dgMoveFun({dg:dg})
                    }
                }

                if(target.dg && dg.dgOut && !dg.noMove){
                    dg.x += delta.x
                    dg.y += delta.y
                    if(dg.dgOut && checkDistance(dg,cup)) {
                        digai.setPosition(cup.x,cup.y+155)
                        dg.setPosition(cup.x+80,cup.y+100)
                        dg.dgOut = false
                        if(!dg.haveWater)
                            dg.setSpriteFrame("diWater01.png")
                        else if(dg.haveWater)
                            dg.setSpriteFrame(fullDg)
                    }

                    //自定义滴管移动方法
                    if(dgMoveFun)
                        dgMoveFun({
                            dg:dg,
                        })
                }
            },
            onTouchEnded: function(touch, event) {
                var target = event.getCurrentTarget()
                if(target.digai){
                    if(!dg.dgOut){
                        digai.setPosition(cup.x,cup.y+155)
                        dg.setPosition(cup.x+80,cup.y+100)
                        if(dg.haveWater)
                            dg.setSpriteFrame(fullDg)
                        else
                            dg.setSpriteFrame(startDg)
                        digai.noMove = false
                     }else if(dg.dgOut) {
                        digai.setPosition(cc.p(cup.x,cup.y+155))
                        digai.noMove = true
                    }
                }else if(target.dg){
                    
                }
            }
        })
        cc.eventManager.addListener(listener, digai)
        cc.eventManager.addListener(listener.clone(), dg)

        var anixms = function() {
            return cc.sequence(createAnimation({
                frame: xmsImg,
                start:2,
                end: 9,
                time:0.01
            }), cc.callFunc(function() {
                dg.dgMove = true
                dg.haveWater = true
                digai.noMove = false
            }))
        }

        var checkDistance = function(ra,rb){
            var dx = (ra.x-ra.width/2) - rb.x
            var dy = (ra.y-ra.height/2) - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 50){
                return true
            }else{
                return false
            }
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
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
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
            key: "do1_tip3",
            img: res.do1_tip3,
            sound: res.do1_sound3,
            id: "result",
        })
    },

})