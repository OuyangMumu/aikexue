var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super()
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
       var self = this
       var node = new cc.Sprite(res.zheshe00)
       node.setPosition(getMiddle(-50,-30))
       self.addChild(node)
       self.node = node

       node.sartAc = function(){
          var ac = createAnimation({
                                  ifFile:true,
                                  frame:"zheshe%02d",
                                  start:1,
                                  end:9,
                                  time: 0.1
                                })
          var ac1 = createAnimation({
                                  ifFile:true,
                                  frame:"zheshe%02d",
                                  start:10,
                                  end:17,
                                  time: 0.1,
                                  fun:function(){
                                     self.changeBtn()
                                  }
                                })
          node.runAction(cc.sequence(
             cc.delayTime(0.7),
             ac,
             cc.delayTime(0.5),
             ac1
          ))
       }
       node.stopAc = function(){
         node.stopAllActions()
       }
       
       node.resetAll = function(){
         node.stopAllActions()
         node.setTexture(res.zheshe00)
       }
       node.pauseAc = function(){
         node.pause()
       }
       node.resumeAc = function(){
         node.resume()
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
    },
    initMyBtn:function(){
      var self = this
      self.btnVector = []
      var node = self.node
      var btnlist = [
        {
           name:"pause",
           pos:cc.p(130,210),
           normal:res.btn_pause_normal,
           select:res.btn_pause_select,
           fun:function(sender,type){
            if(!sender.isok){
               sender.loadTextureNormal(btnlist[2].normal)
               sender.loadTexturePressed(btnlist[2].select)
               node.pauseAc()
               sender.isok = true
            }else{
               sender.loadTextureNormal(btnlist[0].normal)
               sender.loadTexturePressed(btnlist[0].select)
               cc.log(self.btnVector[1].isVisible())
               if(!self.btnVector[1].isVisible()){
                  self.btnVector[1].setVisible(true)
                  node.resetAll()
                  node.sartAc()
               }else{
                  node.resumeAc()
               }
               sender.isok = false
            }  
           },
        },
        {
           name:"stop",
           pos:cc.p(130,120),
           normal:res.btn_stop_normal,
           select:res.btn_stop_select,
           fun:function(sender,type){    
                self.btnVector[0].loadTextureNormal(btnlist[2].normal)
                self.btnVector[0].loadTexturePressed(btnlist[2].select)
                node.resetAll()
                self.btnVector[0].isok = true
                sender.setVisible(false)
           },
        },
        {
           name:"play",
           pos:cc.p(130,260),
           normal:res.btn_play_normal,
           select:res.btn_play_select,
           fun:function(){
           },
        },    
        {
           name:"restart",
           pos:cc.p(130,100),
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
            self.nodebs.show(function(){
                self.node.sartAc()
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)
    }
})