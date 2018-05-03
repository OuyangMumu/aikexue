var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super()
        this.load(function() {
           loadPlist("light") 
        })
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
      var self = this
      var seeDo1 = new cc.Sprite(res.seeDo1)
      seeDo1.setPosition(456,250)
      self.addChild(seeDo1)

      var taiyang = new cc.Sprite(res.taiyang)
      taiyang.setPosition(80,300)
      self.addChild(taiyang)

      var lightLine = new cc.Sprite("#light00.png")
      lightLine.setPosition(373,335)
      self.addChild(lightLine)
      self.lightLine = lightLine

       lightLine.sartAc = function(){
          var  lightLine = this
          lightLine.stopAc()
          var ac = createAnimation({
                                  frame:"light%02d.png",
                                  start:0,
                                  end:43,
                                  time: 0.07,
                                  fun:function(){
                                     self.changeBtn()
                                  }
                                })
          lightLine.runAction(ac)
       }
       lightLine.stopAc = function(){
         this.stopAllActions()
       }
       
       lightLine.resetAll = function(){
         this.stopAllActions()
         this.setSpriteFrame("light00.png")
       }
       lightLine.pauseOrresume = function(){
          var lightLine = this
           if(!lightLine.isPause){
              lightLine.isPause = true
              lightLine.pause()
           }else{
              lightLine.isPause = false
              lightLine.resume()
           }
       }
       self.initMyBtn()
    },
    changeBtn:function(){
      var self = this
      if(self.btnVector[0]){
          self.btnVector[0].loadTextureNormal(self.btnlist[3].normal)
          self.btnVector[0].loadTexturePressed(self.btnlist[3].select)
          self.btnVector[1].setVisible(false)
          self.btnVector[0].isok = true
      }
      if(!self.resultBtn){
          var resultbtn = new ccui.Button(res.btn_result_normal,
          res.btn_result_select)
          resultbtn.setPosition(1035,370)
          self.addChild(resultbtn)
          self.resultbtn = resultbtn
          resultbtn.addClickEventListener(function(){
              self.nodebs.say({
                  key: "wenzi9"
                })
          })
      }
    },
    initMyBtn:function(){
      var self = this
      self.btnVector = []
      var node = self.node
      var btnlist = [
        {
           name:"pause",
           pos:cc.p(860,460),
           normal:res.btn_play_normal,
           select:res.btn_play_select,
           fun:function(sender,type){
            cc.log(sender.isok)
            if(self.lightLine.isPause == null){
              self.lightLine.sartAc()
              self.lightLine.isPause = false
            }else{
              self.lightLine.pauseOrresume()
            } 
            if(!sender.isok){
               sender.loadTextureNormal(btnlist[0].normal)
               sender.loadTexturePressed(btnlist[0].select)
               sender.isok = true
            }else{
              sender.loadTextureNormal(btnlist[2].normal)
              sender.loadTexturePressed(btnlist[2].select)
              sender.isok = false
            }
            if(!self.btnVector[1].isVisible()){
              self.btnVector[1].setVisible(true)
              self.lightLine.resetAll()
              self.lightLine.sartAc()
              self.lightLine.isPause = false
            }
           },
        },
        {
           name:"stop",
           pos:cc.p(860,380),
           normal:res.btn_stop_normal,
           select:res.btn_stop_select,
           fun:function(sender,type){    
                self.btnVector[0].loadTextureNormal(btnlist[0].normal)
                self.btnVector[0].loadTexturePressed(btnlist[0].select)
                self.lightLine.resetAll()
                self.btnVector[0].isok = true
                sender.setVisible(false)
           },
        },
        {
           name:"play",
           pos:cc.p(800,320),
           normal:res.btn_pause_normal,
           select:res.btn_pause_select,
           fun:function(){
           },
        },    
        {
           name:"restart",
           pos:cc.p(800,280),
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
          tempbtn.isok = true
          tempbtn.addClickEventListener(btnlist[i].fun)
      }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.nodebs.say({
                  key: "wenzi6",
                  force:true 
                }) 
            })
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
          key: "wenzi6",
          img: res.wenzi6,
          sound: res.zimp6
        })
        addContent({
           people: this.nodebs,
           key: "wenzi9",
           img:res.wenzi9,
           id:"result",
           sound: res.zimp9,
           offset: cc.p(45, 20),
           offbg: cc.p(0,0),
           btnModify:cc.p(0,0)
        })
    }
})