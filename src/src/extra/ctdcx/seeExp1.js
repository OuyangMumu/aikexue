
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
                    key:"tishi",
                    force:true
                })
            })
        }
    },
    initUI:function(){
        self = this;
        var seenode2 = ccs.load(res.see1).node;
        this.addChild(seenode2);

        this.boshiNode = seenode2.getChildByName("boshi");

        var muwuspnode = seenode2.getChildByName("muwu");
        var muwusp = muwuspnode.getChildByName("Sprite_2");
        muwusp.setTag(101);

        var yiyuanspnode = seenode2.getChildByName("yiwu");
        var yiyuansp = yiyuanspnode.getChildByName("Sprite_4");
        yiyuansp.setTag(102);

        var tongspnode = seenode2.getChildByName("tongwu");
        var tongsp = tongspnode.getChildByName("Sprite_3");
        tongsp.setTag(103);

        var spPosx=[220,350,538];
        var spPosy=[335,250,293];
        var resetnum = Math.floor(Math.random()*3)
        yiyuanspnode.x = spPosx[resetnum];yiyuanspnode.y = spPosy[resetnum];
        if(resetnum == 0){
            tongspnode.x = spPosx[resetnum+1];tongspnode.y = spPosy[resetnum+1];
            muwuspnode.x = spPosx[resetnum+2];muwuspnode.y = spPosy[resetnum+2];
        }else if(resetnum == 1){
            tongspnode.x = spPosx[resetnum-1];tongspnode.y = spPosy[resetnum-1];
            muwuspnode.x = spPosx[resetnum+1];muwuspnode.y = spPosy[resetnum+1];
        }else{
            tongspnode.x = spPosx[resetnum-1];tongspnode.y = spPosy[resetnum-1];
            muwuspnode.x = spPosx[resetnum-2];muwuspnode.y = spPosy[resetnum-2];
        }


        var shousp = seenode2.getChildByName("shou");
        shousp.setTag(104);

        var tipnode = seenode2.getChildByName("tipNode");

        var musp = seenode2.getChildByName("muwu").getChildByName("muwujiao_8");
        var tsp = seenode2.getChildByName("tongwu").getChildByName("tongwujiao_7");
        var yisp = seenode2.getChildByName("yiwu").getChildByName("yiyuantip_6");

        var yiyuanflag = true;
        var tongflag = true;
        var muflag = true;
        var spListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if (cc.rectContainsPoint(rect, locationInNode)) {
                    switch (target.getTag()){
                        case 101:{
                            yisp.setVisible(false);
                            tsp.setVisible(false);
                            if(musp.isVisible())
                                musp.setVisible(false)
                            else
                                musp.setVisible(true);
                        }
                            break;
                        case 102:{
                            musp.setVisible(false);
                            tsp.setVisible(false);
                            if(yisp.isVisible())
                                yisp.setVisible(false)
                            else
                                yisp.setVisible(true);
                        }
                            break;
                        case 103:{
                            musp.setVisible(false);
                            yisp.setVisible(false);
                            if(tsp.isVisible())
                                tsp.setVisible(false)
                            else
                                tsp.setVisible(true);
                        }
                            break;
                        case 104:{

                        }
                            break;
                    }
                    return true;
                }
                switch (target.getTag()) {
                    case 101:
                        musp.setVisible(false)
                        break;
                    case 102:
                        yisp.setVisible(false)
                        break;
                    case 103:
                        tsp.setVisible(false)
                        break;
                    case 104:
                        break;
                }

                return false;
            },
            onTouchMoved:function(touch, event){
                var targ = event.getCurrentTarget();
                if (targ.getTag() == 104){
                    var delta = touch.getDelta();
                    targ.x += delta.x;
                    targ.y += delta.y;
                    if(targ.x<=cc.winSize.width/8){
                        targ.x = cc.winSize.width/8;
                    }else if(targ.x>=7*cc.winSize.width/8){
                        targ.x = 7*cc.winSize.width/8;
                    }
                    if(targ.y<=cc.winSize.height/6){
                        targ.y = cc.winSize.height/6;
                    }else if(targ.y>=7*cc.winSize.height/8){
                        targ.y = 7*cc.winSize.height/8;
                    }
                    if(self.checkdistansWithpoint(targ,tongspnode) && tongflag){
                        if(tipnode.getChildrenCount())
                            tipnode.removeAllChildren();
                        var jielusp = new cc.Sprite(res.jielun1);
                        tipnode.addChild(jielusp);

                        self.boshiSpeakandAction("key3");

                        if(shousp.getChildrenCount()){
                            tongspnode.removeAllChildren();
                        }else{
                            var wusp = new cc.Sprite(res.tongwuq);
                            wusp.x = 45; wusp.y = 10;
                            shousp.addChild(wusp,3);
                            tongspnode.removeAllChildren();
                        }
                        var shouzhisp = new cc.Sprite(res.shouzhi);
                        shouzhisp.x = 80;shouzhisp.y = 60;
                        shousp.addChild(shouzhisp,5);

                        tongflag = false;
                    };
                    if(self.checkdistansWithpoint(targ,yiyuanspnode) && yiyuanflag){
                        if(tipnode.getChildrenCount())
                            tipnode.removeAllChildren();
                        var jielusp = new cc.Sprite(res.jielun2);
                        jielusp.setScale(0.68);
                        tipnode.addChild(jielusp);

                        self.boshiSpeakandAction("key2");

                        var yisp = new cc.Sprite(res.yiyuanq);
                        yisp.x = 45; yisp.y = 10;
                        shousp.addChild(yisp,2);
                        yiyuanspnode.removeAllChildren();

                        var shouzhisp = new cc.Sprite(res.shouzhi);
                        shouzhisp.x = 80;shouzhisp.y = 60;
                        shousp.addChild(shouzhisp,5);

                        yiyuanflag = false;
                    };

                    if(self.checkdistansWithpoint(targ,muwuspnode) && muflag){
                        if(tipnode.getChildrenCount())
                            tipnode.removeAllChildren();
                        self.boshiSpeakandAction("key1");
                        var jielusp = new cc.Sprite(res.jielun3);
                        tipnode.addChild(jielusp);
                        muflag = false;
                    };

                }
            },
            onTouchEnded:function(touch, event){

            }
        });
        cc.eventManager.addListener(spListener,muwusp);
        cc.eventManager.addListener(spListener.clone(),tongsp);
        cc.eventManager.addListener(spListener.clone(),yiyuansp);
        cc.eventManager.addListener(spListener.clone(),shousp);
    },
    boshiSpeakandAction:function(keyname){
                this.nodebs.say({
                    key:keyname,
                    force:true
                })
    },
    checkdistansWithpoint : function(target1,target2){
        var dx = target1.x - target2.x ;
        var dy = target1.y - target2.y ;
        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
        if(distance <= 80){
            return true;
        }else
            return false;
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "tishi",
            sound: res.zi1mp,
        })
        addContent({
            people: this.nodebs,
            key: "key1",
            sound: res.zi2mp,
        })
        addContent({
            people: this.nodebs,
            key: "key2",
            sound: res.zi3mp,
        })
        addContent({
            people: this.nodebs,
            key: "key3",
            sound: res.zi4mp,
        })
    }
})

