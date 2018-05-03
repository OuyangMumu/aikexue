//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        });
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()

        return true
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "zi5",
                    force:true
                })
            })
        }
    },
    initUI:function(){
        var experionenode = ccs.load(res.do1).node;
        this.addChild(experionenode);
        var tmpthis = this;

        tmpthis.sparray = [];
        tmpthis.spposarray = [];
        tmpthis.spflag = [true,true,true,true,true,true,true];
        for(var i = 1;i <= 12;i++){
            var spname = "sp" + i;
            var tmpsp = experionenode.getChildByName(spname);
            tmpsp.setTag(50+i);
            tmpthis.sparray.push(tmpsp);
            tmpthis.spposarray.push(tmpsp.getPosition());
        }

        var jielun = experionenode.getChildByName("jielun");
        tmpthis.shouzhi = experionenode.getChildByName("shouzhi");
        var spListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)){
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch, event){
                var targ = event.getCurrentTarget();
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
                if(tmpthis.shouzhi.getChildrenCount() != 12){
                    if(tmpthis.checkdistans(targ,tmpthis.sparray[0],100) && tmpthis.spflag[0]){
                        var jiazi = new cc.Sprite(res.shujia);
                        jiazi.x = 50;jiazi.y = 1;
                        tmpthis.shouzhi.addChild(jiazi);

                        var shouzhisp = new cc.Sprite(res.shouzhi);
                        shouzhisp.x = 80;shouzhisp.y = 60;
                        tmpthis.shouzhi.addChild(shouzhisp,5);
                        tmpthis.spflag[0] = false;
                        tmpthis.sparray[0].setVisible(false);
                    };
                    if(tmpthis.checkdistans(targ,tmpthis.sparray[1],100) && tmpthis.spflag[1]){
                        var dingzi = new cc.Sprite(res.dingzi);
                        dingzi.x = 60;dingzi.y = 0;
                        tmpthis.shouzhi.addChild(dingzi);

                        var shouzhisp = new cc.Sprite(res.shouzhi);
                        shouzhisp.x = 80;shouzhisp.y = 60;
                        tmpthis.shouzhi.addChild(shouzhisp,5);
                        tmpthis.spflag[1] = false;
                        tmpthis.sparray[1].setVisible(false);
                    };

                    if(tmpthis.checkdistans(targ,tmpthis.sparray[2],100) && tmpthis.spflag[2]){
                        var tuding = new cc.Sprite(res.tuding);
                        tuding.x = 70;tuding.y = -5;
                        tmpthis.shouzhi.addChild(tuding);

                        var shouzhisp = new cc.Sprite(res.shouzhi);
                        shouzhisp.x = 80;shouzhisp.y = 60;
                        tmpthis.shouzhi.addChild(shouzhisp,5);
                        tmpthis.spflag[2] = false;
                        tmpthis.sparray[2].setVisible(false);
                    };
                    if(tmpthis.checkdistans(targ,tmpthis.sparray[3],100) && tmpthis.spflag[3]){
                        var hui = new cc.Sprite(res.huixingzhen);
                        hui.x = 40;hui.y = -8;
                        tmpthis.shouzhi.addChild(hui);

                        var shouzhisp = new cc.Sprite(res.shouzhi);
                        shouzhisp.x = 80;shouzhisp.y = 60;
                        tmpthis.shouzhi.addChild(shouzhisp,5);
                        tmpthis.spflag[3] = false;
                        tmpthis.sparray[3].setVisible(false);
                    };
                    if(tmpthis.checkdistans(targ,tmpthis.sparray[4],100) && tmpthis.spflag[4]){
                        var hui = new cc.Sprite(res.jiazi);
                        hui.x = 40;hui.y = -3;
                        tmpthis.shouzhi.addChild(hui);

                        var shouzhisp = new cc.Sprite(res.shouzhi);
                        shouzhisp.x = 80;shouzhisp.y = 60;
                        tmpthis.shouzhi.addChild(shouzhisp,5);
                        tmpthis.spflag[4] = false;
                        tmpthis.sparray[4].setVisible(false);
                    };

                    if(tmpthis.checkdistans(targ,tmpthis.sparray[5],100) && tmpthis.spflag[5]){
                        var hui = new cc.Sprite(res.tiepian);
                        hui.x = 40;hui.y = 0;
                        tmpthis.shouzhi.addChild(hui);

                        var shouzhisp = new cc.Sprite(res.shouzhi);
                        shouzhisp.x = 80;shouzhisp.y = 60;
                        tmpthis.shouzhi.addChild(shouzhisp,5);
                        tmpthis.spflag[5] = false;
                        tmpthis.sparray[5].setVisible(false);
                    };

                }else if(tmpthis.shouzhi.getChildrenCount() == 12 && tmpthis.spflag[6]){
                    jielun.setVisible(true);
                    tmpthis.nodebs.say({
                        key: "zi6",
                        force: true
                    })
                    tmpthis.spflag[6] = false;
                }
            },
            onTouchEnded:function(touch, event){

            }
        });
        cc.eventManager.addListener(spListener,tmpthis.shouzhi);

        var touchspList = []
        for(var i=1;i<=12;i++){
            var tmpss = experionenode.getChildByName("sp"+i)
            tmpss.index = i
            touchspList.push(tmpss)
        }

        var splistener5 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan:function(touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if(cc.rectContainsPoint(rect,locationInNode)){
                    for(var m in touchspList)
                        touchspList[m].getChildren()[0].setVisible(false)
                    var childs = touchspList[target.index-1].getChildren()
                    for(var k in childs)
                        childs[k].setVisible(true)
                    return true;
                }
                var childds = touchspList[target.index-1].getChildren()
                for(var k in childds)
                    childds[k].setVisible(false)

                return false;
            },
        })
        for(var i=0 ;i<12;i++) {
            cc.eventManager.addListener(splistener5.clone(),touchspList[i]);
        }

    },
    checkdistans: function(target1,target2,dis){
        var dx = target1.x - target2.x ;
        var dy = target1.y - target2.y ;
        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));

        if(distance <= dis){
            return true;
        }else
            return false;
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "zi5",
            sound: res.zi5mp,
        })
        addContent({
            people: this.nodebs,
            key: "zi6",
            sound: res.zi6mp,
        })
        
    }
})