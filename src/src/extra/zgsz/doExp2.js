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
        this.expCtor({
            vis: false,
            setZ:800,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                  if(!self.bggg) {
                    var colors = []
                    for(var i=0; i<4; i++){
                      colors[i] = cc.color(200,5,160)
                    }
                    var bgg = createBiaoge({
                      json:res.bg_biao2,
                      scale: 0.9,
                      inputNum:4,
                      rootColor:colors
                    })
                    self.addChild(bgg)
                    self.bggg = bgg
                  }
                  var bgg = self.bggg
                  bgg.show()
                },
            }
        })  
        this.initUI()
        this.initPeople()
        return true
    },
    createPing:function(){
      var self = this
      this.two = new cc.Sprite(res.two00)
      this.two.setPosition(400,370)
      this.addChild(this.two)
      this.two.setAnchorPoint(0.5,0.63)
      this.two.testRect = cc.rect(355,80,90,270)
      this.two.juanRect = cc.rect(660,300,90,200)
      this.two.cupRect = cc.rect(630,350,60,200)
      this.two.playJian = function(data){
         var item = data.item
         var fun = data.fun
         var ac = createAnimation({
                              ifFile:true,
                              frame:"two%02d",
                              start:0,
                              end: 35,
                              time: 0.1,
                              fun:function(){
                                  item.setVisible(true)
                                  if(fun){
                                   fun(2)
                                  }
                              }
                          })
         var ac1 = createAnimation({
                              ifFile:true,
                              frame:"two%02d",
                              start:36,
                              end: 81,
                              time: 0.1,
                              fun:function(){
        
                              }
                          })
         this.runAction(cc.sequence(ac,ac1))
      }
      this.two.index = 2
      this.two.Touch = true
      createTouchEvent({
        item:this.two,
        begin:function(data){
          var item = data.item
          var result = judgeOpInPos(data)
          if(item.Touch){
            self.speakeBykey(self.musicId)
            result = false
          }
          return result
        },
        end:function(data){
           var item = data.item
           item.removeListen()
           item.runAction(cc.sequence(
              cc.spawn(
                 cc.rotateTo(1,180),
                 cc.moveTo(0.5,cc.p(705,400))
              ),
              cc.moveTo(0.3,cc.p(705,250)),
              cc.callFunc(function(){
                 self.two.removeFromParent()
                 self.one.removeFromParent()
                 self.createHereFDJ()
                 self.musicId = "wenzi11"
                 self.lock[1] = false
                 self.speakeBykey(self.musicId)
              })
           ))
        }
      })
    
      this.one = new cc.Sprite(res.one00)
      this.one.setPosition(700,230)
      this.addChild(this.one)
      this.one.testRect = cc.rect(655,80,90,270)
      this.one.juanRect = cc.rect(660,80,90,230)
      this.one.playJian = function(data){
         var item = data.item
         var fun = data.fun
         var ac = createAnimation({
                              ifFile:true,
                              frame:"one%02d",
                              start:0,
                              end: 38,
                              time: 0.1,
                              fun:function(){
                                item.setVisible(true)
                                if(fun){
                                   fun(1)
                                }
                              }
                          })
         this.runAction(ac)
      }
      this.one.index = 1
      this.spList = [this.two,this.one]
    },
    initUI:function(){
        var self = this
        self.musicId = "wenzi9"
        self.keyindex = 1
        self.lock =[false,true,true,true,true,true,true]
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.createPing()

        var createItem = function(data){
            var key = data.key
            var img = data.img
            var scale = data.scale
            var pos = data.pos
            self.fdj.createNew({
                              key:key,
                              fun: function(){
                                 var pancil = new cc.Sprite(img)
                                 pancil.setScale(scale)
                                 pancil.setPosition(pos)
                                 return pancil
                              }
                          })
            return self.fdj.getOut(key)
        }
        var getFirst = function(status,temppos){
            self.needDraw = true
            var toPos = cc.p(temppos.x,temppos.y)
            var spA = self.fdj.getOut("waterClock").getPaper(status)
            self.firPos = spA.convertToNodeSpace(toPos)
            self.fdjSameAction({
              key:"waterClock",
              fun:function(item){
                self.curIndex = item.addDrawNode(status,self.firPos)
              }
            })
        }
        this.toolbtn = createTool({
            pos:cc.p(90, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.1),
            itempos:cc.p(1, -14),
            circlepos:cc.p(0,15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            counts:[1,2,999,1,1,1,1],
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(self.lock[index]){
                  self.speakeBykey(self.musicId)
                  return false
                }
                if(index==0){
                  item.pulsCount = 0
                }else if(index==1){
                  var keyStr = sprintf("juan%d",self.keyindex++)
                  item = createItem({
                          key:keyStr,
                          img:res.bigitem10,
                          scale:0.4,
                          pos:pos
                        })
                  item.keyStr = keyStr
                  item.nopos = true
                }else if(index==3){
                  item = createWatch()
                  item.setScale(0.6)
                  item.opJudge = true
                }else if(index==2){
                  var keyStr = sprintf("shaobei%d",self.keyindex++)
                  item = createItem({
                          key:keyStr,
                          img:res.bigitem3,
                          scale:0.36,
                          pos:pos
                        })
                  item.keyStr = keyStr
                  item.nopos = true
                }else if(index==4){
                 item = createItem({
                          key:"pancil",
                          img:res.pancil,
                          scale:0.4,
                          pos:pos
                        })
                 item.nopos = true
                }else if(index==5){
                  self.fdj.createNew({
                              key:"ruler",
                              fun:function(){
                                  var ruler = createRuler({
                                    max:20,
                                    devide:19,
                                    seg: 0.5,
                                    add: 1,
                                    height: 70,
                                    lineModify: cc.p(0, 3),
                                    fontModify: cc.p(0, 5),
                                    rotate:90,
                                  })
                                  ruler.setPosition(pos)
                                  return ruler
                              }
                          })
                  item = self.fdj.getOut("ruler")
                  item.nopos = true
                }else if(index==6){
                 item = createItem({
                          key:"eraser",
                          img:res.eraser,
                          scale:0.4,
                          pos:pos
                        })
                 item.nopos = true
                }
                return item
            },
            clickfun:function(data){
                var item = data.sp
                var index = data.index
                if(item.IsMove){
                  return false
                }
                if(index==4){
                    var temppos = cc.p(item.x-item.width*1/5,item.y-item.height*1/5)
                    self.needDraw = false
                    if(cc.rectContainsPoint(self.paperRect,temppos)){
                       getFirst("A",temppos)
                       self.curStatus = "A"
                    }
                    if(cc.rectContainsPoint(self.paperRect1,temppos)){
                       getFirst("B",temppos)
                       self.curStatus = "B"
                    }
                }
                return true
            },
            movefun:function(data){
               var item = data.sp
               if(!item.IsMove){
                  self.moveEvent(data)
               }   
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               if(index==1 || index==2){
                if(!item.isVisible()){
                  self.fdjSameAction({
                      key:item.keyStr,
                      fun:function(item){
                        item.removeFromParent()
                      }
                  })
                }else{
                    item.IsMove = false
                }
               }
               return true
            },
            backfun:function(data){
              return true
            },
            father:toolnode,
            files:[res.item7,res.item8,res.item6,res.item3,res.item10,res.item11,res.item12],
            gets:[res.bigitem9,null,null,null,null,null,null]
        })
        this.addChild(this.toolbtn,3)
    },
    eraserFun:function(status,temppos){
      var self = this
      var spA = self.fdj.getOut("waterClock").getPaper(status)
      var posA = spA.convertToNodeSpace(temppos)
      self.fdj.getOut("waterClock").changeRed(status,posA.y,function(index){
          self.fdjSameAction({
             key:"waterClock",
             fun:function(item){
               item.RedByIndex(status,index)
             }
          })
      })
    },
    moveEvent:function(data){
       var self = this
       var item = data.sp
       var delta = data.delta
       var index = data.index
       if(index==0){
         var temppos = cc.p(item.x + delta.x,item.y + delta.y)
         item.setPosition(temppos)
         var temp = cc.rect(item.x-80,item.y-20,160,50)
         for(var i=0; i<self.spList.length; i++){
           if(cc.rectIntersectsRect(self.spList[i].testRect,temp) 
            && !self.spList[i].jian){
              item.IsMove = true
              item.setVisible(false)
              self.spList[i].jian = true
              item.pulsCount++
              var curspindex = self.spList[i].index
              var posA = curspindex==1 ? cc.p(620,305):cc.p(340,100)
              self.musicId = curspindex==1 ? "wenzi9" : "wenzi12"
              item.setPosition(posA)
              self.spList[i].playJian({
                  item:item,
                  fun:function(){
                     item.IsMove = false
                     if(item.pulsCount==2){
                       item.setVisible(false)
                       self.musicId = "wenzi10"
                       self.speakeBykey(self.musicId)
                       self.two.Touch = false
                     } 
                  }
              })
              break
           }
         }
       }else if(index==1){
          var temppos = item.getPosition()
          for(var i= 0; i<self.spList.length; i++){
            if(cc.rectContainsPoint(self.spList[i].juanRect,temppos) 
              && !self.spList[i].juan){
               item.IsMove = true
               item.removeListen()
               self.fdjSameAction({
                  key:item.keyStr,
                  fun:function(item){
                    item.setVisible(false)
                  }
               })
               self.spList[i].juan = true
               var curspindex = self.spList[i].index
               if(curspindex==1){
                  self.fdjSameAction({
                    key:"waterClock",
                    fun:function(item){
                      item.playDownCircle()
                    }
                  })
                  self.musicId = "wenzi13" 
                  self.speakeBykey(self.musicId)
                  for(var i=2; i<7; i++){
                    self.lock[i] = false
                  }
               }else{
                  self.fdjSameAction({
                    key:"waterClock",
                    fun:function(item){
                      item.playUpCircle()
                    }
                  }) 
               }
               break
            }  
          } 
          self.fdjSameAction({
            key:item.keyStr,
            fun:function(item){
              var temppos = cc.p(item.x + delta.x,item.y + delta.y)
              item.setPosition(temppos)
            }
          })
       }else if(index==3){
         var temppos = cc.p(item.x + delta.x,item.y + delta.y)
         item.setPosition(temppos)
       }else if(index==2){
          var temppos = item.getPosition()
          if(cc.rectContainsPoint(self.two.cupRect,temppos)){
              item.IsMove = true
              var haveWater = self.fdj.getOut("waterClock").haveWater
              self.fdjSameAction({
                key:item.keyStr,
                fun:function(item){
                  item.setPosition(500,440)
                  if(!haveWater){
                    item.setVisible(false) 
                  } 
                }
              })
              if(haveWater){
                self.musicId = "wenzi18"
                self.speakeBykey(self.musicId)
              }
              self.fdjSameAction({
                key:"waterClock",
                fun:function(item){
                  if(!haveWater){
                     item.playPushWater()
                     item.haveWater = true
                  }
                }
              })
          }
          self.fdjSameAction({
            key:item.keyStr,
            fun:function(item){
              var temppos = cc.p(item.x + delta.x,item.y + delta.y)
              item.setPosition(temppos)
            }
          })
       }else if(index==4){
          if(self.needDraw){
            var toPos = cc.p(item.x-item.width*1/5,item.y-item.height*1/5)
            var spA = self.fdj.getOut("waterClock").getPaper(self.curStatus)
            self.secPos = spA.convertToNodeSpace(toPos)
            self.fdjSameAction({
              key:"waterClock",
              fun:function(item){
                    item.drawLineByIndex({
                       index:self.curIndex,
                       begin:self.firPos,
                       end:self.secPos,
                       status:self.curStatus
                    })
                 }
            })
          }
          self.fdjSameAction({
            key:"pancil",
            fun:function(item){
              var tempx = item.x + delta.x
              var tempy = item.y + delta.y
              if(self.needDraw){
                tempy = item.y
              }
              item.x = tempx
              item.y = tempy
            }
          })
       }else if(index==5){
          self.fdjSameAction({
            key:"ruler",
            fun:function(item){
              var temppos = cc.p(item.x + delta.x,item.y + delta.y)
              item.setPosition(temppos)
            }
          })
       }else if(index==6){
          var temppos = cc.p(item.x-item.width*1/5+10,item.y-item.height*1/5+10)
          if(cc.rectContainsPoint(self.paperRect,temppos)){
             self.eraserFun("A",temppos)
          }
          if(cc.rectContainsPoint(self.paperRect1,temppos)){
             self.eraserFun("B",temppos)
          }
          self.fdjSameAction({
            key:"eraser",
            fun:function(item){
              var temppos = cc.p(item.x + delta.x,item.y + delta.y)
              item.setPosition(temppos)
            }
          })
       }
    },
    fdjSameAction:function(data){
        var key = data.key
        var fun = data.fun
        var self = this
        self.fdj.runData({
                    key:key,
                    fun:function(data){
                       var item = data.item
                       if(fun){
                         fun(item)
                       }
                    }
                  }) 
    },
    createHereFDJ:function(){
        var self = this
        var fdj = createFDJ({
          father: self.toolnode,
          rootScale: 0.3,
          perscale: 0.1,
          max: 0.4,
          min: 0.1,
          seePos: [cc.p(200, 80)],
          getPos: [cc.p(700, 230)],
        })
        
        self.fdj = fdj
        fdj.get[0].setVisible(true)
        fdj.see[0].setVisible(true)
        fdj.see[0].setScale(0.7)
        fdj.actMove()

        //创建铁架台
        fdj.createNew({
          key:"waterClock",
          fun:function(){
             var waterClock = self.addWaterClock()
             waterClock.setPosition(704.2,189.3)
             return waterClock
          }
        })
        var clearBtn = fdj.getOut("waterClock").clearBtn
        fdj.getIn("waterClock").clearBtn.setEnabled(false)
        clearBtn.addClickEventListener(function(){
                      self.fdjSameAction({
                        key:"waterClock",
                        fun:function(item){
                          item.clearBtn.setVisible(false)
                          item.resetAll()
                          item.haveWater = false
                        }
                      })
                  })
        self.paperRect = cc.rect(676,79,27,172)
        self.paperRect1 = cc.rect(687,310,27,189)
    },
    addWaterClock:function(){
      var self = this
      var clock = new cc.Node()
      var ping1 = new cc.Sprite(res.ping1)
      ping1.setPosition(0,181)
      clock.addChild(ping1)
      ping1.setScale(0.32)

      var ping2 = new cc.Sprite(res.ping2)
      clock.addChild(ping2)
      ping2.setScale(0.32)

      clock.spA = createClip({
                           toShowimg:res.ping3,
                           ShowimgPos:cc.p(-15,-219),
                           toSencilimg:res.ping3,
                           sencilPos:cc.p(-15,4),
                           father:clock,
                           scale:cc.p(0.32,0.32)
                       })
      clock.circleA = new cc.Sprite(res.ping4)
      clock.circleA.setScale(0.32)
      clock.circleA.setPosition(-6.5,-110)
      clock.circleA.setVisible(false)
      clock.addChild(clock.circleA)
      clock.spA.list = []
      clock.addDrawNode = function(status,pos){
         var temp = this.spA
         switch(status){
           case "A":
             temp = this.spA
           break
           case "B":
             temp = this.spB
           break
         }
         var len = temp.list.length
         var anode = new cc.DrawNode()
         anode.Hi = pos.y
         temp.addChild(anode)
         temp.list[len] = anode
         return len
      }
      clock.getPaper = function(status){
         switch(status){
          case "A":
             return this.spA
          break
          case "B":
             return this.spB
          break
         }
      }
      clock.drawLineByIndex = function(data){
         var index = data.index
         var begin = data.begin
         var end = data.end
         var status = data.status
         var temp = this.spA
         switch(status){
           case "A":
             temp = this.spA
           break
           case "B":
             temp = this.spB
           break
         }
         var draw = temp.list[index]
         draw.drawSegment(begin,end,2,cc.color(0, 0, 0))
      }
      clock.changeRed = function(status,dis,fun){
         var temp = this.spA
         switch(status){
           case "A":
             temp = this.spA
           break
           case "B":
             temp = this.spB
           break
         }
         for(var i =0; i<temp.list.length; i++){
            var cha = temp.list[i].Hi - dis
            if(cha >0 && cha<10){
               if(fun){
                  fun(i)
               }
            }
         }
      }
      clock.RedByIndex = function(status,index){
         var temp = this.spA
         switch(status){
           case "A":
             temp = this.spA
           break
           case "B":
             temp = this.spB
           break
         }
        temp.list[index].clear()
      }

      clock.spB = createClip({
                           toShowimg:res.ping3,
                           ShowimgPos:cc.p(-4,422),
                           toSencilimg:res.ping3,
                           sencilPos:cc.p(-4,201),
                           father:clock,
                           scale:cc.p(0.32,0.32)
                       })
      clock.circleB = new cc.Sprite(res.ping4)
      clock.circleB.setPosition(4,320)
      clock.circleB.setScale(0.32)
      clock.circleB.setVisible(false)
      clock.addChild(clock.circleB)
      clock.spB.list = []

      clock.waterZ = createClip({
                           toShowimg:res.daoshui45,
                           ShowimgPos:cc.p(0.5,128),//128
                           toSencilimg:res.daoshui45,
                           sencilPos:cc.p(0.5,-28),
                           sencilScale:cc.p(2,0.32),
                           father:clock,
                           scale:cc.p(0.7,0.32)
                       })
      clock.di = createClip({
                           toShowimg:res.di06,
                           ShowimgPos:cc.p(5,-118),//128
                           toSencilimg:res.daoshui45,
                           sencilPos:cc.p(2,240),
                           sencilScale:cc.p(2,1),
                           father:clock.waterZ,
                           scale:cc.p(0.3,0.6)
                       })
      clock.di.setVisible(false)
      clock.playDiwater = function(){
        var waterZ = this.waterZ
        var di = this.di
        di.setVisible(true)
        waterZ.setOpacity(0)
        var ac = createAnimation({
                          ifFile:true,
                          frame:"di%02d",
                          start:0,
                          end: 23,
                          time:0.1,
                          fun:function(){
                          }
                        })
        di.runAction(cc.repeatForever(ac))
      }
      
      clock.daoshui = new cc.Sprite(res.daoshui00)
      clock.daoshui.setPosition(-125,360)
      clock.daoshui.setScale(0.65)
      clock.addChild(clock.daoshui)
      clock.daoshui.setOpacity(0)

      clock.level1 = new cc.Sprite(res.daoshui44)
      clock.level1.setPosition(0,76)
      clock.level1.setScale(0.13)
      clock.level1.initPos = clock.level1.getPosition()
      clock.addChild(clock.level1)
      clock.level1.setVisible(false)

      clock.level2 = new cc.Sprite(res.daoshui44)
      clock.level2.setPosition(0,-108)
      clock.level2.setScale(0.22)
      clock.level2.initPos = clock.level2.getPosition()
      clock.addChild(clock.level2)

      clock.clearBtn = new ccui.Button(res.ping5,res.ping6)
      clock.clearBtn.setPosition(150,175)
      clock.clearBtn.setScale(0.32)
      clock.addChild(clock.clearBtn)
      clock.clearBtn.setVisible(false)

      clock.resetAll = function(){
         var level1 = this.level1
         var level2 = this.level2
         var daoshui = this.daoshui
         var waterZ = this.waterZ
         var di = this.di
         waterZ.stopAllActions()
         level1.stopAllActions()
         level2.stopAllActions()
         di.stopAllActions()
         daoshui.setTexture(res.daoshui00)
         level1.setPosition(level1.initPos)
         level1.setScale(0.13)
         level2.setPosition(level2.initPos)
         level2.setScale(0.22)
         waterZ.setPosition(-0.5,128)
         waterZ.setOpacity(255)
         di.setVisible(false)
      }
      clock.playLevel1 = function(judgeGo){
         var  level1 = this.level1
         if(judgeGo){
            level1.setVisible(true)
            level1.runAction(cc.sequence(
              cc.delayTime(1),
              cc.spawn(
                  cc.scaleTo(0.5,0.32,0.32),
                  cc.moveBy(0.7,cc.p(0,50))
              ),
              cc.moveTo(0.8,cc.p(0,230))  
            ))
          }else{
            level1.runAction(cc.sequence(
              cc.moveTo(180,cc.p(0,125)),
              cc.spawn(
                 cc.moveBy(90,cc.p(0,-30)),
                 cc.sequence(
                   cc.scaleTo(90,0.245,0.235),
                   cc.callFunc(function(){
                      level1.runAction(cc.spawn(
                         cc.moveBy(50,cc.p(0,-20)),
                         cc.sequence(
                            cc.scaleTo(50,0.1,0.1),
                            cc.callFunc(function(){
                              level1.setVisible(false)
                            })
                         )
                      ))
                   })
                 )
              )
            ))
          }
      }
      clock.playLevel2 = function(){
         var level2 = this.level2
         var waterZ = this.waterZ
         var time = 172
         var dis = 110
         var clock = this
          level2.setVisible(true)
          level2.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(3.7,0.32,0.32),
                cc.moveBy(4,cc.p(0,11))
            ),  
            cc.moveBy(time,cc.p(0,dis-1)),
            cc.moveBy(90,cc.p(0,20)),
            cc.moveBy(50,cc.p(0,5))
          ))
          waterZ.runAction(cc.sequence(
            cc.moveTo(0.09,cc.p(0.5,-28)),
            cc.moveTo(2.7,cc.p(0.5,-23)),
            cc.moveBy(time,cc.p(0,dis)),
            cc.callFunc(function(){
                self.musicId = "wenzi17"
                self.speakeBykey(self.musicId)
            }),
            cc.moveBy(90,cc.p(0,20)),
            cc.callFunc(function(){
                clock.playDiwater()
                clock.di.runAction(cc.moveBy(50,cc.p(0,-18)))
            }),
            cc.delayTime(50),
            cc.callFunc(function(){
               clock.di.stopAllActions()
               clock.di.setVisible(false)
            })
          ))
      }
      clock.playDownCircle = function(){
         var spA = this.spA
         var circleA = this.circleA
         var time = 2
         var dis = 180
         circleA.setVisible(true)
         spA.runAction(cc.moveBy(time,cc.p(0,dis)))
         circleA.runAction(cc.sequence(
           cc.moveBy(time,cc.p(0,dis+15)),
           cc.fadeOut(0.1),
           cc.callFunc(function(){
              circleA.setVisible(false)
           })
         ))
      }
      clock.playUpCircle = function(){
         var spB = this.spB
         var circleB = this.circleB
         var time = 2
         var dis = -195
         circleB.setVisible(true)
         spB.runAction(cc.moveBy(time,cc.p(0,dis))),
         circleB.runAction(cc.sequence(
           cc.moveBy(time,cc.p(0,dis-15)),
           cc.fadeOut(0.1),
           cc.callFunc(function(){
              circleB.setVisible(false)
           })
         ))
      }
      clock.playPushWater = function(){
        var clock = this
        var daoshui = clock.daoshui
        daoshui.setOpacity(255)
        var ac = createAnimation({
                          ifFile:true,
                          frame:"daoshui%02d",
                          start:0,
                          end: 43,
                          time: 0.08,
                          fun:function(){
                             clock.playLevel1(false)
                             clock.playLevel2()
                             clock.clearBtn.setVisible(true)
                          }
                        })
        daoshui.runAction(cc.sequence(ac,cc.fadeOut(0.1)))
        clock.playLevel1(true)
      }    

      return clock
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
                self.speakeBykey("wenzi9")
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
            key: "wenzi9",
            img:res.wenzi9,
            sound: res.zimp9
        })

        addContent({
            people: this.nodebs,
            key: "wenzi13",
            img:res.wenzi13,
            sound: res.zimp13
        })

        addContent({
            people: this.nodebs,
            key: "wenzi12",
            img:res.wenzi12,
            sound: res.zimp12
        })

        addContent({
            people: this.nodebs,
            key: "wenzi11",
            img:res.wenzi11,
            sound: res.zimp11
        })

        addContent({
            people: this.nodebs,
            key: "wenzi10",
            img:res.wenzi10,
            sound: res.zimp10
        })
        addContent({
            people: this.nodebs,
            key: "wenzi18",
            img:res.wenzi18,
            sound: res.zimp18
        })
        addContent({
            people: this.nodebs,
            key: "wenzi17",
            img:res.wenzi17,
            sound: res.zimp17
        })
    }  
})