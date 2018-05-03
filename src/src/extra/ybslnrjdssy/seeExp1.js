var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           
        })
        this.expCtor() 
        this.initUI() 
        this.initPeople()

        return true
    },
    initUI:function(){

      var self = this
      this.mv = ccs.load(res.seeAc).node
      this.mvac = ccs.load(res.seeAc).action
      this.mvac.retain()
      this.inside_node.addChild(this.mv)
      this.mv.mvac = this.mvac
      this.mv.endFrame = 863

      this.mv.initAc = function(){
          this.stopAllActions()
          this.mvac.clearFrameEventCallFunc()
          var endFrame = this.endFrame 
          this.mvac.gotoFrameAndPlay(0,endFrame+1,false)
          this.mvac.setFrameEventCallFunc(function(frame){
              var index = frame.getFrameIndex()
              if(index==1){
                self.speakeBykey("mv1",1)
              }else if(index==201){
                self.speakeBykey("mv2",2)
              }else if(index==271){
                self.speakeBykey("mv3",1)
              }else if(index==399){
                self.speakeBykey("mv4",2)
              }else if(index==482){
                self.speakeBykey("mv5",1)
              }else if(index==682){
                self.speakeBykey("mv6",2)
              }else if(index==endFrame){
                if(self.btnVector[0]){
                   self.btnVector[0].loadTextureNormal(self.btnlist[3].normal)
                   self.btnVector[0].loadTexturePressed(self.btnlist[3].select)
                   self.btnVector[1].setVisible(false)
                   self.btnVector[0].isok = true
                }
              }
          })
          this.runAction(this.mvac)
          this.mvac.pause()
          if(self.nodebs){
             self.nodebs.stopSay()
          }
      }

      this.mv.pauseAc = function(){
          this.mvac.pause()
          self.nodebs.callPause()
      }

      this.mv.resumeAc = function(){
          this.mvac.resume()
          self.nodebs.callResume()
      }

      this.mv.initAc()

      this.initMyBtn()
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
               if(!self.btnVector[1].isVisible()){
                  self.btnVector[1].setVisible(true)
                  self.mv.initAc()
               }
               self.mv.resumeAc()
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
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.mv.resumeAc()
            })
        }
    },
    speakeBykey:function(key,status){
       if(status==1){
          this.nodebs.say({
            key: key,
            force:true 
          })
       }else{
          playMusic(res[key])
       }
        
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)
 
        addContent({
              people: this.nodebs,
              key: "mv1",
              sound: res.mv1,
           })
        addContent({
              people: this.nodebs,
              key:"mv3",
              sound:res.mv3,
           })
        addContent({
              people: this.nodebs,
              key: "mv5",
              sound:res.mv5,
           })
    }
})