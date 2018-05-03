var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();

        var self = this
        var Mv = ccs.load(res.cartoonJson).node
        var MvAc = ccs.load(res.cartoonJson).action
        this.addChild(Mv)
        MvAc.gotoFrameAndPlay(0,720,false)
        MvAc.setFrameEventCallFunc(function(frame){
            var index = frame.getFrameIndex()
            if(index==210){
                playMusic(res.seemp1)
            }else if(index==364){
                playMusic(res.seemp2)
            }else if(index==478){
                playMusic(res.seemp3)
            }else if(index==536){
                playMusic(res.seemp4)
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