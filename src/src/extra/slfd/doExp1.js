var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super();
        var self = this
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.slfd_tableNode_json,
                            scale:0.9,
                            judgeScale:0.6,
                            downData: {
                                nums: 6,
                                scale:1.3,
                                keys: [1,2,1,2,1,2],
                                bufs: [
                                    [null, res.do_touch1, res.do_touch2],[null, res.do_touch1, res.do_touch2],
                                    [null, res.do_touch1, res.do_touch2],[null, res.do_touch1, res.do_touch2],
                                    [null, res.do_touch1, res.do_touch2],[null, res.do_touch1, res.do_touch2]
                                ],
                            },
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
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("bottle_plist")
        loadPlist("daoshui_plist")
        var uiList = [
            "jiazi","jiazi2","cao","lun","tiejia","cao2"
        ]
        var node = loadNode(res.slfd_doExp1_json, uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var judgeTip = [true,true]
        var sayTip = [true,true,true,true]
        node.cupJudge = [false,false,false]

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        //外部线圈
        // changeFather({
        //     item:node.jiazi2,
        //     father:self
        // })
        node.jiazi2.setLocalZOrder(10)
        var haveCup = false//判断夹子中，是否已有瓶子
        var curCup = null
        var jiazi = node.jiazi
        var jiazi2 = node.jiazi2
        jiazi2.in = true
        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 3,
            scale:0.7,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [1, 1, 99],
            swallow: [true, true, true],
            files: [res.do_tools1, res.do_tools2, res.do_tools3],
            gets: ["#tools_1.png", "#tools_2.png", "#tools_3.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                item.judge = false
                if(index != 2){
                    item.haveWater = false
                    item.index = index
                    item.handh = createSp("#hand_h01.png",cc.p(75,142),item)
                    item.handq = createSp("#hand_q01.png",cc.p(66,155),item)
                    item.handh.setLocalZOrder(-1)
                    item.handh.setVisible(false)
                    item.handq.setVisible(false)
                }
                switch(index){
                    case 0:
                        item.gai = createSp("#gai1.png",cc.p(-10,40),item)
                        item.gai.setVisible(false)
                    break
                    case 1:
                        item.gai = createSp("#gai2.png",cc.p(-10,40),item)
                        item.gai.setVisible(false)
                    break
                }
                return item 
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                var pos = data.pos
                //点击瓶子后，可以显示清除按钮
                if(item.noMove && item.haveWater && !node.jiazi.noMove){
                    if(!judgeTip[1] && item.jian){
                        item.jian.removeFromParent(true)
                        item.jian = null
                    }
                    item.handq.setVisible(false)
                    item.handh.setVisible(false)
                    node.hand.setVisible(true)
                    node.judge = false
                    node.hand.setSpriteFrame("hand1.png")
                    if(item.water)
                        item.water.stopAllActions()
                    if(item.liushui)
                        item.liushui.setScaleY(0)
                    node.lun.stopAllActions()
                    node.tiejia.stopAllActions()
                    btn_clearWater.setVisible(true)
                }
                if(item.onMove)
                    return false
                if(index != 2){
                    item.gai.setVisible(false)
                    if(curCup){
                        if(haveCup && item.y > jiazi.y+125){
                            item.setPosition(jiazi.x - jiazi.width/2 - 70,jiazi.y + 110)
                        }
                    }else{
                        if((item.x > jiazi.x - jiazi.width/2 - 70) && (item.y < jiazi.y+120)){
                            item.setPositionX(jiazi.x - jiazi.width/2 - 75)
                        }
                    }
                    
                }
                return true 
            },
            movefun: function(data){
                var index = data.index
                var item = data.sp
                var delta = data.delta
                if(index != 2){
                    //已经可以放入线圈中
                    if((item.x < jiazi.x - 90) && (item.x > jiazi.x-105) && item.y < jiazi.y+125){
                        if(item.y + delta.y > jiazi.y + 70){//已经移入瓶内
                            item.y += delta.y
                            item.x = jiazi.x-91
                            if(!item.judge){//只判断进入一次
                                jiazi2.in = false
                                changeFather({
                                    item:node.jiazi2,
                                    father:self
                                })
                                item.judge = true
                            }
                            if(sayTip[0]){
                                sayTip[0] = false
                                self.nodebs.say({key:"do_tip2",force:true})
                            }
                            return true
                        }
                    }
                    if(item.y + delta.y < (jiazi.y + 120)){//在线圈的下面
                        if(item.x + delta.x < (jiazi.x - jiazi.width/2 - 50)){
                            item.x += delta.x
                            item.y += delta.y
                        }
                    }else{//在线圈之上
                        if(item.x + delta.x < (jiazi.x - 90)){
                            if(item.judge){
                                curCup = null
                                item.judge = false
                                haveCup = false
                                jiazi2.in = true
                                changeFather({
                                    item:node.jiazi2,
                                    father:node.jiazi,
                                })
                            }
                            if(haveCup)
                                return false
                            item.x += delta.x
                            item.y += delta.y
                        }
                    }
                }else{//倒水
                    if(curCup){
                        if(!item.judge && !curCup.haveWater && rectIntersectsRect(item, curCup)){
                            item.judge = true
                            item.noMove = true
                            curCup.haveWater = true
                            curCup.noMove = true
                            node.jiazi.noMove = true
                            node.hand.setVisible(true)
                            node.hand.setSpriteFrame("hand1.png")
                            if(!curCup.water)
                                curCup.water = createSp("#water.png",cc.p(45,26),curCup)
                            curCup.water.setScale(0)
                            item.setPosition(curCup.x - 170 , curCup.y + 180)
                            item.runAction(cc.sequence(
                                ani("daoshui%02d.png",1,18,0.15),
                                cc.callFunc(function(){
                                    node.jiazi.noMove = false
                                    if(judgeTip[0]){//创建箭头提示
                                        judgeTip[0] = false
                                        node.jiazi.jian1 = createSp("#jiantou2_01.png",cc.p(230,-30),node.jiazi)
                                        node.jiazi.jian2 = createSp("#jiantou2_01.png",cc.p(230,70),node.jiazi)
                                        node.jiazi.jian2.setScaleY(-1)
                                        node.jiazi.jian1.runAction(aniRepeat("jiantou2_%02d.png",7))
                                        node.jiazi.jian2.runAction(aniRepeat("jiantou2_%02d.png",7))
                                    }
                                    if(sayTip[1]){
                                        sayTip[1] = false
                                        self.nodebs.say({key:"do_tip3",force:true})
                                    }
                                    node.cupJudge[curCup.index] = true
                                    if(node.cupJudge[0] && node.cupJudge[1] && !node.cupJudge[2]){
                                        node.cupJudge[2] = true
                                        self.nodebs.say({key:"do_tip5",force:true})
                                    }
                                    item.forceBack()
                                })
                            ))
                            curCup.water.runAction(cc.sequence(
                                cc.delayTime(1),
                                cc.callFunc(function(){
                                    curCup.water.setScale(0.4)
                                    curCup.water.runAction(cc.moveTo(1.5,45,140))
                                }),
                                cc.scaleTo(0.3,1)
                            ))
                        }
                    }

                    if(!item.noMove){
                        item.x += delta.x
                        item.y += delta.y  
                    }
                }
            },
            outfun: function(data){
                var index = data.index
                var item = data.sp
                if(index != 2 && !item.noMove){
                    item.gai.setVisible(true)
                    if(item.judge){//已有瓶子放入铁架中
                        item.gai.setVisible(false)
                        item.setPosition(jiazi.x-91,jiazi.y+72)
                        curCup = item
                        haveCup = true
                    }else{
                        if(checkdistans2(item,jiazi,40)){
                            item.gai.setVisible(false)
                            item.setPosition(jiazi.x-91,jiazi.y+72)
                            curCup = item
                            haveCup = true
                            jiazi2.in = false
                            cc.log("jiazi2 out out")
                            changeFather({
                                item:node.jiazi2,
                                father:self
                            })
                        }
                    }
                }
            },
            backfun: function(){
                return true
            }
        })
        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        node.jiazi.noMove = false
        createTouchEvent({
            item:node.jiazi,
            begin:function(data){
                var item = data.item
                if(node.jiazi.noMove)
                    return false
                if(item.jian1){
                    item.jian1.removeFromParent(true)
                    item.jian2.removeFromParent(true)
                    item.jian1 = null 
                    item.jian2 = null
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(item.y + delta.y > 345 && item.y + delta.y < 500){
                    item.y += delta.y
                    if(!jiazi2.in)
                        jiazi2.y += delta.y
                    if(curCup){
                        curCup.y += delta.y
                        if(!node.hand.isVisible()){
                            if(curCup.liushui && curCup.haveWater){
                                curCup.curScale = (node.jiazi.y - 345) * 18/155 + 22
                                curCup.liushui.setScaleY(curCup.curScale)
                                node.time = (node.jiazi.y - 345) * (-1/150) + 3 - inf[curCup.index].liuTime   
                            }
                        }
                        
                    }
                }               
            },
            end:function(data){
                var item = data.item
                if(sayTip[2]){
                    sayTip[2] = false
                    self.nodebs.say({key:"do_tip4",force:true})
                }
            }
        })

        node.hand = createSp("#hand1.png",cc.p(15,-10),node.jiazi)
        node.hand.setLocalZOrder(-1)
        node.hand.setVisible(false)
        createTouchEvent({
            item:node.hand,
            begin:function(data){
                var item = data.item
                if(curCup){
                    if(item.isVisible() && curCup.haveWater && !node.jiazi.noMove)
                        item.runAction(cc.sequence(
                            cc.callFunc(function(){
                                if(judgeTip[1]){
                                    judgeTip[1] = false
                                    curCup.jian = createSp("#jiantou1_01.png",cc.p(130,-35),curCup)
                                    curCup.jian.runAction(aniRepeat("jiantou1_%02d.png",10))
                                }
                                btn_clearWater.setVisible(false)
                                curCup.handq.setVisible(true)
                                curCup.handh.setVisible(true)
                                curCup.handq.runAction(ani("hand_q%02d.png",1,4,0.08))
                                curCup.handh.runAction(ani("hand_h%02d.png",1,4,0.08))
                                item.setSpriteFrame("hand2.png")
                                if(!curCup.liushui)//创建流水
                                    curCup.liushui = createSp("#liushui.png",cc.p(45,0),curCup)
                                curCup.liushui.setAnchorPoint(0.5,1)
                                //curCup.curScale = (node.jiazi.y - 55 - 210) / 8 * 2.2
                                curCup.curScale = (node.jiazi.y - 345) * 18/155 + 22
                                curCup.liushui.runAction(cc.sequence(
                                    cc.scaleTo(0.3, inf[curCup.index].sceleliu, curCup.curScale),
                                    cc.callFunc(function(){
                                        node.time = (node.jiazi.y - 345) * (-1/150) + 3 - inf[curCup.index].liuTime
                                        lunFun()
                                    })
                                ))
                            }),
                            cc.delayTime(0.2),
                            cc.callFunc(function(){
                                item.setVisible(false)
                            })
                        ))
                        return true
                }
                return false
            }
        })

        node.judge = false //用于判断当前是否有流水

        //轮子开始转动
        var lunFun = function(){
            node.judge = true
            var curtime = 0
            var time = 2
            if(curCup.water.y >= 75){
                curtime = (curCup.water.y - 75) / (65 / (inf[curCup.index].waterTime-2))
                curCup.water.runAction(cc.moveTo(curtime,45,75))
            }else{
                time = (curCup.water.y - 26) / (49 / 2)
            }
            curCup.water.runAction(cc.sequence(
                cc.delayTime(curtime),
                cc.callFunc(function(){
                    curCup.water.runAction(cc.scaleTo(time,0.4,1))
                }),
                cc.moveTo(time,45,26),
                cc.callFunc(function(){
                    curCup.water.setScaleY(0)
                    curCup.liushui.setScale(0)
                    node.tiejia.stopAllActions()
                    node.lun.stopAllActions()
                    curCup.haveWater = false
                    curCup.noMove = false
                    curCup.handq.setVisible(false)
                    curCup.handh.setVisible(false)
                    node.judge = false
                    if(curCup.jian){
                        curCup.jian.removeFromParent(true)
                        curCup.jian = null
                    }
                })
            ))
            jiaziFun()
        }

        var jiaziFun = function(){
            if(node.cao.x < 500)    return false
            node.tiejia.runAction(cc.repeatForever(cc.sequence(
                cc.callFunc(function(){
                    node.lun.stopAllActions()
                    node.lun.runAction(cc.repeatForever(
                        cc.rotateBy(node.time,360)
                    ))
                }),
                cc.delayTime(0.3)
            )))
        }

        var btn_clearWater = new ccui.Button(res.btn_clearWater_1,res.btn_clearWater_2)
        btn_clearWater.setPosition(390,280)
        self.addChild(btn_clearWater)
        btn_clearWater.setVisible(false)
        btn_clearWater.addClickEventListener(function(){
            if(btn_clearWater.isVisible()){
                node.hand.runAction(cc.sequence(
                    cc.callFunc(function(){
                        node.judge = false
                        curCup.noMove = false
                        btn_clearWater.setVisible(false)
                        node.hand.setSpriteFrame("hand2.png")
                        if(curCup.water){
                            curCup.water.removeFromParent(true)
                            curCup.water = null
                        }
                        curCup.haveWater = false
                    }),
                    cc.delayTime(0.2),
                    cc.callFunc(function(){
                        node.hand.setVisible(false)
                    })
                ))

            }
        })

        //移动水槽
        createTouchEvent({
            item:node.cao2,
            begin:function(data){
                var item = data.item
                item.judge = true
                if(judgeOpInPos(data))
                    return true
                return false
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(node.cao.x + delta.x > 440 && node.cao.x + delta.x < 550){
                    node.cao.x += delta.x
                    if(node.judge){
                        if(node.cao.x < 500 && item.judge){
                            node.tiejia.stopAllActions()
                            node.lun.stopAllActions()
                            item.judge = false
                        }else if(node.cao.x >= 500){
                            node.time = (node.cao.x-500) / 50 + (node.jiazi.y - 345) * (-1/150) + 3 - inf[curCup.index].liuTime
                            if(!item.judge)
                                jiaziFun()
                            item.judge = true
                        }
                    }
                    
                }
            }
        })

        var rectIntersectsRect = function( ra, rb ){
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x-rb.width/2 || maxbx < ra.x-ra.width/2 || maxay < rb.y-rb.height/2 || maxby < ra.y-ra.height/2);
        }  

        var checkdistans = function(ra,rb,dis){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= dis)
                return true
            else
                return false
        }

        var checkdistans2 = function(target1, target2, dis) {
            var dx = target1.x - (target2.x - target2.width/3)
            var dy = target1.y - target1.height/2 - (target2.y+10)
            var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
            
            if (distance <= dis)
                return true
            else
                return false
        }

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }
        var aniRepeat = function(frame,end){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                start:1,
                end: end,
                time: 0.08,
            })))
        }

        var inf = [
            {
                sceleliu: 2,
                waterTime: 7,
                liuTime: 0.5,  //多少分钟转动次数
            },
            {
                sceleliu: 1,
                waterTime: 10,
                liuTime: 0,
            }
        ]
    },

    initPeople : function(){
        var self = this
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        this.addList = [
            {key:"do_tip1",img:res.do_tip2,sound:res.do_sound2},
            {key:"do_tip2",img:res.do_tip1,sound:res.do_sound1},
            {key:"do_tip3",img:res.do_tip3,sound:res.do_sound3},
            {key:"do_tip4",img:res.do_tip4,sound:res.do_sound4},
            {key:"do_tip5",img:res.do_tip5,sound:res.do_sound5},
        ]
        for (var i = 0 ; i < self.addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: self.addList[i].key,
                img: self.addList[i].img,
                sound: self.addList[i].sound,
            })
        }
    }
})