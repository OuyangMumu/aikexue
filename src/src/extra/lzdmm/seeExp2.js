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
        var playList = [5,105,320,380,635,845,985,1060,1250]

        this.mv = ccs.load(res.lzdmm_seeExp2_json).node
        this.mvac = ccs.load(res.lzdmm_seeExp2_json).action
        this.inside_node.addChild(this.mv)

        this.mv.pauseAc = function(){
            this.mvac.pause()
            self.nodebs.callPause()
        }

        this.mv.resumeAc = function(){
            this.mvac.resume()
            self.nodebs.callResume()
        }
        this.mvac.retain()
        this.mv.mvac = this.mvac
        this.mv.endFrame = 1250
        this.mv.initAc = function(){
            this.stopAllActions()
            this.mvac.clearFrameEventCallFunc()
            var endFrame = this.endFrame 
            this.mvac.gotoFrameAndPlay(0,endFrame,false)
            this.mvac.setFrameEventCallFunc(function(frame){
                var index = frame.getFrameIndex()
                switch(index){
                    case playList[0]: playMusic(res.see2_sound1)
                    break
                    case playList[1]: playMusic(res.see2_sound2)
                    break
                    case playList[2]: playMusic(res.see2_sound3)
                    break
                    case playList[3]: playMusic(res.see2_sound4)
                    break
                    case playList[4]: playMusic(res.see2_sound5)
                    break
                    case playList[5]: playMusic(res.see2_sound6)
                    break
                    case playList[6]: playMusic(res.see2_sound7)
                    break
                    case playList[7]:
                      self.nodebs.say({key:"see2_tip8",force:true})
                    break
                    case playList[8]:
                        if(self.btnVector[0]){
                             self.btnVector[0].loadTextureNormal(self.btnlist[3].normal)
                             self.btnVector[0].loadTexturePressed(self.btnlist[3].select)
                             self.btnVector[1].setVisible(false)
                             self.btnVector[0].isok = true
                        }
                    break
                }
            })
          this.runAction(this.mvac)
          this.mvac.pause()
        }

        this.mv.initAc()
        this.initMyBtn()    
    },

    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
              self.mv.resumeAc()
            })
        }
    },
    initPeople : function(){
      var self = this
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see2_tip8",sound:res.see2_sound8},
        ]
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
    },

    initMyBtn:function(endFrame){
      var self = this
      self.btnVector = []
      var btnlist = [
        {
           name:"pause",
           pos:cc.p(130,190),
           normal:res.btn_pause_normal,
           select:res.btn_pause_select,
           fun:function(sender,type){
            if(!sender.isok){
               sender.loadTextureNormal(btnlist[2].normal)
               sender.loadTexturePressed(btnlist[2].select)
               self.mv.pauseAc()
               sender.isok = true
            }else{
               sender.loadTextureNormal(btnlist[0].normal)
               sender.loadTexturePressed(btnlist[0].select)
               cc.log(self.btnVector[1].isVisible())
               if(!self.btnVector[1].isVisible()){
                  self.btnVector[1].setVisible(true)
                  self.mv.initAc()
                  self.mv.resumeAc()
                 //self.nodebs.speakTip()
               }else{
                  self.mv.resumeAc()
               }
               sender.isok = false
            }  
           },
        },
        {
           name:"stop",
           pos:cc.p(130,100),
           normal:res.btn_stop_normal,
           select:res.btn_stop_select,
           fun:function(sender,type){    
                self.btnVector[0].loadTextureNormal(btnlist[2].normal)
                self.btnVector[0].loadTexturePressed(btnlist[2].select)
                self.mv.initAc()
                self.nodebs.stopSay()
                self.btnVector[0].isok = true
                sender.setVisible(false)
           },
        },
        {
           name:"play",
           pos:cc.p(130,240),
           normal:res.btn_play_normal,
           select:res.btn_play_select,
           fun:function(){
           },
        },    
        {
           name:"restart",
           pos:cc.p(130,80),
           normal:res.btn_restart_normal,
           select:res.btn_restart_select,
           fun:function(){
           },
        }
      ]
      self.btnlist = btnlist
      for(var i=0;i<2;i++){
          var tempbtn = new ccui.Button(btnlist[i].normal,btnlist[i].select)
          tempbtn.setPosition(btnlist[i].pos)
          this.addChild(tempbtn)
          self.btnVector.push(tempbtn)
          tempbtn.addClickEventListener(btnlist[i].fun)
      }
    },
})