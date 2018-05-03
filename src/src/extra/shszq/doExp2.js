//@author mu @16/5/11

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function(){
        });
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
    
        
        return true
    },
    initUI: function(){

        var tmpthis = this;
        var experitwonode = ccs.load(res.do2).node;
        this.addChild(experitwonode);
        
        //deffer
        var xianxiangbtn = experitwonode.getChildByName("xianxiangbtn");
        var xiaoshuizhu = experitwonode.getChildByName("xiaoshuizhu");
        var xiaoshuizhuOpacity = 1;
        var coldbolisp = experitwonode.getChildByName("coldbolisp");
        coldbolisp.setTag(10);
        var coldbolisp_pos = coldbolisp.getPosition();
        var hotbolisp = experitwonode.getChildByName("hotbolisp");
        var hotbolisp_pos = hotbolisp.getPosition();
        hotbolisp.setTag(11);

        var hotnode = ccs.load(res.hotac).node;
        var hotac = ccs.load(res.hotac).action;
        hotnode.x = 560;hotnode.y = 315;
        experitwonode.addChild(hotnode);
        hotac.gotoFrameAndPlay(0, 450, true);
        hotnode.runAction(hotac);

        var isShowtip = false;
        xianxiangbtn.addClickEventListener(function(){
               tmpthis.nodebs.say({
                    key: "jielun1",
                })
        });

        var isTobegan1 = true;
        var isTobegan2 = true;
        var hotsp1 = hotnode.getChildByName("Sprite_20");
        var hotsp2 = hotnode.getChildByName("Sprite_22");
        var touchListener = cc.EventListener.create({
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
                if(target.getTag() == 10){
                    if(target.x>=440 && target.x<=475 && target.y>=360 && target.y<=425){
                        target.setPosition(cc.p(464,392));
                        target.pause();
                        hotsp1.setVisible(false);
                        xiaoshuizhu.schedule(function(){
                            xiaoshuizhuOpacity++;
                            xiaoshuizhu.setOpacity(xiaoshuizhuOpacity*20);
                            if(xiaoshuizhuOpacity>5)
                                isShowtip = true;
                            if(xiaoshuizhuOpacity>10)
                                xiaoshuizhu.unscheduleAllCallbacks();

                        },0.5);
                        isTobegan1 = false;
                    }
                }else if(target.getTag() == 11){
                    if(target.x>=640 && target.x<=700 && target.y>=360 && target.y<=425){
                        target.setPosition(cc.p(658,392));
                        target.pause();
                        hotsp2.setVisible(false);
                        isTobegan2 = false;
                    }
                }
            },
            onTouchEnded:function(touch, event){
                var target = event.getCurrentTarget();
                if(target.getTag() == 10 && isTobegan1){
                    target.setPosition(coldbolisp_pos);
                }else if(target.getTag() == 11 && isTobegan2){
                    target.setPosition(hotbolisp_pos);
                }
            },
        });
        cc.eventManager.addListener(touchListener,coldbolisp);
        cc.eventManager.addListener(touchListener.clone(),hotbolisp);
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi6",
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
        this.addChild(this.nodebs,1000);

        addContent({
            people: this.nodebs,
            key: "wenzi6",
            sound: res.zi6mp,
            img:res.wenzi6
        })
        addContent({
            people: this.nodebs,
            key: "jielun1",
            img:res.jielun1,
            id:"result",
            sound: res.jielunmp1,
            offset: cc.p(50, 40),
            offbg: cc.p(30,50),
        })
    }
    
})