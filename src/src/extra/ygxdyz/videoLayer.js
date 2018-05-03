var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    jumpTolayer:"mainLayer",
    ctor: function() {
        this._super();
        var self = this
        var playList = [35,230,535,640]

        this.mv = ccs.load(res.ygxdyz_startMv_json).node
        this.mvac = ccs.load(res.ygxdyz_startMv_json).action
        this.addChild(this.mv)
        var music = [res.yd_sound1,res.yd_sound2,res.yd_sound3]
        preLoadMusic(music)

        
        this.mvac.retain()
        this.mv.mvac = this.mvac
        this.mv.endFrame = 640
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
                    case playList[3]:
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