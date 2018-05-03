/**
 * Created by Administrator on 2016/7/24.
 */
var curLocal = 20
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI : function(){
    	var self = this
    	var tmpThis = this
    	var node = loadNode(res.jdgc_do1_json)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_tip1"})
        })

        var doLayer = node
        var aniNode = doLayer.getChildByName("aniNode");
        var dg = doLayer.getChildByName("dg");
        var fdt = doLayer.getChildByName("fdt");
        var hms_2 = doLayer.getChildByName("hms_2");
        var panel3 = doLayer.getChildByName("Panel_3");
        var panel1 = panel3.getChildByName("Panel_1");
         upBtn = panel1.getChildByName("upbtn");
         downBtn = panel1.getChildByName("downbtn");
        var gjxNode = doLayer.getChildByName("gjxNode");
        var panel2 = panel1.getChildByName("Panel_2");
         ydNode = panel2.getChildByName("ydNode");
        var zt = doLayer.getChildByName("sz_3");
        var hms = doLayer.getChildByName("hms_4");
        var zj = doLayer.getChildByName("zj_1");
        var xd = doLayer.getChildByName("xd_2");
        var fdj = doLayer.getChildByName("fdj_5");
        var pheBtn = doLayer.getChildByName("phebtn");
        var moveSprite = doLayer.getChildByName("testMove");
        moveSprite.setTag(100);
        //cloudbg
        var cloudBg = doLayer.getChildByName("cloudBg");
        var closeBtn = cloudBg.getChildByName("closebtn");
        var sureBtn = cloudBg.getChildByName("surebtn");
        var menuBtn = doLayer.getChildByName("menubtn");
        self.getListener(cloudBg)
        cloudBg.setPositionY(-600)
        cloudBg.setScale(0)

        tmpThis.opeAy = [zt,hms,zj,xd,fdj];
        tmpThis.aspAy = [];
        tmpThis.a2spAy = [res.zt2,res.hms2,res.zj2,res.xd2,res.fdj2];
        tmpThis.bspAy = [];

        for(var i = 1;i<6;i++) {
            var aName = "a" + i;
            var sp = ydNode.getChildByName(aName);
            tmpThis.aspAy.push(sp);
            var bName = "b" + i;
            var bsp = ydNode.getChildByName(bName);
            tmpThis.bspAy.push(bsp);
            bsp.setTag(20 + i);

            tmpThis.opeAy[i - 1].setVisible(false);
            tmpThis.opeAy[i - 1].setTag(10 + i);
        }

        var judgeAy = [false,false,false,false,false];
        var toggle = new ccui.Button(res.btn_gjx_select,res.btn_gjx_normal)
        gjxNode.addChild(toggle)
        var panelFlag = true;
        panel1.runAction(cc.moveTo(0.4,panel1.x,panel1.y-500));
        toggle.addClickEventListener(function(){
            if (panelFlag) {
                panel1.runAction(cc.moveTo(0.2,panel1.x,panel1.y+500));
                toggle.loadTextures(res.btn_gjx_normal,res.btn_gjx_select)
                panelFlag = false;
            } else {
                panel1.runAction(cc.moveTo(0.2,panel1.x,panel1.y-500));
                toggle.loadTextures(res.btn_gjx_select,res.btn_gjx_normal)
                panelFlag = true;
            }

        });
        upBtn.addClickEventListener(function(){
            if(!upBtn.isVisible() || ydNode.y <= 300)  return;
            if(ydNode.y < 800)
                upBtn.setVisible(false);
            ydNode.runAction(cc.moveTo(0.1,cc.p(ydNode.x,ydNode.y-300)));
            downBtn.setVisible(true);
        });
        downBtn.addClickEventListener(function(){
            if(!downBtn.isVisible() || ydNode.y >= 600)  return;
            if(ydNode.y > 300)
                 downBtn.setVisible(false);
            ydNode.runAction(cc.moveTo(0.1,cc.p(ydNode.x,ydNode.y+300)));
            upBtn.setVisible(true);
        });

        closeBtn.addClickEventListener(function(){
            if(cloudBg.isVisible()){
                //cloudBg.setVisible(false);
                self.setTip(cloudBg)
                cloudBg.scheduleOnce(function(){
                    cloudBg.setPositionY(-600)
                },0.2)
            }
        });
        sureBtn.addClickEventListener(function(){
            if(cloudBg.isVisible()){
                self.setTip(cloudBg)
                //cloudBg.setVisible(false);
                cloudBg.scheduleOnce(function(){
                    cloudBg.setPositionY(-600)
                },0.2)
            }
        });

        pheBtn.addClickEventListener(function(){
        	if(pheBtn.isVisible()){
        		self.nodebs.say({key:"do1_faxian"})
        	}
        })

        var curIndex = 0;
        var ani1Flag = false;
        var ani2Flag = false;
        var ani3Flag = false;
        var startpos = 0;
        var endpos = 0;
        var move_pos = 0;
        var start_pos = 0
        var start_sp_x = 0;
        var move_sp_x = 0;
        var check_hms_flag = false;
        var touchListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan:function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                start_sp_x = touch.getLocationX();

                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(target.getTag() > 20 && target.getTag() < 30)
                        curIndex = target.getTag() - 21;
                    else if(target.getTag() < 20)
                        curIndex = target.getTag() - 11;

                    startpos = ydNode.y;
                    start_pos = touch.getLocationY();
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                move_sp_x = touch.getLocationX();

                if((move_sp_x - start_sp_x > 50) && (target.getTag() >20 && target.getTag() < 30) &&
                    !tmpThis.opeAy[curIndex].isVisible() && (touch.getLocation().y > 100 && touch.getLocation().y < 350)){

                    if((target.getTag() == 25) && !dg.isVisible()){
                        cloudBg.setVisible(true);
                        cloudBg.runAction(cc.scaleTo(0.2,1))
                        cloudBg.setPosition(cc.p(cc.winSize.width/2,cc.winSize.height/2));
                        return;
                    }
                    //get move sprite
                    tmpThis.setComm(touch,curIndex);
                    moveSprite.pause();
                    check_hms_flag = true;
                    if(ydNode.y != startpos)
                        ydNode.runAction(cc.moveTo(0.01,cc.p(ydNode.x,startpos)));
                }

                if(target.getTag() < 20 || !judgeAy[curIndex]){
                    if(judgeAy[1] && curIndex == 1)  return;

                    tmpThis.opeAy[curIndex].x += delta.x;
                    tmpThis.opeAy[curIndex].y += delta.y;

                    //if(tmpThis.opeAy[1].x < 140)
                    //    tmpThis.opeAy[1].setPositionX(180);
                    if(target.getTag() == 25 || target.getTag() == 15){
                        if(tmpThis.checkDistanceWithPoint(fdj,dg)) {
                            fdt.setVisible(true);
                            pheBtn.setVisible(true);
                        }
                        else
                            fdt.setVisible(false);
                    }
                }

                tmpThis.limitBounds(touch,target);

                move_pos = touch.getLocationY();
                if(target.getTag() == 100 && touch.getLocationX() < 140 &&
                    (move_pos - start_pos >50 || start_pos - move_pos >50)){
                    ydNode.y += delta.y;
                }

            },
            onTouchEnded:function(touch,event) {
                var target = event.getCurrentTarget();
                moveSprite.resume();

                //touch move base panel
                endpos = ydNode.y;
                if(target.getTag() == 100){
                    tmpThis.movePanel(startpos,endpos);
                }
                if(check_hms_flag && (target.getTag() == 12 || target.getTag() == 22) && !judgeAy[1]){
                    hms.setPositionY(-200);
                    hms_2.setPosition(aniNode.getPosition());
                    tmpThis.bspAy[1].pause();
                    ani1Flag = true;
                }

                if(tmpThis.opeAy[curIndex].isVisible())
                    judgeAy[curIndex] = true;

                if((target.getTag() == 11 || target.getTag() == 21) && ani1Flag && cc.rectIntersectsRect(zt,hms_2)){// && judgeAy[1]
                    ani1Flag = false;
                    var call = new cc.CallFunc(function(){
                        zt.runAction(cc.moveTo(0.3,aniNode.getPosition()));
                    });
                    var call2 = new cc.CallFunc(function(){
                        zt.removeFromParent();
                        hms_2.removeFromParent();
                        tmpThis.bspAy[0].pause();
                        tmpThis.playAni(res.jdgc_doAni1,440,aniNode);
                    });
                    var call3 = new cc.CallFunc(function(){
                        ani2Flag = true;
                        self.nodebs.say({key:"do1_tip2",force:true})
                        //tishiyi
                        //tmpThis.playStudentAni(res.stu2Ani,280,studentNode,10,tishiAy[1]);
                    });
                    var del = new cc.DelayTime(0.3);
                    var del2 = new cc.DelayTime(7.4);
                    var seq = new cc.Sequence(call,del,call2,del2,call3);
                    tmpThis.runAction(seq);

                }

                if(ani2Flag && judgeAy[2] && (target.getTag() == 13 || target.getTag() == 23)){
                    ani2Flag = false;
                    var call = new cc.CallFunc(function(){
                        zj.runAction(cc.moveTo(0.3,690,275));
                    });
                    var call2 = new cc.CallFunc(function(){
                        zj.removeFromParent();
                        tmpThis.bspAy[2].pause();
                        tmpThis.playAni(res.jdgc_doAni2,160,aniNode);
                    });
                    var call3 = new cc.CallFunc(function(){
                        ani3Flag = true;
                        self.nodebs.say({key:"do1_tip3",force:true})
                        // if(tishiAy[1].isVisible())
                        //     tishiAy[1].setVisible(false);
                        //tmpThis.playStudentAni(res.stu2Ani,550,studentNode,11,tishiAy[2]);
                    });
                    var del = new cc.DelayTime(0.3);
                    var del2 = new cc.DelayTime(5.7);
                    var seq = new cc.Sequence(call,del,call2,del2,call3);
                    tmpThis.runAction(seq);
                }

                if(ani3Flag && judgeAy[3] && tmpThis.checkDistanceWithPoint(xd,aniNode)){
                    ani3Flag = false;
                    var call = new cc.CallFunc(function(){
                        xd.runAction(cc.moveTo(0.3,728.83,145.37));
                    });
                    var call2 = new cc.CallFunc(function(){
                        xd.removeFromParent();
                        tmpThis.playAni(res.jdgc_doAni3,235,aniNode);
                        tmpThis.bspAy[3].pause();
                    });
                    var call3 = new cc.CallFunc(function(){
                        aniNode.removeAllChildren();
                        dg.setVisible(true);
                    });
                    var del2 = new cc.DelayTime(8.4);
                    var del = new cc.DelayTime(0.3);
                    var seq = new cc.Sequence(call,del,call2,del2,call3);
                    tmpThis.runAction(seq);
                }


            }
        });

        for(var i=0;i<5;i++){
            cc.eventManager.addListener(touchListener.clone(),tmpThis.bspAy[i]);
            cc.eventManager.addListener(touchListener.clone(),tmpThis.opeAy[i]);
        }
        cc.eventManager.addListener(touchListener.clone(),moveSprite);

    },

    movePanel:function(startpos,endpos){
        if(endpos > startpos && (endpos - startpos > 60)){
            if(!downBtn.isVisible() || ydNode.y >= 900){
                ydNode.runAction(cc.moveTo(0.01,cc.p(ydNode.x,startpos)));
                return;
            }
            if(ydNode.y > 600)
                downBtn.setVisible(false);
            upBtn.setVisible(true);
            ydNode.runAction(cc.moveTo(0.1,cc.p(ydNode.x,startpos+300)));
        }else if(endpos < startpos && (startpos - endpos > 60)){
            if(!upBtn.isVisible() || ydNode.y <= 300){
                ydNode.runAction(cc.moveTo(0.01,cc.p(ydNode.x,startpos)));
                return;
            }
            if(ydNode.y < 600)
                upBtn.setVisible(false);
            downBtn.setVisible(true);
            ydNode.runAction(cc.moveTo(0.1,cc.p(ydNode.x,startpos-300)));
        }else{
            ydNode.runAction(cc.moveTo(0.01,cc.p(ydNode.x,startpos)));
        }
    },

    setComm:function(touch,index){
        var tmpThis = this;
        tmpThis.opeAy[index].setVisible(true);
        tmpThis.opeAy[index].setPosition(touch.getLocation());
        tmpThis.aspAy[index].setTexture(tmpThis.a2spAy[index]);
        tmpThis.bspAy[index].setTexture(res.circle2);
    },

    checkDistanceWithPoint: function (target1, target2) {
        var dy = target1.y - target2.y;
        var dx = target1.x - target2.x;
        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if(target1.getTag() == 15 && distance <= 35)
            return true
        else if(distance <= 200 && target1.getTag() != 15)
            return true;

        return false;
    },

    playAni:function(name,frame,node){
        node.removeAllChildren();
        var sp = ccs.load(name).node;
        var ac = ccs.load(name).action;
        node.addChild(sp);
        ac.gotoFrameAndPlay(0,frame,false);
        sp.runAction(ac);
    },

    limitBounds:function(touch,target){
        if(touch.getLocation().x < 0)    target.setPositionX(0);
        if(touch.getLocation().y < 0)    target.setPositionY(0);
        if(touch.getLocation().x > cc.winSize.width)     target.setPositionX(cc.winSize.width);
        if(touch.getLocation().y > cc.winSize.height)     target.setPositionX(cc.winSize.height);
    },

    setTip : function(tip){
        var call = new cc.CallFunc(function(){
            tip.runAction(cc.scaleTo(0.2,0));
        });
        var call2 = new cc.CallFunc(function(){
            tip.setVisible(false);
        });
        var del = new cc.DelayTime(0.2);
        var seq = new cc.Sequence(call,del,call2);
        tip.runAction(seq);
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
	                sprite.setLocalZOrder(curLocal)
	                curLocal++
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
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound2},
            {key:"do1_tip3",img:res.do1_tip3,sound:res.do1_sound3},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "do1_faxian",
            img: res.do1_faxian,
            sound: res.do1_faxian_sound,
            id: "result",
        })
    },
})