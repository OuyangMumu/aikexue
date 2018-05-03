var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();
        var self = this
        var playList = [30,280,351,419,460,533,617,690,180,188,202,211]

        this.mv = ccs.load(res.jdxx_startMv_json).node
        this.mvac = ccs.load(res.jdxx_startMv_json).action
        this.addChild(this.mv)

        
        this.mvac.retain()
        this.mv.mvac = this.mvac
        this.mv.endFrame = 690
        this.mv.initAc = function(){
            this.stopAllActions()
            this.mvac.clearFrameEventCallFunc()
            var endFrame = this.endFrame 
            this.mvac.gotoFrameAndPlay(0,endFrame,false)
            this.mvac.setFrameEventCallFunc(function(frame){
                var index = frame.getFrameIndex()
                switch(index){
                    case playList[0]: playMusic(res.yd_sound1)
                    break
                    case playList[1]: playMusic(res.yd_sound2)
                    break
                    case playList[2]: playMusic(res.yd_sound3)
                    break
                    case playList[3]: playMusic(res.yd_sound4)
                    break
                    case playList[4]: playMusic(res.yd_sound5)
                    break
                    case playList[5]: playMusic(res.yd_sound6)
                    break
                    case playList[6]: playMusic(res.yd_sound7)
                    break
                    case playList[8]: playMusic(res.yd_sound8)
                    break
                    case playList[9]: playMusic(res.yd_sound8)
                    break
                    case playList[10]: playMusic(res.yd_sound8)
                    break
                    case playList[11]: playMusic(res.yd_sound8)
                    break
                    case playList[7]:
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