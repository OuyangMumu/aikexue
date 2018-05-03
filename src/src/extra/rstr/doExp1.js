/**
 * Created by Administrator on 2016/7/21.
 */
 var curLocal = 10
 var tableFlag = true
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            settingData: {
                biaogeFun: function () {
                    if (tableFlag) {
                        self.tableShowOut()
                        tableFlag = false
                    } else {
                        self.tableShowIn()
                        tableFlag = true
                    }
                },
                pos: cc.p(1080, 580),
                }
            })
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI : function(){
    	var self = this
    	loadPlist("bigSoilPlist")
    	loadPlist("bagPlist")
        var uiList = [
            "bag","hand","bagNode","soil","sp1_sand",
            "sp2_sand","sp3_sand","sp4_sand","sp5_sand",
            "sp6_sand","moveCircle","phebtn","filterbtn"
        ]
        var node = loadNode(res.rstr_do1_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_tip1"})
        })

        var bag = node.bag
        var hand = node.hand
        var bagNode = node.bagNode
        var soil = node.soil
        //soil
        var sp1_sand = node.sp1_sand
        var sp2_sand = node.sp2_sand
        var sp3_sand = node.sp3_sand
        var sp4_sand = node.sp4_sand
        var sp5_sand = node.sp5_sand
        var sp6_sand = node.sp6_sand
        var circle = node.moveCircle
        var pheBtn = node.phebtn
        var filterBtn = node.filterbtn

        var net = new cc.Sprite("res/extra/rstr/do1/net.png");
        var circle2 = new cc.Sprite("res/extra/rstr/do1/moveCircle.png");
        net.setPosition(cc.p(-600,230));
        circle2.setPosition(cc.p(-600,230));
        net.setVisible(false);
        circle2.setVisible(false);
        this.addChild(net);
        this.addChild(circle2);
        //hand
        var rod = hand.getChildByName("rod");
        var hand_1 = hand.getChildByName("hand_a");
        var hand_2 = hand.getChildByName("hand_b");
        self.nodeAy = [];
        for(var i = 1;i<7;i++){
            var nodeName = "Node_"+i;
            var node2 = node.getChildByName(nodeName);
            self.nodeAy.push(node2);
        }
        bag.setTag(11);
        hand.setTag(12);
        soil.setTag(13);
        rod.setTag(15);
        hand_1.setTag(160);
        hand_2.setTag(170);
        circle.setTag(18);
        circle2.setTag(20);

        var bigCircle_2 = new cc.Sprite("res/extra/rstr/do1/big_1.png");
        var bigCircle = new cc.ClippingNode(bigCircle_2);
        bigCircle.setPosition(cc.p(270,390));
        bigCircle.setAlphaThreshold(0);
        var bigCircleBg = new cc.Sprite("#bigCircleBg.png");
        bigCircle.addChild(bigCircleBg);
        bigSoil = new cc.Sprite("#bigSoil.png");
        bigCircle.addChild(bigSoil);
        bigSoil.setPosition(cc.p(125,-135));
        this.addChild(bigCircle);
        var big = new cc.Sprite("res/extra/rstr/do1/big_1.png");
        big.setPosition(cc.p(270,390));
        this.addChild(big);
        big.setTag(19);
        big.setScale(1.02);
        big.setVisible(false);
        //表格
        self.tableNode = ccs.load(res.rstr_tableNode_json).node;
        self.tableNode.setPosition(cc.p(-568,320));
        self.addChild(self.tableNode,100);
        self.tableNode.setScale(0);
        self.table();

        self.spriteAy = [];
        self.spriteMove(bigCircle,big);
        bag.once = true

        pheBtn.addClickEventListener(function(){
            self.nodebs.say({key:"do1_faxian"})
        });

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp 
        }

        //重构修改，按钮下的动画事件
        //bag.setVisible(false)
        //filterBtn.setVisible(true)
        filterBtn.addClickEventListener(function(){
            if(!filterBtn.isVisible())     return;
            filterBtn.setVisible(false);
            pheBtn.setVisible(false);
            for(var i = 0;i<4;i++){
                self.spriteAy[i].setVisible(false);
            }
            big.setVisible(false);
            circle.setVisible(false);
            hand.setPositionY(-700);
            soil.setPositionY(-700);
            circle.setPositionY(-700);

            bagNode.removeAllChildren();
            bagNode.setPosition(cc.p(450,250));

            //新增
            loadPlist("do1_plist")
            var wan = createSp("#wan.png",cc.p(900,150),self)
            wan.wan2 = createSp("#wan2.png",cc.p(75,55),wan)
            var paper = createSp("#paper01.png",cc.p(350,400),self)
            wan.setScale(1.8)
            paper.setScale(2)
            var ani = function(frame,end) {
                return cc.sequence(createAnimation({
                    frame: frame,
                    start: 1,
                    end: end,
                    time: 0.15,
                }))
            } 
            wan.runAction(cc.sequence(
                cc.moveTo(0.4,550,150),
                cc.delayTime(0.2),
                cc.callFunc(function(){
                    paper.runAction(cc.sequence(
                        ani("paper%02d.png",9),
                        cc.callFunc(function(){
                            paper.setVisible(false)
                            var chuizi = createSp("#chui.png",cc.p(50,170),wan)
                            safeAdd(wan, wan.wan2)
                            chuizi.time = 0.3
                            chuizi.runAction(cc.sequence(
                                cc.delayTime(0.2),
                                cc.moveTo(chuizi.time,50,120),
                                cc.delayTime(0.1),
                                cc.moveTo(chuizi.time,50,170),
                                cc.delayTime(0.1),
                                cc.moveTo(chuizi.time,50,120),
                                cc.delayTime(0.1),
                                cc.moveTo(chuizi.time,50,170),
                                cc.delayTime(0.1),
                                cc.moveTo(chuizi.time,50,120),
                                cc.delayTime(0.1),
                                cc.moveTo(chuizi.time,50,170),
                                cc.delayTime(0.1),
                                cc.moveTo(chuizi.time,50,120),
                                cc.delayTime(0.1),
                                cc.callFunc(function(){
                                    chuizi.setVisible(false)
                                    var wang = createSp("#wang.png",cc.p(820,260),self)
                                    wang.shazi = createSp("#shazi.png",cc.p(100,70),wang)
                                    wang.shazi.setScale(0)
                                    safeAdd(self, wan)
                                    wang.shazi.runAction(cc.sequence(
                                        cc.delayTime(1),
                                        cc.callFunc(function(){
                                        }),
                                        cc.scaleTo(0.5,1),
                                        cc.delayTime(0.2),
                                        cc.callFunc(function(){
                                            //摇晃沙子，甩出沙子
                                            var soil10 = new cc.Sprite("res/extra/rstr/do1/soil10.png");
                                            soil10.setPosition(cc.p(760,238));
                                            self.addChild(soil10);
                                            safeAdd(self, wang)

                                            wang.zawu = createSp("#zawu.png",cc.p(120,70),wang)
                                            safeAdd(wang, wang.shazi)
                                            wang.hand1 = createSp("#handdown.png",cc.p(60,130),wang)
                                            wang.hand2 = createSp("#handup.png",cc.p(60,20),wang)
                                            wang.hand1.setLocalZOrder(-1)
                                            wang.runAction(cc.sequence(
                                                cc.moveTo(0.2,820,320),
                                                cc.delayTime(0.1),
                                                cc.moveTo(0.2,820,260),
                                                cc.delayTime(0.1),
                                                cc.moveTo(0.2,820,320),
                                                cc.delayTime(0.1),
                                                cc.moveTo(0.2,820,260),
                                                cc.delayTime(0.1)
                                            ))
                                        }),
                                        cc.scaleTo(0.5,0),
                                        cc.callFunc(function(){
                                            wang.runAction(cc.sequence(
                                                cc.moveTo(0.2,530,260),
                                                cc.callFunc(function(){
                                                    wang.setVisible(false)

                                                    net.setVisible(true);
                                                    circle2.setVisible(true);
                                                    net.setPosition(cc.p(464,230));
                                                    circle2.setPosition(cc.p(420,280));
                                                    big.setVisible(true);
                                                    bigSoil.setTexture("res/extra/rstr/do1/bigNet.png");
                                                    bigSoil.setPosition(cc.p(125,-135));
                                                    for(var i = 0;i<4;i++){
                                                        self.spriteAy[i].setVisible(true);
                                                    }

                                                })
                                            ))
                                        })
                                    ))
                                    wan.runAction(cc.sequence(
                                        cc.moveTo(0.3,650,420),
                                        cc.rotateTo(0.8,60),
                                        cc.delayTime(0.2),
                                        cc.callFunc(function(){
                                            wan.setVisible(false)
                                        })
                                    ))
                                })
                            ))
                        })
                    ))
                })
            ))

            //以下被删除弃用
            // var sp = ccs.load(res.rstr_putSoilAni_json).node;
            // var ac = ccs.load(res.rstr_putSoilAni_json).action;
            // bagNode.addChild(sp);
            // ac.gotoFrameAndPlay(0,245,false);
            // ac.setLastFrameCallFunc(function(){
            //     var soil10 = new cc.Sprite("res/extra/rstr/do1/soil10.png");
            //     soil10.setPosition(cc.p(760,238));
            //     self.addChild(soil10);
            //     net.setVisible(true);
            //     circle2.setVisible(true);
            //     net.setPosition(cc.p(464,230));
            //     circle2.setPosition(cc.p(420,280));
            //     big.setVisible(true);
            //     bigSoil.setTexture("res/extra/rstr/do1/bigNet.png");
            //     bigSoil.setPosition(cc.p(125,-135));
            //     for(var i = 0;i<4;i++){
            //         self.spriteAy[i].setVisible(true);
            //     }
            //     bagNode.removeAllChildren();
            // });
            // sp.runAction(ac);



        });

        var hand_MoveNum = 1;
        var spriteListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(-10, -10, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)) {
                    if((target.getTag() == 15 || target.getTag() == 160 || target.getTag() == 170) && hand.isVisible()){
                        if(hand_MoveNum == 1){
                            self.moveHand(hand,hand_MoveNum,sp1_sand);
                            hand_MoveNum = 2;
                        }else if(hand_MoveNum == 2){
                            self.moveHand(hand,hand_MoveNum,sp2_sand);
                            hand_MoveNum = 3;
                        }else if(hand_MoveNum == 3){
                            self.moveHand(hand,hand_MoveNum,sp3_sand);
                            hand_MoveNum = 4;
                        }else if(hand_MoveNum == 4){
                            self.moveHand(hand,hand_MoveNum,sp4_sand);
                            hand_MoveNum = 5;
                        }else if(hand_MoveNum == 5){
                            self.moveHand(hand,hand_MoveNum,sp5_sand);
                            hand_MoveNum = 6;
                        }else if(hand_MoveNum == 6){
                            self.moveHand(hand,hand_MoveNum,sp6_sand);
                            hand_MoveNum = 0;
                            self.scheduleOnce(function () {
                                pheBtn.setVisible(true);
                                filterBtn.setVisible(true);
                            },1)

                        }
                    }

                    if(target.getTag() == 11 && !hand.isVisible() && bag.once) {
                        var aniBag = function () {
                            return cc.sequence(createAnimation({
                                frame: "bagAni%02d.png",
                                end: 13,
                                time: 0.18
                            }), cc.callFunc(function () {
                                bag.removeFromParent(true)
                                self.nodebs.say({key:"do1_tip2",force:true})
                                hand.setVisible(true);
                                soil.setVisible(true);
                                big.setVisible(true);
                                for (var i = 0; i < 4; i++) {
                                    self.spriteAy[i].setVisible(true);
                                }
                            }))
                        }
                        bag.runAction(aniBag())
                        bag.once = false
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();

                if(target.getTag() == 18 && circle.isVisible()){
                    var temp = cc.p(target.x + delta.x, target.y + delta.y);
                    if(temp.x > 140 && temp.x < 420 && temp.y > 65 && temp.y < 275){
                        target.x += delta.x;
                        target.y += delta.y;
                        bigSoil.x -= delta.x;
                        bigSoil.y -= delta.y;
                        if(!big.isVisible()){
                            for(var i = 0;i<4;i++){
                                self.spriteAy[i].setVisible(true);
                            }
                            big.setVisible(true);
                        }
                    }
                }

                if(target.getTag() == 19 && big.isVisible()){
                    target.x += delta.x;
                    target.y += delta.y;
                    for(var i = 0;i<4;i++){
                        self.spriteAy[i].x += delta.x;
                        self.spriteAy[i].y += delta.y;
                    }
                }

                if(target.getTag() == 20){
                    var temp = cc.p(target.x + delta.x, target.y + delta.y);
                    if(temp.x > 360 && temp.x < 550 && temp.y > 195 && temp.y < 280){
                        target.x += delta.x;
                        target.y += delta.y;
                        bigSoil.x -= (delta.x * 3);
                        bigSoil.y -= (delta.y * 3);
                        if(!self.spriteAy[0].isVisible()){
                            for(var i = 0;i<4;i++){
                                self.spriteAy[i].setVisible(true);
                            }
                            big.setVisible(true);
                        }
                    }
                }

            },
            onTouchEnded:function(touch,event){
            }
        });
        cc.eventManager.addListener(spriteListener,bag);
        //cc.eventManager.addListener(spriteListener.clone(),hand);
        cc.eventManager.addListener(spriteListener.clone(),hand_1);
        cc.eventManager.addListener(spriteListener.clone(),hand_2);
        cc.eventManager.addListener(spriteListener.clone(),rod);
        cc.eventManager.addListener(spriteListener.clone(),circle);
        cc.eventManager.addListener(spriteListener.clone(),big);
        cc.eventManager.addListener(spriteListener.clone(),circle2);

    },

    playAni:function(node,name,frame,index){
        var self = this;
        node.removeAllChildren();
        var sp = ccs.load(name).node;
        var ac = ccs.load(name).action;
        node.addChild(sp);
        ac.gotoFrameAndPlay(0,frame,false);
        sp.runAction(ac);
    },

    moveHand:function(hand,hand_MoveNum,sprite){
        var self = this;
        var call = new cc.CallFunc(function(){
            hand.runAction(cc.moveTo(0.2,self.nodeAy[hand_MoveNum-1].x,self.nodeAy[hand_MoveNum-1].y));
        });
        var call2 = new cc.CallFunc(function(){
            hand.setVisible(false);
            self.playAni(self.nodeAy[hand_MoveNum-1],res.rstr_sandAni_json,65);
            sprite.removeFromParent();
        });
        var call3 = new cc.CallFunc(function(){
            if(hand_MoveNum == 1)
                bigSoil.setSpriteFrame("bigSoil1.png");
            else if(hand_MoveNum == 2)
                bigSoil.setSpriteFrame("bigSoil2.png");
            else if(hand_MoveNum == 3)
                bigSoil.setSpriteFrame("bigSoil3.png");
            else if(hand_MoveNum == 4)
                bigSoil.setSpriteFrame("bigSoil4.png");
            else if(hand_MoveNum == 5)
                bigSoil.setSpriteFrame("bigSoil5.png");
            else if(hand_MoveNum == 6)
                bigSoil.setSpriteFrame("bigSoil6.png");

            self.nodeAy[hand_MoveNum-1].removeAllChildren();
            hand.setVisible(true);
            hand.runAction(cc.moveTo(0.2,650,360));
        });
        var del1 = new cc.DelayTime(0.2);
        var del2 = new cc.DelayTime(0.8125);
        var seq = new cc.Sequence(call,del1,call2,del2,call3);
        self.runAction(seq);
    },

    spriteMove:function(bigCircle,big){
        var self = this;
        var smallBtn = new ccui.Button("res/extra/rstr/do1/smallbtn1.png","res/extra/rstr/do1/smallbtn2.png");
        var bigBtn = new ccui.Button("res/extra/rstr/do1/bigbtn1.png","res/extra/rstr/do1/bigbtn2.png");
        var closeBtn = new ccui.Button("res/extra/rstr/do1/close_small1.png","res/extra/rstr/do1/close_small2.png");
        smallBtn.setPosition(cc.p(320,530));
        this.addChild(smallBtn);
        bigBtn.setPosition(cc.p(376,495));
        this.addChild(bigBtn);
        closeBtn.setPosition(cc.p(410,440));
        this.addChild(closeBtn);
        self.spriteAy = [bigCircle,smallBtn,bigBtn,closeBtn];
        for(var i = 0;i<4;i++){
            self.spriteAy[i].setVisible(false);
        }

        var scale = 1;
        smallBtn.addClickEventListener(function(){
            if(scale < 0.8) return;
            scale = scale/1.1;
            bigSoil.setScale(scale);
        });
        bigBtn.addClickEventListener(function(){
            if(scale > 1.2) return;
            scale = scale*1.1;
            bigSoil.setScale(scale);
        });
        closeBtn.addClickEventListener(function(){
            for(var i = 0;i<4;i++){
                self.spriteAy[i].setVisible(false);
            }
            big.setVisible(false);
        });
    },

    table:function(){
        var self = this;
        self.tableBg = self.tableNode.getChildByName("tableBg");
        var tableBg = self.tableBg
        self.getListener(tableBg);
        var nodeAy = [];
        var textAy = [];
        var itemAy = [];
        var drawAy = [];
        var no1Ay = [];
        var no2Ay = [];
        var yes1Ay = [];
        var yes2Ay = [];
        var resultAy = [13,11,12,16,14,15];
        var stringAy = [1,1,1,1,1,1];
        var judgeAy = [false,false,false,false,false,false];
        var tmpAy = [null,null,null,null,null,null,null];
        for(var i=1;i<7;i++){
            var nodeName = "Node_"+i;
            var node = tableBg.getChildByName(nodeName);
                nodeAy.push(node);
            var textName = "input"+i;
            var text = tableBg.getChildByName(textName);
            textAy.push(text);
            addInput({
                item:text,
                strlen:1,
                size:36,
                color:cc.color(22,22,217,255),
            })
            var itemName = "res/extra/rstr/do1/item_"+i+".png";
            var item = new cc.Sprite(itemName);
            var item_2 = new cc.Sprite(itemName);
            item.setTag(i);
            item_2.setTag(10+i);
            itemAy.push(item);
            drawAy.push(item_2);
            item.setPosition(cc.p(740,node.y));
            tableBg.addChild(item);
            tableBg.addChild(item_2);
            item_2.setPosition(cc.p(0,-500));
            item_2.setVisible(false);

            var no1Name = "no"+i;
            var no1 = tableBg.getChildByName(no1Name);
            var num = 10+i;
            var no2Name = "no"+num;
            var no2 = tableBg.getChildByName(no2Name);
            no1Ay.push(no1);
            no2Ay.push(no2);
            no1.setVisible(false);
            no2.setVisible(false);

            var yes1Name = "yes"+i;
            var yes1 = tableBg.getChildByName(yes1Name);
            var yes2Name = "yes"+num;
            var yes2 = tableBg.getChildByName(yes2Name);
            yes1Ay.push(yes1);
            yes2Ay.push(yes2);
            yes1.setVisible(false);
            yes2.setVisible(false);

        }

        var submitBtn = tableBg.getChildByName("submitbtn");
        var resultBtn = tableBg.getChildByName("resultbtn");
        var clearBtn = tableBg.getChildByName("clearbtn");
        var closeBtn = tableBg.getChildByName("closebtn");
        var resultImg = self.tableNode.getChildByName("resultImg");
        var resultCloseBtn = resultImg.getChildByName("resultCloseBtn");
        self.getListener(resultImg);
        self.setTipAction(resultImg,2);

        submitBtn.addClickEventListener(function(){
            for(var i = 0;i<6;i++){
                if(tmpAy[i] != null) {
                    if (tmpAy[i].getTag() == resultAy[i])
                        yes1Ay[i].setVisible(true);
                    else
                        no1Ay[i].setVisible(true);
                }else{
                    yes2Ay[i].setVisible(false);
                    no2Ay[i].setVisible(false);
                }

                if(textAy[i].getStr() != ""){
                    if(textAy[i].getStr() == stringAy[i])
                        yes2Ay[i].setVisible(true);
                    else
                        no2Ay[i].setVisible(true);
                }else{
                    yes2Ay[i].setVisible(false);
                    no2Ay[i].setVisible(false);
                }
            }


        });
        resultBtn.addClickEventListener(function(){
            if(resultImg.getScale() != 1) {
                self.setTipAction(resultImg,1);
                resultImg.setPosition(cc.p(0,0))
                resultImg.setLocalZOrder(tableBg.getLocalZOrder()+1)
            } else
                self.setTipAction(resultImg,2);
        });
        resultCloseBtn.addClickEventListener(function(){
            self.setTipAction(resultImg,2)
            self.scheduleOnce(function(){
                resultImg.setPositionY(-600)
            },0.2)
        });
        clearBtn.addClickEventListener(function(){
            for(var i = 0;i<6;i++){
                drawAy[i].setPosition(cc.p(0,-500));
                itemAy[i].setOpacity(255);
                drawAy[i].setVisible(false);
                textAy[i].clear()
                no1Ay[i].setVisible(false);
                no2Ay[i].setVisible(false);
                yes1Ay[i].setVisible(false);
                yes2Ay[i].setVisible(false);
                judgeAy[i] = false;
                tmpAy[i] = null;
            }
        });
        closeBtn.addClickEventListener(function(){
            self.setTipAction(self.tableNode,2);
            self.setTipAction(tableBg,2);
            if(resultImg.getScale() != 0)
                self.setTipAction(resultImg,2);
            self.scheduleOnce(function(){
                self.tableNode.setPosition(cc.p(568,-600));
            },0.3)
            tableFlag = true
        });

        var curTag = 0;
        var tmpTag = 0;
        var index = 10;
        var curItem = null;
        var spriteListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if(cc.rectContainsPoint(rect,locationInNode)) {
                    if(target.getTag() < 10)     curTag = target.getTag() - 1;
                     else if(target.getTag() > 10)     curTag = target.getTag() - 11;
                    if(target.getTag() < 10 && target.getOpacity() > 200) {
                        itemAy[curTag].setOpacity(150);
                        drawAy[curTag].setVisible(true);
                        drawAy[curTag].setScale(1.2);
                        drawAy[curTag].setPosition(target.getParent().convertToNodeSpace(touch.getLocation()));
                        drawAy[curTag].setLocalZOrder(10);
                    }
                    if(target.getTag() > 10){
                        drawAy[curTag].setScale(1.2);
                        drawAy[curTag].setPosition(target.getParent().convertToNodeSpace(touch.getLocation()));
                        drawAy[curTag].setLocalZOrder(10);
                    }
                    return true;
                }
                return false
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                if(target.getTag() > 10 || !judgeAy[curTag]){
                    drawAy[curTag].x += delta.x;
                    drawAy[curTag].y += delta.y;
                }

            },
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget();

                if(drawAy[curTag].x < 525 && drawAy[curTag].x > 340 &&
                    drawAy[curTag].y > 60 && drawAy[curTag].y < 518){
                    curItem = drawAy[curTag];
                    if(curItem.y < 137){
                        index = 5;
                    }else if(curItem.y >= 137 && curItem.y < 211){
                        index = 4;
                    }else if(curItem.y >= 211 && curItem.y < 287){
                        index = 3;
                    }else if(curItem.y >= 287 && curItem.y < 365){
                        index = 2;
                    }else if(curItem.y >= 365 && curItem.y < 441){
                        index = 1;
                    }else if(curItem.y >= 441 && curItem.y < 518){
                        index = 0;
                    }

                    if(index == 10 ) return;
                    if(tmpAy[index] != null && curItem.getTag() != tmpAy[index].getTag()){
                        tmpTag = tmpAy[index].getTag()-11;
                        drawAy[tmpTag].setVisible(false);
                        drawAy[tmpTag].setPosition(cc.p(0,-500));
                        itemAy[tmpTag].setOpacity(255);
                        judgeAy[tmpTag] = false;
                    }
                    judgeAy[curTag] = true;
                    curItem.setScale(1);
                    tmpAy[index] = curItem;
                    curItem.setPosition(nodeAy[index].getPosition());

                }else{
                    drawAy[curTag].setVisible(false);
                    drawAy[curTag].setScale(1);
                    drawAy[curTag].setPosition(cc.p(0,-500));
                    itemAy[curTag].setOpacity(255);
                    judgeAy[curTag] = false;
                }
            }
        });
        for(var i = 0;i<6;i++){
            cc.eventManager.addListener(spriteListener.clone(),itemAy[i]);
            cc.eventManager.addListener(spriteListener.clone(),drawAy[i]);
        }

    },

    tableShowIn:function(){
        var self = this
        self.setTipAction(self.tableNode,2);
        self.scheduleOnce(function(){
            self.tableNode.setPosition(cc.p(568,-600));
        },0.3)
    },

    tableShowOut:function(){
        var self = this
        self.tableNode.setPosition(cc.p(568,320));
        self.tableNode.getChildByName("tableBg").setPosition(cc.p(0,0));
        self.setTipAction(self.tableNode.getChildByName("tableBg"),1)
        self.setTipAction(self.tableNode,1);
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
                    target.setLocalZOrder(curLocal)
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

    setTipAction : function(sprite,index){
        if(index == 1){
            sprite.setVisible(true);
            sprite.runAction(cc.scaleTo(0.2,1));
        }else if(index == 2){
            var call = new cc.CallFunc(function () {
                sprite.runAction(cc.scaleTo(0.2,0));
            });
            var call2 = new cc.CallFunc(function () {
                sprite.setVisible(false);
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(call, del, call2);
            sprite.runAction(seq);
        }
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
        ]
        
        
        addContent({
            people: this.nodebs,
            key: addList[1].key,
            img: addList[1].img,
            sound: addList[1].sound,
            //btnoffset: cc.p(0,0),
            //offset: cc.p(0, -20),
        })
        addContent({
            people: this.nodebs,
            key: addList[0].key,
            img: addList[0].img,
            sound: addList[0].sound,
            // offset: cc.p(0, 60),//15
            // btnoffset: cc.p(0,60),
        })
        addContent({
            people: this.nodebs,
            key: "do1_faxian",
            img: res.do1_faxian,
            sound: res.do1_faxian_sound,
            id: "result",
        })
    },
})