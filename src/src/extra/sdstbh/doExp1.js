//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        });
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()

        return true
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                // self.nodebs.say({
                //     key: "zi5",
                //     force:true
                // })
            })
        }
    },
    initUI:function(){

        var experionenode = ccs.load(res.do1).node;
        this.addChild(experionenode);

        var tmpthis = this
        var tiptxt = experionenode.getChildByName("tipText");
        var ronghuanode = experionenode.getChildByName("ronghua");
        var ronghua = ccs.load(res.ronghua).action;
        ronghua.gotoFrameAndPlay(0,383,false);
        ronghua.setLastFrameCallFunc(function(){
            isCanWarning = false;
            tmpthis.studentSpeakandAction("shuibian");
            tmpthis.scheduleOnce(function(){
                isCanWarning = true;
            },7);
            tiptxt.setVisible(true);
            ronghua.clearLastFrameCallFunc();
        });
        ronghuanode.runAction(ronghua);
        ronghua.pause();

        var shuiqinode = experionenode.getChildByName("shuiqinode");
        shuiqinode.setVisible(false);
        var smoke = createWaterAir({
            total: 40,
            width: 30,
            height: 10,
            rotatevar:-50,
            res: res.img_smoke,
        })
        smoke.setPosition(-10,-5)
        shuiqinode.addChild(smoke);

        var smoke1 = createWaterAir({
            total: 40,
            width: 30,
            height: 10,
            rotatevar:-60,
            res: res.img_smoke,
        })
        smoke1.setPosition(10,-5)
        shuiqinode.addChild(smoke1);

        var isCanWarning = true;
        var isfirst = true;
        var iscanScal = true;
        var ismoveScal = true;

        shuiqinode.schedule(function(dt){
            if(ronghua.getCurrentFrame() >= 191 && ronghua.getCurrentFrame() < 383){
                if(iscanScal && ismoveScal){
                    var scal = cc.scaleTo(2,1.5);
                    smoke.runAction(scal);
                    smoke1.runAction(scal.clone());
                }
                shuiqinode.setVisible(true);
            }else if(ronghua.getCurrentFrame() == 383){
                if(isfirst){
                    isfirst = false;
                    shuiqinode.runAction(cc.sequence(cc.scaleTo(2,0.2),cc.callFunc(function(){
                        shuiqinode.setVisible(false);
                    })));
                }
            }
        },0.1);

        var fengjinode = experionenode.getChildByName("feng");
        var pointXY = fengjinode.getPosition();
        var chuifengji = fengjinode.getChildByName("chuifengji");
        var chuifengjib = fengjinode.getChildByName("chuifengjib");
        var onbtn = fengjinode.getChildByName("close_6");

        var chuisp = experionenode.getChildByName("chuiAc");
        var chuispPos = chuisp.getPosition();
        var chuifengjisp = chuisp.getChildByName("chuifengjisp");
        var offbtn = chuisp.getChildByName("on_5");
        chuifengjisp.setTag(12);
        offbtn.setTag(13);
        onbtn.setTag(10);


        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    //tipsp.target = target
                    if(target.getTag() ==10 ){
                        chuisp.setVisible(true);
                        fengjinode.setPosition(chuisp.getPosition());
                        chuisp.setPosition(pointXY);
                        var  chuiAc = ccs.load(res.chuiac).action;
                        chuiAc.gotoFrameAndPlay(0,8,false);
                        var  fengac = ccs.load(res.fengac).action;
                        fengac.gotoFrameAndPlay(0,2,true);
                        chuisp.runAction(chuiAc);
                        chuisp.runAction(fengac);
                    }else if(target.getTag() ==12){
                        iscanScal = true;
                    }else if(target.getTag() ==13){
                        cc.log("13333333333");
                        var  chuiAcc = ccs.load(res.chuiac).action;
                        chuiAcc.gotoFrameAndPlay(13,20,false);
                        target.pause();
                        chuiAcc.setLastFrameCallFunc(function(){
                            chuisp.setPosition(chuispPos);
                            fengjinode.setPosition(pointXY);
                            target.resume();
                        });
                        chuisp.runAction(chuiAcc);
                    }else {
                        if(tiptxt.isVisible()){
                           // tmpthis.nodeAction(tipsp,3,360,1,3);
                            onbtn.pause();
                        }else{
                            tmpthis.studentSpeakandAction("onbtn");
                        }
                    }

                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch, event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                if(target.getTag()==12){
                    offbtn.setVisible(false);
                    target.x += delta.x;
                    target.y += delta.y;

                    if(target.x>= -410 && target.x<=-245 && target.y>=80 && target.y<=160){
                        ronghua.resume();
                        ismoveScal = true;
                    }else{
                        ronghua.pause();
                        if(ismoveScal){
                            var scald = cc.scaleTo(2,0);
                            smoke.runAction(scald);
                            smoke1.runAction(scald.clone());
                            ismoveScal = false;
                        }

                    }
                }
            },
            onTouchEnded:function(touch, event){
                var targ = event.getCurrentTarget();
                if(targ.getTag()==12){
                    ronghua.pause();
                    iscanScal = false;
                    var scal = cc.scaleTo(2,0);
                    smoke.runAction(scal);
                    smoke1.runAction(scal.clone());
                    offbtn.setVisible(true);
                    chuifengjisp.setPosition(0,0);
                    if(isCanWarning)
                        tmpthis.studentSpeakandAction("offbtn");
                }
            }
        });
        cc.eventManager.addListener(touchListener,chuifengji);
        cc.eventManager.addListener(touchListener.clone(),chuifengjib);
        cc.eventManager.addListener(touchListener.clone(),onbtn);
        cc.eventManager.addListener(touchListener.clone(),offbtn);
        cc.eventManager.addListener(touchListener.clone(),chuifengjisp);
        
    },
    studentSpeakandAction:function(keyname){
        this.nodebs.say({
            key: keyname
        })
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,300);

        addContent({
            people: this.nodebs,
            key: "shuibian",
            sound: res.zi2mp,
        })
        addContent({
            people: this.nodebs,
            key: "onbtn",
            sound: res.zi3mp,
            img:res.wenzi1,
        })
        addContent({
            people: this.nodebs,
            key: "offbtn",
            sound: res.zi4mp,
            img:res.wenzi2
        })
        
    }
})