//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           
        })
        this._super()
        var self = this
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this

        var jielunbtn = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        jielunbtn.setPosition(1040,450)
        self.addChild(jielunbtn)
        jielunbtn.setVisible(false)
        jielunbtn.addClickEventListener(function(){
            self.nodebs.say({
                    key: "jl2",
                })
        })

        var guNode = new cc.Sprite(res.gu1)
        guNode.setPosition(430,320)
        self.addChild(guNode)

        var iphone = new cc.Sprite(res.gu3)
        iphone.setPosition(296,506)
        iphone.setAnchorPoint(0,1)
        guNode.addChild(iphone)

        var gu1 = new cc.Sprite(res.gu2)
        gu1.setPosition(233.25,245.1)
        guNode.addChild(gu1)

        var boy = new cc.Sprite(res.juboy1)
        boy.setPosition(798,270)
        self.addChild(boy)
        boy.playAc = function(){
            var ac = createAnimation({
                              ifFile:true,
                              frame:"juboy%d",
                              start:1,
                              end:4,
                              time: 0.04
                          })
            boy.runAction(ac)
        }

        var dotip1 = new cc.Sprite(res.dotip1)
        dotip1.setPosition(200,430)
        self.addChild(dotip1)

        var dotip2 = new cc.Sprite(res.dotip2)
        dotip2.setPosition(200,380)
        self.addChild(dotip2)
        dotip2.setVisible(false)
        dotip1.setVisible(false)

        iphone.doing = false
        iphone.duang = false
        iphone.playAc = function(){
            iphone.doing = true
            stopEffect()
            iphone.runAction(cc.repeatForever(cc.sequence(
                cc.callFunc(function(){
                    if(iphone.duang){
                        stopEffect()
                        playEffect(res.mdmp2)
                    }
                }),
                cc.rotateTo(0.7,39).easing(cc.easeOut(0.7)),
                cc.rotateTo(0.7,78).easing(cc.easeIn(0.7)),
                cc.callFunc(function(){
                    if(iphone.duang){
                        stopEffect()
                        playEffect(res.mdmp3)
                        iphone.showJl()
                    }
                }),
                cc.rotateTo(0.7,39).easing(cc.easeOut(0.7)),
                cc.rotateTo(0.7,0).easing(cc.easeIn(0.7))
            )))
            boy.playAc()
        }
        iphone.bdcount = 0
        iphone.showJl = function(){
            if(iphone.bdcount<=3){
                iphone.bdcount++
                if(iphone.bdcount==3){
                    jielunbtn.setVisible(true)
                }
            }
        }
        iphone.stopAc = function(){
            iphone.stopAllActions()
            iphone.setRotation(0)
            iphone.doing = false
            boy.stopAllActions()
            boy.setTexture(res.juboy1)
            stopEffect()
        }


        var startVedio = new ccui.Button(res.dostart_nor,res.dostart_sel)
        var stopVedio = new ccui.Button(res.dostop_nor,res.dostop_sel)
        startVedio.setPosition(150,180)
        self.addChild(startVedio)
        startVedio.addClickEventListener(function(){
            iphone.duang = true
            startVedio.setVisible(false)
            stopVedio.setVisible(true)
            if(iphone.doing){
               dotip2.setVisible(true)
               dotip1.setVisible(false)
            }else{
                dotip1.setVisible(true)
                playEffect(res.mdmp1,true)
                dotip2.setVisible(false) 
            }
        })
        stopVedio.setPosition(150,180)
        self.addChild(stopVedio)
        stopVedio.setVisible(false)
        stopVedio.addClickEventListener(function(){
            iphone.duang = false
            stopVedio.setVisible(false)
            startVedio.setVisible(true)
            if(iphone.doing){
                stopEffect()
               dotip2.setVisible(false)
               dotip1.setVisible(false)
            }else{
               stopEffect()
               dotip2.setVisible(false)
               dotip1.setVisible(false) 
            }
        })

        var startdb = new ccui.Button(res.dobd_nor,res.dobd_sel)
        var stopdb = new ccui.Button(res.dosbd_nor,res.dosbd_sel)
        startdb.setPosition(150,120)
        self.addChild(startdb)
        startdb.addClickEventListener(function(){
            iphone.playAc()
            startdb.setVisible(false)
            stopdb.setVisible(true)
            if(iphone.duang){
                dotip2.setVisible(true)
                dotip1.setVisible(false)  
            }else{
                dotip2.setVisible(false)
                dotip1.setVisible(false)
            }
        })

        stopdb.setPosition(150,120)
        self.addChild(stopdb)
        stopdb.setVisible(false)
        stopdb.addClickEventListener(function(){
            iphone.stopAc()
            startdb.setVisible(true)
            stopdb.setVisible(false)
            if(iphone.duang){
                dotip2.setVisible(false)
                dotip1.setVisible(true)  
            }else{
                dotip2.setVisible(false)
                dotip1.setVisible(false)
            }
        })

    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.speakeBykey("wenzi3")
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
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })
        addContent({
           people: this.nodebs,
           key: "jl2",
           img:res.jl2,
           id:"result",
           sound: res.jlmp2,
           offset: cc.p(17,20),
           offbg: cc.p(25,30),
        })
    }  
})