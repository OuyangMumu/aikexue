//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super();
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },

    initUI: function() {

        var self = this
        var toolnode = new cc.Node();
        toolnode.x = 0 ; toolnode.y =0;
        this.addChild(toolnode,5);
        var first = true

        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, 0),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: false,
            firstClick:function(data){
                var index = data.index
                if(toolnode.getChildren()[0])
                    toolnode.getChildren()[0].forceBack()

                for(var i in self.mielist){
                  self.mielist[i].sp.setVisible(false)
                   if(self.mielist[i].clicksp.listener)
                      self.mielist[i].clicksp.removeListen()
                }
                if(first){
                  first = false 
                  self.nodebs.say({
                     key: "chosenext",
                     force:true    
                  })
                }
                         
                if(self.result){
                    addShowType({
                         item: self.result,
                         show: "zoom",
                         time: 0.3,
                         fun:function(){
                            self.result.removeFromParent()
                            self.result = null
                         }
                     })
                     removeMoving(self.result)
                }
                return true;
            },
            outfun:function(data){
                var index = data.index
                var sp = data.sp
                sp.removeListen()
                sp.setVisible(false)

                self.mielist[index].sp.setVisible(true)
                self.caobtn.setVisible(true)
                self.caobtn.showindex = index
                self.resultbtn.showindex = index
                if(self.mielist[index].biaozhi)
                    self.mielist[index].biaozhi.runAction(cc.repeatForever(
                        cc.sequence(
                            cc.moveBy(0.4,cc.p(0,8)),
                                cc.moveBy(0.4,cc.p(0,-8))
                                )
                        ))
                if(self.mielist[index].addTouchFun)
                    self.mielist[index].addTouchFun()
                sp.setPosition(840,260)
            },
            clickfun:function(data){
                
                return true
            },
            father:toolnode,
            files:[res.ganfen_sel,res.co2_sel,res.paomo_sel],
            gets:[res.ganfen,res.co2,res.paomo],
        });
        this.addChild(this.toolbtn,3);

        var self = this;
        var uinamelist = [
          "huo","mie1","mie2","mie3",
          "caobtn","resultbtn","qiantou","yaoshi",
          "yazi","baox","yaba","penfenac","yao2","co2ba",
          "baox1","yazi2","co2ac","zhi1","paomoss","penmo",
          "uphand","downhand1","downhand2","up","down",
          "tuohand","tuohand2","penpaomos","water","paomos","penmots"
        ];
        loadUI(this, res.do1, uinamelist)
        this.uphand.rootPos = this.uphand.getPosition()
        this.downhand1.rootPos = this.downhand1.getPosition()
        this.downhand2.rootPos = this.downhand2.getPosition()
        var huo = ccs.load(res.ranshao).action
        huo.gotoFrameAndPlay(0,46,true)
        self.huo.runAction(huo)
        self.yaoshi.setVisible(true)
        self.caobtn.setVisible(false)
        self.resultbtn.setVisible(false)

        self.mielist = [
            {
                sp:self.mie1,
                clicksp:self.yaoshi.getChildren()[0],
                caotip:res.ganfentip,
                biaozhi:self.qiantou,
                addTouchFun:function(){
                   createTouchEvent({
                         item:self.yaoshi.getChildren()[0],
                         begin:function(data){
                            var item = data.item
                            item.removeListen()
                            self.toolbtn.setAllUse(false)
                            var yaoac = ccs.load(res.baoxian).action
                            yaoac.gotoFrameAndPlay(0,27,false)
                            yaoac.setLastFrameCallFunc(function(){
                                
                                self.qiantou.setPosition(258,340)
                                self.qiantou.setRotation(0)
                                self.yazi.setVisible(true)
                                self.baox.setVisible(false)
                                    createTouchEvent({
                                       item:self.yaba,
                                       begin:function(data){
                                         var item = data.item
                                         self.yazi.setVisible(false)
                                         self.qiantou.stopAllActions()
                                         self.qiantou.setVisible(false)
                                         item.runAction(cc.sequence(
                                               cc.rotateTo(0.5,9),
                                               cc.callFunc(function(){

                                                  self.huo.stopAllActions()
                                                  self.paomoss.setVisible(true)
                                                  var fenac = ccs.load(res.ranshao).action
                                                  fenac.gotoFrameAndPlay(46,144,false)
                                                  self.huo.runAction(fenac)

                                                   var penfenAc = ccs.load(res.penfen).action
                                                   penfenAc.gotoFrameAndPlay(0,17,true)
                                                   self.penfenac.setVisible(true)
                                                   self.penfenac.runAction(penfenAc)
                                                   self.penfenac.scheduleOnce(function(){
                                                      self.penfenac.stopAllActions()
                                                      self.penfenac.removeFromParent()
                                                      self.resultbtn.setVisible(true)
                                                   },3)
                                               }),
                                               cc.rotateTo(0.5,18),
                                               cc.callFunc(function(){
                                                  item.removeListen()
                                                })
                                          ))
                                        }
                                    })
                            })
                            item.getParent().runAction(yaoac) 
                         }
                     })
                }
            },
            {
                sp:self.mie2,
                clicksp:self.yao2.getChildren()[0],
                caotip:res.co2tip,
                biaozhi:self.zhi1,
                 addTouchFun:function(){
                  createTouchEvent({
                    item:self.yao2.getChildren()[0],
                    begin:function(data){
                        var item = data.item
                        item.removeListen()
                        self.toolbtn.setAllUse(false)
                        var yaoac = ccs.load(res.baoxian).action
                        yaoac.gotoFrameAndPlay(0,27,false)
                        yaoac.setLastFrameCallFunc(function(){
                            self.zhi1.setPosition(12,200)
                            self.zhi1.setRotation(0)
                            self.yazi2.setVisible(true)
                            self.baox1.setVisible(false)
                                createTouchEvent({
                                   item:self.co2ba,
                                   begin:function(data){
                                     var item = data.item
                                     self.yazi2.setVisible(false)
                                     self.zhi1.stopAllActions()
                                     self.zhi1.setVisible(false)
                                     item.runAction(cc.sequence(
                                           cc.rotateTo(0.5,9),
                                           cc.callFunc(function(){
                                              self.huo.stopAllActions()
                                              var ximie = ccs.load(res.ranshao).action
                                              ximie.gotoFrameAndPlay(46,144,false)
                                              self.huo.runAction(ximie)

                                               var co2acc = ccs.load(res.cco2).action
                                               co2acc.gotoFrameAndPlay(0,17,true)
                                               self.co2ac.setVisible(true)
                                               self.co2ac.runAction(co2acc)
                                               self.co2ac.scheduleOnce(function(){
                                                  self.co2ac.stopAllActions()
                                                  self.co2ac.removeFromParent()
                                                  self.resultbtn.setVisible(true)
                                               },3.4)
                                           }),
                                           cc.rotateTo(0.5,18),
                                           cc.callFunc(function(){
                                              item.removeListen()
                                            })
                                      ))
                                    }
                                })
                        })
                        item.getParent().runAction(yaoac) 
                    }
                  })
                }
            },
            {
                sp:self.mie3,
                clicksp:self.penmo,
                caotip:res.paomotips,
                addTouchFun:function(){
                    createTouchEvent({
                        item:self.penmo,
                        rect:cc.rect(121,65,124,350),
                        begin:function(data){
                            self.uphand.setPosition(self.uphand.rootPos)
                            self.downhand1.setPosition(self.downhand1.rootPos)
                            self.downhand2.setPosition(self.downhand2.rootPos)
                            self.toolbtn.setAllUse(false)
                            self.uphand.stopAllActions()
                            self.downhand1.stopAllActions()
                            self.downhand2.stopAllActions()
                            self.uphand.runAction(cc.spawn(
                                  cc.fadeIn(0.08),
                                  cc.moveTo(0.08,cc.p(189,415))
                              ))
                            self.downhand1.runAction(cc.spawn(
                                  cc.fadeIn(0.08),
                                  cc.moveTo(0.08,cc.p(28.79,-179))
                              ))
                            self.downhand2.runAction(cc.spawn(
                                  cc.fadeIn(0.08),
                                  cc.moveTo(0.08,cc.p(23.8,-180))
                              ))
                          return true
                        },
                        move:function(data){
                            var delta = data.delta
                            var item =  data.item
                            var dis = Math.sqrt(Math.pow(delta.x,2)+Math.pow(delta.y,2))
                            if(dis>0.6){
                                item.removeListen()                               
                                self.up.setVisible(false)
                                self.down.setVisible(false)
                                item.getParent().runAction(cc.sequence(
                                  cc.rotateTo(0.8,180),
                                  cc.rotateBy(0.1,10),
                                  cc.callFunc(function(){
                                    self.uphand.setVisible(false)
                                    self.tuohand.setVisible(true)
                                    self.tuohand2.setVisible(true)
                                    item.getParent().runAction(cc.sequence(
                                           cc.repeat(cc.sequence(
                                               cc.moveBy(0.3,cc.p(0,50)),
                                               cc.moveBy(0.3,cc.p(0,-50))
                                            ),5),
                                           cc.rotateTo(0.05,178),
                                           cc.callFunc(function(){
                                             self.tuohand.setRotation(150)
                                             self.tuohand2.setRotation(150)
                                             self.penpaomos.setVisible(true)

                                               self.huo.stopAllActions()
                                               self.paomos.setVisible(true)
                                               self.water.setVisible(true)
                                               var ximie3 = ccs.load(res.ranshao).action
                                               ximie3.gotoFrameAndPlay(0,144,false)
                                               self.huo.runAction(ximie3)

                                               var paomoac = ccs.load(res.paomoAc).action
                                               paomoac.gotoFrameAndPlay(0,17,true)
                                               self.penpaomos.runAction(paomoac)
                                               self.penpaomos.scheduleOnce(function(){
                                                  self.penpaomos.stopAllActions()
                                                  self.penpaomos.removeFromParent()
                                                  self.mie3.setVisible(false)
                                                  self.penmots.setVisible(true)
                                                  self.resultbtn.setVisible(true)
                                               },4.5)
                                           })
                                      ))
                                  })
                                ))
                            }
                        },
                        end:function(){
                            self.uphand.stopAllActions()
                            self.downhand1.stopAllActions()
                            self.downhand2.stopAllActions()
                            self.uphand.runAction(cc.spawn(
                                cc.fadeOut(0.08),
                                cc.moveTo(0.08,cc.p(189,470))
                            ))
                            self.downhand1.runAction(cc.spawn(
                                cc.fadeOut(0.08),
                                cc.moveTo(0.08,cc.p(28.79,-230))
                            ))
                            self.downhand2.runAction(cc.spawn(
                                cc.fadeOut(0.08),
                                cc.moveTo(0.08,cc.p(23.8,-230.7))
                            ))
                        }
                    })
                }
            }
        ]

        self.caobtn.addClickEventListener(function(sender,type){

                if(!self.result){
                 self.result = createResult({
                     img:self.mielist[sender.showindex].caotip,
                     offset: cc.p(60, 50),
                     offbg: cc.p(50,50),
                     btnfun:function(){
                         if(self.result){
                             addShowType({
                                 item: self.result,
                                 show: "zoom",
                                 time: 0.3
                             })
                             removeMoving(self.result)
                         }
                     }
                 })
                 self.result.changeSelfLocalZero = function(){
                       this.setLocalZOrder(LOCAL_ORDER++)
                 }
                 addShowType({
                     item: self.result,
                     show: "scale",
                     time: 0.3
                 })
                 self.result.setLocalZOrder(LOCAL_ORDER++)
                 addMoving(self.result)
                 self.result.setPosition(getMiddle())
                 self.addChild(self.result)
             }else{
                 if(self.result.getScale()==0){

                     self.result.setLocalZOrder(LOCAL_ORDER++)
                     safeAdd(self,self.result)

                     addShowType({
                         item: self.result,
                         show: "scale",
                         time: 0.3
                     })
                     addMoving(self.result)
                 }else{
                     addShowType({
                         item: self.result,
                         show: "zoom",
                         time: 0.3
                     })
                     removeMoving(self.result)
                 }
             }

        })
        self.resultbtn.addClickEventListener(function(sender,type){
                  self.nodebs.say({
                   key: "eye"+sender.showindex    
              })
        })
        

    
    },
    myEnter: function() {
        this._super()
        this.toolbtn.show()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                   key: "chose",
                   force:true    
              })
            })
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "chose",
            scale:0.9,
            sound: res.zi1mp,
            img: res.wenzi1,
        })
        addContent({
            people: this.nodebs,
            key: "chosenext",
            scale:0.9,
            sound: res.zi2mp,
            img: res.wenzi2,
        })

        addContent({
           people: this.nodebs,
           key: "eye0",
           img:res.eye1,
           id:"result",
           sound: res.fenget,
           offset: cc.p(35, 30),
           offbg: cc.p(50,50),
        })
        addContent({
           people: this.nodebs,
           key: "eye1",
           img:res.eye2,
           id:"result",
           sound: res.co2get,
           offset: cc.p(50, 25),
           offbg: cc.p(50,30),
        })
        addContent({
           people: this.nodebs,
           key: "eye2",
           img:res.eye3,
           id:"result",
           sound: res.paomoget,
           offset: cc.p(60, 25),
           offbg: cc.p(50,30),
        })
    }
      
})