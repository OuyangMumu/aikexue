//@author mu @16/5/11
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp3",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("daojiao")
           loadPlist("ruye")   
        })
        this._super()
        this.expCtor({
          setZ:800,
        })
        this.initUI()
        this.initTool()
        this.initFunlist()
        this.initPeople() 
        return true
    },
    initFunlist:function(){
        var self = this
        this.clockList = [false,false,false,true,false,true]
        this.imglist = [res.tip1,res.tip1,res.tip1,res.tip1,res.tip1]

        var starfun1 = function(){
          this.nopos = true
          this.setVisible(false)
          this.setPosition(-300,-100)
          for (var i = 0; i < self.cuplist.length; i++) {
            self.cuplist[i].setVisible(true)
          }
          self.biaohao.setVisible(true)
          self.tishi1.addCount()
        }
        var starfun2 = function(){
           this.nopos = true
           this.setVisible(false)
           this.setPosition(-300,-100)
           self.jiaoban.setVisible(true)
           self.tishi1.addCount()
        }
        var starfun3 = function(){
           this.nopos = true
           this.setVisible(false)
           this.setPosition(-300,-100)
           self.cupdf.setVisible(true)
           self.tishi1.addCount()
        }
        var starfun4 = function(){
           this.nopos = true
           this.setVisible(false)
           this.setPosition(-300,-100)
           self.tuoye.setVisible(true)
           this.havewater = false
        }
        var starfun5 = function(){
            this.setAnchorPoint(0.5,1)
            var ruye = new cc.Sprite("#diruye00.png")
            ruye.setPosition(13,-29)
            this.addChild(ruye)
            this.havepush = false
            this.ruye = ruye
            this.state = "out"
            this.pushTuoye = function(opacity){
              this.havepush = true
              var opacity = opacity || 255
              this.ruye.setOpacity(opacity)
              var spAction = createAnimation({
                                    frame: "diruye%02d.png",
                                    start: 0,
                                    end: 5,
                                    time: 0.04
                                })
              this.ruye.runAction(spAction)                   
            }

            this.pullTuoye = function(fun){
              if(!fun)
                  fun = null
              var spAction = createAnimation({
                                    frame: "diruye%02d.png",
                                    start: 5,
                                    end: 21,
                                    time: 0.04,
                                    fun:fun,
                                })
              this.ruye.runAction(spAction)                   
            }
            this.ifcanMove = true
            if(this.disListen)
            this.disListen(false)
        }
        self.noblue = true
        self.showTip = false
        self.checkTwo = false
        self.checkThree = false
        var starfun6 = function(){
            this.nopos = true
            this.setVisible(false)
            this.setPosition(-300,-100)
            self.diguan1 = createIWater({
                       father:self,
                       sp:self.cuplist,
                       nodescale:1,
                       pullTime:0.06,
                       showDraw:false,
                       pos:cc.p(780,210),
                       userFun:function(item){
                          if(self.showTip){
                               self.diguan1.setAllnosee()
                               self.diguan1.init()
                               dialogControl.AddDialog("Tips", {
                                  res: res.tip3,
                                  face: 2,
                                  father: self
                                })
                          }
                          if(self.noblue){
                              self.diguan1.pullWater(item)
                              item.haveWater = true
                              self.diguan1.setAllnosee()
                              self.noblue = false
                              self.showTip = true
                              item.playBlue()
                          }
                          if(self.checkTwo){
                              if(self.checkThree){
                                  self.diguan1.pullWaterStart(item)
                                  item.playAddMao(false,function(){
                                          if(self.diguan1.pullStart){
                                             self.diguan1.pullStart.removeFromParent()
                                          }
                                          self.diguan1.pullWater(item)
                                          item.playBlue(function(){
                                                self.tishi3.setVisible(false)
                                                var lab = addTimerLabel({
                                                            str:"       滴加了唾液的淀粉溶液遇碘不变\n色，淀粉遇碘变蓝与振荡无关",
                                                            strPos:getMiddle(-250,130),
                                                            strSize:27,
                                                            startFun:function(){
                                                                self.nodebs.say({
                                                                  key: "jielun3",
                                                                  force: true
                                                                })
                                                            }  
                                                          })
                                                self.addChild(lab)
                                          })         
                                      })
                                  item.haveWater = true
                                  self.diguan1.setAllnosee()
                              }
                              if(item.havetuoye){
                                  self.diguan1.pullWater(item)
                                  item.haveWater = true
                                  self.diguan1.setAllnosee()
                                  self.checkThree = true
                              }
                          }
                          
                       }
                   })
        }
        this.startFunlist = [
           starfun1,
           starfun2,
           starfun3,
           starfun4,
           starfun5,
           starfun6
        ]
        var move5 = function(){
          var delta = this.data.delta
          if(this.ifcanMove){
            var tempx = this.x + delta.x
            var tempy = this.y + delta.y
            if(self.cupdf.isVisible()){
                var nodepos = self.cupdf.convertToNodeSpace(this.getPosition())
                var world = self.cupdf.convertToWorldSpace(cc.p(36,180))
                if (this.state == "in" && nodepos.y <= 260) {
                      tempx = world.x
                      if (nodepos.y < 180) {
                          tempy = world.y
                          if(!this.havepush)
                             this.pushTuoye()
                      }
                }
                if (nodepos.y > 260) {
                    this.state = "out"
                }

                if (nodepos.y >= 250 && nodepos.y <= 260 && nodepos.x >= 0 && nodepos.x <= 60) {
                    this.state = "in"
                }
                this.x = tempx
                this.y = tempy
            }
            if(self.tuoye.isVisible()){
                var tuopos = self.tuoye.convertToNodeSpace(this.getPosition())
                var world = self.tuoye.convertToWorldSpace(cc.p(35,190))
                cc.log(tuopos)
                if (this.state == "in" && tuopos.y <= 255) {
                      tempx = world.x
                      if (tuopos.y < 190) {
                          tempy = world.y
                          if(!this.havepush)
                             this.pushTuoye(180)
                      }
                }
                if (tuopos.y > 255) {
                    this.state = "out"
                }
                if (tuopos.y >= 255 && tuopos.y <= 265 && tuopos.x >= 0 && tuopos.x <= 70) {
                    this.state = "in"
                }
                if(this.x<=500 && this.havepush && self.noblue){
                    this.ifcanMove = false
                    tempx = 648
                    dialogControl.AddDialog("Tips", {
                                  res: res.tip2,
                                  face: 2,
                                  father: self
                                })
                }
                this.x = tempx
                this.y = tempy
            }
          }      
        }
        self.moveFunList = [
         null,
         null,
         null,
         null,
         move5,
         null,
        ]
        var end5 = function(){
          if(self.jiaoban.isVisible() && this.havepush){
              var temprect = cc.rect(570,350,90,110)
              if(cc.rectContainsPoint(temprect,this.getPosition())){
                  this.disListen(true)
                  self.cupdf.setVisible(false)
                  var inself = this
                  this.setPosition(self.jiaoban.x,self.jiaoban.y+140)
                  this.pullTuoye(function(){
                      inself.forceBack()
                      self.jiaoban.jiaoAc()
                  })
              }
          }
          if(self.tuoye.isVisible() && self.diguan1){
             var temppos = cc.p(this.x,this.y-40) 
             for(var k in self.cuplist){
               if(cc.rectContainsPoint(self.cuplist[k].restRect,temppos) && !self.cuplist[k].haveWater){
                  this.disListen(true)
                  self.tuoye.setVisible(false)
                  var inself = this
                  this.setPosition(self.cuplist[k].x,self.cuplist[k].y+270)
                  var cur = k
                  this.pullTuoye(function(){
                      inself.setVisible(false)
                      inself.y = -800
                      self.showTip = false
                      self.checkTwo = true
                      self.cuplist[cur].playAddMao()
                      self.cuplist[cur].havetuoye = true
                  })
               }
             }
          }
          this.ifcanMove = true
        }
        
        this.endFunList = [
          null,
          null,
          null,
          null,
          end5,
          null,
        ]

      this.checkFun = function(){
          if (this.clock) {
            var curimg = 0
            for (var k = 0; k < self.clockList.length; k++) {           
                if (!self.clockList[k]){
                  curimg = k
                }else{
                  break
                }         
            }
            dialogControl.AddDialog("Tips", {
              res: self.imglist[curimg],
              face: 2,
              father: self
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
    createCup:function(){
      loadPlist("cup")
      loadPlist("changeBlue")
      var maincup = new cc.Sprite("#cup00.png")
      maincup.setOpacity(0)
      maincup.setCascadeOpacityEnabled(false)
      maincup.setScale(0.8)

      var cupmao = new cc.Sprite("#cupmao00.png")
      cupmao.setPosition(73,80)
      maincup.addChild(cupmao)
      maincup.cupmao = cupmao

      var cup = new cc.Sprite("#cup00.png")
      cup.setPosition(maincup.width/2,maincup.height/2)
      maincup.addChild(cup)
      maincup.cup = cup

      var yaocup = new cc.Sprite("#yaocup00.png")
      yaocup.setPosition(maincup.width/2,maincup.height/2+5)
      maincup.addChild(yaocup)
      maincup.yaocup = yaocup

      var bluesp = new cc.Sprite("#bianblue00.png")
      bluesp.setPosition(maincup.width/2-6.7,44.5)
      bluesp.setScale(1.6,1.5)
      maincup.addChild(bluesp)
      maincup.bluesp = bluesp
      bluesp.setVisible(false)

      maincup.playAddWater = function(juge){
         var juge = juge != null ? juge:false
         var inself = this
         var spAction = createAnimation({
                          frame: "cup%02d.png",
                          start: 0,
                          end: 10,
                          rever:juge,
                          time: 0.06,
                          fun:function(){
                             inself.cup.setSpriteFrame("cup00.png")
                             inself.bluesp.setVisible(true)
                          }
                        }) 
         this.cup.runAction(spAction)
      }
      maincup.playAddMao = function(juge,afun){
         var juge = juge != null ? juge:false
         cc.log(juge)
         var inself = this
         var afun = afun != null ? afun:null
         var spAction = createAnimation({
                          frame: "cupmao%02d.png",
                          start: 0,
                          end: 15,
                          time: 0.1,
                          rever:juge,
                          fun:function(){
                            if(!juge)
                               inself.playYao(false,afun)
                             if(juge){
                               if(afun)
                                 afun()
                             }
                          }
                        }) 
         this.cupmao.runAction(spAction)
      }
      maincup.playYao = function(juge,afun){
          var juge = juge != null ? juge:false
          var afun = afun != null ? afun:null
          cc.log(juge)
          var inself = this
          this.cup.setVisible(false)
          this.cupmao.setVisible(false)
          this.bluesp.setVisible(false)
          var spAction = createAnimation({
                          frame: "yaocup%02d.png",
                          start: 0,
                          end: 22,
                          rever:juge,
                          time:0.04,
                          fun:function(){
                              inself.cup.setVisible(true)
                              inself.cupmao.setVisible(true)
                              inself.yaocup.setVisible(false)
                              inself.bluesp.setVisible(true)
                              inself.playAddMao(true,afun)
                          }
                        })
          this.yaocup.runAction(spAction)
      }
      maincup.playDao = function(fun){
          var dao = new cc.Sprite()
          dao.setScale(1.3)
          dao.setPosition(130,140)
          this.addChild(dao)
          var inself = this
          var spAction = cc.sequence(
                        createAnimation({
                          frame: "dao%02d.png",
                          start: 0,
                          end: 8,
                          time:0.06
                        }),
                        cc.callFunc(function(){
                           inself.playAddWater(false)
                        }),
                        createAnimation({
                          frame: "dao%02d.png",
                          start: 8,
                          end: 19,
                          time:0.06,
                          fun:function(){
                            dao.removeFromParent()
                            if(fun)
                               fun(inself)
                          }
                        })
          ) 
          dao.runAction(spAction)   
      }
      maincup.playBlue = function(fun){
         if(this.bluesp.isVisible()){
             var spAction = createAnimation({
                          frame: "bianblue%02d.png",
                          start: 0,
                          end: 29,
                          time:0.04,
                          fun:function(){
                             if(fun)
                               fun()
                          }
                        })
             this.bluesp.runAction(spAction)
         }
      }

      return maincup
    },
    initUI:function(){
        var self = this
        var desk = new cc.Sprite(res.desk)
        desk.setPosition(getMiddle(-50,-300))
        this.addChild(desk)
        var draw = new cc.DrawNode()
        self.addChild(draw)
        
        var cup1 = this.createCup()
        cup1.setPosition(getMiddle(-350,-120))
        this.addChild(cup1)
        cup1.outRect = cc.rect(220,210,30,100)
        cup1.water = false
        cup1.havetuoye = false
        cup1.setVisible(false)
        
        var cup2 = this.createCup()
        cup2.setPosition(getMiddle(-230,-120))
        this.addChild(cup2)
        cup2.outRect = cc.rect(340,210,30,100)
        cup2.water = false
        cup2.havetuoye = false
        cup2.setVisible(false)
    
        var cup3 = this.createCup()
        cup3.setPosition(getMiddle(-110,-120))
        this.addChild(cup3)
        cup3.outRect = cc.rect(460,210,30,100)
        cup3.water = false
        cup3.havetuoye = false
        cup3.setVisible(false)
        
        this.cuplist = [cup1,cup2,cup3]

        this.cupdf = new cc.Sprite(res.cupdf)
        this.cupdf.setPosition(getMiddle(200,-110))
        this.addChild(this.cupdf)
        this.cupdf.setVisible(false)
      
        this.jiaoban = new cc.Sprite("#jiao00.png")
        this.jiaoban.setPosition(getMiddle(50,30))
        this.addChild(this.jiaoban)
        this.jiaoban.daoCount = 0
        this.jiaoban.jiaoAc = function(){
            var spAction = createAnimation({
                                    frame: "jiao%02d.png",
                                    start: 0,
                                    end: 58,
                                    time: 0.05,
                                    fun:function(){
                                       createTouchEvent({
                                          rect:cc.rect(0,0,self.jiaoban.width,self.jiaoban.height/3),
                                          item:self.jiaoban,
                                          begin:function(){
                                             return true
                                          },
                                          move:function(data){
                                              var item = data.item
                                              var delta = data.delta
                                              if(!item.ifTouch){
                                                item.x += delta.x
                                                item.y += delta.y
                                                var autopos = cc.p(item.x-item.width/2,item.y-item.height/4)
                                                for(var k in self.cuplist){
                                                     if(cc.rectContainsPoint(self.cuplist[k].outRect,autopos) && !self.cuplist[k].water){
                                                            item.ifTouch = true
                                                            item.setVisible(false)
                                                            item.setPosition(self.cuplist[k].x+90,self.cuplist[k].y+140)
                                                            self.cuplist[k].playDao(function(dao){
                                                               item.setVisible(true)
                                                               item.ifTouch = false
                                                               item.daoCount++
                                                               dao.water = true
                                                               if(item.daoCount==3){
                                                                  self.tishi3 = new cc.Sprite(res.tishi3)
                                                                  self.tishi3.setPosition(getMiddle(0,100))
                                                                  self.addChild(self.tishi3)
                                                                  self.tishi2.setVisible(false)
                                                                  self.exptipbtn.setVisible(true)

                                                                  self.clockList[3] = false
                                                                  self.clockList[5] = false
                                                                  item.setVisible(false)
                                                                  item.y = -300
                                                               }
                                                            })
                                                     }
                                                }
                                              }
                                              
                                          },
                                          end:function(data){
                                            var item = data.item
                                            //item.ifTouch = false
                                          }
                                       })
                                    }
                                })
            this.runAction(spAction)
        }
        this.jiaoban.setVisible(false)
    
        this.tuoye = new cc.Sprite(res.tuoye)
        this.tuoye.setPosition(getMiddle(80,-110))
        this.addChild(this.tuoye)
        this.tuoye.setVisible(false)

        this.biaohao = new cc.Sprite(res.biaohao)
        this.biaohao.setPosition(338,137)
        this.addChild(this.biaohao)
        this.biaohao.setVisible(false)

        this.tishi1 = new cc.Sprite(res.tishi1)
        this.tishi1.setPosition(getMiddle(0,100))
        this.addChild(this.tishi1)
        this.tishi1.count = 0
        this.tishi1.addCount = function(){
           this.count++
           if(this.count>=3){
              this.setVisible(false)
              self.tishi2 = new cc.Sprite(res.tishi2)
              self.tishi2.setPosition(getMiddle(0,100))
              self.addChild(self.tishi2)
           }
        }

        this.exptipbtn = new ccui.Button(res.btn_exptip_normal,res.btn_exptip_select)
        this.exptipbtn.setPosition(1000,320)
        this.addChild(this.exptipbtn)
        this.exptipbtn.setVisible(false)
        this.exptipbtn.addClickEventListener(function(){
              self.nodebs.say({
                    key: "tishi3",
              })
        })
    },
    initTool:function(){
        var self = this
        var toolnode = new cc.Node()
        toolnode.x = 0
        toolnode.y =0
        this.addChild(toolnode,5)

        this.toolbtn = createTool({
            pos:cc.p(350, 550),
            nums:6,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.2),
            itempos:cc.p(3, -15),
            circlepos:cc.p(0, 13),
            showTime:0.3,
            moveTime:0.2,
            scale:0.7,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.clock  = self.clockList[index]
                item.excstartFun = self.startFunlist[index]
                item.checkFun = self.checkFun
                return item.checkFun()
            },
            movefun:function(data){
                var item = data.sp
                var delta = data.delta
                var index = data.index
                item.data = data
                if(index!=4){
                  var temppos = cc.p(item.x + delta.x,item.y + delta.y)
                  item.setPosition(temppos)
                }
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
            backfun:function(){
              return false
            },
            father:toolnode,
            files:[res.exp1,res.exp2,res.exp3,res.exp4,res.exp5,res.exp6],
            gets:[res.exp1,res.exp2,res.exp3,res.exp4,res.dfzj_diguan,res.exp6]
        })
        this.addChild(this.toolbtn,3)
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
                // self.nodebs.say({
                //     key: "wenzi4",
                //     force: true
                // })
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
            key: "jielun3",
            sound: res.jielunmp3
        })

        addContent({
            people: this.nodebs,
            key: "tishi3",
            img:res.tishi4,
            id:"result",
            offset: cc.p(30, 20),
            offbg: cc.p(17,20),
        })
    }  
})