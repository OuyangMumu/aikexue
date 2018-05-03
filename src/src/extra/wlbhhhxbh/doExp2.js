//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("gsrFires")
           loadPlist("gsrzhuo")
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
      self.imglist = ["wenzi5","wenzi6","wenzi7"]
      self.speakeSeq = [true,true,true]
      self.showCount = 0

      //测试红色框
      self.myDraw = testForDrawNode(self)
   
      var start1and2 = function(){
         var inself = this 
         this.IsMove = true
         this.runAction(cc.sequence(
            cc.rotateTo(0.3,180),
            cc.callFunc(function(){
               inself.IsMove = false
            })
          ))
      }
      self.startFunlist = [
        start1and2,
        start1and2,
        null
      ]

      var move1and2 = function(){
         var delta = this.data.delta 
         var tempy = this.y + delta.y
         safeAdd(this.insideNode,self.laz)
         self.laz.setRotation(-180)
         this.x = 468
         if(tempy<=240){
            this.y = 240
            if(!this.noStop){
              this.IsMove = true
              var inself = this
              this.changeStatues(function(){
                inself.noStop = true
                inself.IsMove = false
                if(inself.index==0){
                   self.speakeSeq[0] = false
                   self.showCount++
                }else{
                   self.speakeSeq[1] = false
                   self.showCount++
                }
                self.speakeBykey()
              })
            }
         }else{
           this.y = tempy
         }
         self.laz.setPosition(this.insideNode.convertToNodeSpace(self.laz.initPos))
         if(this.y>=320){
           self.laz.resetFun()
         }
      }
      self.moveFunList = [
        move1and2,
        move1and2,
        null
      ]

      var end3 = function(){
         var spRect = cc.rect(this.x-150,this.y-70,200,130)
         var laz = self.lazh.getParent()
         var otherRect = cc.rect(laz.x-18,laz.y+100,40,60)
         var result = cc.rectIntersectsRect(spRect,otherRect)
         if(result && !this.showHuo){
           this.setPosition(laz.x+60,laz.y+200)
           this.IsMove = true
           this.setSpriteFrame("zhuo2.png")
           var inself = this
           this.runAction(cc.sequence(
               cc.delayTime(8),
               cc.moveBy(0.3,cc.p(200,0)),
               createAnimation({
                                frame:"zhuo%d.png",
                                start:3,
                                end: 7,
                                time: 0.1,
                                fun:function(){
                                   inself.IsMove = false
                                   inself.showHuo = true
                                   inself.runAction(cc.sequence(
                                      cc.delayTime(1),
                                      cc.callFunc(function(){
                                        self.showCount++
                                        self.speakeBykey()
                                        
                                      })
                                    ))
                                }
                              })
            ))
         }
      }
      self.endFunList = [
        null,
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
            ///self.speakeBykey(self.imglist[curimg])
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
        var laz = new cc.Sprite(res.laz)
        laz.initPos = getMiddle(-100,-200)
        laz.setPosition(laz.initPos)
        self.addChild(laz)
        self.laz = laz
        laz.resetFun = function(){
           safeAdd(self,this)
           this.setRotation(0)
           this.setPosition(this.initPos)
        }
        var lazh = new cc.Sprite(res.lazh)
        lazh.setPosition(laz.width/2,laz.height+lazh.height/2-10)
        laz.addChild(lazh)
        var spAction = createAnimation({
                                    frame: "fire%02d.png",
                                    start: 0,
                                    end: 19,
                                    time: 0.1
                                  })
        lazh.runAction(cc.repeatForever(spAction))
        self.lazh = lazh

        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(350, 540),
            nums:3,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.5),
            itempos:[cc.p(1, -20),cc.p(1, -24),cc.p(3, -22)],
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                self.laz.resetFun()
                for(var i in toolnode.getChildren()){
                  toolnode.getChildren()[i].forceBack()
                }
                if(index==0){
                   item = self.createCup(2)
                }else if(index==1){
                   item = self.createCup(1)
                }else{
                   item = new cc.Sprite("#zhuo1.png")
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
                  if(index==2){
                     var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                     item.setPosition(temppos)
                  }
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
            counts:[1,1,1],
            father:toolnode,
            files:[res.item4,res.item5,res.item6],
            gets:[null,null,null]
        })
        this.addChild(this.toolbtn,3)


      var jitlunbtn = new ccui.Button(res.btn_result_normal,res.btn_result_select)
      jitlunbtn.setPosition(1030,420)
      self.addChild(jitlunbtn)
      jitlunbtn.addClickEventListener(function(){
         self.nodebs.say({
                    key: "jielun2"
                })
      })
      self.jitlunbtn = jitlunbtn
      jitlunbtn.setVisible(false)
    },
    createCup:function(type){
      var wuCup = new cc.Sprite(res.wuCup2)
      wuCup.initOne = function(){
         var wu1 = new cc.Sprite(res.wu1)
         wu1.setPosition(84.6,53.9)
         wu1.setScale(1.04)
         this.addChild(wu1,3)
         this.wu1 = wu1
         wu1.setOpacity(30)

         var wu2 = new cc.Sprite(res.wu2)
         wu2.setPosition(84.64,50.68)
         wu2.setScale(1.02)
         this.addChild(wu2,6)
         this.wu2 = wu2
         wu2.setOpacity(30)

         this.changeStatues = function(fun){
            this.wu1.runAction(cc.fadeIn(6))
            this.wu2.runAction(cc.sequence(
                cc.fadeIn(6),
                cc.callFunc(fun)
              ))
         }
      }
      wuCup.initTwo = function(){
         var wu3 = new cc.Sprite(res.wu3)
         wu3.setPosition(85.9,40.5)
         wu3.setScale(1.02,1.15)
         this.addChild(wu3,2)
         this.wu3 = wu3
         wu3.setOpacity(0)

         var wu5 = new cc.Sprite(res.wu5)
         wu5.setPosition(82.9,55)
         wu5.setScale(0.78)
         this.addChild(wu5,4)
         this.wu5 = wu5
         wu5.setOpacity(0)

         var wu4 = new cc.Sprite(res.wu4)
         wu4.setPosition(85.5,36.25)
         wu4.setScale(1.01,1.01)
         this.addChild(wu4,6)
         this.wu4 = wu4
         wu4.setOpacity(0)

         this.changeStatues = function(fun){
            this.wu3.runAction(cc.fadeIn(6))
            this.wu4.runAction(cc.fadeIn(6))
            this.wu5.runAction(cc.sequence(
              cc.delayTime(3),
              cc.fadeIn(3),
              cc.callFunc(fun)
            ))
         }
      }
      switch(type){
        case 1:
          wuCup.initOne()
        break
        case 2:
          wuCup.initTwo()
        break
        default:
        break
      }

      wuCup.insideNode = new cc.Node()
      wuCup.insideNode.setPosition(wuCup.width/2,wuCup.height/2)
      wuCup.addChild(wuCup.insideNode,5)

      var wuCupBefor = new cc.Sprite(res.wuCup1)
      wuCupBefor.setPosition(73.52,72.65)
      wuCup.addChild(wuCupBefor,10)

      return wuCup
    },
    speakeBykey:function(){
      var self = this
      var curimg = 0
      for (var k = 0; k < 3; k++) {           
        if (!self.speakeSeq[k]){
          curimg = k+1
        }else{
          break
        }        
      }
      if(self.showCount<3){
        cc.log("curimg",curimg)
        self.nodebs.say({
                      key:self.imglist[curimg],
                      force: true
                  })
      }else{
        self.jitlunbtn.setVisible(true)
      }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
               self.speakeBykey()
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
            key: "wenzi5",
            img:res.wenzi5,
            sound: res.zimp5,
            //offset:cc.p(-10,0)
        })

        addContent({
            people: this.nodebs,
            key: "wenzi6",
            img:res.wenzi6,
            sound: res.zimp6,
            //offset:cc.p(-10,0)
        })

        addContent({
            people: this.nodebs,
            key: "wenzi7",
            img:res.wenzi7,
            sound: res.zimp7,
            //offset:cc.p(-10,0)
        })

        addContent({
            people: this.nodebs,
            key: "jielun2",
            img:res.jielun2,
            id:"result",
            sound:res.jielunmp2,
            offset: cc.p(30, 30),
            offbg: cc.p(20,50),
        })
    }  
})