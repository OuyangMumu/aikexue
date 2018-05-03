//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {});
        this._super()
        var self = this
        this.expCtor({
            vis: false,
            setZ:1000,
            settingData: {
                pos: cc.p(1080, 580),
                tubiaoData: {
                    xname: "时间/min",
                    yname: "温度/°C",
                    father: self,
                    autoData: function() {
                        var result = []
                        if (self.bgg) {
                            var bg = self.bgg
               
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
                            var tempD = {
                                colorPoint: cc.color(5, 200, 100, 255),
                                colorLine: cc.color(5, 200, 100, 255),
                                colorRleation: cc.color(5, 200, 100, 255),
                                colorCurve: cc.color(5, 200, 100, 255),
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
                            for (var i = 17; i < 23; i++) {
                                var point = judgePoint(i-17,i+1)
                                if (point) {
                                    tempD.points.push(point)
                                }
                            }
                            
                            result.push(tempA)
                            result.push(tempB)
                            result.push(tempC)
                            result.push(tempD)
                        }
                        return result
                    }
                },
                biaogeFun: function() {
                    if (!self.bgg) {
                        var colors = []
                        for (var k = 0; k <= 23; k++)
                            colors.push(cc.color(255, 0, 0))
                        var bg = createBiaoge({
                            json: res.biao1,
                            inputNum: 24,
                            strlen:2,
                            isShowResult: false,
                            scale: 0.9,
                            rootColor:colors
                        })
                        self.addChild(bg)
                        self.bgg = bg
                    }
                    self.bgg.setBack(function() {
                        if (self.tubiao) {
                            self.tubiao.judgeAuto()
                        }
                    })
                    var bg = self.bgg
                    bg.show()
                }
            }
        })
        this.initPeople()
        this.initUI()
        this.initFunlist()

        return true
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            this.toolbtn.show()
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi1",
                    force:true
                })
            })
        }
    },
    initFunlist: function() {
        var self = this
        this.clockList = [false, false, false, false, false,false]
        this.imglist = [res.shi1, res.shi2, res.shi3, res.shi4, res.tip4, res.tip4]
        this.colorlist = [
            {num:3,color:cc.color(230,67,170)},
            {num:2,color:cc.color(255,0,0)},
            {num:1,color:cc.color(137,239,19)},
            {num:0,color:null}
        ]

        this.startFunlist = [
            null,
            null,
            null,
            null,
            null
        ]

        var move = function(){
             var delta = this.data.delta
            for (var i = 0; i < self.somenodeArray.length; i++) {
                if(self.somenodeArray[i]){
                    if(self.somenodeArray[i].inbei)
                    if(this.index == self.somenodeArray[i].inbei.index){
                       if (!self.somenodeArray[i].outbeizi) {
                          var tmpwenduji = self.somenodeArray[i].getXiaowenduji()
                          tmpwenduji.x += delta.x
                          tmpwenduji.y += delta.y
                      }
                    }
                }
            }
        }

        self.moveFunList = [
            move,
            move,
            move,
            move,
            null
        ]

        var end1 = function(){
           this.setPosition(270,120)
        }
        var end2 = function(){
           this.setPosition(470,120)
        }
        var end3 = function(){
           this.setPosition(670,120) 
        }
        var end4 = function(){
           this.setPosition(870,120)
        }

        this.endFunList = [
            end1,
            end2,
            end3,
            end4,
            null
        ]

        this.checkFun = function() {
            if (this.clock) {
                var res_img = null
                var curimg = 0
                for (var k = 0; k < self.clockList.length; k++) {
                    if (!self.clockList[k])
                        curimg = k
                }
                dialogControl.AddDialog("Tips", {
                    res: self.imglist[curimg],
                    face: 2,
                    father: self
                })
                return false
            } else {
                if (this.excstartFun)
                    this.excstartFun()
                this.excEndFun = self.endFunList[this.index]
                this.excMoveFun = self.moveFunList[this.index]
                return this
            }
        }
        

        this.cupInfo = [
            {
                flagname:res.biaoqian1,
                showhot:false,
                scale:0.8,
                op:10
            },
            {
                flagname:res.biaoqian2,
                showhot:true,
                scale:0.8,
                op:130
            },
            {
                flagname:res.biaoqian3,
                showhot:true,
                scale:0.8,
                op:180
            },
            {
                flagname:res.biaoqian4,
                showhot:true,
                scale:0.8,
                op:250
            }
        ]
        this.createShaobei = function(data){

            var flagname = data.flagname
            var showhot = data.showhot || false
            var op = data.op || 255
            var scale = data.scale || 1
            var showbiao = data.showbiao || false

            var item = new cc.Sprite(res.beih)
            var level = new cc.Sprite(res.levelwater)
            var beiq = new cc.Sprite(res.beiq)
            var biaoqian = new cc.Sprite(flagname)

            level.setPosition(142.8,-1)
            level.setAnchorPoint(cc.p(0.5,0))
            level.setScale(1.53,1.7)
            item.level = level

            beiq.setPosition(123.42,121.94)

            if(showbiao)
                biaoqian.setVisible(false)
            biaoqian.setPosition(96,140)
          
            if(showhot){
                var hot = loadNode(res.hot,null)
                var hotac = ccs.load(res.hot).action
                hotac.gotoFrameAndPlay(0,450,true)
                hot.runAction(hotac)
                hot.setPosition(150,170)
                hot.setCascadeOpacityEnabled(true)
                hot.setOpacity(op)
                item.addChild(hot,2)
                item.hot = hot
            }

            item.addChild(level,1)
            item.addChild(beiq,3)
            item.addChild(biaoqian,4)
            item.setScale(scale)
            return item
        }
    },
    initUI: function() {
        var toolnode = new cc.Node();
        toolnode.x = 0;
        toolnode.y = 0;
        this.addChild(toolnode, 5);
        var self = this
        this.somenodeArray = [null,null,null,null]
        self.wendulist = [
        {max:20,rate:0,hi:1.7},
        {max:40,rate:90000,hi:1.6},
        {max:60,rate:170000,hi:1.5},
        {max:90,rate:290000,hi:1.4}]

        this.toolbtn = createTool({
            pos: cc.p(105, 500),
            nums: 3,
            tri: "down",
            modify: cc.p(1, 1.2),
            devide: cc.p(1.5, 1.2),
            itempos: cc.p(3, -10),
            circlepos: cc.p(0, 15),
            showTime: 0.3,
            moveTime: 0.2,
            scale: 0.8,
            ifcircle: true,
            counts:[1,1,1,1,4,1],
            firstClick: function(data) {
                var index = data.index
                if (index != 4 && index != 5) {    
                    var item = self.createShaobei(self.cupInfo[index])
                    item.index = index
                    item.clock = self.clockList[index]
                    item.setLocalZOrder(local_Orade++)
                    item.checkFun = self.checkFun
                    item.max = self.wendulist[index].max
                    item.tempwendu = item.max
                    item.rate = self.wendulist[index].rate
                    item.hi = self.wendulist[index].hi
                    item.curtime = 0
                    item.fade = true
                    item.level.runAction(cc.scaleTo((item.max-20)*40,1.53,item.hi))
                    item.runAction(cc.repeatForever(cc.sequence(
                        cc.delayTime(1),
                        cc.callFunc(function(){
                            item.curtime++
                            if(item.tempwendu<=20){
                                item.tempwendu = 20
                                item.stopAllActions()
                            }else{
                                var sfate = 0.0032+item.curtime/(10*item.rate)
                                var ssfate = 0.0032+item.curtime/item.rate 
                                var mfate = Math.pow(1 - sfate, item.curtime)
                                item.tempwendu = mfate*item.max
                                cc.log("item.tempwendu",item.tempwendu)
                                if(item.tempwendu<=36){
                                    if(item.fade){
                                       item.fade =false
                                       item.hot.runAction(cc.fadeOut(2))
                                    }
                                }
                            }
                        })
                    )))
                    return item.checkFun()

                } else if(index==4){
                    var curcolor = 3 
                    for(var k=0;k<self.colorlist.length;k++){
                        cc.log(self.somenodeArray[k])
                       if(curcolor > self.colorlist[k].num && !self.somenodeArray[k]){
                              curcolor = self.colorlist[k].num 
                       }
                    }
                    var somenode = new CreateSomeNode(self.colorlist[3-curcolor].color)
                    somenode.addSecheduleCallback(function(someself){
                        self.wendujiSechedule(someself);
                    })
                    somenode.addWendujiEndCallback(function(touch,event,someself){
                        self.wendujiEnd(touch,event,someself)
                    })
                    somenode.addWendujiMoveCallback(function(touch,event,someself){
                        self.wendujimove(touch,event,someself)
                    })
                    somenode.addWendujiBeganCallback(function(touch,event,someself){
                        var target = event.getCurrentTarget();
                        if(someself.outbeizi)
                            target.getParent().setLocalZOrder(local_Orade++)
                    })
                    var wendudu = somenode.createWenduji()
                    wendudu.setLocalZOrder(local_Orade++)
                    wendudu.x = 105 
                    wendudu.y = -20
                    var panl = somenode.getpanel()
                    panl.x = panl.x + 20 + 130*curcolor;
                    wendudu.nopos = true
                    wendudu.panle = panl
                    panl.setScale(0.7)
                    var wenduji = somenode.getXiaowenduji()
                    wenduji.index = 3-curcolor
                    wenduji.setScale(0.7)
                    self.somenodeArray[3-curcolor] = somenode
                    wendudu.clock  = self.clockList[index]
                    wendudu.checkFun = self.checkFun
                    wendudu.index = index

                    return  wendudu.checkFun()

                } else if(index==5){
                    var somenode = new CreateSomeNode();
                    var miaobiao = somenode.createMiaobiao()
                    miaobiao.setLocalZOrder(local_Orade++)
                    return  miaobiao
                }
                return false
            },
            movefun: function(data) {
                var item = data.sp
                var index = data.index
                var delta = data.delta
                item.data = data
                if(index == 4){
                    item.panle.x = item.panle.x - delta.x
                    item.panle.y = item.panle.y - delta.y
                }
                var temppos = cc.p(item.x + delta.x, item.y + delta.y)
                item.setPosition(temppos)
                if (item.excMoveFun)
                    item.excMoveFun()
            },
            clickfun:function(data){
                var item = data.sp
                item.setLocalZOrder(local_Orade++)
                var index = data.index
                if(index<4)
                for (var i = 0; i < self.somenodeArray.length; i++) {
                    if(self.somenodeArray[i]){
                        if(self.somenodeArray[i].inbei)
                        if(item.index == self.somenodeArray[i].inbei.index){
                           if (!self.somenodeArray[i].outbeizi) {
                              var tmpwenduji = self.somenodeArray[i].getXiaowenduji()
                              tmpwenduji.mospos = tmpwenduji.getPosition()
                          }
                        }
                    }
                }
                return true
            },
            outfun: function(data) {
                var item = data.sp
                var index = data.index
                item.data = data
                if (item.excEndFun)
                    item.excEndFun()
                if(index<4)
                for (var i = 0; i < self.somenodeArray.length; i++) {
                    if(self.somenodeArray[i]){
                        if(self.somenodeArray[i].inbei)
                        if(item.index == self.somenodeArray[i].inbei.index){
                           if (!self.somenodeArray[i].outbeizi) {
                              var tmpwenduji = self.somenodeArray[i].getXiaowenduji()
                              tmpwenduji.setPosition(tmpwenduji.mospos)
                          }
                        }
                    }
                }
                return true
            },
            backfun:function(data){
                var index = data.index
                if(index<4)
                    for (var i = 0; i < self.somenodeArray.length; i++) {
                        if(self.somenodeArray[i]){
                            if(self.somenodeArray[i].inbei)
                            if(index == self.somenodeArray[i].inbei.index){
                               if (!self.somenodeArray[i].outbeizi) {
                                  var tmpwenduji = self.somenodeArray[i].getXiaowenduji()
                                   tmpwenduji.getParent().forceBack()
                                   self.somenodeArray[tmpwenduji.index] = null
                              }
                            }
                        }
                    }
                return true
            },
            father: toolnode,
            files: [res.zls, res.ws, res.rs, res.ks, res.wdj, res.mb],
            gets: [null, null, null, null, null, null]
        })
        this.addChild(this.toolbtn, 3)
    },
    wendujiSechedule:function(someself){
        for(var k=0 ;k<4;k++){
           var beisp = this.toolbtn.getindex(k)
           if(beisp){
                var wenduji = someself.getXiaowenduji()
                var pp = wenduji.getParent().convertToWorldSpace(wenduji.getPosition())
    
                if (someself.outbeizi) {
                    //in 杯子
                    if (pp.x >=beisp.x - 60 && pp.x <= beisp.x + 80 &&
                        pp.y >= beisp.y + 80 && pp.y <= beisp.y + 95) {
                        someself.outbeizi = false
                        someself.inbei = beisp
                        wenduji.getParent().setLocalZOrder(2)
                        return
                    }
                   if(someself.inbei){
                    var curtrate = Math.pow(0.85,someself.inbei.curtime-someself.curT)
                    var Tn = curtrate*someself.T0 + (1-curtrate)/1.5
                    if(Tn<=20)
                        Tn = 20
                    if (someself.temperature != Tn)
                        someself.setTemperature(Tn,4)

                   }
                }else{
                    //杯子里面
                    var convernodepos = wenduji.getParent().convertToNodeSpace(someself.inbei.getPosition());
                    if (pp.y >= someself.inbei.y + 95) {
                        someself.outbeizi = true
                        someself.T0 = someself.temperature
                        someself.curT = someself.inbei.curtime
                        return;
                    }
                    if(pp.y <=someself.inbei.y - 30){
                        if (someself.temperature != someself.inbei.tempwendu)
                           someself.setTemperature(someself.inbei.tempwendu,5)
                    }
                    if (pp.x <= someself.inbei.x - 50)
                        wenduji.x = convernodepos.x - 50;
                    if (pp.x >= someself.inbei.x + 80)
                        wenduji.x = convernodepos.x + 80;
                    if (pp.y <= someself.inbei.y - 90)
                        wenduji.y = convernodepos.y - 90;
                }
           }
        }
    },
    wendujiEnd:function(touch,event,someself){
        var self = this
        var wenduji = someself.getXiaowenduji()
        var pp = wenduji.getParent().convertToWorldSpace(wenduji.getPosition())
        if (pp.x < 150 && this.toolbtn.getStatus()) {
            wenduji.getParent().forceBack()
            this.somenodeArray[wenduji.index] = null
        }

         if (!someself.outbeizi) {
            var convernodepos = wenduji.getParent().convertToNodeSpace(someself.inbei.getPosition());
            if (wenduji.x <= convernodepos.x - 50 ||
             wenduji.x >= convernodepos.x + 80) {
                if(wenduji.y <= convernodepos.y - 89){
                  this.showFacetip({
                    img:res.tip13,
                    mscale:1
                  }) 
                }else{
                  this.showFacetip({
                    img:res.tip10,
                    mscale:1
                  }) 
                }  
            }
            if (wenduji.y <= convernodepos.y - 89 && 
                wenduji.x >= convernodepos.x - 50 
                && wenduji.x <= convernodepos.x + 80) {
                this.showFacetip({
                    img:res.tip11,
                    mscale:1
                })
            }
            if (wenduji.y <= convernodepos.y + 20 &&
             wenduji.y >= convernodepos.y-50) {
                this.showFacetip({
                    img:res.tip12,
                    mscale:1
                })
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
    wendujimove:function(touch,event,someself){
        var target = event.getCurrentTarget()
        var delta = touch.getDelta()
        var tempx = target.x + delta.x
        var tempy = target.y + delta.y
        target.x = tempx
        target.y = tempy
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500);

        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.zimp1,
            img:res.wenzi1
        })
    }
})