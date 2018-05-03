//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
          loadPlist("tieWater")
          loadPlist("tieWater1")
          loadPlist("tieWater2")
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               var buf = []
               for(var i=0; i<4; i++){
                buf.push([null,res.chose1,res.chose2,res.chose3])
               }
               if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.bg_biao1,
                      scale: 0.9,
                      downNums:4,
                      downData:{
                        nums:4,
                        bufs:buf,
                        keys:[
                         1,1,3,2
                        ],
                        keyEndFun:function(key){
                          cc.log("key",key)
                          self.bgg[sprintf("zi%d",key)].setVisible(true)
                        }
                      },
                      userUIlist:["zi1","zi2","zi3","zi4"]
                  })
                  self.addChild(bg)
                  self.bgg = bg
                  bg.setClear(function(){
                    for(var k=1; k<=4; k++){
                      bg[sprintf("zi%d",k)].setVisible(false)
                    }
                  })
               }
               var bg = self.bgg
               bg.show()
            }
          }
        }) 
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
      var start4 = function(){
         this.mycount =1
      }
      self.startFunlist = [
          null,
          null,
          null,
          start4,
          null
      ]
      var move234 = function(){
        var tempRect = cc.rect(this.x-this.width/2+45,this.y-this.height/2+10,
        this.width-60,this.height-20)
        for (var i = 0; i < self.cupList.length; i++) {
          var cup = self.cupList[i]
          if(!cup.haveWater && cc.rectContainsPoint(tempRect,cup.checkPos)){
            this.IsMove = true
            if(cup.haveDi){
               this.setVisible(false)
               this.noneLis = true
               this.daowater = cup
               cup.haveWater = true
               if(this.index==3){
                 this.setPosition(cup.x+70,cup.y+100)
               }
               cup.initAc(this.index)
            }else{
               this.setPosition(cup.x-40,cup.y+80)
              self.speakeBykey("wenzi3")
            }
            break
          }
        } 
      }
      var move5 = function(){
        var tempRect = cc.rect(this.x-this.width/2,this.y-this.height/2,
          this.width,this.height)
        for (var i = 0; i < self.cupList.length; i++) {
          var cup = self.cupList[i]
          if( !cup.haveDi && cc.rectContainsPoint(tempRect,cup.checkPos)){
            this.IsMove = true
            this.setVisible(false)
            cup.haveDi = true
            cup.Atieding.setVisible(true)
            this.noneLis = true
            this.TieDing = cup.Atieding
            break
          }
        }
      }
      self.moveFunList = [
           null,
           move234,
           move234,
           move234,
           move5, 
      ]
      self.curCup = 0
      self.cupList = []
      self.shuList = ["①","②","③","④"]
      self.all = 0
      var createAcup = function(){
         var cup = new cc.Node()
         var bei2 = new cc.Sprite(res.bei2)
         bei2.setPosition(-100,-62.3)
         cup.addChild(bei2)
         
         var bei3 = new cc.Sprite(res.bei3)
         bei3.setPosition(-101.5,-213.5)
         cup.addChild(bei3)

         cup.cupwater = new cc.Sprite("#stopDao.png")
         cup.cupwater.setPosition(0,11)
         cup.addChild(cup.cupwater)

         cup.Atieding = new cc.Sprite(res.bigitem5)
         cup.Atieding.setPosition(-94,-3)
         cup.addChild(cup.Atieding)
         cup.Atieding.setVisible(false)

         var tiexiu = new cc.Sprite(res.tiexiu)
         tiexiu.setPosition(51.9,47.2)
         cup.Atieding.addChild(tiexiu)
         cup.tiexiu = tiexiu
         tiexiu.setOpacity(0)
         cup.palySX = function(time,opacity,color){
            this.tiexiu.runAction(cc.fadeTo(time,opacity))
            this.cupwater.runAction(cc.tintTo(time,color.aa,color.bb,color.cc))
         }

         var bei1 = new cc.Sprite(res.bei1)
         bei1.setPosition(-100.5,-135.5)
         cup.addChild(bei1)

         cup.index = self.curCup
         cup.palyAc = function(index,fun,count){
            var frameName = "daoS%02d.png"
            var end = 21
            var name = ""
            if(index==1){
              frameName = "daoW%02d.png"
              end = 20
              name = "油"
            }else if(index==2){
              frameName = "daoS%02d.png"
              end = 21
              name = "凉开水"
            }else if(index==3){
              if(count==1){
                frameName = "daoT%02d.png"
                end = 21
                name = "少量的自来水"
              }else if(count==2){
                frameName = "daoS%02d.png"
                end = 21
                name = "自来水"
              }
            }
            var inself = this
            this.waterName = name
            var spAction = createAnimation({
                                    frame: frameName,
                                    start: 1,
                                    end: end,
                                    time: 0.15,
                                    fun:function(){
                                      inself.cupwater.setSpriteFrame(sprintf(frameName,end+1))
                                      if(index!=1){
                                        inself.cupwater.setColor(cc.color(150,200,255))
                                      }
                                      var curStr = inself.txt.getString()
                                      inself.txt.setString(curStr+name)
                                      if(fun)
                                        fun()
                                      self.all++
                                      if(self.all>=4){
                                        self.speakeBykey("wenzi4")
                                        self.blockTwo()
                                      }
                                    }
                                }) 
            this.cupwater.runAction(spAction)
         }
         cup.initAc = function(index){
           var frame = "daoT00.png"
           if(index==1){
              frame = "daoW00.png"
           }
           this.cupwater.setSpriteFrame(frame)
         }
         cup.txt = new cc.LabelTTF(self.shuList[self.curCup],"",26)
         cup.txt.setPosition(-99,-240)
         cup.addChild(cup.txt)

         self.addChild(cup)
         self.cupList[self.curCup] = cup
         cup.setPosition(280+200*self.curCup,270)
         cup.checkPos = cc.p(cup.x-100,cup.y-50)
         self.curCup++
      }
      var end1 = function(){
         this.removeListen()
         this.removeFromParent()
         createAcup()
      }
      var end234 = function(){
        this.handState(false)
        if(this.noneLis){
          if(this.index!=3){
            this.daowater.palyAc(this.index)
            this.removeListen()
            this.removeFromParent()
          }else{
            var inself = this
            this.daowater.palyAc(this.index,function(){
                inself.setVisible(true)
                inself.noneLis = false
                inself.IsMove = false
                if(inself.mycount==2){
                   inself.removeListen()
                   inself.removeFromParent()
                }
                inself.mycount++
            },inself.mycount)
          }
        }else{
          this.IsMove = false
        }
      }
      var end5 = function(){
        if(this.noneLis){
          this.removeListen()
          this.TieDing.runAction(cc.moveBy(0.4,cc.p(0,-165)))
        }
      }
      self.endFunList = [
           end1,
           end234,
           end234,
           end234,
           end5
      ]
      
      var click234 = function(){
       this.handState(true)
      }
      self.clickFunList = [
        null,
        click234,
        click234,
        click234,
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
              this.clickFun = self.clickFunList[this.index]
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
            pos:cc.p(260, 520),
            nums:5,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.2),
            itempos:cc.p(1, -14),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                if(index==1){
                   item = self.createBottom(1)
                }else if(index==2){
                   item = self.createBottom(2)
                }else if(index==3){
                   item = self.createBottom(2)
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
            counts:[4,1,1,1,4],
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4,res.item5],
            gets:[res.bigitem1,null,null,null,res.bigitem5]
        })
        this.addChild(this.toolbtn,3)
    },
    blockTwo:function(){
      var self = this
      var Clock = createTimeClock({
        time:6,
        fontSize:50,
        dayCall:function(data){
          var day = data.day
          if(day==5){
            Clock.removeFromParent()
            for(var i=0; i<self.cupList.length; i++){
                var sp = self.cupList[i]
                sp.tiexiupng.setVisible(true)
            }
          }
        }
      })
      Clock.setPosition(getMiddle(-80,60))
      self.addChild(Clock)

      for(var i=0; i<self.cupList.length; i++){
        var sp = self.cupList[i]
        var curname = sp.waterName
        var tiexiupng = res.tiexiu1
        switch(curname){
          case "少量的自来水":
            sp.palySX(24,255,{aa:240,bb:100,cc:20})
            tiexiupng = res.tiexiu3
          break
          case "自来水":
            sp.palySX(24,200,{aa:240,bb:150,cc:80})
            tiexiupng = res.tiexiu2
          break
          default:
            tiexiupng = res.tiexiu1
        }
        var tiexiupng = new cc.Sprite(tiexiupng)
        sp.addChild(tiexiupng)
        tiexiupng.setPosition(-80,40)
        tiexiupng.setVisible(false)
        sp.tiexiupng = tiexiupng
      }

      var jitlunbtn = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
      jitlunbtn.setPosition(1030,420)
      self.addChild(jitlunbtn)
      jitlunbtn.addClickEventListener(function(){
         self.nodebs.say({
                    key: "jielun"
                })
      })
    },
    createBottom:function(status){
      var cup = new cc.Sprite(res.cup1)
      var hand1 = new cc.Sprite(res.shou1)
      hand1.setPosition(214,88)
      cup.addChild(hand1)

      var waterRes = res.water
      if(status==1){
         waterRes = res.water1
      }
      var water = new cc.Sprite(waterRes)
      water.setPosition(128,71)
      water.setScale(1.141)
      water.setOpacity(220)
      cup.addChild(water)

      var cuppre = new cc.Sprite(res.cup2)
      cuppre.setPosition(111,110)
      cup.addChild(cuppre)

      var hand2 = new cc.Sprite(res.shou2)
      hand2.setPosition(210,80)
      cup.addChild(hand2)
      cup.setScale(0.84)

      cup.handState = function(isVisi){
        hand1.setVisible(isVisi)
        hand2.setVisible(isVisi)
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
                self.speakeBykey("wenzi2")
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
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3,
            offset:cc.p(-10,0),
        })

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })

        addContent({
            people: this.nodebs,
            key: "jielun",
            img:res.jielun,
            id:"result",
            sound:res.jielunmp,
            offset: cc.p(30, 30),
            offbg: cc.p(20,50),
        })
    }  
})