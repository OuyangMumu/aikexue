var Touches = true
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
          loadPlist("sgg")
        })
        var self = this
        this.expCtor()
        this.initUI() 
        this.initPeople()
        return true
    },
    initUI:function(){
      var self = this
      self.seeword1 = new cc.Sprite(res.seeword1)
      self.seeword1.setPosition(getMiddle(0,190))
      self.addChild(self.seeword1)
      self.seeword1.setOpacity(0)

      self.seeword2 = new cc.Sprite(res.seeword2)
      self.seeword2.setPosition(getMiddle(0,190))
      self.addChild(self.seeword2)
      self.seeword2.setOpacity(0)

      var DivCount = 0
      var checkCount = function(){
          DivCount++
          if(DivCount>=2){
            self.seeword2.runAction(cc.sequence(
                cc.callFunc(function(){
                  self.seeword1.stopAllActions()
                  self.seeword1.setVisible(false)
                }),
                cc.fadeIn(1),
                cc.callFunc(function(){
                    self.speakeBykey("wenzi2")
                })
              ))
          }
      }
      var cup1 = self.createReCup({
                    type:"re",
                    fun:function(){
                        checkCount()
                    }})
      cup1.setPosition(420,170)
      self.addChild(cup1)

      var cup2 = self.createReCup({
                      fun:function(){
                        checkCount()
                      }
                  })
      cup2.setPosition(850,170)
      self.addChild(cup2)
    },
    createReCup:function(data){
      var type = data.type || "normal"
      var fun = data.fun
      var UIList = ["sg","hotword","coldword","cup4"]
      var node = loadNode(res.reCup,UIList)
      if(type!="normal"){
        node.hotword.setVisible(true)
        node.sgg = node.sg.getChildByName("sgg1")
        node.sgg.setVisible(true)

        var air1 = createWaterAir({
                            total: 15,
                            width: 5,
                            height: 20,
                            dis:200,
                            disvar:10,
                            timevar:0.3,
                            canOp:true
                        })
        air1.setPosition(80,0)
        node.cup4.addChild(air1)

        node.playSgac = function(){
            var ac = createAnimation({
                                frame:"sgg%02d.png",
                                start:0,
                                end:19,
                                time: 0.3,
                                fun:function(){
                                    if(fun){
                                        fun()
                                    }
                                }
                            })
            node.sgg.stopAllActions()
            node.sgg.runAction(ac)
        } 
      }else{
        node.coldword.setVisible(true)
        node.sgg = node.sg.getChildByName("sgg2")
        node.sgg.setVisible(true)
        node.playSgac = function(){
            var ac = createAnimation({
                                frame:"sgg%02d.png",
                                start:20,
                                end:39,
                                time: 0.3,
                                fun:function(){
                                    if(fun){
                                        fun()
                                    }
                                }
                            })
            node.sgg.stopAllActions()
            node.sgg.runAction(ac)
        } 
      }
      createTouchEvent({
        item:node.sg,
        begin:function(){
          if(Touches){
            Touches = false

          }
          return true
        },
        move:function(data){
          var item = data.item
          var delta = data.delta
          tempx = item.x + delta.x
          tempy = item.y + delta.y
          if(tempy<= 80){
              tempy = 80
          }
          item.y = tempy
          if(item.y<=267){
            if(!item.canIn){
              item.x = -1.5
            }else{
              item.x = -214
            }
          }else{
            if(tempx>=3){
              tempx = 3
            }else if(tempx<=-270){
              tempx = -270
            }
            if(item.x<=-85){
              item.canIn = true
            }else{
              item.canIn = false
            }
            item.x = tempx
          }
        },
        end:function(data){
          Touches = true
          var item = data.item
          if(item.canIn){
            item.setRotation(37)
            item.setPosition(-192,50)
            item.removeListen()
            if(node.playSgac){
              node.playSgac()
            }
          }else{
            item.setPosition(-1.5,80)
          }
        }
      })
      return node
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
              self.seeword1.runAction(cc.sequence(
                cc.fadeIn(1),
                cc.callFunc(function(){
                  self.speakeBykey("wenzi1")
                })
              ))
            })
        }
    },
    speakeBykey:function(key){
        this.nodebs.say({
                    key: key,
                    force: true
                })
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
            sound: res.zimp1
        })
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zimp2
        })
    }
})