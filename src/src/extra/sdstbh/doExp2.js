var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        
        });
        this._super()
        this.expCtor()
        this.initUI()
        this.initPeople()
       
        return true
    },
    initUI: function(){

        var tmpthis = this;
        var experionenode = ccs.load(res.do2).node;
        this.addChild(experionenode);

        //deffer
        var shaozi = experionenode.getChildByName("shaozi");
        shaozi.setTag(10);
        var shaozipos = shaozi.getPosition();
        var shaozisp = shaozi.getChildByName("shaozisp");
        var shiyanzi = shaozi.getChildByName("shiyanzi");
        var beizi = experionenode.getChildByName("beizi");
        var hand1 = experionenode.getChildByName("hand1");
        hand1.setVisible(false);
        var hand1pos = hand1.getPosition();
        var hand2 = experionenode.getChildByName("hand2");
        hand2.setVisible(false);
        var hand2pos = hand2.getPosition();
        beizi.setTag(11);
        var beizizipos = beizi.getPosition();
        var beinode = beizi.getChildByName("mabuac");
        var bingnode = beizi.getChildByName("bingnode");
        var beiying = beizi.getChildByName("beiying");


        var towelsp = experionenode.getChildByName("towel");
        var tipspnode = experionenode.getChildByName("tipspnode");

        var canAction1 = true;
        var canwarning = true;
        var canMovema = true;
        var ismabuac = true;
        var isstartM = false;

        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(target.getTag() == 10){
                        if(canwarning){
                            if(canAction1){
                                canAction1 = false;
                                var shaoziac = ccs.load(res.shaoziac).action;
                                shaoziac.gotoFrameAndPlay(0,10,false);
                                shaozisp.runAction(shaoziac);
                                shiyanzi.setVisible(false);
                            }
                        }else{
                            if(canMovema){
                                tmpthis.studentSpeakandAction("wenzi4");
                            }else{
                                if(ismabuac){
                                    tmpthis.studentSpeakandAction("wenzi5");
                                }else{
                                
                                }
                            }

                            return false;
                        }
                    }else if(target.getTag() == 11){
                        if(canwarning)
                            tmpthis.studentSpeakandAction("wenzi3");
                        else{
                            if(canMovema){
                                hand1.setVisible(true)
                                hand2.setVisible(true)
                                hand1.stopAllActions()
                                hand2.stopAllActions()
                                hand1.runAction(cc.sequence(
                                    cc.moveTo(0.1,hand1pos.x+127,hand1pos.y),
                                    cc.callFunc(function(){
                                        isstartM = true
                                    })
                                ))
                                hand2.runAction(cc.sequence(
                                    cc.moveTo(0.1,hand2pos.x+127,hand2pos.y),
                                    cc.callFunc(function(){
                                        isstartM = true
                                    })
                                ))
                            }
                        }
                        if(!ismabuac){
                       
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch, event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                if(target.getTag() == 10){
                    target.x += delta.x;
                    target.y += delta.y;
                }else if(target.getTag() == 11){
                    if(!canwarning){
                       
                        if(isstartM){
                            var tempx = target.x + delta.x
                            var tempy = target.y + delta.y
                            hand1.x = target.x-78;hand2.x = target.x-69;
                            hand1.y = target.y-102;hand2.y = target.y-72;

                            target.x = tempx
                            target.y = tempy
                        }else{
                           target.x += delta.x;
                           target.y += delta.y; 
                        }
                        if(!canMovema){
                            if(ismabuac){
                                var shizhis = ccs.load(res.shizhi).action;
                                shizhis.gotoFrameAndPlay(0,30,false);
                                towelsp.setVisible(false);
                                beinode.runAction(shizhis);
                                ismabuac = false;
                            }
                        }
                    }
                }
            },
            onTouchEnded:function(touch, event){
                var target = event.getCurrentTarget();
                if(target.getTag() == 10){
                    cc.log("uuuuuuu:"+target.x);
                    if(target.x>= 480 && target.x <= 570 && target.y>= 382 && target.y <= 412){
                        shaozi.setVisible(false);
                        shaozi.pause();
                        var shao = ccs.load(res.shaoziac).node;
                        shao.x = shaozi.x+167;shao.y = shaozi.y+54;
                        experionenode.addChild(shao,300);
                        var shaoacc = ccs.load(res.shaoziac).action;
                        shaoacc.gotoFrameAndPlay(21,73,false);
                        shaoacc.setLastFrameCallFunc(function(){
                            var move = new cc.MoveTo(0.2,cc.p(935,290));
                            var call = new cc.CallFunc(function(){
                                var shaoaccc = ccs.load(res.shaoziac).action;
                                shaoaccc.gotoFrameAndPlay(74,83,false);
                                shao.runAction(shaoaccc);
                                shaozi.setPosition(shaozipos);
                                shaozi.resume();
                            });
                            var seq = new cc.Sequence(move,call);
                            shao.runAction(seq);
                            shaoacc.clearLastFrameCallFunc();
                        });
                        shao.runAction(shaoacc);

                        beizi.setVisible(false);
                        beizi.pause();
                        var glassnode = ccs.load(res.glassnode).node;
                        var glassac = ccs.load(res.glassnode).action;
                        glassac.gotoFrameAndPlay(0,84,false);
                        glassac.setLastFrameCallFunc(function(){
                            cc.log("1111111111111");
                            beizi.setVisible(true);
                            beizi.resume();
                            glassnode.setVisible(false);
                            canwarning = false;
                            glassac.clearLastFrameCallFunc();
                        });
                        glassnode.x = 442.8; glassnode.y = 318.5;
                        beizi.getParent().addChild(glassnode);
                        glassnode.runAction(glassac);

                    }else{
                        shaozi.pause();
                        shaozi.scheduleOnce(function(){
                            shaozi.resume();
                            canAction1 = true;
                        },1);
                        target.setPosition(shaozipos);
                        target.scheduleOnce(function(){
                            var shaoziac = ccs.load(res.shaoziac).action;
                            shaoziac.gotoFrameAndPlay(10,20,false);
                            shiyanzi.setVisible(true);
                            shaozisp.runAction(shaoziac);
                        },0.2);
                    }
                    //======================================================
                }else if(target.getTag() == 11){
                    if(!canwarning){
                        if(canMovema){
                            if(target.x>= 130 && target.x <= 300 && target.y>= 422 && target.y <= 512){
                                target.setPosition(261,457.5);
                                bingnode.setVisible(true);
                                canMovema = false;
                                beiying.setVisible(true);
                                beinode.setVisible(true);
                                var bingac = ccs.load(res.bjac).action;
                                bingac.gotoFrameAndPlay(0,30,false);
                                bingnode.runAction(bingac);
                            }else{
                                target.setPosition(beizizipos);
                            }
                            hand1.x = target.x-78;hand2.x = target.x-69;
                            hand1.y = target.y-102;hand2.y = target.y-72;
                            var movec = new cc.MoveTo(0.3,hand1.x-127,hand1.y);
                            var cal = new cc.CallFunc(function(){
                                hand1.setVisible(false);
                            });
                            var  seq = new cc.Sequence(movec,cal);
                            hand1.runAction(seq);


                            var movec2 = new cc.MoveTo(0.3,hand2.x-127,hand2.y);
                            var cal1 = new cc.CallFunc(function(){
                                hand2.setVisible(false);
                            });
                            var  seq1 = new cc.Sequence(movec2,cal1);
                            hand2.runAction(seq1);

                        }else{

                            if(!ismabuac){
                                towelsp.setVisible(true);
                                beinode.setVisible(false);
                                tipspnode.setVisible(true);
                                tmpthis.studentSpeakandAction("wenzi6");
                            }
                            target.setPosition(261,457.5);
                            hand1.x = target.x-78;hand2.x = target.x-69;
                            hand1.y = target.y-102;hand2.y = target.y-72;

                            var movec = new cc.MoveTo(0.3,hand1.x-127,hand1.y);
                            var cal = new cc.CallFunc(function(){
                                hand1.setVisible(false);
                            });
                            var  seq = new cc.Sequence(movec,cal);
                            hand2.runAction(seq);

                            var movec2 = new cc.MoveTo(0.3,hand2.x-127,hand2.y);
                            var cal1 = new cc.CallFunc(function(){
                                hand2.setVisible(false);
                            });
                            var  seq1 = new cc.Sequence(movec2,cal1);
                            hand2.runAction(seq1);
                        }
                    }
                }
            }
        });
        cc.eventManager.addListener(touchListener,shaozi);
        cc.eventManager.addListener(touchListener.clone(),beizi);
    },
    studentSpeakandAction:function(keyname){
        this.nodebs.say({
            key: keyname
        })
    },
    myEnter: function(){
        this._super()
        var self = this
        this.nodebs.show(function() {
           self.studentSpeakandAction("wenzi3")
        })
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.xianba,
            img:res.wenzi3
        })

        addContent({
            people: this.nodebs,
            key: "wenzi4",
            sound: res.yanyi,
            img:res.wenzi4
        })

        addContent({
            people: this.nodebs,
            key: "wenzi5",
            sound: res.naqi,
            img:res.wenzi5,
        })

        addContent({
            people: this.nodebs,
            key: "wenzi6",
            sound: res.beiziwai,
        })

    }
    
})