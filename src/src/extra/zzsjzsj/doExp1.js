//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
          loadPlist("addWater")
          loadPlist("zglplist")
        })
        this._super()
        var self = this
        this.expCtor() 
        this.initFunlist()
        this.initUI()
        this.initPeople()
        return true
    },
    initFunlist:function(){
      var self = this
      self.clockList = [false,false,false,false]
      self.imglist = ["wenzi6","wenzi3","wenzi1","wenzi1"]

      //测试红色框
      //self.myDraw = testForDrawNode(self)
      //self.myDraw.drawRectbyRect()
      //self.myDraw.drawDotbyPoint()
      self.startFunlist = [
          null,
          null,
          null,
          null
      ]
      var click1 = function(){
         this.showHand()
      }
      self.clickFunlist = [
          click1,
          null,
          null,
          null
      ]
      var move1 = function(){
        var item3 = self.toolbtn.getindex(3)
        if(this.haveZgl && item3){
          var result = judgeItemCrash({
             item1: this,
             item2:item3
          })
          if(result){
              this.IsMove = true
              this.setPosition(item3.x+160,item3.y+200)
              this.addZgl(function(){
                  var tishi = new cc.Sprite(res.tishi)
                  tishi.setPosition(getMiddle())
                  tishi.setScale(1.2)
                  self.addChild(tishi)
                  tishi.runAction(cc.sequence(
                      cc.delayTime(5),
                      cc.fadeOut(0.6)
                    ))
                  item3.hideShabu()
              })
              //item3.showZgl()
              item3.runAction(cc.sequence(
                 cc.delayTime(0.4),
                 cc.callFunc(function(){
                    item3.showZgl()
                 })
              ))
          }
        }
      }
      var move2 = function(){
         var item1 = self.toolbtn.getindex(0)
         if(item1){
             var spRect = cc.rect(this.x-80,this.y-100,150,100)
             var comRect = cc.rect(item1.x-100,item1.y+30,220,70)
             if(cc.rectIntersectsRect(spRect,comRect)){
                this.IsMove = true
                this.removeFromParent()
                item1.addZglAction(function(){
                   item1.haveZgl = true
                   self.speakeBykey("wenzi2")
                })
             }
         }
      }
      var move3 = function(){
          var item1 = self.toolbtn.getindex(0)
          if(item1){
            var comRect = cc.rect(item1.x-10,item1.y+30,80,70)
            var spRect = cc.rect(this.x-80,this.y-100,150,100)
            if( item1.haveZgl && cc.rectIntersectsRect(spRect,comRect)){
              this.IsMove = true
              this.removeFromParent()
              item1.addWaterAction(function(){
                 item1.IsMove = false
                 self.speakeBykey("wenzi3")
              })
            }
          }   
      }
      self.moveFunList = [
           move1,
           move2,
           move3,
           null
      ]
      var end1 = function(){
        if(!this.haveZgl){
          this.IsMove = true
          this.setPosition(750,100)
        }
      }
      var end4 = function(){
        this.removeListen()
        this.setPosition(200,130)
      }
      self.endFunList = [
           end1,
           null,
           null,
           end4
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
              this.clickFun = self.clickFunlist[this.index]
            return this
          }
      }  
    },
    initUI:function(){
        var self = this

        var dotitle = new cc.Sprite(res.dotitle1)
        dotitle.setPosition(getMiddle(0,290))
        self.addChild(dotitle)

        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(260, 500),
            nums:4,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.5),
            itempos:[cc.p(1, -14),cc.p(1, -12),cc.p(1, -18),cc.p(1, -23)],
            circlepos:cc.p(0,24),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                if(index==0){
                   item = self.createYanbo()
                }else if(index==3){
                   item = self.createZglCup()
                }
                item.index = index
                item.opJudge = true
                item.clock  = self.clockList[index]
                if(self.startFunlist)
                  item.excstartFun = self.startFunlist[index]
                item.checkFun = self.checkFun
                item.setLocalZOrder(LOCAL_ORDER++)

                return item.checkFun()
            },
            clickfun:function(data){
                var item = data.sp
                item.data = data
                data.item = item
                if(item.IsMove){
                  return false
                }
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
            backfun:function(data){
              var item = data.sp
              if(item.excEndFun)
                 item.excEndFun()
              return false
            },
            counts:[1,1,1,1,1],
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4],
            gets:[null,res.bigitem2,res.bigitem3,null]
        })
        this.addChild(this.toolbtn,3)
    },
    createYanbo:function(){
      var yanbo = new cc.Sprite(res.yb2)

      var hand1 = new cc.Sprite(res.gsrhand2)
      hand1.setPosition(255,140)
      yanbo.addChild(hand1,1)
      yanbo.hand1 = hand1
      hand1.setVisible(false)
      hand1.setOpacity(0)

      var yanbocopy = new cc.Sprite(res.yb2)
      yanbocopy.setPosition(yanbo.width/2,yanbo.height/2)
      yanbo.addChild(yanbocopy,2)

      var yanbo1 = new cc.Sprite(res.yb1)
      yanbo1.setPosition(147.7,106)
      yanbo.addChild(yanbo1,10)

      var hand2 = new cc.Sprite(res.gsrhand1)
      hand2.setPosition(200,100)
      yanbo.addChild(hand2,12)
      yanbo.hand2 = hand2
      hand2.setVisible(false)
      hand2.setOpacity(0)

      yanbo.addZglAction = function(lastfun){
          var inself = this
          var zgl = new cc.Sprite(res.zgl)
          zgl.setPosition(158,230)
          zgl.setAnchorPoint(0.5,0)
          inself.addChild(zgl,5)
          zgl.runAction(cc.sequence(
                cc.moveTo(0.4,cc.p(158,62)),
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    var mochu = new cc.Sprite(res.mochu)
                    mochu.setPosition(190,205)
                    inself.addChild(mochu,6)
                    inself.mochu = mochu
                    mochu.setOpacity(0)
                    mochu.runAction(cc.spawn(
                      cc.fadeIn(0.1),
                      cc.repeat(cc.sequence(
                          cc.moveBy(0.2,cc.p(0,120)),
                          cc.moveBy(0.2,cc.p(0,-120))
                        ),18),
                      cc.sequence(
                          cc.moveTo(2,cc.p(160,205)),
                          cc.moveTo(2,cc.p(240,205)),
                          cc.fadeOut(0.1),
                          cc.callFunc(function(){
                              if(lastfun){
                                 lastfun()
                              }
                          })
                        )
                    ))
                    zgl.runAction(cc.sequence(
                      cc.delayTime(0.12),
                      cc.scaleTo(6,1,0.5)
                    ))
                })
            ))
      }
      yanbo.addWaterAction = function(lastfun){
          var inself = this
          var sp = new cc.Sprite("#waters00.png")
          var spAction = createAnimation({
                                    frame:"waters%02d.png",
                                    start:0,
                                    end: 29,
                                    time: 0.15,
                                    fun:function(){
                                       sp.removeFromParent()
                                       inself.mochu.setPosition(190,220)
                                       inself.mochu.runAction(cc.sequence(
                                           cc.delayTime(0.2),
                                           cc.fadeIn(0.1),
                                           cc.repeat(cc.sequence(
                                              cc.moveTo(0.4,cc.p(240,200)),
                                              cc.moveTo(0.4,cc.p(190,190)),
                                              cc.moveTo(0.4,cc.p(140,200)),
                                              cc.moveTo(0.4,cc.p(190,220))
                                           ),2),
                                           cc.fadeOut(0.1),
                                           cc.callFunc(function(){
                                             inself.mochu.removeFromParent()
                                             if(lastfun){
                                               lastfun()
                                             }
                                           })
                                       ))
                                    }
                                })
          sp.setPosition(290,290)
          sp.setScale(1.5)
          inself.addChild(sp,7) 
          sp.runAction(spAction)
      }
      yanbo.showHand = function(){
        if(!this.hand1.isVisible()){
           this.hand1.setVisible(true)
           this.hand2.setVisible(true)
           this.hand1.runAction(cc.fadeIn(0.2))
           this.hand2.runAction(cc.fadeIn(0.2))
        } 
      }
      yanbo.hideHand = function(){
        if(this.hand1.isVisible()){
           var inself = this
           this.hand1.runAction(cc.sequence(
              cc.fadeOut(0.3),
              cc.callFunc(function(){
                inself.hand1.setVisible(false)
              })
           ))
           this.hand2.runAction(cc.fadeOut(0.3))
        } 
      }
      yanbo.addZgl = function(lastfun){
          var lay = createLayout({
            op: 0,
            size: cc.size(50, 30),
            clip: true
          })
          lay.setAnchorPoint(1,0.5)
          lay.setPosition(7,165)
          lay.setRotation(-45)
          this.addChild(lay)

         var zgll = new cc.Sprite(res.zgll)
         zgll.setPosition(50,14)
         zgll.setAnchorPoint(1,0.5)
         lay.addChild(zgll)
         zgll.setScaleY(0)

         var inself = this
         this.runAction(cc.sequence(
               cc.rotateTo(0.4,-45),
               cc.callFunc(function(){
                 zgll.runAction(cc.sequence(
                     cc.scaleTo(0.2,1.2,1),
                     cc.repeat(cc.sequence(cc.scaleTo(0.3,1.4,0.8),cc.scaleTo(0.3,1.2,1)),7),
                     cc.scaleTo(0.2,1,0),
                     cc.callFunc(function(){
                        inself.runAction(cc.sequence(
                           cc.rotateTo(0.4,0),
                           cc.moveTo(0.5,cc.p(750,100)),
                           cc.callFunc(function(){
                              inself.IsMove = true
                              inself.hideHand()
                              if(lastfun){
                                lastfun()
                              }
                           })
                        ))
                     })
                  ))
               })
          ))
      }
      return yanbo
    },
    createZglCup:function(){
      var cup = new cc.Sprite(res.zglcup)

      var cup1 = new cc.Sprite(res.zglcup1)
      cup1.setPosition(107.7,106.7)
      cup.addChild(cup1,8)

      var shabu = new cc.Sprite(res.zglsb)
      shabu.setPosition(113.5,184)
      cup.addChild(shabu,10)
      cup.shabu = shabu
     
      cup.showZgl = function(){
          var zgl = new cc.Sprite("#zgl00.png")
          zgl.setPosition(107,74)
          zgl.setScale(1.17)
          this.addChild(zgl)
          var spAction = createAnimation({
                                    frame:"zgl%02d.png",
                                    start:0,
                                    end: 33,
                                    time: 0.15,
                                    fun:function(){

                                    }
                                })
          zgl.runAction(spAction)
      }
      cup.hideShabu = function(){
        this.shabu.runAction(cc.fadeOut(0.5))
      }
      return cup
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
                self.speakeBykey("wenzi1")
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
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })

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
    }  
})