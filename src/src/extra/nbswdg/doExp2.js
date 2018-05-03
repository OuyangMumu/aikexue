var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                ifCount: true,
                rootColor: cc.color(50,50,200),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.nbswdg_tableNode_2_json,
                            inputNum:21,
                            scale:0.9,
                            judgeOrder:true,
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                    self.biaoge.setLocalZOrder(1000)
                },
            }
        });
        this.initPeople();
        this.initUI()
        this.initFunlist()
        return true;
    },
    initUI:function(){
        var self = this
        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip2"})
        })
        self.judgeSay = [false,false,false,false]  //判断什么时候提示说第二句话
        self.tipNode = new cc.Node()
        self.tipNode.setPosition(0, 0)
        self.addChild(self.tipNode, 1000)
        this.createTool()
    },

    getRandNum:function(){
        var rand = parseInt(95*Math.random())
        if(rand == 0)
            rand = 2
        return rand
    },

    initFunlist: function() {
        var self = this
        this.clockList = [false, false, false, false]

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
        this.startFunlist = [
            null,
            null,
            null,
            null
        ]
        self.moveFunList = [
            move,
            move,
            move,
            move,
        ]
        var end2 = function(){
           this.removeListen()
        }
        this.endFunList = [
            null,
            null,
            null,
            end2
        ]
        this.cupInfo = [{
                flagname: res.biaoqian1,
                levelPosY: 85,  //没倒水的时候液面刻度值
                levelPosY2: 158,  //倒水后刻度值
                levelValue: -50,  //温度计和液面接触的位置，及控制液面上方和液面下方
                scale: 0.8,
            },{
                flagname:res.biaoqian2,
                levelPosY: 45,  
                levelPosY2: 122,  
                levelValue: -75, 
                scale:0.8,
            },{
                flagname:res.biaoqian3,
                levelPosY: 158,  
                levelPosY2: 85,  
                levelValue: 10, 
                scale:0.8,
            }]
        this.checkFun = function() {
            if (this.clock) {
                var res_img = null
                var curimg = 0
                for (var k = 0; k < self.clockList.length; k++) {
                    if (!self.clockList[k])
                        curimg = k
                }
                return false
            } else {
                if (this.excstartFun)
                    this.excstartFun()
                this.excEndFun = self.endFunList[this.index]
                this.excMoveFun = self.moveFunList[this.index]
                return this
            }
        }
    },
    createTool:function(){
        var self = this
        loadPlist("biaoqian3_ds_plist")
        loadPlist("biaoqian3_ds2_plist")
        //创建一个烧杯用来倒水
        var shaobei = new cc.Sprite("#biaoqian3_ds01.png")
        shaobei.setPosition(400,-500)
        self.addChild(shaobei,30)
        shaobei.setScale(1.4)
        var curTemp = self.getRandNum() //1号和2号烧杯中的水温值
        var changeTemp = function(){
            curTemp = self.getRandNum()
        }

        this.somenodeArray = [null,null,null,null]
        this.colorlist = [
            {num:3,color:cc.color(220,30,180)},
            {num:2,color:cc.color(255,0,0)},
            {num:1,color:cc.color(137,239,19)},
            {num:0,color:null}
        ]

        var allSbBack = false  //回收所有温度计
        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 3,
            scale:0.8,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.5),
            itempos: cc.p(0, -20),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:false,
            father: self,
            myrect:cc.rect(0,0,244,222),
            counts: [999999, 999999, 9999,4],
            swallow: [true, true, true, true],
            files: [res.tools1, res.tools2, res.tools3, res.tools4],
            gets: [null,null,null,null],
            firstClick: function(data) {
                var index = data.index
                //各种回收烧杯的姿势
                if(index != 3){
                    var curSB_0 = self.getCurShaobei(0)
                    var curSB_1 = self.getCurShaobei(1)
                    var curSB_2 = self.getCurShaobei(2)
                    if(curSB_0){
                        if(curSB_0.noMove)  return false
                    }
                    if(curSB_1){
                        if(curSB_1.noMove)  return false
                    }
                    if(curSB_2){
                        if(curSB_2.noMove)  return false
                    }
                    if(allSbBack){
                        allSbBack = false
                        changeTemp()
                        if(self.getCurShaobei(0)){
                           self.getCurShaobei(0).forceBack()
                            Sb_Wdj_back(0) 
                        }
                        
                        if(self.getCurShaobei(1)){
                           self.getCurShaobei(1).forceBack()
                            Sb_Wdj_back(1) 
                        }
                    }else if(self.getCurShaobei(index)){
                        if(curSB_0 && curSB_0.haveWater){
                            curSB_0.forceBack()
                            Sb_Wdj_back(0) 
                            if(curSB_2){
                                curSB_2.forceBack()
                                Sb_Wdj_back(2) 
                            }
                        }
                        if(curSB_1 && curSB_1.haveWater){
                            curSB_1.forceBack()
                            Sb_Wdj_back(1) 
                            if(curSB_2){
                                curSB_2.forceBack()
                                Sb_Wdj_back(2) 
                            }
                        }

                        if(self.getCurShaobei(index)){
                            cc.log("again back")
                            self.getCurShaobei(index).forceBack()
                            Sb_Wdj_back(index)  
                        }
                    }   
                }
                
                if (index != 3) {   
                    var item = self.createShaobei(self.cupInfo[index])
                    item.index = index
                    item.clock = self.clockList[index]
                    item.checkFun = self.checkFun
                    item.setLocalZOrder(local_Orade++)
                    item.haveWdj = false  //判断当前烧杯内是否含有温度计
                    item.haveWater = false //判断烧杯中是否有水
                    if(index == 2){
                        item.inFirst = true
                        item.tempwendu = self.getRandNum()
                    }else{
                        item.tempwendu = curTemp
                    }
                    item.hot = null
                    //创建热气
                    if(item.tempwendu > 30){
                        item.hot = getZq({father:item,pos:cc.p(150,250),scale:1.5})
                    }
                    cc.log("curWendu:",item.tempwendu)

                    return item.checkFun()
                } else{
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
                    wendudu.x = 90 
                    wendudu.y = 200
                    var panl = somenode.getpanel()
                    panl.x = panl.x + 20 + 130*curcolor;
                    panl.y = 300
                    wendudu.nopos = true
                    wendudu.panle = panl
                    panl.setScale(0.7)
                    var wenduji = somenode.getXiaowenduji()
                    wenduji.getChildByName("dingweiqi").setGlobalZOrder(0)
                    wenduji.index = 3-curcolor
                    wenduji.setScale(0.7)
                    self.somenodeArray[3-curcolor] = somenode
                    wendudu.clock  = self.clockList[index]
                    wendudu.checkFun = self.checkFun
                    wendudu.index = index

                    return  wendudu.checkFun()
                }
                return false
            },
            movefun: function(data) {
                var item = data.sp
                var index = data.index
                var delta = data.delta
                if(item.noMove)
                    return false
                item.data = data
                if(index == 3){
                    item.panle.x = item.panle.x - delta.x
                    item.panle.y = item.panle.y - delta.y
                }
                var temppos = cc.p(item.x + delta.x, item.y + delta.y)
                item.setPosition(temppos)
                if(index == 2 && !item.inFirst){
                    shaobei_ds(item)
                }
                if (item.excMoveFun)
                    item.excMoveFun()
            },
            clickfun:function(data){
                var item = data.sp
  
                return true
            },
            outfun: function(data) {
                var item = data.sp
                var index = data.index
                item.data = data
                if(index == 2 && item.inFirst){
                    item.inFirst = false
                    cc.log("cur is first")
                }
                if (item.excEndFun)
                    item.excEndFun()
                return true
            },
            backfun:function(data){
                var index = data.index
                if(index != 3)
                    Sb_Wdj_back(index)
                return true
            },
        })
        self.addChild(toolbtn)
        toolbtn.show()
        this.toolbtn = toolbtn

        //温度计在烧杯中，和烧杯一起回收
        var Sb_Wdj_back = function(index){
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
        }

        var shaobei_ds = function(item){
            var checkFun = function(sb){
                if(!sb.haveWater && self.checkDistance(item,sb)){
                    if(!item.haveWdj && !sb.haveWdj){
                        var dis = Math.abs(item.tempwendu - sb.tempwendu)
                        if(sb.index == 0){
                            sb.tempwendu = ((sb.tempwendu+item.tempwendu)/2) * (Math.pow(((-8/672655)*dis),2)+(-13/177844)*dis+1)
                        }else{
                            sb.tempwendu = ((sb.tempwendu+2*item.tempwendu)/3) * (Math.pow(((-8/672655)*dis),2)+(-13/177844)*dis+1)
                        }
                        cc.log("new wendu:",sb.tempwendu)
                        sb.haveWater = true
                        sb.noMove = true
                        item.noMove = true
                        item.setPositionY(-600)
                        shaobei.setPosition(sb.x+220,sb.y+140)
                        var frame = "biaoqian3_ds%02d.png"
                        if(item.haveWater){
                            frame = "biaoqian3_ds2%02d.png"
                        }
                        sb.level.runAction(cc.sequence(
                            cc.delayTime(1.5),
                            cc.moveTo(3,sb.level.x,sb.levelPosY2)
                        ))
                        shaobei.runAction(cc.sequence(
                            self.ani_shaobei(frame),
                            cc.delayTime(0.5),
                            cc.callFunc(function(){
                                sb.noMove = false
                                item.noMove = false
                                shaobei.setPositionY(-500)
                                sb.levelValue = sb.levelValue + 50
                                if(item.haveWater){
                                    item.setPositionY(-600)
                                    item.forceBack(true)
                                    allSbBack = true
                                }else{
                                    item.level.setPositionY(85)
                                    item.haveWater = true
                                    item.levelValue = item.levelValue - 50
                                    item.setPosition(sb.x+250,sb.y+40)
                                }
                                if(sb.hot){
                                    if(sb.tempwendu < 30)
                                        sb.hot.removeFromParent(true)
                                }
                            })
                        ))
                    }else{
                        self.showFacetip({img:res.dialog5,mscale:1}) 
                    }
               }
            }

            if(self.getCurShaobei(0)){
                var sb = self.getCurShaobei(0) 
                checkFun(sb)
            }
            if(self.getCurShaobei(1)){
                var sb = self.getCurShaobei(1) 
                checkFun(sb)
            }
        }
    },

    getCurShaobei : function(index){
        var list = this.toolbtn.getindex(index)
        if(list && list[0]){
            return list[0]
        }
    },

    createShaobei:function(data){
        var flagname = data.flagname
        var showhot = data.showhot || false
        var op = data.op || 255
        var scale = data.scale || 1
        var levelValue = data.levelValue   //液面值
        var levelPosY = data.levelPosY    //液体位置值
        var levelPosY2 = data.levelPosY2

        var item = new cc.Sprite(res.beih)
        var level = new cc.Sprite(res.levelwater)
        var beiq = new cc.Sprite(res.beiq)
        var biaoqian = new cc.Sprite(flagname)

        item.levelValue = levelValue  //液面值，液面上方，液面下方
        item.levelPosY = levelPosY
        item.levelPosY2 = levelPosY2
        item.Time = 3

        level.setPosition(143,item.levelPosY)
        level.setScale(1.4,1.4)
        item.level = level

        beiq.setPosition(123.42,121.94)
        biaoqian.setPosition(113,120)

        item.addChild(level,1)
        item.addChild(beiq,3)
        item.addChild(biaoqian,4)
        item.setScale(scale)
        return item
    },
    wendujiSechedule:function(someself){
        var self = this
        for(var k=0 ;k<3;k++){
           var beisp = self.getCurShaobei(k)//this.toolbtn.getindex(k)
           if(beisp){
                var wenduji = someself.getXiaowenduji()
                var pp = wenduji.getParent().convertToWorldSpace(wenduji.getPosition())
    
                //在杯子外面
                if (someself.outbeizi) {
                    if (pp.x >=beisp.x - 60 && pp.x <= beisp.x + 80 &&
                        pp.y >= beisp.y + 70 && pp.y <= beisp.y + 100) {
                        someself.outbeizi = false
                        someself.inbei = beisp
                        wenduji.getParent().setLocalZOrder(2)
                        self.judgeSay[someself.inbei.index] = true
                        if(!self.judgeSay[3]){
                            if(self.judgeSay[0] && self.judgeSay[1] && self.judgeSay[2]){
                                self.judgeSay[3] = true
                                self.nodebs.say({key:"do_tip3",force:true})
                            }
                        }
                        return
                    }
                   if(someself.inbei){
                    var curtrate = Math.pow(0.85,someself.inbei.curtime-someself.curT)
                    var Tn = curtrate*someself.T0 + (1-curtrate)/1.5
                    Tn = 20
                    if(someself.inbei.haveWdj)
                        someself.inbei.haveWdj = false
                    if (someself.temperature != Tn)
                        someself.setTemperature(Tn,3)

                   }
                }else{
                    //杯子里面
                    var convernodepos = wenduji.getParent().convertToNodeSpace(someself.inbei.getPosition());
                    
                    if (pp.y >= someself.inbei.y + 95) {
                        someself.outbeizi = true
                        someself.T0 = someself.temperature
                        someself.curT = someself.inbei.curtime
                        someself.inbei.Time = 3
                        
                        return;
                    }
                    if(!someself.inbei.haveWdj)
                        someself.inbei.haveWdj = true
                    //判断是在杯壁还是在杯子中间
                    if(pp.y <=someself.inbei.y + someself.inbei.levelValue){ // - 50 ， 10
                        if(pp.x >= someself.inbei.x - 48 && pp.x <= someself.inbei.x + 78
                         && pp.y >= someself.inbei.y - 98){
                           if(someself.temperature != someself.inbei.tempwendu)
                                someself.setTemperature(someself.inbei.tempwendu,someself.inbei.Time)
                        }else{
                            someself.inbei.Time = 1
                            if(someself.temperature != someself.inbei.tempwendu-2)
                                someself.setTemperature(someself.inbei.tempwendu-2,someself.inbei.Time)     
                        } 
                    }
                    if (pp.x <= someself.inbei.x - 50){
                        wenduji.x = convernodepos.x - 50;
                    }
                    if (pp.x >= someself.inbei.x + 80){
                        wenduji.x = convernodepos.x + 80;
                    }
                    if (pp.y <= someself.inbei.y - 100){
                        wenduji.y = convernodepos.y - 100;
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
            wenduji.getParent().forceBack()
            this.somenodeArray[wenduji.index] = null
        }

         if (!someself.outbeizi) {
            var convernodepos = wenduji.getParent().convertToNodeSpace(someself.inbei.getPosition());
            if (wenduji.x <= convernodepos.x - 50 ||
             wenduji.x >= convernodepos.x + 80) {
                if(wenduji.y <= convernodepos.y - 99){
                  this.showFacetip({
                    img:res.dialog4,
                    mscale:1
                  }) 
                }else{
                  this.showFacetip({
                    img:res.dialog1,
                    mscale:1
                  }) 
                }  
            }
            if (wenduji.y <= convernodepos.y - 99 && 
                wenduji.x >= convernodepos.x - 50 
                && wenduji.x <= convernodepos.x + 80) {
                this.showFacetip({
                    img:res.dialog2,
                    mscale:1
                })
            }
            //液面
            if (wenduji.y <= convernodepos.y + someself.inbei.levelValue + 10 &&   //200ML的时候是 -40，-60 400ML的时候是20,0
                wenduji.y >= convernodepos.y + someself.inbei.levelValue - 10) {
                this.showFacetip({
                    img:res.dialog3,
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
            father: self.tipNode
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

    checkDistance:function(r1,r2){
        var dx = r1.x - r2.x-50
        var dy = r1.y - r2.y
        var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
        if(distance <= 100)
            return true
        else
            return false
    },

    ani_shaobei:function(frame){
        return cc.sequence(createAnimation({
            frame: frame,
            start:1,
            end: 15,
            time: 0.35
        }))
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,999)
        var addList = [
            {key:"do_tip2",img:res.do_tip2,sound:res.do_sound2},
            {key:"do_tip3",img:res.do_tip3,sound:res.do_sound3},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})