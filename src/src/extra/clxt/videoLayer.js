var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();
        var self = this
        self.createVideo();
        return true
    },
    createVideo:function(){
        var self = this
        var yindaosp = ccs.load(res.clxt_startMv_json).node;
        var yindaoac = ccs.load(res.clxt_startMv_json).action;
        this.addChild(yindaosp);
        yindaoac.gotoFrameAndPlay(0,80,false);
        yindaosp.runAction(yindaoac);
        yindaoac.setLastFrameCallFunc(function(){
            playMusic(res.mv_sound1)
            yindaoac.gotoFrameAndPlay(80,155,false);
            yindaoac.setLastFrameCallFunc(function(){
                playMusic(res.mv_sound2)
                yindaoac.gotoFrameAndPlay(155,285,false);
                yindaoac.setLastFrameCallFunc(function() {
                    playMusic(res.mv_sound3)
                    yindaoac.gotoFrameAndPlay(285, 325, false);
                    yindaoac.setLastFrameCallFunc(function(){
                        playMusic(res.mv_sound4)
                        yindaoac.gotoFrameAndPlay(325,573, false);
                        yindaoac.setLastFrameCallFunc(function(){
                            playMusic(res.mv_sound5)
                            yindaoac.gotoFrameAndPlay(573,730, false);
                            yindaoac.setLastFrameCallFunc(function(){
                                stopMusic()
                                func.changeLayer({
                                  out: self,
                                  in : layerControl.getLayer(self.jumpTolayer)
                                })
                                getLoopOp(self)
                            });
                        
                        });
                    });
                });
            });
        });
        
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
    }
})