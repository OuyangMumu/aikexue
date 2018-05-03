var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();
        var self = this
        var Mv = ccs.load(res.startMv).node
        var MvAc = ccs.load(res.startMv).action
        this.addChild(Mv)
        MvAc.gotoFrameAndPlay(0,425,false)
        MvAc.setFrameEventCallFunc(function(frame){
            var index = frame.getFrameIndex()
            if(index==50){
                playMusic(res.mv1)
            }else if(index==105){
                playMusic(res.mv2)
            }else if(index==220){
                playMusic(res.mv3)
            }else if(index==327){
                playMusic(res.mv4)
            }
        })
        MvAc.setLastFrameCallFunc(function(){
              func.changeLayer({
                    out: self,
                    in : layerControl.getLayer(self.jumpTolayer)
              })
              getLoopOp(self)

             MvAc.clearFrameEventCallFunc()
             MvAc.clearLastFrameCallFunc()
        })
        Mv.runAction(MvAc)

        var skipbtn = new ccui.Button(res.img_skip_normal,res.img_skip_select)
        skipbtn.setPosition(1050,40)
        this.addChild(skipbtn)
        skipbtn.addClickEventListener(function(){
            func.changeLayer({
                out: self,
                in : layerControl.getLayer(self.jumpTolayer)
            })
            getLoopOp(self)
        })
       
        return true
    }
})