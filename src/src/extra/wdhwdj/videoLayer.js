var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();
        var self = this
        var playList = [10,245,452,658,798,891,1440]

        this.mv = ccs.load(res.wdhwdj_startMv).node
        this.mvac = ccs.load(res.wdhwdj_startMv).action
        this.addChild(this.mv)

        
        this.mvac.retain()
        this.mv.mvac = this.mvac
        this.mv.endFrame = 1440
        this.mv.initAc = function(){
            this.stopAllActions()
            this.mvac.clearFrameEventCallFunc()
            var endFrame = this.endFrame 
            this.mvac.gotoFrameAndPlay(0,endFrame,false)
            this.mvac.setFrameEventCallFunc(function(frame){
                var index = frame.getFrameIndex()
                switch(index){
                    case playList[0]: playMusic(res.yd_sound1)//self.nodebs.say({key:"see_tip1",force:true})
                    break
                    case playList[1]: playMusic(res.yd_sound2)//self.nodebs.say({key:"see_tip2",force:true})
                    break
                    case playList[2]: playMusic(res.yd_sound3)//self.nodebs.say({key:"see_tip3",force:true})
                    break
                    case playList[3]: playMusic(res.yd_sound4)//self.nodebs.say({key:"see_tip4",force:true})
                    break
                    case playList[4]: playMusic(res.yd_sound5)//self.nodebs.say({key:"see_tip5",force:true})
                    break
                    case playList[5]: playMusic(res.yd_sound6)//self.nodebs.say({key:"see_tip6",force:true})
                    break
                    case playList[6]:
                        stopMusic()
                        func.changeLayer({
                          out: self,
                          in : layerControl.getLayer(self.jumpTolayer)
                        })
                        getLoopOp(self)
                    break
                }
            })
          this.runAction(this.mvac)
          //this.mvac.pause()
        }

        this.mv.initAc()

        var btn = new ccui.Button(res.img_skip_normal, res.img_skip_select);
        btn.setPosition(1050,40)
        self.addChild(btn);
        btn.addClickEventListener(function(){
            func.changeLayer({
                out: self,
                in : layerControl.getLayer(self.jumpTolayer)
            })
            getLoopOp(self)
        });

        return true
    },

})