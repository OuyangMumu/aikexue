var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();
        var self = this
        var playList = [10,131,236,375,468,630,1094,1175]

        this.mv = ccs.load(res.rszycdd_startMv_json).node
        this.mvac = ccs.load(res.rszycdd_startMv_json).action
        this.addChild(this.mv)

        var soundList = [res.startMv_sound1,res.startMv_sound2,res.startMv_sound3,
                        res.startMv_sound4,res.startMv_sound5,res.startMv_sound6,
                        res.startMv_sound7
                        ]
        this.mvac.retain()
        this.mv.mvac = this.mvac
        this.mv.endFrame = 1220
        this.mv.initAc = function(){
            this.stopAllActions()
            this.mvac.clearFrameEventCallFunc()
            var endFrame = this.endFrame 
            this.mvac.gotoFrameAndPlay(0,endFrame,false)
            this.mvac.setFrameEventCallFunc(function(frame){
                var index = frame.getFrameIndex()
                switch(index){
                    case playList[0]: playMusic(soundList[0])
                    break
                    case playList[1]: playMusic(soundList[1])
                    break
                    case playList[2]: playMusic(soundList[2])
                    break
                    case playList[3]: playMusic(soundList[3])
                    break
                    case playList[4]: playMusic(soundList[4])
                    break
                    case playList[5]: playMusic(soundList[5])
                    break
                    case playList[6]: playMusic(soundList[6])
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