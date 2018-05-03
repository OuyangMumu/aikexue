
var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){

        });
        this.expCtor()
        this.initUI()
        this.initPeople()

        return true;
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key:"wenzi1",
                    force:true
                })
            })
        }
    },
    initUI:function(){

       var seeexperione = ccs.load(res.see1).node;
        this.addChild(seeexperione);
        var first_mo = true;
        var first_wen = true;
        var canwen = true;
        var canmo = true;
        var tmpthis = this;

        ////deffer
        var shuibei = seeexperione.getChildByName("shuibei");
        var initshuibeiPos = shuibei.getPosition();
        var mobtn = seeexperione.getChildByName("mobtn");
        var wenbtn = seeexperione.getChildByName("wenbtn");
        var jielunbtn = seeexperione.getChildByName("jielunbtn");
        var wenwen = seeexperione.getChildByName("wennode");
        var wusesp = seeexperione.getChildByName("wentip");
        var shousp = seeexperione.getChildByName("shou");
        var motip = seeexperione.getChildByName("motip");
        var daonode = seeexperione.getChildByName("daoshuinode");
        var ronghua = ccs.load(res.daoshuiac).action;
        ronghua.gotoFrameAndPlay(0,184,false);
        daonode.runAction(ronghua);
        ronghua.pause();
        seeexperione.scheduleOnce(function(){
            if(mobtn.isVisible()){
                tmpthis.peopleSpeakandAction("wenzi2");
                canmo = false ;
            }
        },18);

        mobtn.addClickEventListener(function(){
            seeexperione.unscheduleAllCallbacks();
            motip.setVisible(false);
            shousp.removeAllChildren();
            wusesp.setVisible(false);
            wenwen.removeAllChildren();
            var sp = new cc.Sprite(res.shousp);
            shousp.addChild(sp);
            sp.runAction(cc.moveTo(0.5,cc.p(-250,-218)));
            sp.scheduleOnce(function(){
                sp.runAction(cc.repeatForever(cc.sequence(
                    cc.moveTo(0.4,cc.p(-300,-218)),
                    cc.moveTo(0.4,cc.p(-230,-218))
                )));
            },0.5);
            sp.scheduleOnce(function(){
                motip.setVisible(true);
            },1);
            sp.scheduleOnce(function(){
                motip.setVisible(false);
                shousp.removeAllChildren();
                if(first_mo){
                    if(canwen){
                        if(wenbtn.isVisible()){
                            tmpthis.peopleSpeakandAction("wenzi3");
                            canwen = false;
                            canmo = false;
                        }
                    }else{
                        if(mobtn.isVisible())
                          tmpthis.peopleSpeakandAction("wenzi4");
                    }
                }
            },5);
        });

        wenbtn.addClickEventListener(function(sender,type){
            seeexperione.unscheduleAllCallbacks();
            wenwen.removeAllChildren();
            motip.setVisible(false);
            shousp.removeAllChildren();
            var wennode = ccs.load(res.wenac).node;
            var wenac = ccs.load(res.wenac).action;
            wenwen.addChild(wennode);
            wenac.gotoFrameAndPlay(0, 12, true);
            wennode.runAction(wenac);
            wennode.scheduleOnce(function(){
                wusesp.setVisible(true);
            },2);
            wennode.scheduleOnce(function(){
                wennode.removeFromParent();
                wusesp.setVisible(false);
                if(first_wen){
                    if(canmo){
                        if(wenbtn.isVisible()){
                            tmpthis.peopleSpeakandAction("wenzi2");
                            canmo = false;
                            canwen = false;
                        }
                    }else{
                        if(mobtn.isVisible())
                        tmpthis.peopleSpeakandAction("wenzi4");
                    }
                    first_wen = false;
                }
            },5);
        });

        jielunbtn.addClickEventListener(function(){
            tmpthis.peopleSpeakandAction("wenzi6");
        });

        var spListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch, event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;
                if(target.x > daonode.x-50){
                   target.pause();
                    target.removeFromParent();
                    mobtn.setVisible(false)
                    mobtn.removeFromParent();
                    wenbtn.removeFromParent();
                    ronghua.resume();
                }
            },
            onTouchEnded:function(touch, event){
                var target = event.getCurrentTarget();
                if(target.x < daonode.x-50){
                    target.setPosition(initshuibeiPos);
                }
            }
        });
        cc.eventManager.addListener(spListener,shuibei);
    },
    peopleSpeakandAction:function(keyname){
        this.nodebs.say({
            key: keyname
        })
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.zi1mp,
            img:res.wenzi1
        })

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zi2mp,
            img:res.wenzi2
        })
        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.zi3mp,
            img:res.wenzi3
        })
        addContent({
            people: this.nodebs,
            key: "wenzi4",
            sound: res.zi4mp,
            img:res.wenzi4
        })
        addContent({
            people: this.nodebs,
            key: "wenzi5",
            sound: res.zi5mp,
            img:res.wenzi5
        })

        addContent({
            people: this.nodebs,
            key: "wenzi6",
            img:res.jielun,
            id:"result",
            sound: res.jielunmp,
            offset: cc.p(70, 40),
            offbg: cc.p(50,50),
        })
    }
})

