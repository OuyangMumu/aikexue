//@author mu @16/5/11
var tag_Move = 888
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
                    if(!self.bggg) {
                        var colors = []
                        for(var i=0; i<17; i++){
                           colors[i] = cc.color(200,5,160)
                        }
                        var bglist = ["bg1","bg2","bg3","btn_bg1", "btn_bg2","btn_bg3"]
                        var bgg = createBiaoge({
                          json:res.bg_biao1,
                          scale: 0.9,
                          inputNum:17,
                          rootColor:colors
                        })
                        loadList(bgg,bglist)
                        var btnSet = function(bg){
                          bgg.bg1.setVisible(false)
                          bgg.bg2.setVisible(false)
                          bgg.bg3.setVisible(false)
                          bg.setVisible(true)
                        }
                        bgg.btn_bg1.addClickEventListener(function(){
                           btnSet(bgg.bg1)
                        })
                        bgg.btn_bg2.addClickEventListener(function(){
                           btnSet(bgg.bg2)
                        })
                        bgg.btn_bg3.addClickEventListener(function(){
                           btnSet(bgg.bg3)
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
    initUI:function(){
        var self = this

        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        self.downNone = 0
        self.upItemindex = null
        self.keyindex = 0
        self.curStr = null

        var list =[
          {key:"yihao",img:res.bigitem1},
          {key:"erhao",img:res.bigitem2},
          {key:"mb",img:null},
          {key:"sb",img:null},
          {key:"dlt",img:null},
          {key:"ssb",img:res.bigitem3},
        ]
        self.list = list
        var createAll = function(data){
            var pos = data.pos
            var img = data.img
            var index = data.index
            var rock = null
            if(img){
                rock = new cc.Sprite(img)
                rock.setScale(0.4)
                if(index==5){
                  rock.setScale(0.35)
                }
            }else{
              if(index==3){
                rock = createWatch()
                rock.setScale(0.6)
                rock.opJudge = true
              }else if(index==2){
                rock = self.createEmpty()
                rock.topos = cc.p(775,123)
              }else if(index==4){
                rock = self.createEmpty("lt")
                rock.topos = cc.p(782,158)
              }     
            }
            if(index<=1){
              var imgres = index == 1 ? res.bigitem8 : res.bigitem7
              var gai = new cc.Sprite(imgres)
              gai.setPosition(5,75)
              gai.setScale(0.9)
              rock.addChild(gai)
              rock.bigGai = gai
              gai.setVisible(false)
            }
            
            rock.setPosition(pos)
            rock.index = index
            rock.setLocalZOrder(LOCAL_ORDER++)
            return rock
        }
        self.createHereFDJ()
        this.toolbtn = createTool({
            pos:cc.p(90, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.1),
            itempos:cc.p(1, -12),
            circlepos:cc.p(0,15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            counts:[1,1,99,1,99,99],
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                var keyStr = sprintf(list[index].key + "%d",self.keyindex++)
                self.fdj.createNew({
                              key:keyStr,
                              fun: createAll,
                              buf:{
                                  pos:data.pos,
                                  img:list[index].img,
                                  index:index
                              }
                          })
                item = self.fdj.getOut(keyStr)
                item.keyStr = keyStr
                return item
            },
            clickfun:function(data){
                var item = data.sp
                var index = data.index
                if(item.IsMove){
                  return false
                }
                if(index==3){
                   self.fdjSameAction(item.keyStr,function(item){
                     item.setLocalZOrder(LOCAL_ORDER++)
                  }) 
                }
                if(index<=1){
                   self.fdjSameAction(item.keyStr,function(item){
                    item.bigGai.setVisible(false)
                    item.setLocalZOrder(LOCAL_ORDER++)
                  })
                }
                if(index==2 || index==4){
                  if(self.curStr == item.keyStr){
                      self.fdjSameAction("tjt",function(item){
                        if(item.haveWater){
                          item.showHand()
                          self.gai.disListen(true)
                        }
                      })
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
               if(index<=1){
                  var ins = item.in
                  if(ins){
                     self.upItemindex = item.keyStr
                     if(!self.wenzi4){
                       self.speakeBykey("wenzi3")
                     }
                     self.fdjSameAction(item.keyStr,function(item){
                       item.setPosition(782,465)
                     })
                  }else{
                      if(self.upItemindex!=null){
                        var staticSp = self.fdj.getOut(self.upItemindex)
                        if(staticSp.x != 782 && staticSp.y != 465){
                          self.upItemindex = null
                        }
                      }
                  }
                  self.fdjSameAction(item.keyStr,function(item){
                      if(!ins){
                         item.bigGai.setVisible(true)
                      } 
                  })
               }
               if(index==2 || index==4){
                  var result = false
                  if(self.curStr==null || self.curStr==item.keyStr){
                     result = true
                  }
                  if(cc.rectContainsPoint(self.tiedown,item.getPosition())){
                      self.speakeBykey("wenzi4")
                      self.showFdj()
                      self.fdjSameAction(item.keyStr,function(item){
                         if(result){
                            item.setPosition(item.topos)
                         }
                      })
                      self.curStr=item.keyStr
                  }else{
                    if(self.curStr!=null){
                        var staticSp = self.fdj.getOut(self.curStr)
                        if(staticSp.x != staticSp.topos.x && staticSp.y != staticSp.topos.y){
                          self.curStr = null
                        }
                    }
                  }
               }
               if(index==5){
                  if(!item.isVisible()){
                      self.speakeBykey("wenzi5")
                      self.fdjSameAction(item.keyStr,function(item){
                         item.removeFromParent()
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
            files:[res.item1,res.item2,res.item4,res.item3,res.item5,res.item6],
            gets:[null,null,null,null,null,null]
        })
        this.addChild(this.toolbtn,3)
    },
    createTjt:function(){
      var tjtNode = new cc.Node()
      tjtNode.setPosition(0,0)
   
      tjtNode.hand = new cc.Sprite(res.do_tjt3)
      tjtNode.hand.setPosition(748,403)
      tjtNode.hand.setScale(0.55)
      tjtNode.addChild(tjtNode.hand)
      tjtNode.hand.setOpacity(0)
      tjtNode.hideHand = function(data){
         var status = data.status || "A"
         var dis = data.dis || 0
         var fun = data.fun
         var fun1 = data.fun1
         var fun2 = data.fun2
         var fun3 = data.fun3
         var hand = this.hand
         var waterZ = this.waterZ
         var waterZ2 = this.waterZ2
         var tjtNode = this
         hand.setTexture(res.do_tjt4)
         hand.runAction(cc.sequence(
            cc.fadeOut(0.2),
            cc.callFunc(function(){
              if(hand.disListen){
                hand.disListen(true)
              } 
              switch(status){
                  case "A":
                     waterZ.setVisible(true)
                     waterZ.stopAllActions()
                     waterZ.runAction(cc.sequence(
                      cc.moveTo(0.5,cc.p(782,225+dis)),
                      cc.callFunc(function(){
                        tjtNode.playWaterLost(fun,fun1,fun2,fun3)
                      })
                     ))
                  break
                  case "B":
                      waterZ2.setVisible(true)
                      waterZ2.start = true
                      var ac = createAnimation({
                          ifFile:true,
                          frame:"di%02d",
                          start:0,
                          end: 23,
                          time:0.035,
                          fun:function(){
                             if(waterZ2.start){
                               waterZ2.start = false
                               tjtNode.playWaterLostTwo(fun,fun1,fun2,fun3)
                             }
                          }
                        })
                      waterZ2.runAction(cc.repeatForever(ac))
                  break
              }
            })
         ))
      }
      tjtNode.changeShuiz = function(dis,status){
         var temp = null
         switch(status){
           case "A":
           temp = this.waterZ
           break
           case "B":
           temp = this.waterZ2
           break
         }
         temp.stopActionByTag(tag_Move)
         var action = cc.moveBy(0.98,cc.p(0,dis))
         action.tag = tag_Move
         temp.runAction(action)
      }
      tjtNode.showHand = function(judge){
         var hand = this.hand
         var waterZ = this.waterZ
         var waterZ2 = this.waterZ2
         var level1 = this.level1
         if(judge==null){
          judge = false
         }
         level1.stopAllActions()

         waterZ.stopAllActions()
         waterZ.setVisible(false)
         waterZ.setPosition(waterZ.initPos)

         waterZ2.stopAllActions()
         waterZ2.setVisible(false)
         waterZ2.setPosition(waterZ2.initPos)

         hand.runAction(cc.sequence(
           cc.fadeIn(0.2),
           cc.callFunc(function(){
              hand.setTexture(res.do_tjt3)
              if(hand.disListen){
                hand.disListen(judge)
              } 
           })
         ))
      }

      var tjt = new cc.Sprite(res.do_tjt1)
      tjt.setPosition(800,290)
      tjt.setScale(0.55)
      tjtNode.addChild(tjt)

      tjtNode.waterZ = createClip({
                           toShowimg:res.daoshui45,
                           ShowimgPos:cc.p(782,560),
                           toSencilimg:res.daoshui45,
                           sencilPos:cc.p(782,225),
                           sencilScale:cc.p(1,0.68),
                           father:tjtNode,
                           scale:cc.p(0.7,0.68)
                       })
      tjtNode.waterZ2 = createClip({
                           toShowimg:res.di00,
                           ShowimgPos:cc.p(782,245),
                           toSencilimg:res.daoshui45,
                           sencilPos:cc.p(785,247),
                           sencilScale:cc.p(4,0.6),
                           father:tjtNode,
                           scale:cc.p(0.42,0.42)
                       })
      tjtNode.waterZ2.setVisible(false)
      tjtNode.level1 = createClip({
                           toShowimg:res.daoshui44,
                           ShowimgPos:cc.p(782,410),
                           toSencilimg:res.bigitem1,
                           sencilPos:cc.p(782,465),
                           sencilScale:cc.p(0.4,0.4),
                           father:tjtNode,
                           scale:cc.p(0.32,0.32)
                       })
      tjtNode.level1.initX = tjtNode.level1.x
      tjtNode.level1.initMinY = 410
      tjtNode.level1.initMaxY = 530
      tjtNode.level1.ml = 0.4
      tjtNode.level1.setVisible(false)

      tjtNode.ti = new cc.Sprite(res.ti00)
      tjtNode.ti.setPosition(860,350)
      tjtNode.ti.setScale(0.5)
      tjtNode.addChild(tjtNode.ti)
      tjtNode.ti.setVisible(false)
      tjtNode.playTi = function(){
         var ti = this.ti
         var ac = createAnimation({
                                ifFile:true,
                                frame:"ti%02d",
                                start:0,
                                end: 7,
                                time: 0.08
                              })
         ti.runAction(cc.repeatForever(ac))
      }
      tjtNode.playTi()

      tjtNode.clearBtn = new ccui.Button(res.ping5,res.ping6)
      tjtNode.clearBtn.setPosition(630,500)
      tjtNode.clearBtn.setScale(0.32)
      tjtNode.addChild(tjtNode.clearBtn)
      tjtNode.clearBtn.setVisible(false)

      tjtNode.daoshui = new cc.Sprite(res.daoshui00)
      tjtNode.daoshui.setPosition(640,580)
      tjtNode.daoshui.setScale(0.6)
      tjtNode.addChild(tjtNode.daoshui)
      tjtNode.daoshui.setOpacity(0)
      tjtNode.playLevel = function(){
        var level1 = this.level1
        level1.setVisible(true)
        level1.stopAllActions()
        level1.allQ = 0
        level1.runAction(cc.sequence(
          cc.delayTime(1),
          cc.moveTo(0.5,cc.p(level1.initX,level1.initMaxY))
        ))
      }
      tjtNode.playWaterLost = function(fun,fun1,fun2,fun3){
         var level1 = this.level1
         level1.stopAllActions()
         level1.time = 0
         var getV = function(h){
           return -0.01*h*h + 0.27*h +0.7
         }
         if(fun1){
            fun1()
         }
         level1.runAction(cc.repeatForever(cc.sequence(
           cc.delayTime(1),
           cc.callFunc(function(){
               var h = (level1.y - level1.initMinY)/10
               if(fun){
                  fun(getV(h))
               }
               if(level1.y<=490){
                  if(fun2){
                     fun2()
                  }
               }
               level1.allQ += getV(h)
               var curH = (300-level1.allQ)/25
               var disY = 10*curH + level1.initMinY
               level1.runAction(cc.moveTo(0.98,cc.p(782,disY)))
               if(level1.y<=410){
                   tjtNode.resetAll(fun3)
               }
           })
         )))   
      }
      tjtNode.playWaterLostTwo = function(fun,fun1,fun2,fun3){
         var level1 = this.level1
         var tjtNode = this
         level1.stopAllActions()
         level1.time = 0
         var getN = function(h){
           var n = -0.025*h*h + 1.05*h + 1
           return n*0.05
         }
         if(fun1){
           fun1()
         }
         level1.runAction(cc.repeatForever(cc.sequence(
           cc.delayTime(1),
           cc.callFunc(function(){
               var h = (level1.y - level1.initMinY)/10
               if(fun){
                  fun(getN(h))
               }
               if(level1.y<=490){
                  if(fun2){
                     fun2()
                  }
               }
               level1.allQ += getN(h)
               var curH = (300-level1.allQ)/25
               var disY = 10*curH + level1.initMinY
               level1.runAction(cc.moveTo(0.98,cc.p(782,disY)))
               if(level1.y<=410){
                  tjtNode.resetAll(fun3)
               }
           })
         )))
      }
      tjtNode.resetAll = function(fun){
        var level1 = this.level1
        var waterZ = this.waterZ
        var waterZ2 = this.waterZ2
        level1.stopAllActions()
        level1.y = level1.initMinY
        level1.setVisible(false)

        waterZ.stopAllActions()
        waterZ.setVisible(false)
        waterZ.setPosition(waterZ.initPos)

        waterZ2.stopAllActions()
        waterZ2.setVisible(false)
        waterZ2.setPosition(waterZ2.initPos)
        this.haveWater = false
        if(fun){
           fun()
        }
      }
      tjtNode.waterPull = function(status){
         var level1 = this.level1
         var dis = level1.initMaxY - level1.y
         var time = 0
         level1.stopAllActions()
         switch(status){
           case "A":
             time = dis * 1.25
           break
           case "B":
             time = 300
           break
         }
         level1.runAction(cc.sequence(
           cc.moveTo(time,cc.p(level1.initX,level1.initMinY)),
           cc.callFunc(function(){
              level1.setVisible(false)
           })
         ))
      }
      tjtNode.playPushWater = function(fun){
        var tjtNode = this
        var daoshui = tjtNode.daoshui
        var level1 = tjtNode.level1
        var hand = tjtNode.hand
        var dis = level1.y - level1.initMinY
        var list =[0,20,40,60,80,100,120]
        var info = [
          {frame:"onee%02d",end:15,pos:cc.p(640,580)},
          {frame:"twoo%02d",end:16,pos:cc.p(640,550)},
          {frame:"three%02d",end:16,pos:cc.p(650,550)},
          {frame:"four%02d",end:19,pos:cc.p(650,550)},
          {frame:"five%02d",end:18,pos:cc.p(640,550)},
          {frame:"six%02d",end:18,pos:cc.p(650,550)},
          {frame:"daoshui%02d",end:23,pos:cc.p(650,580)}
        ]
        var curIndex = null
        for (var i = 0; i < list.length-1; i++) {
          if(list[i]<= dis && list[i+1] > dis){
             curIndex = i
          }
        }
        if(curIndex!=null){
              daoshui.setOpacity(255)
              tjtNode.showHand(true)
              var ac = createAnimation({
                                ifFile:true,
                                frame:info[6-curIndex].frame,
                                start:0,
                                end: info[6-curIndex].end,
                                time: 0.08,
                                fun:function(){
                                   if(fun){
                                     fun()
                                   }
                                }
                              })
              daoshui.setPosition(info[6-curIndex].pos)
              daoshui.runAction(cc.sequence(ac,cc.fadeOut(0.1)))
              tjtNode.playLevel(curIndex)
              return true
        }else{
          return false
        }
      }  

      return tjtNode
    },
    moveEvent:function(data){
        var self = this
        var item = data.sp
        var delta = data.delta
        var index = data.index
        if(index<=1){
            var temppos = cc.p(item.x + delta.x,item.y + delta.y)
            self.fdjSameAction(item.keyStr,function(item){
               item.setPosition(temppos)
            })
            item.in = false
            if(cc.rectContainsPoint(self.tieUp1,item.getPosition())){
                //item.IsMove = true
                if(self.upItemindex!=null){
                   if(self.upItemindex!=item.keyStr){
                      self.fdjSameAction(item.keyStr,function(item){
                         item.setPosition(600,510) 
                      })
                      return
                   }
                }
                if(index==0){
                  self.status = "A"
                }else{
                  self.status = "B"
                }  
                var y = item.y
                if(y<465){
                   y=465
                }
                self.fdjSameAction(item.keyStr,function(item){
                    item.setPosition(782,y) 
                })
                item.in = true
            }
        }else if(index==3){
            var temppos = cc.p(item.x + delta.x,item.y + delta.y)
            item.setPosition(temppos)
        }else if(index==2 || index==4){
              var temppos = cc.p(item.x + delta.x,item.y + delta.y)
              self.fdjSameAction(item.keyStr,function(item){
                 item.setPosition(temppos)
              })
              if(cc.rectContainsPoint(self.tiedown,item.getPosition())){
                if(self.curStr!=null){
                   if(self.curStr!=item.keyStr){
                      self.fdjSameAction(item.keyStr,function(item){
                         item.setPosition(600,120) 
                      })
                   }
                }
              }
        }else if(index==5){
              var temppos = cc.p(item.x + delta.x,item.y + delta.y)
              self.fdjSameAction(item.keyStr,function(item){
                 item.setPosition(temppos)
              })
             if(self.upItemindex && cc.rectContainsPoint(self.tieUp,item.getPosition())){
                self.fdj.getOut(self.upItemindex).IsMove = true
                self.fdjSameAction(item.keyStr,function(item){
                    item.setPosition(500,300)
                    item.setVisible(false)
                })
                var result = true    
                self.fdjSameAction("tjt",function(item){
                    item.haveWater = true
                    result = item.playPushWater(function(){
                                     self.gai.disListen(true)
                                     self.fdj.getOut("tjt").hand.disListen(false)
                                  })
                })
                if(!result){
                   item.setVisible(true)
                   item.setPosition(650,500)
                }
             }
        }
    },
    fdjSameAction:function(index,fun){
        var self = this
        var keyname = index
        if(keyname==null){
           return
        }
        self.fdj.runData({
                    key:keyname,
                    fun:function(data){
                       var item = data.item
                       if(fun){
                         fun(item)
                       }
                    }
                  }) 
    },
    createEmpty:function(status){
      var status = status || "cup"
      var empty = null
      switch(status){
        case "cup":
            empty = new cc.Sprite(res.empty3)
            var empty1 = new cc.Sprite(res.empty2)
            empty1.setPosition(221.1,192.3)
            empty.addChild(empty1)
            var empty2 = new cc.Sprite(res.empty1)
            empty.empty2 = empty2
            empty2.setPosition(256,39)
            empty2.initPos = empty2.getPosition()
            empty2.setScale(1)
            empty2.setOpacity(150)
            empty.addChild(empty2)
            empty.setScale(0.35)
            empty.Q = 0
            empty.rate = 0.56
            empty.Hi = 306
            empty2.setVisible(false)

            var empty3 = new cc.Sprite(res.empty1)
            empty.scObj = empty3
            empty3.setPosition(256,39)
            empty3.initPos = empty3.getPosition()
            empty3.setScale(0)
            empty3.toSc = 1
            empty3.sctime = 2
            empty3.sctime1 = 4
            empty3.setOpacity(150)
            empty.addChild(empty3)
            empty.wenzi = "wenzi7"
        break
        case "lt":
            empty = new cc.Sprite(res.empty5)
            var empty1 = new cc.Sprite(res.empty4)
            empty1.setPosition(123,367)
            empty.addChild(empty1)

            var empty2 = new cc.Sprite(res.empty1)
            empty2.setPosition(115,57)
            empty2.initPos = empty2.getPosition()
            empty2.setOpacity(150)
            empty.empty2 = empty2
            empty2.initScale = 0.362
            empty2.setScale(empty2.initScale)
            empty.addChild(empty2)
            empty.setScale(0.35)
            empty.Q = 0
            empty.rate = 7
            empty.Hi = 618
            empty.wenzi = "wenzi6"
            empty2.setVisible(false)

            var empty3 = new cc.Sprite(res.empty1)
            empty3.setPosition(115,57)
            empty3.initPos = empty3.getPosition()
            empty3.setOpacity(150)
            empty.scObj = empty3
            empty3.setScale(0)
            empty3.toSc = empty2.initScale
            empty3.sctime = 0.6
            empty3.sctime1 = 2
            empty.addChild(empty3)
        break
      }
      empty.getDis = function(){
        var water = this.empty2
        return water.y - water.initPos.y
      }
      empty.cupWaterUp = function(Q,fun){
          var water = this.empty2
          var h = Q * this.rate
          this.Q += Q
          water.stopAllActions()
          if(water.y<=this.Hi){
              water.runAction(cc.moveBy(0.98,cc.p(0,h)))
          }else{
             if(fun){
                fun(this)
             }
          }              
          return water.y
      }
      
      return empty
    },
    createHereFDJ:function(){
        var self = this
        var gai = new cc.Sprite(res.bigitem7)
        gai.setScale(0.25)
        gai.setPosition(780,400)
        self.addChild(gai,50)
        gai.setVisible(false)
        self.gai = gai

        createTouchEvent({
           item:gai,
           begin:function(data){
             return true
           },
           end:function(data){
              var item = data.item
              self.fdjSameAction("tjt",function(item){
                 item.showHand()
                 item.clearBtn.setVisible(true)
                 item.ti.setVisible(false)
                 item.ti.removeFromParent()
              })
              item.disListen(true)
              //fdj.getOut("tjt").hand.disListen(false)
           }
        })
        gai.disListen(true)

        var fdj = createFDJ({
          father: self.toolnode,
          rootScale: 0.3,
          perscale: 0.1,
          max: 0.4,
          min: 0.1,
          seePos: [cc.p(-800, 80)],//300
          getPos: [cc.p(-800, 200)],//800
        })
        
        self.fdj = fdj
        fdj.get[0].setVisible(true)
        fdj.see[0].setVisible(true)
        fdj.see[0].setScale(0.7)
        fdj.actMove()

        self.showFdj = function(){
           var self = this
           if(!self.showFdjbool){
             self.showFdjbool = true
             self.fdj.see[0].setPosition(300,80)
             self.fdj.setGet(cc.p(800,150))
           }
        }
        //创建铁架台
        fdj.createNew({
          key:"tjt",
          fun:function(){
             var tjt = self.createTjt()
             return tjt
          }
        })

        fdj.createNew({
          key:"tjt2",
          fun:function(){
             var tjt = new cc.Sprite(res.do_tjt2)
             tjt.setPosition(782,434)
             tjt.setScale(0.55)
             tjt.setLocalZOrder(500)
             return tjt
          }
        })
        self.status = "A"
        self.dis = 0
        createTouchEvent({
           item:fdj.getOut("tjt").hand,
           begin:function(data){
             var result = judgeOpInPos(data)
             if(self.curStr==null){
               self.speakeBykey("wenzi3")
               result = false 
             }
             return result
           },
           end:function(data){
              var item = data.item
              var tjtCup = null
              var afun = null
              var temp = null
              if(self.curStr){
                switch(self.status){
                  case "A":
                     temp = self.fdj.getOut("tjt").waterZ
                  break
                  case "B":
                     temp = self.fdj.getOut("tjt").waterZ2
                  break 
                }
                tjtCup = self.fdj.getOut(self.curStr)
                self.dis = tjtCup.getDis() * 0.35/getLoopScale(temp)
                afun = function(Q){
                    self.fdjSameAction(self.curStr,function(item){
                         item.cupWaterUp(Q,function(item){
                              self.speakeBykey(item.wenzi)
                              self.fdjSameAction("tjt",function(item){
                                 item.showHand()
                                 self.gai.disListen(true)
                              })
                         })
                    })
                    var dis = 0
                    if(self.curStr){
                      dis = Q * tjtCup.rate * 0.35/ getLoopScale(temp)
                    }      
                    self.fdjSameAction("tjt",function(item){
                         item.changeShuiz(dis,self.status)
                    })
                }
              }

              self.fdjSameAction("tjt",function(item){
                 item.hideHand({
                    status:self.status,
                    dis:self.dis,
                    fun:afun,
                    fun1:function(){
                       if(self.curStr){
                         var temps = 0
                         var scobj = tjtCup.scObj
                         switch(self.status){
                          case "A":
                             temp = scobj.sctime
                          break
                          case "B":
                             temp = scobj.sctime1
                          break 
                         }
                         self.fdjSameAction(self.curStr,function(item){
                            item.scObj.runAction(cc.sequence(
                               cc.scaleTo(temp,scobj.toSc),
                               cc.callFunc(function(){
                                  item.empty2.setVisible(true)
                                  item.scObj.setVisible(false)
                               })
                            ))
                         }) 
                       }
                    },
                    fun2:function(){
                       self.speakeBykey("wenzi8")
                    },
                    fun3:function(){
                      self.fdjSameAction("tjt",function(item){
                        item.hand.setOpacity(0)
                        item.haveWater = false
                        self.gai.disListen(true)
                        self.fdj.getOut(self.upItemindex).IsMove = false
                      })
                    }
                 })
                 item.clearBtn.setVisible(false)
                 if(!self.ti){
                    self.ti = true
                    item.ti.setVisible(true)
                 }
              })
              item.disListen(true)
              gai.disListen(false)  
           }
        })

        fdj.getOut("tjt").hand.disListen(true)
        var clearBtn = fdj.getOut("tjt").clearBtn
        fdj.getIn("tjt").clearBtn.setEnabled(false)
        clearBtn.addClickEventListener(function(){
                      self.fdjSameAction("tjt",function(item){
                        item.clearBtn.setVisible(false)
                        item.resetAll()
                        item.hand.setOpacity(0)
                        item.haveWater = false
                        self.gai.disListen(true)
                        self.fdj.getOut(self.upItemindex).IsMove = false
                      })
                  })
        
        self.my = testForDrawNode(self)
        self.tieUp = cc.rect(680,426,140,150)
        self.tieUp1 = cc.rect(670,380,180,180)
        self.tiedown = cc.rect(678,36,200,220)
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
            self.toolbtn.show()
            self.nodebs.show(function() {
                self.speakeBykey("wenzi2")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900)

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })
        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })
        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })
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
        addContent({
            people: this.nodebs,
            key: "wenzi7",
            img:res.wenzi7,
            sound: res.zimp7
        })
        addContent({
            people: this.nodebs,
            key: "wenzi8",
            img:res.wenzi8,
            sound: res.zimp8
        })
    }  
})