//@author mu @16/5/11

var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
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
                            result.push(tempA)
                            result.push(tempB)
                     
                        }
                        return result
                    }
                },
                biaogeFun: function() {
                    if (!self.bgg) {
                        var colors = []
                        for (var k = 0; k <= 11; k++)
                            colors.push(cc.color(255, 0, 0))
                        var bg = createBiaoge({
                            json: res.biao2,
                            inputNum: 12,
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
                    key: "wenzi2",
                    force:true
                })
            })
        }
    },
    initFunlist: function() {
        var self = this
        this.clockList = [false, true, true, true, true]
        this.imglist = [res.shi1, res.shi2, res.shi3, res.shi4]
        self.inshao = true
        self.inshao1 = true
        this.somenodeArray = []

        var start1 = function(){
             self.clockList[this.index+1] = false
             this.changeWendu = function(){
                 var inself = this
                 inself.outwendu = 70
                 inself.inwendu = 20
                 inself.curtime = 0
                 inself.startxia = false
                 inself.sameT = 0
                 inself.sameTime = 0
                 this.runAction(cc.repeatForever(cc.sequence(
                         cc.delayTime(1),
                         cc.callFunc(function(){
                            inself.curtime++
                            var sfate = 0.0032+inself.curtime/2000000
                            var mfate = Math.pow(1 - sfate,inself.curtime)
                            var mmfate = 1 - mfate
                            inself.outwendu = mfate * 70 - mmfate/(0.032+(inself.curtime/200000))

                            if(inself.startxia){
                                inself.inwendu = inself.outwendu
                            }else{
                               inself.inwendu = inself.inwendu + 0.0024*(inself.outwendu-20)
                            }
                            if(!inself.startxia && inself.inwendu>=inself.outwendu){
                                 inself.startxia = true
                                 inself.sameT = inself.inwendu
                                 inself.sameTime = inself.curtime
                            }
                            if(inself.outwendu<=20){
                                inself.outwendu = 20.3
                                inself.stopAllActions()
                            }
                         })
                    )))
             }

             this.changeWendu()

             this.stopChange = function(){
                this.stopAllActions()
             }
        }
        var start2 = function(){
             this.playInshao = function(){
                var item1 = self.toolbtn.getindex(0)
                var inself = this
                var inbei = ccs.load(res.inshao).node
                var inbeiac = ccs.load(res.inshao).action
                inbeiac.gotoFrameAndPlay(0,36,false)
                inbeiac.setLastFrameCallFunc(function(){
                    self.clockList[inself.index+1] = false
                    inbeiac.clearLastFrameCallFunc()
                })
                item1.addChild(inbei)
                item1.hot.runAction(cc.moveBy(1.5,cc.p(0,70)))
                inbei.setPosition(160,218)
                inbei.runAction(inbeiac)
                this.inshao = inbei
                this.setVisible(false)
                this.y = -600
                item1.setAllVisible(false)
                self.nodebs.say({
                        key: "wenzi3",
                        force:true
                })
             }
             this.stopInshao = function(){
                if(this.inshao){
                 this.inshao.stopAllActions()
                 this.inshao.removeFromParent()
                }
             }
        }
        var start3 = function(){
            this.palyIn = function(){
                this.setVisible(false)
                this.y = -600
                var item1 = self.toolbtn.getindex(0)
                item1.hot.setVisible(false)
                var inbeiac = ccs.load(res.inshao).action
                inbeiac.gotoFrameAndPlay(36,38,false)
                var item2 = self.toolbtn.getindex(1)
                inbeiac.setLastFrameCallFunc(function(){
                  var banq = new cc.Sprite(res.banq)
                  banq.setPosition(item1.x+35,item1.y+136)
                  item1.getParent().addChild(banq)
                  banq.setLocalZOrder(0)
                  item1.banq = banq
                  item2.inshao.getChildByName("beiziback").setVisible(false)
                  inbeiac.clearLastFrameCallFunc()       
                })
                if(item2)
                  item2.inshao.runAction(inbeiac)
                self.clockList[this.index+1] = false
            }      
        }
        this.startFunlist = [
            start1,
            start2,
            start3,
            null,
            null
        ]

        var move1 = function(){
            var delta = this.data.delta
            var temppos = cc.p(this.x + delta.x, this.y + delta.y)
            if(this.banq){
                this.banq.x = this.banq.x + delta.x
                this.banq.y = this.banq.y + delta.y
            }
            this.setPosition(temppos)

            for (var i = 0; i < self.somenodeArray.length; i++) {
                if (!self.somenodeArray[i].outbeizi) {
                    var tmpwenduji = self.somenodeArray[i].getXiaowenduji();
                    tmpwenduji.x += delta.x
                }
            }
        }   
        var move2 = function(){    
            var item = this
            var delta = this.data.delta
            var tempx = item.x + delta.x
            var tempy = item.y + delta.y
            var item1 = self.toolbtn.getindex(0)
            var temprect = cc.rect(item1.x-item1.width/4,item1.y+item1.height/3-30,7*item1.width/12,60)
            if(cc.rectContainsPoint(temprect,cc.p(this.x,this.y-this.height/2)) && self.inshao){
                 this.disMove(true)
                 self.inshao = false
                 this.stopInshao()
                 this.playInshao()
            }
            if(!self.inshao){
                tempx = item.x
                tempy = item.y
            }
            item.setPosition(tempx,tempy)
        } 
        var move3 = function(){    
            var item = this
            var delta = this.data.delta
            var tempx = item.x + delta.x
            var tempy = item.y + delta.y
            var item1 = self.toolbtn.getindex(0)
            var temprect = cc.rect(item1.x-item1.width/4,item1.y+item1.height/3-30,7*item1.width/12,60)
            if(cc.rectContainsPoint(temprect,cc.p(this.x,this.y-this.height/2)) && self.inshao1){
                 this.disMove(true)
                 self.inshao1 = false
                 this.palyIn()
            }
            if(!self.inshao1){
                tempx = item.x
                tempy = item.y
            }
            item.setPosition(tempx,tempy)
        }
        var move4 = function(){    
            var delta = this.data.delta
            this.panle.x = this.panle.x - delta.x
            this.panle.y = this.panle.y - delta.y
            var temppos = cc.p(this.x + delta.x, this.y + delta.y)
            this.setPosition(temppos)
        }
        var move5 = function(){    
            var delta = this.data.delta
            var temppos = cc.p(this.x + delta.x, this.y + delta.y)
            this.setPosition(temppos)
        }  
        self.moveFunList = [
            move1,
            move2,
            move3,
            move4,
            move5
        ]

        var end1 = function(){
            if(this.banq)
                this.banq.setPosition(this.x + 35, this.y + 136)
        }

        this.endFunList = [
            end1,
            null,
            null,
            null,
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
                    father: self,
                    modify:cc.p(0,-6)
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
            level.setScale(1.53,1.43)
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

            item.setAllVisible = function(jude){
                 if(jude){
                    item.setOpacity(255)
                    level.setOpacity(255)
                    beiq.setOpacity(255)
                    biaoqian.setOpacity(255)
                 }else{
                    item.setOpacity(0)
                    level.setOpacity(0)
                    beiq.setOpacity(0)
                    biaoqian.setOpacity(0)
                 }
            }

            return item
        }
    },
    initUI: function() {
        var toolnode = new cc.Node();
        toolnode.x = 0;
        toolnode.y = 0;
        this.addChild(toolnode, 5);
        var self = this
        
        this.toolbtn = createTool({
            pos: cc.p(105, 500),
            nums: 3,
            tri: "down",
            modify: cc.p(1, 1.2),
            devide: cc.p(1.5, 1.2),
            itempos: cc.p(3, -25),
            circlepos: cc.p(0, 15),
            showTime: 0.3,
            moveTime: 0.2,
            scale: 0.8,
            ifcircle: true,
            counts:[1,1,1,2,1],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index==0){
                    var item = self.createShaobei({
                        flagname: res.biaoqian1,
                        showhot: true,
                        showbiao: true,
                        op: 200
                    })
                    item.index = index
                    item.clock = self.clockList[index]
                    item.excstartFun = self.startFunlist[index]
                    local_Orade = local_Orade+2
                    item.setLocalZOrder(local_Orade)
                    item.checkFun = self.checkFun
                    return item.checkFun()
                }else if(index==3){
                    var somenode
                    var tmparray = self.toolbtn.getindex(3)
                    if(tmparray == null){
                        somenode = new CreateSomeNode()
                    }else if(tmparray.length==1){
                        if(tmparray[0].colornum )
                          somenode = new CreateSomeNode()
                        else
                          somenode = new CreateSomeNode(cc.color(137,239,19),1)
                    }
                    somenode.addSecheduleCallback(function(someself){
                        self.wendujiSechedule(someself);
                    })
                    somenode.addWendujiEndCallback(function(touch,event,someself){
                        self.wendujiEnd(touch,event,someself)
                    })
                    somenode.addWendujiMoveCallback(function(touch,event,someself){
                        self.wendujimove(touch,event,someself);
                    })
                    somenode.addWendujiBeganCallback(function(touch,event,someself){
                        var target = event.getCurrentTarget();
                        if(someself.outbeizi){
                            local_Orade = local_Orade+2
                            target.getParent().setLocalZOrder(local_Orade)
                        }
                    })
                    var wendudu = somenode.createWenduji()
                    local_Orade = local_Orade+2
                    wendudu.setLocalZOrder(local_Orade)
                    wendudu.x = 105 
                    wendudu.y = -20
                    somenode.getXiaowenduji().forFather = wendudu
                    var panl = somenode.getpanel()
                    panl.x = panl.x + 180*wendudu.colornum;
                    wendudu.nopos = true
                    wendudu.panle = panl
                    self.somenodeArray.push(somenode)
                    wendudu.clock  = self.clockList[index]
                    wendudu.checkFun = self.checkFun
                    wendudu.index = index

                    return  wendudu.checkFun()
                }else if(index==4){
                    var somenode = new CreateSomeNode()
                    var miaobiao = somenode.createMiaobiao()
                    local_Orade = local_Orade+2
                    miaobiao.setLocalZOrder(local_Orade)
                    miaobiao.index = index
                    miaobiao.clock  = self.clockList[index]
                    miaobiao.checkFun = self.checkFun
                    return  miaobiao.checkFun()
                }else{
                    item.clock  = self.clockList[index]
                    item.excstartFun = self.startFunlist[index]
                    item.checkFun = self.checkFun
                    item.index = index
                    local_Orade = local_Orade+2
                    item.setLocalZOrder(local_Orade)
                    return item.checkFun()
                }
            },
            movefun: function(data) {
                var item = data.sp
                item.data = data
                if (item.excMoveFun)
                    item.excMoveFun()
            },
            clickfun:function(data){
                var item = data.sp
                var index = data.index
                if(index==0){
                    local_Orade = local_Orade + 2 
                    item.setLocalZOrder(local_Orade)
                     if(item.banq)
                         item.banq.setLocalZOrder(local_Orade-1)    
                }else{
                    local_Orade = local_Orade + 2 
                    item.setLocalZOrder(local_Orade)
                }
                return true
            },
            outfun: function(data) {
                var item = data.sp
                if (item.excEndFun)
                    item.excEndFun()
                return true
            },
            backfun:function(data){
                var item = data.sp
                var index = data.index
                item.stopAllActions()
                self.clockList[item.index+1] = true
                if(index==0){
                    return false
                }

                return true
            },
            father: toolnode,
            files: [res.zrsb, res.zlsb, res.kzb, res.wdj2, res.mb2],
            gets: [null, res.xsb, res.dkzb, null, null]
        })
        this.addChild(this.toolbtn, 3)
    },
    wendujiSechedule:function(someself){
        var item1 = this.toolbtn.getindex(0)
        if (item1){
            var wenduji = someself.getXiaowenduji()
            var pp = wenduji.getParent().convertToWorldSpace(wenduji.getPosition())
            if (someself.outbeizi) {
                //in 杯子
                var rect1 = cc.rect(item1.x+15,item1.y+item1.height/2-30,40,30)
                var rect2 = cc.rect(item1.x+70,item1.y+item1.height/2-30,40,30)
                if(cc.rectContainsPoint(rect1,pp)){
                    someself.outbeizi = false
                    someself.hold = 1
                    safeAdd(item1.banq,wenduji)
                    var itemdis = item1.banq.convertToNodeSpace(cc.p(item1.x+35,item1.y+item1.height/2-15))
                    wenduji.setPosition(itemdis)
                    someself.curx = itemdis.x
                    return
                }
                if(cc.rectContainsPoint(rect2,pp)){
                    someself.outbeizi = false
                    someself.hold = 2
                    safeAdd(item1.banq,wenduji)
                    var itemdis = item1.banq.convertToNodeSpace(cc.p(item1.x+90,item1.y+item1.height/2-15))
                    wenduji.setPosition(itemdis)
                    someself.curx = itemdis.x
                    return
                }

                if(item1.T0){
                    var curtrate = Math.pow(0.85,item1.curtime-item1.curT)
                    var Tn = curtrate*item1.T0 + (1-curtrate)/1.5
                    if(Tn<=20)
                        Tn = 20
                    if (someself.temperature != Tn)
                        someself.setTemperature(Tn,4)
                }
            } else {
                //杯子里面
                var convernodepos = wenduji.getParent().convertToNodeSpace(item1.getPosition())
                if (pp.y >= item1.y+item1.height/2+5) {
                    someself.outbeizi = true
                    safeAdd(wenduji.forFather,wenduji)
                    item1.curT = item1.curtime
                    item1.T0 = someself.temperature
                    var dispos = wenduji.forFather.convertToNodeSpace(pp)
                    wenduji.setPosition(dispos)
                    return
                }

                if(someself.hold==1){
                    wenduji.x = someself.curx
                     if(pp.y<=item1.y-20){
                        if (someself.temperature != item1.inwendu)
                           someself.setTemperature(item1.inwendu,3)
                     } 
                }else if(someself.hold==2){
                    wenduji.x = someself.curx
                    if(pp.y<=item1.y){
                        if (someself.temperature != item1.outwendu){
                           someself.setTemperature(item1.outwendu,3)
                        }
                    } 
                }
            }
        }
    },
    wendujiEnd:function(touch,event,someself){
        var self = this

        var wenduji = someself.getXiaowenduji()
        var pp = wenduji.getParent().convertToWorldSpace(wenduji.getPosition())
        if (pp.x < 150 && this.toolbtn.getStatus()) {
            wenduji.getParent().forceBack();
        }
        if(!someself.outbeizi){
             var item1 = this.toolbtn.getindex(0) 
             if(pp.y <= item1.y+item1.height/2-10 && pp.y >= item1.y-20){
                dialogControl.AddDialog("Tips", {
                    res: res.tip12,
                    face: 2,
                    father: self
                })
                return
             }
            
             if(pp.y <= item1.y-item1.height/2+30){
                dialogControl.AddDialog("Tips", {
                    res: res.tip10,
                    face: 2,
                    father: self
                })
                return
             }

             if(pp.y>item1.y-item1.height/2+30 && pp.y< item1.y-20){
                if(self.somenodeArray[0] && self.somenodeArray[1]){
                     if(!self.somenodeArray[0].outbeizi && !self.somenodeArray[1].outbeizi){
                       self.nodebs.say({
                         key: "wenzi4",
                         force:true
                       })
                        self.clockList[4] = false
                     }
                }  
             }
        }
    },
    wendujimove:function(touch,event,someself){
        var target = event.getCurrentTarget()
        var delta = touch.getDelta()
        var tempx = target.x + delta.x
        var tempy = target.y + delta.y
        if(!someself.outbeizi){
             var item1 = this.toolbtn.getindex(0) 
             var wenduji = someself.getXiaowenduji()
             var pp = wenduji.getParent().convertToWorldSpace(cc.p(tempx,tempy))
             if(pp.y < item1.y-item1.height/2+20){
                tempy = item1.y-item1.height/2+20
                return
             }
        }
        target.x = tempx
        target.y = tempy
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,500);

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zimp2,
            img:res.wenzi2
        })
        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.zimp3,
            img:res.wenzi3
        })
        addContent({
            people: this.nodebs,
            key: "wenzi4",
            sound: res.zimp4,
            img:res.wenzi4
        })
    }
})