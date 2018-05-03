var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.clxt_table_json,
                            scale:0.8,
                            inputNum: 5,
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
        return true;
    },

    dataBag:{},

    initUI: function () {
        var self = this
        loadPlist("doChild_plist")
        var uiList = [
               "child","tzq","clock","shi","fen","miao","tip","timeImg"
            ]
        var node = loadNode(res.clxt_doExp1_json,uiList)
        self.inside_node.addChild(node)

        if(IF_SOUND_ON)//重新开始后，音频应该回到最大声
            cc.audioEngine.setMusicVolume(1)

        var btn_control = new ccui.Button(res.btn_run,res.btn_rest)
        btn_control.setPosition(680,470)
        self.addChild(btn_control)
        btn_control.setVisible = false
        btn_control.setLocalZOrder(0)
        var noRun = true  //判断是否在运动
        var curHaveMusic = false  //判断当前是否在播音频
        btn_control.addClickEventListener(function(){
            if(!btn_control.isVisible())  return
            node.tzq.setPosition(750,200)
            node.tip.setOpacity(0)
            tzqEnd = false
            curHaveMusic = false
            stopMusic()
            if(IF_SOUND_ON)
                cc.audioEngine.setMusicVolume(1)
            fdjOut()
            if(noRun){
                noRun = false
                btn_control.loadTextures(res.btn_rest,res.btn_run)
                node.child.stopAllActions()
                node.child.runAction(aniChild("paobu_%02d.png",5,0.15))
                clockPause()
            }else{ //休息
                noRun = true
                btn_control.loadTextures(res.btn_run,res.btn_rest)
                node.child.stopAllActions()
                node.child.runAction(aniChild("chuanqi%02d.png",2,0.2))
                clockResume()
            }
        })

        safeAdd(self,node.tzq)
        var watch = createWatch()
        watch.setPosition(200,250)
        watch.setScale(0.8)
        self.addChild(watch)

        createTouchEvent({
            item:watch,
            begin:function(data){
                var item = data.item
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                item.x += delta.x
                item.y += delta.y  
            }
        })
        //首次提示
        self.nodebs.show()
        node.tip.setOpacity(0)
        node.tip.runAction(cc.sequence(
            cc.fadeIn(1),
            cc.callFunc(function(){
               self.nodebs.say({key:"do_tip1",force:true})
            }),
            cc.delayTime(5),
            cc.fadeOut(1)
        ))

        node.tip.Vis = false//提示框是否可见
        node.tip.oneTip = false //第一次的提示可以关闭
        var tipFadeOut = function(){
            node.tip.stopAllActions()
            node.tip.runAction(cc.fadeOut(1))
            self.nodebs.stopSay()
            node.tip.Vis = false
        }
        var tipFadeIn = function(){
            node.tip.Vis = true
            node.tip.setPosition(500,360)
            node.tip.runAction(cc.sequence(
                cc.fadeIn(1),
                cc.callFunc(function(){
                   self.nodebs.say({key:"do_tip2",force:true})
                }),
                cc.delayTime(5),
                cc.fadeOut(1)
            ))
        }

        //听诊器移动
        var tzqEnd = false
        createTouchEvent({
            item:node.tzq,
            begin:function(data){
                var item = data.item
                if(!node.tip.oneTip){
                    node.tip.oneTip = true
                    safeAdd(self,node.tip)
                    node.tip.setTexture(res.do_tip2)
                    tipFadeOut()
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                item.x += delta.x
                item.y += delta.y
            },
            end:function(data){
                var item = data.item
                if(!tzqEnd && checkDistance(item,node.child)){
                    tzqEnd = true
                    node.tzq.setPositionY(-500)
                    tipFadeIn()
                    fdjIn()
                    if(!noRun){   //处于运动状态
                        node.child.stopAllActions()
                        node.child.runAction(aniChild("chuanqi%02d.png",2,0.2))
                        dataBag.body.runAction(cc.repeatForever(
                            cc.sequence(
                                cc.callFunc(function(){
                                dataBag.body.y = 1
                            }),
                            cc.delayTime(0.3),
                            cc.callFunc(function(){
                                dataBag.body.y = 0
                            }),
                            cc.delayTime(0.3)
                            )))
                    }
                }
                if(!tzqEnd)
                    item.setPosition(750,200)
            }
        })

        node.clock.setOpacity(0)
        var clockResume = function () {
            node.clock.setVisible(true)
            node.clock.setOpacity(0)
            node.miao.setRotation(0)
            node.fen.setRotation(0)
            node.shi.setRotation(0)
            node.timeImg.setVisible(false)
            node.clock.runAction(cc.sequence(
                cc.fadeIn(1.5),
                cc.callFunc(function(){
                    node.miao.runAction(cc.repeatForever(cc.rotateBy(1,360)))
                    node.fen.runAction(cc.rotateTo(3,90))
                    node.shi.runAction(cc.rotateTo(3,10))
                }),
                cc.delayTime(3.03),
                cc.callFunc(function(){
                    node.timeImg.setVisible(true)
                    node.miao.setRotation(0)
                    node.miao.stopAllActions()
                    node.fen.stopAllActions()
                    node.shi.stopAllActions()
                }),
                cc.delayTime(1),
                cc.fadeOut(2),
                cc.callFunc(function(){
                    node.child.stopAllActions()
                    node.child.setTexture(res.child)
                })
            ))
        }
        var clockPause = function(){
            node.clock.stopAllActions()
            node.miao.stopAllActions()
            node.fen.stopAllActions()
            node.shi.stopAllActions()
            node.clock.setVisible(false)
        }
        var dataBag = self.dataBag
        var fdjBig = function(){
            var fdj_sp = new cc.Sprite(res.quan)
            var bigfdj = new cc.ClippingNode(fdj_sp)
            bigfdj.setPosition(-480,280)
            bigfdj.setAlphaThreshold(0)
            var body = new cc.Sprite(res.body)
            bigfdj.addChild(body)
            body.setPosition(0,0)
            var hand = new cc.Sprite(res.hand)
            hand.setPosition(-130,-170)
            bigfdj.addChild(hand)
            self.addChild(bigfdj)
            bigfdj.fdj = new cc.Sprite(res.quan2)
            bigfdj.fdj.setPosition(-480,280)
            self.addChild(bigfdj.fdj)
            bigfdj.fdj.setScale(1.02)
            dataBag.fdj = bigfdj
            dataBag.fdj2 = bigfdj.fdj
            dataBag.hand = hand
            dataBag.body = body
        }
        fdjBig()
        //小孩身体放大镜出现
        var fdjIn = function(){
            dataBag.fdj.setPositionX(480)
            dataBag.fdj2.setPositionX(480)
        }
        //小孩身体放大镜消失
        var fdjOut = function(){
            dataBag.fdj.setPositionX(-480)
            dataBag.fdj2.setPositionX(-480)
            dataBag.body.stopAllActions()
            dataBag.body.setPosition(0,0)
            dataBag.hand.setPosition(-130,-170)
        }
        //移动放大镜中的诊听器
        createTouchEvent({
            item:dataBag.hand,
            rect:cc.rect(dataBag.hand.width/2,dataBag.hand.height/2,dataBag.hand.width/2,dataBag.hand.height/2),
            begin:function(){
                if(node.tip.Vis){
                    tipFadeOut()
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var temp = cc.p(item.x + delta.x , item.y + delta.y)
                if(temp.x > -200 && temp.x < -70 && temp.y > -190 && temp.y < -20){
                    if(!curHaveMusic){//此处需要控制音频只调用一次
                        curHaveMusic = true
                        stopMusic()
                        if(noRun)
                            playMusic(res.heartSlow,true)
                        else if(!noRun)
                            playMusic(res.heartFast,true)
                    }
                    //判断设置按钮里面是否关闭了音频
                    if(IF_SOUND_ON){
                        if(item.x > -150 && item.y > -100 && item.y < -40){
                        if(cc.audioEngine.getMusicVolume() != 1)
                            cc.audioEngine.setMusicVolume(1)
                        }else if(item.y < -130){
                            if(cc.audioEngine.getMusicVolume() != 0)
                                cc.audioEngine.setMusicVolume(0)
                        }else{
                            if(cc.audioEngine.getMusicVolume() != 0.3)
                                cc.audioEngine.setMusicVolume(0.3)
                        }
                    }
                    
                    item.x += delta.x
                    item.y += delta.y
                }
            }
        })


        var checkDistance = function(ra,rb){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 70){
                return true
            }else{
                return false
            }
        }

        var aniChild = function(frame,end,time) {
            return cc.repeatForever(createAnimation({
                frame: frame,
                end: end,
                time: time
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
            {key:"do_tip1",sound:res.do_sound1},
            {key:"do_tip2",sound:res.do_sound2},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
    }
})