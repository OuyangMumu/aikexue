//@author mu @16/5/11

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("wenzi")
            loadPlist("qipao")
        })
        this._super()
        this.expCtor()
        this.initUI()
        this.initPeople()
        this.initTool()
        this.initFunlist()
        
        return true
    },
    initUI: function(){
        var self = this
        self.node = loadNode(res.do_yao,null)
        self.node.setPosition(getMiddle(0,-50))
        self.addChild(self.node)
        var titleimg = new cc.Sprite(res.titleimg1)
        this.addChild(titleimg)
        titleimg.setPosition(568,580)

        var resultbtn = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        this.addChild(resultbtn)
        resultbtn.setPosition(1000,400)
        resultbtn.addClickEventListener(function(){
             self.nodebs.say({
                key: "jielun"
             })   
        })

        var yaobtn = new ccui.Button(res.yaobtn_nor,res.yaobtn_sel)
        yaobtn.setPosition(self.node.x+160,self.node.y-30)
        yaobtn.addClickEventListener(function(sender,type){
             sender.removeFromParent()
             var yaoac = ccs.load(res.do_yao).action
             yaoac.gotoFrameAndPlay(0,121,false)
             yaoac.setFrameEventCallFunc(function(frame){
                  var index = frame.getFrameIndex()
                  if(index==35){
                    self.nodebs.say({
                      key: "tip1",
                      force: true
                    })
                  }
             })
             yaoac.setLastFrameCallFunc(function(){
                 self.nodebs.say({
                      key: "wenzi6",
                      force: true
                    })
                 self.clockList[0] = false
                 yaoac.clearLastFrameCallFunc()
             })
             self.node.runAction(yaoac)
        })
        self.addChild(yaobtn)
    },
    initFunlist:function(){
       var self = this
       this.clockList = [true,true,true]
       this.imglist = ["wenzi5","wenzi7","wenzi9"]
       this.rectlist=[cc.rect(550,425,50,50)]

       var sp1movefun = function(){
          var sprect = cc.rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height)
          if(cc.rectContainsRect(sprect,self.rectlist[0])){
              this.removeListen()
              this.setVisible(false)
              this.y = -600
              var yaoac1 = ccs.load(res.do_yao).action 
              yaoac1.gotoFrameAndPlay(119,162,false)
              yaoac1.setLastFrameCallFunc(function(){
                self.nodebs.say({
                    key: "wenzi8",
                    force: true
                })
                self.clockList[1] = false
                self.xinode = ccs.load(res.do_xi).node
                self.xinode.setScale(0.72)
                self.xinode.setPosition(self.node.x-2,self.node.y-4.9)
                self.addChild(self.xinode) 
                self.node.removeFromParent()
                yaoac1.clearLastFrameCallFunc()
              })
              self.node.runAction(yaoac1)
          }
       }

       var sp2movefun = function(){
          var sppos = cc.p(this.x,this.y-100)
          if(cc.rectContainsPoint(self.rectlist[0],sppos) && self.xinode){
              this.removeListen()
              this.setVisible(false)
              this.y = -600
   
              var xiac = ccs.load(res.do_xi).action 
              xiac.gotoFrameAndPlay(0,82,false)
              self.zhen = self.xinode.getChildByName("xinode").getChildByName("zhen")
              xiac.setLastFrameCallFunc(function(){
                self.nodebs.say({
                    key: "wenzi10",
                    force: true
                })
                self.clockList[2] = false         
                safeAdd(self,self.zhen)
                self.zhen.setCascadeOpacityEnabled(true)
                self.zhen.setOpacity(255)
                self.zhen.setScale(0.78)
                self.zhen.setPosition(getMiddle(-50,-150))
                self.xinode.removeFromParent()
                xiac.clearLastFrameCallFunc()
              })
              self.xinode.runAction(xiac)
          }
       }

       var createTip = function(){
            self.tip2 = new cc.Sprite(res.tip2)
            self.tip2.setScale(0.75)
            self.tip2.setPosition(350,300)
            self.addChild(self.tip2)
            self.tip2.setVisible(false)

            self.tip3 = new cc.Sprite(res.tip3)
            self.tip3.setScale(0.75)
            self.tip3.setPosition(350,300)
            self.addChild(self.tip3)
            self.tip3.setVisible(false)

            self.up = new cc.Sprite(res.updown)
            self.up.setRotation(180)
            self.up.setPosition(620,540)
            self.addChild(self.up)
            self.up.runAction(cc.repeatForever(
                cc.sequence(
                  cc.moveBy(0.2,cc.p(0,10)),
                  cc.moveBy(0.2,cc.p(0,-10))
                )
            ))
            self.down = new cc.Sprite(res.updown)
            self.down.setPosition(620,440)
            self.down.setVisible(false)
            self.addChild(self.down)
            self.down.runAction(cc.repeatForever(
                cc.sequence(
                  cc.moveBy(0.2,cc.p(0,-10)),
                  cc.moveBy(0.2,cc.p(0,10))
                )
            ))
       }
       
       var sp3movefun = function(){
         if(self.zhen){
            var sprect = cc.rect(this.x-this.width/2-10,this.y-this.height/2-10,this.width+40,this.height+20)
            var sppos = cc.p(self.zhen.x+50,self.zhen.y-100)
            if(cc.rectContainsPoint(sprect,sppos)){
                this.removeListen()
                this.setVisible(false)
                this.y = -600
                var mov = self.zhen.getChildByName("mov")
                mov.setOpacity(255)
                mov.setVisible(true)

                self.nodebs.say({
                    key: "wenzi11",
                    force: true
                })
                var zlg = self.zhen.getChildByName("zlg")
                var sm = self.zhen.getChildByName("sm")
                zlg.sm = sm
                createTip()
                zlg.moveUp = function(){
                    this.stopAllActions()
                    if(!this.sp){
                        this.sp = new cc.Sprite()
                        this.sp.setPosition(30,87)
                        this.sp.setScaleX(0.7)
                        this.sm.addChild(this.sp)
                        this.sp.setRotation(180)
                    }
                    if(self.up){
                      self.up.removeFromParent()
                      self.up = null  
                    }
                    if(self.down){
                        self.down.setVisible(true)
                    }
                    this.sp.setVisible(true)
                    this.sp.stopAllActions()
                    this.sp.runAction(createAnimation({
                            frame: "pao%02d.png",
                            start:0,
                            end: 21,
                            time: 0.1,
                        })) 
                    this.runAction(cc.moveBy(0.5,cc.p(0,30)))
                }
                zlg.moveDown = function(){
                    this.stopAllActions()
                    if(this.sp){
                        cc.log("cursp",this.sp)
                        this.sp.stopAllActions()
                        this.sp.setSpriteFrame("pao21.png")
                        var inself = this
                        this.sp.runAction(cc.sequence(
                              createAnimation({
                                    frame: "pao%02d.png",
                                    start:0,
                                    end: 21,
                                    time: 0.05,
                                    rever:true
                                }),
                              cc.callFunc(function(){
                                inself.sp.setVisible(false)
                              })
                            )) 
                    }
                    if(self.down){
                      self.down.removeFromParent()
                      self.down = null  
                    }
                    this.runAction(cc.moveBy(0.5,cc.p(0,-30)))
                }
                self.candown = false
                createTouchEvent({
                    rect:cc.rect(0,250,120,180),
                    item:zlg,
                    begin:function(data){
                        var item = data.item
                        var pos = data.pos
                        item.beginY = pos.y
                        return true
                    },
                    end:function(data){
                        var item = data.item
                        var pos = data.pos
                        item.endY = pos.y
                        if(item.endY>item.beginY){
                            cc.log("up up up")
                            if(!self.tip2.isVisible()){
                                self.nodebs.say({
                                    key: "tip2",
                                    force: true
                                })
                                self.candown = true
                                self.tip2.setVisible(true)
                                self.tip3.setVisible(false)
                                item.moveUp()
                            }
                        }else{
                            cc.log("down down down")
                            if(!self.tip3.isVisible() && self.candown){
                                self.nodebs.say({
                                    key: "tip3",
                                    force: true
                                })
                                self.tip3.setVisible(true)
                                self.tip2.setVisible(false)
                                item.moveDown()
                            }
                        }
                    },
                })
            }
         }
       }

       self.moveFunList = [
         sp1movefun,
         sp2movefun,
         sp3movefun,
       ]

        this.endFunList = [
           null,
           null,
           null
        ]
      
      this.checkFun = function(){  
          if (this.clock) {
            var curimg = 0
            for (var k = 0; k < self.clockList.length; k++) {           
                if (!self.clockList[k]){
                  curimg = k+1
                }else{
                  break
                }          
            }
            self.nodebs.say({
                key: self.imglist[curimg],
                force: true
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
    initTool:function(){
        var self = this
        var toolnode = new cc.Node()
        toolnode.x = 0
        toolnode.y =0
        this.addChild(toolnode,5)

        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, -8),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                item.clock  = self.clockList[index]
               // item.excstartFun = self.startFunlist[index]
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
            files:[res.item1,res.item2,res.item3],
            gets:[res.move1,res.move2,res.move3]
        });
        this.addChild(this.toolbtn,3)
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi4",
                    force: true
                })
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
            key: "wenzi4",
            sound: res.zimp4,
            img: "#wenzi40000",
        })
        addContent({
            people: this.nodebs,
            key: "wenzi5",
            sound: res.zimp5,
            img: "#wenzi50000",
            offset: cc.p(-5, 0),
            scaleBg: cc.p(1.1,1.1),
        })
        addContent({
            people: this.nodebs,
            key: "wenzi7",
            sound: res.zimp7,
            img: "#wenzi70000",
            offset: cc.p(-5, 0),
            scaleBg: cc.p(1.1,1.1),
        })
        addContent({
            people: this.nodebs,
            key: "wenzi6",
            sound: res.zimp6,
            img: "#wenzi60000",
            offset: cc.p(15, 0),
            scaleBg: cc.p(1.2,1.1),
        })
        addContent({
            people: this.nodebs,
            key: "wenzi8",
            sound: res.zimp8,
            img: "#wenzi80000",
        })
        addContent({
            people: this.nodebs,
            key: "wenzi9",
            sound: res.zimp9,
            img: "#wenzi90000",
        })
        addContent({
            people: this.nodebs,
            key: "wenzi10",
            sound: res.zimp10,
            img: "#wenzi100000",
        })
        addContent({
            people: this.nodebs,
            key: "wenzi11",
            sound: res.zimp11,
            img: "#wenzi110000",
        })

        addContent({
            people: this.nodebs,
            key: "tip1",
            sound: res.tipmp1,
        })
        addContent({
            people: this.nodebs,
            key: "tip2",
            sound: res.tipmp2,
        })
        addContent({
            people: this.nodebs,
            key: "tip3",
            sound: res.tipmp3,
        })
       
        addContent({
            people: this.nodebs,
            key: "jielun",
            img:res.jielun,
            id:"result",
            sound: res.jielunmp,
            offset: cc.p(40, 20),
            offbg: cc.p(20,20),
        })
    }  
})