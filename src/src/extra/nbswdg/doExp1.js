var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        this._super();
        var self = this
        this.expCtor({
            vis: false,
            setZ:1000,
            settingData: {
                pos: cc.p(1080, 580),
                ifCount: true,
                rootColor: cc.color(50,50,200),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.nbswdg_tableNode_1_json,
                            inputNum:12,
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
            self.nodebs.say({key:"do_tip1"})
        })
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
        this.clockList = [false, false, false]
        this.imglist = [res.shi1, res.shi2, res.shi3]

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
            null
        ]
        self.moveFunList = [
            move,
            move,
            move
        ]
        var end2 = function(){
           this.removeListen()
        }
        this.endFunList = [
            null,
            null,
            end2
        ]
        this.cupInfo = [{
                flagname:res.biaoqian1,
                scale:0.8,
            },{
                flagname:res.biaoqian2,
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
                // dialogControl.AddDialog("Tips", {
                //     res: self.imglist[curimg],
                //     face: 2,
                //     father: self
                // })
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
        loadPlist("shaobei2_ds_plist")
        loadPlist("shaobei1_ds_plist")
        //创建一个烧杯用来倒水
        var shaobei = new cc.Sprite("#shaobei2_ds01.png")
        shaobei.setPosition(400,-500)
        self.addChild(shaobei,30)

        this.somenodeArray = [null,null,null,null]
        this.colorlist = [
            {num:2,color:cc.color(255,0,0)},
            {num:1,color:cc.color(137,239,19)},
            {num:0,color:null}
        ]

        var allSbBack = false  //回收所有温度计
        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 3,
            scale:0.85,
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
            counts: [999999, 999999, 3],
            swallow: [true, true, true],
            files: [res.tools1, res.tools2, res.tools4],
            gets: [null,null,null],
            firstClick: function(data) {
                var index = data.index
                if(index != 2){
                    var curSB_0 = self.getCurShaobei(0)
                    var curSB_1 = self.getCurShaobei(1)
                    if(curSB_0){
                        if(curSB_0.noMove)  return false
                    }
                    if(curSB_1){
                        if(curSB_1.noMove)  return false
                    }
                    if(allSbBack){
                        allSbBack = false
                        if(self.getCurShaobei(0)){
                           self.getCurShaobei(0).forceBack()
                            Sb_Wdj_back(0) 
                        }
                        
                        if(self.getCurShaobei(1)){
                           self.getCurShaobei(1).forceBack()
                            Sb_Wdj_back(1) 
                        }
                    }else if(self.getCurShaobei(index)){
                        self.getCurShaobei(index).forceBack()
                        Sb_Wdj_back(index) 
                    }
                }
                
                if (index != 2) {    
                    var item = self.createShaobei(self.cupInfo[index])
                    item.index = index
                    item.clock = self.clockList[index]
                    item.checkFun = self.checkFun
                    item.setLocalZOrder(local_Orade++)
                    item.haveWdj = false  //判断当前烧杯内是否含有温度计
                    item.inFirst = true   //用于判断当前是否第一次点击拖出来
                    return item.checkFun()
                } else{
                    var curcolor = 2 
                    for(var k=0;k<self.colorlist.length;k++){
                        cc.log(self.somenodeArray[k])
                       if(curcolor > self.colorlist[k].num && !self.somenodeArray[k]){
                              curcolor = self.colorlist[k].num 
                       }
                    }
                    var somenode = new CreateSomeNode(self.colorlist[2-curcolor].color)
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
                    wenduji.getChildByName("dingweiqi").setGlobalZOrder(0)
                    wenduji.index = 2-curcolor
                    wenduji.setScale(0.7)
                    self.somenodeArray[2-curcolor] = somenode
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
                if(index == 2){
                    item.panle.x = item.panle.x - delta.x
                    item.panle.y = item.panle.y - delta.y
                }
                var temppos = cc.p(item.x + delta.x, item.y + delta.y)
                item.setPosition(temppos)
                if(index == 0){
                    shaobei_ds(item, 1, "shaobei1_ds%02d.png")
                }else if(index == 1){
                    shaobei_ds(item, 0, "shaobei2_ds%02d.png")
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
                if(index != 2 && item.inFirst){
                    item.inFirst = false
                    cc.log("cur is first")
                }
                if (item.excEndFun)
                    item.excEndFun()
                return true
            },
            backfun:function(data){
                var index = data.index
                if(index != 2)
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

        var shaobei_ds = function(item,index,frame){
            if(item.inFirst)    return //判断是否第一次点击，第一次点击将不能进行倒水
            if(self.getCurShaobei(index)){
                var sb = self.getCurShaobei(index)
                if(self.checkDistance(item,sb)){
                    if(!item.haveWdj && !sb.haveWdj){
                        sb.tempwendu = (item.tempwendu + sb.tempwendu) / 2
                        cc.log("new wendu:",sb.tempwendu)
                        allSbBack = true
                        sb.noMove = true
                        item.noMove = true
                        item.setPositionY(-600)
                        shaobei.setPosition(sb.x+220,sb.y+140)
                        sb.level.runAction(cc.sequence(
                            cc.delayTime(1.5),
                            cc.moveTo(3,sb.level.x,158)
                        ))
                        shaobei.runAction(cc.sequence(
                            self.ani_shaobei(frame),
                            cc.delayTime(0.5),
                            cc.callFunc(function(){
                                sb.noMove = false
                                item.forceBack()
                                shaobei.setPositionY(-500)
                                sb.levelValue1 = 10
                                sb.levelValue2 = 20
                                sb.levelValue3 = 0
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

        var item = new cc.Sprite(res.beih)
        var level = new cc.Sprite(res.levelwater)
        var beiq = new cc.Sprite(res.beiq)
        var biaoqian = new cc.Sprite(flagname)
        item.tempwendu = this.getRandNum()
        cc.log("curWendu:",item.tempwendu)

        item.levelValue1 = -50
        item.levelValue2 = -40
        item.levelValue3 = -60
        item.Time = 3

        level.setPosition(143,85)//158
        level.setScale(1.4,1.4)
        item.level = level

        beiq.setPosition(123.42,121.94)
        biaoqian.setPosition(113,120)

        beiq.setGlobalZOrder(0)

        item.hot = null
        //创建热气
        if(item.tempwendu > 30){
            item.hot = getZq({
            father:item,
            pos:cc.p(150,250),
            scale:1.5
            })
        }
        
        item.addChild(level,1)
        item.addChild(beiq,3)
        item.addChild(biaoqian,4)
        item.setScale(scale)
        return item
    },
    wendujiSechedule:function(someself){
        var self = this
        for(var k=0 ;k<2;k++){
           var beisp = self.getCurShaobei(k)//this.toolbtn.getindex(k)
           if(beisp){
                var wenduji = someself.getXiaowenduji()
                var pp = wenduji.getParent().convertToWorldSpace(wenduji.getPosition())
    
                //在杯子外面
                if (someself.outbeizi) {
                    var posx = beisp.x - 60
                    var posy = beisp.y + 80
                    if (pp.x >=beisp.x - 60 && pp.x <= beisp.x + 80 &&
                        pp.y >= beisp.y + 70 && pp.y <= beisp.y + 95) {
                        someself.outbeizi = false
                        someself.inbei = beisp
                        wenduji.getParent().setLocalZOrder(2)
                        return
                    }
                   if(someself.inbei){
                    var curtrate = Math.pow(0.85,someself.inbei.curtime-someself.curT)
                    var Tn = curtrate*someself.T0 + (1-curtrate)/1.5
                    // if(Tn<=20)
                    Tn = 20
                    if(someself.inbei.haveWdj)
                        someself.inbei.haveWdj = false
                    if (someself.temperature != Tn)
                        someself.setTemperature(Tn,3)

                   }
                }else{
                    //杯子里面
                    var convernodepos = wenduji.getParent().convertToNodeSpace(someself.inbei.getPosition());
                    
                    if (pp.y >= someself.inbei.y + 95) {//80
                        someself.outbeizi = true
                        someself.T0 = someself.temperature
                        someself.curT = someself.inbei.curtime
                        someself.inbei.Time = 3
                        return;
                    }
                    if(!someself.inbei.haveWdj)
                        someself.inbei.haveWdj = true
                    //判断是在杯壁还是在杯子中间
                    if(pp.y <=someself.inbei.y + someself.inbei.levelValue1){ // - 50 ， 10
                        if(pp.x >= someself.inbei.x - 48 && pp.x <= someself.inbei.x + 78
                         && pp.y >= someself.inbei.y - 88){
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
                    if (pp.y <= someself.inbei.y - 90){
                        wenduji.y = convernodepos.y - 90;
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
                if(wenduji.y <= convernodepos.y - 89){
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
            if (wenduji.y <= convernodepos.y - 89 && 
                wenduji.x >= convernodepos.x - 50 
                && wenduji.x <= convernodepos.x + 80) {
                this.showFacetip({
                    img:res.dialog2,
                    mscale:1
                })
            }
            //液面
            if (wenduji.y <= convernodepos.y + someself.inbei.levelValue2 &&   //200ML的时候是 -40，-60 400ML的时候是20,0
                wenduji.y >= convernodepos.y + someself.inbei.levelValue3) {
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
            end: 17,
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
            {key:"do_tip1",img:res.do_tip1,sound:res.do_sound1}
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