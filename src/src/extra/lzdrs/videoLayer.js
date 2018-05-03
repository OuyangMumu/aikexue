var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    jumpTolayer:"mainLayer",
    ctor: function() {
        this._super();
        var self = this
        var playList = [180,255,310,355,675,795,1040]

        this.mv = ccs.load(res.lzdrs_startMv_json).node
        this.mvac = ccs.load(res.lzdrs_startMv_json).action
        this.addChild(this.mv)
        var musicList = [res.yd_sound1,res.yd_sound2,res.yd_sound3,
                res.yd_sound4,res.yd_sound5,res.yd_sound6]
        preLoadMusic(musicList)

        
        this.mvac.retain()
        this.mv.mvac = this.mvac
        this.mv.endFrame = 1040
        this.mv.initAc = function(){
            this.stopAllActions()
            this.mvac.clearFrameEventCallFunc()
            var endFrame = this.endFrame 
            this.mvac.gotoFrameAndPlay(0,endFrame,false)
            this.mvac.setFrameEventCallFunc(function(frame){
                var index = frame.getFrameIndex()
                switch(index){
                    case playList[0]: playMusic(musicList[0])
                    break
                    case playList[1]: playMusic(musicList[1])
                    break
                    case playList[2]: playMusic(musicList[2])
                    break
                    case playList[3]: playMusic(musicList[3])
                    break
                    case playList[4]: playMusic(musicList[4])
                    break
                    case playList[5]: playMusic(musicList[5])
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