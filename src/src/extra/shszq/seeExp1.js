var curMusic = 1
var tip_local = 100
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
    initUI:function(){

        var seeexperione = ccs.load(res.see1).node
        this.addChild(seeexperione)
        

        // var uinamelist = [
        //   "xianxiangbtn","jielunbtn","timeday",
        //   "wenbtn","weikanbtn","water","wuse","wenwen"
        // ]
        // var node = loadNode(res.see1, uinamelist);
        // this.addChild(node)
        var tmpthis = this

        var timeday = seeexperione.getChildByName("timeday");
        var timedaytxt = new cc.LabelTTF("1","",32);
        timedaytxt.setPosition(0,0);
        timedaytxt.setColor(cc.color(255,0,0));
        timeday.addChild(timedaytxt);

        var xianxiangbtn = seeexperione.getChildByName("xianxiangbtn");
        var jielunbtn = seeexperione.getChildByName("jielunbtn");
        var wenbtn = seeexperione.getChildByName("wenbtn");
        var weikanbtn = seeexperione.getChildByName("weikanbtn");
        var water = seeexperione.getChildByName("water");
        var wusesp = seeexperione.getChildByName("wuse");
        var wenwen = seeexperione.getChildByName("wenwen");

        // var xianxiangbtn = node.xianxiangbtn
        // var jielunbtn = node.jielunbtn
        // var wenbtn = node.wenbtn
        // var weikanbtn = node.weikanbtn
        // var water = node.water
        // var wusesp = node.wuse
        // var wenwen = node.wenwen

        

        var timedata = 0;
        var watersize= water.getScale();
        timedaytxt.schedule(function(){
            timedata++;
            if(timedata==2)
                tmpthis.peopleSpeakandAction("wenzi1");

            if (timedata % 5){
                if(water){
                    if(water.getScale()<0.1){
                        water.removeFromParent();
                        wenbtn.setVisible(false);
                    }else{
                        water.setScale(watersize-0.025*timedata);
                        if(water.getScale()<0.7)
                            water.y = water.y+0.001*timedata;
                    }
                }
            }

            if(timedata == 10){
                tmpthis.peopleSpeakandAction("wenzi2");
                jielunbtn.setVisible(true);
            }

            if(timedata == 6)
                cangetxianxiang = true;
        },1.5);

        var timedata1 = 0;
        timeday.schedule(function(){
            timedata1++;
            if(timedata1>99)
                timeday.unscheduleAllCallbacks();
            else
                timedaytxt.setString(timedata1 + "");
        },3);

        var cangetjielun = false;
        var cangetxianxiang = false;
         
        xianxiangbtn.addClickEventListener(function(sender,type){
            if(!tmpthis.tip1){
                var tip1 = createResult({
                    img:res.jielun3,
                    offbg:cc.p(10,30),
                    offset:cc.p(20,20),
                    btnfun:function(){
                        addShowType({
                            item: tmpthis.tip1,
                            show: "zoom",
                            time: 0.3,
                            fun: function() {
                                tmpthis.tip1.setPosition(getMiddle())
                                removeMoving(tmpthis.tip1)
                                if(curMusic == tmpthis.tip1.curMusic)
                                   tmpthis.nodebs.stopSay()
                            }
                        })
                    }
                })
                tip1.setScale(0)
                tip1.curMusic = 2
                tip1.setPosition(getMiddle())
                tip1.setLocalZOrder(tip_local++)
                tip1.changeSelfLocalZero = function(){
                    this.setLocalZOrder(tip_local++)
                }
                tmpthis.tip1 = tip1
                tmpthis.addChild(tmpthis.tip1)
            }
            if(tmpthis.tip1.getScale()==1){
                addShowType({
                    item:tmpthis.tip1,
                    show:"zoom",
                    time:0.3,
                    fun:function(){
                        tmpthis.tip1.setPosition(getMiddle())
                       removeMoving(tmpthis.tip1)
                        tmpthis.nodebs.stopSay()
                    }
                })
                
            }else{
                tmpthis.tip1.stopAllActions()
                addShowType({
                    item:tmpthis.tip1,
                    show:"scale",
                    time:0.3,
                    fun:function(){
                        tmpthis.tip1.setLocalZOrder(tip_local++)
                       addMoving(tmpthis.tip1)
                        tmpthis.nodebs.stopSay()
                        tmpthis.nodebs.say({
                            key: "jielun3",
                        }) 
                    }
                })
                
            }
            curMusic = 2    
        });

        jielunbtn.addClickEventListener(function(sender,type){   
         
           if(!tmpthis.tip2){
                var tip2 = createResult({
                    img:res.jielun4,
                    offbg:cc.p(10,30),
                    offset:cc.p(20,20),
                    btnfun:function(){
                    addShowType({
                                item: tmpthis.tip2,
                                show: "zoom",
                                time: 0.3,
                                fun: function() {
                                    removeMoving(tmpthis.tip2)
                                    tmpthis.tip2.setPosition(getMiddle())
                                    if(curMusic == tmpthis.tip2.curMusic)
                                    tmpthis.nodebs.stopSay()
                                }
                })
                    }
                })
                tip2.setScale(0)
                tip2.curMusic = 3
                tip2.setPosition(getMiddle())
                tip2.setLocalZOrder(tip_local++)
                tip2.changeSelfLocalZero = function(){
                    this.setLocalZOrder(tip_local++)
                }
                tmpthis.tip2 = tip2
                tmpthis.addChild(tmpthis.tip2)
            }

            if(tmpthis.tip2.getScale()==1){
                addShowType({
                    item:tmpthis.tip2,
                    show:"zoom",
                    time:0.3,
                    fun:function(){
                        removeMoving(tmpthis.tip2)
                        tmpthis.tip2.setPosition(getMiddle())
                        tmpthis.nodebs.stopSay()
                    }
                })
                   
            }else{
                tmpthis.tip2.stopAllActions()
                addShowType({
                    item:tmpthis.tip2,
                    show:"scale",
                    time:0.3,
                    fun:function(){
                        tmpthis.tip2.setLocalZOrder(tip_local++)
                        addMoving(tmpthis.tip2)
                        tmpthis.nodebs.stopSay()
                        tmpthis.nodebs.say({
                            key: "jielun4",
                        }) 
                    }
                })
            }
            curMusic = 3    
        });

        wenbtn.addClickEventListener(function(sender,type){
            cangetjielun = true;
            wenbtn.setVisible(false);
            var wennode = ccs.load(res.wenac).node;
            var wenac = ccs.load(res.wenac).action;
            wenwen.addChild(wennode);
            wenac.gotoFrameAndPlay(0, 12, true);
            wennode.runAction(wenac);
            wennode.scheduleOnce(function(){
                wusesp.setVisible(true);
                wusesp.runAction(cc.scaleTo(0.2,1));
            },2);
            wennode.scheduleOnce(function(){
                wennode.setVisible(false);
                wusesp.setVisible(false);
                wenbtn.setVisible(true)
            },5);
        });

        weikanbtn.addClickEventListener(function(sender,type){
             if(!tmpthis.fenzi){
                 tmpthis.showTip();
             }else{
                if (tmpthis.fenzi.getScale() == 1) {
                    addShowType({
                        item: tmpthis.fenzi,
                        show: "zoom",
                        time: 0.3,
                        fun:function(){
                            tmpthis.fenzi.setPosition(getMiddle())
                            tmpthis.removeMoving(tmpthis.fenzi.bg)
                        }
                    })
                } else {
                    tmpthis.fenzi.stopAllActions()
                    addShowType({
                        item: tmpthis.fenzi,
                        show: "scale",
                        time: 0.3,
                        fun:function(){
                            tmpthis.addMoving(tmpthis.fenzi.bg)
                        }
                    })
                }
             }       
        });
    },
    showTip:function(){

        var tmpthis = this;

        var fenzisp = ccs.load(res.fenzi).node;
        this.addChild(fenzisp,300);
        this.fenzi = fenzisp
        fenzisp.setLocalZOrder(tip_local++)
        fenzisp.setPosition(getMiddle())
        fenzisp.setScale(0);
        var tipbg = fenzisp.getChildByName("tipbg");
        tipbg.changeSelfLocalZero = function(){
            this.getParent().setLocalZOrder(tip_local++)
        }
        this.fenzi.bg = tipbg
        addShowType({
                    item:tmpthis.fenzi,
                    show:"scale",
                    time:0.3,
                    fun:function(){
                       tmpthis.addMoving(tmpthis.fenzi.bg)
                    }
                })
        var closebtn = fenzisp.getChildByName("tipbtn");
        closebtn.addClickEventListener(function(){
            fenzisp.runAction(cc.sequence(
                cc.scaleTo(0.2,0),
                cc.callFunc(function(){
                    tmpthis.fenzi.setPosition(getMiddle())
                    tmpthis.removeMoving(tmpthis.fenzi.bg)
                })
            ));
        });

        var cainode = fenzisp.getChildByName("cai").getChildByName("fenzinode");
        var caisp = ccs.load(res.fenziac).node;
        var caiac = ccs.load(res.fenziac).action;
        cainode.addChild(caisp);
        caiac.gotoFrameAndPlay(0, 297, true);
        caisp.runAction(caiac);
    },
    peopleSpeakandAction:function(keyname){
        this.nodebs.say({
            key: keyname,
            force: true
        })
    },
    addMoving: function(item) {
        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize()
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    if (item.changeSelfLocalZero)
                        item.changeSelfLocalZero()
                    return true;
                }
                return false;
            },
            onTouchMoved: function(touch, event) {
                var target = event.getCurrentTarget()
                var delta = touch.getDelta()
                
                target.getParent().x += delta.x
                target.getParent().y += delta.y
               
            },
        })
        item.listener = listener1
        cc.eventManager.addListener(listener1, item);
    },
    removeMoving:function(item) {
          if (item.listener) {
                cc.eventManager.removeListener(item.listener)
                item.listener = null
          }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                // self.nodebs.say({
                //     key: "wenzi1",
                //     force:true
                // })
            })
        }
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
            img: res.wenzi1
        })
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zi2mp,
            img:res.wenzi2
        })
        addContent({
            people: this.nodebs,
            key: "jielun3",
            sound: res.jielunmp3,
        })
        addContent({
            people: this.nodebs,
            key: "jielun4",
            sound:res.jielunmp4
        })
    
    }
})

