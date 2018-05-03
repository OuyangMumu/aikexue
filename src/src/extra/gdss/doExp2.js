//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
          loadPlist("guaZao")
          loadPlist("guaZao1")
          loadPlist("waterJ")
          loadPlist("rong")
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
      self.clockList = [false,false,false,false,false,false]
      self.imglist = ["wenzi6","wenzi3","wenzi1","wenzi1","wenzi1","wenzi1"]

      //测试红色框
      self.myDraw = testForDrawNode(self)
      //self.myDraw.drawRectbyRect()
      //self.myDraw.drawDotbyPoint()

      var move3 = function(){
        var tool_item2 = self.toolbtn.getindex(1)
        var tool_item1 = self.toolbtn.getindex(0)
        if(tool_item1 && tool_item2){
          var result = judgeItemCrash({
                          item1:this,
                          item2:tool_item2
                       })
          if(result){
            this.IsMove = true
            this.setVisible(false)
            tool_item2.removeFromParent()
            tool_item1.guaZaoPlay(function(){
              self.speakeBykey("wenzi3")
            })
          }
        }
      }
      self.moveFunList = [
          null,
          null,
          move3,
          null,
          null,
          null
      ]
      var end1 = function(){
        this.removeListen()
        this.runAction(cc.moveTo(0.2,cc.p(440,240)))
        self.speakeBykey("wenzi2")
      }
      var end2 = function(){
        var tool_item1 = self.toolbtn.getindex(0)
        if(tool_item1){
            this.removeListen()
            this.setTexture(res.bigitem3)
            var item = this
            this.runAction(cc.sequence(
              cc.moveTo(0.2,cc.p(360,413)),
              cc.callFunc(function(){
                 item.setVisible(false)
                 tool_item1.guaZao.setVisible(true)
              })
            ))
        }
      }
      var end3 = function(){
        if(this.IsMove){
          this.removeFromParent()
        }
      }
      var end4 = function(){
        var tool_item1 = self.toolbtn.getindex(0)
        if(tool_item1 && tool_item1.haveZao){
           var result = judgeItemCrash({
                           item1:this,
                           item2:tool_item1
                        })
           if(result){
              this.IsMove = true
              this.removeFromParent()
              tool_item1.waterj.setVisible(true)
              tool_item1.haveJiao = true
              tool_item1.waterjPlay(function(){
                 if(tool_item1.haveCe){
                   self.speakeBykey("wenzi5")
                 }else{
                   self.speakeBykey("wenzi4")
                 }
              })
           }
        }
      }
      var end5 = function(){
        var tool_item1 = self.toolbtn.getindex(0)
        if(tool_item1){
           var result = judgeItemCrash({
                           item1:this,
                           item2:tool_item1
                        })
           if(result){
              this.removeListen()
              this.runAction(cc.moveTo(0.2,cc.p(433,256)))
              tool_item1.haveCe = true
              if(tool_item1.haveZao){
                if(tool_item1.haveJiao){
                  self.speakeBykey("wenzi5")
                }else{
                  self.speakeBykey("wenzi3") 
                }
              }else{
                self.speakeBykey("wenzi2")
              }
           }
        }
      }
      var end6 = function(){
        if(true){
          this.removeListen()
          this.setTexture(res.bigitem7)
          var item = this
          this.runAction(cc.sequence(
            cc.moveTo(0.3,cc.p(400,240)),
            cc.callFunc(function(){
                item.setTexture(res.bigitem6)
                var Light = self.createLight()
                Light.setPosition(6,-8)
                self.addChild(Light,1)
                Light.lightPlay(function(){
                   var tool_item1 = self.toolbtn.getindex(0)
                   tool_item1.shuPlay()
                })
                Light.setBtnCallFun(function(){
                   var tool_item6 = self.toolbtn.getindex(5)
                   var tool_item1 = self.toolbtn.getindex(0)
                   tool_item6.forceBack()
                   tool_item1.shuInit()
                })
            })
          ))
        }
      }
      self.endFunList = [
          end1,
          end2,
          end3,
          end4,
          end5,
          end6
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

        var desk = new cc.Sprite(res.desk)
        desk.setPosition(390,40)
        self.addChild(desk)
        var boysee = new cc.Sprite(res.boysee)
        boysee.setPosition(810,145)
        self.addChild(boysee)

        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(350, 550),
            nums:4,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.25, 1.25),
            itempos:[cc.p(1,-20),cc.p(1,-22),cc.p(1,-32),cc.p(1,-15),
            cc.p(1, -23),cc.p(1, -11)],
            circlepos:cc.p(0,15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                if(index==0){
                  item = self.createCup()
                }
                item.index = index
                item.clock  = self.clockList[index]
                item.checkFun = self.checkFun
                item.setLocalZOrder(LOCAL_ORDER++)
                if(index==4){
                  safeAdd(toolnode,item)
                  item.setLocalZOrder(10)
                }
                if(index==5){
                  var tool_item1 = self.toolbtn.getindex(0)
                  if(tool_item1){
                     if(tool_item1.haveZao){
                       if(tool_item1.haveJiao){
                         if(!tool_item1.haveCe){
                            self.speakeBykey("wenzi4")
                            return false
                         }else{
                            safeAdd(toolnode,item)
                            item.setLocalZOrder(3)
                         }
                       }else{
                         self.speakeBykey("wenzi3")
                         return false
                       }
                     }else{
                       self.speakeBykey("wenzi2")
                       return false
                     }
                  }else{
                    self.speakeBykey("wenzi1")
                    return false
                  }
                }
                return item.checkFun()
            },
            clickfun:function(data){
                var item = data.sp
                var index = data.index
                item.data = data
                data.item = item
                if(item.IsMove){
                  return false
                }
                item.setLocalZOrder(LOCAL_ORDER++)
                if(index==4){
                  safeAdd(toolnode,item)
                  item.setLocalZOrder(10)
                }
                if(index==5){
                  safeAdd(toolnode,item)
                  item.setLocalZOrder(3)
                }
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
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4,res.item7,res.item6],
            gets:[null,res.bigitem1,res.bigitem2,res.bigitem4,res.bigitem10,res.bigitem6]
        })
        this.addChild(this.toolbtn,3)

        var resultbtn = new ccui.Button(res.btn_jielun_normal,
        res.btn_jielun_select)
        resultbtn.setPosition(1030,400)
        this.addChild(resultbtn)
        this.resultbtn = resultbtn
        resultbtn.addClickEventListener(function(){
            self.nodebs.say({
              key: "wenzi11"
            })
        })    
    },
    createLight:function(){
      var node = new cc.Node()
      node.light1 = createClip({
                           toShowimg:res.shu1,
                           ShowimgPos:cc.p(210,280),
                           toSencilimg:res.shu3,
                           sencilPos:cc.p(-282,416),
                           father:node,
                           secil_roto:14,
                           roto:-120
                       })

      node.lightPlay = function(fun){
        var node = this
        var light1 = node.light1
        var mov = cc.moveTo(1.2,cc.p(210,280))
        var cal = cc.callFunc(function(){
          node.visFrom.setVisible(true)
          node.movBtn.setVisible(true)
          if(fun){
            fun()
          }
        })
        light1.moveSecil(mov,cal)
      }
      node.setBtnCallFun = function(fun){
         node._btnFun = fun
      }
      
      node.visFrom = new cc.Sprite(res.bigitem9)
      node.visFrom.setPosition(200,430)
      node.addChild(node.visFrom)
      node.visFrom.setVisible(false)

      node.movBtn = new ccui.Button(res.mov_nor,res.mov_sel)
      node.movBtn.setPosition(450,400)
      node.addChild(node.movBtn)
      node.movBtn.setVisible(false)
      node.movBtn.addClickEventListener(function(){
          node.removeFromParent()
          if(node._btnFun){
           node._btnFun()
          }
      })

      return node
    },
    createCup:function(){
      var cup = new cc.Sprite(res.cup1)

      var cuphuo = new cc.Sprite(res.cup3)
      cuphuo.setScale(0.8)
      cuphuo.setPosition(146,60)
      cup.addChild(cuphuo)
      cup.cuphuo = cuphuo
      cuphuo.setOpacity(140)

      var guaZao = new cc.Sprite("#guaZao00.png")
      guaZao.setPosition(147,160)
      cup.addChild(guaZao)
      cup.guaZao = guaZao
      guaZao.setVisible(false)
      cup.guaZaoPlay = function(fun){
          var cup = this
          var guaZao = this.guaZao
          var spAction = createAnimation({
                                    frame:"guaZao%02d.png",
                                    start:0,
                                    end: 61,
                                    time: 0.08,
                                    fun:function(){
                                       cup.haveZao = true
                                       if(fun){
                                         fun()
                                       }
                                    }
                                })
          guaZao.runAction(spAction)
      }
  
      var rong = new cc.Sprite("#rong00.png")
      rong.setPosition(142.8,37.5)
      cup.addChild(rong)
      cup.rong = rong
      rong.setVisible(false)
      cup.rongPlay = function(){
        var rong = this.rong
        rong.setVisible(true)
        var spAction = createAnimation({
                                    frame:"rong%02d.png",
                                    start:0,
                                    end: 29,
                                    time: 0.1,
                                    fun:function(){
                                      rong.removeFromParent()
                                    }
                                })
        rong.runAction(spAction)
      }
      cup.shu = createClip({
                         toShowimg:res.shu4,
                         ShowimgPos:cc.p(168,110),
                         toSencilimg:res.shu5,
                         sencilPos:cc.p(146,58),
                         father:cup,
                       })
      cup.shuInit = function(){
        var cup = this
        cup.shu.setMUspPos(cc.p(168,110),cc.p(146,58))
      }
      cup.shuPlay = function(){
        var cup = this
        var shu = cup.shu
        shu.runAction(cc.moveTo(0.1,cc.p(144,60)))
      }
      var waterj = new cc.Sprite("#waterJ00.png")
      waterj.setPosition(175,132)
      cup.addChild(waterj)
      cup.waterj = waterj
      waterj.setVisible(false)
      cup.waterjPlay = function(fun){
          var cup = this
          var waterj = this.waterj
          var cuphuo = this.cuphuo
          var guaZao = this.guaZao
          var rong = this.rong
          guaZao.removeFromParent()
          cup.rongPlay()
          var spAction = createAnimation({
                                    frame:"waterJ%02d.png",
                                    start:0,
                                    end: 44,
                                    time: 0.1,
                                    fun:function(){
                                       waterj.removeFromParent()
                                       if(fun){
                                         fun()
                                       }
                                    }
                                })
          cuphuo.runAction(cc.sequence(
             cc.delayTime(2),
             cc.fadeIn(2)
          ))
          waterj.runAction(spAction)
      }

      var cupPre = new cc.Sprite(res.cup2)
      cupPre.setPosition(146,95)
      cup.addChild(cupPre)
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

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi7,
            sound: res.zimp7
        })

        addContent({
            people: this.nodebs,
            key: "wenzi5",
            img:res.wenzi5,
            sound: res.zimp5
        })

        addContent({
           people: this.nodebs,
           key: "wenzi11",
           img:res.wenzi11,
           id:"result",
           sound: res.zimp11,
           offset: cc.p(30,15),
           offbg: cc.p(20,10),
           btnModify:cc.p(0,0)
        })
    }  
})