
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
        });
        this.expCtor();
        this.initUI();
        this.initPeople();

        return true;
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key:"wenzi1"
                })
            })
        }
    },
    initUI:function(){
        var self = this
        var uiname = [
          "deng","mvhand","water","xiangbtn"
        ]
        self.donode = loadNode(res.see1, uiname)
        self.addChild(self.donode)
        var node = self.donode
        node.xiangbtn.setVisible(false)
        //node.mvhand.setPosition(547,470)
         self.jjd = createJJD({
                    pos:cc.p(-5,25),
                    scale:1.3,
                    father:node.deng
                })

        self.jjd.setCallBack({
            up:function(){
               this.setCanClick(false)
           
            },
            fire:function(){
               node.water.playAction1()
            },
            down:function(){
                 node.water.stopFeiteng()
                 this.setCanClick(false)
                 node.mvhand.stopAllActions()
            }
        })

        node.water.playAction1 = function(){
            node.water.scheduleOnce(function(){
                var actionnode = ccs.load(res.maopao).node
                var action1 = ccs.load(res.maopao).action
                action1.gotoFrameAndPlay(0, 41, true);
                this.addChild(actionnode)
                actionnode.getChildByName("maopao2").setVisible(false)
                actionnode.getChildByName("maopao3").setVisible(false)
                actionnode.runAction(action1)
                var yannode1 = createWaterAir({
                    total: 30,
                    width: 30,
                    height: 10,
                    res: res.img_smoke,
                })
                yannode1.setCascadeOpacityEnabled(true)
                yannode1.setOpacity(50)
                yannode1.setScale(0.8, 1)
                yannode1.setPosition(-15, 15)
                node.water.addChild(yannode1)

                this.child1 = actionnode
                this.child2 = yannode1
                this.playAction2()
            },4)
        }

        node.water.playAction2 = function(){
            node.water.scheduleOnce(function(){
                this.child1.setVisible(false)
                var actionnode1 = ccs.load(res.maopao).node
                var action2 = ccs.load(res.maopao).action
                action2.gotoFrameAndPlay(0, 16, true);
                this.addChild(actionnode1)
                actionnode1.setScale(0.3)
                actionnode1.getChildByName("maopao1").setVisible(false)
                actionnode1.runAction(action2)

                var yannode2 = createWaterAir({
                    total: 50,
                    width: 25,
                    height: 10,
                    res: res.img_smoke,
                })
                yannode2.setCascadeOpacityEnabled(true)
                yannode2.setOpacity(10)
                yannode2.runAction(cc.fadeIn(15))
                yannode2.setScale(0.8, 1)
                yannode2.setPosition(-15, 15)
                this.addChild(yannode2)

                this.child3 = actionnode1
                this.child4 = yannode2

                actionnode1.runAction(cc.sequence(
                    cc.scaleTo(1,0.6),
                    cc.callFunc(function(){
                        node.mvhand.playAc()
                    })
                ))
            },15)
        }
        node.water.stopFeiteng = function(){
            var inself = this
            this.child3.runAction(cc.sequence(
               cc.scaleTo(6,0),
               cc.callFunc(function(){
                   inself.child1.runAction(cc.scaleTo(3,0))
                   inself.child2.runAction(cc.fadeOut(3))
               })
            ))
            this.child4.runAction(cc.fadeOut(6))
        }

        node.mvhand.playAc = function(){
             var inself = this
             this.runAction(cc.sequence(
                cc.moveTo(0.6,cc.p(547,470)),
                cc.callFunc(function(){
                   inself.getChildren()[0].runAction(cc.sequence(
                        cc.fadeIn(10),
                        cc.callFunc(function(){
                            self.jjd.setCanClick(true)
                            node.xiangbtn.setVisible(true)

                             inself.runAction(cc.sequence(
                                          cc.delayTime(15),
                                          cc.callFunc(function(){
                                            self.jjd.exeDown()
                                          })
                                        ))
                        })
                    ))
                })
             ))
        }

        node.xiangbtn.addClickEventListener(function(){
            self.nodebs.say({
                key:"jielun1"
            })
        })
        
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500);

        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.zimp1,
            img:res.wenzi1
        })

        addContent({
          people: this.nodebs,
          key: "jielun1",
          img:res.jielun1,
          id:"result",
          sound: res.jielunmp1,
          offset: cc.p(30, 30),
          offbg: cc.p(50,50),
        })
    }
})

