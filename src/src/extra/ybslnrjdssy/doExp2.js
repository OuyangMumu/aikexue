//@author mu @16/5/11
var doExp2 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp2",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function(){
       loadPlist("wenzi")
       loadPlist("guayan")
       //loadPlist("yanlist")
    })
    var self = this
    this._super()
    if (!self.bgg) {
      var colors = [cc.color(255, 0, 0)]
      var bg = createBiaoge({
           json: res.bg_biao,
           isShowResult: true,
           scale: 0.9,
           inputNum: 1,
           gouNum:20,
           scale: 0.9,
           rootColor:colors,
           inputKeys:[
              36
            ]
      })
      bg.getChildByName("biaoTitle1").setVisible(false)
      bg.getChildByName("biaoTitle2").setVisible(true)
      self.addChild(bg)
      bg.setScale(0)
      self.bgg = bg
   }
    this.expCtor({
        vis: false,
        setZ:800,
        settingData: {
          pos: cc.p(1080, 580),
          biaogeFun: function() {  
             var bg = self.bgg
             bg.show()
          },
          ifCount: true,
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
      true,true]
      self.imglist = ["wenzi6","wenzi3","wenzi1","wenzi1","wenzi1",
      "wenzi10","wenzi13","wenzi2","wenzi15","wenzi12","wenzi11"]

      //测试红色框
      self.myDraw = testForDrawNode(self)

      var start4 = function(){
         this.palyGet = function(){
            cc.log("play get yan ")
            var inself = this
            var spAction = createAnimation({
                                    frame: "guayan%02d.png",
                                    start: 0,
                                    end: 25,
                                    time: 0.1,
                                    fun:function(){
                                       inself.setTexture(res.ysy)
                                       inself.setScale(0.97)
                                       inself.setPosition(inself.x+122,inself.y+10)
                                       inself.haveSome = true
                                       inself.IsMove = false
                                    }
                                })
            this.setPosition(this.x-110,this.y+10)
            this.runAction(spAction)
         }
         this.addCount = 0
         this.palyLose = function(fun){
            cc.log("play lose ")
            var inself = this
            var spAction = createAnimation({
                                    frame: "guayan%02d.png",
                                    start: 26,
                                    end: 43,
                                    time: 0.1,
                                    origin:true,
                                    fun:function(){
                                      inself.setTexture(res.bigitem8)
                                      inself.haveSome = false
                                      inself.IsMove = false
                                      if(fun){
                                        fun()
                                      }
                                    }
                                })
            this.runAction(spAction)
         }
      }
      self.startFunlist = [
           null,
           null,
           null,
           start4,
           null,
           null,
           null
      ]
      var move4 = function(){
         var item3 = self.toolbtn.getindex(2)
         if(item3){
            var onerect = cc.rect(item3.x-item3.width/2+60,item3.y+30,
              item3.width-120,40)

            var tworect = cc.rect(this.x-this.width/2,this.y-this.height/2,
              this.width/2,30)
         
            if(cc.rectIntersectsRect(onerect,tworect) && !this.haveSome){
                this.IsMove = true
                this.setPosition(item3.x+40,item3.y+60)
                this.palyGet()
            }
         }
         var item2 = self.toolbtn.getindex(1)
         if(item2 && this.haveSome){
            for(var i=0; i<item2.length; i++){
                var curitem = item2[i]
                var result =judgeItemCrash({
                              item1:this,
                              item2:item2[i]
                            })
               if(result && curitem.curSide=="left" && this.addCount<1){
                  this.IsMove = true
                  this.addCount++
                  var pos = this.getParent().convertToNodeSpace(getWorldPos(curitem))
                  this.setPosition(pos.x+37,pos.y+95)
                  this.palyLose()
                  if(!curitem.yan){
                    curitem.yan = new cc.Sprite(res.bigyan)
                    curitem.yan.setScale(0)
                    curitem.yan.setPosition(curitem.width/2,curitem.height/2)
                    curitem.addChild(curitem.yan)
                  }
                  var inself = this
                  curitem.yan.runAction(cc.scaleTo(2,1))
                  curitem.yan.runAction(cc.sequence(
                      cc.delayTime(0.6),
                      cc.callFunc(function(){
                          var tp = self.toolbtn.getindex(0)
                          tp.addWeight(3,0)
                          tp.UpdateBalance()
                          if(inself.addCount==1){
                             cc.log("2222222222")
                             self.curPing = 2
                          }
                      })
                    ))
               }
            }
         }
      }
      var move5 = function(){
         var item6 = self.toolbtn.getindex(5)
         if(item6){
            var rect = cc.rect(this.x-this.width/2,this.y-this.height/2,
            this.width,this.height)
            if(cc.rectContainsPoint(rect,item6.getPosition())){
               this.IsMove = true
               this.removeFromParent()
               item6.pushWater()
               item6.haveWater = true
            }
         }
      }
      var move7 = function(){
         var item6 = self.toolbtn.getindex(5)
         if(item6){
            var rect = cc.rect(this.x-this.width/2+20,this.y-this.height/2-30,
            this.width-110,this.height-120)
            if(cc.rectContainsPoint(rect,item6.getPosition()) && item6.haveYan){
               this.IsMove = true
               this.setPosition(item6.x+200,item6.y+250)
               this.setVisible(false)
               var inself = this
                if(self.touchSp.count==self.touchSp.max){
                    item6.rongsp.noneLose = true
                }
               item6.actionWater(function(){
                 inself.setVisible(true)
                 inself.IsMove = false
                 item6.haveYan = false
                 if(self.touchSp){
                    if(self.touchSp.count==self.touchSp.max){
                        self.speakeBykey("wenzi13")
                        self.bgg.setGouState(self.touchSp.count,false)
                    }else{
                        self.bgg.setGouState(self.touchSp.count,true)
                    }
                 } 
               })
            }
         }
      }
      self.moveFunList = [
           null,
           null,
           null,
           move4,
           move5,
           null,
           move7
      ]
      var end1 = function(){
        this.setPosition(460,100)
        this.removeListen()
        this.setScale(1)
        self.curChosenum = 7
        this.famahe.setVisible(true)
      }
      var end2 = function(){
          var tp = self.toolbtn.getindex(0)
          if(tp){
            var inself = this 
            this.data.weight = 0.3
            this.data.type = "both"
            this.setLocalZOrder(0)
            this.data.safeAddBack = function(){
               inself.removeListen()
               inself.getParent().noneAdd = true
               if(tp.tpright.noneAdd && tp.tpleft.noneAdd){
                  self.curPing = 1 
               }
            }
            tp.addItem(this.data)
          }
      }
      var end3 = function(){
        this.setPosition(this.gsrtemppos)
      }
      var end5 = function(){
         this.setPosition(800,320)
      }
      var end6 = function(){
         this.setPosition(600,220)
         if(!this.first){
            this.first = true
            var cup = this.getChildByName("cup1")
            var rongsp = cup.getChildByName("rongsp1")
            rongsp.playAc = function(){
               this.setVisible(true)
               this.setScale(0)
               this.runAction(cc.scaleTo(2,1))
            }
            this.cup = cup
            this.rongsp = rongsp
            createTouchEvent({
              item:cup,
              begin:function(data){
                var item = data.item
                if(!item.IsMove){
                   return true
                }else{
                   return false
                }
              },
              autoMove:true,
              end:function(data){
                var item = data.item
                item.setPosition(0,0)
              }
            })

            this.pushWater = function(){
               var ac = ccs.load(res.rongDo).action
               ac.gotoFrameAndPlay(0,64,false)
               var inself = this
               this.cup.IsMove = true
               ac.setLastFrameCallFunc(function(){
                    inself.cup.IsMove = false
                    self.speakeBykey("wenzi17")
               })
               this.runAction(ac)
            }

            this.actionWater = function(fun){
               var ac = ccs.load(res.rongDo).action
               ac.gotoFrameAndPlay(66,121,false)
               var inself = this
               this.cup.IsMove = true
               if(!this.rongsp.noneLose)
                  this.rongsp.setVisible(false)
               ac.setTimeSpeed(0.2)
               ac.setLastFrameCallFunc(function(){
                    inself.cup.IsMove = false
                    if(fun){
                       fun()
                    }
               })
               this.runAction(ac)
            }
         }
      }
      self.endFunList = [
           end1,
           end2,
           end3,
           null,
           end5,
           end6,
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
        self.curPing = 0
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
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
                if(index==0){
                    item = createTp({
                       balancepos:"up",
                       famapos:cc.p(850,150),
                       balanceBcak:function(){
                        if(self.curPing == 0){
                          self.speakeBykey("wenzi7")
                          self.curChosenum = null
                          self.clockList[1] = false
                        }else if(self.curPing ==1){
                          self.clockList[2] = false
                          self.clockList[3] = false
                          self.speakeBykey("wenzi16")
                        }else if(self.curPing ==2){
                            dialogControl.AddDialog("Tips", {
                              res:res.tip2,
                              face:1,
                              father: self,
                              closeBack:function(){
                                var item1 = self.toolbtn.getindex(0)
                                var item2 = self.toolbtn.getindex(1)
                                var item3 = self.toolbtn.getindex(2)
                                var item4 = self.toolbtn.getindex(3)
                                item1.removeFromParent()
                                item1.famahe.removeFromParent()
                                item3.gsrtemppos = cc.p(260,70)
                                item3.setPosition(item3.gsrtemppos)
                                item4.removeListen()
                                self.speakeBykey("wenzi9")
                                self.clockList[4] = false
                                self.clockList[5] = false
                                self.clockList[6] = false
                                self.blockTwo()
                              }
                            })
                        }
                       },
                       addFun: function(data) { 
                          var item = data.item
                          item.setPosition(100, 40)
                          item.inTp = true  
                       },
                       father:toolnode,
                    })
                    item.famahe.setVisible(false)
                    item.setScale(0.5)
                }
                if(index==5){
                   item = ccs.load(res.rongDo).node
                }
                if(index==2){
                  item.gsrtemppos = cc.p(900,400)
                }
                if(index==6){
                   item.setAnchorPoint(cc.p(0.5,0.8))
                   item.setScale(0.8)
                }
                item.index = index
                item.clock  = self.clockList[index]
                if(self.startFunlist)
                item.excstartFun = self.startFunlist[index]
                item.checkFun = self.checkFun
                if(index!=0){
                  item.setLocalZOrder(LOCAL_ORDER++)
                }
                return item.checkFun()
            },
            clickfun:function(data){
                var item = data.sp
                item.data = data
                data.item = item
                item.setLocalZOrder(LOCAL_ORDER++)
                if(item.clickFun)
                   item.clickFun()
                return true
            },
            movefun:function(data){
               var item = data.sp
               var delta = data.delta
               var index = data.index
               item.data = data
               if(!item.IsMove){
                   var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                   item.setPosition(temppos)
                   if(item.excMoveFun)
                   item.excMoveFun()
               }   
            },
            outfun:function(data){
               var item = data.sp
               item.data = data
               data.item = item
               if(item.excEndFun)
                 item.excEndFun()
               return true
            },
            counts:[1,2,1,1,1,1,1],
            father:toolnode,
            files:[res.item7,res.item9,res.item4,res.item8,
                   res.item2,res.item3,res.item6],
            gets:[null,res.bigitem9,res.bigitem4,res.bigitem8,
                   res.bigitem2,null,res.hand]
        })
        this.addChild(this.toolbtn,3)
  },
  speakeBykey:function(key){
    this.nodebs.say({
      key: key,
      force:true 
    })
  },
  blockTwo:function(){
     var self = this
     self.touchSp = self.toolbtn.getindex(3)
     var lab = new cc.LabelTTF("已加入食盐 1 勺","",30)
     lab.setPosition(790,220)
     lab.setColor(cc.color(0,0,0))
     self.addChild(lab)
     lab.setVisible(false)
     self.touchSp.lab = lab

     self.touchSp.count = 0
     self.touchSp.max = 13
     createTouchEvent({
       item:self.touchSp,
       begin:function(data){
        var item = data.item
        item.noend = true

        return true
       },
       move:function(data){
          var item = data.item
          var delta = data.delta
          var cups = self.toolbtn.getindex(5)
          var lt = self.toolbtn.getindex(4)
          var item3 = self.toolbtn.getindex(2)

          if(!item.IsMove){
              item.x += delta.x
              item.y += delta.y
              var result = judgeItemCrash({
                   item1:item3,
                   item2:item
              })
              if(result&& !item.haveSome){
                  item.IsMove = true
                  item.noend = false
                  if(!cups || !lt){
                     self.speakeBykey("wenzi10")
                     return false
                  }
                  if(cups){
                    if(!cups.haveWater){
                     self.speakeBykey("wenzi11")
                     return false
                    }
                    if(cups.haveYan){
                      self.speakeBykey("wenzi12")
                      return false
                    }
                  }
                  if(item.count==item.max){
                     self.speakeBykey("wenzi14")
                    return false
                  }
                  if(!item.haveSome){
                     item.setPosition(item3.x+40,item3.y+60)
                     item.palyGet()
                     item.noend = true
                  }
              }
              if(cups){
                  var result1 = judgeItemCrash({
                               item1:cups.cup,
                               item2:item,
                             })
                  if(result1){
                    if(item.haveSome){
                       if(cups.haveYan){
                         self.speakeBykey("wenzi12")
                       }else{
                         item.IsMove = true
                         cups.cup.IsMove = true
                         cups.haveYan = true
                         item.setPosition(cups.x+20,cups.y+120)
                         item.palyLose(function(){
                           item.setPosition(470,80)
                           item.lab.setVisible(true)
                           item.lab.setString(sprintf("已加入食盐 %d 勺",++item.count))
                         })
                         cups.rongsp.playAc()
                       }
                    }
                  }
              }
          }
       },
       end:function(data){
          var item = data.item
          if(!item.noend){
            item.setPosition(470,80)
            item.IsMove = false
          }
       }
     })
  },
  myEnter: function() {
    this._super()
    var self = this
    if (this.nodebs) {
        var self = this
        self.toolbtn.show()
        self.nodebs.show(function(){
           self.speakeBykey("wenzi6")
        })     
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id:"student",
      pos: cc.p(1030, 120)
    })
    this.addChild(this.nodebs, 900);
      
    for(var i=1; i<24; i++){
        addContent({
            people: this.nodebs,
            key: sprintf("wenzi%d",i),
            sound: res[sprintf("zimp%d",i)],
            img: sprintf("#wenzi%d0000",i),
            offset:cc.p(-10,0)
        })
    }
  }
})