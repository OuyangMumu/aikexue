var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           loadPlist("waterLong")
        })
        this.expCtor() 
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
       var self = this
       var uiName = [
          "long","short","muUp","mujia",
          "muNao2","muNao3","pwater",
          "waterL","tjt","pwaterC"
       ]
       var node = loadNode(res.see1,uiName)
       this.addChild(node)
       this.node = node
       this.initMyBtn()
       
       var createClip = function(data){
          var toShowimg = data.toShowimg
          var toSencilimg = data.toSencilimg
          var ShowimgPos = data.ShowimgPos
          var sencilPos = data.sencilPos
          var father = data.father

          var secil = new cc.Sprite(toSencilimg)
          var  clip = new cc.ClippingNode(secil)
          secil.setPosition(sencilPos)
          clip.setAlphaThreshold(0)
          
          var showSp = new cc.Sprite(toShowimg)
          showSp.setPosition(ShowimgPos)
          clip.addChild(showSp)
          clip.showSp = showSp
          showSp.initPos = showSp.getPosition()

          if(father){
            clip.setPosition(0,0)
            father.addChild(clip)
          }
          clip.initPos = clip.getPosition()
          return showSp
       }
       node.mujia.createWaterClip = function(){
          node.spA = createClip({
                           toShowimg:res.mucup7,
                           ShowimgPos:cc.p(-19.5,-108),
                           toSencilimg:res.mucup5,
                           sencilPos:cc.p(-20,44),
                           father:this
                       })
          node.spB = createClip({
                           toShowimg:res.mucup7,
                           ShowimgPos:cc.p(221,-29),
                           toSencilimg:res.mucup6,
                           sencilPos:cc.p(221,119),
                           father:this
                       })
       }
       node.mujia.createWaterClip()

       node.mujia.clipReset = function(){
          var spA = node.spA
          var spB = node.spB
          spA.stopAllActions()
          spB.stopAllActions()
          spA.setPosition(spA.initPos)
          spB.setPosition(spB.initPos)
       }
       node.mujia.clipPause = function(){
          var spA = node.spA
          var spB = node.spB
          spA.pause()
          spB.pause()
       }
       node.mujia.clipResume = function(){
          var spA = node.spA
          var spB = node.spB
          spA.resume()
          spB.resume()
       }
       node.mujia.clipPlayAc = function(){
         var spA = node.spA
         var spB = node.spB
         var time = 114
         var spAdis = 103
         var spBdis = 143
         spA.runAction(cc.moveBy(time,cc.p(0,spAdis)))
         spB.runAction(cc.moveBy(time,cc.p(0,spBdis)))
       }


       node.long.playAc = function(){
          var long = this
          long.stopAllActions()
          var ac = createAnimation({
                              frame:"long%02d.png",
                              start:0,
                              end: 21,
                              time: 0.09
                          })
          long.runAction(cc.repeatForever(ac))
       }
       node.long.init = function(){
         this.stopAllActions()
         this.setSpriteFrame("long00.png")
       }
       node.short.playAc = function(){
          var short = this
          short.stopAllActions()
          var ac = createAnimation({
                              frame:"short%02d.png",
                              start:0,
                              end: 25,
                              time: 0.05
                          })
          short.runAction(cc.repeatForever(ac))
       }
       node.short.init = function(){
         this.stopAllActions()
         this.setSpriteFrame("short00.png")
       }

       node.muUp.initPos = node.muUp.getPosition()
       node.muUp.init = function(){
         this.stopAllActions()
         this.setPosition(this.initPos)
       }
       node.muUp.playAc = function(){
         var muUp = this
         muUp.stopAllActions()
         muUp.runAction(cc.moveTo(114,cc.p(221,436)))
       }
       
       node.muNao2.init = function(){
         var muNao2 = this
         muNao2.stopAllActions()
         muNao2.time = 0
         muNao2.setRotation(0)

         var muNao3 = node.muNao3
         muNao3.stopAllActions()
         muNao3.setRotation(0)
       }
       node.muNao2.playAc = function(){

          var muNao2 = this
          var muNao3 = node.muNao3
          muNao2.stopAllActions()
          muNao2.time = 0
          var seq = cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function(){
               muNao2.time++
               if(muNao2.time>114){
                 muNao2.stopAllActions()
                 muNao3.stopAllActions()
                 node.stopAc()
               }else{
                 var ro = muNao2.getRotationX()
                 muNao2.runAction(cc.rotateTo(0.9,ro+3.16))

                 var ro1 = muNao3.getRotationX()
                 muNao3.runAction(cc.rotateTo(0.9,ro1+4))
               }
            })
          )
          muNao2.runAction(cc.repeatForever(seq))
       }
       
       node.pwater.initPos = node.pwater.getPosition()
       node.pwaterC.initPos = node.pwaterC.getPosition()
       node.waterL.initPos = node.waterL.getPosition()
       node.tjt.init = function(){
          node.pwater.stopAllActions()
          node.pwaterC.stopAllActions()
          node.waterL.stopAllActions()
          node.pwater.setPosition(node.pwater.initPos)
          node.pwaterC.setPosition(node.pwaterC.initPos)
          node.waterL.setPosition(node.waterL.initPos)
       }
       node.tjt.playAc = function(){
          var time = 114
          var dis = 183
          node.pwaterC.runAction(cc.moveBy(time,cc.p(0,-dis)))
          node.pwater.runAction(cc.moveBy(time,cc.p(0,dis)))
          node.waterL.runAction(cc.moveBy(time,cc.p(0,-dis)))
       }

       node.sartAc = function(){
          node.long.playAc()
          node.short.playAc()
          node.muUp.playAc()
          node.muNao2.playAc()
          node.tjt.playAc()
          node.mujia.clipPlayAc()
       }

       node.stopAc = function(){
          node.long.init()
          node.short.init()
          self.changeBtn()
       }
       
       node.resetAll = function(){
         node.muUp.init()
         node.muNao2.init()
         node.tjt.init()
         node.long.init()
         node.short.init()
         node.mujia.clipReset()
       }
       node.pauseAc = function(){
         for(var i in uiName){
            node[uiName[i]].pause()
         }
         node.mujia.clipPause()
       }
       node.resumeAc = function(){
         for(var i in uiName){
            node[uiName[i]].resume()
         }
         node.mujia.clipResume()
       }
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
            self.nodebs.show(function() {
                self.node.sartAc()
                self.nodebs.say({
                  key: "wenzi1",
                  force:true 
                })
                self.node.runAction(cc.sequence(
                   cc.delayTime(10),
                   cc.callFunc(function(){
                        var resultbtn = new ccui.Button(res.btn_get_normal,
                          res.btn_get_select)
                        resultbtn.setPosition(1000,450)
                        self.addChild(resultbtn)
                        resultbtn.addClickEventListener(function(){
                            self.nodebs.say({
                                key: "jielun"
                              })
                        })
                   })
                ))
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
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })
        addContent({
          people: this.nodebs,
          key: "jielun",
          img:res.jielun,
          id:"result",
          sound: res.jielunmp,
          offset: cc.p(25, 25),
          offbg: cc.p(22,40),
        })
    }
})