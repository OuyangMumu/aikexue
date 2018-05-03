//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {
       loadPlist("waterDao")
       loadPlist("disappear1")
       loadPlist("disappear2")
       loadPlist("disappear3")
       loadPlist("sayan")
    })
    var self = this
    this._super()
    this.expCtor({
      vis: false,
      setZ:800,
      settingData: {
          pos: cc.p(1080, 580),
          biaogeFun: function() {
             if(!self.bggg) {
                 var buf = [
                   [null,res.a1,res.a2],
                   [null,res.a1,res.a2],
                   [null,res.a3,res.a4],
                   [null,res.a3,res.a4],
                   [null,res.a5,res.a6],
                   [null,res.a5,res.a6],
                   [null,res.a7,res.a8],
                 ]
                 var bgg = createBiaoge({
                     json:res.flyysdff_bg,
                     inputNum: 0,
                     scale: 0.9,
                     downData: {
                         nums: 7,
                         bufs: buf,
                         keys: [
                             1,2,1,2,1,2,2
                         ]
                     }
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
    this.initFunlist()

    return true
  },
  initFunlist:function(){
      var self = this
      self.clockList = [false,true,true,true,true,
      true,true,true,true,true]
      self.imglist = ["wenzi1","wenzi2","wenzi4","wenzi6","wenzi8",
      "wenzi10","wenzi13","wenzi14","wenzi15","wenzi12","wenzi11"]

      //测试红色框
      self.myDraw = testForDrawNode(self)
      
      var move10 = function(){
          var item9 = self.toolbtn.getindex(7)
          var item3 = self.toolbtn.getindex(2)
          var comparPos = cc.p(this.x-20,this.y+30)
          var spPos = cc.p(item9.x-50,item9.y-50)
          if(self.checkdistans(spPos,comparPos,70)){
            if(self.xishiyan)
              self.xishiyan.setVisible(true)
            return 
          }
          var spPos1 = cc.p(item3.actionSp.x-80,item3.actionSp.y-80)
          self.xishiyan.setVisible(false)
          if(self.checkdistans(spPos1,comparPos,70)){
            if(self.cushiyan)
              self.cushiyan.setVisible(true)
            return 
          }
          self.cushiyan.setVisible(false)
      }
      self.moveFunList = [
           null,
           null,
           null,
           null,
           null,
           null,
           null,
           null,
           null,
           move10
      ]
      var end1and8 = function(){
        if(this.index == 0){
            this.setPosition(400,150)
            this.setVisible(false)
            this.pre = new cc.Sprite(res.bigitem111)
            this.pre.setPosition(400,137)
            this.pre.setLocalZOrder(this.getLocalZOrder())
            this.getParent().addChild(this.pre)

            this.hou = new cc.Sprite(res.bigitem11)
            this.hou.setPosition(388,168)
            this.hou.setLocalZOrder(1)
            this.getParent().addChild(this.hou)

        }else if(this.index == 7){
            this.setPosition(450,150)
        }
        self.clockList[++this.index] = false
        this.removeListen()
      }
      var end2and3 = function(){
         var item1 = self.toolbtn.getindex(0)
         if(item1){
            var staticRect = cc.rect(item1.x-item1.width/2+15,
              item1.y+item1.height/2-50,item1.width-60,60)
            var spRect = cc.rect(this.x-this.width/2+40,
              this.y-this.height/2+10,this.width-80,this.height-20)
            if(cc.rectIntersectsRect(staticRect,spRect)){
                this.removeListen()
                var dis = 0
                var curkey = null
                if(this.index == 1){
                  dis = 115
                  curkey = "wenzi3"
                }else if(this.index == 2){
                  dis = 140
                  curkey = "wenzi5"
                }
                this.runAction(cc.sequence(
                     cc.moveTo(0.2,cc.p(item1.x,item1.y + dis)),
                     cc.callFunc(function(){
                        self.speakeBykey(curkey)
                     })
                  ))
                self.clockList[++this.index] = false
            }
         }
      }
      var end4 = function(){
        var item3 = self.toolbtn.getindex(2)
        if(item3){
           if(cc.rectIntersectsRect(item3,this)){
              this.removeListen()
              var inself = this
              item3.actionSp = new cc.Sprite("#waterDao00.png")
              item3.actionSp.setPosition(item3.x + 67.5,item3.y + 78.5)
              item3.getParent().addChild(item3.actionSp)
              item3.actionSp.setLocalZOrder(item3.getLocalZOrder())
              self.tip1.setVisible(true)
              this.runAction(cc.sequence(
                   cc.moveTo(0.2,cc.p(item3.x+100,item3.y+100)),
                   cc.callFunc(function(){
                       inself.setVisible(false)
                       item3.setVisible(false)
                       inself.y = -600
                        var tempAc = cc.sequence(
                                createAnimation({
                                    frame: "waterDao%02d.png",
                                    start: 1,
                                    end: 34,
                                    time: 0.1
                                }),
                                cc.callFunc(function(){
                                    self.clockList[4] = false
                                    self.speakeBykey("wenzi7")
                                }))
                        item3.actionSp.runAction(tempAc)
                   })
              ))   
              item3.actionSp.palyAc = function(){
                  this.stopAllActions()
                  var inself = this
                  var tempAc = cc.sequence(
                                createAnimation({
                                    frame: "disappear%03d.png",
                                    start: 0,
                                    end: 50,
                                    time: 0.2
                                }),
                                cc.callFunc(function(){
                                    self.tip3.setVisible(true)
                                    self.tip2.setVisible(false)
                                    self.toolbtn.getindex(4).ifNoMove = false
                                    self.speakeBykey("wenzi12")
                                    self.curChosenum = 10
                                }),
                                createAnimation({
                                    frame: "disappear%03d.png",
                                    start: 51,
                                    end: 132,
                                    time: 0.2
                                }),
                                cc.callFunc(function(){
                                    self.tip3.setVisible(false)
                                    inself.air.runAction(cc.sequence(
                                        cc.scaleTo(1,0.4),
                                        cc.callFunc(function(){
                                           inself.air.removeFromParent()
                                        })
                                      ))
                                }),
                                cc.delayTime(2),
                                cc.callFunc(function(){
                                    self.clockList[6] = false
                                    self.speakeBykey("wenzi13")
                                    self.curChosenum = null
                                })
                            )
                  inself.air = createWaterAir({
                        total: 30,
                        width: 20,
                        height: 1,
                  })
                  inself.air.setScale(0.3)
                  inself.air.setPosition(55,60)
                  inself.air.runAction(cc.scaleTo(1,0.7))
                  this.addChild(inself.air)

                  this.runAction(tempAc)
              }
           }
        }
      }
      self.getboli = false
      var end5 = function(){
        this.removeListen()
        this.setPosition(750,110)
        var inself = this
        this.autoDo = function(){
            var inself = this
            inself.aTime = 0
            var ac = cc.repeatForever(cc.sequence(
                 cc.delayTime(0.2),
                 cc.callFunc(function(){
                     inself.aTime = inself.aTime + 1
                     if(inself.aTime == 50 && !self.getboli){
                        var item3 = self.toolbtn.getindex(2)
                        var item6 = self.toolbtn.getindex(5)
                        if(item6){
                           item6.removeListen()
                           item6.setVisible(false)
                           item6.y = -600
                        }
                        self.toolbtn.inItem(5)
                        item3.actionSp.palyAc()
                     }
                     if(inself.aTime == 125){
                        inself.removeListen()
                        inself.stopAllActions()
                        inself.runAction(cc.sequence(
                          cc.moveTo(2,cc.p(750,110)),
                          cc.callFunc(function(){
                            inself.exeDown()
                          })
                        ))
                     }
                 })
            ))
            this.runAction(ac)
        }
        this.setCallBack({
            up:function(){},
            down:function(){
              inself.stopAllActions()
              if(inself.canDisappear){
                 inself.runAction(cc.sequence(
                   cc.delayTime(1),
                   cc.callFunc(function(){
                     inself.setVisible(false),
                     inself.y = -600
                   })
                ))
              }
            },
            fire:function(){
                inself.canDisappear = false
                createTouchEvent({
                  item:inself,
                  begin:function(data){
                    return true
                  },
                  move:function(data){
                     var item = data.item
                     var delta = data.delta
                     var tempx = item.x + delta.x
                     if(tempx>=500 && inself.canDisappear){
                       inself.setCanClick(true)
                     }
                     if(tempx>=750){
                       item.x = 750
                       return
                     }else if(tempx<=450){
                       if(!inself.ifMove){
                           item.x = 400
                           inself.ifMove = true
                           inself.ifNoMove = true
                           self.clockList[5] = false
                           self.speakeBykey("wenzi9")
                           self.tip1.setVisible(false)
                           self.tip2.setVisible(true)
                           inself.setCanClick(false)
                           inself.canDisappear = true
                           inself.autoDo()
                       }
                       if(tempx<=399){
                         item.x = 399
                         return
                       }
                     }
                     if(!inself.ifNoMove){
                       item.x = tempx
                     }    
                  }
                })
            },
            cutFire:function(){},
        })
      }
      var end6 = function(){
         var item1 = self.toolbtn.getindex(0)
         if(item1){
            var staticRect = cc.rect(item1.x-item1.width/2+15,
              item1.y+item1.height/2-50,item1.width-60,60)
            var spRect = cc.rect(this.x-this.width/2+30,
              this.y-this.height/2,this.width-60,this.height)
            if(cc.rectIntersectsRect(staticRect,spRect)){
                this.removeListen()
                this.setVisible(false)
                this.y = -600
                self.getboli = true
                var item3 = self.toolbtn.getindex(2)
                self.curChosenum = 9
                item3.actionSp.palyAc()
            }
         }
      }
      var end7 = function(){
         var item1 = self.toolbtn.getindex(0)
         if(item1){
            var staticRect = cc.rect(item1.x-item1.width/2+20,
              item1.y+item1.height/2-30,item1.width-60,90)
            var spRect = cc.rect(this.x-this.width/2+10,
              this.y-this.height/2,this.width-40,this.height)
            if(cc.rectIntersectsRect(staticRect,spRect)){
                this.removeListen()
                var inself = this
                var item3 = self.toolbtn.getindex(2)
                this.runAction(cc.sequence(
                   cc.moveTo(0.2,cc.p(item1.x+160,item1.y + 270)),
                   cc.callFunc(function(){
                      inself.setVisible(false)
                      inself.y = -600
                      var tempAc = cc.sequence(
                                createAnimation({
                                    frame: "disappear%03d.png",
                                    start: 133,
                                    end: 139,
                                    time: 0.2,
                                }),
                                cc.callFunc(function(){
                                    item3.actionSp.setSpriteFrame("disappeartwo00.png")
                                    createTouchEvent({
                                        item: item3.actionSp,
                                        begin: function(data) {
                                          var item = data.item
                                          var result = judgeOpInPos(data)
                                          return result
                                        },
                                        autoMove:true,
                                        end:function(data){
                                          var item = data.item
                                          item.removeListen()
                                          item.setPosition(730,200)
                                          var item1 = self.toolbtn.getindex(0)
                                          item1.pre.setVisible(false)
                                          item1.hou.setVisible(false)
                                          self.toolbtn.getindex(1).setVisible(false)
                                          var spac = createAnimation({
                                                          frame: "disappeartwo%02d.png",
                                                          start: 0,
                                                          end: 5,
                                                          time: 0.1,
                                                      })
                                          self.clockList[7] = false
                                          self.speakeBykey("wenzi14")
                                          item.runAction(spac)
                                        }
                                    })
                                }))
                      item3.actionSp.runAction(tempAc)
                   })
                  ))
            }
         }
      }
      var end9 = function(){
         var item3 = self.toolbtn.getindex(2)
         if(item3 && item3.actionSp){
              var staticRect = cc.rect(item3.actionSp.x-item3.actionSp.width/2+10,
              item3.actionSp.y-item3.actionSp.height/2+10,120,50)
              var spRect = cc.rect(this.x-this.width/2+20,
              this.y-this.height/2-10,this.width-40,this.height-20)
              if(cc.rectIntersectsRect(staticRect,spRect)){
                  this.removeListen()
                  var inself = this
                  this.runAction(cc.sequence(
                   cc.moveTo(0.2,cc.p(item3.actionSp.x+50,item3.actionSp.y)),
                   cc.callFunc(function(){
                      inself.setVisible(false)
                      inself.y = -600
                      var tempAc = cc.sequence(
                                createAnimation({
                                    frame: "disappeartwo%02d.png",
                                    start: 6,
                                    end: 15,
                                    time: 0.2,
                                }),
                                cc.callFunc(function(){
                                   //勺子的更换图片及触摸
                                   item3.actionSp.setSpriteFrame("disappeartwo05.png")
                                   inself.setTexture(res.bigitem99)
                                   inself.y = item3.actionSp.y
                                   inself.setVisible(true)
                                    createTouchEvent({
                                        item: inself,
                                        begin: function(data) {
                                          return true
                                        },
                                        autoMove:true,
                                        end:function(data){
                                          var item = data.item
                                          var item9 = self.toolbtn.getindex(7)
                                          var item9Rect = cc.rect(item9.x-item9.width/2+20,
                                                item9.y-item9.height/2+35,170,110)
                                          if(cc.rectContainsPoint(item9Rect,item.getPosition())){
                                               var seq = cc.sequence(
                                                   cc.moveTo(0.2,cc.p(item9.x+20,item9.y)),
                                                   cc.callFunc(function(){
                                                        item.setVisible(false)
                                                        item.y = -600
                                                        var temp9Ac = cc.sequence(
                                                          createAnimation({
                                                              frame: "sayan%02d.png",
                                                              start: 0,
                                                              end: 14,
                                                              time: 0.2,
                                                          }),
                                                          cc.callFunc(function(){
                                                               var item3 = self.toolbtn.getindex(2)
                                                               item3.actionSp.setVisible(false)
                                                               item3.actionSp.setPosition(item3.actionSp.x+40,item3.actionSp.y-10)
                                                               var shiyan = new cc.Sprite(res.shiyan)
                                                               shiyan.setPosition(item3.actionSp.x-70,item3.actionSp.y-70)
                                                               item3.actionSp.getParent().addChild(shiyan)

                                                               self.clockList[9] = false
                                                               self.speakeBykey("wenzi16")
                                                               self.xishiyan = new cc.Sprite(res.xishiyan)
                                                               self.xishiyan.setPosition(getMiddle(-140,50))
                                                               self.xishiyan.setVisible(false)
                                                               self.addChild(self.xishiyan) 

                                                               self.cushiyan = new cc.Sprite(res.cushiyan)
                                                               self.cushiyan.setPosition(getMiddle(140,50))
                                                               self.cushiyan.setVisible(false)
                                                               self.addChild(self.cushiyan)   
                                                          }))
                                                        item9.runAction(temp9Ac)
                                                   })
                                                )
                                               item.runAction(seq)
                                          }
                                        }
                                    })
                                }))
                      item3.actionSp.runAction(tempAc)
                   })
                  ))
              }
         }
      }
      self.endFunList = [
           end1and8,
           end2and3,
           end2and3,
           end4,
           end5,
           end6,
           end7,
           end1and8,
           end9,
           null
      ]
      self.checkFun = function(){
          if (this.clock) {
            var curimg = 0
            for (var k = 0; k < self.clockList.length; k++) {           
                if (!self.clockList[k]){
                  curimg = k
                }else{
                  break
                }
                   
            }
            if(self.curChosenum){
               curimg = self.curChosenum
            }
            self.speakeBykey(self.imglist[curimg])

            return false
          }else{
            if(this.excstartFun)
              this.excstartFun()
              this.excEndFun = self.endFunList[this.index]
              this.excMoveFun = self.moveFunList[this.index]
            return this
          }
      }  
  },
  checkdistans:function(target1, target2, dis) {
    if (!(target1 && target2 && dis)) {
        cc.log("error call")
        return false
    }
    var dx = target1.x - target2.x
    var dy = target1.y - target2.y
    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    if (distance <= dis) {
        return true
    } else
        return false
  },
  initUI:function(){
        var self = this
        self.tip1 = new cc.Sprite(res.tip1)
        self.tip1.setPosition(getMiddle(130,160))
        self.addChild(self.tip1)
        self.tip1.setVisible(false)

        self.tip2 = new cc.Sprite(res.tip2)
        self.tip2.setPosition(getMiddle(70,170))
        self.addChild(self.tip2)
        self.tip2.setVisible(false)

        self.tip3 = new cc.Sprite(res.tip3)
        self.tip3.setPosition(getMiddle(70,170))
        self.addChild(self.tip3)
        self.tip3.setVisible(false)

        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(1, -14),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                if(index==4){
                   item = createJJD({
                    staticDg:true
                   })
                }
                item.index = index
                item.clock  = self.clockList[index]
                if(self.startFunlist)
                item.excstartFun = self.startFunlist[index]
                item.checkFun = self.checkFun
                item.setLocalZOrder(LOCAL_ORDER++)
                return item.checkFun()
            },
            clickfun:function(data){
                var item = data.sp
                item.setLocalZOrder(LOCAL_ORDER++)
                return true
            },
            movefun:function(data){
               var item = data.sp
               var delta = data.delta
               var index = data.index
               item.data = data
               var temppos = cc.p(item.x + delta.x,item.y + delta.y)
               item.setPosition(temppos)
                if(item.excMoveFun)
                   item.excMoveFun() 
            },
            outfun:function(data){
               var item = data.sp
               item.data = data
               if(item.excEndFun)
                 item.excEndFun()
               return true
            },
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4,res.item5,
            res.item6,res.item7,res.item8,res.item9,res.item10],
            gets:[res.bigitem1,res.bigitem2,res.bigitem3,res.bigitem4,null,
            res.bigitem6,res.bigitem7,res.bigitem8,res.bigitem9,res.bigitem10]
        })
        this.addChild(this.toolbtn,3)
  },
  speakeBykey:function(key){
    this.nodebs.say({
      key: key,
      force:true 
    })
  },
  myEnter: function() {
    this._super()
    var self = this
    if (this.nodebs) {
        var self = this
        self.toolbtn.show()
        self.nodebs.show(function(){
           self.speakeBykey("wenzi1")
        })     
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id:"student",
      pos: cc.p(1010, 120)
    })
    this.addChild(this.nodebs, 900);
      
    for(var i=1; i<18; i++){
        addContent({
            people: this.nodebs,
            key: sprintf("wenzi%d",i),
            sound: res[sprintf("zimp%d",i)],
            img: res[sprintf("wenzi%d",i)],
        })
    }
  }
})