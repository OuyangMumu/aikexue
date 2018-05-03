//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    countshuidi:null,
    ctor: function() { //创建时调用 未删除不会重复调用
        var self = this
        this.load(function() { 
        });
        this._super()
        this.expCtor({
            vis: false,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if (!self.bgnode.bgg) {
                        var colors = []
                        for (var k = 0; k <= 10; k++)
                            colors.push(cc.color(255, 0, 0))
                        var bg = createBiaoge({
                            json: res.biaoge,
                            inputNum: 4,
                            isShowResult: true,
                            scale: 0.9,
                            rootColor:colors
                        })
                        cc.log("1111111111")
                        self.bgnode.addChild(bg)
                        self.bgnode.bgg = bg
                    }
                    var bg = self.bgnode.bgg
                    bg.show()
                }
            }
        })
        this.initUI()
        this.initPeople()
        
        return true
    },
    initUI: function(){

        var tmpthis = this;
        var experionenode = ccs.load(res.do1).node;
        this.addChild(experionenode);

        //deffer
        var shaozione = experionenode.getChildByName("shaozione");
        shaozione.setTag(20);
        var shaozitwo = experionenode.getChildByName("shaozitwo");
        shaozitwo.setTag(21);
        var digai = experionenode.getChildByName("digai");
        digai.setTag(22);
        var digaipos = digai.getPosition();
        var huogen = experionenode.getChildByName("huogen");
        huogen.setTag(23);
        var huogenpos = huogen.getPosition();
        var denggai = experionenode.getChildByName("denggai");
        denggai.setTag(24);
        var denggaipos = denggai.getPosition();
        var huodi = huogen.getChildByName("huodi");
        huodi.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.6,1,0.8),
                cc.scaleTo(0.6,1,1)
            )));
        var huoyan = experionenode.getChildByName("huoyan");
        huoyan.used = true
        var di = experionenode.getChildByName("di");
        var beizi = experionenode.getChildByName("beizi");


        var isHavewater = true;
        var isHavewater1 = true;
        var isCanmove = true;
        var isDiVisible = true;

        var touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(target.getTag() == 22){
                        di.setVisible(false);
                        var diguannode = ccs.load(res.diguanac).node;
                        var diguanac = ccs.load(res.diguanac).action;
                        diguannode.x = -50.24;
                        diguannode.y = 26.78;
                        beizi.setLocalZOrder(3);
                        digai.setLocalZOrder(2);
                        digai.addChild(diguannode);
                        diguanac.gotoFrameAndPlay(0, 34, false);
                        diguanac.setLastFrameCallFunc(function(){
                            diguannode.x = -48;
                            diguannode.y = -91;
                            beizi.setLocalZOrder(1);
                            diguanac.clearLastFrameCallFunc();
                        });
                        diguannode.runAction(diguanac);
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch, event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;
                if(target.getTag() == 22){
                    if(target.x >= shaozione.x -20 && target.x <= shaozione.x + 60 && target.y >= shaozione.y+ 160 && isHavewater) {
                        target.setPosition(digaipos);
                        target.removeAllChildren();
                        tmpthis.countshuidi++;
                        tmpthis.createDishuiNode(shaozione,di,beizi);
                        isHavewater = false;
                        isDiVisible = false;
                    }

                    if(target.x >= shaozitwo.x -20 && target.x <= shaozitwo.x + 60 && target.y >= shaozitwo.y + 160 && isHavewater1) {
                        target.setPosition(digaipos);
                        target.removeAllChildren();
                        tmpthis.countshuidi++;
                        tmpthis.createDishuiNode(shaozitwo,di,beizi);
                        isHavewater1 = false;
                        isDiVisible = false;
                    }
                }else if(target.getTag() == 23){
                    if(target.x >= huogenpos.x+5){
                        target.x = huogenpos.x+5;
                    }
                    if(target.x <= huogenpos.x-100){
                        target.setVisible(false);
                        target.pause();
                        target.setPosition(huogenpos);
                        huoyan.setVisible(true);
                        huoyan.resume();
                        huoyan.runAction(cc.repeatForever(
                            cc.sequence(
                                cc.scaleTo(0.2,1,0.7),
                                cc.scaleTo(0.2,1,1)
                            )));
                    }
                    if(target.y >= huogenpos.y+5){
                        target.y = huogenpos.y+5;
                    }
                    if(target.y <= huogenpos.y-5){
                        target.y = huogenpos.y-5;
                    }
                }else if(target.getTag() == 24){
                    if(target.x >= denggaipos.x+2 && isCanmove)
                        target.x = denggaipos.x+2;

                    if(target.x <= denggaipos.x-2 && isCanmove)
                        target.x = denggaipos.x-2;

                    if(target.y <= denggaipos.y && isCanmove)
                        target.y = denggaipos.y;

                    if(target.y >= denggaipos.y+55){
                        target.y = denggaipos.y+56;
                        isCanmove = false;
                    }
                    if(target.y<=denggaipos.y+50) {
                        if(target.x >= denggaipos.x-10 && target.x <= denggaipos.x+10)
                                       isCanmove =true;
                    }
                }else if(target.getTag() == 20 || target.getTag() == 21){
                    if(tools.checkdistans(target,huoyan.getPosition(),50)){
                        var shudi = target.getChildByName("shuidi");
                        if(huoyan.isVisible() && shudi.isVisible()){
                            if(huoyan.used){
                                huoyan.used = false
                                target.setPosition(cc.p(huoyan.getPositionX(),huoyan.getPositionY()+ 45));
                                target.pause();
                                tmpthis.createZhenfa(shudi,huoyan);
                            }
                        }
                    }
                }
            },
            onTouchEnded:function(touch, event){
                var target = event.getCurrentTarget();
                if(target.getTag()==22){
                    if(isDiVisible)
                        di.setVisible(true);
                    isDiVisible = true;
                    target.setPosition(digaipos);
                    target.removeAllChildren();
                }else if(target.getTag()==24){
                    if(target.x <= denggaipos.x-60){
                        target.x = 596;
                        target.y = 50;
                        huogen.setVisible(true);
                        huogen.resume();
                    }else if(target.x >= denggaipos.x+60){
                        target.x = 840;
                        target.y = 50;
                        if(!huoyan.isVisible()){
                            huogen.setVisible(true);
                            huogen.resume();
                        }
                    }else{
                        target.x = denggaipos.x;
                        target.y = denggaipos.y;
                        isCanmove = true;
                        huoyan.pause();
                        if(huoyan.isVisible()){
                            target.setVisible(false);
                            var denggainode = ccs.load(res.denggai).node;
                            var denggaiac = ccs.load(res.denggai).action;
                            denggainode.x = denggaipos.x;
                            denggainode.y = denggaipos.y;
                            experionenode.addChild(denggainode);
                            denggaiac.gotoFrameAndPlay(0, 69, false);
                            denggainode.runAction(denggaiac);
                            denggaiac.setLastFrameCallFunc(function(){
                                target.setVisible(true);
                                denggainode.removeFromParent();
                            });
                        }
                        huogen.pause();
                        huoyan.setVisible(false);
                        huogen.setVisible(false);
                    }
                }
            },
        });
        cc.eventManager.addListener(touchListener,shaozione);
        cc.eventManager.addListener(touchListener.clone(),shaozitwo);
        cc.eventManager.addListener(touchListener.clone(),digai);
        cc.eventManager.addListener(touchListener.clone(),huogen);
        cc.eventManager.addListener(touchListener.clone(),denggai);
      
    },
    createZhenfa:function(rootnode,huoyannode){
        var tmpthis = this;
        var shuinode = ccs.load(res.shuiqiac).node;
        var shuiac = ccs.load(res.shuiqiac).action;
        shuinode.x = rootnode.x-5;
        shuinode.y = rootnode.y+10;
        rootnode.getParent().addChild(shuinode);
        shuiac.gotoFrameAndPlay(0, 60, true);
        shuinode.runAction(shuiac);
        this.createYanwu(rootnode);
        rootnode.scheduleOnce(function(){
            shuinode.removeFromParent();
            var shuinode1 = ccs.load(res.shuiqiac).node;
            var shuiac1 = ccs.load(res.shuiqiac).action;
            shuinode1.x = rootnode.x-5;
            shuinode1.y = rootnode.y+10;
            rootnode.getParent().addChild(shuinode1);
            shuiac1.gotoFrameAndPlay(60, 128, true);
            shuinode1.runAction(shuiac1);
        },4);

        rootnode.runAction(cc.sequence(
            cc.scaleTo(25,0),
            cc.callFunc(function(){
                rootnode.getParent().scheduleOnce(function(){
                    if(huoyannode.isVisible() && huoyannode.used)
                        dialogControl.AddDialog("Tips", {
                            res: res.tip1,
                            modify: cc.p(30, 0),
                            face: 2,
                            scale: 1,
                            father: tmpthis
                        });
                },5);
                huoyannode.used = true
                if(rootnode.getParent().getTag()==20)
                    rootnode.getParent().setPosition(353,360);
                else
                    rootnode.getParent().setPosition(648,360);
                rootnode.getParent().removeAllChildren();
            })
        ));
    },
    createYanwu:function(rootnode){
        var smoke = createWaterAir({
            total: 40,
            width: 30,
            height: 10,
            res: res.img_smoke,
        })
        smoke.setScale(0.5)
        smoke.x = rootnode.x ;smoke.y =rootnode.y;
        rootnode.getParent().addChild(smoke);
    },
    createDishuiNode:function(rootnode,dinode,beizinode){
        var tmpthis = this;
        var dishuinode = ccs.load(res.dishuiac).node;
        var dishuiac = ccs.load(res.dishuiac).action;
        dishuinode.x = rootnode.x - 73;
        dishuinode.y = rootnode.y + 148;
        rootnode.pause();
        rootnode.getParent().addChild(dishuinode);
        dishuiac.gotoFrameAndPlay(0, 118, false);
        dishuiac.setLastFrameCallFunc(function(){
            rootnode.resume();
            dinode.setVisible(true);
            cc.log("rrrrrr::",tmpthis.countshuidi);
            if(tmpthis.countshuidi>=2){
                beizinode.setVisible(false);
                dinode.setVisible(false);
                tmpthis.nodebs.say({
                    key: "wenzi5",
                    force:true
                })
            }
            rootnode.getChildByName("shuidi").setVisible(true);
            dishuinode.removeFromParent();
            dishuiac.clearLastFrameCallFunc();
        });
        dishuinode.runAction(dishuiac);
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi3",
                    force:true
                })
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,200);
        this.bgnode = new cc.Node()
        this.addChild(this.bgnode,300)

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.zi3mp,
            img:res.wenzi3
        })
        addContent({
            people: this.nodebs,
            key: "wenzi5",
            sound: res.zi5mp,
            img:res.wenzi5
        })
        
    } 
})