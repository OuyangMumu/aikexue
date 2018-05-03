var videoLayer = myLayer.extend({
    sprite: null,
    changeDelete: true,
    jumpTolayer:"mainLayer",
    load: function() {   
    },
    ctor: function() {
        this._super();
        var self = this
        var playList = [3,1330]

        this.mv = ccs.load(res.wmds_videoLayer_json).node
        this.mvac = ccs.load(res.wmds_videoLayer_json).action
        this.addChild(this.mv)

        var flower_node = this.mv.getChildByName("flower_node")
        var createSp = function(scale,pos){
        	var sp = new cc.Sprite(res.flower)
        	sp.setScale(scale)
        	sp.setPosition(pos)
        	flower_node.addChild(sp)
        	sp.runAction(cc.repeatForever(cc.rotateBy(2.5,360)))
        }
		var myScale = [1.5,0.8,0.6,1.3,0.5,1,0.7]
		var pos = [cc.p(190,100),cc.p(120,470),cc.p(300,560),cc.p(920,540),cc.p(990,320),cc.p(930,50),cc.p(640,10)]
		for(var i = 0 ; i < 7 ; i++){
			createSp(myScale[i],pos[i])
		}

        this.mvac.retain()
        this.mv.mvac = this.mvac
        this.mv.endFrame = 1330
        this.mv.initAc = function(){
            this.stopAllActions()
            this.mvac.clearFrameEventCallFunc()
            var endFrame = this.endFrame 
            this.mvac.gotoFrameAndPlay(0,endFrame,false)
            this.mvac.setFrameEventCallFunc(function(frame){
                var index = frame.getFrameIndex()
                switch(index){
                    case playList[0]: playMusic(res.mv_sound)
                    break
                    case playList[1]:
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