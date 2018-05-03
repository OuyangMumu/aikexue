var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
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
        loadPlist("muxie_plist")
        loadPlist("cup_ds_plist")
        loadPlist("jiaoban_plist")
        var self = this
        var uiList = ["wang","muxie","waterCup","cup","btn_result",
                    "water","jiazi","jiazi2","jiaoban","muxieNode",
                    "liuImg"]
        var node = loadNode(res.rszycdd_doExp2_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })
        node.btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"do2_result"})
        })

        var jjd = createJJD({
            father:node,
            scale:1,
            dgFlag:true,
            dgPos:cc.p(150, 70),
            pos:cc.p(630,210),
            judgeBeforeDgFun:function(){
                //if(!judgeTouch) //此处提示说话
                    cc.log("please touch macth")
            }
        })
        //jjd.setCanClick(false)
        jjd.setLocalZOrder(node.jiazi2.getLocalZOrder()-1)
        node.jiazi.setLocalZOrder(jjd.getLocalZOrder()-1)
        cc.log(node.jiazi2.getLocalZOrder())

        var water = node.water   //在烧杯中的水
        water.haveWater = false  //判断是否倒入了水
        water.over = false   //判断是否可以开始烧水
        node.cup.judgeIn = false  //判断烧杯是否在石棉网上面
        node.wang.over = false
        node.beginPos = 0

        var hot = null//创建热气
        var createHot = function(){
            hot = createWaterAir()
            hot.setPosition(430,320)//430,320
            self.addChild(hot)
            hot.setScale(0)
        }
        //createHot()

        jjd.setCanClick(false)
        jjd.judgeFire = false
        jjd.setCallBack({
            fire:function(){
                cc.log("jjd fire")
                jjd.judgeFire = true
                if(jjd.x < 500)  //判断是否已经放入石棉网下
                    addHot()
            },
            cutFire:function(){
                cc.log("jjd cut fire")
                jjd.judgeFire = false
                cutHot()
                node.muxieNode.removeAllChildren(true)
                node.water.setVisible(true)
                node.liuImg.setVisible(false)
            }
        })
        var curTemp = 20
        var curTime = 0
        //加热调度
        var addHot = function(){
            removeTimer("cutHot")
            curTime = 0
            addTimer({
                fun:function(){
                    cc.log("curTime:",curTime,"curTemp:",curTemp)
                    if(curTemp > 100){
                        curTemp = 100
                        removeTimer("addHot")
                        self.nodebs.say({key:"do2_tip6",force:true})
                    }
                    curTime++
                    curTemp = 130+(curTemp-130)*(Math.pow(14.1/15,curTime))
                    if(curTemp > 90){//出现气泡，气雾越来越大
                        if(!hot)
                            createHot()
                        hot.runAction(cc.scaleTo(10,1))
                    } 
                    //判断添加翻滚动画
                    if(curTemp > 60 && node.muxieNode.getChildrenCount() == 0){
                        node.liuImg.setVisible(true)
                        ani_fanGun()
                    }
                },
                time:4,
                repeat:1000,
                key:"addHot"
            })
        }
        
        //降温调度
        var cutHot = function(){
            removeTimer("addHot")
            curTime = 0
            addTimer({
                fun:function(){
                    cc.log("curTime:",curTime,"curTemp:",curTemp)
                    if(curTemp < 20){
                        curTemp = 20
                        removeTimer("cutHot")
                    }
                    curTime++
                    curTemp = -36+(curTemp+36)*(Math.pow(102/105,curTime))
                    if(curTemp < 30){
                        if(hot)
                            hot.runAction(cc.scaleTo(10,0))
                    }
                },
                time:4,
                repeat:1000,
                key:"cutHot"
            })
        }
        

        jjd.noMove = true 
        //酒精灯的监听
        createTouchEvent({
            item:jjd,
            begin:function(data){
                var item = data.item
                if(item.noMove)
                    return false 
                return true 
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta
                //直线关系 y = 1/2x - 105   x区间[450,630] y区间[120,210]
                if(item.x +delta.x > 448 && item.x +delta.x < 632 &&
                    item.y + delta.y > 118 && item.y + delta.y < 212){
                    item.x += delta.x
                    item.y = 0.5 * item.x - 105
                }
            },
            end:function(data){
                var item = data.item
                if(item.x >= 630){
                    item.setPosition(630, 210)
                    if(jjd.judgeFire){
                        cutHot()
                        node.muxieNode.removeAllChildren(true)
                        node.water.setVisible(true)
                        node.liuImg.setVisible(false)
                    }
                }
                else{
                    item.setPosition(450,120)
                    if(jjd.judgeFire){
                        addHot()
                    }
                }
            }
        })
        for(var i = 0 ; i < 4 ; i++){
            var sp = node[uiList[i]]
            sp.index = i
            sp.noMove = false
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var item = data.item
                    var index = item.index
                    if(item.noMove)
                        return false 
                    cc.log(index)
                    node.beginPos = item.getPosition()
                    if(!water.haveWater && index == 2){
                        cc.log("put muxie")
                        self.nodebs.say({key:"do2_tip3",force:true})
                        return false
                    }
                    return true
                },
                move:function(data){
                    var item = data.item
                    var index = item.index
                    var delta = data.delta 
                    if(!item.noMove){
                        item.x += delta.x
                        item.y += delta.y
                    }
                    
                    //石棉网  木屑   水杯  烧杯
                    if(index == 0){
                        if(checkDistance(item,cc.p(455,260),40)){
                            item.noMove = true 
                            item.setPosition(455, 260)
                            node.wang.over = true
                            self.nodebs.say({key:"do2_tip2",force:true})//提示烧杯放入铁架台上
                        }
                    }else if(index == 1){
                        if(!item.noMove && checkDistance(item, node.cup,100)){
                            self.nodebs.say({key:"do2_tip4",force:true})//提示倒水
                            item.noMove = true 
                            node.cup.noMove = true
                            item.setPosition(node.cup.x-150,node.cup.y)
                            water.runAction(cc.sequence(
                                cc.delayTime(0.7),
                                ani("muxie_sb%02d.png",7,0.5)
                            ))
                            item.runAction(cc.sequence(
                                ani("muxie%02d.png",10,0.4),
                                cc.callFunc(function(){
                                    item.setPositionY(-600)
                                    if(!water.over)
                                        node.cup.noMove = false
                                    water.haveWater = true
                                })
                            ))

                        }
                    }else if(index == 2){ //水杯中的水倒入到烧杯中，然后进行搅拌
                        if(water.haveWater && checkDistance(item, node.cup, 100)){
                            if(node.cup.judgeIn){
                                jjd.noMove = false
                                jjd.setCanClick(true)
                                self.nodebs.say({key:"do2_tip5",force:true}) //提示点燃酒精灯
                            }
                            else if(!node.wang.over)
                                self.nodebs.say({key:"do2_tip1",force:true})  //如果没有放石棉网，就提示放石棉网
                            else
                                self.nodebs.say({key:"do2_tip2",force:true}) //如果没放入石棉网上面，就提示放入
                            item.noMove = true 
                            node.cup.noMove = true 
                            item.setPosition(node.cup.x+100,node.cup.y+70)
                            water.runAction(cc.sequence(
                                cc.delayTime(1),
                                cc.callFunc(function(){
                                    water.setPositionY(35)
                                }),
                                ani("muxie_water%02d.png",8,0.5)
                            ))
                            item.runAction(cc.sequence(
                                ani("cup_ds%02d.png",9,0.4),
                                cc.callFunc(function(){
                                    item.setPositionY(-600)
                                    //倒完后进行搅拌
                                    node.jiaoban.runAction(cc.sequence(
                                        cc.delayTime(0.5),
                                        cc.callFunc(function(){
                                            node.jiaoban.setPosition(node.cup.x + 85,node.cup.y + 80)
                                            water.runAction(cc.sequence(
                                                ani("jiaoban_water%02d.png",12,0.3),
                                                cc.delayTime(0.5),
                                                cc.callFunc(function(){
                                                    if(!water.over)
                                                        node.cup.noMove = false 
                                                    water.over = true
                                                    node.jiaoban.stopAllActions()
                                                    node.jiaoban.setPositionY(-600)
                                                })
                                            ))
                                        }),
                                        ani("jiaoban%02d.png",12,0.2),
                                        ani("jiaoban%02d.png",12,0.2)
                                    ))
                                    
                                })
                            ))
                        }
                    }else if(index == 3){
                        if(node.wang.over && checkDistance(item, cc.p(440,300),80)){
                            if(water.over){
                                jjd.noMove = false
                                jjd.setCanClick(true)
                                self.nodebs.say({key:"do2_tip5",force:true}) //提示点燃酒精灯
                            }else if(!water.haveWater)
                                self.nodebs.say({key:"do2_tip3",force:true}) //如果没木屑，就提示开始倒入木屑
                            else 
                                self.nodebs.say({key:"do2_tip4",force:true})  //提示倒入水
                            item.noMove = true
                            item.setPosition(440, 300)
                            node.cup.judgeIn = true
                        }
                    }
                        
                },
                end:function(data){
                    var item = data.item
                    var index = item.index
                    if(!item.noMove)
                        item.setPosition(node.beginPos)
                }
            })
        }

        var ani = function(frame,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start:1,
                end: end,
                time:time
            }))
        }

        var aniRepeat = function() {
            return cc.repeatForever(createAnimation({
                frame: "jiaoban%02d.png",
                start:1,
                end: 12,
                time:0.1
            }))
        }

        var checkDistance = function(ra, rb , dis){
            var dx = ra.x - rb.x 
            var dy = ra.y - rb.y 
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < dis){
                return true 
            }else{
                return false 
            }
        }

        //创建木屑翻滚
        var ani_fanGun = function(){
            node.water.setVisible(false)
            node.muxieNode.removeAllChildren(true)
            var muxieAni = ccs.load(res.muxieAni_json).node
            var muxieAniAction = ccs.load(res.muxieAni_json).action
            node.muxieNode.addChild(muxieAni)
            muxieAniAction.gotoFrameAndPlay(0,15,true)
            muxieAni.runAction(muxieAniAction)
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do2_tip1",img:res.do2_tip1,sound:res.do2_sound1},
            {key:"do2_tip2",img:res.do2_tip2,sound:res.do2_sound2},
            {key:"do2_tip3",img:res.do2_tip3,sound:res.do2_sound3},
            {key:"do2_tip4",img:res.do2_tip4,sound:res.do2_sound4},
            {key:"do2_tip5",img:res.do2_tip5,sound:res.do2_sound5},
            {key:"do2_tip6",img:res.do2_tip6,sound:res.do_sound}, //请熄灭酒精灯
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
            key: "do2_result",
            img: res.do2_result,
            sound: res.do2_sound_result,
            id: "result",
        })
    },
})