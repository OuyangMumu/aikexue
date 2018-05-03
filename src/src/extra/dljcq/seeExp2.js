var seeExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2",
    preLayer: "seeLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super()
        var self = this
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this

        var title_tip = new cc.Sprite(res.title_tip)
        title_tip.setPosition(getMiddle(0,200))
        self.addChild(title_tip)

        self.curLayer = null
        var btn1 = new ccui.Button(res.btn1_nor,res.btn1_sel,res.btn1_sel)
        btn1.setPosition(90,380)
        this.addChild(btn1)
        var setBtnVis = function(btn,judg){
            btn.setEnabled(judg)
            btn.setBright(judg)
        }
        var btn2 = new ccui.Button(res.btn2_nor,res.btn2_sel,res.btn2_sel)
        btn2.setPosition(90,290)
        this.addChild(btn2)

        var btn3 = new ccui.Button(res.btn3_nor,res.btn3_sel,res.btn3_sel)
        btn3.setPosition(90,200)
        this.addChild(btn3)

        var seeBtnBack = function(judge,key){
                                if(judge){
                                    self.speakeBykey(key)
                                }else{
                                    self.nodebs.stopSay()
                                }
                            }

        btn1.addClickEventListener(function(){
            self.nodebs.stopSay()
            self.speakeBykey("wenzi1")
            setBtnVis(btn1,false)
            setBtnVis(btn2,true)
            setBtnVis(btn3,true)
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
            self.curLayer = new myExp1()
            self.addChild(self.curLayer,10)
            self.curLayer.setSeeBtnBack(seeBtnBack)
        })

        btn2.addClickEventListener(function(){
            self.nodebs.stopSay()
            self.speakeBykey("wenzi2")
            setBtnVis(btn2,false)
            setBtnVis(btn1,true)
            setBtnVis(btn3,true)
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
            self.curLayer = new myExp2()
            self.addChild(self.curLayer,10)
            self.curLayer.setSeeBtnBack(seeBtnBack)
        })

        btn3.addClickEventListener(function(){
            self.nodebs.stopSay()
            self.speakeBykey("wenzi1")
            setBtnVis(btn3,false)
            setBtnVis(btn1,true)
            setBtnVis(btn2,true)
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
            self.curLayer = new myExp3()
            self.addChild(self.curLayer,10)
            self.curLayer.setSeeBtnBack(seeBtnBack)
        })

        self.curLayer = new myExp1()
        self.addChild(self.curLayer)
        setBtnVis(btn1,false)
        self.curLayer.setSeeBtnBack(seeBtnBack)
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
               self.speakeBykey("wenzi1") 
            })
        }
    },
    speakeBykey:function(key){
        this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi1",
            img:res.wenzi1,
            sound: res.zimp1
        })
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            img:res.wenzi2,
            sound: res.zimp2
        })
        addContent({
            people: this.nodebs,
            key: "jl2",
            sound: res.jlmp2
        })
        addContent({
            people: this.nodebs,
            key: "jl3",
            sound: res.jlmp3
        })
        addContent({
            people: this.nodebs,
            key: "jl4",
            sound: res.jlmp4
        })    
    }  
})

var myExp1 = cc.Layer.extend({
    ctor: function() {
        this._super()
        var self = this

        var road = new cc.Sprite(res.road2)
        road.setPosition(getMiddle(-50,-70))
        self.addChild(road)

        var Elec = createElectricityDirection({
                            pos:cc.p(518,104),
                            img:res.redDir,
                            fireTime:0.45,
                            num:5,
                            scale:0.8,
                            buf:[
                                    {pos:cc.p(718,100),roto:-90,time:0.3,prepos:cc.p(-40,0)},
                                    {pos:cc.p(718,199),roto:-126,time:0.2,prepos:cc.p(0,-40)},
                                    {pos:cc.p(688,239),roto:-147,time:0.1,prepos:cc.p(20,-20)},
                                    {pos:cc.p(470,380),roto:-180,time:0.3,prepos:cc.p(20,-35)},
                                    {pos:cc.p(311,372),roto:-270,time:0.2,prepos:cc.p(40,0)},
                                    {pos:cc.p(311,104),roto:-360,time:0.6,prepos:cc.p(0,40)},
                                    {pos:cc.p(518,104),roto:0,time:0.3,prepos:cc.p(0,0)}
                               ]
                        })
        self.addChild(Elec)
        Elec.playAll(1)

        var showLight = new ccui.Button(res.showLight_nor,res.showLight_sel)
        showLight.setPosition(1010,450)
        self.addChild(showLight)
        showLight.nor = res.showLight_nor
        showLight.sel = res.showLight_sel
        showLight.addClickEventListener(function(sender){
            var nor = sender.nor
            var sel = sender.sel
            if(!sender.ok){
             sender.ok = true
             nor = sender.sel
             sel = sender.nor
             Elec.stopAll()
            }else{
             sender.ok = false
             Elec.playAll()
            }
            sender.loadTextureNormal(nor)
            sender.loadTexturePressed(sel)
        })

        var seeBtn = new ccui.Button(res.btn_get_normal,res.btn_get_select)
        seeBtn.setPosition(1010,370)
        self.addChild(seeBtn)

        seeBtn.addClickEventListener(function(){
            if(!self.jl2){
                self.jl2 = createShowImg({
                                img:res.jl2,
                                bgInfo:{
                                    sizeScale:cc.p(1.4,1.5)
                                },
                                inFun:function(node){
                                    if(self.seeBtnBack){
                                        self.seeBtnBack(node.status,"jl2")
                                    }
                                },
                                outFun:function(node){
                                    if(self.seeBtnBack){
                                        self.seeBtnBack(node.status)
                                    }
                                }
                            })
                self.addChild(self.jl2)
            }
            self.jl2.show()
        })
        return true
    },
    setSeeBtnBack:function(fun){
        this.seeBtnBack = fun
    }
})
var myExp2 = cc.Layer.extend({
    ctor: function() {
        this._super()
        var self = this
        var dz = new cc.Sprite(res.dz)
        dz.setPosition(522,364)
        self.addChild(dz)
        dz.setVisible(false)

        var dp = new cc.Sprite(res.dp)
        dp.setPosition(526,419)
        self.addChild(dp)
        dp.setVisible(false)

        var dy = new cc.Sprite(res.dy)
        dy.setPosition(515,112)
        self.addChild(dy)
        dy.setVisible(false)

        var dx = new cc.Sprite(res.dx)
        dx.setPosition(372,234)
        self.addChild(dx)
        dx.setVisible(false)

        var dx1 = new cc.Sprite(res.dx)
        dx1.setPosition(670,228)
        dx1.setScale(-0.81,1)
        self.addChild(dx1)
        dx1.setVisible(false)

        var tipList = []
        for (var i = 0; i < 4; i++) {
            tipList[i] = new cc.Sprite(res[sprintf("dxtip%d",i+1)])
            tipList[i].setPosition(518,242)
            tipList[i].setVisible(false)
            self.addChild(tipList[i])
        }
        var dxtip5 = new cc.Sprite(res.dxtip5)
        dxtip5.setPosition(518,242)
        self.addChild(dxtip5)
        
        var dataInfo = [
            {
                tousp:[
                   {sp:dp}
                ],
                visi:[dp,tipList[1]]
            },
            {
                tousp:[
                   {sp:dz}
                ],
                visi:[dz,tipList[2]]
            },
            {
                tousp:[
                   {sp:dy}
                ],
                visi:[dy,tipList[3]]
            },
            {
                tousp:[
                   {sp:dx}
                ],
                visi:[dx,tipList[0]]
            },
            {
                tousp:[
                   {sp:dx1}
                ],
                visi:[dx1,tipList[0]]
            }
        ]

        var touchs = true
        for(var k=0;k<dataInfo.length;k++){
            var tousp = dataInfo[k].tousp
            for(var n in tousp){
                tousp[n].sp.num = k
                createTouchEvent({
                    swallow:true,
                    item:tousp[n].sp,
                    begin:function(data){
                        if(touchs){
                            touchs = false
                            if(!judgeOpInPos(data)){
                                touchs = true
                                return false
                            }
                            //其他看不见
                            for(var k=0;k<dataInfo.length;k++)
                                if(k != data.item.num){
                                    var visiall = dataInfo[k].visi
                                    for(var d in visiall)
                                        visiall[d].setVisible(false)
                                }
                            if(dxtip5.isVisible()){
                                dxtip5.setVisible(false)
                            }
                            //被点击的看的见
                            var visi = dataInfo[data.item.num].visi
                            for(var m in visi)
                               visi[m].setVisible(true)
                        }
                        return true
                    },
                    end:function(){
                        touchs = true
                    } 
                })
            }
        }

        var road = new cc.Sprite(res.road1)
        road.setPosition(getMiddle(-50,-70))
        self.addChild(road)

        var showLight = new ccui.Button(res.showLight_nor,res.showLight_sel)
        showLight.setPosition(1010,450)
        self.addChild(showLight)
        showLight.nor = res.showLight_nor
        showLight.sel = res.showLight_sel
        showLight.addClickEventListener(function(sender){
            var nor = sender.nor
            var sel = sender.sel
            if(!sender.ok){
             sender.ok = true
             nor = sender.sel
             sel = sender.nor
             Elec.stopAll()
            }else{
             sender.ok = false
             Elec.playAll()
            }
            sender.loadTextureNormal(nor)
            sender.loadTexturePressed(sel)
        })

        var seeBtn = new ccui.Button(res.btn_get_normal,res.btn_get_select)
        seeBtn.setPosition(1010,370)
        self.addChild(seeBtn)
        seeBtn.addClickEventListener(function(){
            if(!self.jl3){
                self.jl3 = createShowImg({
                                img:res.jl3,
                                bgInfo:{
                                    sizeScale:cc.p(1.25,1.5)
                                },
                                inFun:function(node){
                                    if(self.seeBtnBack){
                                        self.seeBtnBack(node.status,"jl3")
                                    }
                                },
                                outFun:function(node){
                                    if(self.seeBtnBack){
                                        self.seeBtnBack(node.status)
                                    }
                                }
                            })
                self.addChild(self.jl3)
            }
            self.jl3.show()
        })
        return true
    },
    setSeeBtnBack:function(fun){
       this.seeBtnBack = fun
    }
})
var myExp3 = cc.Layer.extend({
    ctor: function() {
        this._super()
        var self = this
        var road = new cc.Sprite(res.road1)
        road.setPosition(getMiddle(-50,-70))
        self.addChild(road)

        var Elec = createElectricityDirection({
                            pos:cc.p(518,95),
                            img:res.redDir,
                            fireTime:6,
                            scale:0.6,
                            num:2,
                            buf:[
                                    {pos:cc.p(718,95),roto:-90,time:2,prepos:cc.p(-40,0)},
                                    {pos:cc.p(718,366),roto:-180,time:4,prepos:cc.p(0,-40)},
                                    {pos:cc.p(313,366),roto:-270,time:4,prepos:cc.p(40,0)},
                                    {pos:cc.p(313,95),roto:-360,time:4,prepos:cc.p(0,40)},
                                    {pos:cc.p(518,95),roto:0,time:2,prepos:cc.p(0,0)}
                               ]
                        })
        self.addChild(Elec)
        Elec.playAll(0.2)

        var showLight = new ccui.Button(res.showLight_nor,res.showLight_sel)
        showLight.setPosition(1010,450)
        self.addChild(showLight)
        showLight.nor = res.showLight_nor
        showLight.sel = res.showLight_sel
        showLight.addClickEventListener(function(sender){
            var nor = sender.nor
            var sel = sender.sel
            if(!sender.ok){
             sender.ok = true
             nor = sender.sel
             sel = sender.nor
             Elec.stopAll()
            }else{
             sender.ok = false
             Elec.playAll()
            }
            sender.loadTextureNormal(nor)
            sender.loadTexturePressed(sel)
        })

        var seeBtn = new ccui.Button(res.btn_get_normal,res.btn_get_select)
        seeBtn.setPosition(1010,370)
        self.addChild(seeBtn)
        seeBtn.addClickEventListener(function(){
            if(!self.jl4){
                self.jl4 = createShowImg({
                                img:res.jl4,
                                bgInfo:{
                                    sizeScale:cc.p(1.2,1.2),
                                    posOff:cc.p(-10,0)
                                },
                                inFun:function(node){
                                    if(self.seeBtnBack){
                                        self.seeBtnBack(node.status,"jl4")
                                    }
                                },
                                outFun:function(node){
                                    if(self.seeBtnBack){
                                        self.seeBtnBack(node.status)
                                    }
                                }
                            })
                self.addChild(self.jl4)
            }
            self.jl4.show()
        })
        return true
    },
    setSeeBtnBack:function(fun){
       this.seeBtnBack = fun
    } 
})