//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {
        loadPlist("hxtplist")
        loadPlist("sysplist")
        loadPlist("xlsplist")  
    })
    var self = this
    this._super()
    this.expCtor()
    this.initUI()
    this.initPeople()
    this.initFunlist()

    return true
  },
  initFunlist:function(){
       var self = this
       this.clockList = [false,true,true,true,true,true,true,true]
       this.imglist = [null,res.wenzi5,res.wenzi5,res.wenzi5,
       res.wenzi5,res.wenzi6,res.wenzi6]
       self.tieCount = 1

       var sp1startfun = function(){
          this.setScale(1.3)
       }
       var sp2startfun = function(){
           this.setBlendFunc(cc.ONE,cc.ONE_MINUS_SRC_COLOR)
       }
       this.startFunlist = [
           sp1startfun,
           sp2startfun,
           null,
           null,
           null
       ]

       var sp1movefun = function(){
       }
       self.moveFunList = [
         sp1movefun,
         null,
         null,
         null,
         null
       ]

       var sp1endfun = function(){
           var myClip = self.myClip
           var nodepos = myClip.convertToNodeSpace(this.getPosition())
           var temprect = cc.rect(nodepos.x-this.width/2,
            nodepos.y-this.height/2,this.width,this.height)
           var temprect1 = cc.rect(myClip.pt.x-myClip.pt.width/2,
            myClip.pt.y-myClip.pt.height/2,myClip.pt.width,myClip.pt.height)

           if(cc.rectIntersectsRect(temprect1,temprect)){        
              this.removeListen()
              var jdpos = myClip.convertToWorldSpace(myClip.jd1.getPosition())
              var inself = this
              this.runAction(cc.sequence(
                  cc.moveTo(0.2,cc.p(jdpos.x,jdpos.y-5)),
                  cc.callFunc(function(){
                     inself.setVisible(false)
                     inself.y = -500
                     var ac = ccs.load(res.caijian).action
                     ac.gotoFrameAndPlay(0,270,false)
                     ac.setLastFrameCallFunc(function(){
                         self.myClip.runAction(cc.sequence(
                            cc.moveTo(0.3,cc.p(300,250)),
                            cc.callFunc(function(){
                                 self.nodebs.say({
                                   key: "wenzi2",
                                   force:true
                                 })

                                 self.clockList[1] = false
                            })
                          ))
                         ac.clearLastFrameCallFunc()
                     })
                     myClip.runAction(ac)
                  })
                ))
           }
       }
       var sp2endfun = function(){
           var myClip = self.myClip
           var nodepos = myClip.convertToNodeSpace(this.getPosition())  
           if(cc.rectContainsPoint(myClip.pt,nodepos)){
              this.removeListen()
              this.setVisible(false)
              this.y = -600
              var ac = ccs.load(res.caijian).action
              ac.gotoFrameAndPlay(270,380,false)
              ac.setLastFrameCallFunc(function(){
                  self.clockList[5] = false
              })
              myClip.runAction(ac)
           }
       }
       var createAc = function(data){
           var spTexture = data.spTexture
           var spFrame = data.spFrame
           var endframe = data.endframe
           var szSpFrame = data.szSpFrame
           var szendframe = data.szendframe
           var fromTo = data.fromTo || [0,300]   

           this.removeListen()
           this.setPosition(600,310)
           var inself = this
           var tsz = new cc.Sprite(res.ksz)
           tsz.setPosition(inself.x+253,inself.y+66.5)
           tsz.initpos = tsz.getPosition()
           self.addChild(tsz)
           createTouchEvent({
              item:tsz,
              begin:function(data){
                  var item = data.item
                  return true
              },
              move:function(data){
                 var item = data.item
                 var delta = data.delta
                 item.x += delta.x
                 item.y += delta.y
                 var changerect1 = cc.rect(item.x+20,item.y+10,item.width-20,item.height-10)
                 var changerect2 = cc.rect(inself.x+20,inself.y+10,inself.width-20,inself.height-10)
                 if(cc.rectIntersectsRect(changerect1,changerect2)){
                    item.removeListen()
                    item.setVisible(false)
                    item.setPosition(item.initpos)
                    var hxt = new cc.Sprite()
                    hxt.setPosition(inself.x+117,inself.y+14)
                    hxt.runAction(cc.sequence(
                          createAnimation({
                            frame: spFrame,
                            start:0,
                            time:0.2,
                            end: endframe
                          }),
                          cc.callFunc(function(){
                              hxt.removeFromParent()
                              item.setVisible(true)
                              item.setTexture(spTexture)
                              createTouchEvent({
                                item:item,
                                begin:function(){
                                  return true
                                },
                                move:function(data){
                                  var item = data.item
                                  var delta = data.delta
                                  item.x += delta.x
                                  item.y += delta.y
                                },
                                end:function(data){
                                  var item = data.item
                                  var nodepos = self.myClip.convertToNodeSpace(item.getPosition())
                                  if(cc.rectContainsPoint(self.myClip.pt,nodepos)){
                                        item.removeListen()
                                        item.runAction(cc.sequence(
                                          cc.moveTo(0.3,cc.p(self.myClip.x+60,self.myClip.y+220)),
                                          cc.callFunc(function(){
                                                item.setVisible(false)
                                                item.y = -600

                                                var spr = new cc.Sprite()
                                                spr.setPosition(self.myClip.x+60,self.myClip.y+220)
                                                self.addChild(spr)
                                                spr.runAction(cc.sequence(
                                                     createAnimation({
                                                        frame:szSpFrame,
                                                        start:0,
                                                        time:0.05,
                                                        end: szendframe
                                                      }),
                                                      cc.callFunc(function(){
                                                          self.cansetBu = true
                                                          spr.removeFromParent()
                                                      })  
                                                  ))

                                                var ac = ccs.load(res.caijian).action
                                                ac.gotoFrameAndPlay(fromTo[0],fromTo[1],false)
                                                self.myClip.runAction(ac)
                                          })
                                        ))
                                  }         
                                }
                              })
                          })
                      ))
                    self.addChild(hxt)
                    inself.setVisible(false)
                    inself.y =-500  
                 }
              }
           })
       }
       var sp3endfun = function(){
           this.createAc = createAc
           this.createAc({
              spTexture:res.tsz,
              spFrame:"hxtan%02d.png",
              endframe:14,
              szSpFrame:"dtsz%02d.png",
              szendframe:19,
              fromTo:[405,418]   
           })
       }
       var sp4endfun = function(){
           this.createAc = createAc
           this.createAc({
              spTexture:res.hsz,
              spFrame:"sysha%02d.png",
              endframe:14,
              szSpFrame:"dsys%02d.png",
              szendframe:19,
              fromTo:[449,464]   
           })
       }
       var sp5endfun = function(){
           this.createAc = createAc
           this.createAc({
              spTexture:res.lsz,
              spFrame:"xlshi%02d.png",
              endframe:14,
              szSpFrame:"dxlss%02d.png",
              szendframe:19,
              fromTo:[495,510]   
           })
       }

       self.cansetBu = true
       var sp6endfun = function(){
           var myClip = self.myClip
           var nodepos = myClip.convertToNodeSpace(this.getPosition())
           if(cc.rectContainsPoint(myClip.pt,nodepos)){
                if(self.cansetBu){
                      this.removeListen()
                      this.setVisible(false)
                      this.y = -600
                      var createAc = function (data) {
                         var beginF = data.beginF
                         var endF = data.endF
                         var endfun = data.endfun
                         var ac = ccs.load(res.caijian).action
                         ac.gotoFrameAndPlay(beginF,endF,false)
                         ac.setLastFrameCallFunc(function(){
                            self.tieCount++
                            if(endfun)
                               endfun()
                            self.cansetBu = false
                            ac.clearLastFrameCallFunc()
                         })
                         return ac
                      }  
                     switch(self.tieCount){
                       case 1:
                          myClip.runAction(createAc({
                             beginF:383,
                             endF:400,
                             endfun:function(){
                                self.clockList[2] = false
                             }
                          }))
                       break
                       case 2:
                          myClip.runAction(createAc({
                             beginF:427,
                             endF:445,
                             endfun:function(){
                                self.clockList[3] = false
                             }
                          }))
                       break
                       case 3:
                          myClip.runAction(createAc({
                             beginF:472,
                             endF:490,
                             endfun:function(){
                                self.clockList[4] = false
                             }
                          }))
                       break
                       case 4:
                          myClip.runAction(
                            createAc({
                             beginF:526,
                             endF:537,
                             endfun:function(){
                                self.myClip.runAction(cc.sequence(
                                  cc.moveTo(0.5,cc.p(700,300)),
                                  cc.callFunc(function(){
                                     var luiname = ["tiejia"]
                                     self.tie = loadNode(res.tiejia,luiname)
                                     self.tie.setPosition(400,300)
                                     self.addChild(self.tie)
                                     createTouchEvent({
                                        item:self.myClip.pt,
                                        begin:function(){
                                          return true
                                        },
                                        move:function(data){
                                           var item = data.item
                                           var delta = data.delta
                                           self.myClip.x += delta.x
                                           self.myClip.y += delta.y
                                           var curpos = self.tie.convertToNodeSpace(self.myClip.getPosition())
                                           if(cc.rectContainsPoint(self.tie.tiejia,curpos)){
                                               item.removeListen()
                                               self.myClip.runAction(cc.sequence(
                                                  cc.moveTo(0.4,cc.p(self.tie.x,self.tie.y+50)),
                                                  cc.callFunc(function(){
                                                    self.myClip.removeFromParent()
                                                    self.myClip = null
                                                    var tieac = ccs.load(res.tiejia).action
                                                    tieac.gotoFrameAndPlay(0,14,false)
                                                    tieac.setLastFrameCallFunc(function(){
                                                       self.clockList[6] = false
                                                       self.clockList[7] = false
                                                    })
                                                    self.tie.runAction(tieac)
                                                  })
                                                ))
                                           }
                                        }
                                     })
                                     self.nodebs.say({
                                         key: "wenzi3",
                                         force:true
                                     })
                                  })
                                ))
                             }
                            })
                          )
                       break
                      }
                }else{
                    dialogControl.AddDialog("Tips", {
                      res: self.imglist[1],
                      face: 2,
                      father: self
                    })
                }
           } 
       }

       self.okshit = false
       var sp7endfun = function(){
          if(self.okshit){
             var curpos = self.tie.convertToNodeSpace(this.getPosition())
             if(cc.rectContainsPoint(self.tie.tiejia,curpos)){
                this.removeListen()
                var inself = this
                this.runAction(cc.sequence(
                   cc.moveTo(0.2,cc.p(self.tie.x+130,self.tie.y+230)),
                   cc.callFunc(function(){
                      inself.setVisible(false)
                      inself.y = -600
                      var tieac = ccs.load(res.tiejia).action
                      tieac.gotoFrameAndPlay(15,284,false)
                      tieac.setLastFrameCallFunc(function(){
                          self.result.setVisible(true)
                      })
                      self.tie.runAction(tieac)
                   })
                ))
             }
          }
       }
       var sp8endfun = function(){
           this.removeListen()
           this.setVisible(false)
           this.y = -500

           self.nodebs.say({
                    key: "wenzi4",
                    force:true
                })
           var tieac = ccs.load(res.tiejia).action
           tieac.gotoFrameAndPlay(13,15,false)
           self.tie.runAction(tieac)
           self.okshit = true 
       }
        this.endFunList = [
           sp1endfun,
           sp2endfun,
           sp3endfun,
           sp4endfun,
           sp5endfun,
           sp6endfun,
           sp7endfun,
           sp8endfun
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
            if(curimg==0){
               self.nodebs.say({
                    key: "wenzi1",
                    force:true
                })
               return false
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
  initUI:function(){
        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        
        var uiname = ["pt","jd1"]
        this.myClip = loadNode(res.caijian,uiname)
        this.myClip.setPosition(getMiddle(50,-50))
        this.myClip.setScale(0.87)
        this.addChild(this.myClip)
       

        var btnlist =[
           {
             name:"tips",
             pos:cc.p(1000,400),
             normal:res.btn_tips_normal,
             select:res.btn_tips_select,
             fun:function(){
                if(!self.tip2){
                        var tip1 = createResult({
                            img:res.tip2,
                            offbg:cc.p(10,30),
                            offset:cc.p(20,20),
                            btnfun:function(){
                                addShowType({
                                    item: self.tip2,
                                    show: "zoom",
                                    time: 0.3,
                                    fun: function() {
                                        self.tip2.setPosition(getMiddle())
                                        removeMoving(self.tip2)
                                    }
                                })
                            }
                        })
                        tip1.setScale(0)
                        tip1.setPosition(getMiddle())
                        tip1.setLocalZOrder(LOCAL_ORDER++)
                        tip1.changeSelfLocalZero = function(){
                            this.setLocalZOrder(LOCAL_ORDER++)
                        }
                        self.tip2 = tip1
                        self.addChild(self.tip2)
                    }
                    if(self.tip2.getScale()==1){
                        addShowType({
                            item:self.tip2,
                            show:"zoom",
                            time:0.3,
                            fun:function(){
                               self.tip2.setPosition(getMiddle())
                               removeMoving(self.tip2)
                            }
                        })          
                    }else{
                        self.tip2.stopAllActions()
                        addShowType({
                            item:self.tip2,
                            show:"scale",
                            time:0.3,
                            fun:function(){
                                self.tip2.setLocalZOrder(LOCAL_ORDER++)
                               addMoving(self.tip2)
                            }
                        })                       
                    }
             },
           },
           {
             name:"exptip",
             pos:cc.p(1000,480),
             normal:res.btn_exptip_normal,
             select:res.btn_exptip_select,
             fun:function(){
                if(!self.tip1){
                        var tip1 = createResult({
                            img:res.tip1,
                            offbg:cc.p(10,30),
                            offset:cc.p(20,20),
                            btnfun:function(){
                                addShowType({
                                    item: self.tip1,
                                    show: "zoom",
                                    time: 0.3,
                                    fun: function() {
                                        self.tip1.setPosition(getMiddle())
                                        removeMoving(self.tip1)
                                    }
                                })
                            }
                        })
                        tip1.setScale(0)
                        tip1.setPosition(getMiddle())
                        tip1.setLocalZOrder(LOCAL_ORDER++)
                        tip1.changeSelfLocalZero = function(){
                            this.setLocalZOrder(LOCAL_ORDER++)
                        }
                        self.tip1 = tip1
                        self.addChild(self.tip1)
                    }
                    if(self.tip1.getScale()==1){
                        addShowType({
                            item:self.tip1,
                            show:"zoom",
                            time:0.3,
                            fun:function(){
                               self.tip1.setPosition(getMiddle())
                               removeMoving(self.tip1)
                            }
                        })          
                    }else{
                        self.tip1.stopAllActions()
                        addShowType({
                            item:self.tip1,
                            show:"scale",
                            time:0.3,
                            fun:function(){
                                self.tip1.setLocalZOrder(LOCAL_ORDER++)
                               addMoving(self.tip1)
                            }
                        })                       
                    }
             },
           }, 
           {
             name:"result",
             pos:cc.p(1000,320),
             normal:res.btn_result_normal,
             select:res.btn_result_select,
             fun:function(){    
                 self.nodebs.say({
                    key: "jielun1",
                })
             },
           },    
        ]
          
        for(var i=0;i<btnlist.length;i++){
          var tempbtn = new ccui.Button(btnlist[i].normal,btnlist[i].select)
          tempbtn.setPosition(btnlist[i].pos)
          self.addChild(tempbtn)
          self[btnlist[i].name] = tempbtn
          tempbtn.addClickEventListener(btnlist[i].fun)
        }

        self.result.setVisible(false)
        
        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(1, -6),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            itemScale:1,
            ifcircle: true,
            counts:[1,1,1,1,1,4,1,1],
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
            files:[res.jd,res.psm,res.hxt,res.sys,
            res.xls,res.sb,res.ns,res.kblb],
            gets:[res.djd,res.dpsm,res.dhxt,res.dsys,
            res.dxls,res.dsb,res.dns,res.dkblb]
        })
        this.addChild(this.toolbtn,3)
  },
  myEnter: function() {
    this._super()
    var self = this
    if (this.nodebs) {
        var self = this
        self.toolbtn.show()
        self.nodebs.show(function(){
            self.nodebs.say({
                    key: "wenzi1",
                    force:true
                })
        })     
    }
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id:"student",
      pos: cc.p(1010, 120)
    })
    this.addChild(this.nodebs, 900);

        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.zi1mp,
            img: res.wenzi1,
        })
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zi2mp,
            img: res.wenzi2,
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.zi3mp,
            img: res.wenzi3,
        })

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            sound: res.zi4mp,
            img: res.wenzi4,
        })

        addContent({
            people: this.nodebs,
            key: "jielun1",
            img:res.jielun1,
            id:"result",
            sound: res.jielunmp1,
            offset: cc.p(50, 40),
            offbg: cc.p(30,50),
        })
  }
})