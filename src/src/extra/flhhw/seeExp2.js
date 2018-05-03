var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp2",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var mv = ccs.load(res.flhhw_seeExp2_json).node
        var mvac = ccs.load(res.flhhw_seeExp2_json).action
        this.inside_node.addChild(mv)

        self.nodebs.show(function(){
            self.nodebs.say({key:"see2_tip1"})
        })
        mvac.retain()
        mvac.gotoFrameAndPlay(0,35,true)
        mv.runAction(mvac)

        var btn_result = new ccui.Button(res.btn_get_normal,res.btn_get_select)
        btn_result.setPosition(1000,440)
        self.addChild(btn_result)
        btn_result.addClickEventListener(function(){
            self.nodebs.say({key:"result"})
        })

        var btn_play = new ccui.Button(res.btn_pause_normal,res.btn_play_normal)
        btn_play.setPosition(1000,350)
        self.addChild(btn_play)
        btn_play.setScale(0.7)

        var playFlag = true
        var rePlay = false
        btn_play.addClickEventListener(function(){
            if(playFlag){
                playFlag = false
                btn_play.loadTextures(res.btn_play_normal,res.btn_pause_normal)
                mvac.pause()
            }else{
                playFlag = true
                btn_play.loadTextures(res.btn_pause_normal,res.btn_play_normal)
                mvac.resume()
            }
        })
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        
        addContent({
            people: this.nodebs,
            key: "see2_tip1",
            img: res.see2_tip1,
            sound: res.see2_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.see2_result,
            sound: res.see2_sound2,
            id: "result",
        })
    },
})
