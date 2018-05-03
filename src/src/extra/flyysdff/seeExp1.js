var curMusic = null
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
      this.mv = ccs.load(res.expSee1).node
      this.mvac = ccs.load(res.expSee1).action
      this.mvac.retain()
      this.inside_node.addChild(this.mv)
      this.mv.mvac = this.mvac
      this.mv.endFrame = 1341

      var discoverbtn = this.mv.getChildByName("discoverbtn")
      discoverbtn.addClickEventListener(function(){
          self.nodebs.say({
            key: "jielun", 
          })
      })

      this.mv.initAc = function(){
          this.stopAllActions()
          this.mvac.clearFrameEventCallFunc()
          var endFrame = this.endFrame 
          this.mvac.gotoFrameAndPlay(0,endFrame+1,false)
          this.mvac.setFrameEventCallFunc(function(frame){
              var index = frame.getFrameIndex()
              if(index==2){
                self.speakeBykey("mv1")
              }else if(index==183){
                self.speakeBykey("mv2")
              }else if(index==367){
                self.speakeBykey("mv3")
              }else if(index==429){
                self.speakeBykey("mv4")
              }else if(index==591){
                self.speakeBykey("mv5")
              }else if(index==680){
                self.speakeBykey("mv6")
              }else if(index==800){
                self.speakeBykey("mv7")
              }else if(index==1100){
                self.speakeBykey("mv8")
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
    speakeBykey:function(key){
        this.nodebs.say({
          key: key,
          force:true 
        })
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)
        
        var soundList = [res.mv1,res.mv2,res.mv3,res.mv4,
        res.mv5,res.mv6,res.mv7,res.mv8]
        for(var i=0; i<soundList.length; i++){
            addContent({
              people: this.nodebs,
              key: sprintf("mv%d",i+1),
              sound: soundList[i],
           })
        }

        addContent({
           people: this.nodebs,
           key: "jielun",
           img:res.jielun,
           id:"result",
           sound: res.jielunmp,
           offset: cc.p(35, 30),
           offbg: cc.p(70,70),
        })
    }
})