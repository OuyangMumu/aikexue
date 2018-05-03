//@author mu @16/5/11
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
        var m_cha_btn = new ccui.Button(res.m_cha_nor,res.m_cha_sel,res.m_cha_sel)
        m_cha_btn.setPosition(1050,450)
        this.addChild(m_cha_btn)
        var setBtnVis = function(btn,judg){
            btn.setEnabled(judg)
            btn.setBright(judg)
            if(self.setting){
                self.setting.removeFromParent()
                self.setting = null
            } 
            if(self.curLayer){
                self.curLayer.removeFromParent()
                self.curLayer = null
            }
        }
        var m_shao_btn = new ccui.Button(res.m_shao_nor,res.m_shao_sel,res.m_shao_sel)
        m_shao_btn.setPosition(1050,320)
        this.addChild(m_shao_btn)

        m_cha_btn.addClickEventListener(function(){
            setBtnVis(m_cha_btn,false)
            setBtnVis(m_shao_btn,true)
            self.curLayer = new myExp1()
            self.addChild(self.curLayer,10)
        })

        m_shao_btn.addClickEventListener(function(){
            setBtnVis(m_cha_btn,true)
            setBtnVis(m_shao_btn,false)
            self.curLayer = new myExp2()
            self.addChild(self.curLayer,10)
        })
        setBtnVis(m_cha_btn,false)
        self.curLayer = new myExp1()
        self.addChild(self.curLayer)
    }
})

var myExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "myExp1",
    preLayer: "seeLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("Lath")
            loadPlist("Lth")
        })
        this._super()
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
        var uiName = ["thNode","bz3","bz4","bz6"]
        var node = loadNode(res.doJson1,uiName)
        node.setPosition(-50,0)
        self.addChild(node)

        node.bz1 = node.thNode.getChildByName("bz1")
        node.bz2 = node.thNode.getChildByName("bz2")
        node.bz5 = node.thNode.getChildByName("bz5")
        node.bz3.child = node.bz3.getChildByName("bz3_1")
        node.bz4.child = node.bz4.getChildByName("bz4_1")
        node.bz6.child = node.bz6.getChildByName("bz6_1")
        node.thNode.initSelf = function(){
            this.setVisible(false)
            node.bz1.setVisible(false)
            node.bz2.setVisible(false)
            node.bz5.setVisible(false)
        }
        node.bz3.initSelf = function(){
            this.setVisible(false)
            node.bz3.child.stopAllActions()
            node.bz3.child.setSpriteFrame("lath00.png")
        }
        node.bz4.initSelf = function(){
            this.setVisible(false)
            node.bz4.stopAllActions()
            node.bz4.child.setVisible(false)
            node.bz4.setSpriteFrame("lth00.png")
        }
        node.bz6.initSelf = function(){
            this.setVisible(false)
            node.bz6.child.setVisible(false)
        }
        var btns = []
        var funs = [
            function(){
                for (var i = 0; i < uiName.length; i++) {
                    node[uiName[i]].initSelf()
                }
                node.thNode.setVisible(true)
                node.bz1.setVisible(true)
                node.bz1.runAction(cc.blink(0.5,3))
            },
            function(){
                for (var i = 0; i < uiName.length; i++) {
                    node[uiName[i]].initSelf()
                }
                node.thNode.setVisible(true)
                node.bz2.setVisible(true)
                node.bz2.runAction(cc.blink(0.5,3))
            },
            function(){
                for (var i = 0; i < uiName.length; i++) {
                    node[uiName[i]].initSelf()
                }
                node.bz3.setVisible(true)
                var seq = cc.sequence(
                        cc.delayTime(0.2),
                        createAnimation({
                                  frame:"lath%02d.png",
                                  start:0,
                                  end: 11,
                                  time: 0.04,
                              }),
                        cc.delayTime(0.4),
                        createAnimation({
                              rever:true,
                              frame:"lath%02d.png",
                              start:0,
                              end: 11,
                              time: 0.05,
                          }),
                        cc.delayTime(0.2),
                        createAnimation({
                                  frame:"lath%02d.png",
                                  start:0,
                                  end: 11,
                                  time: 0.04,
                              }),
                        cc.delayTime(0.4),
                        createAnimation({
                              rever:true,
                              frame:"lath%02d.png",
                              start:0,
                              end: 11,
                              time: 0.05,
                          })
                    )
                node.bz3.child.stopAllActions()
                node.bz3.child.runAction(seq)
            },
            function(){
                for (var i = 0; i < uiName.length; i++) {
                    node[uiName[i]].initSelf()
                }
                node.bz4.setVisible(true)
                node.bz4.runAction(cc.sequence(
                    createAnimation({
                                  frame:"lth%02d.png",
                                  start:0,
                                  end: 10,
                                  time: 0.05,
                              }),
                    cc.callFunc(function(){
                        node.bz4.child.setVisible(true)
                        node.bz4.child.runAction(cc.blink(0.5,3))
                    })
                ))
            },
            function(){
                for (var i = 0; i < uiName.length; i++) {
                    node[uiName[i]].initSelf()
                }
                node.thNode.setVisible(true)
                node.bz5.setVisible(true)
                node.bz5.runAction(cc.blink(0.5,3))
            },
            function(){
                for (var i = 0; i < uiName.length; i++) {
                    node[uiName[i]].initSelf()
                }
                node.bz6.setVisible(true)
                node.bz6.child.setVisible(true)
                node.bz6.child.runAction(cc.blink(0.5,3))
            }
        ]
        var recoverBtn = function(){
            for (var i = 0; i < btns.length; i++) {
                btns[i].setBright(true)
                btns[i].setEnabled(true)
                btns[i].word.setVisible(false)
            }
        }
        for (var i = 0; i < 6; i++) {
            var nor = res[sprintf("bzbtn_nor%d",i+1)]
            var sel = res[sprintf("bzbtn_sel%d",i+1)]
            btns[i] = new ccui.Button(nor,sel,sel)
            btns[i].setPosition(200,450 - i*55)
            self.addChild(btns[i])

            btns[i].fun = funs[i]

            btns[i].word = new cc.Sprite(res[sprintf("btnword%d",i+1)])
            btns[i].word.setPosition(568,30)
            btns[i].word.setVisible(false)
            self.addChild(btns[i].word)

            btns[i].music = sprintf("musickey%d",i+1)

            btns[i].addClickEventListener(function(sender){
                recoverBtn()
                self.speakeBykey(sender.music)
                sender.word.setVisible(true)
                sender.setBright(false)
                sender.setEnabled(false)
                if(sender.fun){
                    sender.fun()
                }
            })
        }
        var jl = new ccui.Button(res.bzbtn_nor7,res.bzbtn_sel7,res.bzbtn_sel7)
        jl.setPosition(200,120)
        self.addChild(jl)
        jl.addClickEventListener(function(){
            self.nodebs.say({
                    key: "jl"
                })
        })
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    expMyEnter: function() {
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        for (var i = 0; i < 6; i++) {
            addContent({
                people: this.nodebs,
                key: sprintf("musickey%d",i+1),
                sound: res[sprintf("bzmp%d",i+1)]
            })
        }

        addContent({
           people: this.nodebs,
           key: "jl",
           img:res.jl,
           id:"result",
           sound: res.jlmp,
           offset: cc.p(17,15),
           offbg: cc.p(0,10),
        })
    }  
})

//创建弹簧
var createSpring = function(data){
    var data = data || {}
    var num = data.num || 10
    var scale = data.scale || 0.5
    var behandimg1 = data.behandimg1
    var behandimg2 = data.behandimg2
    var thTouch_endFun = data.endFun
    var thTouch_beginFun = data.beginFun
    var thTouch_moveFun = data.moveFun
    var xishu = data.xishu
    var behPos = data.behPos || cc.p(0,0)
    var prePos = data.prePos || cc.p(0,0)
    var startPos = data.startPos || cc.p(0,0)
    var segDis = data.segDis || -20
    var showstart = data.showstart
    if(showstart==null){
        showstart = true
    }

    var preforimg1 = data.preforimg1 
    var preforimg2 = data.preforimg2 

    var spring = new cc.Node()
    spring.xishu = xishu
    spring.prefor = []
    spring.behand = []

    var GG = new cc.Sprite(res.tangou1)
    GG.setPosition(-40,31)
    spring.addChild(GG,1)
    GG.initPos = GG.getPosition()
    spring.GG = GG

    var hideGou = new cc.Sprite(res.guaGou3)
    hideGou.setPosition(4.1,67.16)
    GG.addChild(hideGou)
    hideGou.setVisible(false)
    spring.hideGou = hideGou

    var startBeh = new cc.Sprite(behandimg1)
    startBeh.setPosition(-48+startPos.x,1+startPos.y)
    startBeh.setAnchorPoint(0,0.75)
    spring.addChild(startBeh,3)
    startBeh.setVisible(showstart)

    for (var i = 0; i < num; i++) {
        var beh = new cc.Sprite(behandimg2)
        beh.setAnchorPoint(0,1)
        beh.initPos = cc.p(behPos.x-95,segDis * i - 4  + behPos.y)
        beh.setPosition(beh.initPos)
        spring.addChild(beh,3)
        beh.setScale(0.95,0.8)
        spring.behand[i] = beh

        var pre = new cc.Sprite(preforimg2)
        pre.setAnchorPoint(1,1)
        pre.initPos = cc.p(prePos.x+0,segDis * i + prePos.y)
        pre.setPosition(pre.initPos)
        pre.setScale(1,0.8)
        spring.addChild(pre,5)
        spring.prefor[i] = pre
    }

    var endPre = new cc.Sprite(preforimg1)
    endPre.setAnchorPoint(1,1)
    endPre.initPos = cc.p(0,segDis * num)
    endPre.setPosition(endPre.initPos)
    spring.addChild(endPre,5)

    var downGou = new cc.Sprite(res.tangou2)
    downGou.setAnchorPoint(0.8,1)
    downGou.initPos = cc.p(-50,endPre.y-6)
    downGou.setPosition(downGou.initPos)
    spring.addChild(downGou,2)

    var gua = new cc.Sprite(res.tangou3)
    gua.setPosition(113,30)
    downGou.addChild(gua)
    gua.setScale(0.77)
    gua.initPos = gua.getPosition()
    gua.setVisible(false)
    spring.gua = gua

    var guaFather = new cc.Node()
    guaFather.setPosition(115,0)
    downGou.addChild(guaFather)
    guaFather.setScale(2.5)
    spring.guaFather = guaFather
    guaFather.childCount = 0
    guaFather.endSp = null

    var famaGouHide = new cc.Sprite(res.guaGou3)
    famaGouHide.setPosition(101.2,12.06)
    downGou.addChild(famaGouHide)
    famaGouHide.setScale(0.6458)
    //力和系数
    spring.FntoChange = function(Fn,cv){
        var cv = cv || 20
        var angle = Fn / cv

        startBeh.setRotation(angle)
        for (var i = 0; i < spring.prefor.length; i++) {
            spring.prefor[i].setRotation(-angle) 
            spring.behand[i].setRotation(angle)
            if(i>=1){
                spring.prefor[i].y = spring.prefor[i-1].y + segDis - angle/5*14
                spring.behand[i].y = spring.behand[i-1].y + segDis - angle/5*14
                spring.behand[i].x = spring.behand[i-1].x
            }else{
                spring.prefor[i].y = spring.prefor[i].initPos.y - angle
                spring.behand[i].y = -4 - angle*1.4 - angle
                spring.behand[i].x = spring.behand[i].initPos.x + angle//+ Math.pow(2,angle/5)
            }
        }
        endPre.setRotation(-angle)
        endPre.y = spring.prefor[spring.prefor.length-1].y + segDis - angle/5*14
    }
    spring.FntoChange1 = function(Fn,cv){
        var cv = cv || 20
        var angle = Fn / cv

        startBeh.setRotation(angle)
        for (var i = 0; i < spring.prefor.length; i++) {
            spring.prefor[i].setRotation(-angle) 
            spring.behand[i].setRotation(angle)
            if(i>=1){
                spring.prefor[i].y = spring.prefor[i-1].y + segDis - angle/8*12
                spring.behand[i].y = spring.behand[i-1].y + segDis - angle/8*12
                spring.behand[i].x = spring.behand[i-1].x
            }else{
                spring.prefor[i].y = spring.prefor[i].initPos.y - angle
                spring.behand[i].y = -4 - angle*1.7
                spring.behand[i].x = spring.behand[i].initPos.x +angle/3.5//angle//+ Math.pow(2,angle/5)
            }
        }
        endPre.setRotation(-angle)
        endPre.y = spring.prefor[spring.prefor.length-1].y + segDis - angle/8*12
    }
    spring.setScale(scale)
    return spring
}

//创建圆形弹簧测力计
var createYTTH = function(data){
    var data = data || {}
    var layer = data.layer
    var moveFun = data.moveFun
    var pos = data.pos || getMiddle()
    var YT_TH = new cc.Sprite("#th_bg.png")
    YT_TH.setPosition(pos)
    if(layer)
        layer.addChild(YT_TH)
    YT_TH.xishu = 28
    YT_TH.overFn = 280
    if(moveFun)
        YT_TH.moveFun = moveFun

    var th1 = new cc.Sprite("#yt_th2.png")
    th1.setPosition(33,200)
    YT_TH.addChild(th1)

    var gouHide = new cc.Sprite("#yt_th3.png")
    gouHide.setPosition(32,25.5)
    th1.addChild(gouHide)
    gouHide.setLocalZOrder(10)
    YT_TH.gouHide = gouHide

    var th2 = new cc.Node()
    th2.initY = 0
    YT_TH.addChild(th2)

    var th1 = new cc.Sprite("#yt_th2.png")
    th1.setPosition(33,200)
    YT_TH.addChild(th1)

    var gouHide = new cc.Sprite("#yt_th3.png")
    gouHide.setPosition(32,25.5)
    th1.addChild(gouHide)
    gouHide.setLocalZOrder(10)
    YT_TH.gouHide = gouHide

    var itemNode = new cc.Node()
    itemNode.setPosition(30,14)
    th1.addChild(itemNode,1)
    YT_TH.itemNode = itemNode

    var yt_th1 = new cc.Sprite("#yt_th1.png")
    yt_th1.setPosition(36,316)
    yt_th1.initY = 316
    YT_TH.addChild(yt_th1)

    var hand2 = new cc.Sprite("#hand2.png")
    hand2.setPosition(140,465)
    yt_th1.addChild(hand2)

    var hand1 = new cc.Sprite("#hand1.png")
    hand1.setPosition(108.5,562.2)
    th2.addChild(hand1)
    YT_TH.hand1 = hand1
    hand1.deltaAll = 0
    hand1.grandFather = YT_TH

    var yt_th = new cc.Sprite("#yt_th.png")
    yt_th.setPosition(37,453)
    th2.addChild(yt_th)

    var spring = createSpring({
                    behandimg1:res.tanbeh2,
                    behandimg2:res.tanbeh1,
                    preforimg1:res.tanpre2,
                    preforimg2:res.tanpre1
                 })
    spring.setScale(0.5,0.25)
    spring.setPosition(60,433)
    spring.startX = spring.x
    th2.addChild(spring)

    YT_TH.changeItem = function(dis){
        yt_th1.y = yt_th1.initY +  dis
        th2.y = th2.initY +  dis
        spring.x = spring.startX - dis/50
        spring.FntoChange(dis*3.5,30)
    }
    YT_TH.moveDis = function(pos){
        YT_TH.setPosition(pos)
    }
    YT_TH.removeItem = function(){
        if(YT_TH.haveItem){
            cc.log("removeItem")
            var pos = getWorldPos(YT_TH.haveItem)
            safeAdd(YT_TH.haveItem.prePar,YT_TH.haveItem)
            var npos = YT_TH.haveItem.prePar.convertToNodeSpace(pos)
            YT_TH.haveItem.setPosition(npos)
            YT_TH.haveItem.setScale(YT_TH.haveItem.curScale)
            YT_TH.hand1.isMove = true
            YT_TH.haveItem.IsMove = true
            YT_TH.setPosition(pos.x,pos.y+YT_TH.haveItem.height+50)
            if(YT_TH.haveItem&&YT_TH.haveItem.tonor){
                YT_TH.haveItem.setTexture(YT_TH.haveItem.tonor)
            }
            YT_TH.haveItem = null
        }
    }
    YT_TH.addItem = function(item){
        safeAdd(itemNode,item)
        YT_TH.haveItem = item
        item.newFather = itemNode
    }
    return YT_TH
}

//创建条形弹簧测力计
var createTXTH = function(data){
    var data = data || {}
    var layer = data.layer
    var moveFun = data.moveFun
    var pos = data.pos || getMiddle()
    var Tx_TH = new cc.Sprite("#th_bg.png")
    Tx_TH.setPosition(pos)
    if(layer)
        layer.addChild(Tx_TH)

    Tx_TH.xishu = 49.5
    Tx_TH.overFn = 240
    if(moveFun)
        Tx_TH.moveFun = moveFun
    var th1 = new cc.Sprite("#tx_th2.png")
    th1.setPosition(32,110)
    Tx_TH.addChild(th1)

    var gouHide = new cc.Sprite("#yt_th3.png")
    gouHide.setPosition(30.7,26.3)
    th1.addChild(gouHide)
    gouHide.setLocalZOrder(10)
    Tx_TH.gouHide = gouHide

    var itemNode = new cc.Node()
    itemNode.setPosition(31,14)
    th1.addChild(itemNode,1)
    Tx_TH.itemNode = itemNode

    var th2 = new cc.Sprite("#tx_th1.png")
    th2.setPosition(34,218)
    th2.initY = th2.getPositionY()
    Tx_TH.addChild(th2)

    var hand1 = new cc.Sprite("#hand1.png")
    hand1.setPosition(126,486)
    th2.addChild(hand1)
    Tx_TH.hand1 = hand1
    hand1.deltaAll = 0
    hand1.grandFather = Tx_TH

    var drawSp = createClip({
       toShowimg:res.ty,
       ShowimgPos:cc.p(56.55,172),
       toSencilimg:res.ty,
       sencilPos:cc.p(56.55,432),
       father:th2,
    })
    drawSp.setOpacity(0)
    drawSp.secil.initY = drawSp.secil.getPositionY()

    var spring = createSpring({
                    num:15,
                    behPos:cc.p(51,0),
                    segDis:-12,
                    startPos:cc.p(23,2),
                    behandimg1:res.tanbeh4,
                    behandimg2:res.tanbeh3,
                    preforimg1:res.tanpre4,
                    preforimg2:res.tanpre3
                 })
    spring.setScale(0.26,0.5)
    spring.setPosition(10,287.1)
    spring.startX = spring.x
    drawSp.addChild(spring)

    var yt_th3 = new cc.Sprite("#tx_th3.png")
    yt_th3.setPosition(56,289.8)
    yt_th3.initY = yt_th3.getPositionY()
    th2.addChild(yt_th3)

    var hand2 = new cc.Sprite("#hand2.png")
    hand2.setPosition(151,482)
    th2.addChild(hand2)

    Tx_TH.changeItem = function(dis){
        th2.y = th2.initY +  dis
        yt_th3.y = yt_th3.initY - dis
        drawSp.secil.y = drawSp.secil.initY - dis 
        spring.FntoChange1(dis*1.71,30)
    }
    Tx_TH.moveDis = function(pos){
        Tx_TH.setPosition(pos)
    }
    Tx_TH.removeItem = function(){
        if(Tx_TH.haveItem){
            var pos = getWorldPos(Tx_TH.haveItem)
            safeAdd(Tx_TH.haveItem.prePar,Tx_TH.haveItem)
            Tx_TH.haveItem.setPosition(pos)
            Tx_TH.haveItem.setScale(1)
            Tx_TH.setPositionX(Tx_TH.haveItem.x+Tx_TH.haveItem.width)
            Tx_TH.hand1.isMove = true
            Tx_TH.haveItem.IsMove = true
            if(Tx_TH.haveItem.tonor){
                    Tx_TH.haveItem.setTexture(Tx_TH.haveItem.tonor)
            }
            Tx_TH.haveItem = null
        }
    }
    Tx_TH.addItem = function(item){
        safeAdd(itemNode,item)
        Tx_TH.haveItem = item
        item.newFather = itemNode
    }

    return Tx_TH
}

//创建平板弹簧测力计
var createPBTH = function(data){
    var data = data || {}
    var layer = data.layer
    var moveFun = data.moveFun
    var pos = data.pos || getMiddle()
    var bg = new cc.Sprite("#th_bg.png")
    bg.setPosition(pos)
    if(layer)
        layer.addChild(bg)
    bg.xishu = 55
    bg.overFn = 275
    if(bg)
        bg.moveFun = moveFun

    var Tx_TH = new cc.Node()
    Tx_TH.setPosition(bg.width/2,bg.height/2)
    bg.addChild(Tx_TH)
    Tx_TH.initY = Tx_TH.getPositionY()

    var hand1 = new cc.Sprite("#hand1.png")
    hand1.setPosition(67,270)
    Tx_TH.addChild(hand1)
    bg.hand1 = hand1
    hand1.deltaAll = 0
    hand1.grandFather = bg

    var thbg = new cc.Sprite("#thbg.png")
    Tx_TH.addChild(thbg)

    var hand2 = new cc.Sprite("#hand2.png")
    hand2.setPosition(92,265)
    Tx_TH.addChild(hand2)

    var thss = new cc.Sprite("#thss.png")
    thss.setPosition(-0.62,101.38)
    Tx_TH.addChild(thss)

    var thds = new cc.Sprite("#thds.png")
    thds.setPosition(0.08,-65.62)
    Tx_TH.addChild(thds)

    var thds = new cc.Sprite("#thds.png")
    thds.setPosition(0.08,-65.62)
    Tx_TH.addChild(thds)

    var th5 = new cc.Sprite("#th5.png")
    th5.setPosition(1.93,-255.40)
    Tx_TH.addChild(th5)


    var spring = createSpring({
                    num:14,
                    behPos:cc.p(51,0),
                    segDis:-12,
                    startPos:cc.p(23,2),
                    showstart:false,
                    behandimg1:res.tanbeh4,
                    behandimg2:res.tanbeh3,
                    preforimg1:res.tanpre4,
                    preforimg2:res.tanpre3
                 })
    spring.setScale(0.5,0.4)
    spring.setPosition(11,200)
    spring.startX = spring.x
    Tx_TH.addChild(spring)

    var thg = new cc.Sprite("#thg.png")
    thg.setAnchorPoint(0.58,0.5)
    thg.setPosition(bg.width/2+1.06,bg.height/2-93.2)
    bg.addChild(thg)

    var gouHide = new cc.Sprite("#yt_th3.png")
    gouHide.setPosition(31.9,27.37)
    thg.addChild(gouHide)
    gouHide.setLocalZOrder(10)
    bg.gouHide = gouHide

    var itemNode = new cc.Node()
    itemNode.setPosition(31,14)
    thg.addChild(itemNode,1)
    bg.itemNode = itemNode

    var th3 = new cc.Sprite(res.th3)
    th3.setPosition(1.7,205)
    th3.setScale(0.8)
    Tx_TH.addChild(th3)

    var th4 = new cc.Sprite(res.th4)
    th4.setPosition(35.7,445)
    thg.addChild(th4)
    hand1.deltaAll = 0

    bg.changeItem = function(dis){
        Tx_TH.y = Tx_TH.initY +  dis
        spring.FntoChange1(dis*3.3,30) 
    }
    bg.moveDis = function(pos){
        bg.setPosition(pos)
    }
    bg.removeItem = function(){
        var Tx_TH = bg
        if(Tx_TH.haveItem){
            var pos = getWorldPos(Tx_TH.haveItem)
            safeAdd(Tx_TH.haveItem.prePar,Tx_TH.haveItem)
            Tx_TH.haveItem.setPosition(pos)
            Tx_TH.haveItem.setScale(1)
            Tx_TH.setPositionX(Tx_TH.haveItem.x+Tx_TH.haveItem.width)
            Tx_TH.hand1.isMove = true
            Tx_TH.haveItem.IsMove = true
            if(Tx_TH.haveItem.tonor){
                Tx_TH.haveItem.setTexture(Tx_TH.haveItem.tonor)
            }
            Tx_TH.haveItem = null
        }
    }
    bg.addItem = function(item){
        safeAdd(itemNode,item)
        bg.haveItem = item
        item.newFather = itemNode
    }
    return bg
}
var myExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "myExp2",
    preLayer: "seeLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
            loadPlist("allTh")
            loadPlist("TH")
        })
        this._super()
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
                      inputNum:15
                    })
                    self.addChild(bgg)
                    self.bggg = bgg
                    var keys = [0.1,2,null,5.9,9.8]
                    bgg.upLoadFun = function(){
                        for (var i = 0; i < 5; i++) {
                            var item = bgg[sprintf("input%d", i + 1)]
                            var result = item.getStr()
                            if(keys[i]!=null){
                                if(result==keys[i]){
                                    item.setAnswer(true)
                                }else{
                                    item.setAnswer(false)
                                }
                            }else{
                                if(result>=2.4 && result<=2.5){
                                    item.setAnswer(true)
                                }else{
                                    item.setAnswer(false)
                                }
                            }
                        }
                    }
                }
                var bgg = self.bggg
                bgg.show()
            }
        })
        self.addChild(setting)
    },
    initUI:function(){
        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode

        var fdjnode = new cc.Node()
        this.addChild(fdjnode,10)

        var fdj = createFDJ({
            father: fdjnode,
            hidebtn: false,
            rootScale: 0.2,
            getPos: [cc.p(0, -400)],
        })
        fdj.see[0].setVisible(false)
        fdj.get[0].setVisible(true)
        fdj.see[0].setScale(0.8)
        self.curTh = null
        fdj.actMove({
            judgeGet: function(data) {
                var index = data.index
                var item = data.item
                var delta = data.delta
                var pos = item.y + delta.y
                if(self.curTh==null){
                    return null
                }
                var top = self.curTh.y + 60
                var bottom = self.curTh.y - 60
                if (pos > top) {
                    pos = top
                }
                if (pos < bottom) {
                    pos = bottom
                }
                delta.x = 0
                delta.y = pos - item.y
                return delta
            }
        })
        
        var wuPos = [cc.p(250,100),cc.p(380,100),cc.p(550,110),cc.p(680,100),cc.p(850,150)]
        var offsets = [cc.p(1,19),cc.p(6,0),cc.p(0.5,1),cc.p(0.5,12),cc.p(4,-56.5)]
        var insets = [cc.p(0,0),cc.p(-12,118),cc.p(2,-15),cc.p(0,-3),cc.p(-8,-38)]
        var Fns = [0.1,2,2.44,5.9,9.8]

        fdj.createNew({
            key:"desk",
            fun:function(){
                var desk = new cc.Sprite(res.desk)
                desk.setPosition(610,74)
                return desk
            }
        })
        self.goods = []
        for (var i = 0; i < 5; i++) {
            var keyName = sprintf("goods%d",i)
            fdj.createNew({
                key:keyName,
                fun:function(){
                    var sp = new cc.Sprite(res[sprintf("bigItem%d",i+1)])
                    sp.setPosition(wuPos[i])

                    var child = new cc.Sprite(res.wu_sel5)
                    child.setPosition(sp.width/2,sp.height-15)
                    child.setScale(0.7)
                    child.setVisible(false)
                    sp.addChild(child)
                    sp.child = child
                    sp.keyName = keyName
                    sp.offset = offsets[i]
                    sp.inset = insets[i]
                    sp.Fn = Fns[i]
                    sp.endPos = wuPos[i]
                    if(i==2){
                        sp.tonor = res.bigItem3
                        sp.tosel = res.bigItem3_1
                    }
                    if(i==4){
                        sp.tonor = res.bigItem5
                        sp.tosel = res.bigItem5_1
                    }

                    return sp
                }
            })
            self.goods[i] = fdj.getOut(keyName)
            var initp = self.goods[i].getPosition()
            fdj.runData({
                    key:keyName,
                    fun:function(data){
                        var item = data.item
                        item.prePar = item.getParent()
                        item.curScale = item.getScale()
                        item.initPos = initp
                    }
                })
        }
        var info = [
            {
                name:"PBTH",
                fun:createPBTH,
                disY:-100,
                dsCha:28
            },
            {
                name:"TXTH",
                fun:createTXTH,
                disY:-100,
                dsCha:23
            },
            {
                name:"YTTH",
                fun:createYTTH,
                disY:-140,
                dsCha:-11
            }
        ]

        var allrun = function(item,pos,isremove,ischange){
            if(item.keyName){
                if(pos)
                    fdj.setGet(pos)
                // if(!fdj.see[0].isVisible()){
                //     fdj.see[0].setVisible(true)
                // }
                fdj.runData({
                    key:item.keyName,
                    fun:function(data){
                        var item = data.item
                        if(pos)
                            item.moveDis(pos)
                        if(isremove == true){
                            item.removeItem()
                        }
                        if(ischange){
                            item.changeItem(ischange)
                        }
                    }
                })
            }
        }
        var allMove = function(item,grand,delta){
            if(grand.haveItem){
                item.deltaAll = item.deltaAll + delta.y/getLoopScale(item)
                if(item.deltaAll>=0 && item.deltaAll<=grand.haveItem.Fn*grand.xishu){
                    if(item.deltaAll>=grand.overFn){
                        item.isMove = true
                        item.deltaAll = grand.overFn
                        allrun(grand,null,false,grand.overFn)
                        self.speakeBykey("tip1",1)
                    }else{
                        allrun(grand,null,false,item.deltaAll)
                    }
                    item.tempDelta = item.deltaAll
                }else if(item.deltaAll<0){
                    item.tempDelta = 0
                    if(item.deltaAll<=-3){
                        var tempx = grand.x + delta.x
                        var tempy = grand.y + delta.y
                        if(grand.haveItem){
                            var pos = getWorldPos(grand.haveItem)
                            var topos = cc.p(pos.x,pos.y+grand.haveItem.height+140)
                            fdj.setGet(topos)
                            fdj.runData({
                                key:grand.keyName,
                                fun:function(data){
                                    var item  = data.item
                                    safeAdd(item.haveItem.prePar,item.haveItem)
                                    item.haveItem.setPosition(pos.x,item.haveItem.initPos.y)
                                    item.haveItem.setScale(item.haveItem.curScale)
                                    item.hand1.isMove = true
                                    item.haveItem.IsMove = true
                                    item.haveItem.newFather = null
                                    item.changeItem(0)
                                    if(item.haveItem&&item.haveItem.tonor){
                                        item.haveItem.setTexture(item.haveItem.tonor)
                                    }
                                    item.setPosition(topos)
                                    item.haveItem = null
                                }
                            }) 
                        }
                    }                     
                }else{
                    item.tempDelta = grand.haveItem.Fn*grand.xishu
                    var tempx = grand.x + delta.x
                    var tempy = grand.y + delta.y
                    if(tempy<grand.limte.y){
                        tempy = grand.limte.y
                    }
                    allrun(grand,cc.p(tempx,tempy),false,item.tempDelta)
                }
            }else{
                var topos = cc.p(grand.x + delta.x,grand.y + delta.y)
                allrun(grand,topos)
                if(grand.moveFun)grand.moveFun(grand)
            }
        }
        var checkAll = function(item){
            for (var i = 0; i < 5; i++) {
                var temp = self.goods[i]
                if(temp){
                    if(judgeItemCrash({item1:temp.child,item2:item.gouHide}))
                    {   
                        
                        if(!item.haveItem && !temp.newFather){
                            if(!temp.inset){
                                temp.inset = cc.p(0,0)
                            }
                            if(!temp.offset){
                                temp.offset = cc.p(0,0)
                            }
                            
                            var pos = cc.p(temp.x,temp.y+77+temp.height/2 + item.dsCha)
                            fdj.setGet(pos)
                            fdj.runData({
                                key:item.keyName,
                                fun:function(data){
                                    var item = data.item
                                    item.hand1.isMove = true
                                    item.setPosition(pos)
                                    item.limte = pos
                                }
                            })

                            fdj.getOut(item.keyName).addItem(temp)
                            fdj.getIn(item.keyName).addItem(fdj.getIn(temp.keyName))
                            var curscale = 1/getLoopScale(temp)
                            var itempos = cc.p(0,-temp.height*curscale/2)
                            fdj.runData({
                                key:item.keyName,
                                fun:function(data){
                                    var item = data.item
                                    if(item.haveItem){
                                        item.haveItem.setPosition(itempos)
                                        item.haveItem.setLocalZOrder(1)
                                        item.haveItem.setScale(curscale)
                                        if(item.haveItem.tosel){
                                            item.haveItem.setTexture(item.haveItem.tosel)
                                        }
                                    }
                                }
                            })                                             
                        }
                        break
                    }  
                }
            }
        }
        this.toolbtn = createTool({
            pos:cc.p(80, 513),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.4, 1.23),
            itempos:cc.p(1, -13),
            circlepos:cc.p(0,10),
            showTime:0.3,
            moveTime:0.2,
            scale:0.9,
            itemScale:0.8,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                var pos = data.pos
                fdj.createNew({
                    key:info[index].name,
                    fun:function(){
                        var node = info[index].fun({
                            pos:pos,
                            moveFun:function(item){
                                checkAll(item)
                            }
                        })
                        node.setScale(0.35)
                        return node
                    }
                })
                item = fdj.getOut(info[index].name)
                item.keyName = info[index].name
                item.dsCha = info[index].dsCha
                item.nopos = true
                item.setPosition(pos.x-20,pos.y+info[index].disY)
                item.hand1.tempDelta = 0
                self.curTh = item 
                return item
            },
            clickfun:function(data){
                var item = data.sp
                item.data = data
                data.item = item
                if(item.IsMove){
                  return false
                }
                item.setLocalZOrder(LOCAL_ORDER++)
                return true
            },
            movefun:function(data){
                var grand = data.sp
                var delta = data.delta
                var item = grand.hand1
                if(!item.isMove){
                    allMove(item,grand,delta)
                }
            },
            outfun:function(data){
                var all = data.sp
                var item = all.hand1
                item.isMove = false
                item.deltaAll = item.tempDelta
                if(all.haveItem){
                    fdj.setGet(cc.p(all.x,all.limte.y))
                    fdj.runData({
                        key:all.keyName,
                        fun:function(data){
                            var item = data.item
                            item.y = item.limte.y
                        }
                    })
                }      
                if(!all.addTouch){
                    all.addTouch = true
                    all.removeListen()
                    createTouchEvent({
                        item:all.hand1,
                        begin:function(data){
                            var item = data.item
                            item.tempDelta = 0
                            self.curTh = item.grandFather
                            return true
                        },
                        move:function(data){
                            var item = data.item
                            var delta = data.delta
                            var grand = item.grandFather
                            if(!item.isMove){
                                allMove(item,grand,delta)
                            }
                        },
                        end:function(data){
                            var item = data.item
                            item.isMove = false
                            item.deltaAll = item.tempDelta
                            var grand = item.grandFather
                            if(grand.haveItem){
                                fdj.setGet(cc.p(grand.x,grand.limte.y))
                                fdj.runData({
                                    key:grand.keyName,
                                    fun:function(data){
                                        var item = data.item
                                        item.y = item.limte.y
                                    }
                                })
                            }
                        }
                    })
                }
            },
            backfun:function(data){
                return false
            },
            counts:[1,1,1],
            father:toolnode,
            files:[res.item1,res.item2,res.item3],
            gets:[null,null,null]
        })
        this.addChild(this.toolbtn,3)
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
                        modify:cc.p(12,0),
                        confirmBtn: true,
                        father: self
                  })
        }       
    },
    expMyEnter: function() {
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
                self.speakeBykey("wenzi1")
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
    }  
})