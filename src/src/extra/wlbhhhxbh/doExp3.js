//@author mu @16/5/11
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("guayan")
           loadPlist("bh")
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
      self.clockList = [false,false,true]
      self.imglist = [res.tip3,res.tip3,res.tip3]

      //测试红色框
      self.myDraw = testForDrawNode(self)
      self.startFunlist = [
        null,
        null,
        null
      ]
      var move2 = function(){
        var jjd = self.toolbtn.getindex(2)
        if(jjd &&　jjd.isFire){
           var tempRect = cc.rect(this.x-180,this.y-110,120,60)
           var spRect = cc.rect(jjd.x-20,jjd.y+70,50,50)
           if(this.tang && cc.rectIntersectsRect(tempRect,spRect)){
             jjd.setCanClick(false)
             this.isMove = true
             this.removeListen()
             this.setPosition(jjd.x+130,jjd.y+210)

              jjd.setCallBack({
                down:function(){
                  if(jjd.haveF){
                     jjd.setCanClick(false)
                     jjd.haveF = false
                  }
                }
              })
             
             var pao = new cc.Sprite()
             pao.setPosition(72,45)
             this.addChild(pao)
             var spAction = createAnimation({
                                    frame: "bh%02d.png",
                                    start: 0,
                                    end: 39,
                                    time: 0.25,
                                    fun:function(){
                                        self.speakeBykey("wenzi10")
                                        jjd.setCanClick(true)
                                        self.jitlunbtn.setVisible(true)
                                        jjd.haveF = true
                                        jjd.runAction(cc.sequence(
                                            cc.delayTime(8),
                                            cc.callFunc(function(){
                                              jjd.stopAllActions()
                                              if(jjd.haveF){
                                                jjd.exeDown()
                                              }
                                            })
                                        ))
                                    }
                                })
            pao.runAction(cc.sequence(
               cc.delayTime(7),
               spAction
            ))
            this.tang.runAction(cc.sequence(
                cc.delayTime(5),
                cc.spawn(
                  cc.fadeOut(10),
                  cc.scaleTo(4,0.8)
                )
              ))
           }
        }
      }
      self.moveFunList = [
        null,
        move2,
        null
      ]
      var end1 = function(){
        this.setPosition(350,100)
        this.removeListen()
      }
      var end3 = function(){
        this.setPosition(560,100)
        this.removeListen()
      }
      self.endFunList = [
        end1,
        null,
        end3
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
            dialogControl.AddDialog("Tips", {
              res:self.imglist[curimg],
              face: 1,
              father:self
            })
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
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(100, 505),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.4, 1.2),
            itempos:[cc.p(1, -26),cc.p(1, -20),cc.p(1, -20)],
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                if(index==0){
                  item = self.createBaiTang(self)
                }else if(index==2){
                  item = createJJD()
                  item.setScale(1.2)
                }else if(index == 1){
                  item.opJudge = true
                }
                item.index = index
                item.clock  = self.clockList[index]
                if(self.startFunlist)
                  item.excstartFun = self.startFunlist[index]
                item.checkFun = self.checkFun
                item.setLocalZOrder(LOCAL_ORDER++)

                return item.checkFun()
            },
            movefun:function(data){
               var item = data.sp
               var delta = data.delta
               var index = data.index
               item.data = data
               if(!item.isMove){
                   var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                   item.setPosition(temppos)
                   if(item.excMoveFun)
                   item.excMoveFun()
               }   
            },
            clickfun:function(data){
              var item = data.sp
              item.setLocalZOrder(LOCAL_ORDER++)
              if(item.isMove){
                return false
              }
              return true
            },
            outfun:function(data){
               var item = data.sp
               item.data = data
               data.item = item
               if(item.excEndFun)
                 item.excEndFun()
               return true
            },
            counts:[1,1,1],
            father:toolnode,
            files:[res.item1,res.item2,res.item3],
            gets:[null,res.dshaozi,null]
        })
        this.addChild(this.toolbtn,3)


      var jitlunbtn = new ccui.Button(res.btn_result_normal,res.btn_result_select)
      jitlunbtn.setPosition(1030,420)
      self.addChild(jitlunbtn)
      jitlunbtn.addClickEventListener(function(){
         self.nodebs.say({
                    key: "jielun3"
                })
      })
      self.jitlunbtn = jitlunbtn
      jitlunbtn.setVisible(false)
    },
    createBaiTang:function(father){
       var self = this
       var baiTang = new cc.Sprite(res.baitang)
       var shaozi = new cc.Sprite(res.shaozi)
       shaozi.setPosition(baiTang.width/2+30,baiTang.height+60)
       baiTang.addChild(shaozi)
       shaozi.playAc = function(fun){
          var inself = this
          var spAction = createAnimation({
                                    frame: "guayan%02d.png",
                                    start: 0,
                                    end: 25,
                                    time: 0.1,
                                    fun:function(){
                                      inself.setTexture(res.ysy)
                                      inself.setPosition(inself.x+120,inself.y+13)
                                      inself.isMove = false
                                      if(fun){
                                         fun()
                                      }
                                    }
                                })
          this.runAction(spAction)
       }
       shaozi.playAc1 = function(fun){
            var inself = this
            var spAction = createAnimation({
                                    frame: "guayan%02d.png",
                                    start: 26,
                                    end: 43,
                                    time: 0.1,
                                    origin:true,
                                    fun:function(){
                                       inself.setTexture(res.shaozi)
                                       inself.runAction(cc.spawn(
                                          cc.moveBy(0.5,cc.p(80,80)),
                                          cc.fadeOut(0.5),
                                          cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                                              inself.removeFromParent()
                                          }))
                                        ))

                                       if(fun){
                                         fun()
                                       }
                                    }
                                })
            this.runAction(spAction)
       }
       createTouchEvent({
         item:shaozi,
         begin:function(data){
           var item = data.item
           if(item.isMove){
             return false
           }
           item.setLocalZOrder(LOCAL_ORDER++)
           return true
         },
         move:function(data){
           var item = data.item
           var delta = data.delta
           if(!item.isMove){
              item.x += delta.x
              item.y += delta.y
              var result = judgeItemCrash({
                   item1:item,
                   item2:baiTang
              })
              if(result){
                item.isMove = true
                item.setPosition(20,baiTang.height+40)
                item.playAc(function(){
                  baiTang.runAction(cc.sequence(
                     cc.fadeOut(0.3),
                     cc.callFunc(function(){
                        var pos = getWorldPos(item)
                        safeAdd(father,item)
                        item.setPosition(pos)
                        baiTang.y = -500
                        item.haveTan = true
                     })
                  ))
                })
              }
              var shaozi = self.toolbtn.getindex(1)
              if(shaozi &&　item.haveTan){
                 var tempRect = cc.rect(shaozi.x-180,shaozi.y-110,120,60)
                 var spRect = cc.rect(item.x-item.width/2,item.y-item.height/2,
                　item.width,item.height)
                
                 if(cc.rectIntersectsRect(tempRect,spRect)){
                   item.isMove = true
                   item.removeListen()
                   shaozi.isMove = true
                   item.setPosition(shaozi.x-100,shaozi.y+30)
                   item.playAc1(function(){
                      shaozi.isMove = false
                      self.clockList[2] = false
                      self.speakeBykey("wenzi9")
                   })

                   var tang = new cc.Sprite(res.tang)
                   shaozi.addChild(tang)
                   tang.setScale(0)
                   shaozi.tang = tang
                   tang.setPosition(75,25)
                   tang.runAction(cc.sequence(
                     cc.delayTime(0.2),
                     cc.scaleTo(1.5,1)
                   ))
                 }
              }
           }
         },
         end:function(){

         }
       })
       return baiTang
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
               self.speakeBykey("wenzi8")
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
            key: "wenzi8",
            img:res.wenzi8,
            sound: res.zimp8,
            offset:cc.p(-10,0)
        })
        addContent({
            people: this.nodebs,
            key: "wenzi9",
            img:res.wenzi9,
            sound: res.zimp9,
            offset:cc.p(-5,0)
        })

        addContent({
            people: this.nodebs,
            key: "wenzi10",
            img:res.wenzi10,
            sound: res.zimp10,
            offset:cc.p(-10,20),
            btnoffset:cc.p(0,-20)
        })
        addContent({
            people: this.nodebs,
            key: "jielun3",
            img:res.jielun3,
            id:"result",
            sound:res.jielunmp3,
            offset: cc.p(30, 30),
            offbg: cc.p(20,50),
        })
    }  
})