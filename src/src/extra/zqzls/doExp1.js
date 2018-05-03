//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {
         loadPlist("shuiup")
    });
    var self = this
    this._super()
    this.expCtor()
    this.initFunlist()
    this.initUI()
    this.initPeople()

    return true
  },
  initFunlist:function(){
       var self = this
       this.clockList = [false,true,true,true,true]
       this.imglist = [res.tip1,res.tip2,res.tip3,res.tip5,res.tip4]

       var sp1startfun = function(){
          self.donode.fs.setVisible(false)
       }
       var sp3startfun = function(){
          this.setScale(0.7)
       }
       this.startFunlist = [
           sp1startfun,
           null,
           sp3startfun,
           null,
           null
       ]

       var sp3movefun = function(){
          self.playAction = true
          var result = judgeInside({
             item:self.donode.ping,
             pos:cc.p(this.getPositionX()-this.width/3,this.getPositionY()+this.height/3)
          })
          if(result){
             this.removeListen()
             this.setVisible(false)
             this.y = -300
             self.donode.feishi.playDaoShui()
          }
       }
       self.moveFunList = [
         null,
         null,
         sp3movefun,
         null,
         null
       ]

       var sp1endfun = function(){
          this.setVisible(false)
          this.y = -100
          self.donode.bing.setVisible(true)
          self.donode.bing2.setVisible(true)
          self.clockList[this.index+1] = false
       }
       var sp2endfun = function(){
          if (this.x < 780 && this.x > 690) {
            this.setVisible(false)
            this.y = -300
            self.donode.gsnode.setVisible(true)
            self.nodebs.say({
              key: "wenzi3",
              force: true
            })

            self.clockList[this.index+1] = false
          }
       }
       var sp4endfun = function(){
          this.setVisible(false)
          this.y = -100
          self.donode.dg.setVisible(true)
          self.nodebs.say({
              key: "wenzi4",
              force: true
            })
          self.clockList[this.index+1] = false
       }
       var sp5endfun = function(){
          this.removeListen()
          this.setVisible(false)
          this.setPositionY(-300)
          self.jjd.setPosition(0,0)
          self.jjd.setVisible(true)
       }
       
        this.endFunList = [
           sp1endfun,
           sp2endfun,
           null,
           sp4endfun,
           sp5endfun
        ]

      this.checkFun = function(){

                  if(self.playAction){
                     dialogControl.AddDialog("Tips", {
                       res: self.imglist[4],
                       face: 2,
                       father: self
                    })

                     return false
                  }
                if (this.clock) {
                  var res_img = null
                  var curimg = 0
                  for (var k = 0; k < self.clockList.length; k++) {
                    if (!self.clockList[k])
                      curimg = k
                  }
                  if(self.playAction){
                     curimg = 4
                  }

                  dialogControl.AddDialog("Tips", {
                    res: self.imglist[curimg],
                    face: 2,
                    father: self
                  })
                  return false
                } else {
                 if(this.excstartFun)
                    this.excstartFun()
                    this.excEndFun = self.endFunList[this.index]
                    this.excMoveFun = self.moveFunList[this.index]
                  return this
                }
      }

       
  },
  initUI: function() {
        var self = this
        var uiname = [
          "bing","bing2","gsnode","ping","feishi","fs",
          "diwater","dg","jjd","shuiwei","jielunbtn",
          "daonode","muk","allbei"
        ]
        self.donode = loadNode(res.do1, uiname)
        self.addChild(self.donode)
        self.playAction = false
        self.donode.jielunbtn.setVisible(false)

        self.jjd = createJJD({
                    pos:cc.p(0,-300),
                    scale:0.9,
                    father:self.donode.jjd
                })
        self.jjd.setVisible(false)
        self.jjd.setCallBack({
            up:function(){
               this.setCanClick(false)
            },
            fire:function(){
                this.scheduleOnce(function(){
                     self.donode.feishi.feiteng()
                },3)
            },
            down:function(){
                 self.donode.feishi.stopFeiteng()
                 this.setCanClick(false)
                 self.jjd.stopAllActions()
                 this.scheduleOnce(function(){

                   self.donode.allbei.runAction(cc.moveBy(1,cc.p(0,-90)))
                   self.donode.muk.runAction(cc.spawn(
                     cc.moveBy(1,cc.p(200,0)),
                     cc.fadeOut(1)
                    ))
                 },2)
            }
    
        })

        var toolnode = new cc.Node();
        toolnode.x = 0 ; toolnode.y =0;
        this.addChild(toolnode,5);

        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, -20),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            firstClick:function(data){

              var item = data.sp
              var index = data.index
              if(index==4){
                 var item = createJJD()
                 item.index = 4
                 item.clock = self.clockList[index]
                 item.checkFun = self.checkFun
                 item.checkFun()

                 return item.checkFun()
              }
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
            backfun:function(data){
                var index = data.index
                if(index==2){
                   self.playAction = false
                } 
                return true   
            },
            father:toolnode,
            files:[res.zbsb,res.sg,res.zls,res.xpshdg,res.jjd],
            gets:[res.mzbsb,res.msg,res.mzls,res.dg,null]
        })
        this.addChild(this.toolbtn,3);


        self.donode.feishi.playDaoShui = function(){
             var daoshui = ccs.load(res.daoshui).node
             var daoshuiac = ccs.load(res.daoshui).action
             daoshuiac.gotoFrameAndPlay(0,78,false)
             daoshuiac.setLastFrameCallFunc(function(){
                  daoshui.removeFromParent()
                  daoshuiac.clearLastFrameCallFunc()
             })
             //daoshui.setPosition(627,427)
             self.donode.daonode.addChild(daoshui)
             daoshui.runAction(daoshuiac)
             var timedata = 0
             daoshui.scheduleOnce(function(){
                  var shuiup = new cc.Sprite("#ss00.png")
                  shuiup.setPosition(4.25,19.2)
                  self.donode.diwater.addChild(shuiup)
                  shuiup.runAction(cc.sequence(
                    cc.delayTime(0.2),
                    createAnimation({
                         frame: "ss%02d.png",
                         end: 16
                         }),
                    cc.callFunc(function(){
                        self.clockList[3] = false
                        self.playAction = false
                    })
                  ))
             },1)
        }
        self.donode.feishi.feiteng = function(){
                var actionnode = ccs.load(res.maopao).node
                var action1 = ccs.load(res.maopao).action
                action1.gotoFrameAndPlay(0, 16, true);
                actionnode.setPosition(55,25)
                this.addChild(actionnode)
                actionnode.setScale(0.4)
                actionnode.getChildByName("maopao1").setVisible(false)
                actionnode.runAction(action1)
                var yannode1 = createWaterAir({
                    total: 40,
                    width: 30,
                    height: 10,
                    res: res.img_smoke,
                })
                yannode1.setCascadeOpacityEnabled(true)
                yannode1.setOpacity(60)
                yannode1.setScale(0.22, 0.8)
                yannode1.setPosition(52, 25)
                this.addChild(yannode1)
                yannode1.scheduleOnce(function(){
                     yannode1.runAction(cc.sequence(
                          cc.scaleTo(3,0.3,0.8),
                          cc.callFunc(function(){
                            yannode1.setOpacity(80)
                          })
                      ))
                     
                },3)

                 actionnode.scheduleOnce(function(){
                     actionnode.runAction(cc.sequence(
                          cc.scaleTo(4,0.8),
                          cc.callFunc(function(){
                             self.donode.shuiwei.runAction(cc.sequence(
                                 cc.scaleTo(15,1),
                                 cc.delayTime(1),
                                 cc.callFunc(function(){
                                        self.jjd.setCanClick(true)
                                        self.jjd.runAction(cc.sequence(
                                          cc.delayTime(15),
                                          cc.callFunc(function(){
                                            self.jjd.exeDown()
                                          })
                                        ))
                                      self.donode.jielunbtn.setVisible(true)
                                      self.nodebs.say({
                                        key: "wenzi5",
                                        force: true
                                      })
                                 })
                              ))
                          })
                      ))

                     var shuiup = self.donode.diwater.getChildren()[0]
                     shuiup.runAction(cc.sequence(
                          cc.scaleTo(6,1,0.9),
                          cc.callFunc(function(){
                             shuiup.setOpacity(230)
                          })
                      ))
                },3)

                this.child1 = actionnode
                this.child2 = yannode1
        }

        self.donode.feishi.stopFeiteng = function(){
            this.child2.runAction(cc.fadeOut(3))
            this.child1.runAction(cc.scaleTo(5,0))
        }

        self.donode.jielunbtn.addClickEventListener(function(){
              self.nodebs.say({
                key: "jielun2"
              })
        })
      
  },
  myEnter: function() {
    this._super()
    var self = this
    self.toolbtn.show()
    self.nodebs.show(function() {
        self.nodebs.say({
          key: "wenzi2",
          force: true
        })
    })
  },
  initPeople: function() {
    this.nodebs = addPeople({
      id:"student",
      pos: cc.p(1010, 120)
    })
    this.addChild(this.nodebs, 900);

    addContent({
          people: this.nodebs,
          key: "jielun2",
          img:res.jielun2,
          id:"result",
          sound: res.jielunmp2,
          offset: cc.p(30, 30),
          offbg: cc.p(50,50),
    })

    addContent({
      people: this.nodebs,
      key: "wenzi2",
      sound: res.zimp2,
      img: res.wenzi2
    })

    addContent({
      people: this.nodebs,
      key: "wenzi3",
      sound: res.zimp3,
      img: res.wenzi3,
    })

    addContent({
      people: this.nodebs,
      key: "wenzi4",
      sound: res.zimp4,
      img: res.wenzi4,
    })
    addContent({
      people: this.nodebs,
      key: "wenzi5",
      sound: res.zimp5,
      img: res.wenzi5,
      offset: cc.p(0,20),
      btnoffset:cc.p(0,-10)
    })
  }
})