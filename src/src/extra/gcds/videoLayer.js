var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    jumpTolayer:"mainLayer",
    ctor: function() {
        this._super();
        var self = this
        var playList = [130,190,255,370,520,595,720,780,880]

        this.mv = ccs.load(res.gcds_videoLayer_json).node
        this.mvac = ccs.load(res.gcds_videoLayer_json).action
        this.addChild(this.mv)

        this.mvac.retain()
        this.mv.mvac = this.mvac
        this.mv.endFrame = 880
        this.mv.initAc = function(){
            this.stopAllActions()
            this.mvac.clearFrameEventCallFunc()
            var endFrame = this.endFrame 
            this.mvac.gotoFrameAndPlay(0,endFrame,false)
            this.mvac.setFrameEventCallFunc(function(frame){
                var index = frame.getFrameIndex()
                switch(index){
                    case playList[0]: playMusic(res.mv_sound1)
                    break
                    case playList[1]: playMusic(res.mv_sound2)
                    break
                    case playList[2]: playMusic(res.mv_sound3)
                    break
                    case playList[3]: playMusic(res.mv_sound4)
                    break
                    case playList[4]: playMusic(res.mv_sound5)
                    break
                    case playList[5]: playMusic(res.mv_sound6)
                    break
                    case playList[6]: playMusic(res.mv_sound7)
                    break
                    case playList[7]: playMusic(res.mv_sound8)
                    break
                    case playList[8]:
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