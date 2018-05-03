var biaoge = null
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    myDelete: function() { //删除时调用
        var self = this
        this._super()
        if(self.biaoge){
            self.biaoge.removeFromParent(false)
        }
    },
    ctor: function () {
        this._super();
        var self = this
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!biaoge){
                        var bg = createBiaoge({
                            json: res.shsyydbj_tableNode_json,
                            scale:0.9,
                            inputNum: 3,
                        })
                        biaoge = bg
                        biaoge.retain()
                    }
                    safeAdd(self, biaoge)
                    self.biaoge = biaoge
                    biaoge.show()
                },
            }
        });
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        loadPlist("di_plist")
        loadPlist("lou_plist")
        var uiList = ["glass1","glass2","soildi","waterdi","big_soildi","big_waterdi",
                    "louSoil","louWater","wenzi"
        ]
        var node = loadNode(res.shsyydbj_do1_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })

        var glass2 = node.glass2
        glass2.soil = true
        glass2.water = true
        glass2.first = true
        var glass1 = node.glass1
        glass1.soil = true
        glass1.water = true 
        glass1.first = true //判断是否第一次滴，第一次滴需要在左边滴
        var judgeList = [null,false,false,false,false]  //用于判断当前已经滴完 1,2 为油的，3,4为水的
        
       
        //油
        self.createDiguan({
            self:self,
            cupImg:"#soilCup.png",
            fullDg:"dgSoil.png",
            startDg:"diSoil01.png",
            endDg:"diSoil06.png",
            xmsImg:"diSoil%02d.png",
            cupPos:cc.p(700,130),
            dgMoveFun:function(data){
                var dg = data.dg
                var digai = data.digai
                var cup = data.cup
                dg.soil = true
                dg.water = false
                if(glass2.soil && rectContainsPoint(glass2,dg)){
                     if(!judgeList[3])
                        glass2.ani = anifsoil(6,8)
                    else
                        glass2.ani = anifsoil(8,10)
                    judeList_soil()
                    glass2.soil = false
                    glass2Fun(dg, glass2, node.soildi, node.big_soildi,glass2.ani,1.5)
                    
                }
                if(glass1.soil && rectContainsPoint2(glass1,dg)){
                     if(!judgeList[3])
                        glass1.ani = anifsoil(6,8)
                    else
                        glass1.ani = anifsoil(8,10)
                    judeList_soil()
                    glass1.soil = false
                    glassFun(dg, glass1, node.louSoil,glass1.ani,anilouSoil())
                }
            }
        })
        //水
        self.createDiguan({
            self:self,
            cupImg:"#waterCup.png",
            fullDg:"dgWater.png",
            startDg:"diWater01.png",
            endDg:"diWater06.png",
            xmsImg:"diWater%02d.png",
            cupPos:cc.p(820,130),
            dgMoveFun:function(data){
                var dg = data.dg
                var digai = data.digai
                var cup = data.cup
                dg.water = true
                dg.soil = false
                if(glass2.water && rectContainsPoint(glass2,dg)){
                    if(!judgeList[1])
                        glass2.ani = anifwater(6,8)
                    else
                        glass2.ani = anifwater(8,10)
                    judeList_water()
                    glass2.water = false
                    glass2Fun(dg, glass2, node.waterdi, node.big_waterdi,glass2.ani,1)
                }
                if(glass1.water && rectContainsPoint2(glass1,dg)){
                    if(!judgeList[1])
                        glass1.ani = anifwater(6,8)
                    else
                        glass1.ani = anifwater(8,10)
                    judeList_water()
                    glass1.water = false
                    glassFun(dg, glass1, node.louWater,glass1.ani,anilouWater())
                }
            }
        })
        
        var judeList_soil = function(){
            if(!judgeList[3])
                judgeList[3] = true
            else
                judgeList[4] = true
        }
        var judeList_water = function(){
            if(!judgeList[1])
                judgeList[1] = true
            else
                judgeList[2] = true
        }

        //滴管与左边的玻璃事件
        var glassFun = function(dg,glass,lou,anifms,anilou){
            dg.noMove = true
            if(glass.first)
                dg.setPosition(glass.x+100,400)
            else
                dg.setPosition(glass.x,400)
            dg.runAction(cc.sequence(
                anifms,
                cc.callFunc(function(){
                    if(glass.first){
                        glass.first = false
                        lou.setPosition(260,190)
                    }else
                        lou.setPosition(160,190)
                    lou.runAction(cc.sequence(
                        anilou,
                        cc.callFunc(function(){
                            dg.noMove = false
                            judgeOver(dg)
                        })
                    ))
                })
            ))
        }
        //滴管与右边的玻璃事件
        var glass2Fun = function(dg,glass2,di,big_di,anifms,myscale){
            dg.noMove = true
            if(glass2.first)
                dg.setPosition(glass2.x+100,glass2.y+140)
            else
                dg.setPosition(glass2.x+10,glass2.y+140)
            dg.runAction(cc.sequence(
                anifms,
                cc.callFunc(function(){
                    if(glass2.first){
                        glass2.first = false
                        di.setPosition(550,105)
                    }else
                        di.setPosition(460,105)
                    di.runAction(cc.sequence(
                        cc.scaleTo(0.5,myscale),
                        cc.delayTime(0.3),
                        cc.callFunc(function(){
                            big_di.setPosition(di.x-10,55)
                            dg.noMove = false
                            judgeOver(dg)
                        })
                    ))
                })
            ))
        }
        //判断是否完成
        var judgeOver = function(dg){
            if(judgeList[1] && judgeList[2] && dg.water){
                dg.di.digai = false
                dg.dg = false
                dg.setPosition(dg.cup.x+60,dg.cup.y+70)
                dg.setSpriteFrame("dg.png")
            }

            if(judgeList[3] && judgeList[4] && dg.soil){
                dg.di.digai = false
                dg.dg = false
                dg.setPosition(dg.cup.x+60,dg.cup.y+70)
                dg.setSpriteFrame("dg.png")
            }
            if(judgeList[1] && judgeList[2] && judgeList[3] && judgeList[4]){
                judgeList[1] = false
                dg.runAction(cc.sequence(
                    cc.delayTime(2),
                    cc.callFunc(function(){
                        node.wenzi.setVisible(true)
                        self.nodebs.say({key:"do1_tip2",force:true})
                    })
                ))
                
            }
        }
        var anifsoil = function(start,end) {
            return cc.sequence(createAnimation({
                frame: "diSoil%02d.png",
                start:start,
                end: end,
                time:0.15
            }))
        }
        var anifwater = function(start,end) {
            return cc.sequence(createAnimation({
                frame: "diWater%02d.png",
                start:start,
                end: end,
                time:0.15
            }))
        }
        var anilouSoil = function() {
            var aniSoil = cc.sequence(createAnimation({
                frame: "louSoil%02d.png",
                end: 15,
                time:0.25
            }))
            aniSoil.retain()
            return aniSoil
        }
        var anilouWater = function() {
            var aniWater = cc.sequence(createAnimation({
                frame: "louWater%02d.png",
                end: 8,
                time:0.25
            }))
            aniWater.retain()
            return aniWater
        }

        //检测是否与左边的玻璃相接触
        var rectContainsPoint = function (rect, point) {
            if (point.x-point.width/2+10 >= rect.x - rect.width/2 && point.x-point.width/2+10 <= rect.x + rect.width/2 &&
                point.y-point.height/2 >= rect.y - rect.height/2 && point.y-point.height/2 <= rect.y + rect.height/2) {
                return true
            }
            return false
        }
        //检测是否与右边的玻璃相接触
        var rectContainsPoint2 = function (rect, point) {
            if (point.x-point.width/2+10 >= rect.x - rect.width/2 && point.x-point.width/2+10 <= rect.x + rect.width/2 &&
                point.y-point.height/2 >= rect.y && point.y-point.height/2 <= rect.y + rect.height) {
                return true
            }
            return false
        }

    },

    createDiguan : function(data){
        var dgMoveFun = data.dgMoveFun
        var self = data.self
        var cupImg = data.cupImg  //瓶子图片
        var fullDg = data.fullDg //滴管有水图片
        var startDg = data.startDg   //手拿滴管无水
        var endDg = data.endDg     //手拿滴管有水
        var xmsImg = data.xmsImg //滴管吸水动画
        var cupPos = data.cupPos

        var cup = new cc.Sprite(cupImg)
        cup.setPosition(cupPos)
        self.addChild(cup,10)
        var dg = new cc.Sprite("#dg.png")
        dg.setPosition(cup.x+60,cup.y+70)
        self.addChild(dg)
        var digai = new cc.Sprite("#digai.png")
        digai.setPosition(cup.x,cup.y+100)
        self.addChild(digai)
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
                        if (digai.y < cup.y+97 || !dg.dgMove)   return
                            digai.y += delta.y
                            dg.y += delta.y
                            if (digai.y > cup.y+170)
                                dg.dgOut = true
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
                        digai.setPosition(cup.x,cup.y+100)
                        dg.setPosition(cup.x+60,cup.y+70)
                        dg.dgOut = false
                        if(!dg.haveWater)
                            dg.setSpriteFrame("dg.png")
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
                        digai.setPosition(cup.x,cup.y+100)
                        dg.setPosition(cup.x+60,cup.y+70)
                        if(dg.haveWater)
                            dg.setSpriteFrame(fullDg)
                        else
                            dg.setSpriteFrame(startDg)
                        digai.noMove = false
                     }else if(dg.dgOut) {
                        digai.setPosition(cc.p(cup.x,cup.y+100))
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
            var dx = (ra.x-ra.width/2-10) - rb.x
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
        
        addContent({
            people: this.nodebs,
            key: "do1_tip1",
            img: res.do1_tip1,
            sound: res.do1_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "do1_tip2",
            sound: res.do1_sound2,
        })
    },
})