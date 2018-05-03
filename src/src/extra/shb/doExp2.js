var local_Orade = 100
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    canspeak : true,
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        })
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
                                colorPoint: cc.color(100, 10, 153, 255),
                                colorLine: cc.color(100, 50, 0, 255),
                                colorRleation: cc.color(100, 32, 32, 255),
                                colorCurve: cc.color(100, 249, 145, 255),
                                points: [],
                            }
                            var tempB = {
                                colorPoint: cc.color(10, 100, 153, 255),
                                colorLine: cc.color(10, 100, 0, 255),
                                colorRleation: cc.color(10, 100, 32, 255),
                                colorCurve: cc.color(10, 100, 145, 255),
                                points: [],
                            }
                            var tempC = {
                                colorPoint: cc.color(80, 10, 100, 255),
                                colorLine: cc.color(80, 50, 100, 255),
                                colorRleation: cc.color(80, 32, 100, 255),
                                colorCurve: cc.color(80, 249, 100, 255),
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
                            for (var i = 0; i < 6; i++) {
                                var point = judgePoint(i,i+1)
                                if (point) {
                                    tempA.points.push(point)
                                }
                            }
                            for (var i = 6; i < 12; i++) {
                                var point = judgePoint(i-6,i+1)
                                if (point) {
                                    tempB.points.push(point)
                                }
                            }
                            for (var i = 12; i < 17; i++) {
                                var point = judgePoint(i-12,i+1)
                                if (point) {
                                    tempC.points.push(point)
                                }
                            }
                            
                            result.push(tempA)
                            result.push(tempB)
                            result.push(tempC)
                        }
                        return result
                    }
                },
                biaogeFun: function() {
                    if (!self.bgnode.bgg) {
                        var colors = []
                        for (var k = 0; k <= 17; k++)
                            colors.push(cc.color(255, 0, 0))
                        var bg = createBiaoge({
                            json: res.biaoge2,
                            inputNum: 18,
                            isShowResult: true,
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
    initUI: function(){

        this.somenodeArray = [];
       
        var toolnode = new cc.Node();
        toolnode.x = 0 ; toolnode.y =0;
        this.addChild(toolnode,5);
        var self = this

         self.ice = ccs.load(res.ice_ture).node
         toolnode.addChild(self.ice,5)
         self.ice.setVisible(false)
         self.ice.run = true
         self.ice.playAction = function(){
             this.curtime = 0
             var inself = this
             this.xiawendu = 0
             this.outwendu = 0
             this.runAction(cc.repeatForever(cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function() {
                       var n = inself.curtime
                       inself.xiawendu = (-35)*Math.pow(0.9975,n)+25

                       var tn = 0.01 - n/(40000*(25-inself.xiawendu))
                       var tnn = Math.pow(1-tn,n)     
                       inself.outwendu = 25*tnn + (1-tnn)*inself.xiawendu

                       inself.curtime++
                       if(inself.xiawendu>=0.2){
                          inself.stopAllActions()
                          inself.xiawendu = 0.2
                          inself.curtime = 0
                          var Action = ccs.load(res.ice_ture).action
                          Action.gotoFrameAndPlay(0,1000,false)
                          Action.setLastFrameCallFunc(function(){
                            inself.stopAllActions()
                            inself.runAction(cc.repeatForever(cc.sequence(
                                cc.delayTime(1),
                                cc.callFunc(function() {
                                   var n = inself.curtime
                                   inself.xiawendu = (1-Math.pow((1-(0.0025+(n/250000))),n))*25

                                   inself.outwendu = inself.xiawendu + 6*(25-inself.xiawendu)/25

                                   inself.curtime++
                                   if(inself.xiawendu>=25){
                                       inself.xiawendu=25
                                       inself.stopAllActions()
                                   }
                                })
                            )))     
                            Action.clearLastFrameCallFunc()
                          })
                          inself.runAction(Action)
                       }
                    })
                )))                   
         }

        this.toolbtn = createTool({
            pos:cc.p(105, 507),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3,-18),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            counts:[1,3,1],
            movefun:function(data){
                self.toolbtnSomeAction(data);
            },
            firstClick:function(data){

                if(2 == data.index){
                    var somenode = new CreateSomeNode();
                    return  somenode.createMiaobiao();
                }else if(1 == data.index){
                    var somenode;
                    var tmparray = self.toolbtn.getindex(1);
                    if(tmparray == null){
                        somenode = new CreateSomeNode();
                    }else if(tmparray.length==1){
                        if(tmparray[0].colornum )
                          somenode = new CreateSomeNode();
                        else
                          somenode = new CreateSomeNode(cc.color(255,0,0),1);
                    }else if(tmparray.length==2){
                        if((tmparray[0].colornum == 0 && tmparray[1].colornum == 1) ||
                            (tmparray[0].colornum == 1 && tmparray[1].colornum == 0))
                            somenode = new CreateSomeNode(cc.color(45,228,45),2);
                        if((tmparray[0].colornum == 0 && tmparray[1].colornum == 2) ||
                            (tmparray[0].colornum == 2 && tmparray[1].colornum == 0))
                            somenode = new CreateSomeNode(cc.color(255,0,0),1);
                        if((tmparray[0].colornum == 1 && tmparray[1].colornum == 2) ||
                            (tmparray[0].colornum == 2 && tmparray[1].colornum == 1))
                            somenode = new CreateSomeNode()

                    }
                    var wendudu = somenode.createWenduji();
                    somenode.setTemperature(25, 0.05);
                    somenode.addSecheduleCallback(function(someself){
                        self.wendujiSechedule(someself);
                    });
                    somenode.addWendujiEndCallback(function(touch,event,someself){
                        self.wendujiEnd(touch,event,someself);
                    });
                    somenode.addWendujiBeganCallback(function(touch,event,someself){
                        var target = event.getCurrentTarget();
                        if(someself.outbeizi)
                            target.getParent().setLocalZOrder(local_Orade++)
                    });
                    var panl = somenode.getpanel()
                    wendudu.x = 105 , wendudu.y = -20,
                    panl.x = panl.x + 180*wendudu.colornum;
                    wendudu.nopos = true
                    self.somenodeArray.push(somenode);
                    return  wendudu
                }
                if(data.sp)
                    data.sp.setLocalZOrder(local_Orade++)
                return true;
            },

            backfun:function(data){
                if(1 == data.index)
                    return data.sp.canback;

                if( 0 == data.index)
                    return false
                return true;
            },
            clickfun:function(data){
                data.sp.setLocalZOrder(local_Orade++)
                if(2 == data.index)
                    data.sp.canback = true;
                return true
            },
            outfun:function(data){
              if(0 == data.index && self.ice.run){
                  self.ice.playAction()
                  self.ice.run = false
              }
            },
            father:toolnode,
            files:[res.xianbing_sel,res.wenduji_sel,res.miaobiao_sel],
            gets:[res.xianbing,null,null],
            grays:[res.xianbing_sel,res.wenduji_sel,res.miaobiao_sel],
        });

        this.addChild(this.toolbtn,3);
    },
    toolbtnSomeAction: function(data) {
        var self = this;
        this.xianbeizi = this.toolbtn.getindex(0);
        //if(this.xianbeizi)
        //this.xianbeizi.setLocalZOrder(3);
        if (data.index == 0) { //线杯
            data.sp.x += data.delta.x;
            data.sp.y += data.delta.y;
            self.ice.setVisible(true)
            self.ice.setPosition(data.sp.x-18,data.sp.y-32)
            for (var i = 0; i < self.somenodeArray.length; i++) {
                if (!self.somenodeArray[i].outbeizi) {
                    var tmpwenduji = self.somenodeArray[i].getXiaowenduji();
                    tmpwenduji.x += data.delta.x;
                    tmpwenduji.y += data.delta.y;
                }
            }
        } else if (data.index == 1) { //温度计类
            var xiaowenduji = data.sp.getChildByName("xiaowenduji");
            xiaowenduji.x += data.delta.x;
            xiaowenduji.y += data.delta.y;
        } else {
            //data.sp.setLocalZOrder(100)
            data.sp.x += data.delta.x;
            data.sp.y += data.delta.y;
        }
    },
    //边界的判断
    wendujiEnd: function(touch, event, someself) {
        var target = event.getCurrentTarget();
    
        if (target.x < 105 && this.toolbtn.getStatus()) {
            target.getParent().forceBack();

        }

        if (!someself.outbeizi) {

            var convernodepos = target.getParent().convertToNodeSpace(this.xianbeizi.getPosition());
            if (target.x <= convernodepos.x - 74 || target.x >= convernodepos.x + 74) {
                target.x = convernodepos.x;
                target.y = convernodepos.y + 140;
                this.showFacetip({
                    img:res.tip10,
                    mscale:1.2
                });
            }
            if (target.y <= convernodepos.y - 89) {
                target.x = convernodepos.x;
                target.y = convernodepos.y + 140;
                this.showFacetip({
                    img:res.tip12,
                    mscale:1.2
                });
            }
            if (target.y <= convernodepos.y + 120 && target.y >= convernodepos.y + 70) {
                target.x = convernodepos.x;
                target.y = convernodepos.y + 140;
                this.showFacetip({
                    img:res.tip11,
                    mscale:0.9
                });
            }
            if (target.y <= convernodepos.y + 70 && target.y >= convernodepos.y - 60 && this.canspeak) {
                this.nodebs.say({
                    key: "wenzi7",
                    force:true
                })
                this.canspeak = false;
            }
        }
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
    //每个温度计每秒的变化
    wendujiSechedule: function(someself) {
        if (this.xianbeizi) {
            var wenduji = someself.getXiaowenduji();
            var pp = wenduji.getParent().convertToWorldSpace(wenduji.getPosition());
            if (someself.outbeizi) {
                //in 杯子
                if (pp.x >= this.xianbeizi.x - 90 && pp.x <= this.xianbeizi.x + 90 &&
                    pp.y >= this.xianbeizi.y + 115 && pp.y <= this.xianbeizi.y + 130) {
                    someself.outbeizi = false;
                    wenduji.getParent().setLocalZOrder(2);
                    return;
                }

                //杯外面温度变化
                // wenduji.getParent().setLocalZOrder(5);
                if (pp.x <= this.xianbeizi.x - 142 || pp.x >= this.xianbeizi.x + 142){
                    var outtemp = 25
                    if(someself.here){
                        if(someself.here==1){
                          outtemp = this.ice.outwendu
                        }else if(someself.here==2){
                          outtemp = this.ice.xiawendu
                        }
                       outtemp = Math.pow(0.6,1)*outtemp+(1-Math.pow(0.6,1))*25
                    }
                    someself.here = null
                    if (someself.temperature != outtemp)
                        someself.setTemperature(outtemp,3)
                }
                if ((pp.x >= this.xianbeizi.x - 142 && pp.x <= this.xianbeizi.x - 60) || (pp.x >= this.xianbeizi.x + 60 && pp.x <= this.xianbeizi.x + 142)){
                    someself.here = 1
                    if (someself.temperature != this.ice.outwendu)
                         someself.setTemperature(this.ice.outwendu,1);
                }
                if (pp.y < this.xianbeizi.y - 145 || pp.y >= this.xianbeizi.y + 120){
                    var outtemp = 25
                    if(someself.here){
                        if(someself.here==1){
                          outtemp = this.ice.outwendu
                        }else if(someself.here==2){
                          outtemp = this.ice.xiawendu
                        }
                       outtemp = Math.pow(0.6,1)*outtemp+(1-Math.pow(0.6,1))*25
                    }
                    someself.here = null
                    if (someself.temperature != outtemp)
                        someself.setTemperature(outtemp,3)
                }
            } else {
                //杯子里面
                var convernodepos = wenduji.getParent().convertToNodeSpace(this.xianbeizi.getPosition());
                if (pp.y >= this.xianbeizi.y + 130) {
                    someself.here = 2
                    someself.outbeizi = true
                    return
                }
                if (someself.temperature != this.ice.xiawendu)
                    someself.setTemperature(this.ice.xiawendu,5)

                if (pp.x <= this.xianbeizi.x - 75)
                    wenduji.x = convernodepos.x - 75;
                if (pp.x >= this.xianbeizi.x + 75)
                    wenduji.x = convernodepos.x + 75;
                if (pp.y <= this.xianbeizi.y - 90)
                    wenduji.y = convernodepos.y - 90;
            }
        }
    },
    myEnter: function() {
        this._super()
        this.toolbtn.show()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi6",
                    force:true
                })
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,500);
        this.bgnode = new cc.Node()
        this.addChild(this.bgnode,600)

        addContent({
            people: this.nodebs,
            key: "wenzi6",
            sound: res.zi6mp,
            img:res.wenzi6
        })
        addContent({
            people: this.nodebs,
            key: "wenzi7",
            sound: res.zi7mp,
            img:res.wenzi7
        })
    }
    
})