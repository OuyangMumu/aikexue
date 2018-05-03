var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    loadPlist("tableDraw_plist")
                    if (!self.bgg) {//观察油菜花
                      var bg = createBiaoge({
                          json: res.fdjxdsj_table3_json,
                          //isShowResult: true,
                          scale: 0.9
                      })
                      var that = bg//.getBg()
                      createBgMoveSp({
                        father:that,
                        imgs:[
                            ["#draw_1.png",2],
                            ["#draw_2.png",1],
                            ["#draw_3.png",0],
                        ],
                        pos:cc.p(200,185),
                        dis:220,
                        //itemScale:0.9,
                        resultfather:self,
                        rectlist:[
                           cc.rect(165,320,169,119),
                           cc.rect(395,320,169,119),
                           cc.rect(605,320,169,119)
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
        loadPlist("shuidi_plist")
        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }
        self.nodebs.show(function(){
            self.nodebs.say({key:"do3_tip1"})
        })
        var judgeSay = [true,true,true,true,true]

        var bg = new cc.Sprite(res.do_bg)
        bg.setPosition(cc.p(568,320))
        self.inside_node.addChild(bg)
        var tiejia = createSp(res.tiejia, cc.p(300,150),self)
        var fdj_item = createSp(res.fdj_yan, cc.p(930,320), self)
        fdj_item.setVisible(false)
        var jjd = createJJD({
            father:self,
            scale:1,
            dgFlag:true,
            dgPos:cc.p(170, 50),
            pos:cc.p(290,100),
        })
        jjd.judgeFire = false  //判断酒精灯是否点燃
        jjd.setCallBack({
            fire:function(){
                cc.log("jjd fire")
                jjd.judgeFire = true
                if(curGlass){//判断是否有玻璃片，是否有水
                    if(curGlass.haveWater && !curGlass.over){
                        curGlass.getChildren()[0].runAction(cc.sequence(
                            ani(5,10),
                            cc.callFunc(function(){
                                curGlass.over = true
                                //提示说话
                                if(judgeSay[3]){
                                    judgeSay[3] = false
                                    self.nodebs.say({key:"do3_tip4",force:true})
                                }
                            })
                        ))
                    }
                }
            },
            down:function(){
                cc.log("jjd down")
                jjd.judgeFire = false
            }
        })
        var curDg = null
        var curGlass = null
        var cupPosList = [550,680,810]
        var toolbtn = createTool({
            pos: cc.p(300, 510),
            nums: 5,
            scale:0.7,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.7),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 27),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [999, 1, 1, 1, 1],
            swallow: [true, true, true, true, true],
            files: [res.do3_tools1, res.do3_tools2, res.do3_tools3, res.do3_tools4, res.tools_fdj],
            gets: [res.glass,null,null,null,res.do3_fdj],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index != 0 && index != 4){
                    var cup = self.createDiguan({
                        biaoqian:cupInf[index-1].biaoqian,
                        dgMoveFun:function(data){
                            var dg = data.dg 
                            curDg = dg
                            if(judgeDialog_1()){
                                return
                            }
                            if(dg.haveWater && curGlass && checkDistance_dg(dg,curGlass)){
                                if(curGlass.haveWater){
                                    createDialog(res.do3_dialog3)
                                    return
                                }else if(!curGlass.noMove){
                                    return
                                }
                                
                                curGlass.haveWater = true
                                dg.haveWater = false
                                dg.setPosition(dg.getParent().convertToNodeSpace(cc.p(getWorldPos(curGlass).x+60,getWorldPos(curGlass).y+105)))
                                dg.noMove = true 
                                //滴管滴水和滴水后的一系列操作
                                dg.runAction(cc.sequence(
                                    fsAni(),
                                    cc.callFunc(function(){
                                        fdj_item.setTexture(cupInf[index-1].fdj)
                                        var shuidi = createSp("#shuidi01.png", cc.p(82,32), curGlass)
                                        shuidi.runAction(cc.sequence(
                                            ani(1,4),
                                            cc.callFunc(function(){
                                                //提示说话
                                                if(judgeSay[2] && !jjd.judgeFire){
                                                    judgeSay[2] = false
                                                    self.nodebs.say({key:"do3_tip3",force:true})
                                                }
                                                if(jjd.judgeFire){
                                                    shuidi.runAction(cc.sequence(
                                                        ani(5,12),
                                                        cc.callFunc(function(){
                                                            curGlass.over = true
                                                            if(judgeSay[3]){
                                                                judgeSay[3] = false
                                                                self.nodebs.say({key:"do3_tip4",force:true})
                                                            }
                                                        })
                                                    ))
                                                }
                                            })
                                        ))
                                        dg.noMove = false
                                    })
                                ))
                            }
                        }
                    })
                    cup.setLocalZOrder(20+index*2)
                    return cup
                }
                if(index == 0){
                    if(curGlass)
                        curGlass.forceBack()
                    curGlass = item
                    curGlass.haveWater = false   //判断玻璃片上是否滴有水
                    curGlass.over = false   //判断玻璃片上面水分是否蒸发完
                }
                if(index == 4)
                    item.setLocalZOrder(30)
                    
                return true
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                if(item.noMove)
                    return false
                return true 
            },
            movefun: function(data){
                var item = data.sp 
                var index = data.index
                var delta = data.delta 
                if(item.noMove)  return
                item.x += delta.x 
                item.y += delta.y
                if(index == 0){
                    if(!item.noMove && checkDistance_tj(tiejia,item)){
                        item.noMove = true
                        item.setPosition(tiejia.x,tiejia.y+95)
                        //提示说话
                        if(judgeSay[0]){
                            judgeSay[0] = false
                            self.nodebs.say({key:"do3_tip2",force:true})
                        }
                    }
                }
                if(index == 4){
                    if(curGlass){
                        if(curGlass.over && checkDistance_fdj(item,curGlass)){
                            if(judgeDialog_2())
                                return
                            fdj_item.setVisible(true)
                            //提示说话
                            if(judgeSay[4]){
                                judgeSay[4] = false
                                self.nodebs.say({key:"do3_tip5",force:true})
                            }
                        }else{
                            fdj_item.setVisible(false)
                        }
                    }
                }
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index
                if(index != 0 && index != 4)
                    item.setPosition(cupPosList[index-1],120)
            },
            backfun: function(data){
                var item = data.sp 
                var index = data.index
                if(item.noMove)
                    return false
                if(index == 0){
                    curGlass = null
                }
                return true
            }
        })
        self.inside_node.addChild(toolbtn,1)
        toolbtn.show()
        self.toolbtn = toolbtn

        //判断放大镜在玻璃片上
        var judgeDialog_1 = function(data){
            if(curGlass && self.toolbtn.getindex(4) && curDg){
                if(!curGlass.over && checkDistance_fdj(self.toolbtn.getindex(4),curGlass)
                    && checkDistance_dg(curDg,curGlass)){
                    curDg.setPosition(curDg.getParent().convertToNodeSpace(cc.p(450,curDg.y)))
                    createDialog(res.do3_dialog1)
                    return true
                }
            }else{
                return false
            }
        }
        //判断滴管在玻璃片上
        var judgeDialog_2 = function(data){
            if(curGlass && self.toolbtn.getindex(4) && curDg){
                if(curGlass.over && checkDistance_fdj(self.toolbtn.getindex(4),curGlass)
                    && checkDistance_dg(curDg,curGlass)){
                    self.toolbtn.getindex(4).setPositionX(450)
                    createDialog(res.do3_dialog2)
                    return true
                }
            }else{
                return false
            }
        }

        var checkDistance_tj = function(r1,r2){
            var dx = r1.x - r2.x
            var dy = r1.y+r1.height/2 - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 50)
                return true
            else
                return false
        }
        var checkDistance_fdj = function(r1,r2){
            var dx = r1.x-50 - r2.x
            var dy = r1.y+20 - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 30)
                return true
            else
                return false
        }

        var checkDistance_dg = function(r1,r2,dis){
            var pos = getWorldPos(r1)////cup.convertToWorldSpace(r1.getPosition())
            var dx = pos.x-r1.width/2 - r2.x
            var dy = pos.y-r1.height/2 - r2.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 50)
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
        var ani = function(start,end){
            return cc.sequence(createAnimation({
                frame: "shuidi%02d.png",
                start: start,
                end: end,
                time:0.25,
            }))
        }

        var cupInf = [{
            biaoqian: res.biaoqian1,
            fdj: res.fdj_yan,
        },{
            biaoqian: res.biaoqian2,
            fdj: res.fdj_tang,
        },{
            biaoqian: res.biaoqian3,
            fdj: res.fdj_jian,
        }]

        var createDialog = function(img){
            AddDialog("Tips", {
                res: img,
                face: 2,
                confirmBtn:true,
            })
        }

    },

    createDiguan : function(data){
        var dgMoveFun = data.dgMoveFun
        //var self = data.self
        // var cupImg = data.cupImg  //瓶子图片
        // var fullDg = data.fullDg //滴管有水图片
        // var startDg = data.startDg   //手拿滴管无水
        // var endDg = data.endDg     //手拿滴管有水
        // var xmsImg = data.xmsImg //滴管吸水动画
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
                            dgMoveFun({dg:dg})
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
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,100)
        var addList = [
            {key:"do3_tip1",img:res.do3_tip1,sound:res.do3_sound1},
            {key:"do3_tip2",img:res.do3_tip2,sound:res.do3_sound2},
            {key:"do3_tip3",img:res.do3_tip3,sound:res.do3_sound3},
            {key:"do3_tip4",img:res.do3_tip4,sound:res.do3_sound4},
            {key:"do3_tip5",img:res.do3_tip5,sound:res.do3_sound5},
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