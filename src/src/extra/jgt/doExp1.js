var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            setZ:999,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if(!self.bgg) {
                        var bg = createBiaoge({
                            json: res.jgt_tableNode_json,
                            scale: 0.9,
                            inputNum:1,
                            downData: {
                                nums: 4,
                                scale: 1.5,
                                bufs: [
                                    [null, res.table_1, res.table_2, res.table_3, res.table_4],
                                    [null, res.table_1, res.table_2, res.table_3, res.table_4],
                                    [null, res.table_1, res.table_2, res.table_3, res.table_4],
                                    [null, res.table_1, res.table_2, res.table_3, res.table_4],
                                ],
                                // keys: [
                                //     1,2,3,4
                                // ]
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
        return true;
    },

    initUI: function () {
        var self = this
        loadPlist("cup_plist")
        loadPlist("daoshui_plist")
        loadPlist("bottle_plist")
        var uiList = [
            "btn_1","btn_2","btn_3","btn_4",
            "btn_fan","ye","zhuo"
        ]
        var node = loadNode(res.jgt_doExp1_json, uiList)
        self.inside_node.addChild(node)

        var judgeSay = [true,true,true]

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var createSp = function(res,pos,father){
            var sp = new cc.Sprite(res)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var yeFun = function(time){
            node.ye.stopAllActions()
            node.ye.runAction(cc.repeatForever(cc.rotateBy(time,360)))
        }

        var curIndex = 0
        var normalList = []
        var selectList = []
        var feng = [0.5,0.4,0.3,0.2]//风速
        for(var i = 0 ; i < 4 ; i++){
            var normal = node[uiList[i]].getChildByName("normal")
            normal.index = i
            var select = node[uiList[i]].getChildByName("select")
            normalList.push(normal)
            selectList.push(select)
            createTouchEvent({
                item: normal,
                begin:function(data){
                    var item = data.item 
                    var index = item.index
                    if(index == curIndex)   return false
                    for(var j = 0 ; j < 4 ; j++){
                        if(index == j){
                            selectList[j].setVisible(true)
                            normalList[j].setVisible(false)
                            curIndex = index
                            yeFun(feng[index])
                            judgeCup()
                        }else{
                            selectList[j].setVisible(false)
                            normalList[j].setVisible(true)
                        }
                    }
                    return true 
                },
                end:function(data){
                    var item = data.item
                    var index = data.item.index
                    if(index == 0){
                        selectList[index].setVisible(false)
                        normalList[index].setVisible(true)
                        if(!curCup.over)
                            node.btn_fan.setVisible(true)
                        if(curCup){
                            if(!curCup.haveGai){
                                node.btn_fan.setVisible(false)
                            }
                        }
                        node.ye.stopAllActions()
                        node.ye.runAction(cc.sequence(
                            cc.rotateBy(1.3,720),
                            cc.rotateBy(1,360),
                            cc.callFunc(function(){
                                node.ye.stopAllActions()
                            })
                        ))
                    }
                }
            })
        }

        var curCup = null
        var curSb = null
        var toolbtn = createTool({
            pos: cc.p(200, 510),
            nums: 2,
            scale:0.8,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -15),
            circlepos: cc.p(0, 17),
            ifcircle: true,
            arrow:true,
            father: self,
            counts: [99, 99],
            swallow: [true, true],
            files: [res.do_tools1, res.do_tools2],
            gets: ["#cup.png","#shaobei.png"],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index == 0){
                    if(curCup){
                        curCup.forceBack(false)
                        curCup = null
                    }
                    item.gai = createSp("#cupGai01.png",cc.p(45,270),item)
                    gaiFun(item.gai)
                    curCup = item
                    node.btn_fan.setVisible(true)
                    item.haveWater = false  //判断瓶子是否有水
                    item.fan = false //判断瓶子是否有翻转
                    item.ok = false  //判断瓶子所放的位置是否正确
                    item.change = false //判断是否换图
                    item.over = false  //判断瓶子是否已经倒了
                }else{
                    if(curSb){
                        curSb.forceBack(false)
                        curSb = null
                    }
                    curSb = item
                }
                return item
            },
            clickfun: function(data){
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(index == 1)  return true
                if(index == 0 && judgeOpInPos({item:item,pos:pos})){
                    item.ok = false
                    if(item.change){//是否已经换图，点击将要换回原图
                        curCup.stopAllActions()
                        curCup.setSpriteFrame("cup.png")
                        //curCup.setPosition(620,225)
                        curCup.setPosition(pos)
                        cupVisible(true)
                        item.change = false
                        item.over = false
                        if(item.haveWater)
                            item.water.setVisible(true)
                        if(item.fan)
                            item.setRotation(180)
                    }
                    return true
                }
                return false
            },
            movefun: function(data){
                var item = data.sp 
                var index = data.index
                var delta = data.delta 
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                }

                if(index == 1 && curCup){//烧杯往瓶子中倒水
                    if(!curCup.haveGai && !curCup.haveWater && checkdistans_3(item,curCup)){
                        curCup.haveWater = true
                        item.setPosition(curCup.x-140,curCup.y+220)
                        item.noMove = true
                        curCup.noMove = true
                        curCup.water = createSp("#water.png",cc.p(44,10),curCup)
                        curCup.water.setName("water")
                        curCup.water.runAction(cc.sequence(
                            cc.delayTime(0.4),
                            cc.moveTo(1,44,70)
                        ))
                        item.runAction(cc.sequence(
                            ani("daoshui%02d.png",1,12,0.15),
                            cc.callFunc(function(){
                                curCup.noMove = false
                                item.removeFromParent(true)
                                curSb = null
                            })
                        ))
                    }
                }
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index
                switch(index){
                    case 0:
                    if(item.gai.in)
                        node.btn_fan.setVisible(true)
                    if(item.haveWater && !item.haveGai)     return false
                    if(checkdistans_2(node.zhuo,item)){
                        item.setPosition(620,225)
                        item.ok = true
                        judgeCup()
                    }
                    break
                    case 1:
                    break
                }
                
            },
            backfun: function(data){
                var item = data.sp 
                var index = data.index
                switch(index){
                    case 0:
                        curCup = null
                        node.btn_fan.setVisible(false)
                    break
                    case 1:
                        curSb = null
                    break
                }
                return true 
            }
        })

        self.inside_node.addChild(toolbtn,1)
        self.toolbtn = toolbtn
        toolbtn.show()

        var judgeCup = function(){
            if(!curCup)  return false  //判断是否有瓶子
            if(!curCup.ok || curCup.over || curCup.gai.out)  return false   //判断位置是否正确
            cupVisible(false)
            if(curCup.change){
                curCup.stopAllActions()
                curCup.setSpriteFrame("cup.png")
                curCup.setPosition(620,225)
            }
            if(curIndex != 0){
                curCup.change = true
                node.btn_fan.setVisible(false)
            }

            switch(curIndex){
                case 0:
                    curCup.setSpriteFrame("cup.png")
                    curCup.setPosition(620,225)
                    cupVisible(true)
                    if(curCup.haveWater)
                        curCup.water.setVisible(true)
                    if(curCup.fan)
                        curCup.gai.setVisible(true)
                    if(!curCup.fan && curCup.haveWater){
                        curCup.gai.setVisible(true)
                    }else if(curCup.fan && curCup.haveWater){
                        curCup.gai.setVisible(true)
                        curCup.setRotation(180)
                    }
                break
                case 1:
                    if(!curCup.fan && !curCup.haveWater){
                        curCup.setPositionX(curCup.x+123)
                        curCup.runAction(cc.repeatForever(ani("bottle1_%02d.png",3,4,0.2)))

                    }else if(curCup.fan && !curCup.haveWater){
                        curCup.setPositionX(curCup.x+105)
                        curCup.setRotation(0)
                        curCup.runAction(cc.sequence(
                            ani("bottle2_%02d.png",2,3,0.2),
                            cc.delayTime(0.1),
                            ani("bottle2_%02d.png",2,3,0.2),
                            cc.delayTime(0.1),
                            ani("bottle2_%02d.png",2,3,0.2),
                            ani("bottle2_%02d.png",3,7,0.2),
                            cc.callFunc(function(){
                                curCup.over = true
                                toSay()
                            })
                        ))
                    }else if(!curCup.fan && curCup.haveWater){
                        curCup.gai.setVisible(true)
                        curCup.water.setVisible(true)
                    }else if(curCup.fan && curCup.haveWater){
                        curCup.setRotation(180)
                        curCup.gai.setVisible(true)
                        curCup.water.setVisible(true)
                    }
                break
                case 2:
                    if(!curCup.fan && !curCup.haveWater){
                        curCup.setPositionX(curCup.x+123)
                        curCup.runAction(cc.sequence(
                            ani("bottle1_%02d.png",3,4,0.2),
                            cc.delayTime(0.1),
                            ani("bottle1_%02d.png",3,4,0.2),
                            cc.delayTime(0.1),
                            ani("bottle1_%02d.png",3,10,0.15),
                            cc.callFunc(function(){
                                curCup.over = true
                                toSay()
                            })
                        ))
                    }else if(curCup.fan && !curCup.haveWater){
                        curCup.setPositionX(curCup.x+105)
                        curCup.setRotation(0)
                        curCup.runAction(cc.sequence(
                            ani("bottle2_%02d.png",2,3,0.115),
                            cc.delayTime(0.1),
                            ani("bottle2_%02d.png",2,3,0.15),
                            cc.delayTime(0.1),
                            ani("bottle2_%02d.png",3,7,0.15),
                            cc.callFunc(function(){
                                curCup.over = true
                                toSay()
                            })
                        ))
                    }else if(!curCup.fan && curCup.haveWater){
                        curCup.gai.setVisible(true)
                        curCup.water.setVisible(true)
                    }else if(curCup.fan && curCup.haveWater){
                        curCup.water.setVisible(false)
                        curCup.setRotation(0)
                        curCup.setPosition(curCup.x+103,curCup.y-5)
                        curCup.runAction(cc.repeatForever(ani("bottle4_%02d.png",2,3,0.15)))
                    }
                break
                case 3:
                    if(!curCup.fan && !curCup.haveWater){
                        curCup.setPositionX(curCup.x+105)
                        curCup.runAction(cc.sequence(
                            ani("bottle1_%02d.png",4,10,0.15),
                            cc.callFunc(function(){
                                curCup.over = true
                                toSay()
                            })
                        ))
                    }else if(curCup.fan && !curCup.haveWater){
                        curCup.setPositionX(curCup.x+123)
                        curCup.setRotation(0)
                        curCup.runAction(cc.sequence(
                            ani("bottle2_%02d.png",3,7,0.15),
                            cc.callFunc(function(){
                                curCup.over = true
                                toSay()
                            })
                        ))
                    }else if(!curCup.fan && curCup.haveWater){
                        curCup.water.setVisible(false)
                        curCup.setPositionY(curCup.y+5)
                        curCup.runAction(cc.repeatForever(ani("bottle3_%02d.png",1,4,0.15)))
                    }else if(curCup.fan && curCup.haveWater){
                        curCup.setPosition(curCup.x+103,curCup.y-5)
                        curCup.water.setVisible(false)
                        curCup.setRotation(0)
                        curCup.runAction(cc.sequence(
                            ani("bottle4_%02d.png",1,3,0.1),
                            ani("bottle4_%02d.png",1,9,0.1),
                            cc.callFunc(function(){
                                curCup.over = true
                                toSay()
                            })
                        ))
                    }
                break
            } 
        }

        //判断说话
        var toSay = function(){
            if(curCup.fan && !curCup.haveWater && judgeSay[0]){
                judgeSay[0] = false
                self.nodebs.say({key:"do_tip2",force:true})
            }
            if(!curCup.fan && !curCup.haveWater && judgeSay[1]){
                judgeSay[1] = false
                self.nodebs.say({key:"do_tip3",force:true})
            }
            if(curCup.fan && curCup.haveWater && judgeSay[2]){
                judgeSay[2] = false
                self.nodebs.say({key:"do_tip4",force:true})
            }
        }

        var gaiFun = function(gai){
            gai.in = true
            gai.out = false
            gai.noMove = false
            gai.getParent().haveGai = true
            createTouchEvent({
                item:gai,
                begin:function(data){
                    var item = data.item
                    if(item.noMove)  return false
                    if(curCup.fan)  return false
                    if(item.in && !curCup.haveWater){
                        node.btn_fan.setVisible(false)
                        item.in = false
                        item.noMove = true
                        item.runAction(cc.sequence(
                            ani("cupGai%02d.png",1,9,0.1),
                            cc.delayTime(0.2),
                            cc.callFunc(function(){
                                item.setPosition(-40,10)
                                item.noMove = false
                                item.out = true
                                item.getParent().haveGai = false
                            })
                        ))
                    }
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    if(item.out){
                        item.x += delta.x
                        item.y += delta.y
                        if(checkdistans(item,cc.p(45,270))){
                            item.noMove = true
                            item.out = false
                            item.getParent().haveGai = true
                            item.setPosition(45,270)
                            item.runAction(cc.sequence(
                                aniRever("cupGai%02d.png",1,9,0.1),
                                cc.callFunc(function(){
                                    item.in = true
                                    item.noMove = false
                                    node.btn_fan.setVisible(true)
                                })
                            ))
                        }
                    }
                },
                end:function(data){
                    var item = data.item
                    if(item.out)
                        item.setPosition(-40,10)
                }
            })
        }

        node.btn_fan.addClickEventListener(function(){
            if(node.btn_fan.isVisible()){
                if(curCup.getRotation() == 0){
                    curCup.fan = true
                    curCup.setRotation(180)
                    if(curCup.haveWater)
                        curCup.getChildByName("water").setPositionY(175)
                }else{
                    curCup.fan = false
                    curCup.setRotation(0)
                    if(curCup.haveWater)
                        curCup.getChildByName("water").setPositionY(70)
                }
            }
        })

        var cupVisible = function(judge){
            // if(curCup.haveWater)
            //     curCup.water.setVisible(judge)
            curCup.gai.setVisible(judge)
        }

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }
        var aniRever = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
                rever:true
            }))
        }

        var checkdistans = function(ra,rb){
            var dx =  ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 40)
                return true
            else
                return false
        }

        var checkdistans_2 = function(ra,rb){
            var dx =  ra.x - rb.x
            var dy = ra.y - (rb.y-rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 100)
                return true
            else
                return false
        }

        var checkdistans_3 = function(ra,rb){
            var dx =  ra.x - rb.x
            var dy = ra.y - (rb.y+rb.height/2)
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance <= 100)
                return true
            else
                return false
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound1},
            {key:"do_tip2",img:res.do_tip2,sound:res.do_sound2},
            {key:"do_tip3",img:res.do_tip3,sound:res.do_sound3},
            {key:"do_tip4",img:res.do_tip4,sound:res.do_sound4},
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