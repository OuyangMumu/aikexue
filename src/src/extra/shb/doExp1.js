//@author mu @16/5/11
var local_Orade = 100
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    isCandaoyan : false,
    shiguansp : null,
    baowensp : null,
    somenode : null,
    xianbeizi : null,
    iswendujiInputpos : false,
    outshiguan : true,
    shiguanmove : true,
    isCanchashiguan : false,
    isallmove : false,
    isbingkuai : true,
    isshiyan : true,
    ischunshui:true,
    somenodeArray : null,
    colorArray : null,
    passtip6 : true,
    canspeak : true,
    overlayer : null,
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        });
        var self = this
        this._super()
        this.initPeople()
        this.expCtor({
            vis: false,
            setZ:1000,
            settingData: {
                pos: cc.p(1080, 580),
                tubiaoData: {
                    xname: "时间/min",
                    yname: "温度/°C",
                    father: self.bgnode,
                    autoData: function() {
                        var result = []
                        if (self.bgnode.bgg) {
                            var bg = self.bgnode.bgg
               
                            var tempA = {
                                colorPoint: cc.color(9, 10, 153, 255),
                                colorLine: cc.color(255, 50, 0, 255),
                                colorRleation: cc.color(255, 32, 32, 255),
                                colorCurve: cc.color(14, 249, 145, 255),
                                points: [],
                            }
         
                            var judgePoint = function(xindex, yindex) {
                                var x = xindex
                                var y = bg.getKey(yindex)
                                if (y != "") {
                                    y = parseFloat(y).toFixed(2)
                                    if (y != "NaN") {
                                        return {
                                            x: parseFloat(x),
                                            y: parseFloat(y)
                                        }
                                    }
                                }
                                return null
                            }
                            for (var i = 0; i < 10; i++) {
                                var point = judgePoint(i,i+1)
                                if (point) {
                                    tempA.points.push(point)
                                }
                            }
                            cc.log(tempA.points)
                            result.push(tempA)
                        }
                        return result
                    }
                },
                biaogeFun: function() {
                    if (!self.bgnode.bgg) {
                        var colors = []
                        for (var k = 0; k <= 10; k++)
                            colors.push(cc.color(255, 0, 0))
                        var bg = createBiaoge({
                            json: res.biaoge1,
                            inputNum: 10,
                            isShowResult: false,
                            scale: 0.9,
                            rootColor:colors
                        })
                
                        self.bgnode.addChild(bg)
                        self.bgnode.bgg = bg
                    }
                    self.bgnode.bgg.setBack(function() {
                        if (self.bgnode.tubiao) {
                            self.bgnode.tubiao.judgeAuto()
                        }
                    })
                    var bg = self.bgnode.bgg
                    bg.show()
                }
            }
        })
        this.initUI()

        return true
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            this.toolbtn.show()
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi5",
                    force:true
                })
            })
        }
    },
    initUI:function(){

        var self = this
        var toolnode = new cc.Node();
        toolnode.x = 0 ; toolnode.y =0;
        this.addChild(toolnode,5);

        self.overlayer = new cc.Layer();
        this.addChild(self.overlayer,150);
        self.noneChange = false
      
        self.somenode = new CreateSomeNode();
        //温度计移动监听
        self.somenode.addWendujiMoveCallback(function(touch, event) {
            var target = event.getCurrentTarget();
            var delta = touch.getDelta();
            target.x += delta.x;
            target.y += delta.y;
            var worldpos = target.getParent().convertToWorldSpace(target.getPosition());
            if (self.iswendujiInputpos) {
                if (self.outshiguan) {
                    //试管外
                    //target.getParent().setLocalZOrder(5);
                    if (worldpos.x >= self.shiguansp.x - 23 && worldpos.x <= self.shiguansp.x + 23 && worldpos.y >= self.shiguansp.y + 175 && worldpos.y <= self.shiguansp.y + 190) {
                        target.getParent().setLocalZOrder(2);
                        if(self.shiguansp)
                             self.shiguansp.setLocalZOrder(5)
                        self.outshiguan = false;
                        return;
                    }
                } else {
                    //试管内
                    if (self.isallmove) {
                        self.shiguansp.x += delta.x;
                        self.shiguansp.y += delta.y;
                        self.baowensp.x += delta.x;
                        self.baowensp.y += delta.y;
                    }
                    if (worldpos.y >= self.shiguansp.y + 190) {
                        self.outshiguan = true;
                        self.shiguanmove = true;
                        return;
                    }
                    self.shiguanmove = false;
                    var nodepos = target.getParent().convertToNodeSpace(self.shiguansp.getPosition());
                    if (target.x <= nodepos.x - 14)
                        target.x = nodepos.x - 14;
                    if (target.x >= nodepos.x + 14)
                        target.x = nodepos.x + 14;
                    if (target.y <= nodepos.y - 175)
                        target.y = nodepos.y - 175;
                }
            }
        });
        self.somenode.addWendujiBeganCallback(function(touch, event) {
            var target = event.getCurrentTarget();
            if (self.outshiguan)
                target.getParent().setLocalZOrder(local_Orade++)
        })
        //温度计移动结束监听
        self.somenode.addWendujiEndCallback(function(touch, event) {
            var target = event.getCurrentTarget();
            self.showbianjietip(target);
            if (target.x < 105 && self.toolbtn.getStatus()) {
                target.getParent().forceBack();
            }
        });

        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.5),
            itempos:cc.p(3, -18),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            movefun: function(data) {
                self.allSpriteMovefun(data);
            },
            outfun: function(data) {
                if (0 == data.index)
                    if (!self.shiguanmove && !self.outshiguan) {
                        self.showbianjietip(self.somenode.getXiaowenduji());
                    }
            },
            firstClick: function(data) {
                if (2 == data.index) {
                    var wendunode = self.somenode.createWenduji();
                    wendunode.x = 105;
                    wendunode.y = -20;
                    wendunode.nopos = true;
                    wendunode.canback = false;
                    return wendunode;
                } else if (6 == data.index)
                    return self.somenode.createMiaobiao();

                return true;
            },
            backfun: function(data) {
                if (2 == data.index)
                    return data.sp.canback;
                return true;
            },
            clickfun: function(data) {
                if (2 == data.index)
                    data.sp.canback = true;
                if(!self.noneChange)
                  data.sp.setLocalZOrder(local_Orade++)
                return true
            },
            father:toolnode,
            files:[res.shiguan_sel, res.chunshui_sel,res.wenduji_sel,
                    res.baowenbei_sel, res.bingkuai_sel,res.shiyan_sel,
                       res.miaobiao_sel],
            gets:[ res.shiguan, res.chunshui,null,res.baowen,res.bingkuai,res.shiyan,null],
            grays:[res.shiguan_sel, res.chunshui_sel,res.wenduji_sel,
                    res.baowenbei_sel, res.bingkuai_sel,res.shiyan_sel,
                    res.miaobiao_sel],
        });
        this.addChild(this.toolbtn,3);    
    },
    showbianjietip:function(target){
        if(!this.outshiguan){
            var nodepos = target.getParent().convertToNodeSpace(this.shiguansp);
            if(target.x <= nodepos.x-14 || target.x >= nodepos.x+14)
                this.showFacetip({
                    img:res.tip10,
                    mscale:1.2
                });
            if(target.y <= nodepos.y-174 &&(target.x >= nodepos.x-13 && target.x <= nodepos.x+13))
                this.showFacetip({
                    img:res.tip12,
                    mscale:1.2
                });
            if(target.y <= nodepos.y+175 && target.y >= nodepos.y-100 &&(target.x >= nodepos.x-13 && target.x <= nodepos.x+13))
                this.showFacetip({
                    img:res.tip13,
                    mscale:0.9
                });
            if(target.y >= nodepos.y-175 && target.y <= nodepos.y-100 && target.x >= nodepos.x-13 && target.x <= nodepos.x+13){
                this.shiguanmove = true;
                if(this.passtip6){
                    this.nodebs.say({
                        key: "wenzi8",
                        force: true
                    })
                    this.passtip6 = false;
                }
            }

        }
    },
    getTn:function(n) {
        var Tn = null
        if (n == 0) {
           Tn = 20 - ((1 / 5000000) * 0 * 0 + (7 / 50000) * 0 + 0.004) * 20
        } else {
           Tn = this.getTn(n-1) - ((1 / 5000000) * (n-1) * (n-1) 
            + (7 / 50000) * (n-1) + 0.004) * this.getTn(n-1)
        }
        return Tn
    },
    showFacetip:function(data){
        var self = this
        var img = data.img
        var mscale = data.mscale
          dialogControl.AddDialog("Tips", {
                res: img,
                modify: cc.p(30, 0),
                face: 2,
                scale:mscale,
                father: self
          });
    },
    allSpriteMovefun:function(data){
        var self = this;
        if(self.toolbtn.getindex(0))
              self.shiguansp = self.toolbtn.getindex(0);
        if(self.toolbtn.getindex(3))
              self.baowensp = self.toolbtn.getindex(3);
        if(data.index==0){  //试管
            var wenduji = self.somenode.getXiaowenduji();
            var tmpsp3 = self.toolbtn.getindex(3);
                if(self.shiguanmove){
                    data.sp.x += data.delta.x;
                    data.sp.y += data.delta.y;
                    if(!self.outshiguan){
                        wenduji.x += data.delta.x;
                        wenduji.y += data.delta.y;
                    }
                 }
                if(tmpsp3){
                     if(self.isallmove){
                         tmpsp3.x += data.delta.x;
                         tmpsp3.y += data.delta.y;
                      }
                    if(data.sp.x >= tmpsp3.x-25 && data.sp.x <= tmpsp3.x + 30 && data.sp.y>= tmpsp3.y +300  && data.sp.y <= tmpsp3.y + 340){
                        if(self.isCanchashiguan){
                            data.sp.pause();
                            data.sp.x = tmpsp3.x;
                            var wendujipos = wenduji.getParent().convertToNodeSpace(data.sp.getPosition());
                            wenduji.x = wendujipos.x
                            self.noneChange = true
                            var dingwei = self.somenode.getdiweiqi()
                            wenduji.getParent().setLocalZOrder(tmpsp3.getLocalZOrder()-2)
                            data.sp.setLocalZOrder(tmpsp3.getLocalZOrder()-1)
                            wenduji.runAction(cc.moveBy(1,cc.p(0,-150)))
                            self.TouchaddListener(self.overlayer)
                            data.sp.runAction(cc.sequence(
                                cc.moveBy(1,cc.p(0,-150)),
                                cc.callFunc(function(){
                                    data.sp.resume()
                                    self.overlayer.removeListen()
                                    data.sp.curtime = 0
                                    data.sp.tempwendu = 20

                                    var jiebing = ccs.load(res.jiebing).node;
                                    var jiebingac = ccs.load(res.jiebing).action;
                                    jiebing.setScale(0.7)
                                    jiebing.x = 180
                                    jiebing.y = 244
                                    tmpsp3.addChild(jiebing)
                                    jiebingac.gotoFrameAndPlay(5,471,false)
                                    jiebing.runAction(jiebingac)
                                    jiebing.pause()
                           
                                    data.sp.runAction(cc.repeatForever(cc.sequence(
                                        cc.delayTime(1),
                                        cc.callFunc(function() {
                                            if (data.sp.tempwendu <= 0.3) {
                                              jiebing.resume()
                                            } else {
                                                 var n = data.sp.curtime
                                                 data.sp.tempwendu = data.sp.tempwendu - ((1 / 5000000) * n * n 
                                                 + (7 / 50000) * n + 0.004) * data.sp.tempwendu
                                                self.somenode.setTemperature(data.sp.tempwendu,1)     
                                            }
                                            if(data.sp.tempwendu<=0.2)
                                                data.sp.stopAllActions()
                                            data.sp.curtime++
                                        })
                                    )))
                                    self.isallmove = true;
                                })
                            ))
                        }
                    }
                }
        }else if(data.index==1){ //纯净水
            if(self.ischunshui){
            data.sp.x += data.delta.x;
            data.sp.y += data.delta.y;
            var tmpsp = self.toolbtn.getindex(0);
            if(tmpsp){
               // tmpsp.setLocalZOrder(3);
               // data.sp.setLocalZOrder(4);
                if(data.sp.x >= tmpsp.x+50 && data.sp.x <= tmpsp.x + 130 && data.sp.y>= tmpsp.y+110 && data.sp.y <= tmpsp.y + 160)
                {
                    data.sp.pause();
                    data.sp.setVisible(false);
                    tmpsp.setVisible(false);

                        self.TouchaddListener(self.overlayer)
                        var daoshui = ccs.load(res.daoshui).node;
                        var daoshuiac = ccs.load(res.daoshui).action;
                        daoshui.x = tmpsp.x+76;
                        daoshui.y = tmpsp.y;
                        data.sp.getParent().addChild(daoshui);
                        data.sp.removeFromParent();
                        daoshuiac.gotoFrameAndPlay(0,93,false);
                        daoshuiac.setLastFrameCallFunc(function(){
                            tmpsp.setVisible(true);
                            tmpsp.setTexture(res.shiguan2);
                            self.iswendujiInputpos = true;
                            daoshui.removeFromParent();
                            self.overlayer.removeListen();
                        });
                        daoshui.runAction(daoshuiac);
                        self.ischunshui = false;
                 }
                }
            }
        }else if(data.index==4){ //冰块
            if(self.isbingkuai)
            {
                data.sp.x += data.delta.x;
                data.sp.y += data.delta.y;
                var tmpsp2 = self.toolbtn.getindex(3);
                //if(tmpsp2)
                    //data.sp.setLocalZOrder(tmpsp2.getLocalZOrder()+1);
                if(tmpsp2)
                    if(data.sp.x >= tmpsp2.x && data.sp.x <= tmpsp2.x + 300 && data.sp.y>= tmpsp2.y && data.sp.y <= tmpsp2.y + 150)
                    {
                            data.sp.pause();
                            data.sp.setVisible(false);
                            self.TouchaddListener(self.overlayer)
                            var baowen1 = ccs.load(res.baowenac).node;
                            var baowenac2 = ccs.load(res.baowenac).action;
                            baowen1.x = 225;
                            baowen1.y = 310;
                            tmpsp2.addChild(baowen1);
                            data.sp.removeFromParent();
                            baowenac2.gotoFrameAndPlay(0, 72, false);
                            baowenac2.setLastFrameCallFunc(function(){
                                self.overlayer.removeListen();
                            })
                            self.isCandaoyan = true;
                            self.isbingkuai = false;
                            baowen1.runAction(baowenac2);
                    }
              }
        }else if(data.index==5){ //食盐
            if(self.isshiyan)
            {
                data.sp.x += data.delta.x;
                data.sp.y += data.delta.y;
                var tmpsp1 = self.toolbtn.getindex(3);
                if(tmpsp1 && self.isCandaoyan)
                    if(data.sp.x >= tmpsp1.x && data.sp.x <= tmpsp1.x + 300 && data.sp.y>= tmpsp1.y && data.sp.y <= tmpsp1.y + 150)
                    {
                        data.sp.pause();
                        data.sp.setVisible(false);
                        self.TouchaddListener(self.overlayer)
                        var daoyan = ccs.load(res.daoyan).node;
                        var daoyanac = ccs.load(res.daoyan).action;
                        daoyan.x = tmpsp1.x + 122;
                        daoyan.y = tmpsp1.y + 167;
                        tmpsp1.getParent().addChild(daoyan);
                        data.sp.removeFromParent();
                        daoyan.setLocalZOrder(tmpsp1.getLocalZOrder() - 1);
                        daoyanac.gotoFrameAndPlay(0, 75, false);
                        daoyanac.setLastFrameCallFunc(function () {
                            cc.log("3333333333333333333");
                            //daoyan.removeFromParent();
                            var jiaoban = ccs.load(res.jiaoban).node;
                            var jiaobanac = ccs.load(res.jiaoban).action;
                            tmpsp1.setVisible(false);
                            jiaoban.x = tmpsp1.x + 148;
                            jiaoban.y = tmpsp1.y + 186.4;
                            tmpsp1.getParent().addChild(jiaoban,local_Orade++);
                            jiaobanac.gotoFrameAndPlay(0, 73, false);
                            jiaobanac.setLastFrameCallFunc(function () {
                                tmpsp1.setVisible(true);
                                self.isCanchashiguan = true;
                                jiaoban.removeFromParent();
                                self.nodebs.say({
                                    key: "wenzi9",
                                    force: true
                                })
                                self.overlayer.removeListen();
                                jiaobanac.clearLastFrameCallFunc()
                            });
                            jiaoban.runAction(jiaobanac);
                            daoyanac.clearLastFrameCallFunc();
                        });
                        daoyan.runAction(daoyanac);
                        self.isshiyan = false;
                    }
            }
        }else if(data.index==2){
            var wenduji = self.somenode.getXiaowenduji();
            wenduji.x += data.delta.x;
            wenduji.y += data.delta.y;
        }else if(data.index==6){
            data.sp.x += data.delta.x;
            data.sp.y += data.delta.y;
        }else{
            data.sp.x += data.delta.x;
            data.sp.y += data.delta.y;
            var wenduji = self.somenode.getXiaowenduji();
            var shiguans = self.toolbtn.getindex(0);
            if(self.isallmove){
                wenduji.x += data.delta.x;
                wenduji.y += data.delta.y;
                shiguans.x += data.delta.x;
                shiguans.y += data.delta.y;
            }
        }
    },
    TouchaddListener: function(sprite) {
        var spListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(-10, 10, s.width + 20, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            }
        });
        sprite.listener = spListener.clone();
        sprite.removeListen = function() {
            cc.log("ffffffffffff" + sprite.listener)
            if (sprite.listener) {
                cc.eventManager.removeListener(sprite.listener)
                sprite.listener = null
            }
        }
        cc.eventManager.addListener(sprite.listener, sprite);
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,500);
        this.bgnode = new cc.Node()
        this.addChild(this.bgnode,600)

        addContent({
            people: this.nodebs,
            key: "wenzi5",
            sound: res.zi5mp,
            img:res.wenzi5
        })
        addContent({
            people: this.nodebs,
            key: "wenzi8",
            sound: res.zi8mp,
            img:res.wenzi8
        })
        addContent({
            people: this.nodebs,
            key: "wenzi9",
            sound: res.zi9mp,
            img:res.wenzi9
        })
    }
})