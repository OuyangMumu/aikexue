/**
 * Created by Administrator on 2016/7/22.
 */
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
            });
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI: function () {
        var self = this
        var node = loadNode(res.bjbtdtr_do1_json)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_tip1"})
        })

        var doLayer = node
        this.pourBtn = doLayer.getChildByName("pourbtn");
        var st = doLayer.getChildByName("st");
        var nt = doLayer.getChildByName("nt");
        var rt = doLayer.getChildByName("rt");
        self.tableNode = doLayer.getChildByName("tableNode");

        var bottle1 = doLayer.getChildByName("bottle1");
        var bottle2 = doLayer.getChildByName("bottle2");
        var bottle3 = doLayer.getChildByName("bottle3");
        var stNode = doLayer.getChildByName("stNode");
        var b1Node = doLayer.getChildByName("bottle1Node");
        var dsNode1 = doLayer.getChildByName("dsNode1");
        var ntNode = doLayer.getChildByName("ntNode");
        var b2Node = doLayer.getChildByName("bottle2Node");
        var dsNode2 = doLayer.getChildByName("dsNode2");
        var rtNode = doLayer.getChildByName("rtNode");
        var b3Node = doLayer.getChildByName("bottle3Node");
        var dsNode3 = doLayer.getChildByName("dsNode3");

        st.setTag(11);
        nt.setTag(12);
        rt.setTag(13);
        this.pourBtn.addClickEventListener(function(){
            if(!self.pourBtn.isVisible())  return;
            self.stAndpureAni(res.bjbtdtr_dsAni,290,dsNode1);
            self.rbAndlsAni(res.bjbtdtr_stlsAni,570,b1Node);
            self.stAndpureAni(res.bjbtdtr_dsAni,290,dsNode2);
            self.rbAndlsAni(res.bjbtdtr_sntlsAni,570,b2Node);
            self.stAndpureAni(res.bjbtdtr_dsAni,290,dsNode3);
            self.rbAndlsAni(res.bjbtdtr_rtlsAni,570,b3Node);
            self.pourBtn.setVisible(false);
        });
        self.tableDisplay()
        var pcount = 0
        var touchListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            onTouchBegan:function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(target.getTag() == 11 && st.isVisible()){
                        st.setVisible(false);
                        self.rbAndlsAni(res.bjbtdtr_stAni,35,stNode);
                    }
                    if(target.getTag() == 12 && nt.isVisible()){
                        nt.setVisible(false);
                        self.rbAndlsAni(res.bjbtdtr_sntAni,35,ntNode);
                    }
                    if(target.getTag() == 13 && rt.isVisible()){
                        rt.setVisible(false);
                        self.rbAndlsAni(res.bjbtdtr_srtAni,35,rtNode);
                    }
                    return true
                }
                return false
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;

                if(target.getTag() == 11 && !st.isVisible()){
                    stNode.x += delta.x;
                    stNode.y += delta.y;
                    if(self.checkPoint(target,bottle1)){
                        stNode.setPosition(cc.p(65,410));
                        bottle1.removeFromParent();
                        st.removeFromParent();
                        self.stAndpureAni(res.bjbtdtr_stAni2,160,stNode);
                        self.rbAndlsAni(res.bjbtdtr_strbAni,110,b1Node);
                        pcount++;
                        self.setPourBtn(pcount);
                    }
                }
                if(target.getTag() == 12 && !nt.isVisible()){
                    ntNode.x += delta.x;
                    ntNode.y += delta.y;
                    if(self.checkPoint(target,bottle2)){
                        ntNode.setPosition(cc.p(370,410));
                        bottle2.removeFromParent();
                        nt.removeFromParent();
                        self.stAndpureAni(res.bjbtdtr_sntAni2,160,ntNode);
                        self.rbAndlsAni(res.bjbtdtr_sntrbAni,110,b2Node);
                        pcount++;
                        self.setPourBtn(pcount);
                    }
                }
                if(target.getTag() == 13 && !rt.isVisible()){
                    rtNode.x += delta.x;
                    rtNode.y += delta.y;
                    if(self.checkPoint(target,bottle3)){
                        rtNode.setPosition(cc.p(640,410));
                        bottle3.removeFromParent();
                        rt.removeFromParent();
                        self.stAndpureAni(res.bjbtdtr_srtAni2,160,rtNode);
                        self.rbAndlsAni(res.bjbtdtr_rtrbAni,110,b3Node);
                        pcount++;
                        self.setPourBtn(pcount);
                    }
                }

            },
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget();
                if(target.getTag() == 11 && !st.isVisible()){
                    st.setVisible(true);
                    stNode.removeAllChildren();
                    st.setPosition(cc.p(200,155));
                    stNode.setPosition(cc.p(110,190));
                }
                if(target.getTag() == 12 && !nt.isVisible()){
                    nt.setVisible(true);
                    ntNode.removeAllChildren();
                    nt.setPosition(cc.p(500,155));
                    ntNode.setPosition(cc.p(410,190));
                }
                if(target.getTag() == 13 && !rt.isVisible()){
                    rt.setVisible(true);
                    rtNode.removeAllChildren();
                    rt.setPosition(cc.p(800,155));
                    rtNode.setPosition(cc.p(710,190));
                }


            }
        });
        cc.eventManager.addListener(touchListener,st);
        cc.eventManager.addListener(touchListener.clone(),nt);
        cc.eventManager.addListener(touchListener.clone(),rt);

    },

    setPourBtn : function (index) {
        var self = this
        if(index >= 3){
            self.scheduleOnce(function () {
                self.pourBtn.setVisible(true);
                self.nodebs.say({key:"do1_tip2",force:true})
            },3)
        }
    },

    checkPoint:function(target1,target2){
        var dy = target1.y - (target2.y+55);
        var dx = target1.x - (target2.x-30);
        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
        if(distance < 35){
            return true;
        }
        return false;
    },

    rbAndlsAni:function(name,frame,node){
        node.removeAllChildren();
        var psp = ccs.load(name).node;
        var pac = ccs.load(name).action;
        node.addChild(psp);
        pac.gotoFrameAndPlay(0,frame,false);
        pac.setLastFrameCallFunc(function(){
            //node.removeAllChildren();
        });
        psp.runAction(pac);
    },

    stAndpureAni:function(name,frame,node){
        node.removeAllChildren();
        var psp = ccs.load(name).node;
        var pac = ccs.load(name).action;
        node.addChild(psp);
        pac.gotoFrameAndPlay(0,frame,false);
        pac.setLastFrameCallFunc(function(){
            node.removeAllChildren();
        });
        psp.runAction(pac);
    },

    tableDisplay:function(){
        var tmpThis = this;
        table = ccs.load(res.bjbtdtr_tableNode).node;
        tmpThis.tableNode.addChild(table);
        tmpThis.tableNode.setScale(0);
        tmpThis.tableNode.setPosition(cc.p(-1000,320));

        var tableBg = table.getChildByName("table_Bg");
        tableBg.setTag(111);
        //table.setScale(0);
        //table.runAction(cc.scaleTo(0.2,1,1));

        var laBtnAy = [];
        var cellBtnAy = [];
        var yesAy = [];
        var noAy = [];
        var textAy = [];
        var curNumAy = [0,0,0,0,0,0,0,0,0];
        var resultAy = [1,1,3,3,3,1,2,2,2];
        var closeBtn = tableBg.getChildByName("closebtn");
        var clearBtn = tableBg.getChildByName("clearbtn");
        var resultBtn = tableBg.getChildByName("resultbtn");
        var subBtn = tableBg.getChildByName("subbtn");
        var phe = tableBg.getChildByName("phe");
        var panel = tableBg.getChildByName("Panel_1");
        var panelMove = panel.getChildByName("Panel_2");
        var pheFlag = true;
        var _tag  = 0;
        panel.setVisible(false);
        this.scheduleOnce(function(){
            panel.setVisible(true);
        },0.2);
        for(var i = 1;i<10;i++){
            var name = "labtn"+i;
            var lasp = tableBg.getChildByName(name);
            lasp.setTag(20+i);
            laBtnAy.push(lasp);
            var n2 = "cellbtn"+i;
            var cellsp = tableBg.getChildByName(n2);
            cellBtnAy.push(cellsp);
            cellsp.setTag(20+i);
            var yn = "yes"+i;
            var ysp = tableBg.getChildByName(yn);
            ysp.setVisible(false);
            yesAy.push(ysp);
            var nn = "no"+i;
            var nsp = tableBg.getChildByName(nn);
            nsp.setVisible(false);
            noAy.push(nsp);
            var textName = "text"+i;
            var textsp = tableBg.getChildByName(textName);
            textAy.push(textsp);


            var tagFlag = true;
            lasp.addClickEventListener(function(){
                if(_tag == this.getTag() && tagFlag){
                    tmpThis.move_Panel_in(panelMove,panel);
                    tagFlag = false;
                    return;
                }
                tmpThis.move_Panel_out(panelMove,panel);
                panel.setPosition(cc.p(this.x-45,this.y-18));
                _tag = this.getTag();
                tagFlag = true;
            });
            cellsp.addClickEventListener(function(){
                if(_tag == this.getTag() && tagFlag){
                    tmpThis.move_Panel_in(panelMove,panel);
                    tagFlag = false;
                    return;
                }
                tmpThis.move_Panel_out(panelMove,panel);
                panel.setPosition(cc.p(this.x+23,this.y-18));
                _tag = this.getTag();
                tagFlag = true;
            });

            var Listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches:true,
                onTouchBegan: function(touch,event){
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(0, 0, s.width, s.height);

                    if(cc.rectContainsPoint(rect,locationInNode)) {
                        return true;
                    }
                    return false
                },
                onTouchMoved:function(touch,event){
                    var target = event.getCurrentTarget();
                    var delta = touch.getDelta();
                    if(target.getTag() != 111)
                        return;
                    tableBg.x += delta.x;
                    tableBg.y += delta.y;

                },
                onTouchEnded:function(touch,event){}
            });

            cc.eventManager.addListener(Listener,tableBg);

        }

        var btn1 = panelMove.getChildByName("btn1");
        var btn2 = panelMove.getChildByName("btn2");
        var btn3 = panelMove.getChildByName("btn3");
        var btn4 = panelMove.getChildByName("btn4");
        btn1.addClickEventListener(function(){
            textAy[_tag - 21].setString("");
            curNumAy[_tag - 21] = 0;
            tmpThis.move_Panel_in(panelMove,panel);
            tagFlag = false;
        });
        btn2.addClickEventListener(function(){
            textAy[_tag - 21].setString("最好");
            curNumAy[_tag - 21] = 1;
            tmpThis.move_Panel_in(panelMove,panel,tagFlag);
            tagFlag = false;
        });
        btn3.addClickEventListener(function(){
            textAy[_tag - 21].setString("一般");
            curNumAy[_tag - 21] = 2;
            tmpThis.move_Panel_in(panelMove,panel);
            tagFlag = false;
        });
        btn4.addClickEventListener(function(){
            textAy[_tag - 21].setString("最差");
            curNumAy[_tag - 21] = 3;
            tmpThis.move_Panel_in(panelMove,panel);
            tagFlag = false;
        });

        closeBtn.addClickEventListener(function(){
            tmpThis.setTipAction(tmpThis.tableNode,2);
            tmpThis.scheduleOnce(function(){
                tmpThis.tableNode.setPosition(cc.p(-1000,320));
            },0.3)
            tableFlag = true;
        });
        clearBtn.addClickEventListener(function(){
            phe.setVisible(false);
            pheFlag = true;
            for(var i = 0;i<9;i++){
                textAy[i].setString("");
                curNumAy[i] = 0;
                yesAy[i].setVisible(false);
                noAy[i].setVisible(false);
            }
        });
        resultBtn.addClickEventListener(function(){
            if(pheFlag){
                phe.setVisible(true);
                pheFlag = false;
            }else{
                phe.setVisible(false);
                pheFlag = true;
            }

        });
        subBtn.addClickEventListener(function(){
            for(var i = 0;i<9;i++){
                if(curNumAy[i] == 0)   {
                    noAy[i].setVisible(false);
                    yesAy[i].setVisible(false);
                    continue;
                }
                if(curNumAy[i] == resultAy[i]){
                    noAy[i].setVisible(false);
                    yesAy[i].setVisible(true);
                }else{
                    yesAy[i].setVisible(false);
                    noAy[i].setVisible(true);
                }


            }
        });
    },

    move_Panel_in:function(panelMove,panel){
        var tmpThis = this;
        var call = new cc.CallFunc(function(){
            panelMove.runAction(cc.moveTo(0.2,69,340));
        });
        var call2 = new cc.CallFunc(function(){
            panel.setScaleY(0);
        });
        var del = new cc.DelayTime(0.2);
        var seq = new cc.Sequence(call,del,call2);
        tmpThis.runAction(seq);
    },

    move_Panel_out:function(panelMove,panel){
        panel.setScaleY(1);
        panelMove.setPositionY(340);
        panelMove.runAction(cc.moveTo(0.2,69,170));
    },

    tableShowIn:function(){
        var self = this
        self.setTipAction(self.tableNode,2);
            self.scheduleOnce(function(){
            self.tableNode.setPosition(cc.p(-1000,320));
        },0.3);
    },

    tableShowOut:function(){
        var self = this
        safeAdd(self,self.tableNode)
        self.tableNode.setLocalZOrder(self.nodebs.getLocalZOrder()+1)
        self.tableNode.setPosition(cc.p(568,320));
        table.getChildByName("table_Bg").setPosition(cc.p(0,0));
        self.setTipAction(self.tableNode,1);
        table.setScale(0.9)
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
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,99)

        addContent({
            people: this.nodebs,
            key: "do1_tip1",
            img: res.do1_tip1,
            sound: res.do1_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "do1_tip2",
            img: res.do1_tip2,
            sound: res.do1_sound2,
        })
    },
})
