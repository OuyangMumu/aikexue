/**
 * Created by Administrator on 2016/7/25.
 */
var setLocal = 10
var tableFlag = true
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
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
        loadPlist("reqi_plist")
    	var tmpThis = this
    	var node = loadNode(res.wdhwdj_do2_json)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
        })

        var useLayer = node
        //tmpThis.setTip();
        var wenduji = useLayer.getChildByName("wenduji");
        var dingwei = wenduji.getChildByName("dingwei");
        var glass = useLayer.getChildByName("bei");
        var eye = useLayer.getChildByName("eye");
        var xianshi = useLayer.getChildByName("xianshi");
        var leftBtn = useLayer.getChildByName("leftbtn");
        var smallBtn = useLayer.getChildByName("smallbtn");
        var bigBtn = useLayer.getChildByName("bigbtn");
        var closeBtn = useLayer.getChildByName("closebtn");
        var panel = useLayer.getChildByName("Panel_4");
        var wenduji2 = panel.getChildByName("wenduji2");
        var tiao = useLayer.getChildByName("wenzi0001");
        var tiao2 = useLayer.getChildByName("aaa111_16");
        var useWayBtn = useLayer.getChildByName("useWaybtn");
        var du = wenduji.getChildByName("du");
        var wen2 = wenduji.getChildByName("wen2_10");
        var kedu = wenduji2.getChildByName("kedu");
        var du2 = wenduji2.getChildByName("du");
        tmpThis.nodeTable = useLayer.getChildByName("Node_1");

        du2.setScaleY(1.676);
        du.setScaleY(1.575);
        var up = eye.getChildByName("up");
        var down = eye.getChildByName("down");
        var jingmian = useLayer.getChildByName("jingmian");
        var touchAy = [];
        touchAy.push(panel);touchAy.push(eye);touchAy.push(tiao);touchAy.push(tiao2);touchAy.push(leftBtn);
        touchAy.push(smallBtn);touchAy.push(bigBtn);touchAy.push(closeBtn);
        jingmian.setTag(9);
        wenduji.setTag(11);
        dingwei.setTag(12);
        var check = true;
        var checkout = true;
        var checkin = true;

        tmpThis.temperature = 20
        tmpThis.wenduji = wenduji;
        tmpThis.wenduji2 = wenduji2;
        tmpThis.dingwei = dingwei;
        this.lock_dingwei=true;
        this.setTemperature(20,0);



        this.tablenode = new cc.Node()
        this.addChild(this.tablenode,100)

        tmpThis.setRandNum();

        var aangle = 0;
        var arand = Math.random() * 10;
        if(arand <5)
            aangle = -20;
        else
            aangle = 20;
        eye.setRotation(aangle);
        tmpThis.angle = eye.getRotation();
        up.addClickEventListener(function () {
            if (tmpThis.angle >= 45)
                tmpThis.angle = 45;
            tmpThis.angle += 5;
            eye.setRotation(tmpThis.angle);
            if (tmpThis.angle == 0) {
                tiao2.setVisible(true);
                tiao.setVisible(false);
            } else {
                tiao.setVisible(true);
                tiao2.setVisible(false);
            }
        });
        down.addClickEventListener(function () {
            if (tmpThis.angle <= -45)
                tmpThis.angle = -45;
            tmpThis.angle -= 5;
            eye.setRotation(tmpThis.angle);
            if (tmpThis.angle == 0) {
                tiao2.setVisible(true);
                tiao.setVisible(false);
            } else {
                tiao.setVisible(true);
                tiao2.setVisible(false);
            }
        });
        var num = 1;
        var num2 = 1;
        smallBtn.addClickEventListener(function () {
            if (num <= 0.7 || num2 >= 1.6) return;
            num = num / 1.3;
            num2 = num2 * 1.3;
            wenduji2.setScale(num);
            dingwei.setScale(num2);
            tmpThis.applyTemperatureToDingWei(tmpThis.temperature,0);
        });
        bigBtn.addClickEventListener(function () {
            if (num2 <= 0.7 || num >= 1.6) return;
            num = num * 1.3;
            num2 = num2 / 1.3;
            wenduji2.setScale(num);
            dingwei.setScale(num2);
            tmpThis.applyTemperatureToDingWei(tmpThis.temperature,0);
        });
        closeBtn.addClickEventListener(function () {
            for(var i = 0;i<8;i++){
                touchAy[i].setVisible(false);
            }
        });
        tmpThis.tableTip();
        tmpThis.useWay(useLayer);

        tmpThis.useFlag = true;
        useWayBtn.addClickEventListener(function () {
            if(tmpThis.useFlag){
                useBoard.setPosition(cc.p(568,320));
                useBoard.runAction(cc.scaleTo(0.2,1));
                if(tmpThis.tableNode)
                    useBoard.setLocalZOrder(tmpThis.tableNode.getLocalZOrder()+1)
                tmpThis.useFlag = false;
            }else {
                useBoard.runAction(cc.scaleTo(0.2,0));
                tmpThis.scheduleOnce(function () {
                    useBoard.setPositionY(-600)
                },0.3)
                tmpThis.useFlag = true;
            }
        })

         var spListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },

            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();

                if(target.getTag() ==9){
                    target.y += delta.y;
                    target.x += delta.x;
                    for(var i = 0;i<8;i++){
                        touchAy[i].x += delta.x;
                        touchAy[i].y += delta.y;
                    }

                } else if (target.getTag() == 12) {
                    target.y += delta.y;
                    var upY = wen2.getPositionY() + wen2.height/2;
                    var downY = wen2.getPositionY() - wen2.height/2;
                    if (target.y >= upY)
                        target.y = upY;
                    if (target.y <= downY)
                        target.y = downY;
                    eye.y -= delta.y*4.5;
                    if(touchAy[0].isVisible()){
                    if(eye.y > (panel.y+panel.height/2) || eye.y < (panel.y-panel.height/2)) {
                        eye.setVisible(false);
                        tmpThis.setEyeRota(eye);
                        tiao2.setVisible(false);
                        tiao.setVisible(false);
                    }
                    else
                        eye.setVisible(true);
                    }else{
                        eye.setVisible(false);
                    }

                    value = (target.y-170)/242*80+20;
                    tmpThis.applyTemperatureToDingWei(value,0);

                } else if (target.getTag() == 11) {
                    target.x += delta.x;
                    target.y += delta.y;
                    if (tmpThis.checkDistanceWithPoint(wenduji, glass) && check) {
                        check = false;
                        checkin = false;
                        checkout = true;
                    }


                    if (wenduji.y > (glass.y +10) && !check && checkout) {
                        checkout = false;
                        check = true;
                        checkin = true;
                        if(tmpThis.temperature !=20){
                            tmpThis.setTemperature(20,1);}
                        }

                    if (!checkin) {
                        if (wenduji.x >= 500) {//leftGlass
                            wenduji.setPosition(cc.p(500, wenduji.getPositionY()));
                        }
                        if (wenduji.x <= 375) {//rightGlass
                            wenduji.setPosition(cc.p(375, wenduji.getPositionY()));
                        }
                        if (wenduji.y <= 130) {//downGlass
                            wenduji.setPosition(cc.p(wenduji.getPositionX(), 130));
                        }
                        if ((wenduji.y < 205) && (wenduji.y > 140 ) && (wenduji.x <= 490) && (wenduji.x >= 380)) {
                            if(tmpThis.temperature !=tmpThis.wz) {
                                tmpThis.setTemperature(tmpThis.wz, 1);
                            }
                        }else if(wenduji.y <= 140 || wenduji.x <= 380 || wenduji.x >= 490 || (wenduji.y > 205 && wenduji.y<240)) {
                            if(tmpThis.temperature !=tmpThis.wz-3){
                                tmpThis.setTemperature(tmpThis.wz-3,1);
                            }
                        }else if(wenduji.y > 240 && wenduji.y<280) {
                            if (tmpThis.temperature != 20) {
                                tmpThis.setTemperature(20, 1);
                            }
                        }
                    }
                }
            },

            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                if (target.getTag() == 12) {
                    if(tmpThis.lock_dingwei){
                        tmpThis.setTemperature(tmpThis.temperature,0);
                        eye.setPositionY(panel.y-5);
                        eye.setVisible(true);
                        if (tmpThis.angle == 0) {
                            tiao2.setVisible(true);
                            tiao.setVisible(false);
                        } else {
                            tiao.setVisible(true);
                            tiao2.setVisible(false);
                        }
                    }else {
                        value = (target.y - 170) / 242 * 80 + 20;
                        tmpThis.applyTemperatureToDingWei(value, 0);
                    }

                    if(!touchAy[0].isVisible()){
                        for(var i = 0;i<8;i++){
                            touchAy[i].setVisible(true);
                            if(eye.getRotation() != 0)
                                touchAy[3].setVisible(false);
                            else
                                touchAy[2].setVisible(false);
                        }
                    }
                }

                if (!checkin) {
                    if ((wenduji.y > 205 && wenduji.y<240) && (wenduji.x >= 500 || wenduji.x <= 375)) {
                        tmpThis.displayTips(1);
                        return;
                    }else if ((wenduji.x >= 500 || wenduji.x <= 375) && wenduji.y <= 130) {
                        tmpThis.displayTips(4);
                        return;
                    }else if(wenduji.y > 205 && wenduji.y<240){
                        tmpThis.displayTips(0);
                        return;
                    }else if (wenduji.x >= 500 || wenduji.x <= 375) {
                        tmpThis.displayTips(2);
                        return;
                    }else if (wenduji.y <= 130) {
                        tmpThis.displayTips(3);
                        return;
                    }

                }
            }
        });

        cc.eventManager.addListener(spListener, wenduji);
        cc.eventManager.addListener(spListener.clone(), dingwei);
        cc.eventManager.addListener(spListener.clone(), jingmian);

    },

    setTemperature:function(value,second){
        this.temperature =value;
        var du = this.wenduji.getChildByName("du");
        var du2 = this.wenduji2.getChildByName("du");
        var v = 1.576*(value-20)/(100-20);
        var v2 = 1.673*(value-20)/(100-20);
        du.stopAllActions();
        du2.stopAllActions();
        if(second<=0){
            du.setScaleY(v);
            du2.setScaleY(v2);
        }
        else{
            du.runAction(cc.scaleTo(second,1,v));
            du2.runAction(cc.scaleTo(second,1,v2));
        }
        if(this.lock_dingwei){
            this.applyTemperatureToDingWei(value,second);
        }
    },

    applyTemperatureToDingWei:function(value,second){
        //y:170 , v:20;
        //y:170+242 ,v:100
        var dw_y = 170+242*(value-20)/(100-20);
        //y:127.5388 , v:20;
        //y:127.5388+1082 ,v:100
        var s_y = this.wenduji2.getScaleY();
        var wdj_y = 127.5388-1082*(value-20)/(100-20)*s_y;
        if(second<=0){
            this.dingwei.stopAllActions();
            this.wenduji2.stopAllActions();

            this.dingwei.setPositionY(dw_y);
            this.wenduji2.setPositionY(wdj_y);
        }
        else{
            this.dingwei.stopAllActions();
            this.wenduji2.stopAllActions();

            this.dingwei.runAction(cc.moveTo(second,cc.p(this.dingwei.getPositionX(),dw_y)));
            this.wenduji2.runAction(cc.moveTo(second,cc.p(this.wenduji2.getPositionX(),wdj_y)));
        }
    },

    checkDistanceWithPoint: function (target1, target2) {
        if (target1.getTag() == 11) {
            var dy = target1.y - (target2.y - 15);
            var dx = target1.x - target2.x;
            var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            if ( (target1.y > target2.y) && (distance <= 50)) {
                return true;
            }
        }

    },

    setRandNum:function(){
        var tmpThis = this;
        var num = 0 ;
        var rand = Math.random() * 10;
        if (rand < 2 && rand >0) num = 1;
        if (rand < 4 && rand >2) num = 2;
        if (rand < 5.5 && rand >4) num = 3;
        if (rand < 7 && rand >5.5) num = 4;
        if (rand < 9 && rand >7) num = 5;
        if (rand < 10 && rand >9) num = 6;
        switch (num){
            case 0:
                tmpThis.wz = 31;
                break;
            case 1:
                tmpThis.wz = 47;
                break;
            case 2:
                tmpThis.wz = 53;
                break;
            case 3:
                tmpThis.wz = 56;
                break;
            case 4:
                tmpThis.wz = 60;
                break;
            case 5:
                tmpThis.wz = 35;
                break;
            case 6:
                tmpThis.wz = 43;
                break;
        }
    },


    setEyeRota:function(eye){
        var tmpThis = this;
        var num = 1 ;
        var rand = Math.random() * 10;
        if (rand < 2 && rand >0) num = 1;
        if (rand < 4 && rand >2) num = 2;
        if (rand < 5.5 && rand >4) num = 3;
        if (rand < 7 && rand >5.5) num = 4;
        if (rand < 9 && rand >7) num = 5;
        if (rand < 10 && rand >9) num = 6;
        switch (num){
            case 1:
                tmpThis.angle = -30;
                break;
            case 2:
                tmpThis.angle = -10;
                break;
            case 3:
                tmpThis.angle = 15;
                break;
            case 4:
                tmpThis.angle = 40;
                break;
            case 5:
                tmpThis.angle = -20;
                break;
            case 6:
                tmpThis.angle = 30;
                break;
        }
        eye.setRotation(tmpThis.angle);
    },

    useWay: function (useLayer) {
        var tmpThis = this;
        useBoard = useLayer.getChildByName("useBoard");
        useBoard.setScale(0);
        useBoard.setPositionY(-600);
        safeAdd(tmpThis.tablenode,useBoard)
        if(tableNode)
           useBoard.setLocalZOrder(tableNode.getLocalZOrder()+1)
        useBoard.setLocalZOrder(10)

        var mc4 = useBoard.getChildByName("mc4");
        var panel3 = mc4.getChildByName("Panel_3");
        var mc4_du1 = panel3.getChildByName("way_4_27");
        var mc4_du2_1 = mc4.getChildByName("du3_33");
        var mc4_du2 = mc4_du2_1.getChildByName("du5_38");

        var mcay = [];
        var wenay = [];
        var stepay = [];
        var sixTog = [
            res.text1, res.text2, res.text3, res.text4, res.text5, res.text6, res.MC10001,
            res.MC20001, res.MC30001, res.MC40001, res.MC50001,
        ];

        var sixNoTog = [
            res.notext1, res.notext2, res.notext3, res.notext4, res.notext5, res.notext6,
            res.MC10002, res.MC20002, res.MC30002, res.MC40002, res.MC50002,
        ];

        for (var i = 1; i <= 5; i++) {
            var mcname = "mc" + i;
            var mcsp = useBoard.getChildByName(mcname);
            mcay.push(mcsp);
            var wenname = "wenzi00" + i;
            var wensp = useBoard.getChildByName(wenname);
            wenay.push(wensp);


            var toggle = new ccui.Button(sixTog[i+5],sixNoTog[i+5]);


            var stepNodeName = "stepNode" + i;
            var stepNode = useBoard.getChildByName(stepNodeName);
            stepNode.addChild(toggle);
            stepay.push(toggle);
            toggle.setTag(20 + i);

            toggle.addClickEventListener(function (selector,type) {
                for (var i = 0; i <= 4; i++) {
                    if (i != (selector.getTag() - 21)) {
                        mcay[i].setVisible(false);
                        wenay[i].setVisible(false);
                        stepay[i].loadTextures(sixTog[i+6],sixNoTog[i+6])
                    } else {
                        if(i == 3){
                            mc4_du1.setScaleY(1);
                            mc4_du2.setScaleY(1);
                            mc4_du1.runAction(cc.scaleTo(4,1,1.45));
                            mc4_du2.runAction(cc.scaleTo(4,1,1.2));
                        }
                        mcay[i].setVisible(true);
                        wenay[i].setVisible(true);
                        stepay[i].loadTextures(sixNoTog[i+6],sixTog[i+6])
                    }
                }
            });
        }

        stepay[0].loadTextures(sixNoTog[6],sixTog[6]) //display no1
        var closeBtn = useBoard.getChildByName("closebtn");
        closeBtn.addClickEventListener(function () {
            var scalere = new cc.ScaleTo(0.2,0);
            useBoard.runAction(scalere);
            tmpThis.scheduleOnce(function () {
                useBoard.setPositionY(-600)
            },0.3)
            tmpThis.useFlag = true;
        });
        tmpThis.getListener(useBoard);

    },

    tableShowIn:function(){
        var self = this
        self.setTipAction(tableNode,2)
        self.scheduleOnce(function(){
            tableNode.setPosition(cc.p(568,-600));
        },0.3)
    },

    tableShowOut:function(){
       var self = this
       self.setTipAction(tableNode,1)
       tableNode.getChildByName("table_Bg").setPosition(0,0)
       tableNode.getChildByName("table_Bg").setScale(0.8)
       tableNode.setLocalZOrder(useBoard.getLocalZOrder()+1)
    },


    displayTips: function(index){
        var tmpThis = this;
        var img = null
        switch (index){
            case 0:img = res.do2_tip1
                break
            case 1:img = res.do2_tip2
                break
            case 2:img = res.do2_tip3
                break
            case 3:img = res.do2_tip4
                break
            case 4:img = res.do2_tip5
                break
        }
        if(!img)    return
        AddDialog("Tips", {
            res: img,
            face: 2,
            confirmBtn:true,
        })
    },

    tableTip:function() {
        var tmpThis = this;
        tableNode = ccs.load(res.wdhwdj_tabelNode).node;
        if(tmpThis.nodeTable.getChildrenCount() !=0){
            var call = new cc.CallFunc(function () {
                var scalere = new cc.ScaleTo(0.2, 0);
                var a = tmpThis.nodeTable.getChildren();
                a[0].runAction(scalere);
            });
            var call2 = new cc.CallFunc(function () {
                tmpThis.nodeTable.removeAllChildren();
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(call, del, call2);
            tmpThis.runAction(seq);
        }else{
            //tmpThis.nodeTable.addChild(tableNode,30);
            tmpThis.tablenode.addChild(tableNode)
            //  if(useBoard){
            //     tableNode.setLocalZOrder(useBoard.getLocalZOrder()+1)
            // }
        }

        var tableBg = tableNode.getChildByName("table_Bg");
        tableNode.setScale(0);
        var scale = new cc.ScaleTo(0.2, 0.8);
        tableNode.setPosition(cc.p(568,-620))
        //tmpThis.nodeTable.addChild(tableNode);
        tableNode.runAction(scale);

        var closeBtn = tableBg.getChildByName("clossebtn");
        var clearBtn = tableBg.getChildByName("clearbtn");
        var resultBtn = tableBg.getChildByName("resultbtn");
        var submitBtn = tableBg.getChildByName("subbtn");
        var result = tableNode.getChildByName("tzbg");
        var close2Btn = result.getChildByName("close2btn");
        var wz = result.getChildByName("wz");
        wz.setString(tmpThis.wz);
        result.setScale(0);
        result.setPositionY(-400);
        var textList = []
        var resultList = [100,-10,1,tmpThis.wz]

        tableBg.table = true
        tmpThis.getListener(tableBg);
        var yay = [];
        var nay = [];
        for (var i = 1; i <= 4; i++) {
            var textname = "input" + i
            var text = tableBg.getChildByName(textname)
            textList.push(text)
            addInput({
                item:text,
                strlen:3,
                size:36,
                color:cc.color(255,0,0,255),
            })
            var yName = "y" + i;
            var ysp = tableBg.getChildByName(yName);
            yay.push(ysp);
            var nName = "n" + i;
            var nsp = tableBg.getChildByName(nName);
            nay.push(nsp);
        }

        closeBtn.addClickEventListener(function () {
            tmpThis.setTipAction(tableNode,2)
            tmpThis.scheduleOnce(function(){
                tableNode.setPosition(cc.p(568,-600));
            },0.3)
            tableFlag = true
        });
        clearBtn.addClickEventListener(function () {
            for (var i = 0; i <= 3; i++) {
                textList[i].clear()
                yay[i].setVisible(false);
                nay[i].setVisible(false);
            }
        });
        var reFlag = true;
        tmpThis.getListener(result);
        resultBtn.addClickEventListener(function () {
            //for (var i = 0; i <= 3; i++) {
            //    if(textList[i].input)
            //        textList[i].input.setString(resultList[i])
            //    yay[i].setVisible(false);
            //    nay[i].setVisible(false);
            //}
            if (reFlag) {
                result.setScale(0);
                result.setPosition(cc.p(0,0));
                result.setVisible(true);
                var scale = new cc.ScaleTo(0.2, 1);
                result.runAction(scale);
                result.setLocalZOrder(tableBg.getLocalZOrder()+1)
                var aa = tableBg.getLocalZOrder()+1
                reFlag = false;
            } else {
                var call = new cc.CallFunc(function () {
                    var scalere = new cc.ScaleTo(0.2, 0);
                    result.runAction(scalere);
                });
                var call2 = new cc.CallFunc(function () {
                    result.setVisible(false);
                    result.setPosition(cc.p(0,-400));
                });
                var del = new cc.DelayTime(0.2);
                var seq = new cc.Sequence(call, del, call2);
                result.runAction(seq);
                reFlag = true;
            }
        });
        submitBtn.addClickEventListener(function () {
            for(var i = 0 ; i < resultList.length ; i++){
                if(textList[i].getStr()){
                    if(resultList[i] == textList[i].getStr()){
                        yay[i].setVisible(true)
                        nay[i].setVisible(false)
                    }else{
                        yay[i].setVisible(false)
                        nay[i].setVisible(true)
                    }
                }else{
                    yay[i].setVisible(false)
                    nay[i].setVisible(false)
                }
            }
        });
        close2Btn.addClickEventListener(function () {
            var call = new cc.CallFunc(function () {
                var scalere = new cc.ScaleTo(0.2, 0);
                result.runAction(scalere);
            });
            var call2 = new cc.CallFunc(function () {
                result.setVisible(false);
                result.setPosition(cc.p(0,-400));
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(call, del, call2);
            result.runAction(seq);
            reFlag = true;
        });
    },

    setTipAction : function(sprite,index){
        if(index == 1){
            sprite.setPosition(cc.p(568,320))
            sprite.runAction(cc.scaleTo(0.2,1));
        }else if(index == 2){
            var call = new cc.CallFunc(function () {
                sprite.runAction(cc.scaleTo(0.2,0));
            });
            var call2 = new cc.CallFunc(function () {
                sprite.setPosition(cc.p(320,-600));
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(call, del, call2);
            sprite.runAction(seq);
        }
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
                    if(target.table)
                        target.getParent().setLocalZOrder(setLocal)
                    target.setLocalZOrder(setLocal)
                    setLocal = setLocal + 1
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

                var ani = function(start,end) {
            return cc.sequence(createAnimation({
                frame: "reqi%02d.png",
                start: start,
                end: end,
                time:0.1
            }))
        }
        var aniRever = function(start,end) {
            return cc.sequence(createAnimation({
                frame: "reqi%02d.png",
                start: start,
                end: end,
                time:0.1,
                rever:true,
            }))
        }

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp 
        }

        //热气
        var self = this
        for(var i = 0 ; i < 3 ; i++){
            var hot = createSp("#reqi01.png",cc.p(560+i*40,390),self)
            hot.setScale(3,1.5)
            hot.runAction(cc.repeatForever(cc.sequence(
                ani(1+i*2,15-i*2),
                aniRever(1+i*2,15-i*2)
            )))
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)  
	},

})
