/**
 * Created by Administrator on 2016/6/1.
 */
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super()
        this.load(function(){
            loadPlist("bx")
            loadPlist("cg")
            loadPlist("naiMei")
            loadPlist("baoMei")
            loadPlist("danMei")
            loadPlist("bg_zi")
        })
        var self = this
        this.expCtor({
          vis: false,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.biao1,
                      isShowResult: false,
                      scale: 0.9
                  })
                  var that = bg.getBg()
                  createBgMoveSp({
                    father:that,
                    imgs:[
                        ["#bg_zi1.png",0],
                        ["#bg_zi2.png",1],
                        ["#bg_zi3.png",0],
                        ["#bg_zi4.png",1],
                        ["#bg_zi5.png",1],
                        ["#bg_zi6.png",0]
                    ],
                    pos:cc.p(690,340),
                    disy:-60,
                    itemScale:0.9,
                    resultfather:self,
                    rectlist:[
                       cc.rect(145,175,148,140),
                       cc.rect(308,175,148,140),
                       cc.rect(468,175,148,140),
                       cc.rect(145,10,148,140),
                       cc.rect(308,10,148,140),
                       cc.rect(468,10,148,140)
                    ]
                  })
                  bg.upLoadFun = function(){
                      that.upResult1(3)
                  }
                  bg.ClearFun = function(){
                      that.clearData()
                  }
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
       var self = this
        var uinamelist = [
           "check1","check2","check3","check4",
           "bx","cg","inbx","outbx","incg"
        ]
        var node = loadNode(res.do1,uinamelist);
        this.allnode = node
        self.inside_node.addChild(node)

        node.openBx = function(fun){
            var curnode = this
            var spAction = createAnimation({
                                    frame:"bx%02d.png",
                                    start:0,
                                    end:19,
                                    time: 0.1,
                                    fun:fun
                                })
            curnode.bx.runAction(spAction)
        }
        node.openCg = function(fun){
            var curnode = this
            var spAction = createAnimation({
                                    frame:"cg%02d.png",
                                    start:0,
                                    end:17,
                                    time: 0.1,
                                    fun:fun
                                })
            curnode.cg.runAction(spAction)
        }
        node.showTime = function(data){
           var data = data || {}
           var posOffset = data.posOffset || cc.p(0,0)
           self.timeClock.setVisible(true)
           self.timeClock.addOneTimer()
           self.timeClock.setPosition(self.timeClock.x + posOffset.x,
           self.timeClock.y + posOffset.y)
        }

        self.controlNode = new cc.Node()
        self.addChild(self.controlNode)
        self.controlNode.init = function(node){
           this.removeAllChildren()
           self.timeClock.removeTimer()
           for(var i=1; i<=4; i++){
             node[sprintf("check%d",i)].Ok = false
           }
           node.bx.setSpriteFrame("bx00.png")
           node.cg.setSpriteFrame("cg00.png")
           node.inbx.removeAllChildren()
           node.outbx.removeAllChildren()
           node.incg.removeAllChildren()
           self.resultbtn.hideSelf()
        }
        self.createBtn()
        self.createClock()
        self.createSupposue1({
          curNode:node,
          father:self.controlNode
        })
    },
    createClock:function(){
       var self = this
       self.curCount = 2
       var timeClock = new cc.Sprite(res.fen6)
       timeClock.setPosition(548,50)
       self.addChild(timeClock)
       timeClock.Time = 1
       timeClock.initPos = timeClock.getPosition()
       self.timeClock = timeClock
       timeClock.label = new cc.LabelTTF("1","",30)
       timeClock.label.setColor(cc.color(200,15,220))
       timeClock.label.setPosition(timeClock.width-15,timeClock.height/2)
       timeClock.addChild(timeClock.label)
       timeClock.setVisible(false)

       var danwei = new cc.Sprite(res.fen8)
       danwei.setScale(1.2)
       danwei.setPosition(timeClock.width+20,timeClock.height/2+1)
       timeClock.addChild(danwei)

       timeClock.addOneTimer = function(fun){
          var timeClock = this
          timeClock.runAction(cc.repeatForever(cc.sequence(
             cc.delayTime(4),
             cc.callFunc(function(){
                timeClock.Time++
                timeClock.label.setString(timeClock.Time)
                if(timeClock.Time>=7){
                  timeClock.stopAllActions()
                  self.resultbtn.setVisible(true)
                }
             })
          )))
       }
       timeClock.removeTimer = function(){
         var timeClock = this
         timeClock.setVisible(false)
         timeClock.stopAllActions()
         timeClock.Time = 1
         timeClock.label.setString(timeClock.Time)
         timeClock.setPosition(timeClock.initPos)
       }
    },
    createBtn:function(){
       var self = this
       var listZi = []
       var listBtn = []
       var choseFun = function(index){
          switch(index){
             case 0:
              self.createSupposue1({
                  curNode:self.allnode,
                  father:self.controlNode
                })
             break
             case 1:
             self.createSupposue2({
                  curNode:self.allnode,
                  father:self.controlNode
                })
             break
             case 2:
             self.createSupposue3({
                  curNode:self.allnode,
                  father:self.controlNode
                })
             break
          }
          for(var i=0; i < 3; i++){
            if(index != i){
              listBtn[i].loadTextureNormal(listBtn[i].nor)
              listBtn[i].loadTexturePressed(listBtn[i].sel)
              listZi[i].setVisible(false)
            }else{
              listBtn[i].loadTextureNormal(listBtn[i].sel)
              listBtn[i].loadTexturePressed(listBtn[i].nor)
              listZi[i].setVisible(true)
            }
          }
       }
       for(var i=0; i < 3; i++){
         var sp = new cc.Sprite(res[sprintf("surppuseTip%d",i+1)])
         sp.setPosition(568,610)
         self.addChild(sp)
         listZi[i] = sp
         sp.setVisible(false)

         var btn = new ccui.Button()
         btn.setPosition(1045,480 - i*70)
         self.addChild(btn)
         listBtn[i] = btn
         btn.nor = res[sprintf("surppuseBtn%d_nor",i+1)]
         btn.sel = res[sprintf("surppuseBtn%d_sel",i+1)]
         btn.index = i
         btn.loadTextureNormal(btn.nor)
         btn.loadTexturePressed(btn.sel)
         btn.addClickEventListener(function(sender,type){
            self.controlNode.init(self.allnode)
            choseFun(sender.index)
            self.speakeBykey(sprintf("wenzi%d",sender.index+1))
            self.curCount = sender.index + 2
         })
       }

       //init
       listZi[0].setVisible(true)
       listBtn[0].loadTextureNormal(listBtn[0].sel)
       listBtn[0].loadTexturePressed(listBtn[0].nor)

       //现象btn
       var resultbtn = new ccui.Button(res.btn_result_normal,
       res.btn_result_select)
       resultbtn.setPosition(90,400)
       this.addChild(resultbtn)
       resultbtn.setVisible(false)
       resultbtn.addClickEventListener(function(){
          if(!self.dialog){
             var curStr = sprintf("jielun%d",self.curCount)
             self.dialog = createShowImg({
                            img:res[curStr],
                            bgInfo:{
                               sizeScale:cc.p(1.25,1.25)
                            },
                            inFun:function(){
                               self.speakeBykey(curStr)  
                            },
                            outFun:function(){
                               self.nodebs.stopSay()
                               self.dialog.removeFromParent()
                               self.dialog = null
                            }
                          })
             self.dialog.setVisible(true)
             self.addChild(self.dialog)
          }
          self.dialog.show()
       })
       self.resultbtn = resultbtn
       resultbtn.hideSelf = function(){
          var resultbtn = this
          resultbtn.setVisible(false)
          if(self.dialog){
            self.dialog.setVisible(false)
            self.nodebs.stopSay()
            self.dialog.removeFromParent()
            self.dialog = null
          } 
       }
    },
    createSupposue1:function(data){
       var data = data||{}
       var curNode = data.curNode
       var father = data.father

       var node = new cc.Node()
       node.changeFood = null
       node.food1 = new cc.Sprite(res.food1)
       node.food1.setPosition(430,100)
       node.food1.initPos = node.food1.getPosition()
       node.addChild(node.food1)

       node.food2 = new cc.Sprite(res.food1)
       node.food2.setPosition(650,100)
       node.food2.initPos = node.food2.getPosition()
       node.addChild(node.food2)

       node.checkAndShow = function(data){
          var data = data||{}
          var node = this
          var curNode = data.curNode
          if(curNode.check1.Ok && curNode.check2.Ok){
             node.show({
               curNode:curNode
             })
          }
       }
       node.show = function(data){
         var node = this
         var data = data||{}
         var curNode = data.curNode
         curNode.showTime()
         var see1 = new cc.Sprite(res.pian1)
         see1.setPosition(400,210)
         node.addChild(see1)
         var food1 = new cc.Sprite(res.food1)
         food1.setPosition(see1.width/2,see1.height/2)
         see1.addChild(food1)
         var ti1 = new cc.Sprite(res.ti1)
         ti1.setPosition(see1.width/2,see1.height/2-50)
         see1.addChild(ti1)
         addMoving(see1)

         var see2 = new cc.Sprite(res.pian2)
         see2.setPosition(700,210)
         node.addChild(see2)
         var food2 = new cc.Sprite(res.food1)
         food2.setPosition(see2.width/2,see2.height/2)
         see2.addChild(food2)

         var ti2 = new cc.Sprite(res.ti2)
         ti2.setPosition(see2.width/2,see2.height/2-50)
         see2.addChild(ti2)
         addMoving(see2)
         
         var createMei = function(curSp){
            var mei = new cc.Sprite(res.naiMei00)
            mei.setPosition(70,132)
            curSp.addChild(mei)
            var spAction = createAnimation({
                                    frame:"naiMei%02d.png",
                                    start:0,
                                    end:60,
                                    time: 0.45
                                })
            mei.runAction(spAction)
         }
         if(node.changeFood){
            createMei(node.changeFood)
            createMei(food2)
         }
       }

       var addListen = function(item){
           createTouchEvent({
              item:item,
              begin:function(){
                 return true
              },
              move:function(data){
                var item = data.item
                var delta = data.delta
                var result = judgeItemCrash({
                   item1:item,
                   item2:curNode.check1
                })
                var result1 = judgeItemCrash({
                   item1:item,
                   item2:curNode.check2
                })
                if(result && !curNode.check1.Ok){
                   item.isMove = true
                   item.setPosition(curNode.check1.x,curNode.check1.y-20)
                   item.removeListen()
                   item.runAction(cc.sequence(
                     cc.delayTime(0.7),
                     cc.scaleTo(0.1,0.3,0.3),
                     cc.callFunc(function(){
                        safeAdd(curNode.inbx,item)
                        item.setPosition(0,16)
                     })
                   ))
                   curNode.check1.Ok = true
                   curNode.openBx(function(){
                      node.checkAndShow({
                           curNode:curNode
                        })
                   })
                   return
                }
                if(result1 && !curNode.check2.Ok){
                   item.isMove = true
                   curNode.check2.Ok = true
                   node.changeFood = item
                   item.removeListen()
                   item.runAction(cc.sequence(
                      cc.spawn(
                        cc.scaleTo(0.1,0.3,0.3),
                        cc.moveTo(0.1,cc.p(405,333))
                      ),
                      cc.callFunc(function(){
                        safeAdd(curNode.outbx,item)
                        item.setPosition(0,15)
                        node.checkAndShow({
                           curNode:curNode
                        })
                      })
                     ))
                   return
                }
                if(!item.isMove){
                   item.x += delta.x
                   item.y += delta.y
                }
              },
              end:function(data){
                 var item = data.item
                 if(!item.isMove){
                    item.setPosition(item.initPos)
                 }
              }
           })
       }
       addListen(node.food1)
       addListen(node.food2)

       father.addChild(node)
       return node
    },
    createSupposue2:function(data){
       var data = data||{}
       var curNode = data.curNode
       var father = data.father

       var node = new cc.Node()
       node.changeFoodindex = null
       node.food1 = new cc.Sprite(res.food2)
       node.food1.setPosition(430,90)
       node.food1.initPos = node.food1.getPosition()
       node.food1.index = 1
       node.addChild(node.food1)
  
       node.food2 = new cc.Sprite(res.food2)
       node.food2.setPosition(650,90)
       node.food2.initPos = node.food2.getPosition()
       node.food2.index = 2
       node.addChild(node.food2)
      
       var playAc = function(){
          var food = this
          var up = new cc.Sprite(res.baoMei1)
          up.setPosition(90,100)
          food.addChild(up)
          up.setOpacity(0)
          var down = new cc.Sprite(res.baoMei2)
          down.setPosition(111,32)
          food.addChild(down)
          down.setOpacity(0)
          up.runAction(cc.fadeIn(14))
          down.runAction(cc.sequence(
             cc.delayTime(3),
             cc.fadeIn(8)
          ))
       }
       node.food1.playAc = playAc
       node.food2.playAc = playAc

       node.show = function(data){
         var node = this
         var data = data||{}
         var curNode = data.curNode
         curNode.showTime({
           posOffset:cc.p(0,140)
         })

         var see1 = new cc.Sprite(res.pian3)
         see1.setPosition(560,330)
         node.addChild(see1)
         var food1 = new cc.Sprite(res.food2)
         food1.setPosition(see1.width/2,see1.height/2)
         see1.addChild(food1)
         var ti1 = new cc.Sprite(res.ti3)
         ti1.setPosition(see1.width/2,see1.height/2-50)
         see1.addChild(ti1)
         addMoving(see1)

         var createMei = function(curSp){
            var mei = new cc.Sprite(res.baoMei00)
            mei.setPosition(92.8,70.62)
            curSp.addChild(mei)
            var spAction = createAnimation({
                                    frame:"baoMei%02d.png",
                                    start:0,
                                    end:60,
                                    time: 0.4
                                })
            mei.runAction(spAction)
         }
         if(node.changeFoodindex){
           switch(node.changeFoodindex){
              case 1:
                 node.food2.playAc()
                 createMei(food1)
                 createMei(node.food1)
              break
              case 2:
                 node.food1.playAc()
                 createMei(food1)
                 createMei(node.food2)
              break
           }
         }
       }

       var addListen = function(item){
           createTouchEvent({
              item:item,
              begin:function(){
                 return true
              },
              move:function(data){
                var item = data.item
                var delta = data.delta
                var result = judgeItemCrash({
                   item1:item,
                   item2:curNode.check3
                })
                if(result && !curNode.check3.Ok){
                   item.isMove = true
                   curNode.check3.Ok = true
                   node.changeFoodindex = item.index
                   node.food1.removeListen()
                   node.food2.removeListen()
                   item.runAction(cc.sequence(
                     cc.spawn(
                       cc.scaleTo(0.2,0.25,0.25),
                       cc.moveTo(0.2,cc.p(curNode.check3.x+20,curNode.check3.y))
                     ),
                     cc.callFunc(function(){
                         node.show({
                           curNode:curNode
                         })
                     })
                   ))
                   return
                }
                if(!item.isMove){
                   item.x += delta.x
                   item.y += delta.y
                }
              },
              end:function(data){
                 var item = data.item
                 if(!item.isMove){
                    item.setPosition(item.initPos)
                 }
              }
           })
       }
       addListen(node.food1)
       addListen(node.food2)

       father.addChild(node)
    },
    createSupposue3:function(data){
       var data = data||{}
       var curNode = data.curNode
       var father = data.father

       var node = new cc.Node()
       node.changeFoodindex = null
       node.food1 = new cc.Sprite(res.food3)
       node.food1.setPosition(420,90)
       node.food1.initPos = node.food1.getPosition()
       node.food1.index = 1
       node.addChild(node.food1)
  
       node.food2 = new cc.Sprite(res.food3)
       node.food2.setPosition(650,90)
       node.food2.initPos = node.food2.getPosition()
       node.food2.index = 2
       node.addChild(node.food2)
      
       var playAc = function(){
          var food = this
          var up = new cc.Sprite(res.baoMei3)
          up.setPosition(83,66)
          food.addChild(up)
          up.setOpacity(0)
          up.runAction(cc.fadeIn(23))
       }
       node.food1.playAc = playAc
       node.food2.playAc = playAc

       node.show = function(data){
         var node = this
         var data = data||{}
         var curNode = data.curNode
         curNode.showTime({
           posOffset:cc.p(0,140)
         })

         var see1 = new cc.Sprite(res.pian4)
         see1.setPosition(560,330)
         node.addChild(see1)
         var food1 = new cc.Sprite(res.food3)
         food1.setPosition(see1.width/2,see1.height/2)
         see1.addChild(food1)
         var ti1 = new cc.Sprite(res.ti4)
         ti1.setPosition(see1.width/2,see1.height/2-80)
         see1.addChild(ti1)
         addMoving(see1)

         var createMei = function(curSp){
            var mei = new cc.Sprite(res.danMei00)
            mei.setPosition(81,72)
            curSp.addChild(mei)
            var spAction = createAnimation({
                                    frame:"danMei%02d.png",
                                    start:0,
                                    end:60,
                                    time: 0.4
                                })
            mei.runAction(spAction)
         }
         if(node.changeFoodindex){
           switch(node.changeFoodindex){
              case 1:
                 node.food2.playAc()
                 createMei(food1)
                 createMei(node.food1)
              break
              case 2:
                 node.food1.playAc()
                 createMei(food1)
                 createMei(node.food2)
              break
           }
         }
       }

       var addListen = function(item){
           createTouchEvent({
              item:item,
              begin:function(){
                 return true
              },
              move:function(data){
                var item = data.item
                var delta = data.delta
                var result = judgeItemCrash({
                   item1:item,
                   item2:curNode.check4
                })
                if(result && !curNode.check4.Ok){
                   item.isMove = true
                   curNode.check4.Ok = true
                   node.changeFoodindex = item.index
                   node.food1.removeListen()
                   node.food2.removeListen()
                   item.setPosition(curNode.check4.x-30,curNode.check4.y-40)
                   item.runAction(cc.sequence(
                      cc.delayTime(0.6),
                      cc.scaleTo(0.2,0.4,0.4),
                      cc.callFunc(function(){
                          safeAdd(curNode.incg,item)
                          item.setPosition(-30,-30)
                      })
                   ))
                   curNode.openCg(function(){
                      node.show({
                         curNode:curNode
                      })
                   })
                   return
                }
                if(!item.isMove){
                   item.x += delta.x
                   item.y += delta.y
                }
              },
              end:function(data){
                 var item = data.item
                 if(!item.isMove){
                    item.setPosition(item.initPos)
                 }
              }
           })
       }
       addListen(node.food1)
       addListen(node.food2)

       father.addChild(node)
    },
    speakeBykey:function(key){
        var self = this
        self.nodebs.say({
                    key:key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        var self = this
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
                self.speakeBykey("wenzi1")  
            })     
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"student",
            pos:cc.p(1030, 130)
        })
        this.addChild(this.nodebs,500)

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
            key: "jielun2",
            sound: res.jielunmp2
        })
        addContent({
            people: this.nodebs,
            key: "jielun3",
            sound: res.jielunmp3
        })
        addContent({
            people: this.nodebs,
            key: "jielun4",
            sound: res.jielunmp4
        })
    }
})