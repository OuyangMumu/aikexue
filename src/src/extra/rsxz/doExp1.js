//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("rsxz_resdo")
            loadPlist("rsxz_shuzi")
        });
        this._super();
        this.expCtor()
        this.initData();
        this.initUI()
        this.initPeople()
        return true
    },

    initUI: function() {
        var self = this;
        var uinamelist = [
            "dx", "xx", "tl", "xh", "te"
        ];
        this.node = loadNode(res.rsxz_do1, uinamelist);
        this.inside_node.addChild(this.node)

        //红旗监听
        for (var i = 1; i <= 5; i++) {
            var hongqi = this.node.getChildByName("hongqi" + i);
            hongqi.coolnum = i;
            tools.addListener(hongqi, function(touch, event) {
                if(self.canMoving){
                    return false
                }
                var target = event.getCurrentTarget();
                target.setScale(1.2);
                self.createZuotip(target.coolnum);
                return true
            }, null, function(touch, event) {
                var target = event.getCurrentTarget();
                target.setScale(1);
                //self.createZuotip(target.coolnum);
            })
            //弹窗移动
            var tiem = this.node.getChildByName(this.dataControl[i - 1].tipname);
                //弹窗按钮
            tiem.getChildByName("closebtn").addClickEventListener(function() {
                var par = this.getParent();
                par.runAction(cc.sequence(
                    cc.scaleTo(0.1, 0),
                    cc.callFunc(function() {
                        par.setVisible(false);
                        self.canMoving = false
                        removeMoving(par)
                        par.setLocalZOrder(1);
                        if (self.dataControl[self.currindex].pass == (self.dataControl[self.currindex].touchsps - 1)) {
                            self.node.getChildByName("hongqi" + (self.currindex + 1)).removeFromParent(true);
                            self.node.getChildByName(self.dataControl[self.currindex].areaname).setVisible(true);
                        }
                    })
                ));
            });
        }


        //星座内部画线
        for (var i in this.dataControl) {
            var tmpdraw = new cc.DrawNode();
            tmpdraw.setName(this.dataControl[i].drawname);
            var xingzuo = this.node.getChildByName(this.dataControl[i].tipname);
            for (var item in xingzuo.getChildren())
                xingzuo.getChildren()[item].setLocalZOrder(3)
            tmpdraw.setLocalZOrder(2);
            xingzuo.addChild(tmpdraw);
            if (this.dataControl[i].dolines) {
                var dolines = this.dataControl[i].dolines
                for (var k in dolines) {
                    var poslist = []
                    for (var n in dolines[k]) {
                        var pos = xingzuo.getChildByName(dolines[k][n]).getPosition()
                        poslist.push(pos)
                        tmpdraw.drawCardinalSpline(poslist, 0.5, poslist.length, 2, cc.color(60, 15, 200));
                    }
                }

            }
        }

        this.drawBymyself();
    },
    createZuotip: function(data) {
        var self = this;
        this.currindex = data - 1;
        var tiem = this.node.getChildByName(this.dataControl[data - 1].tipname);
        if (tiem.isVisible()) {
            tiem.runAction(cc.sequence(
                cc.scaleTo(0.1, 0),
                cc.callFunc(function() {
                    tiem.setLocalZOrder(1);
                    tiem.setVisible(false);
                    if (self.dataControl[data - 1].pass == (self.dataControl[data - 1].touchsps - 1)) {
                        self.node.getChildByName("hongqi" + data).removeFromParent(true);
                        self.node.getChildByName(self.dataControl[data - 1].areaname).setVisible(true);
                    }
                })
            ));
        } else {
            tiem.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
            tiem.setLocalZOrder(2);
            tiem.setVisible(true);
            self.canMoving = true
            tiem.runAction(cc.sequence(cc.scaleTo(0.2, 1.4), cc.callFunc(function(){
                addMoving(tiem)
            })) )
        }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "xiaye",
                })
            })
        }
    },
    reEnter: function() {
        for (var i in this.node.getChildren())
            this.node.getChildren()[i].setOpacity(255);
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "xiaye",
            scale:0.9,
            sound: res.rsxz_xiayem,
            img: res.rsxz_dotip,
        })
    },

    drawBymyself: function() {

        var self = this;
        for (var i in this.dataControl) {
            var xingzuo = this.node.getChildByName(this.dataControl[i].tipname);
            for (var n = 0; n < (this.dataControl[i].touchsps - 1); n++)
                this.dataControl[i].successful[n] = false;

            for (var k = 1; k <= this.dataControl[i].touchsps; k++) {
                var sp = xingzuo.getChildByName("p" + k);
                sp.curnum = i;
                sp.posnum = k;

                tools.addListener(sp, function(touch, event) {
                        if(!self.canMoving){
                            return false
                        }
                        var target = event.getCurrentTarget();
                        target.beginpos = target.getPosition();
                        target.draw = new cc.DrawNode();
                        target.getParent().addChild(target.draw)
                        return true
                    },
                    function(touch, event) {
                        var target = event.getCurrentTarget();
                        target.pos = target.getParent().convertToNodeSpace(touch.getLocation())
                        target.draw.clear();
                        target.draw.drawSegment(target.beginpos, target.pos, 1, cc.color(60, 15, 200));
                    },
                    function(touch, event) {
                        var target = event.getCurrentTarget();
                        target.draw.clear();
                        for (var m = 1; m <= self.dataControl[target.curnum].touchsps; m++) {
                            var tmpsp = target.getParent().getChildByName("p" + m);
                            if (tools.checkdistans(target.pos, tmpsp, 15)) {
                                var olddraw = target.getParent().getChildByName(self.dataControl[target.curnum].drawname);
                                if (m == target.posnum - 1) {
                                    if (self.dataControl[target.curnum].pass != self.dataControl[target.curnum].successful.length) {
                                        if (!self.dataControl[target.curnum].successful[target.posnum - 2]) {
                                            self.dataControl[target.curnum].pass++;
                                            if (self.dataControl[target.curnum].pass == self.dataControl[target.curnum].successful.length)
                                                target.getParent().getChildByName("xz").setVisible(true);
                                            self.dataControl[target.curnum].successful[target.posnum - 2] = true;
                                            var presp = target.getParent().getChildByName("p" + m);
                                            olddraw.drawSegment(target.beginpos, presp.getPosition(), 1, cc.color(60, 15, 200))
                                        }
                                    } else {
                                        target.getParent().getChildByName("xz").setVisible(true);
                                    }
                                } else if (m == target.posnum + 1) {
                                    if (self.dataControl[target.curnum].pass != self.dataControl[target.curnum].successful.length) {
                                        if (!self.dataControl[target.curnum].successful[target.posnum - 1]) {
                                            self.dataControl[target.curnum].pass++;
                                            if (self.dataControl[target.curnum].pass == self.dataControl[target.curnum].successful.length)
                                                target.getParent().getChildByName("xz").setVisible(true);
                                            self.dataControl[target.curnum].successful[target.posnum - 1] = true;
                                            var behsp = target.getParent().getChildByName("p" + m);
                                            olddraw.drawSegment(target.beginpos, behsp.getPosition(), 1, cc.color(60, 15, 200))
                                        }
                                    } else {
                                        target.getParent().getChildByName("xz").runAction(cc.blink(0.1, 1));
                                    }
                                } else if (m == target.posnum) {

                                } else {
                                    dialogControl.AddDialog("Tips", {
                                        res: res.rsxz_dotip3,
                                        face: 1
                                    });
                                }
                            }
                        }
                    });
            }
        }
    },

    initData: function() {
        this.dataControl = [{
            tipname: "dx",
            successful: [],
            pass: 0,
            drawname: "dxdraw",
            dolines: [
                ["p4", "p7"],
                ["p5", "p11", "wu1", "wu"],
                ["p8", "wu5", "wu6", "p8"],
                ["p10", "wu2", "wu3", "wu4"]
            ],
            touchsps: 14,
            areaname: "daxiongzuo"
        }, {
            tipname: "xx",
            successful: [],
            pass: 0,
            drawname: "xxdraw",
            touchsps: 7,
            areaname: "xiaoxiongzuo"
        }, {
            tipname: "tl",
            successful: [],
            pass: 0,
            drawname: "tldraw",
            dolines: [
                ["p1", "wu", "p3"],
                ["p5", "wu3"],
                ["p4", "wu4"],
            ],
            touchsps: 12,
            areaname: "tianlongzuo"
        }, {
            tipname: "xh",
            successful: [],
            pass: 0,
            drawname: "xhdraw",
            touchsps: 5,
            areaname: "xianhuozou"
        }, {
            tipname: "te",
            successful: [],
            pass: 0,
            drawname: "tedraw",
            dolines: [
                ["wu3", "p3", "wu", "wu1", "wu2"],
            ],
            touchsps: 7,
            areaname: "tianezou"
        }, ]
    },
})