var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();
        var self = this;
        var yindaosp = ccs.load(res.startMV).node;
        var yindaoac = ccs.load(res.startMV).action;
        this.addChild(yindaosp);
        yindaoac.gotoFrameAndPlay(0,97,false);
        yindaosp.runAction(yindaoac);
        yindaoac.setLastFrameCallFunc(function(){
            playMusic(res.anainai);
            yindaoac.gotoFrameAndPlay(97,172,false);
            yindaoac.setLastFrameCallFunc(function(){
                playMusic(res.zhennainai);
                yindaoac.gotoFrameAndPlay(172,228,false);
                yindaoac.setLastFrameCallFunc(function() {
                    playMusic(res.nainaibie);
                    yindaoac.gotoFrameAndPlay(228, 436, false);
                    yindaoac.setLastFrameCallFunc(function(){
                        playMusic(res.nizhenbang);
                        yindaoac.gotoFrameAndPlay(436,480, false);
                        yindaoac.setLastFrameCallFunc(function(){
                            stopMusic();
                            yindaoac.gotoFrameAndPlay(436,520, false);
                            yindaoac.setLastFrameCallFunc(function(){
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

        var skipbtn = ccui.helper.seekWidgetByName(yindaosp,"skipbtn");
        skipbtn.addClickEventListener(function(){
                func.changeLayer({
                    out: self,
                    in : layerControl.getLayer(self.jumpTolayer)
                })
                getLoopOp(self)
        });
       
        return true
    }
})