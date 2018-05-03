/**
 * Created by Administrator on 2016/5/27.
 */
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initUI();
        return true;
    },

    initUI:function(){
        var self = this;
        var doLayer = ccs.load(res.hhyz_do1).node;
        this.inside_node.addChild(doLayer);

        var yueqiu = doLayer.getChildByName("yueqiu");
        var yinhe = doLayer.getChildByName("yinhe");
        var diqiu = doLayer.getChildByName("diqiu");
        var taiyang = doLayer.getChildByName("taiyang");
        var yuzhou = doLayer.getChildByName("yuzou");
        var liequan = doLayer.getChildByName("liequan");

        var endFlag = false;
        var begin_x_y = 0;
        var vaseJudge = [false,false,false,false];
        var vaseName = [yueqiu,yinhe,diqiu,taiyang,yuzhou,liequan];
        for(var i = 0;i<6;i++) {
            createTouchEvent({
                item: vaseName[i],
                begin: function (data) {
                    var item = data.item;
                    begin_x_y = item.getPosition();
                    return true;
                },
                move: function (data) {
                    var item = data.item;
                    var delta = data.delta;
                    item.x += delta.x;
                    item.y += delta.y;
                },
                end: function (data) {
                    var item = data.item;
                    if(!vaseJudge[0] && self.checkdistans(vaseName[4],555,570,40)){
                        vaseName[4].setPosition(cc.p(555,570));
                        vaseName[4].removeListen();
                        vaseJudge[0] = true;
                    }else if(!vaseJudge[1] && self.checkdistans(vaseName[1],850,535,40)){
                        vaseName[1].setPosition(cc.p(850,535));
                        vaseName[1].removeListen();
                        vaseJudge[1] = true;
                    }else if(!vaseJudge[2] && self.checkdistans(vaseName[3],805,50,40)){
                        vaseName[3].setPosition(cc.p(805,50));
                        vaseName[3].removeListen();
                        vaseJudge[2] = true;
                    }else if(!vaseJudge[3] && self.checkdistans(vaseName[2],450,235,40)){
                        vaseName[2].setPosition(cc.p(450,235));
                        vaseName[2].removeListen();
                        vaseJudge[3] = true;
                    }
                    else{
                        item.setPosition(begin_x_y);
                        playMusic(res.hhyz_sound1);
                    }
                    if(!endFlag && vaseJudge[0] && vaseJudge[1] && vaseJudge[2] && vaseJudge[3]){
                        self.createResultTip();
                        endFlag = true;
                    }

                }
            })
        }
    },

    createResultTip:function(){
        var self = this;
        playMusic(res.hhyz_sound2);
        var tipBg = new cc.Sprite("res/bg/bg_tips.png");
        this.addChild(tipBg);
        tipBg.setPosition(getMiddle());
        tipBg.setScale(0);
        tipBg.runAction(cc.scaleTo(0.2,1));
        var tipFace = new cc.Sprite("res/img/img_tipface1.png");
        tipFace.setPosition(cc.p(70,320));
        tipBg.addChild(tipFace);
        var doTipWz = new cc.Sprite(res.hhyz_doTip);
        doTipWz.setPosition(cc.p(250,200));
        tipBg.addChild(doTipWz);
        var closeBtn = new ccui.Button("res/btn/btn_tipclose_normal.png","res/btn/btn_tipclose_select.png");
        closeBtn.setPosition(cc.p(380,330));
        tipBg.addChild(closeBtn);
        var noBtn = new ccui.Button(res.hhyz_doTipNoBtn1,res.hhyz_doTipNoBtn2);
        noBtn.setPosition(cc.p(170,80));
        tipBg.addChild(noBtn);
        var yesBtn = new ccui.Button(res.hhyz_doTipYesBtn1,res.hhyz_doTipYesBtn2);
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


    checkdistans:function(target1,_x,_y, dis) {
        var dx = target1.x - _x;
        var dy = target1.y - _y;
        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (distance <= dis) {
            return true;
        } else
            return false;
}
})