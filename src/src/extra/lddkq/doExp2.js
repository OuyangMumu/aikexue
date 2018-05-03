//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        })
        this._super()
        var self = this
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                       json: res.biao3,
                       isShowResult: true,
                       scale: 0.9,
                       inputNum:7,
                       inputLineChange:[true,true,true,true,true,true,true]
                  })
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.expCtor()
        this.initUI()
        this.initTool()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var uiName = ["xlazhu","xfire","kh1","TestBox","kh2"]
        var node = loadNode(res.doJson,uiName)
        self.addChild(node)
        self.node = node
        
        node.kh2.setLocalZOrder(10)
        var seq = cc.sequence(cc.scaleTo(0.2,0.9,0.8),cc.scaleTo(0.2,1,1))
        node.xfire.runAction(cc.repeatForever(seq))
        node.xfire.setVisible(false)

        self.air1 = createWaterAir({
                        total: 25,
                        width: 5,
                        height: 20,
                        dis:250,
                        disvar:10,
                        timevar:0.1,
                        canOp:true
                      })
        self.air1.setScale(0.2,1)
        self.air1.setPosition(598,112)
        self.addChild(self.air1)

        self.canSee = true
    },
    showFireWithAir:function(){
        var self = this
        self.canSee = false
        if(self.air1){
          self.air1.runAction(cc.sequence(
             cc.delayTime(1.5),
             cc.rotateTo(2,-45),
             cc.callFunc(function(){
                var removeAir = self.air1
                self.air1 = null
                removeAir.runAction(cc.sequence(
                  cc.spawn(
                  cc.moveBy(2,cc.p(-70,70)),
                  cc.scaleTo(2,0.2,0.4),
                  cc.fadeOut(2)),
                  cc.callFunc(function(){
                     removeAir.removeFromParent(true)
                  })
                ))
                self.air1 = createWaterAir({
                        total: 25,
                        width: 5,
                        height: 20,
                        dis:250,
                        disvar:10,
                        timevar:0.1,
                        canOp:true
                      })
                self.air1.setScale(0.2,0.2)
                self.air1.setRotation(-45)
                self.air1.setPosition(598,112)
                self.addChild(self.air1)
                self.air1.runAction(cc.sequence(
                  cc.rotateTo(0.5,-76),
                  cc.scaleTo(2,0.2,1),
                  cc.callFunc(function(){
                      self.air2 = createWaterAir({
                        total: 25,
                        width: 5,
                        height: 20,
                        dis:250,
                        disvar:10,
                        timevar:0.1,
                        canOp:true
                      })
                      self.air2.setScale(0.3,1)
                      self.air2.setOpacity(150)
                      self.air2.setPosition(370,158)
                      self.addChild(self.air2)
                      self.canSee = true
                  })
                ))
             })
          ))
        }
    },
    hideFireWithAir:function(){
        var self = this
        self.canSee = false
        if(self.air2){
            var air2 = self.air2
            self.air2 = null
            air2.runAction(cc.sequence(
              cc.spawn(
                cc.moveBy(2,cc.p(0,40)),
                cc.scaleTo(2,0.2,0.4),
                cc.fadeOut(2)
              ),
              cc.callFunc(function(){
                 air2.removeFromParent(true)
              })
            ))
        }
        if(self.air1){
          var air1 = self.air1
          self.air1 = null
          air1.runAction(cc.sequence(
            cc.spawn(
              cc.moveBy(3,cc.p(-70,20)),
              cc.scaleTo(3,0.2,0.4),
              cc.fadeOut(3),
              cc.sequence(
                cc.delayTime(1),
                cc.callFunc(function(){
                    self.air1 = createWaterAir({
                        total: 25,
                        width: 5,
                        height: 20,
                        dis:250,
                        disvar:10,
                        timevar:0.1,
                        canOp:true
                      })
                    self.air1.setScale(0.2,0.2)
                    self.air1.setPosition(598,112)
                    self.addChild(self.air1)
                    self.air1.setRotation(-76)
                    self.air1.runAction(cc.sequence(
                      cc.spawn(
                        cc.scaleTo(2,0.2,1),
                        cc.rotateTo(2,0)
                      ),
                      cc.callFunc(function(){
                          self.canSee = true   
                      })
                    ))
                })
              )
            ),
            cc.callFunc(function(){
              air1.removeFromParent(true)
            })
          ))
        }
    },
    initTool:function(){
        var self = this
        var node = self.node
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        
        self.expItems1 = 0
        self.expItems2 = 0
        this.toolbtn = createTool({
            pos:cc.p(350, 540),
            nums:2,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.41, 1.2),
            itempos:[cc.p(1,-13),cc.p(1,-14)],
            circlepos:cc.p(0,13),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                if(index==0){
                   item.opJudge = true
                   var fires = new cc.Sprite(res.xfire)
                   fires.setPosition(4,-2)
                   fires.setAnchorPoint(0.5,0)
                   var seq = cc.sequence(cc.scaleTo(0.2,0.9,0.8),cc.scaleTo(0.2,1,1))
                   fires.runAction(cc.repeatForever(seq))
                   item.addChild(fires)
                   item.fires = fires
                   item.curmin = 215
                }else{
                   item.curmin = 180
                }
                return true
            },
            clickfun:function(data){
              var item = data.sp
              //item.setLocalZOrder(LOCAL_ORDER++)
              return true
            },
            movefun:function(data){
              var item = data.sp
              var pos = data.pos
              var delta = data.delta
              var index = data.index
              if(!item.noMove){
                 var tempx = item.x + delta.x
                  var tempy = item.y + delta.y
                  if(index==0){
                      if(!item.inBox){
                          if(tempy<=item.curmin){
                            tempy = item.curmin
                          }
                      }else{
                          if(tempy<=150){
                            tempy = 150
                          }
                          if(tempx>=132 && tempx<=140 && tempy<=160){
                            if(!node.xfire.isVisible()){
                              node.xfire.setVisible(true)
                              self.showFireWithAir()
                            }
                          }
                      }     
                  }else if(index==1){
                      if(!item.inBox){
                          if(tempy<=item.curmin){
                            tempy = item.curmin
                          }
                      }else{
                          if(tempy<=104){
                            tempy = 105
                          }
                          if(tempx>=65 && tempx<=94 && tempy<=110){
                            if(node.xfire.isVisible()){
                              node.xfire.setVisible(false)
                              self.hideFireWithAir()
                            }
                          }
                      }
                  }
                  item.x = tempx
                  item.y = tempy
                  var world = getWorldPos(item)
                  var curpos = cc.p(world.x - item.width/2,world.y-item.height/2)
                  if(judgeInside({item:node.TestBox,pos:curpos})){
                    if(self.canSee){
                      if(!self.boxItem){
                        item.inBox = true
                        self.boxItem = item
                        var itempos = node.kh1.convertToNodeSpace(world)
                        safeAdd(node.kh1,item)
                        item.setLocalZOrder(1)
                        item.setPosition(itempos)
                      }else{
                        if(self.boxItem!=item){
                          item.noMove = true
                          item.y = item.curmin+50
                          if(item.fires){
                            self.speakeBykey("wenzi8",1)
                          }else{
                            self.speakeBykey("wenzi7",1)
                          }
                        }
                      }
                    }else{
                      if(!self.boxItem){
                        item.noMove = true
                        item.y = item.curmin+50
                        self.speakeBykey("wenzi9",1)
                      }
                    }
                  }else{
                    item.inBox = false
                    if(self.boxItem && self.boxItem==item){
                       self.boxItem = null
                    }
                    safeAdd(toolnode,item)
                    item.setPosition(world)
                  }
              }
            },
            outfun:function(data){
              var item = data.sp
              var index = data.index
              item.noMove = false
              if(index==0){
                 
              }else if(index==1){
              }
            },
            counts:[1,1],
            father:toolnode,
            files:[res.item3,res.item4],
            gets:[res.firegen,res.firemao]
        })
        this.addChild(this.toolbtn,3)
    },
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            if(!self[key]){
                self[key] = true
                this.nodebs.say({
                    key: key,
                    force: true
                })  
            } 
        }else{
            dialogControl.AddDialog("Tips", {
                        res: res[key],
                        face: 1,
                        confirmBtn: true,
                        father: self
                  })
        }       
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
                self.speakeBykey("wenzi5")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi5",
            img:res.wenzi5,
            sound: res.zimp5
        })

        addContent({
            people: this.nodebs,
            key: "wenzi6",
            img:res.wenzi6,
            sound: res.zimp6
        })
    }  
})