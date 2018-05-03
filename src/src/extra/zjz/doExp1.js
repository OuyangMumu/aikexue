var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this._super()
        var self = this
        this.expCtor()
        this.initUI()
        return true
    },
    initUI:function(){
        var self = this
        self.curLayer = null
        var m_cha_btn = new ccui.Button(res.expbtn1_nor,res.expbtn1_sel,res.expbtn1_sel)
        m_cha_btn.setPosition(100,400)
        this.addChild(m_cha_btn)
        var setBtnVis = function(btn,judg){
            btn.setEnabled(judg)
            btn.setBright(judg)
            if(self.setting){
                self.setting.removeFromParent()
                self.setting = null
            }
            if(self.curLayer){
                self.curLayer.nodebs.stopSay()
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
        }
        var m_shao_btn = new ccui.Button(res.expbtn2_nor,res.expbtn2_sel,res.expbtn2_sel)
        m_shao_btn.setPosition(100,270)
        this.addChild(m_shao_btn)

        m_cha_btn.addClickEventListener(function(){
            setBtnVis(m_cha_btn,false)
            setBtnVis(m_shao_btn,true)
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
            self.curLayer = new myExp1()
            self.addChild(self.curLayer,10)
        })

        m_shao_btn.addClickEventListener(function(){
            setBtnVis(m_cha_btn,true)
            setBtnVis(m_shao_btn,false)
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
            self.curLayer = new myExp2()
            self.addChild(self.curLayer,10)
        })
        setBtnVis(m_cha_btn,false)
        self.curLayer = new myExp1()
        self.addChild(self.curLayer)  
    },
    preExit:function(){
        var toFadeOut = function(node){
            if(node){
                for(var i in node.getChildren()){
                    var cur = node.getChildren()[i]
                    cur.runAction(cc.fadeOut(0.2))
                    toFadeOut(cur)
                }
            }
        }
        if(this.curLayer){
            toFadeOut(this.curLayer)  
        }
    }
})

var myExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "myExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        })
        this._super()
        var self = this
        this.initUI()
        this.initSet()
        this.initPeople()
        this.expMyEnter()
        return true
    },
    initSet:function(){
        var self = this
        var setting = createSetting({
            pos: cc.p(1080, 580)
        })
        self.addChild(setting)
    },
    initUI:function(){
        var self = this

        var lanren1 = new cc.Sprite(res.lanren1)
        lanren1.setPosition(getMiddle(0,0))
        self.addChild(lanren1,1)

        var djz = new cc.Sprite(res.djz)
        djz.setPosition(getMiddle())
        djz.setScale(1.3)
        self.addChild(djz,2)

        var lanren = new cc.Sprite(res.lanren)
        lanren.setPosition(getMiddle(0,-90))
        self.addChild(lanren,3)

        createTouchEvent({
            item:lanren,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var tempy = item.y + delta.y
                var tempx = item.x + delta.x
                if(tempy>=230){
                    tempy = 230
                }else if(tempy<=190){
                    tempy = 190
                }
                if(tempx>=598){
                    tempx = 598
                }else if(tempx<=538){
                    tempx = 538
                }
                lanren1.y = lanren1.y-(tempy-item.y)
                lanren1.x = lanren1.x+(tempx-item.x)
                item.y = tempy
                item.x = tempx
            },
            end:function(data){}
        })

        self.initBtn()
    },
    initBtn:function(){
        var self = this
        var listbtn = []
        for (var i = 0; i < 3; i++) {
            var nor = res[sprintf("jl%d_nor",i+1)]
            var sel = res[sprintf("jl%d_sel",i+1)]
            listbtn[i] = new ccui.Button(nor,sel,sel)
            listbtn[i].setPosition(1000,510-80*i)
            listbtn[i].index = i+1
            self.addChild(listbtn[i])
            listbtn[i].setVisible(false)
            listbtn[i].soundKey = "jl"+(i+1)
            listbtn[i].addClickEventListener(function(sender){
                if(!sender.showimg){
                    sender.showimg = createShowImg({
                                        img:res[sprintf("jl%d",sender.index)],
                                        bgInfo:{
                                            sizeScale:cc.p(1.12,1.12)
                                        },
                                        inFun:function(){
                                            self.nodebs.say({
                                                key:sender.soundKey
                                            }) 
                                        },
                                        outFun:function(){
                                            self.nodebs.stopSay()
                                        }
                                    })
                    self.addChild(sender.showimg)
                }
                sender.showimg.show()
            })
        }
        listbtn[0].setVisible(true)
        self.listbtn = listbtn
    },
    speakeBykey:function(key,fun){
       this.nodebs.say({
                    key: key,
                    force: true,
                    fun:function(){
                        if(fun)fun()
                    }
                })
    },
    expMyEnter: function() {
        if (this.nodebs) {
            var self = this
            var wenzi = new cc.Node()
            self.addChild(wenzi)
            self.nodebs.show(function() {
               self.speakeBykey("wenzi1")
               wenzi.runAction(cc.sequence(
                    cc.delayTime(6),
                    cc.callFunc(function(){
                        self.listbtn[1].setVisible(true)
                        self.speakeBykey("wenzi2")
                    }),
                    cc.delayTime(15),
                    cc.callFunc(function(){
                        self.listbtn[2].setVisible(true)
                        self.speakeBykey("wenzi3")
                    })
                ))
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
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
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })

        for (var i = 0; i < 3; i++) {
            addContent({
                people: this.nodebs,
                key:"jl"+(i+1),
                sound: res["jlmp"+(i+1)]
            })
        }
    }  
})

var myExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "myExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            //loadPlist("huo")
        })
        this._super()
        var self = this
        this.initUI()
        this.initSet()
        this.initPeople()
        this.expMyEnter()
        return true
    },
    initSet:function(){
        var self = this
        var setting = createSetting({
            pos: cc.p(1080, 580),
            biaogeFun:function(){
                if (!self.bggg){
                    var bgg = createBiaoge({
                      json: res.biao1,
                      scale: 0.8,
                      inputNum:10
                    })
                    self.addChild(bgg)
                    self.bggg = bgg
                }
                var bgg = self.bggg
                bgg.show()
            }
        })
        self.addChild(setting)
    },
    initUI:function(){
        var self = this

        var lab = new cc.LabelTTF("平面镜夹角: 45°","",30)
        lab.setPosition(getMiddle(-30,220))
        self.addChild(lab)

        var jz1 = new cc.Sprite(res.jz1)
        jz1.setPosition(getMiddle(0,-50))
        self.addChild(jz1)

        var select = self.createSelect({
                        endfun:function(index){
                            lab.setString(sprintf("平面镜夹角: %d°",33.75*index+45))
                            jz1.setTexture(res[sprintf("jz%d",index+1)])
                        }
                    })
        select.setPosition(getMiddle(0,170))
        self.addChild(select)
    },
    createSelect:function(data){
        var endfun = data.endfun
        var node = new cc.Node()
        var selectBg = new cc.Sprite(res.bg_select)
        selectBg.setScale(2,1)
        node.addChild(selectBg)

        var select_sel = new cc.Sprite(res.select_sel)
        select_sel.setPosition(-135,0)
        node.addChild(select_sel,10)

        var touch = true
        for (var i = 0; i < 5; i++) {
            var select_nor = new cc.Sprite(res.select_nor)
            select_nor.setPosition(-135 + 70*i,0)
            node.addChild(select_nor,1)
            select_nor.index = i
            createTouchEvent({
                item:select_nor,
                rect:cc.rect(-5,-5,select_nor.width+10,select_nor.height+10),
                begin:function(data){
                    if(touch){
                        touch = false
                        var item = data.item
                        item.setScale(1.1)
                        return true
                    }
                },
                end:function(data){
                    var item = data.item
                    item.setScale(1)
                    select_sel.setPosition(item.getPosition())
                    touch = true
                    if(endfun){
                        endfun(item.index)
                    }
                }
            })
        }

        return node
    }, 
    speakeBykey:function(key,status){
        var self = this
        if(!status){
            if(!self[key]){
                self[key] = true
                this.nodebs.say({
                    key: key,
                    force: true
                })  
            } 
        }else{
            dialogControl.AddDialog("Tips", {
                        res: res[key],
                        face: 1,
                        confirmBtn: true,
                        father: self
                  })
        }     
    },
    expMyEnter: function() {
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.speakeBykey("wenzi5")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi5",
            img:res.wenzi5,
            sound: res.zimp5
        })
    }  
})