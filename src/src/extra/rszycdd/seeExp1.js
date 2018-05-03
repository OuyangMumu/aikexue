var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this 
        var mv = ccs.load(res.rszycdd_seeExp1_json).node
        var mvac = ccs.load(res.rszycdd_seeExp1_json).action
        this.inside_node.addChild(mv)

        self.nodebs.show(function(){
            self.nodebs.say({key:"see_sound1"})
        })
        mvac.retain()
        var beimian = mv.getChildByName("bg").getChildByName("beimian")
        var tip = mv.getChildByName("tip")

        //创建热气
        var hot = createWaterAir()
        hot.setPosition(20,-15)
        hot.setScale(0.6)
        beimian.addChild(hot)

        var btn_zhong = mv.getChildByName("btn_zhong")
        var btn_wei = mv.getChildByName("btn_wei")
        var judgeOver  = [false,false,true]
        btn_zhong.addClickEventListener(function(){
            mv.stopAllActions()
            mvac.clearFrameEventCallFunc()
            mvac.gotoFrameAndPlay(0,120,false)
            sayCallFun()
            mvac.setLastFrameCallFunc(function(){
                mvac.clearLastFrameCallFunc()
                mvac.gotoFrameAndPlay(120,165,false)
                mvac.setLastFrameCallFunc(function(){
                    mvac.gotoFrameAndPlay(165,170,true)
                })   
            })
            mv.runAction(mvac)
        })

        btn_wei.addClickEventListener(function(){
            mv.stopAllActions()
            mvac.clearFrameEventCallFunc()
            mvac.gotoFrameAndPlay(0,120,false)
            sayCallFun()
            mvac.setLastFrameCallFunc(function(){
                mvac.gotoFrameAndPlay(176,185,false)
                mvac.clearLastFrameCallFunc()
            })
            mv.runAction(mvac)
        })

        var sayCallFun = function(){
            mvac.setFrameEventCallFunc(function(frame){
                var index = frame.getFrameIndex()
                switch(index){
                    case 135: playMusic(res.see_sound3)
                    break
                    case 179: playMusic(res.see_sound4)
                    break
                    case 164: 
                    judgeOver[0] = true
                    judgeFun()
                    break
                    case 180: 
                    judgeOver[1] = true
                    judgeFun()
                    break
                }
            })
        }

        var judgeFun = function(){
            if(judgeOver[0] && judgeOver[1] && judgeOver[2]){
                judgeOver[2] = false
                tip.setTexture(res.see_tip2)
                tip.runAction(cc.sequence(
                    cc.delayTime(2),
                    cc.callFunc(function(){
                        self.nodebs.say({key:"see_sound2"})
                    })
                ))
                
            }
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see_sound1",sound:res.see_sound1},
            {key:"see_sound2",sound:res.see_sound2},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
            people: this.nodebs,
            key: addList[i].key,
            sound: addList[i].sound,
            })
        }
    }
})