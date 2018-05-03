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
        MvAc.gotoFrameAndPlay(0,1650,false)
        MvAc.setFrameEventCallFunc(function(frame){
            var index = frame.getFrameIndex()
            if(index==70){
                playMusic(res.mv1)
            }else if(index==530){
                playMusic(res.mv2)
            }else if(index==755){
                playMusic(res.mv3)
            }else if(index==967){
                playMusic(res.mv4)
            }else if(index==1130){
                if (self.nodebs) {
                    self.nodebs.show()
                }
            }else if(index==1140){
                self.speakeBykey("mv5")
            }else if(index==1360){
                self.speakeBykey("mv6")
            }else if(index==1500){
                self.speakeBykey("mv7")
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

        this.initPeople()

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
    },
    speakeBykey:function(key){
        if (this.nodebs) {
            this.nodebs.say({
                    key: key,
                    force: true
                })        
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 170)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "mv5",
            sound: res.mv5
        })
        addContent({
            people: this.nodebs,
            key: "mv6",
            sound: res.mv6
        })
        addContent({
            people: this.nodebs,
            key: "mv7",
            sound: res.mv7
        })
    }
})