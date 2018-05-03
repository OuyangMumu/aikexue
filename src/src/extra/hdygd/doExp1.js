//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.biao1,
                      scale: 0.9,
                      inputNum:4,
                  })
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            },
            ifCount:true
          }
        })
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var uiName = ["pi3","pi2","pi2_1","pi_tip","shen1",
        "shen3_1","shen3","shen2","car","car3","car3_1"]
        var node = loadNode(res.do1,uiName)
        this.inside_node.addChild(node)
        this.node = node
        self.mocaFn1 = parseFloat(Math.random() + 0.5).toFixed(1)
        self.mocaFn2= parseFloat(Math.random()*2 + 1.5).toFixed(1)

        var self = this
        var fdj = createFDJ({
          father: self,
          rootScale: 0.24,
          perscale: 0.1,
          max: 0.4,
          min: 0.1,
          seePos: [cc.p(500, 380)],
          //getPos: [cc.p(430, 235)],
          getPos: [cc.p(415, 200)],
        })

        self.fdj = fdj
        fdj.get[0].setVisible(false)
        fdj.see[0].setVisible(true)
        fdj.see[0].setScale(0.7)
        //fdj.actMove()
        //创建水罐
        fdj.createNew({
          key:"thclj",
          fun:function(){
             var tan = self.createTan()
             //tan.setPosition(375,235)
             tan.setPosition(360,200)
             return  tan
          }
        })

        self.addSomeEvent()
    },
    addSomeEvent:function(){
       var self = this
       var node = self.node
       node.car.haveCa = false
       createTouchEvent({
          item:node.pi3,
          begin:function(data){
            if(node.car.haveCa){
              return false
            }
            var pos = data.pos
            var item = data.item
            item.setVisible(false)
            item.mov = new cc.Sprite(res.pi1)
            item.mov.setPosition(pos)
            self.addChild(item.mov)
            if(node.pi_tip.isVisible()){
              node.pi_tip.setVisible(false)
            }
            return true
          },
          move:function(data){
            var delta = data.delta
            var item = data.item
            if(item.mov){
               item.mov.x += delta.x
               item.mov.y += delta.y
            }
          },
          end:function(data){
            var item = data.item
            if(item.mov){
              var result1 = judgeItemCrash({
                               item1:node.pi2,
                               item2:item.mov
                            })
              var result2 = judgeItemCrash({
                               item1:node.pi2_1,
                               item2:item.mov
                            })
              item.mov.removeFromParent()
              if(result1 || result2){
                node.pi2.setVisible(true)
                node.pi2_1.setVisible(true)
                node.car.haveCa = true
              }else{
                item.setVisible(true)
              }
            }
          }
       })
       
       node.upOrdown = function(isUP){
          var node = this
          if(isUP == null){
            isUP = false
          }
          node.shen2.setVisible(isUP)
          node.shen3_1.setVisible(isUP)
          node.shen3.setVisible(!isUP)
          node.shen1.setVisible(!isUP)
          var tan = self.fdj.getOut("thclj")
          var dis = isUP ? cc.p(15,35) : cc.p(-15,-35)
          var movPos = cc.p(tan.x + dis.x,tan.y + dis.y)
         // node.hand.setPosition(node.hand.x+dis.x,node.hand.y+dis.y)
          self.fdj.runData({
              key:"thclj",
              fun:function(data){
                 data.item.setPosition(movPos)
              }
          })
          var getSee = self.fdj.get[0]
          var seepos = cc.p(getSee.x + dis.x, getSee.y + dis.y)
          self.fdj.setGet(seepos)

          var gou = self.fdj.getOut("thclj").tan
          var finalPos = getWorldPos(gou)
          node.hand.setPosition(finalPos.x+103,finalPos.y + 8)
       }
       node.needMove = function(delta){
          var node = this
          node.car.x += delta.x
          var tan = self.fdj.getOut("thclj")
          var movPos = cc.p(tan.x+delta.x,tan.y)
          self.fdj.runData({
              key:"thclj",
              fun:function(data){
                 data.item.setPosition(movPos)
              }
          })
          var getSee = self.fdj.get[0]
          self.fdj.setGet(cc.p(getSee.x+delta.x, getSee.y))
          var gou = self.fdj.getOut("thclj").tan
          var finalPos = getWorldPos(gou)
          node.hand.setPosition(finalPos.x+103,finalPos.y+8)
       }
       
       node.curDis = 0
       node.wodis = 0
       node.changeMoca = function(Fn,data){
          var delta = data.delta
          var item = data.item
          var dis = null
          var comparFn = Fn*10
          var gou = self.fdj.getOut("thclj").tan
          if(delta){
            dis = node.curDis + delta.x
          }
          if(Fn==0){
            self.fdj.runData({
              key:"thclj",
              fun:function(data){
                 var item = data.item
                 item.tan.x = 480
                 item.changeX(0)
              }
            })
            //item.x = item.x - node.curDis
            node.curDis = 0
          }else{ 
            if(dis <= comparFn && dis>=0){
              node.curDis = dis
              var disCUr = dis*5
              self.fdj.runData({
                key:"thclj",
                fun:function(data){
                  var item = data.item
                  item.tan.x = 480 + disCUr
                  item.changeX(disCUr)
                }
              })
              var finalPos = getWorldPos(gou)
              item.setPosition(finalPos.x+103,finalPos.y+8)
            }else{
              if(dis>=0){
                if(node.curDis != comparFn){
                  node.curDis = comparFn
                  var disCUr = comparFn*5
                  self.fdj.runData({
                    key:"thclj",
                    fun:function(data){
                        var item = data.item
                        item.tan.x = 480 + disCUr
                        item.changeX(disCUr)
                      }
                    })
                }
                node.needMove(delta)
                if(!node.car.haveCa){
                  node.moveCarTool(delta.x,1)
                }
              }else{
                  node.curDis = 0
              }
            }  
          }
       }
       node.moveCarTool = function(distance,jude){
          var speed = 10
          var time = distance/speed
          var radius = 100
          var cicle = speed / radius / Math.PI * 180

          var loop = [
            node.car3,
            node.car3_1
          ]
          for (var i = 0; i < loop.length; i++){
            loop[i].stopAllActions()
          }
          for (var i = 0; i < loop.length; i++) {
             loop[i].setRotation(loop[i].getRotationX() + cicle*jude)
          }
       }

       var hand = new cc.Sprite(res.hand)
       hand.setPosition(508,207)
       self.addChild(hand)
       node.hand = hand
       
       var handTip = new cc.Sprite(res.handTip)
       handTip.setPosition(100,100)
       handTip.setScale(0.8)
       hand.addChild(handTip)
       hand.handTip = handTip

       createTouchEvent({
          item:hand,
          begin:function(data){
            var pos = data.pos
            var item = data.item
            item.removeAllChildren()
            node.upOrdown(true)
            item.start_pos = item.getPosition()
            return true
          },
          move:function(data){
            var delta = data.delta
            var pos = data.pos
            var item = data.item
            if(item.x <= 980){
              if(node.car.haveCa){
                node.changeMoca(self.mocaFn2,data)
              }else{
                node.changeMoca(self.mocaFn1,data)
              }
            }
          },
          end:function(data){
            var item = data.item
            node.changeMoca(0,data)
            node.upOrdown(false)
          }
       })
       createTouchEvent({
          item:node.car,
          begin:function(data){
            var pos = data.pos
            var item = data.item
            return true
          },
          move:function(data){
            var delta = data.delta
            var pos = data.pos
            var item = data.item
            if(delta.x<0){
                var tempx = item.x + delta.x
                if(tempx >= 185){
                  node.needMove(delta)
                  if(!node.car.haveCa){
                    node.moveCarTool(delta.x,-1)
                  }
                }
            }
          }
       })
       var addPiTouch = function(item){
          createTouchEvent({
              item:item,
              begin:function(data){
                var pos = data.pos
                var item = data.item
                if(node.car.haveCa){
                  node.pi2.setVisible(false)
                  node.pi2_1.setVisible(false)

                  item.mov = new cc.Sprite(res.pi1)
                  item.mov.setPosition(pos)
                  self.addChild(item.mov)
                  return true
                }else{
                  return false
                }
              },
              move:function(data){
                var delta = data.delta
                var item = data.item
                if(item.mov){
                   item.mov.x += delta.x
                   item.mov.y += delta.y
                }
              },
              end:function(data){
                var item = data.item
                if(item.mov){
                  var result1 = judgeItemCrash({
                                   item1:node.pi2,
                                   item2:item.mov
                                })
                  var result2 = judgeItemCrash({
                                   item1:node.pi2_1,
                                   item2:item.mov
                                })
                  item.mov.removeFromParent()
                  if(result1 || result2){
                    node.pi2.setVisible(true)
                    node.pi2_1.setVisible(true)
                    node.car.haveCa = true
                  }else{
                    node.pi3.setVisible(true)
                    node.car.haveCa = false
                  }
                }
              }
           })
       }
       addPiTouch(node.pi2)
       addPiTouch(node.pi2_1)
    },
    createTan:function(){
      var tance = new cc.Sprite(res.tanh)

      var tan = new cc.Sprite(res.tance)
      tan.setPosition(480,30)
      tance.addChild(tan)
      tance.tan = tan
          
      var ponitX = new cc.Sprite(res.ponitX)
      ponitX.setPosition(455,82)
      ponitX.setScale(1,0.8)
      tan.addChild(ponitX)
      tance.ponitX = ponitX
      tance.changeX = function(dis){
         var tance = this
         var dx = 455 - dis
         tance.ponitX.stopAllActions()
         tance.ponitX.runAction(cc.moveTo(0.1,cc.p(dx,82)))
         var ds = 0.47 + dis/90
         tance.th.stopAllActions()
         tance.th.runAction(cc.scaleTo(0.1,ds,0.65))
      }

      var th = new cc.Sprite(res.th)
      th.setAnchorPoint(1,0.5)
      th.setPosition(498,83)
      th.setScale(0.47,0.65)
      tan.addChild(th)
      tance.setScale(0.2)
      tance.th = th
      return tance
    },
    speakeBykey:function(key){
      var self = this
      if(!self[key]){
        self[key] = true
        self.nodebs.say({
                    key: key,
                    force: true
                })
      }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi2",
                    force: true,
                    fun:function(){
                      self.speakeBykey("wenzi3")
                    }
                })
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
            key:"wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })

    }  
})