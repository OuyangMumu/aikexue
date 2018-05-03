var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    jumpTolayer:"mainLayer",
    ctor: function() {
        this._super();
        var self = this
        var playList = [90,580,700]

        this.mv = ccs.load(res.xczzyyd_videoLayer_json).node
        this.mvac = ccs.load(res.xczzyyd_videoLayer_json).action
        this.addChild(this.mv)

        this.mvac.retain()
        this.mv.mvac = this.mvac
        this.mv.endFrame = 700
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
                    case playList[2]:
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