/**
 * Created by Administrator on 2016/7/22.
 */
var setTouch = 100
var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI: function () {
        var self = this
        var node = loadNode(res.bjbtdtr_see1_json)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"see1_tip1"})
        })
        var seelayer = node
        var parBtn = seelayer.getChildByName("parbtn");
        var partic = seelayer.getChildByName("partic");
        var closeBtn = partic.getChildByName("closebtn");
        var pheBtn = seelayer.getChildByName("phebtn");
        var phe = seelayer.getChildByName("fx");
        var pheCloseBtn = phe.getChildByName("fxbtn");
        var soilAy = [];
        var sAy = [];

        for(var i = 1;i<=3;i++){
            var soilName = "soil"+i;
            var soil = seelayer.getChildByName(soilName);
            soil.setTag(i);
            soilAy.push(soil);
            var sName = "s"+i;
            var s = seelayer.getChildByName(sName);
            sAy.push(s);
        }

        partic.setPositionY(-600)
        self.getListener(partic)
        var parFlag = true;
        parBtn.addClickEventListener(function(){
            if(parFlag) {
                var c1 = new cc.CallFunc(function () {
                    partic.setPosition(568,320)
                    safeAdd(self,partic)
                    partic.setScale(0);
                    partic.setVisible(true);
                });
                var c2 = new cc.CallFunc(function () {
                    partic.runAction(cc.scaleTo(0.2, 0.8));
                });
                var seq = new cc.Sequence(c1, c2);
                self.runAction(seq);
                partic.setLocalZOrder(phe.getLocalZOrder()+1)
                parFlag = false;
            }
            else {
                var c1 = new cc.CallFunc(function () {
                    partic.runAction(cc.scaleTo(0.2, 0));
                });
                var c2 = new cc.CallFunc(function () {
                    partic.setVisible(false);
                    partic.setPositionY(-800)
                });
                var del = new cc.DelayTime(0.2);
                var seq = new cc.Sequence(c1, del, c2);
                self.runAction(seq);
                parFlag = true;
            }
        });

        closeBtn.addClickEventListener(function(){
            var c1 = new cc.CallFunc(function () {
                partic.runAction(cc.scaleTo(0.2,0));
            });
            var c2 = new cc.CallFunc(function () {
                partic.setVisible(false);
                partic.setPositionY(-800)
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(c1,del,c2);
            self.runAction(seq);
            parFlag = true;
        });
        phe.setScale(0);
        phe.setPositionY(-400);
        self.getListener(phe);
        var pheFlag = true;
        pheBtn.addClickEventListener(function(){
            if(pheBtn.isVisible()) {
                if (pheFlag) {
                    var c1 = new cc.CallFunc(function () {
                        safeAdd(self,phe)
                        phe.setVisible(true);
                    });
                    var c2 = new cc.CallFunc(function () {
                        phe.runAction(cc.scaleTo(0.2, 1));
                        phe.setPosition(cc.p(568,320));
                    });
                    var seq = new cc.Sequence(c1, c2);
                    self.runAction(seq);
                    pheFlag = false;
                    phe.setLocalZOrder(partic.getLocalZOrder()+1)
                    self.nodebs.stopSay()
                    self.nodebs.say({key:"see1_faxian"})
                } else {
                    if(!phe.isVisible())  return;
                    var call = new cc.CallFunc(function(){
                        phe.runAction(cc.scaleTo(0.2,0,0));
                    });
                    var call2 = new cc.CallFunc(function(){
                        phe.setPositionY(-400);
                        phe.setVisible(false);
                        pheFlag = true;
                    });
                    var del = new cc.DelayTime(0.2);
                    var seq = new cc.Sequence(call,del,call2);
                    self.runAction(seq);
                    self.nodebs.stopSay()
                }
            }
        });
        pheCloseBtn.addClickEventListener(function(){
            if(!phe.isVisible())  return;
            var call = new cc.CallFunc(function(){
                phe.runAction(cc.scaleTo(0.2,0,0));
            });
            var call2 = new cc.CallFunc(function(){
                phe.setVisible(false);
                phe.setPositionY(-400);
                pheFlag = true;
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(call,del,call2);
            self.runAction(seq);
            self.nodebs.stopSay()
        });

        var f1 = 0;var f2 = 0;var f3 = 0;var fAy = [f1,f2,f3];
        var tag = 0
        var touchListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan:function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);

                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(self.checkDistanceWithPoint(target,touch.getLocation())){
                        if(target.getTag() != tag){
                            if(tag == 0) tag = 3
                            sAy[tag-1].setVisible(false);
                            sAy[target.getTag()-1].setVisible(true);
                            tag = target.getTag()
                        }
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();

            },
            onTouchEnded:function(touch,event){
                for(var i = 0;i<3;i++){
                    if(sAy[i].isVisible()){
                        fAy[i]++;
                    }
                }
                if(fAy[0]>0 && fAy[1]>0 && fAy[2]>0)
                    pheBtn.setVisible(true);

            }
        });
        cc.eventManager.addListener(touchListener,soilAy[0]);
        cc.eventManager.addListener(touchListener.clone(),soilAy[1]);
        cc.eventManager.addListener(touchListener.clone(),soilAy[2]);
    },

    checkDistanceWithPoint:function(target1,target2){
        var dy = target1.y - target2.y;
        var dx = target1.x - target2.x;
        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
        if(distance < 45){
            return true;
        }
        return false;
    },

    getListener : function(sprite){
        var Listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if(cc.rectContainsPoint(rect,locationInNode)) {
                    sprite.setLocalZOrder(setTouch)
                    setTouch = setTouch+1
                    return true;
                }
                return false
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                sprite.x += delta.x;
                sprite.y += delta.y;

            },
            onTouchEnded:function(touch,event){}
        });
        cc.eventManager.addListener(Listener,sprite);
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,99)

        addContent({
            people: this.nodebs,
            key: "see1_tip1",
            img: res.see1_tip1,
            sound: res.see1_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "see1_faxian",
            sound: res.see1_faxian,
        })
    },
})