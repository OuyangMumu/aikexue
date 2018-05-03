//@author mu @16/5/11
var  node_local_zero = 50
var CreateTwj = cc.Class.extend({
    bigwenduji : null,
    dingwei : null,
    wenduji_res:null,
    temperature : 35,
    xiaowenduji : null,
    lock_dingwei : null,
    _wendujiBeganCallback : null,
    _wendujiMoveCallback : null,
    _wendujiEndCallback : null,
    _secheduleCallback : null,
    outbeizi : true,
    _color : null,
    _colornum:null,
    colorstatus:null,
    fangdanode : null,
    ctor:function(color,num){
      this._color = color;
        this._colornum = num || 0
    },

    //温度计功能
    createWenduji:function(){
        var self = this;
        var num = 1;
        var num2 = 1;
        cc.log(this.wenduji_res)
        var wenduji = ccs.load(res.twjJson).node;
        this.fangdanode = wenduji.getChildByName("fangdanode");
        var leftbtn =  this.fangdanode.getChildByName("leftbtn");
        var smallBtn = this.fangdanode.getChildByName("scaledownbtn");
        var bigBtn = this.fangdanode.getChildByName("scaleupbtn");
        var closebtn = this.fangdanode.getChildByName("closebtn");
        self.leftbtn = leftbtn
        self.smallBtn = smallBtn
        self.bigBtn = bigBtn
        self.closebtn = closebtn
        self.touchsp =  this.fangdanode.getChildByName("touchsp");
        var panel = this.fangdanode.getChildByName("Panel");
        this.bigwenduji = panel.getChildByName("wendubg");
        this.bigwenduji.initX = this.bigwenduji.x
        this.xiaowenduji = wenduji.getChildByName("xiaowenduji");
        var xiaoxian = this.xiaowenduji.getChildByName("xiaoxian");
        var bigxian = this.bigwenduji.getChildByName("bigxian");
        xiaoxian.setScaleY(0.214);
        bigxian.setScaleY(0.235);
        this.lock_dingwei = true;
        this.dingwei = this.xiaowenduji.getChildByName("dingweiqi");
        //this.dingwei.setGlobalZOrder(200)
        
        wenduji.colornum = this._colornum;
        if(this._color){
          var drawnode1 = new cc.DrawNode();
          drawnode1.drawRect(cc.p(1,1),cc.p(panel.width-2,panel.height-2),null,4,this._color);
          panel.addChild(drawnode1);
          var drawnode2 = new cc.DrawNode();
          drawnode2.drawRect(cc.p(1,1),cc.p(this.dingwei.width,this.dingwei.height),null,3,this._color);
          this.dingwei.addChild(drawnode2);
        }

        smallBtn.addClickEventListener(function () {
            if (num <= 0.7 || num2 >= 1.6) return;
            num = num / 1.2;
            num2 = num2 * 1.2;
            self.bigwenduji.setScale(num);
            self.dingwei.setScale(num2);
            self.applyTemperatureToDingWei(self.temperature,0);
        });

        bigBtn.addClickEventListener(function () {
            if (num2 <= 0.7 || num >= 1.6) return;
            num = num * 1.2;
            num2 = num2 / 1.2;
            self.bigwenduji.setScale(num);
            self.dingwei.setScale(num2);
            self.applyTemperatureToDingWei(self.temperature,0);
        });

        closebtn.addClickEventListener(function(){
            self.fangdanode.setVisible(false);
        });
        //定位器监听
        tools.addListener(self.dingwei,function(){
            self.fangdanode.setVisible(true);
        },function(touch, event){
            var target = event.getCurrentTarget();
            var delta = touch.getDelta();
            target.y += delta.y;
            target.x += delta.x;
            if(target.x <= 0)
                target.x = 0;
            if(target.x >= self.xiaowenduji.getContentSize().width)
                target.x = self.xiaowenduji.getContentSize().width;
            if (target.y >= self.xiaowenduji.getContentSize().height)
                target.y = self.xiaowenduji.getContentSize().height;
            if (target.y <= 0)
                target.y = 0;

            self.bigwenduji.x = self.bigwenduji.initX - 6*(target.x - 11.72) 
            var value = (target.y-182)/33+35;
            self.applyTemperatureToDingWei(value,0);

        },function(touch, event){
            var target = event.getCurrentTarget();
            self.dingwei.setPositionX(11.72);
            self.bigwenduji.setPositionX(88);
            if(self.lock_dingwei){
                self.setTemperature(self.temperature,0);
            }else {
                var value = (target.y-182)/33+35;
                self.applyTemperatureToDingWei(value, 0);
            }
        });
        return wenduji;
    },
    //添加温度计触摸事件
    /*
       @addWendujiBeganCallback  began
       @addWendujiMoveCallback   move
       @addWendujiEndCallback    end
     */
    addWendujiBeganCallback:function(callback){
        this._wendujiBeganCallback = callback;
    },

    addWendujiMoveCallback:function(callback){
        this._wendujiMoveCallback = callback;

    },
    addWendujiEndCallback:function(callback){
        this._wendujiEndCallback = callback;
    },

    addSecheduleCallback:function(callback){
        this._secheduleCallback = callback;
    },

    getXiaowenduji:function(){
        return this.xiaowenduji;
    },
    getdiweiqi:function(){
        return this.dingwei;
    },

    getpanel:function(){
        return this.fangdanode;
    },
    removeWdjTouch:function(){
        this.xiaowenduji.removeListen()
    },
    removePanelTouch:function(){
        var self = this
        this.touchsp.removeListen()
        this.touchsp.setPositionY(-500)
        this.fangdanode.setPositionY(-500)
        this.dingwei.setPositionY(-5000)
        self.leftbtn.setPositionY(-5000)
        self.smallBtn.setPositionY(-5000)
        self.bigBtn.setPositionY(-5000)
        self.closebtn.setPositionY(-5000)
    },
    //改变温度时 action
    setTemperature:function(value,second){
        this.temperature = value;
        var xiaoxian = this.xiaowenduji.getChildByName("xiaoxian");
        var bigxian = this.bigwenduji.getChildByName("bigxian");
        var v =0.214 + (value-35)*0.1121;
        var v2 =0.235 + (value-35)*0.11195;
        xiaoxian.stopAllActions();
        bigxian.stopAllActions();
        if(second<=0){
            xiaoxian.setScaleY(v);
            bigxian.setScaleY(v2);
        }
        else{
            xiaoxian.runAction(cc.scaleTo(second,1,v));
            bigxian.runAction(cc.scaleTo(second,1,v2));
        }
        if(this.lock_dingwei){
            this.applyTemperatureToDingWei(value,second);
        }
    },

    //定位器重新定位
    applyTemperatureToDingWei:function(value,second){
        var dw_y = 182+33*(value-35)
        var wdj_y = 429-122*(value-35)
        if(second<=0){
            this.dingwei.stopAllActions();
            this.bigwenduji.stopAllActions();

            this.dingwei.setPositionY(dw_y)
            this.bigwenduji.setPositionY(wdj_y)
        }else{
            this.dingwei.stopAllActions();
            this.bigwenduji.stopAllActions();
            this.dingwei.runAction(cc.moveTo(second,cc.p(this.dingwei.getPositionX(),dw_y)));
            this.bigwenduji.runAction(cc.moveTo(second,cc.p(this.bigwenduji.getPositionX(),wdj_y)));
        }
    },
    setTemperatureStop:function(){
        this.dingwei.stopAllActions()
        this.bigwenduji.stopAllActions()
        var disY = this.dingwei.getPositionY()
        var value = (disY - 182)/33 + 35
        this.setTemperature(value,0)
    }
});
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
          loadPlist("twj_see")
        })
        this._super()
        var self = this
        self.tempT = Number(parseFloat(Math.random()*5 + 36).toFixed(1))
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                var colors = []
                for (var i = 0; i < 4; i++) {
                    colors[i] = cc.color(158,11,253)
                }
                var bg = createBiaoge({
                   json: res.biao1,
                   isShowResult: true,
                   scale: 0.9,
                   inputNum:4,
                   rootColor:colors,
                   inputKeys:[42,35,0.1,self.tempT]
                })
                loadList(bg,["tempT"])
                self.addChild(bg)
                self.bgg = bg

                var lb = new cc.LabelTTF(self.tempT,"",40)
                lb.setColor(cc.color(158,11,253))
                lb.setPosition(bg.tempT.width/2,bg.tempT.height/2)
                bg.tempT.addChild(lb)
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
        var useBtn = new ccui.Button(res.usebtn_nor,res.usebtn_sel)
        useBtn.setPosition(80,420)
        self.addChild(useBtn)

        var boy = self.createBoy()
        boy.setPosition(810,190)
        boy.setScale(-1,1)
        self.addChild(boy)

        var bigTwj = new cc.Sprite(res.bigtwj)
        bigTwj.setPosition(490.5,283)
        self.addChild(bigTwj)
        bigTwj.setVisible(false)

        var twjNodes = new CreateTwj()
        var twjNode = twjNodes.createWenduji()
        twjNode.setPosition(490,10)
        self.addChild(twjNode)
        twjNodes.setTemperature(38,0)

        var hand = new cc.Sprite(res.shou)
        hand.setPosition(350,583)
        hand.initPos = hand.getPosition()
        self.addChild(hand)
  
        createTouchEvent({
            item:bigTwj,
            begin:function(data){
                var item = data.item
                var pos = data.pos
                if(!twjNode.isVisible()){
                    return false
                }
                if(!item.smalltwj){
                    item.smalltwj = new cc.Sprite(res.atwj)
                    self.addChild(item.smalltwj)
                }
                twjNode.setVisible(false)
                item.smalltwj.setPosition(pos)
                item.smalltwj.setVisible(true)
                return true
            },
            move:function(data){
                var item = data.item
                var pos = data.pos
                if(item.smalltwj && !item.noMove){
                    item.smalltwj.setPosition(pos)
                    if(judgeInside({item:boy.hand,pos:pos})){
                        if(twjNodes.temperature>35){
                            item.noMove = true
                            item.tanTip = true
                            dialogControl.AddDialog("Tips", {
                                res: res.tip1,
                                face: 1,
                                confirmBtn: true,
                                father: self
                            })
                        }else{
                            item.noMove = true
                            item.tanTip = false
                            item.smalltwj.setPosition(750,650)
                            item.smalltwj.setVisible(false)
                            hand.setVisible(false)
                            hand.noMove = true
                            var changeTime = (self.tempT - twjNodes.temperature)*3
                            twjNodes.setTemperature(self.tempT,changeTime)
                            boy.geTwjAc()
                        }
                    }
                }
            },
            end:function(data){
                var item = data.item
                if(item.tanTip){
                    item.noMove = false
                }
                if(!item.noMove){
                   twjNode.setVisible(true)
                   item.smalltwj.setVisible(false)
                }
            }
        })

        boy.setTwjEndMove(function(){
            twjNode.setVisible(true)
            bigTwj.noMove = false
            hand.setVisible(true)
            hand.noMove = false
            twjNodes.setTemperatureStop()
        })

        useBtn.addClickEventListener(function(){
            if(!self.useTip){
                self.useTip = createShowImg({
                    img:res.usetip,
                    bgInfo:{
                        sizeScale:cc.p(2.8,15.5),
                        posOff:cc.p(0,210)
                    }
                })
                self.addChild(self.useTip)
                var btnInfo = []
                for(var i=0; i<10; i++){
                    if(i<=4){
                       btnInfo[i] = sprintf("btn%d",i+1)
                    }else{
                       btnInfo[i] = sprintf("del%d",i-4)
                    }
                }
                var btnnode = loadNode(res.detailNode,btnInfo)
                btnnode.setPosition(260,265)
                self.useTip.addChild(btnnode)
                
                var boy3 = self.createBoy()
                boy3.setScale(-0.5,0.5)
                boy3.setPosition(-30,-30)
                btnnode.del3.addChild(boy3)
                btnnode.del3.boy3 = boy3
                boy3.twj.setPosition(68,130)
                boy3.twj.setVisible(false)
                boy3.twj.removeListen()

                btnnode.del3.playSelf = function(){
                    var del = this
                    if(!del.shuaiHand){
                        loadList(del,["show1","show2"])
                        del.shuaiHand = new cc.Sprite(res.twj_hand)
                        del.shuaiHand.setPosition(-240,100)
                        del.addChild(del.shuaiHand)
                        del.shuaiHand.setScale(-0.4,0.4)
                        del.shuaiHand.setAnchorPoint(1,1)
                        del.shuaiHand.setRotation(-10)                 
                    }
                    del.shuaiHand.stopAllActions()
                    del.shuaiHand.setPosition(-240,100)
                    del.shuaiHand.setVisible(true)
                    del.boy3.twj.setVisible(false)
                    del.shuaiHand.runAction(cc.sequence(
                        cc.callFunc(function(){
                            del.show1.setVisible(true)
                            del.show2.setVisible(false)
                        }),
                        cc.delayTime(2),
                        cc.callFunc(function(){
                            del.show1.setVisible(false)
                        }),
                        cc.repeat(cc.sequence(cc.rotateTo(0.1,50),cc.rotateTo(0.1,-10)),4),
                        cc.callFunc(function(){
                            del.show2.setVisible(true)
                        }),
                        cc.delayTime(2),
                        cc.callFunc(function(){
                            del.show2.setVisible(false)
                        }),
                        cc.moveTo(0.4,cc.p(-170,80)),
                        cc.callFunc(function(){
                            del.shuaiHand.setVisible(false)
                            del.boy3.twj.setVisible(true)
                        })
                    ))
                }

                var boy4 = self.createBoy()
                boy4.setScale(-0.5,0.5)
                boy4.setPosition(-30,-30)
                btnnode.del4.addChild(boy4)
                boy4.twj.setPosition(68,130)
                boy4.twj.setVisible(true)
                boy4.twj.removeListen()

                var clock1 = createWatch()
                clock1.setPosition(-200,-90)
                clock1.setScale(0.25)
                btnnode.del4.addChild(clock1)

                btnnode.del4.playSelf = function(){
                    if(!this.isLoad){
                        this.isLoad = true
                        loadList(this,["twj_yt1","twj_bg"])
                    }
                    this.twj_bg.stopAllActions()
                    this.twj_yt1.stopAllActions()
                    this.twj_bg.runAction(cc.moveTo(10,cc.p(50,160)))
                    this.twj_yt1.runAction(cc.scaleTo(10,0.54))
                }
                btnnode.del4.stopSelf = function(){
                    if(this.twj_bg){
                        this.twj_bg.stopAllActions()
                        this.twj_yt1.stopAllActions()
                        this.twj_bg.setPosition(50,353)
                        this.twj_yt1.setScaleY(0.24)
                    }
                }

                btnnode.del5.playSelf = function(){
                    var del = this
                    if(!del.rotoTwj){
                        del.rotoTwj = new cc.Sprite("#twj_bh00.png")
                        del.rotoTwj.setPosition(-143,120)
                        del.addChild(del.rotoTwj)

                        del.rotoTwj1 = new cc.Sprite("#twj_sz00.png")
                        del.rotoTwj1.setPosition(-121,-28)
                        del.addChild(del.rotoTwj1)

                        del.hk = new cc.Sprite(res.hk)
                        del.hk.setPosition(-143,106)
                        del.addChild(del.hk)
                    }
                    del.rotoTwj.stopAllActions()
                    del.rotoTwj1.stopAllActions()
                    del.rotoTwj.runAction(createAnimation({
                            frame:"twj_bh%02d.png",
                            start:0,
                            end: 16,
                            time: 0.1,
                        }))
                    del.rotoTwj1.runAction(createAnimation({
                            frame:"twj_sz%02d.png",
                            start:0,
                            end: 15,
                            time: 0.1,
                        }))
                }

                for (var i = 0; i < 5; i++) {
                    btnnode[btnInfo[i]].index = i
                    btnnode[btnInfo[i]].addClickEventListener(function(sender){
                        for(var k = 0; k < 5; k++){
                            if(sender.index==k){
                               btnnode[btnInfo[k+5]].setVisible(true)
                               if(btnnode[btnInfo[k+5]].playSelf){
                                 btnnode[btnInfo[k+5]].playSelf()
                               }
                               btnnode[btnInfo[k]].setEnabled(false)
                               btnnode[btnInfo[k]].setBright(false)
                            }else{
                               btnnode[btnInfo[k+5]].setVisible(false)
                               if(btnnode[btnInfo[k+5]].stopSelf){
                                 btnnode[btnInfo[k+5]].stopSelf()
                               }
                               btnnode[btnInfo[k]].setEnabled(true)
                               btnnode[btnInfo[k]].setBright(true)
                            }
                        }
                    })
                }
            }
            self.useTip.show()
        })

        var playTwj = function(){
            if(!self.twj_hand){
               self.twj_hand = new cc.Sprite(res.twj_hand)
               self.twj_hand.setPosition(300,480)
               self.addChild(self.twj_hand)
               self.twj_hand.setScale(-1,1)
               self.twj_hand.setAnchorPoint(1,1)
            }
            self.twj_hand.setVisible(true)
            twjNodes.setTemperature(34,0.1)
            self.twj_hand.runAction(cc.sequence(
                cc.repeat(cc.sequence(cc.rotateTo(0.15,50),cc.rotateTo(0.15,-10)),4),
                cc.callFunc(function(){
                    self.twj_hand.setVisible(false)
                    hand.setVisible(true)
                    hand.noMove = false
                    twjNode.setVisible(true)
                    self.speakeBykey("wenzi2")
                })
            ))
        }

        createTouchEvent({
            item:hand,
            begin:function(data){
                var item = data.item
                if(!item.isVisible()){
                    return false
                }
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove){
                    item.x += delta.x
                    item.y += delta.y
                    if(judgeItemCrash({item1:item,item2:bigTwj})){
                        item.noMove = true
                        item.setVisible(false)
                        twjNode.setVisible(false)
                        playTwj()
                    }
                }
            },
            end:function(data){
               var item = data.item
               item.setPosition(item.initPos)
            }
        })

        var clock = createWatch()
        clock.setPosition(160,175)
        clock.setScale(0.7)
        self.addChild(clock)
    },
    createBoy:function(){
        var self = this
        var boy = new cc.Node()
        boy.setCascadeOpacityEnabled(true)

        var boy2 = new cc.Sprite(res.boy2)
        boy2.setPosition(-12,157)
        boy2.setAnchorPoint(0.5,0)
        boy.addChild(boy2)

        var boy3 = new cc.Sprite(res.boy3)
        boy3.setPosition(22,120)
        boy3.setRotation(-14)
        boy3.setAnchorPoint(0.2,0.88)
        boy.addChild(boy3)
        boy.hand = boy3

        var twj = new cc.Sprite(res.atwj)
        twj.setPosition(115,158)
        twj.initPos = twj.getPosition()
        boy.addChild(twj)
        boy.twj = twj
        twj.setScale(-1,1)
        twj.setVisible(false)

        createTouchEvent({
            item:twj,
            begin:function(data){
               var item = data.item
               if(item.canTouch){
                    if(item.canget){
                        item.canTouch = false
                        boy3.runAction(cc.sequence(
                            cc.rotateTo(0.4,-60),
                            cc.callFunc(function(){
                                item.runAction(cc.sequence(
                                    cc.moveTo(0.5,cc.p(250,140)),
                                    cc.callFunc(function(){
                                        item.setVisible(false)
                                        item.setPosition(item.initPos)
                                        if(boy.twjEndMove){
                                            boy.twjEndMove()
                                        }
                                    })
                                ))
                            }),
                            cc.delayTime(0.2),
                            cc.rotateTo(0.4,-14)
                        ))
                    }else{
                        item.canTouch = true
                        dialogControl.AddDialog("Tips", {
                            res: res.tip2,
                            face: 1,
                            confirmBtn: true,
                            father: self
                        })
                    }
               }
               return false
            }
        })

        var boy1 = new cc.Sprite(res.boy1)
        boy1.setPosition(-2,0)
        boy.addChild(boy1)

        var boy4 = new cc.Sprite(res.boy4)
        boy4.setPosition(18,233)
        boy.addChild(boy4)
        boy4.runAction(cc.repeatForever(cc.sequence(
            createAnimation({
                            ifFile:true,
                            frame:"boy%d",
                            start:4,
                            end: 8,
                            time: 0.05,
                        }),
            cc.delayTime(3),
            createAnimation({
                            ifFile:true,
                            frame:"boy%d",
                            start:4,
                            end: 8,
                            time: 0.05,
                        }),
            cc.delayTime(2),
            createAnimation({
                            ifFile:true,
                            frame:"boy%d",
                            start:4,
                            end: 8,
                            time: 0.05,
                        }),
            cc.delayTime(5)
        )))

        boy.geTwjAc = function(){
            twj.setVisible(true)
            twj.canget = false 
            boy3.runAction(cc.sequence(
                cc.rotateTo(0.4,-60),
                cc.callFunc(function(){
                   twj.runAction(cc.sequence(
                       cc.moveTo(0.2,cc.p(63,130)),
                       cc.callFunc(function(){
                          twj.canTouch = true
                       }),
                       cc.delayTime(22),
                       cc.callFunc(function(){
                          twj.canget = true 
                       })
                    ))
                }),
                cc.delayTime(0.2),
                cc.rotateTo(0.4,-14)
            ))
        }
        boy.setTwjEndMove = function(fun){
          if(fun){
            boy.twjEndMove = fun
          }
        }
        return boy
    },
    speakeBykey:function(key){
        if(!this[key]){
            this[key] = true
            this.nodebs.say({
                    key: key,
                    force: true
                })
        }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.speakeBykey("wenzi1")
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
    }  
})