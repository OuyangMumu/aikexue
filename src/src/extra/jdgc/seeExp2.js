/**
 * Created by Administrator on 2016/7/24.
 */
var curLocal = 20
var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp2",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor({
            settingData:{
                pos: cc.p(2000, 580),
            },
            vis:false,
            btnOff: cc.p(100, 12),
        });
        //this.initPeople();
        this.initUI();
        return true;
    },

    initUI: function () {
        var self = this
        var tmpThis = this
        var node = loadNode(res.jdgc_see2_json)
        self.inside_node.addChild(node)

        var seeLayer = node
        var plantAy = [];
        fixedAy = [];
        dragAy = [];
        fdAy = [];
        bigPicAy = [];
        tuclose_btn_Ay = [];
        upBtn = seeLayer.getChildByName("upbtn");
        downBtn = seeLayer.getChildByName("downbtn");
    	var panel = seeLayer.getChildByName("Panel");
        ydNode = panel.getChildByName("Node");

        var resultBtn = seeLayer.getChildByName("resultbtn");
        var submitBtn = seeLayer.getChildByName("subbtn");

        var resultPic = new cc.Sprite("res/extra/jdgc/see/see2/resultPic.png");
        resultPic.setPosition(cc.p(100,-300));
        resultPic.setVisible(false);
        this.addChild(resultPic,12);
        var resultClose_btn = new ccui.Button("res/btn/btn_result_quit_normal.png","res/btn/btn_result_quit_select.png");
        resultClose_btn.setPosition(cc.p(645,510));
        resultPic.addChild(resultClose_btn);

        var cloudBg = new cc.Sprite("res/extra/jdgc/see/see2/CloudBG.png");
        cloudBg.setPosition(cc.p(100,-300));
        this.addChild(cloudBg,11);
        self.getListener(cloudBg)
        cloudBg.setVisible(false);
        var faceSp = new cc.Sprite("res/extra/jdgc/see/see2/TipsFace0002.png");
        faceSp.setPosition(cc.p(83,302));
        cloudBg.addChild(faceSp);
        var sureBtn = new ccui.Button("res/extra/jdgc/see/see2/QuitBtn0001.png","res/extra/jdgc/see/see2/QuitBtn0003.png");
        cloudBg.addChild(sureBtn);
        sureBtn.setPosition(250,70);
        var closeBtn = new ccui.Button("res/btn/btn_result_quit_normal.png","res/btn/btn_result_quit_select.png");
        cloudBg.addChild(closeBtn);
        closeBtn.setPosition(400,315);
        var zaixiangSp = new cc.Sprite("res/extra/jdgc/see/see2/zaixiang.png");
        zaixiangSp.setPosition(250,200);
        zaixiangSp.setVisible(false);
        cloudBg.addChild(zaixiangSp);
        var doyesSp = new cc.Sprite("res/extra/jdgc/see/see2/doYes.png");
        doyesSp.setPosition(250,200);
        doyesSp.setVisible(false);
        cloudBg.addChild(doyesSp);

        var moveSprite = seeLayer.getChildByName("moveSprite");
        moveSprite.setTag(111);
        var pfNode = panel.getChildByName("pfNode");
        for(var i = 1;i<13;i++) {
            var nName = "Node" + i;
            var nsp = ydNode.getChildByName(nName);
            plantAy.push(nsp);
            nsp.setTag(10 + i);

            var aname = "res/extra/jdgc/see/see2/aa" + i + ".png";
            var asp = new cc.Sprite(aname);
            fixedAy.push(asp);

            var asp_2 = new cc.Sprite(aname);
            dragAy.push(asp_2);
            asp.setTag(30 + i);

            asp_2.setTag(50 + i);
            asp_2.setPosition(cc.p(0, -500));
            asp_2.setVisible(false);
            tmpThis.addChild(asp_2);

            var fdBtn = new ccui.Button("res/extra/jdgc/see/see2/fd.png", "res/extra/jdgc/see/see2/fd2.png");
            fdAy.push(fdBtn);
            asp_2.addChild(fdBtn);
            fdBtn.setPosition(cc.p(102, 16));
            fdBtn.setTag(70 + i);
            fdBtn.setVisible(false);

            nsp.addChild(asp);

            var bigName = "res/extra/jdgc/see/see2/tu" + i + ".png";
            var bigImg = new cc.Sprite(bigName);
            bigPicAy.push(bigImg);
            bigImg.setPosition(cc.p(0, -100));
            tmpThis.addChild(bigImg);
            bigImg.setTag(90 + i);
            bigImg.setVisible(false);

            var tuCloseBtn = new ccui.Button("res/btn/btn_tipclose_normal.png", "res/btn/btn_tipclose_select.png");
            bigImg.addChild(tuCloseBtn);
            tuclose_btn_Ay.push(tuCloseBtn);
            tuCloseBtn.setPosition(cc.p(182, 236));

            tuCloseBtn.addClickEventListener(function (sender, event) {
                sender.getParent().setVisible(false);
                sender.getParent().setPosition(cc.p(0, -100));
            });
            fdBtn.addClickEventListener(function (sender, event) {
                var curTag = sender.getTag() - 71;
                bigPicAy[curTag].setVisible(true);
                bigPicAy[curTag].setLocalZOrder(10);
                bigPicAy[curTag].setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
            });
        }
            _num = 1;
         changeNum = seeLayer.getChildByName("changeNum");
        upBtn.addClickEventListener(function(){
            if(!upBtn.isVisible() && ydNode.y <= 450)   return;
            if(ydNode.y < 1000)   upBtn.setVisible(false);
            ydNode.runAction(cc.moveTo(0.1,cc.p(ydNode.x,ydNode.y-475)));
            downBtn.setVisible(true);
            _num--;
            if(_num <= 1)  _num = 1;
            tmpThis.setNumImg(_num);
        });
        downBtn.addClickEventListener(function(){
            if(!downBtn.isVisible() && ydNode.y >= 1400)     return;
            if(ydNode.y > 900)    downBtn.setVisible(false);
            ydNode.runAction(cc.moveTo(0.1,cc.p(ydNode.x,ydNode.y+475)));
            upBtn.setVisible(true);
            _num++;
            if(_num >= 3)  _num = 3;
            tmpThis.setNumImg(_num);
        });

        var resultFlag = true;
        self.getListener(resultPic);
        resultBtn.addClickEventListener(function() {
            if (resultFlag) {
                tmpThis.setDisappear(resultPic, resultFlag);
                resultPic.setLocalZOrder(cloudBg.getLocalZOrder()+1)
                resultFlag = false;
            } else {
                tmpThis.setDisappear(resultPic, resultFlag);
                resultFlag = true;
            }
        });
        resultClose_btn.addClickEventListener(function(){
            tmpThis.setDisappear(resultPic,resultFlag);
            resultFlag = true;
        });
        closeBtn.addClickEventListener(function(){
            var flag = false;
            zaixiangSp.setVisible(false);
            doyesSp.setVisible(false);
            tmpThis.setDisappear(cloudBg,flag);
            stopMusic()
        });
        sureBtn.addClickEventListener(function(){
            var flag = false;
            zaixiangSp.setVisible(false);
            doyesSp.setVisible(false);
            tmpThis.setDisappear(cloudBg,flag);
            stopMusic()
        });


        submitBtn.addClickEventListener(function(){
            if(cloudBg.isVisible())   return;
            if(oneAy.length == 0 && twoAy.length == 0 &&
                threeAy.length == 0 && fourAy.length == 0){
                var flag = true;
                playMusic(res.sound_fault_bs);
                zaixiangSp.setVisible(true);
                tmpThis.setDisappear(cloudBg,flag);
            }else{
                var judgeFlag = true
                var resultAy = [2,10,3,5,8,4,9,1,6,7,11,12];
                for (var i = 0; i < oneAy.length; i++) {
                    if(oneAy[i]){
                        var one = oneAy[i].getTag() - 50
                        if(one != resultAy[0] && one != resultAy[1] && one != resultAy[2]){
                            judgeFlag = false
                        }

                    }
                }
                for(var i = 0;i< twoAy.length;i++){
                    if(twoAy[i]){
                        var two = twoAy[i].getTag() - 50
                        if(two != resultAy[3] && two != resultAy[4] && two != resultAy[5]){
                            judgeFlag = false
                        }
                    }
                }
                for(var i = 0;i<threeAy.length;i++){
                    if(threeAy[i]){
                        var three = threeAy[i].getTag() - 50
                        if(three != resultAy[6] && three != resultAy[7] && three != resultAy[8]){
                            judgeFlag = false
                        }
                    }
                }
                for(var i = 0;i<fourAy.length;i++){
                    if(fourAy[i]){
                        var four = fourAy[i].getTag() - 50
                        if(four != resultAy[9] && four != resultAy[10] && four != resultAy[11]){
                            judgeFlag = false
                        }
                    }
                }

                var judgeTrue = function(){
                    var flag = true;
                    playMusic(res.sound_right_bs);
                    doyesSp.setVisible(true);
                    tmpThis.setDisappear(cloudBg,flag);
                    cloudBg.setLocalZOrder(resultPic.getLocalZOrder()+1)
                }
                var judgeFlase = function(){
                    playMusic(res.sound_fault_bs);
                    var flag = true;
                    zaixiangSp.setVisible(true);
                    tmpThis.setDisappear(cloudBg,flag);
                    cloudBg.setLocalZOrder(resultPic.getLocalZOrder()+1)
                }

                if(judgeFlag){
                    judgeTrue()
                }else{
                    judgeFlase()
                }
            }
        });

        var startpos = 0;
        var endpos = 0;
        var curIndex = 0;
        var start_sp_x = 0;
        var move_sp_x = 0;
        var move_pos_y = 0;
        var start_pos_y = 0
        oneAy = [];
        twoAy = [];
        threeAy = [];
        fourAy = [];
        //var flag_dragSprite = false;
        judgeAy = [false,false,false,false,false,false,false,false,false,false,false,false];
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

                    if(target.getTag() > 30 && target.getTag() < 50)
                        curIndex = target.getTag() - 31;
                    else if(target.getTag() > 70 && target.getTag() < 90)
                        curIndex = target.getTag() - 71;
                    else if(target.getTag() > 90 && target.getTag() < 110)
                        curIndex = target.getTag() - 91;

                    startpos = ydNode.y;
                    start_pos_y = touch.getLocationY();
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                move_pos_y = touch.getLocationY();
                move_sp_x = touch.getLocationX();

                if((start_sp_x - move_sp_x > 80) && (target.getTag() > 30 && target.getTag() < 50)
                    && target.getOpacity() > 200 && (touch.getLocationY() > 60 && touch.getLocationY() < 530)){
                    dragAy[curIndex].setVisible(true);
                    dragAy[curIndex].setLocalZOrder(10);
                    fixedAy[curIndex].setOpacity(150);
                    dragAy[curIndex].setPosition(touch.getLocation());
                    dragAy[curIndex].alter = 0;
                    moveSprite.pause();
                    if(ydNode.y != startpos)
                        ydNode.runAction(cc.moveTo(0.01,cc.p(ydNode.x,startpos)));
                }

                if(target.getTag() == 111 && touch.getLocationX() > 900 &&
                    (move_pos_y - start_pos_y >50 || start_pos_y - move_pos_y >50)){
                    ydNode.y += delta.y;
                }

                if((target.getTag()>50 && target.getTag()<70) || !judgeAy[curIndex]){
                    dragAy[curIndex].x += delta.x;
                    dragAy[curIndex].y += delta.y;
                }
            },
            onTouchEnded:function(touch,event) {
                var target = event.getCurrentTarget();
                judgeAy[curIndex] = true;
                moveSprite.resume();
                if(target.getTag()>90 && target.getTag() < 110)    return;

                endpos = ydNode.y;
                if(target.getTag() == 111) {
                    tmpThis.movePanel(startpos, endpos);
                }
                tmpThis.dragPlant(curIndex,target);


            }
        });
        var dragTouchListener = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    if(target.getTag() > 50 && target.getTag() < 70)
                        curIndex = target.getTag() - 51;
                    else if(target.getTag() > 90 && target.getTag() < 110)
                        curIndex = target.getTag() - 91;

                    if((target.getTag() > 50 && target.getTag() < 70) && target.isVisible()){
                        dragAy[curIndex].setVisible(true);
                        dragAy[curIndex].setPosition(touch.getLocation());
                        fdAy[curIndex].setVisible(false);
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                if((target.getTag()>50 && target.getTag()<70) || !judgeAy[curIndex]){
                    dragAy[curIndex].x += delta.x;
                    dragAy[curIndex].y += delta.y;
                }
                if(target.getTag()>90 && target.getTag()<110 && bigPicAy[curIndex].isVisible()){
                    bigPicAy[curIndex].x += delta.x;
                    bigPicAy[curIndex].y += delta.y;
                }
            },
            onTouchEnded:function(touch,event) {
                var target = event.getCurrentTarget();
                tmpThis.dragPlant(curIndex,target);
            }
        });
        for(var i = 0;i<12;i++){
            cc.eventManager.addListener(dragTouchListener.clone(), dragAy[i]);
            cc.eventManager.addListener(dragTouchListener.clone(),bigPicAy[i]);
        }
        for(var i = 0;i<12;i++){
            cc.eventManager.addListener(touchListener.clone(),fixedAy[i]);
        }
        cc.eventManager.addListener(touchListener.clone(),moveSprite);
    },
    dragPlant: function (curIndex,target) {
        var tmpThis = this;
        if(dragAy[curIndex].x > 860 || dragAy[curIndex].x < 215 ||
            dragAy[curIndex].y > 530 || dragAy[curIndex].y < 50){

            dragAy[curIndex].setVisible(false);
            dragAy[curIndex].setPositionY(-100);
            judgeAy[curIndex] = false;
            fixedAy[curIndex].setOpacity(255);
            tmpThis.resetPosition(curIndex,-1,target);
            dragAy[curIndex].alter = -1;
        }else{
            if(dragAy[curIndex].y <= 170){
                tmpThis.resetPosition(curIndex,1,target);
            }else if(dragAy[curIndex].y <= 290 && dragAy[curIndex].y > 170){
                tmpThis.resetPosition(curIndex,2,target);
            }else if(dragAy[curIndex].y <= 415 && dragAy[curIndex].y > 290){
                tmpThis.resetPosition(curIndex,3,target);
            }else if(dragAy[curIndex].y <= 530 && dragAy[curIndex].y > 415){
                tmpThis.resetPosition(curIndex,4,target);
            }
        }
    },

    movePanel:function(startpos,endpos){
        var tmpThis = this;
        if(endpos > startpos && (endpos - startpos > 70)){
            if(!downBtn.isVisible() || ydNode.y >= 1400){
                ydNode.runAction(cc.moveTo(0.01,cc.p(ydNode.x,1400)));//startpos
                tmpThis.setNumImg(3);
                return;
            }
            if(ydNode.y > 925)
                downBtn.setVisible(false);
            upBtn.setVisible(true);
            ydNode.runAction(cc.moveTo(0.05,cc.p(ydNode.x,startpos+475)));
            _num++;
            if(_num <= 1)  _num = 1;
            tmpThis.setNumImg(_num);
        }else if(endpos < startpos && (startpos - endpos > 70)){
            if(!upBtn.isVisible() || ydNode.y <= 450){
                ydNode.runAction(cc.moveTo(0.01,cc.p(ydNode.x,450)));
                tmpThis.setNumImg(1);
                return;
            }
            if(ydNode.y < 900)
                upBtn.setVisible(false);
            downBtn.setVisible(true);
            ydNode.runAction(cc.moveTo(0.05,cc.p(ydNode.x,startpos-475)));
            _num--;
            if(_num >= 3)  _num = 3;
            tmpThis.setNumImg(_num);
        }else{
            ydNode.runAction(cc.moveTo(0.01,cc.p(ydNode.x,startpos)));
        }
    },

    resetPosition:function(curIndex,curAy,target){
        var tmpThis = this;
        if(curAy != -1){
            fdAy[curIndex].setVisible(true); //display fd
        }
        if(dragAy[curIndex].alter != curAy){
            tmpThis.getArea(dragAy[curIndex].alter,target);
            if(dragAy[curIndex].x < 860 && dragAy[curIndex].x > 215){
                if(dragAy[curIndex].y <= 170 && dragAy[curIndex].y > 45)
                    oneAy.push(dragAy[curIndex]);
                if(dragAy[curIndex].y <= 290 && dragAy[curIndex].y > 170)
                    twoAy.push(dragAy[curIndex]);
                if(dragAy[curIndex].y <= 415 && dragAy[curIndex].y > 290)
                    threeAy.push(dragAy[curIndex]);
                if(dragAy[curIndex].y < 530 && dragAy[curIndex].y > 415)
                    fourAy.push(dragAy[curIndex]);
            }
        }
        dragAy[curIndex].alter = curAy;

        for(var i = 0;i<oneAy.length;i++){
            if(oneAy.length<=3){
                oneAy[i].setPosition(cc.p(280+i * 500/3 ,110));
            }else{
                var dis = 500/(oneAy.length-1);
                for(var j = 0;j<oneAy.length;j++){
                    oneAy[j].setPosition(cc.p(280+j*dis,110));
                    oneAy[j].setLocalZOrder(j);
                }
            }
        }

        for(var i = 0;i<twoAy.length;i++){
            if(twoAy.length<=3){
                twoAy[i].setPosition(cc.p(280+i * 500/3 ,230));
            }else{
                var dis = 500/(twoAy.length-1);
                for(var j = 0;j<twoAy.length;j++){
                    twoAy[j].setPosition(cc.p(280+j*dis,230));
                    twoAy[j].setLocalZOrder(j);
                }
            }
        }

        for(var i = 0;i<threeAy.length;i++){
            if(threeAy.length<=3){
                threeAy[i].setPosition(cc.p(280+i * 500/3 ,352));
            }else{
                var dis = 500/(threeAy.length-1);
                for(var j = 0;j<threeAy.length;j++){
                    threeAy[j].setPosition(cc.p(280+j*dis,352));
                    threeAy[j].setLocalZOrder(j);
                }
            }
        }

        for(var i = 0;i<fourAy.length;i++){
            if(fourAy.length<=3){
                fourAy[i].setPosition(cc.p(280+i * 500/3 ,475));
            }else{
                var dis = 500/(fourAy.length-1);
                for(var j = 0;j<fourAy.length;j++){
                    fourAy[j].setPosition(cc.p(280+j*dis,475));
                    fourAy[j].setLocalZOrder(j);
                }
            }
        }

    },

    getArea:function(index,target){
        var array;
        switch (index){
            case 1:array = oneAy;
                break;
            case 2:array = twoAy;
                break;
            case 3:array = threeAy;
                break;
            case 4:array = fourAy;
                break;
            default :return;
        }
        for(var i = 0;i<array.length;i++){
            if(target.getTag() == array[i].getTag()){
                array.splice(i,1);  //remove this sprite
            }
        }
    },

    setDisappear:function(sprite,flag) {
        if (flag) {
            sprite.setScale(0);
            sprite.setVisible(true);
            sprite.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2 - 25));
            sprite.runAction(cc.scaleTo(0.2, 1, 1));
        } else {
            var call = new cc.CallFunc(function () {
                sprite.runAction(cc.scaleTo(0.2, 0, 0));
            });
            var call2 = new cc.CallFunc(function () {
                sprite.setVisible(false);
                sprite.setPosition(cc.p(cc.winSize.width / 2, -100));
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(call, del, call2);
            this.runAction(seq);
        }
    },

    setNumImg:function(num){
        switch (num){
            case 1:
                changeNum.setTexture(res.num1);
                break;
            case 2:
                changeNum.setTexture(res.num2);
                break;
            case 3:
                changeNum.setTexture(res.num3);
                break;
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
}


})