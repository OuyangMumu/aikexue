/**
 * Created by Administrator on 2016/6/21.
 */
var reStart = false
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this
        var uiList = [
            "foot1" ,"foot2" ,"foot3" ,"foot4" ,"foot5" ,
            "foot6" ,"foot7" ,"foot8" ,"tou", "fu"
        ]
        var num  = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        ]
        var node = loadNode(res.my_do1_json,uiList)
        self.inside_node.addChild(node)
        if(!reStart)
            self.nodebs.show(function() {
                self.nodebs.say({key:"do1_tip"})
            })
        else
            self.nodebs.stopSay()
        var count = 0
        var beginPos = 0
        for(var i = 0;i < uiList.length ; i++){
            var judge = node[uiList[i]]
            judge.num = num[i]
            createTouchEvent({
                item:judge,
                begin:function(data){
                    var item = data.item
                    beginPos = item.getPosition()
                    item.setLocalZOrder(10)
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta;
                    item.x += delta.x
                    item.y += delta.y
                },
                end:function(data){
                    var item = data.item
                    if(self.checkDistans(item,self.getmayiPos(item.num))){
                        item.setPosition(self.getmayiPos(item.num))
                        item.pause()
                        count++
                        if(count >= 10){
                            self.createResultTip()
                        }
                        return true
                    }
                    item.setPosition(beginPos)
                    playMusic(res.my_do1_sound1)
                }
            })
        }

    },

    getmayiPos:function(index) {
        var posData = [
            {num: 1, pos: cc.p(408.16, 468.45)},
            {num: 2, pos: cc.p(487, 468)},
            {num: 3, pos: cc.p(398, 375)},
            {num: 4, pos: cc.p(505.7, 374)},
            {num: 5, pos: cc.p(378.5, 272.3)},
            {num: 6, pos: cc.p(521, 270.5)},
            {num: 7, pos: cc.p(391.4, 192.4)},
            {num: 8, pos: cc.p(511, 191.3)},
            {num: 9, pos: cc.p(446.5, 414.6)},
            {num: 10, pos: cc.p(452.4, 220)},
        ]
        for(var i=0;i<posData.length;i++){
            if(index == posData[i].num){
                return posData[i].pos
            }
        }
    },

    checkDistans:function(target1,pos){
        var dx = target1.x - pos.x
        var dy = target1.y - pos.y
        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
        if(distance <= 20){
            return true
        }else
            return false
    },

    createResultTip:function(){
        var self = this;
        playMusic(res.my_do1_sound2);
        var tipBg = new cc.Sprite("res/bg/bg_tips.png");
        this.addChild(tipBg);
        tipBg.setPosition(getMiddle());
        tipBg.setScale(0);
        tipBg.runAction(cc.scaleTo(0.2,1));
        var tipFace = new cc.Sprite("res/img/img_tipface1.png");
        tipFace.setPosition(cc.p(70,320));
        tipBg.addChild(tipFace);
        var doTipWz = new cc.Sprite(res.do1_tipYes);
        doTipWz.setPosition(cc.p(250,200));
        tipBg.addChild(doTipWz);
        var closeBtn = new ccui.Button("res/btn/btn_tipclose_normal.png","res/btn/btn_tipclose_select.png");
        closeBtn.setPosition(cc.p(380,330));
        tipBg.addChild(closeBtn);
        var noBtn = new ccui.Button(res.doTipNoBtn_normal,res.doTipNoBtn_selet);
        noBtn.setPosition(cc.p(170,80));
        tipBg.addChild(noBtn);
        var yesBtn = new ccui.Button(res.doTipYesBtn_normal,res.doTipYesBtn_select);
        yesBtn.setPosition(cc.p(320,80));
        tipBg.addChild(yesBtn);

        createTouchEvent({
            item:tipBg,
            begin:function(data){
                return true;
            },
            move:function(data){
                var item = data.item;
                var delta = data.delta;
                item.x += delta.x;
                item.y += delta.y;
            }
        });
        noBtn.addClickEventListener(function(){
            var call = new cc.CallFunc(function(){
                tipBg.runAction(cc.scaleTo(0.2,0));
            });
            var call2 = new cc.CallFunc(function(){
                tipBg.removeFromParent();
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(call,del,call2);
            self.runAction(seq);
        });
        closeBtn.addClickEventListener(function(){
            var call = new cc.CallFunc(function(){
                tipBg.runAction(cc.scaleTo(0.2,0));
            });
            var call2 = new cc.CallFunc(function(){
                tipBg.removeFromParent();
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(call,del,call2);
            self.runAction(seq);
        });
        yesBtn.addClickEventListener(function(){
            reStart = true;
            if (self.myExit) {
                self.myExit()
            }
            if (self.myDelete) {
                self.myDelete()
            }
            deleteLayer(self)
            var temp = getLayer("doExp1")
            cc.director.getRunningScene().addChild(temp)
            if (temp.myCtor) {
                temp.myCtor()
            }
            if (temp.myEnter) {
                temp.myEnter()
                temp.alreadyEnter = true
            }
        });
    },

    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs)
        addContent({
            people: this.nodebs,
            key: "do1_tip",
            img: res.do1_tip,
            sound: res.do1_tipSound,
        })
    }
})