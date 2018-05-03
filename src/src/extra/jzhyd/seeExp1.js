var curMusic = null
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
           loadPlist("allAni")
        })
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               var buf = []
               for(var i=0; i<7; i++){
                buf.push([null,res.chose1,res.chose2])
               }
               if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.biao1,
                      scale: 0.9,
                      downNums:7,
                      downData:{
                        nums:7,
                        bufs:buf,
                        keys:[
                         2,1,1,1,2,1,1
                        ]
                      }
                  })
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
       var self = this
       var uiName = [
          "dog","boy","car","bird","dark"
       ]
       var node = loadNode(res.see1,uiName)
       this.inside_node.addChild(node)
       this.node = node
       this.initMyBtn()

       node.allAniAction = function(){
          var node = this
          var dogAc = createAnimation({
                              frame:"dog%d.png",
                              start:1,
                              end: 8,
                              time: 0.1
                          })
          node.dog.runAction(cc.repeatForever(dogAc))

          var boyAc = createAnimation({
                              frame:"boy%02d.png",
                              start:1,
                              end: 20,
                              time: 0.08
                          })
          node.boy.runAction(cc.repeatForever(boyAc))

          var carAc = createAnimation({
                              frame:"car%02d.png",
                              start:1,
                              end: 20,
                              time: 0.06
                          })
          node.car.runAction(cc.repeatForever(carAc))

          var birdAc = createAnimation({
                              frame:"bird%02d.png",
                              start:1,
                              end: 8,
                              time: 0.1
                          })
          node.bird.runAction(cc.repeatForever(birdAc))
       }
        node.allAniStop = function(){
          var node = this
          node.stopAllActions()
          for(var i in node.getChildren()){
            node.getChildren()[i].stopAllActions()
          }
        }

        node.allAniPause = function(){
          var node = this
          node.pause()
          for(var i in node.getChildren()){
            node.getChildren()[i].pause()
          }
        }
        node.allAniResume = function(){
          var node = this
          node.resume()
          for(var i in node.getChildren()){
            node.getChildren()[i].resume()
          }
        }
       
       node.sartAc = function(){
          var node = this
          var ac = ccs.load(res.see1).action
          ac.gotoFrameAndPlay(0,170,false)
          ac.setLastFrameCallFunc(function(){
              node.stopAc()
              ac.clearLastFrameCallFunc()
          })
          node.runAction(ac)

          node.allAniAction()
       }

       node.stopAc = function(){
          this.allAniStop()
          self.changeBtn()
       }
       
       node.resetAll = function(){
          this.allAniStop()
          var node = this
          var ac = ccs.load(res.see1).action
          ac.gotoFrameAndPlay(0,1,false)
          node.runAction(ac)
       }
       node.pauseAc = function(){
          this.allAniPause()
       }
       node.resumeAc = function(){
          this.allAniResume()
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
           pos:cc.p(460,590),
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
           pos:cc.p(620,590),
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
    }
})