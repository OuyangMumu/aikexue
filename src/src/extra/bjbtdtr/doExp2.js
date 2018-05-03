/**
 * Created by Administrator on 2016/7/22.
 */
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({})
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI: function () {
        var self = this
        var tmpThis = this
        var node = loadNode(res.bjbtdtr_do2_json)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"do2_tip1"})
        })
        var doLayer2 = node
        var ss = doLayer2.getChildByName("ss");
        var ssNode = doLayer2.getChildByName("ssNode");
        var stNode = doLayer2.getChildByName("stNode");
        var ntNode = doLayer2.getChildByName("ntNode");
        var rtNode = doLayer2.getChildByName("rtNode");
        var dayNode = doLayer2.getChildByName("dayNode");
        this.pheBtn = doLayer2.getChildByName("phebtn");

        self.stFlag = true
        self.ntFlag = true
        self.rtFlag = true
        ss.setTag(30);
        this.pheBtn.addClickEventListener(function(){
            self.nodebs.say({key:"do2_faxian"})
        })
        var touchListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan:function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;
                if(target.getTag() == 30 && ss.isVisible()){
                    if(tmpThis.checkPoint(target,stNode) && tmpThis.stFlag){
                        ssNode.setPosition(cc.p(280,430));
                        tmpThis.ssAni(ssNode,ss,dayNode,stNode,ntNode,rtNode);
                        tmpThis.stFlag = false;
                    }
                    if(tmpThis.checkPoint(target,ntNode) && tmpThis.ntFlag){
                        ssNode.setPosition(cc.p(530,430));
                        tmpThis.ssAni(ssNode,ss,dayNode,stNode,ntNode,rtNode);
                        tmpThis.ntFlag = false;
                    }
                    if(tmpThis.checkPoint(target,rtNode) && tmpThis.rtFlag){
                        ssNode.setPosition(cc.p(780,430));
                        tmpThis.ssAni(ssNode,ss,dayNode,stNode,ntNode,rtNode);
                        tmpThis.rtFlag = false;
                    }
                }
            },
            onTouchEnded:function(touch,event){
            }
        });
        cc.eventManager.addListener(touchListener,ss);
    },

    growAni:function(name,node){
        var psp = ccs.load(name).node;
        var pac = ccs.load(name).action;
        node.addChild(psp);
        pac.gotoFrameAndPlay(0,50,false);
        psp.runAction(pac);
    },

    ssAni:function(ssNode,ss,dayNode,stNode,ntNode,rtNode){
        var tmpThis = this;
        ss.setVisible(false);
        var psp = ccs.load(res.bjbtdtr_ssAni).node;
        var pac = ccs.load(res.bjbtdtr_ssAni).action;
        ssNode.addChild(psp);
        pac.gotoFrameAndPlay(0,180,false);
        pac.setLastFrameCallFunc(function(){
            ssNode.removeAllChildren();
            ss.setPosition(cc.p(ssNode));
            ss.setVisible(true);
            if(!tmpThis.stFlag && !tmpThis.ntFlag && !tmpThis.rtFlag){
                ss.removeFromParent();
                tmpThis.fewDayAni(dayNode);
                tmpThis.growAni(res.bjbtdtr_stGrowAni,stNode);
                tmpThis.growAni(res.bjbtdtr_sntGrowAni,ntNode);
                tmpThis.growAni(res.bjbtdtr_srtGrowAni,rtNode);
                tmpThis.nodebs.say({key:"do2_tip2",force:true})
            }
        });
        psp.runAction(pac);
    },

    fewDayAni:function(dayNode){
        var tmpThis = this;
        var psp = ccs.load(res.bjbtdtr_sfewDayAni).node;
        var pac = ccs.load(res.bjbtdtr_sfewDayAni).action;
        dayNode.addChild(psp);
        pac.gotoFrameAndPlay(0,100,false);
        pac.setLastFrameCallFunc(function(){
            dayNode.removeAllChildren();
            tmpThis.pheBtn.setVisible(true);
        });
        psp.runAction(pac);
    },

    checkPoint:function(target1,target2){
        var dy = target2.y - 100;
        var dy2 = target2.y + 100;
        var dx = target2.x + 50;
        var dx2 = target2.x - 50;
        if(target1.y > dy && target1.y < dy2 && target1.x > dx2 && target1.x < dx)
            return true;
        return false;
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,99)

        addContent({
            people: this.nodebs,
            key: "do2_tip1",
            img: res.do2_tip1,
            sound: res.do2_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "do2_tip2",
            img: res.do2_tip2,
            sound: res.do2_sound2,
        })
        addContent({
            people: this.nodebs,
            key: "do2_faxian",
            img: res.do2_faxian,
            sound: res.do2_faxian_sound,
            id:"result",
        })
    },
})