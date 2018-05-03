var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        //self.node = do1_node
        self.node = ccs.load(res.zgtyz_doExp1_json).node
        //self.nodeac = ccs.load(res.zgtyz_doExp1_json).action

        self.inside_node.addChild(self.node)
        var playAni = function(){
            var nodeac = ccs.load(res.zgtyz_doExp1_json).action
            nodeac.gotoFrameAndPlay(0,10,false)
            nodeac.setLastFrameCallFunc(function () {
                nodeac.gotoFrameAndPlay(10,480,false)
                self.nodebs.say({key:"do1_tip1",force:true})
                nodeac.setLastFrameCallFunc(function(){
                    nodeac.gotoFrameAndPlay(480,780,false)
                    self.nodebs.say({key:"do1_tip2",force:true})
                    nodeac.setLastFrameCallFunc(function(){
                        nodeac.gotoFrameAndPlay(780,1030,false)
                        self.nodebs.say({key:"do1_tip3",force:true})
                        nodeac.setLastFrameCallFunc(function(){
                            nodeac.gotoFrameAndPlay(1030,1135,false)
                            self.nodebs.say({key:"do1_tip4",force:true})
                            nodeac.setLastFrameCallFunc(function(){
                                nodeac.gotoFrameAndPlay(1135,1265,false)
                                self.nodebs.say({key:"do1_tip5",force:true})
                                nodeac.setLastFrameCallFunc(function(){
                                    nodeac.gotoFrameAndPlay(1265,1465,false)
                                    self.nodebs.say({key:"do1_tip6",force:true})
                                    nodeac.setLastFrameCallFunc(function(){
                                        nodeac.gotoFrameAndPlay(1465,1670,false)
                                        self.nodebs.say({key:"do1_tip7",force:true})
                                        nodeac.setLastFrameCallFunc(function(){
                                            nodeac.gotoFrameAndPlay(1670,1830,false)
                                            self.nodebs.say({key:"do1_tip8",force:true})
                                            nodeac.setLastFrameCallFunc(function(){
                                                //完成
                                                self.nodebs.say({key:"do1_tip9",force:true})
                                                nodeac.pause()
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
            return nodeac
        }
        self.nodeac = playAni()
        self.node.runAction(self.nodeac)
        self.nodeac.pause()
        
        self.runAction(cc.sequence(
            cc.callFunc(function(){
                self.nodebs.show()
            }),
            cc.delayTime(3),
            cc.callFunc(function(){
                //playAni(self.node,self.nodeac)
                self.nodeac.resume()
            })
        ))

        var btn_play = new ccui.Button(res.btn_pause_normal,res.btn_play_normal)
        btn_play.setPosition(80,280)
        self.addChild(btn_play)
        var btn_stop = new ccui.Button(res.btn_stop_normal,res.btn_stop_select)
        btn_stop.setPosition(80,200)
        self.addChild(btn_stop)

        var playFlag = true
        var rePlay = false
        btn_play.addClickEventListener(function(){
            if(playFlag){
                playFlag = false
                btn_play.loadTextures(res.btn_play_normal,res.btn_pause_normal)
                self.nodeac.pause()
                self.nodebs.stopSay()
            }else{
                playFlag = true
                btn_play.loadTextures(res.btn_pause_normal,res.btn_play_normal)
                //判断是否是点击停止后，再次播放的
                if(rePlay){
                    self.nodeac.resume()
                    //playAni(self.node,self.nodeac)
                    rePlay = false
                    return
                }
                self.nodeac.resume()
            }
        })
        btn_stop.addClickEventListener(function(){
            //停止后，移除该帧动画
            self.node.stopAllActions()
            self.node.removeFromParent(true)
            self.node = null
            //从新加载该动画
            self.node = ccs.load(res.zgtyz_doExp1_json).node
            
            self.inside_node.addChild(self.node)
            self.nodeac = playAni()
            self.node.runAction(self.nodeac)
            self.nodeac.pause()
            rePlay = true
            playFlag = false
            //self.nodeac.pause()
            self.nodebs.stopSay()

            btn_play.loadTextures(res.btn_play_normal,res.btn_pause_normal)
        })
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_tip1",sound:res.do1_sound1},
            {key:"do1_tip2",sound:res.do1_sound2},
            {key:"do1_tip3",sound:res.do1_sound3},
            {key:"do1_tip4",sound:res.do1_sound4},
            {key:"do1_tip5",sound:res.do1_sound5},
            {key:"do1_tip6",sound:res.do1_sound6},
            {key:"do1_tip7",sound:res.do1_sound7},
            {key:"do1_tip8",sound:res.do1_sound8},
            {key:"do1_tip9",sound:res.do1_sound9},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
    },
})