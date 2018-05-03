var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
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
                            json: res.rszycdd_tableNode_json,
                            scale:0.9,
                            //judgeScale:0.7,
                            inputNum: 8,
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        });
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var btn_exp1 = new ccui.Button(res.btn_exp1_select,res.btn_exp1_normal)
        btn_exp1.setPosition(100, 450)
        self.addChild(btn_exp1)
        var btn_exp2 = new ccui.Button(res.btn_exp2_normal,res.btn_exp2_select)
        btn_exp2.setPosition(100, 350)
        self.addChild(btn_exp2)

        var judgeFirst = true
        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
            judgeFirst = false
        })
        var removeNode = function(){
            removeTimer("addTimer")
            removeTimer("addTimer2")
            if(self.node){
                self.node.removeFromParent(true)
                self.node = null
            }
            if(self.node2){
                self.node2.removeFromParent(true)
                self.node2 = null
            }
        }
        btn_exp1.addClickEventListener(function(){
            btn_exp2.loadTextures(res.btn_exp2_normal,res.btn_exp2_select)
            btn_exp1.loadTextures(res.btn_exp1_select,res.btn_exp1_normal)
            removeNode()
            exp1()
        })
        btn_exp2.addClickEventListener(function(){
            btn_exp1.loadTextures(res.btn_exp1_normal,res.btn_exp1_select)
            btn_exp2.loadTextures(res.btn_exp2_select,res.btn_exp2_normal)
            removeNode()
            exp2()
        })

        var exp1 = function(){
            var uiList = ["matchA","matchB","matchC","matchD","btn_result"]
            var node = loadNode(res.rszycdd_doExp1_json,uiList)
            self.inside_node.addChild(node)
            self.node = node
            if(!judgeFirst)
                self.nodebs.say({key:"do1_tip1",force:true})
            node.btn_result.addClickEventListener(function(){
                self.nodebs.say({key:"do1_result"})
            })
            var judgeTouch = false //判断提示先挂火柴在点燃酒精灯
            var jjd = createJJD({
                father:node,
                scale:1.3,
                dgFlag:true,
                dgPos:cc.p(150, 70),
                pos:cc.p(430,170),
                judgeBeforeDgFun:function(){
                    if(!judgeTouch) //此处提示说话
                        cc.log("please touch macth")
                }
            })
            jjd.setCanClick(false)
            jjd.setScaleX(-1.3)

            var judgeOver = [false,false,false,false,true]
            var matchPosList = [cc.p(550,120),cc.p(620,120),cc.p(690,120),cc.p(760,120)]
            for(var i = 0 ; i < 4 ; i++){
                node[uiList[i]].index = i
                node[uiList[i]].noMove = false
                node[uiList[i]].over = false
                createTouchEvent({
                    item:node[uiList[i]],
                    begin:function(data){
                        var item = data.item 
                        if(item.noMove)
                            return false
                        item.setRotation(0)
                        return true 
                    },
                    move:function(data){
                        var item = data.item 
                        var delta = data.delta 
                        if(item.x + delta.x > 520 && item.x + delta.x < 795 && item.y + delta.y < 291){
                            item.x += delta.x 
                            item.y += delta.y 
                        }
                    },
                    end:function(data){
                        var item = data.item
                        if(item.y > 280){
                            item.noMove = true
                            judgeOver[4] = true
                            item.setPositionY(290)
                            judgeOver[item.index] = true
                            judgeOverFun()
                        }else{
                            item.setPosition(matchPosList[item.index])
                            item.setRotation(60)
                        } 
                        
                    }
                })
            }

            //此处酒精灯已经点燃，开始烧铁丝 
            var curPosX = 520
            var judgeMatch = true
            jjd.setCallBack({
                up:function(){
                    cc.log("fire up")
                    jjd.setCanClick(false)
                },
                fire:function(){
                    cc.log("fire start addTime")
                    jjd.runAction(cc.sequence(
                        cc.delayTime(1),
                        cc.callFunc(function(){
                            addTimer({
                                fun:function(){
                                    cc.log(curPosX)
                                    curPosX = curPosX + 5
                                    for(var i = 0 ; i < 4 ; i++){
                                        if(node[uiList[i]].x < curPosX && node[uiList[i]].y == 290){
                                            var item = node[uiList[i]]
                                            item.runAction(cc.sequence(
                                                cc.moveTo(0.5,node[uiList[i]].x,120),
                                                //cc.rotateTo(0.3, 90),
                                                cc.callFunc(function(){
                                                    item.over = true
                                                    item.setRotation(curPosX/10 + 30)
                                                    judgeMatch = true
                                                    matchOverFun()
                                                })
                                            ))
                                        }
                                    }
                                },
                                time:0.8,
                                repeat:1000,
                                key:"addTimer"
                            })
                        })
                    ))
                },
                cutFire:function(){
                   cc.log("cut fire")
                   jjd.setCanClick(false)
                }
            })
            

            //判断可以开始点酒精灯
            var judgeOverFun = function(){
                cc.log("over1")
                for(var i = 0 ; i < 4 ; i++){
                    if(!judgeOver[i]){
                        judgeOver[4] = false
                        cc.log("can not")
                    }
                }
                if(judgeOver[4]){
                    //判断说话
                    self.nodebs.say({key:"do1_tip2",force:true})
                    jjd.setCanClick(true)
                    cc.log("can click!")
                    judgeTouch = true
                }
            }

            //判断可以熄灭酒精灯
            var matchOverFun = function(){
                cc.log("matchOver")
                for(var i = 0 ; i < 4 ; i++){
                    if(!node[uiList[i]].over){
                        judgeMatch = false
                        cc.log("match drop")
                    }
                }
                if(judgeMatch){
                    //判断说话,熄灭酒精灯
                    self.nodebs.say({key:"do1_tip6",force:true})
                    jjd.setCanClick(true)
                    removeTimer("addTimer")
                    cc.log("game over!!!")
                }
            }
        }
        exp1()

        var exp2 = function(){
            var uiList = ["hongla","jiaqian","btn_result"]
            var node2 = loadNode(res.rszycdd_doExp1_1_json,uiList)
            self.inside_node.addChild(node2)

            self.nodebs.say({key:"do1_tip3",force:true})
            node2.btn_result.addClickEventListener(function(){
                self.nodebs.say({key:"do1_result"})
            })
            self.node2 = node2
            var jjd = createJJD({
                father:node2,
                //scale:1.3,
                dgFlag:true,
                dgPos:cc.p(170, 50),
                pos:cc.p(240,120),
                judgeBeforeDgFun:function(){
                    //if(!judgeTouch) //此处提示说话
                        cc.log("please touch macth")
                }
            })
            jjd.setCanClick(false)

            jjd.noMove = false
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
                    
                    if(item.x + delta.x < 260 && item.y + delta.y < 190){
                        item.x += delta.x 
                        item.y += delta.y 
                    }else if(item.x + delta.x < 600 && item.y + delta.y > 180){
                        item.x += delta.x
                    }
                },
                end:function(data){
                    var item = data.item
                    if(item.x < 300)
                        item.setPosition(240,120)
                    else if(item.y > 180 && item.x > 300 && item.x < 350)
                        item.setPositionX(350)
                    if(item.x >= 350){
                        //提示说话
                        self.nodebs.say({key:"do1_tip4",force:true})
                        jjd.setCanClick(true)
                        item.noMove = true
                    }
                    
                }
            })

            var changeAnp = 0
            var changePosX = 0
            //创建白色铁片
            var change = function(data){
                var scale = data.scale
                var anchor = data.anchor
                var pos = data.pos
                if(self.clip){
                    self.clip.removeFromParent(true)
                    self.clip = null
                }
                var sp = new cc.Sprite(res.tiepian)
                sp.setAnchorPoint(anchor)
                sp.setPosition(pos)
                var clip = new cc.ClippingNode(sp)
                clip.setAlphaThreshold(0)
                safeAdd(node2.hongla, clip)

                var baila = new cc.Sprite(res.tiepian)
                baila.setAnchorPoint(0,0)
                safeAdd(clip, baila)
                sp.setScale(scale)
                self.clip = clip
            }


            //设置灯盖什么时候可拖动
            jjd.setCallBack({
                up:function(){
                    cc.log("fire up")
                    jjd.setCanClick(false)
                },
                fire:function(){
                    cc.log("fire start")
                    var posX = jjd.x
                    if(posX < 400)
                        posX = 400
                    var pos = cc.p(((posX - 400) / 200) * 208, 19.5)
                    var size = node2.hongla.getContentSize()
                    var anchor = cc.p(pos.x / size.width, 0.5)

                    var sour = 0
                    addTimer({
                        fun:function(){
                            sour+=0.05
                            change({
                                scale:sour,
                                anchor:anchor,
                                pos:pos,
                            })
                            if(sour >=1){
                                removeTimer("addTimer2")
                                //提示关闭酒精灯
                                jjd.setCanClick(true)
                                self.nodebs.say({key:"do1_tip6",force:true})
                            }
                        },
                        time:0.15,
                        repeat:9999,
                        key:"addTimer2"
                    })
                },
                cutFire:function(){
                   cc.log("cut fire")
                   jjd.setCanClick(false)
                }
            })
        }
        //exp2()
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
            {key:"do1_tip3",img:res.do1_tip3,sound:res.do1_sound3},
            {key:"do1_tip4",img:res.do1_tip4,sound:res.do1_sound4},
            {key:"do1_tip6",img:res.do2_tip6,sound:res.do_sound}, //请熄灭酒精灯
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
            key: "do1_result",
            img: res.do1_result,
            sound: res.do1_sound_result,
            id: "result",
        })
    },
})