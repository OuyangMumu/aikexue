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
        this.expCtor() 
        this.initFunlist()
        this.initUI()
        this.initPeople()
        return true
    },
    initFunlist:function(){
      var self = this
      self.clockList = [false,false,false]
      self.imglist = ["wenzi6","wenzi3","wenzi1"]
      self.startFunlist = [
          null,
          null,
          null
      ]

      var toDeal = function(data) {
            var item = data.item
            var toPos = data.toPos
            var fun = data.fun
            var result = judgeItemCrash({
                       item1:item,
                       item2:self.cup.cupSp
                     })
            if (result) {
              item.IsMove = true
              item.runAction(cc.sequence(
                cc.moveTo(0.2,toPos),
                cc.callFunc(function() {
                  item.removeFromParent()
                  if (fun) {
                    fun()
                  }
                })
              ))
            }
      }
      var move1 = function(){
          toDeal({
            item:this,
            toPos: cc.p(550, 100),
            fun: function() {
               self.cup.addJiaoDai(function(){
                  self.cup.haveBu = true
                  self.speakeBykey("wenzi2")
               })
            }
          })
      }
      var move2 = function(){
          var result = judgeItemCrash({
                       item1:this,
                       item2:self.cup.cupSp
                     })
          if(result && self.cup.haveBu){
             this.IsMove = true
             if(self.cup.haveWater){
                this.removeFromParent()
                self.cup.drawXian({
                   fun:function(){
                      self.speakeBykey(res.tip1,1,function(){
                         //self.line.setVisible(true)
                         self.cup.autoAction()
                      })
                      //self.line.changeSome()
                   }
                })
             }else{
                this.setPosition(750,400)
                self.speakeBykey(res.tip3,1)
             }
          }
      }
      var move3 = function(){
         var result = judgeItemCrash({
                       item1:this,
                       item2:self.cup.cupSp
                     })
         if(result){
            this.IsMove = true
            if(self.cup.haveBu){
               this.removeFromParent()
               self.cup.addWater({
                 fun:function(){
                   self.cup.haveWater = true
                 }
               })
            }else{
               this.setPosition(750,400)
               self.speakeBykey(res.tip2,1)
            }
         }
      }
      self.moveFunList = [
          move1,
          move2,
          move3
      ]
 

      var end = function(){
        this.IsMove = false
      }
      self.endFunList = [
          null,
          end,
          end
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
    initUI:function(){
        var self = this

        var dotitle = new cc.Sprite(res.dotitle1)
        dotitle.setPosition(getMiddle(0,280))
        self.addChild(dotitle)

        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(130, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.6, 1.3),
            itempos:[cc.p(1, -12),cc.p(1, -10),cc.p(2, -10)],
            circlepos:cc.p(0,25),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.index = index
                if(index==2){
                   item.setAnchorPoint(0.4,0.6)
                }
                item.clock  = self.clockList[index]
                item.opJudge = true
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
              return true
            },
            father:toolnode,
            files:[res.item1,res.item2,res.item3],
            gets:[res.bigitem1,res.bigitem2,res.bigitem3]
        })
        this.addChild(this.toolbtn,3)

        self.createCup()
    },
    createCup:function(){
        var self = this
        self.cup = ccs.load(res.do1).node
        self.addChild(self.cup)
        self.cup.cupSp = self.cup.getChildByName("cup")
        var cup = self.cup
        cup.upCount = 0
        cup.stopAc = true
        cup.frameList = [149,202,255,309,362,415,468,521,574,626,678,730,782,834,886]

        var line = self.cup.getChildByName("line")
        var waterbtn = new ccui.Button(res.water_nor,res.water_sel)
        waterbtn.setPosition(0,10)
        line.addChild(waterbtn)
        cup.waterbtn = waterbtn
        waterbtn.nor = res.water_nor
        waterbtn.sel = res.water_sel
        waterbtn.addClickEventListener(function(sender,type){
            var nor = sender.nor
            var sel = sender.sel
            if(!sender.ok){
               nor = sender.sel
               sel = sender.nor
               sender.ok = true
               self.cup.setStopAc(false)
            }else{
               sender.ok = false
               self.cup.setStopAc(true)
               self.cup.autoAction() 
            }
            sender.loadTextureNormal(nor)
            sender.loadTexturePressed(sel)
            sender.setTouchEnabled(false)
            sender.runAction(cc.sequence(
               cc.delayTime(0.3),
               cc.callFunc(function(){
                  sender.setTouchEnabled(true)
               })
            ))
        })

        cup.addJiaoDai = function(fun){
          var ac = ccs.load(res.do1).action
          ac.gotoFrameAndPlay(0,100,false)
          ac.setTimeSpeed(0.6)
          ac.setLastFrameCallFunc(function(){
               if(fun){
                 fun()
               }
               ac.clearLastFrameCallFunc()
          })
          this.runAction(ac)
        }
        cup.addWater = function(data){
          var data = data || {}
          var fun = data.fun
          var ac = ccs.load(res.do1).action
          ac.gotoFrameAndPlay(100,135,false)
          ac.setLastFrameCallFunc(function(){
               if(fun){
                 fun()
               }
               ac.clearLastFrameCallFunc()
          })
          this.runAction(ac)
        }
        cup.drawXian = function(data){
          var data = data || {}
          var fun = data.fun
          var ac = ccs.load(res.do1).action
          ac.gotoFrameAndPlay(135,148,false)
          ac.setLastFrameCallFunc(function(){
               if(fun){
                 fun()
               }
               ac.clearLastFrameCallFunc()
          })
          this.runAction(ac)
        }
        cup.setStopAc = function(judge){
          this.stopAc = judge
        }
        cup.autoAction = function(){
          var cup = this
          cc.log("当前的：",cup.upCount)
          if(cup.upCount<14){
              this.stopAllActions()
              var startFrame = cup.frameList[cup.upCount]
              cup.upCount++
              var enframe = cup.frameList[cup.upCount]
              var ac = ccs.load(res.do1).action
              ac.gotoFrameAndPlay(startFrame,enframe,false)
              ac.setLastFrameCallFunc(function(){
                  if(cup.stopAc){
                    cup.autoAction()
                  }
                  ac.clearLastFrameCallFunc()
              })
              this.runAction(ac)
          }else if(cup.upCount==14){
             cup.upCount++
             cup.waterbtn.setVisible(false)
             cup.lastFunFrame()
          }
          
        }
        cup.lastFunFrame = function(){
          this.stopAllActions()
          var ac = ccs.load(res.do1).action
          ac.gotoFrameAndPlay(888,892,false)
          ac.setLastFrameCallFunc(function(){
               ac.clearLastFrameCallFunc()
          })
          this.runAction(ac)
        }
    },
    speakeBykey:function(key,status,closeback){
       var self = this
       if(status!=null){
          dialogControl.AddDialog("Tips", {
            res: key,
            face: 1,
            confirmBtn: true,
            father: self,
            closeBack:closeback
          })
       }else{
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
    }  
})