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
        var mv = ccs.load(res.jdxx_seeExp1_json).node
        var mvac = ccs.load(res.jdxx_seeExp1_json).action
        this.inside_node.addChild(mv)
        var btn_reset = mv.getChildByName("btn_reset")

        self.nodebs.show()
        mvac.retain()
        var playList = [43,72,93,116,255,430,625,780]
        mvac.gotoFrameAndPlay(0,780,false)
        mv.runAction(mvac)

        var sayCallFun = function(){
            mvac.setFrameEventCallFunc(function(frame){
                var index = frame.getFrameIndex()
                switch(index){
                    case playList[0]: self.nodebs.say({key:"see_sound1",force:true})
                    break
                    case playList[1]: self.nodebs.say({key:"see_sound2",force:true})
                    break
                    case playList[2]: self.nodebs.say({key:"see_sound3",force:true})
                    break
                    case playList[3]: self.nodebs.say({key:"see_sound4",force:true})
                    break
                    case playList[4]: self.nodebs.say({key:"see_sound5",force:true})
                    break
                    case playList[5]: self.nodebs.say({key:"see_sound6",force:true})
                    break
                    case playList[6]: self.nodebs.say({key:"see_sound7",force:true})
                    break
                    case playList[7]: 
                    btn_reset.setVisible(true)
                    break
                }
            })
        }
        sayCallFun()

        btn_reset.addClickEventListener(function(){
            if(!btn_reset.isVisible())  return 
            btn_reset.setVisible(false)
            mv.stopAllActions()
            mvac.clearFrameEventCallFunc()
            mvac.gotoFrameAndPlay(0,780,false)
            sayCallFun()
            mv.runAction(mvac)
        })

        var btn_play = new ccui.Button(res.btn_pause_normal,res.btn_play_normal)
        btn_play.setPosition(80,200)
        self.addChild(btn_play)
        btn_play.setScale(0.7)
        btn_reset.setScale(0.7)

        var playFlag = true
        var rePlay = false
        btn_play.addClickEventListener(function(){
            if(playFlag){
                playFlag = false
                btn_play.loadTextures(res.btn_play_normal,res.btn_pause_normal)
                mvac.pause()
                self.nodebs.callPause()
            }else{
                playFlag = true
                btn_play.loadTextures(res.btn_pause_normal,res.btn_play_normal)
                mvac.resume()
                self.nodebs.callResume()
            }
        })

    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see_sound1",sound:res.see_sound1},
            {key:"see_sound2",sound:res.see_sound2},
            {key:"see_sound3",sound:res.see_sound3},
            {key:"see_sound4",sound:res.see_sound4},
            {key:"see_sound5",sound:res.see_sound5},
            {key:"see_sound6",sound:res.see_sound6},
            {key:"see_sound7",sound:res.see_sound7},
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